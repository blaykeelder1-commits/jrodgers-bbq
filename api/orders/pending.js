/**
 * GET /api/orders/pending
 * Returns recent online orders (last 12 hours) that have been processed
 * (emails_sent: "true" in metadata). Used by the kitchen order display.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { SquareClient, SquareEnvironment } = await import('square');

    const client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment: SquareEnvironment.Production,
    });

    const locationId = process.env.SQUARE_LOCATION_ID;

    // Search for orders from the last 12 hours
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    const response = await client.orders.search({
      locationIds: [locationId],
      query: {
        filter: {
          dateTimeFilter: {
            createdAt: {
              startAt: twelveHoursAgo.toISOString(),
            },
          },
          stateFilter: {
            states: ['OPEN', 'COMPLETED'],
          },
        },
        sort: {
          sortField: 'CREATED_AT',
          sortOrder: 'DESC',
        },
      },
    });

    const orders = (response.orders || [])
      // Only include orders that have been fully processed (emails sent)
      .filter((order) => order.metadata?.emails_sent === 'true')
      .map((order) => {
        const customerName = order.metadata?.customer_name || 'Unknown';
        const customerPhone = order.metadata?.customer_phone || '';
        const pickupTime = order.metadata?.pickup_time || 'ASAP';
        const orderType = order.metadata?.order_type || 'pickup';

        const items = (order.lineItems || []).map((li) => ({
          name: li.name,
          quantity: Number(li.quantity),
          price: `$${(Number(li.basePriceMoney?.amount || 0) / 100).toFixed(2)}`,
        }));

        const totalCents = Number(order.totalMoney?.amount || 0);

        return {
          orderId: order.id,
          customerName,
          customerPhone,
          pickupTime,
          orderType,
          items,
          total: `$${(totalCents / 100).toFixed(2)}`,
          createdAt: order.createdAt,
        };
      });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error('[orders/pending] Error:', err.message || err);
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }
}
