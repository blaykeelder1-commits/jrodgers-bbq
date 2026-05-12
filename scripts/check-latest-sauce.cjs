const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
(async () => {
  const resp = await fetch('https://api.eposnowhq.com/api/v4/Transaction/GetLatest', {
    headers: { 'Authorization': 'Basic ' + API_KEY }
  });
  const txns = await resp.json();
  const sauceTxns = txns.filter(t => 
    t.TransactionItems?.some(i => i.ProductId === 39332879 || i.ProductId === 39332880)
  );
  
  console.log('BBQ Sauce transactions today:\n');
  for (const tx of sauceTxns) {
    const ctTime = new Date(tx.DateTime + 'Z').toLocaleString('en-US', { timeZone: 'America/Chicago' });
    const notes = tx.TransactionItems?.[0]?.Notes || '(none)';
    console.log(`ID: ${tx.Id} | ${ctTime} CT | $${tx.TotalAmount.toFixed(2)} | Device: ${tx.DeviceId === 100304 ? 'RESTAURANT' : tx.DeviceId === 127821 ? 'API' : tx.DeviceId}`);
    console.log(`  Notes: ${notes}\n`);
  }
  console.log(`Total: ${sauceTxns.length} sauce transactions`);
})();
