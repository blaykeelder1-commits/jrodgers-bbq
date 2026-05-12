async function main() {
  const { SquareClient, SquareEnvironment } = await import('square');
  const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN,
    environment: SquareEnvironment.Production
  });

  const since = new Date();
  since.setHours(since.getHours() - 2);

  const response = await client.orders.search({
    locationIds: [process.env.SQUARE_LOCATION_ID],
    query: {
      filter: {
        dateTimeFilter: {
          createdAt: { startAt: since.toISOString() }
        }
      },
      sort: { sortField: 'CREATED_AT', sortOrder: 'DESC' }
    }
  });

  const orders = response.orders || [];
  if (!orders.length) {
    console.log('No orders found in the last 2 hours.');
    return;
  }

  for (const order of orders) {
    console.log('─'.repeat(60));
    console.log('Order ID:  ' + order.id);
    console.log('State:     ' + order.state);
    console.log('Created:   ' + order.createdAt);
    console.log('Note:      ' + (order.note || '(none)'));
    if (order.metadata) {
      console.log('Metadata:  ' + JSON.stringify(order.metadata));
    }
    if (order.lineItems?.length) {
      for (const li of order.lineItems) {
        const cents = Number(li.totalMoney?.amount || 0);
        console.log('  ' + li.quantity + 'x ' + li.name + ' — $' + (cents/100).toFixed(2));
      }
    }
    const total = Number(order.totalMoney?.amount || 0);
    console.log('Total:     $' + (total / 100).toFixed(2));
    console.log();
  }
}
main().catch(e => console.error(e.message));
