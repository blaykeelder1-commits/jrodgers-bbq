/**
 * Square webhook handler — triggered on payment.completed events.
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
    } else {
      console.warn('[webhook] SQUARE_WEBHOOK_SIGNATURE_KEY not set — skipping verification');
    }

    // Only handle payment.completed events
    if (body.type !== 'payment.completed') {
      return res.status(200).json({ ok: true, skipped: body.type });
    }

    const payment = body.data?.object?.payment;
    if (!payment?.orderId) {
      console.error('[webhook] No orderId in payment event');
      return res.status(200).json({ ok: true, error: 'no orderId' });
    }

    console.log(`[webhook] Processing payment ${payment.id} for order ${payment.orderId}`);

    // Fetch full order from Square
    const { SquareClient, SquareEnvironment } = await import('square');
    const client = new SquareClient({
      token: process.env.SQUARE_ACCESS_TOKEN,
      environment: SquareEnvironment.Production
    });

    const orderResponse = await client.orders.get({
      orderId: payment.orderId
    });
    const order = orderResponse.order;

    if (!order) {
      console.error('[webhook] Order not found:', payment.orderId);
      return res.status(200).json({ ok: true, error: 'order not found' });
    }

    // Extract customer info from metadata (preferred) or parse from note
    const customerInfo = extractCustomerInfo(order);

    // Build line items for email/POS
    const lineItems = (order.lineItems || []).map(li => ({
      name: li.name,
      quantity: Number(li.quantity),
      unitPriceCents: Number(li.basePriceMoney?.amount || 0),
      total: `$${(Number(li.totalMoney?.amount || 0) / 100).toFixed(2)}`
    }));

    const totalCents = Number(order.totalMoney?.amount || 0);
    const totalDisplay = `$${(totalCents / 100).toFixed(2)}`;

    // Fan out: email + POS push in parallel
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
