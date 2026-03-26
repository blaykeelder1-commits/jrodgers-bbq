/**
 * Cron job: push deferred orders to EPOS Now.
 * Runs every 5 minutes via Vercel Cron.
 *
 * Searches Square for orders with epos_push_at metadata where current time >= epos_push_at
 * and epos_sent is not "true". Pushes each to EPOS Now and marks epos_sent: "true".
 */
import { pushToEposNow } from '../lib/eposnow.js';

export default async function handler(req, res) {
  // Vercel Cron sends GET requests; also allow POST for manual triggers
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret in production to prevent unauthorized triggers
  if (process.env.CRON_SECRET && req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { SquareClient, SquareEnvironment } = await import('square');
  const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Production
  });

  const now = new Date();
  console.log(`[cron/push-orders] Running at ${now.toISOString()}`);

  try {
    // Search for recent orders (last 24 hours) that might need EPOS push
    const searchStart = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const searchResponse = await client.orders.search({
      locationIds: [process.env.SQUARE_LOCATION_ID],
      query: {
        filter: {
          dateTimeFilter: {
            createdAt: { startAt: searchStart }
          },
          stateFilter: { states: ['OPEN', 'COMPLETED'] }
        },
        sort: { sortField: 'CREATED_AT', sortOrder: 'DESC' }
      },
      limit: 50
    });

    const orders = searchResponse.orders || [];
    console.log(`[cron/push-orders] Found ${orders.length} recent orders`);

    let pushed = 0;
    let skipped = 0;
    const errors = [];

    for (const order of orders) {
      const meta = order.metadata || {};

      // Skip orders without deferred EPOS push
      if (!meta.epos_push_at) {
        skipped++;
        continue;
      }

      // Skip orders already sent to EPOS
      if (meta.epos_sent === 'true') {
        skipped++;
        continue;
      }

      // Check if it's time to push
      const pushAt = new Date(meta.epos_push_at);
      if (now < pushAt) {
        console.log(`[cron/push-orders] Order ${order.id} — not yet time (push at ${meta.epos_push_at})`);
        skipped++;
        continue;
      }

      console.log(`[cron/push-orders] Pushing order ${order.id} to EPOS (was deferred until ${meta.epos_push_at})`);

      try {
        // Rebuild line items with itemId and selectedSize from metadata
        const sizeMap = { 'S': 'Small', 'M': 'Medium', 'L': 'Large' };
        let parsedItemIds = [];
        let itemIdStr = '';
        for (let i = 0; ; i++) {
          const chunk = meta[`item_ids_${i}`];
          if (!chunk) break;
          itemIdStr += chunk;
        }
        if (itemIdStr) {
          parsedItemIds = itemIdStr.split(',').map(part => {
            const [id, sizeChar] = part.split(':');
            return { itemId: id === '?' ? null : id, selectedSize: sizeMap[sizeChar] || null };
          });
        }

        const lineItems = (order.lineItems || []).map((li, index) => ({
          name: li.name,
          quantity: Number(li.quantity),
          unitPriceCents: Number(li.basePriceMoney?.amount || 0),
          total: `$${(Number(li.totalMoney?.amount || 0) / 100).toFixed(2)}`,
          itemId: parsedItemIds[index]?.itemId || null,
          selectedSize: parsedItemIds[index]?.selectedSize || null
        }));

        const totalCents = Number(order.totalMoney?.amount || 0);

        const posResult = await pushToEposNow({
          customerName: meta.customer_name || 'Unknown',
          pickupTime: meta.pickup_time || 'ASAP',
          orderType: meta.order_type || 'pickup',
          lineItems,
          totalCents
        });

        console.log(`[cron/push-orders] EPOS result for ${order.id}:`, JSON.stringify(posResult));

        // Mark as sent in Square metadata
        const freshOrder = (await client.orders.get({ orderId: order.id })).order;
        await client.orders.update({
          orderId: order.id,
          order: {
            locationId: process.env.SQUARE_LOCATION_ID,
            metadata: { ...freshOrder.metadata, epos_sent: 'true' },
            version: freshOrder.version
          }
        });

        pushed++;
      } catch (orderErr) {
        console.error(`[cron/push-orders] Error pushing order ${order.id}:`, orderErr.message);
        errors.push({ orderId: order.id, error: orderErr.message });
      }
    }

    console.log(`[cron/push-orders] Done: ${pushed} pushed, ${skipped} skipped, ${errors.length} errors`);
    return res.status(200).json({ ok: true, pushed, skipped, errors });
  } catch (err) {
    console.error('[cron/push-orders] Fatal error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
