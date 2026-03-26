/**
 * Square webhook handler — triggered on payment.updated events.
 * Orchestrates: fetch order → email customer + restaurant → push to Epos Now.
 */
import { createHmac } from 'crypto';
import { sendOrderEmails } from '../lib/email.js';
import { pushToEposNow } from '../lib/eposnow.js';

// Disable Vercel body parser so we can verify the webhook signature
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Read raw body for signature verification
    const rawBody = await getRawBody(req);
    const body = JSON.parse(rawBody);

    // Verify webhook signature
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    if (signatureKey) {
      const signature = req.headers['x-square-hmacsha256-signature'];
      const webhookUrl = `${process.env.SITE_URL || 'https://jrodgersbbq.net'}/api/webhooks/square`;
      const expected = createHmac('sha256', signatureKey)
        .update(webhookUrl + rawBody)
        .digest('base64');

      if (signature !== expected) {
        console.error('[webhook] Invalid signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    } else if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
      console.error('[webhook] SQUARE_WEBHOOK_SIGNATURE_KEY not set in production — rejecting');
      return res.status(401).json({ error: 'Webhook verification not configured' });
    } else {
      console.warn('[webhook] SQUARE_WEBHOOK_SIGNATURE_KEY not set — skipping verification (dev)');
    }

    // Only handle payment.updated events (Square sends this when payment completes)
    if (body.type !== 'payment.updated') {
      return res.status(200).json({ ok: true, skipped: body.type });
    }

    // Ensure the payment actually completed (not just any status update)
    const payment = body.data?.object?.payment;
    if (!payment || payment.status !== 'COMPLETED') {
      return res.status(200).json({ ok: true, skipped: 'not completed' });
    }

    const orderId = payment.order_id || payment.orderId;
    if (!orderId) {
      console.error('[webhook] No orderId in payment event');
      return res.status(200).json({ ok: true, error: 'no orderId' });
    }

    console.log(`[webhook] Processing payment ${payment.id} for order ${orderId}`);

    // Fetch full order from Square
    const { SquareClient, SquareEnvironment } = await import('square');
    const client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment: SquareEnvironment.Production
    });

    const orderResponse = await client.orders.get({
      orderId
    });
    const order = orderResponse.order;

    if (!order) {
      console.error('[webhook] Order not found:', orderId);
      return res.status(200).json({ ok: true, error: 'order not found' });
    }

    // Idempotency: skip if we already processed this order
    if (order.metadata?.emails_sent === 'true') {
      console.log(`[webhook] Already processed order ${orderId} — skipping`);
      return res.status(200).json({ ok: true, skipped: 'already processed' });
    }

    // Mark order as processed to prevent duplicate emails
    try {
      await client.orders.update({
        orderId,
        order: {
          locationId: process.env.SQUARE_LOCATION_ID,
          metadata: { ...order.metadata, emails_sent: 'true' },
          version: order.version
        }
      });
    } catch (updateErr) {
      // If update fails due to version conflict, another instance already processed it
      console.warn('[webhook] Order update conflict — likely already processed:', updateErr.message);
      return res.status(200).json({ ok: true, skipped: 'concurrent processing' });
    }

    // Extract customer info from metadata (preferred) or parse from note
    const customerInfo = extractCustomerInfo(order);

    // Parse item ID mapping from metadata (for EPOS product resolution)
    // Format: compact string "itemId:S,itemId,itemId:M" split across item_ids_0, item_ids_1, etc.
    const sizeMap = { 'S': 'Small', 'M': 'Medium', 'L': 'Large' };
    let parsedItemIds = [];
    try {
      let itemIdStr = '';
      for (let i = 0; ; i++) {
        const chunk = order.metadata?.[`item_ids_${i}`];
        if (!chunk) break;
        itemIdStr += chunk;
      }
      if (itemIdStr) {
        parsedItemIds = itemIdStr.split(',').map(part => {
          const [id, sizeChar] = part.split(':');
          return { itemId: id === '?' ? null : id, selectedSize: sizeMap[sizeChar] || null };
        });
      }
    } catch { /* ignore parse errors */ }

    // Build line items for email/POS
    const lineItems = (order.lineItems || []).map((li, index) => ({
      name: li.name,
      quantity: Number(li.quantity),
      unitPriceCents: Number(li.basePriceMoney?.amount || 0),
      total: `$${(Number(li.totalMoney?.amount || 0) / 100).toFixed(2)}`,
      itemId: parsedItemIds[index]?.itemId || null,
      selectedSize: parsedItemIds[index]?.selectedSize || null
    }));

    const totalCents = Number(order.totalMoney?.amount || 0);
    const totalDisplay = `$${(totalCents / 100).toFixed(2)}`;

    // Fan out: email + POS push in parallel (always push immediately)
    const [emailResult, posResult] = await Promise.allSettled([
      sendOrderEmails({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        pickupTime: customerInfo.pickupTime,
        orderType: customerInfo.orderType,
        lineItems,
        totalDisplay
      }),
      pushToEposNow({
        customerName: customerInfo.name,
        pickupTime: customerInfo.pickupTime,
        orderType: customerInfo.orderType,
        lineItems,
        totalCents
      })
    ]);

    console.log('[webhook] Email result:', emailResult.status, emailResult.status === 'fulfilled' ? JSON.stringify(emailResult.value) : emailResult.reason?.message);
    console.log('[webhook] POS result:', posResult.status, posResult.status === 'fulfilled' ? JSON.stringify(posResult.value) : posResult.reason?.message);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[webhook] Error:', err.message || err);
    // Return 200 to prevent Square from retrying on app errors
    return res.status(200).json({ ok: true, error: err.message });
  }
}

/**
 * Parse a pickup time string like "3:00 PM" or "5:30 PM (Wed, Mar 27)" into a Date.
 */
function parsePickupTime(pickupStr) {
  if (!pickupStr || pickupStr === 'ASAP') return null;
  const now = new Date();
  const match = pickupStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return null;
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours !== 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  // Check if there's a date part like "(Wed, Mar 27)"
  const dateMatch = pickupStr.match(/\(.*?(\w+)\s+(\d+)\)/);
  let pickupDate;
  if (dateMatch) {
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const month = monthNames.indexOf(dateMatch[1]);
    const day = parseInt(dateMatch[2]);
    pickupDate = new Date(now.getFullYear(), month, day, hours, minutes, 0);
  } else {
    pickupDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    // If the time has already passed today, it's probably for tomorrow
    if (pickupDate < now) pickupDate.setDate(pickupDate.getDate() + 1);
  }
  return pickupDate;
}

/**
 * Extract customer info from order metadata or parse from note field.
 */
function extractCustomerInfo(order) {
  // Prefer structured metadata
  if (order.metadata?.customer_name) {
    return {
      name: order.metadata.customer_name,
      phone: order.metadata.customer_phone || '',
      email: order.metadata.customer_email || '',
      pickupTime: order.metadata.pickup_time || 'ASAP',
      orderType: order.metadata.order_type || 'pickup'
    };
  }

  // Fallback: parse pipe-delimited note field
  // Format: "Customer: Name | Phone: XXX | Email: XXX | Pickup: XXX | Type: XXX"
  const note = order.note || '';
  const parts = {};
  for (const segment of note.split('|')) {
    const [key, ...rest] = segment.split(':');
    if (key && rest.length) {
      parts[key.trim().toLowerCase()] = rest.join(':').trim();
    }
  }

  return {
    name: parts['customer'] || 'Unknown',
    phone: parts['phone'] || '',
    email: parts['email'] || '',
    pickupTime: parts['pickup'] || 'ASAP',
    orderType: parts['type'] || 'pickup'
  };
}

/**
 * Read raw request body as a string.
 */
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
