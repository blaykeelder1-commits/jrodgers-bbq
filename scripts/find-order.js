/**
 * Find lost customer orders from Square.
 *
 * Usage:
 *   SQUARE_ACCESS_TOKEN=xxx SQUARE_LOCATION_ID=yyy node scripts/find-order.js
 *   SQUARE_ACCESS_TOKEN=xxx SQUARE_LOCATION_ID=yyy node scripts/find-order.js "customer name"
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

  const searchFilter = process.argv[2]?.toLowerCase();

  // Search orders from the last 30 days
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const response = await client.orders.search({
    locationIds: [locationId],
    query: {
      filter: {
        dateTimeFilter: {
          createdAt: { startAt: since.toISOString() }
        },
        stateFilter: { states: ['COMPLETED'] }
      },
      sort: { sortField: 'CREATED_AT', sortOrder: 'DESC' }
    }
  });

  const orders = response.orders || [];

  if (!orders.length) {
    console.log('No completed orders found in the last 30 days.');
    return;
  }

  console.log(`Found ${orders.length} completed order(s):\n`);

  for (const order of orders) {
    const note = order.note || order.metadata?.customer_name || '(no note)';

    // If a search filter was provided, skip non-matching orders
    if (searchFilter && !note.toLowerCase().includes(searchFilter)) continue;

    console.log('─'.repeat(60));
    console.log(`Order ID:    ${order.id}`);
    console.log(`Created:     ${order.createdAt}`);
    console.log(`Note:        ${note}`);

    // Parse metadata if present
    if (order.metadata) {
      const m = order.metadata;
      if (m.customer_name)  console.log(`  Name:      ${m.customer_name}`);
      if (m.customer_phone) console.log(`  Phone:     ${m.customer_phone}`);
      if (m.customer_email) console.log(`  Email:     ${m.customer_email}`);
      if (m.pickup_time)    console.log(`  Pickup:    ${m.pickup_time}`);
      if (m.order_type)     console.log(`  Type:      ${m.order_type}`);
    }

    // Print line items
    if (order.lineItems?.length) {
      console.log('  Items:');
      for (const li of order.lineItems) {
        const cents = Number(li.totalMoney?.amount || 0);
        const dollars = (cents / 100).toFixed(2);
        console.log(`    ${li.quantity}x ${li.name} — $${dollars}`);
      }
    }

    // Print totals
    const total = Number(order.totalMoney?.amount || 0);
    console.log(`  Total:     $${(total / 100).toFixed(2)}`);
    console.log();
  }
}

main().catch(err => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
