const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
(async () => {
  const resp = await fetch('https://api.eposnowhq.com/api/v4/Transaction/GetLatest', {
    headers: { 'Authorization': 'Basic ' + API_KEY }
  });
  const txns = await resp.json();
  // Get the latest API device transaction
  const apiTxn = txns.find(t => t.DeviceId === 127821);
  if (!apiTxn) { console.log('No API transactions found'); return; }
  
  console.log('Transaction ID:', apiTxn.Id);
  console.log('DateTime:', apiTxn.DateTime);
  console.log('Items:');
  for (const item of apiTxn.TransactionItems || []) {
    console.log('  ProductId:', item.ProductId);
    console.log('  Notes:', JSON.stringify(item.Notes));
    console.log('  UnitPrice:', item.UnitPrice);
  }
})();
