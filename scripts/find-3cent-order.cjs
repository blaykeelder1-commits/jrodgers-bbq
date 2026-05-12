const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
(async () => {
  // Check EPOS for any $0.03 transactions today
  const resp = await fetch('https://api.eposnowhq.com/api/v4/Transaction/GetLatest', {
    headers: { 'Authorization': 'Basic ' + API_KEY }
  });
  const txns = await resp.json();
  
  console.log('=== Looking for $0.03 transactions ===\n');
  const matches = txns.filter(t => Math.abs(t.TotalAmount - 0.03) < 0.01);
  
  if (matches.length === 0) {
    console.log('NO $0.03 transaction found in EPOS Now.\n');
    console.log('Checking ALL recent API transactions:');
    const apiTxns = txns.filter(t => t.DeviceId === 127821 || t.DeviceId === 100304);
    for (const tx of apiTxns.slice(0, 10)) {
      const ct = new Date(tx.DateTime + 'Z').toLocaleString('en-US', { timeZone: 'America/Chicago' });
      const items = (tx.TransactionItems || []).map(i => `${i.Quantity}x ProdId:${i.ProductId} $${i.UnitPrice.toFixed(2)} [${i.Notes || ''}]`).join(', ');
      console.log(`  ID:${tx.Id} | ${ct} CT | $${tx.TotalAmount.toFixed(2)} | ${items}`);
    }
  } else {
    for (const tx of matches) {
      const ct = new Date(tx.DateTime + 'Z').toLocaleString('en-US', { timeZone: 'America/Chicago' });
      console.log(`FOUND: ID ${tx.Id} | ${ct} CT | $${tx.TotalAmount.toFixed(2)}`);
      for (const item of tx.TransactionItems || []) {
        console.log(`  ${item.Quantity}x ProductId:${item.ProductId} — $${item.UnitPrice.toFixed(2)} | Notes: ${item.Notes || '(none)'}`);
      }
    }
  }

  // Also check Square for the 3-cent order
  console.log('\n=== Checking Square for $0.03 orders ===');
  const { SquareClient, SquareEnvironment } = await import('square');
  const client = new SquareClient({ token: process.env.SQUARE_ACCESS_TOKEN, environment: SquareEnvironment.Production });
  const since = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
  const searchResp = await client.orders.search({
    locationIds: [process.env.SQUARE_LOCATION_ID],
    query: { filter: { dateTimeFilter: { createdAt: { startAt: since } } }, sort: { sortField: 'CREATED_AT', sortOrder: 'DESC' } }
  });
  const orders = searchResp.orders || [];
  for (const o of orders) {
    const total = Number(o.totalMoney?.amount || 0);
    if (total <= 10) { // anything under 10 cents
      const ct = new Date(o.createdAt).toLocaleString('en-US', { timeZone: 'America/Chicago' });
      console.log(`\nSquare Order: ${o.id} | ${ct} CT | $${(total/100).toFixed(2)} | State: ${o.state}`);
      console.log('Metadata:', JSON.stringify(o.metadata || {}));
      for (const li of o.lineItems || []) {
        console.log(`  ${li.quantity}x ${li.name} — $${(Number(li.totalMoney?.amount || 0)/100).toFixed(2)}`);
      }
    }
  }
})();
