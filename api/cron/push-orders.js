/**
 * Cron job: EPOS push safety net for online orders.
 * Runs daily via Vercel Cron (and can be triggered manually).
 *
 * Searches Square for recent orders that were confirmed (emails_sent="true")
 * but may not have been pushed to EPOS. For OPEN orders, pushes to EPOS and
 * updates metadata. For COMPLETED orders (can't update metadata), sends an
 * alert email so staff can verify manually.
 *
 * The webhook handles the primary EPOS push — this cron is the backup.
 */
import { pushToEposNow } from '../lib/eposnow.js';
import { sendEposFailureAlert } from '../lib/email.js';

export default async function handler(req, res) {
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
    // Search for recent orders (last 24 hours)
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

    // Find orders that were processed by webhook but might not have reached EPOS
    const needsAttention = orders.filter(order => {
      const meta = order.metadata || {};
      return meta.emails_sent === 'true' && meta.epos_sent !== 'true';
    });

    console.log(`[cron/push-orders] ${orders.length} recent orders, ${needsAttention.length} may need EPOS attention`);

    if (needsAttention.length === 0) {
      return res.status(200).json({ ok: true, checked: orders.length, issues: 0 });
    }

    let pushed = 0;
    let alerted = 0;
    const results = [];

    for (const order of needsAttention.slice(0, 3)) {
      const meta = order.metadata || {};
      const isOpen = order.state === 'OPEN';

      if (isOpen) {
        // OPEN orders: we can still push AND update metadata
        console.log(`[cron/push-orders] Pushing OPEN order ${order.id}`);

        try {
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

          if (posResult.success || posResult.skipped) {
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
            results.push({ orderId: order.id, status: 'pushed' });
          } else {
            results.push({ orderId: order.id, status: 'epos_error', error: posResult.error });
          }
        } catch (err) {
          console.error(`[cron/push-orders] Error on OPEN order ${order.id}:`, err.message);
          results.push({ orderId: order.id, status: 'error', error: err.message });
        }
      } else {
        // COMPLETED orders: can't update metadata, send alert if not already alerted
        if (meta.epos_sent === 'alerted') {
          console.log(`[cron/push-orders] Already alerted for ${order.id} — skipping`);
          continue;
        }

        console.warn(`[cron/push-orders] COMPLETED order ${order.id} missing EPOS — sending alert`);
        const totalCents = Number(order.totalMoney?.amount || 0);
        const itemNames = (order.lineItems || []).map(li => `${li.quantity}x ${li.name}`).join(', ');

        try {
          await sendEposFailureAlert({
            orderId: order.id,
            customerName: meta.customer_name || 'Unknown',
            customerPhone: meta.customer_phone || '',
            pickupTime: meta.pickup_time || 'ASAP',
            items: itemNames,
            total: `$${(totalCents / 100).toFixed(2)}`,
            retries: 0
          });
          alerted++;
          results.push({ orderId: order.id, status: 'alerted' });
        } catch (alertErr) {
          console.error(`[cron/push-orders] Alert failed for ${order.id}:`, alertErr.message);
          results.push({ orderId: order.id, status: 'alert_failed', error: alertErr.message });
        }
      }
    }

    console.log(`[cron/push-orders] Done: ${pushed} pushed, ${alerted} alerted`);
    return res.status(200).json({ ok: true, pushed, alerted, results });
  } catch (err) {
    console.error('[cron/push-orders] Fatal error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
