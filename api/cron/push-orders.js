/**
 * Cron job: sole EPOS pusher for online orders.
 * Runs on a schedule (external cron or Vercel Cron) and pushes completed
 * Square orders to EPOS Now that haven't been pushed yet.
 *
 * Safety guarantees:
 * - Only processes orders where emails_sent="true" (payment confirmed)
 * - Skips orders where epos_sent="true" (already pushed — no duplicates)
 * - Max 3 orders per run (stays within Vercel 10s timeout)
 * - Retry cap of 5 attempts per order (no infinite loops)
 * - Sends alert email after 5 failures so staff can manually enter the order
 */
import { pushToEposNow } from '../lib/eposnow.js';
import { sendEposFailureAlert } from '../lib/email.js';

const MAX_ORDERS_PER_RUN = 3;
const MAX_RETRIES = 5;

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
    // Search for recent completed orders (last 24 hours)
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

    // Filter to orders that need EPOS push:
    // - emails_sent="true" (payment confirmed, webhook processed)
    // - epos_sent is NOT "true" and NOT "gave_up"
    const needsPush = orders.filter(order => {
      const meta = order.metadata || {};
      return meta.emails_sent === 'true' &&
             meta.epos_sent !== 'true' &&
             meta.epos_sent !== 'gave_up';
    });

    console.log(`[cron/push-orders] ${orders.length} recent orders, ${needsPush.length} need EPOS push`);

    if (needsPush.length === 0) {
      return res.status(200).json({ ok: true, pushed: 0, skipped: orders.length, failed: 0 });
    }

    let pushed = 0;
    let failed = 0;
    let gaveUp = 0;
    const results = [];

    // Process max N orders per run to stay within timeout
    for (const order of needsPush.slice(0, MAX_ORDERS_PER_RUN)) {
      const meta = order.metadata || {};
      const retries = parseInt(meta.epos_retries || '0', 10);

      // If we've hit max retries, give up and alert
      if (retries >= MAX_RETRIES) {
        console.error(`[cron/push-orders] Order ${order.id} failed ${retries} times — giving up and alerting`);

        try {
          // Mark as gave_up
          const freshOrder = (await client.orders.get({ orderId: order.id })).order;
          await client.orders.update({
            orderId: order.id,
            order: {
              locationId: process.env.SQUARE_LOCATION_ID,
              metadata: { ...freshOrder.metadata, epos_sent: 'gave_up' },
              version: freshOrder.version
            }
          });

          // Send alert email to restaurant
          const totalCents = Number(order.totalMoney?.amount || 0);
          const itemNames = (order.lineItems || []).map(li => `${li.quantity}x ${li.name}`).join(', ');
          await sendEposFailureAlert({
            orderId: order.id,
            customerName: meta.customer_name || 'Unknown',
            customerPhone: meta.customer_phone || '',
            pickupTime: meta.pickup_time || 'ASAP',
            items: itemNames,
            total: `$${(totalCents / 100).toFixed(2)}`,
            retries
          });
        } catch (alertErr) {
          console.error(`[cron/push-orders] Failed to send alert for ${order.id}:`, alertErr.message);
        }

        gaveUp++;
        results.push({ orderId: order.id, status: 'gave_up', retries });
        continue;
      }

      console.log(`[cron/push-orders] Pushing order ${order.id} (attempt ${retries + 1}/${MAX_RETRIES})`);

      try {
        // Parse item IDs from metadata
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

        if (posResult.success || posResult.skipped) {
          // Success or intentionally skipped (e.g. no EPOS credentials) — mark as done
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
          // EPOS returned an error — increment retry counter
          const freshOrder = (await client.orders.get({ orderId: order.id })).order;
          await client.orders.update({
            orderId: order.id,
            order: {
              locationId: process.env.SQUARE_LOCATION_ID,
              metadata: { ...freshOrder.metadata, epos_retries: String(retries + 1) },
              version: freshOrder.version
            }
          });
          failed++;
          results.push({ orderId: order.id, status: 'failed', error: posResult.error, attempt: retries + 1 });
        }
      } catch (orderErr) {
        console.error(`[cron/push-orders] Error processing order ${order.id}:`, orderErr.message);
        // Increment retry counter even on unexpected errors
        try {
          const freshOrder = (await client.orders.get({ orderId: order.id })).order;
          await client.orders.update({
            orderId: order.id,
            order: {
              locationId: process.env.SQUARE_LOCATION_ID,
              metadata: { ...freshOrder.metadata, epos_retries: String(retries + 1) },
              version: freshOrder.version
            }
          });
        } catch { /* best effort */ }
        failed++;
        results.push({ orderId: order.id, status: 'error', error: orderErr.message });
      }
    }

    const remaining = Math.max(0, needsPush.length - MAX_ORDERS_PER_RUN);
    console.log(`[cron/push-orders] Done: ${pushed} pushed, ${failed} failed, ${gaveUp} gave_up, ${remaining} remaining`);
    return res.status(200).json({ ok: true, pushed, failed, gaveUp, remaining, results });
  } catch (err) {
    console.error('[cron/push-orders] Fatal error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
