/**
 * Check latest Square orders from the last 1 hour, ALL states.
 *
 * Usage:
 *   set -a && source .env.production.local && set +a && node scripts/check-latest-order.cjs
 */

async function main() {
  const { SquareClient, SquareEnvironment } = await import('square');

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;

  if (!token || !locationId) {
    console.error('Missing SQUARE_ACCESS_TOKEN or SQUARE_LOCATION_ID');
    process.exit(1);
  }

  const client = new SquareClient({
    token,
    environment: SquareEnvironment.Production
  });

  // Last 1 hour
  const since = new Date();
  since.setHours(since.getHours() - 1);

  console.log(`Searching for orders since ${since.toISOString()} (last 1 hour)...`);
  console.log(`Location ID: ${locationId}\n`);

  const response = await client.orders.search({
    locationIds: [locationId],
    query: {
      filter: {
        dateTimeFilter: {
          createdAt: { startAt: since.toISOString() }
        }
        // No stateFilter = ALL states
      },
      sort: { sortField: 'CREATED_AT', sortOrder: 'DESC' }
    }
  });

  const orders = response.orders || [];

  if (!orders.length) {
    console.log('No orders found in the last 1 hour.');
    return;
  }

  console.log(`Found ${orders.length} order(s):\n`);

  for (const order of orders) {
    console.log('='.repeat(70));
    console.log(`Order ID:     ${order.id}`);
    console.log(`State:        ${order.state}`);
    console.log(`Created:      ${order.createdAt}`);
    console.log(`Note:         ${order.note || '(none)'}`);

    // Full metadata
    if (order.metadata && Object.keys(order.metadata).length > 0) {
      console.log(`Metadata:     ${JSON.stringify(order.metadata, null, 2)}`);

      // Specifically check for compact format keys
      const hasItemIds0 = 'item_ids_0' in order.metadata;
      const hasEmailsSent = 'emails_sent' in order.metadata;
      console.log(`  >> item_ids_0 present:   ${hasItemIds0}${hasItemIds0 ? ' => ' + order.metadata.item_ids_0 : ''}`);
      console.log(`  >> emails_sent present:   ${hasEmailsSent}${hasEmailsSent ? ' => ' + order.metadata.emails_sent : ''}`);
    } else {
      console.log(`Metadata:     (none)`);
      console.log(`  >> item_ids_0 present:   false`);
      console.log(`  >> emails_sent present:   false`);
    }

    // Line items
    if (order.lineItems?.length) {
      console.log(`Line Items:`);
      for (const li of order.lineItems) {
        const cents = Number(li.totalMoney?.amount || 0);
        const dollars = (cents / 100).toFixed(2);
        console.log(`    ${li.quantity}x ${li.name} — $${dollars}`);
      }
    } else {
      console.log(`Line Items:   (none)`);
    }

    // Total
    const total = Number(order.totalMoney?.amount || 0);
    console.log(`Total:        $${(total / 100).toFixed(2)}`);
    console.log();
  }
}

main().catch(err => {
  console.error('Error:', err.message || err);
  if (err.body) console.error('Body:', JSON.stringify(err.body, null, 2));
  process.exit(1);
});
