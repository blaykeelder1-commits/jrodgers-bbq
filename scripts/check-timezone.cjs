const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
(async () => {
  // Get the latest API transaction
  const resp = await fetch('https://api.eposnowhq.com/api/v4/Transaction/GetLatest', {
    headers: { 'Authorization': 'Basic ' + API_KEY }
  });
  const txns = await resp.json();
  const apiTxns = txns.filter(t => t.DeviceId === 127821).slice(0, 3);
  
  console.log('=== TIMEZONE CHECK ===');
  console.log('Alabama/Foley is Central Time (CT) = UTC-5 (CDT in March = UTC-5)');
  console.log('Current time UTC:', new Date().toISOString());
  console.log('Current time CT:', new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }));
  console.log('Today should be: 3/26/2026\n');

  for (const tx of apiTxns) {
    const eposDate = new Date(tx.DateTime + 'Z'); // EPOS stores UTC
    const ctTime = eposDate.toLocaleString('en-US', { timeZone: 'America/Chicago' });
    const notes = tx.TransactionItems?.[0]?.Notes || '(none)';
    
    console.log('Transaction:', tx.Id);
    console.log('  EPOS DateTime (raw):', tx.DateTime);
    console.log('  Converted to CT:    ', ctTime);
    console.log('  Notes:', notes);
    console.log();
  }
  
  // Check what time our code sends in the DateTime field
  console.log('=== WHAT OUR CODE SENDS ===');
  console.log('new Date().toISOString():', new Date().toISOString());
  console.log('This is UTC. EPOS Now stores it as-is.');
  console.log('If EPOS displays it as local time, it may show wrong time.');
  console.log();
  
  // The fix: send local CT time instead of UTC
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow);
  console.log('Local CT time string:', ctDate.toISOString().replace('Z', ''));
  console.log('This is what we SHOULD send so EPOS shows the right time on the receipt.');
})();
