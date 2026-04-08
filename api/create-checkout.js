export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { SquareClient, SquareEnvironment } = await import('square');
    const { randomUUID } = await import('crypto');

    const client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment: SquareEnvironment.Production
    });

    const { items, customerInfo, pickupTime, orderType, subtotal } = req.body;

    if (!items || !items.length || !customerInfo?.name || !customerInfo?.phone) {
      return res.status(400).json({ error: 'Missing required order information' });
    }

    // Format phone to E.164 (+1XXXXXXXXXX)
    const formatPhone = (phone) => {
      const digits = phone.replace(/\D/g, '');
      if (digits.length === 10) return `+1${digits}`;
      if (digits.length === 11 && digits[0] === '1') return `+${digits}`;
      return null;
    };

    // Build line items for Square and EPOS metadata in a single pass.
    // Side/meat selections are encoded in each item's display name
    // (e.g., "Rib Dinner (Sides: Yo-Jo Beans, Cole Slaw)") — EPOS parses them from there.
    const lineItems = [];
    const itemIdParts = [];

    for (const item of items) {
      let displayName = item.name;
      const details = [];
      if (item.selectedMeats && item.selectedMeats.length) {
        details.push(`Meats: ${item.selectedMeats.join(', ')}`);
      }
      if (item.selectedSides && item.selectedSides.length) {
        details.push(`Sides: ${item.selectedSides.join(', ')}`);
      }
      if (item.specialInstructions) {
        details.push(`Note: ${item.specialInstructions}`);
      }
      if (details.length) {
        displayName += ` (${details.join(' | ')})`;
      }

      lineItems.push({
        name: displayName,
        quantity: String(item.quantity),
        basePriceMoney: {
          amount: BigInt(Math.round(item.price * 100)),
          currency: 'USD'
        }
      });

      const id = item.itemId || '?';
      const size = item.selectedSize ? `:${item.selectedSize[0]}` : '';
      itemIdParts.push(`${id}${size}`);
    }

    // Add credit card surcharge as a separate line item
    const itemSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const surchargeAmount = Math.round(itemSubtotal * 0.03 * 100);
    if (surchargeAmount > 0) {
      lineItems.push({
        name: 'Credit Card Surcharge (3%)',
        quantity: '1',
        basePriceMoney: {
          amount: BigInt(surchargeAmount),
          currency: 'USD'
        }
      });
    }

    // Build compact item ID string for EPOS integration
    // Format: "itemId:size,itemId:size,..." — fits within Square's 60-char metadata limit
    // Split across multiple metadata keys if needed (item_ids_0, item_ids_1, etc.)
    const itemIdStr = itemIdParts.join(',');
    // Split into 60-char chunks for Square metadata
    const itemIdChunks = {};
    for (let i = 0; i < itemIdStr.length; i += 55) {
      const chunkIndex = Math.floor(i / 55);
      itemIdChunks[`item_ids_${chunkIndex}`] = itemIdStr.substring(i, i + 55);
    }

    // Build note with customer/pickup details
    const note = [
      `Customer: ${customerInfo.name}`,
      `Phone: ${customerInfo.phone}`,
      customerInfo.email ? `Email: ${customerInfo.email}` : null,
      `Pickup: ${pickupTime || 'ASAP'}`,
      `Type: ${orderType || 'pickup'}`
    ].filter(Boolean).join(' | ');

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: randomUUID(),
      order: {
        locationId: process.env.SQUARE_LOCATION_ID,
        lineItems,
        taxes: [
          {
            name: 'Sales Tax',
            percentage: '10',
            scope: 'ORDER'
          }
        ],
        metadata: {
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          customer_email: customerInfo.email || '',
          pickup_time: pickupTime || 'ASAP',
          order_type: orderType || 'pickup',
          ...itemIdChunks
        }
      },
      checkoutOptions: {
        redirectUrl: `${process.env.SITE_URL || 'https://jrodgersbbq.net'}/order-confirmation`,
        askForShippingAddress: false,
        merchantSupportEmail: 'info@jrodgersbbq.com',
        note
      },
      description: 'J Rodgers BBQ & Soul Food - Online Order',
      prePopulatedData: {
        buyerEmail: customerInfo.email || undefined,
        buyerPhoneNumber: formatPhone(customerInfo.phone) || undefined
      }
    });

    const paymentLink = response.paymentLink;

    if (!paymentLink?.url) {
      console.error('Square response missing URL:', JSON.stringify(response, (_, v) => typeof v === 'bigint' ? v.toString() : v));
      return res.status(500).json({
        error: 'No checkout URL returned from Square. Please call us at (251) 675-3282.'
      });
    }

    return res.status(200).json({
      checkoutUrl: paymentLink.url,
      orderId: paymentLink.orderId
    });
  } catch (error) {
    console.error('Square checkout error:', error?.message || error);
    return res.status(500).json({
      error: 'Failed to create checkout. Please try again or call us at (251) 675-3282.'
    });
  }
}
