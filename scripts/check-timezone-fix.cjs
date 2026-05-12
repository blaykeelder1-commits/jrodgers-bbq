const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
(async () => {
  // Get the latest transactions including the one we just pushed
  const resp = await fetch('https://api.eposnowhq.com/api/v4/Transaction/490626031/true', {
    headers: { 'Authorization': 'Basic ' + API_KEY }
  });
  const tx = await resp.json();
  
  console.log('=== Transaction 490626031 (the replayed 3-cent order) ===');
  console.log('Raw DateTime from EPOS:', tx.DateTime);
  console.log('');
  
  // Now check what our eposnow.js code actually generates
  console.log('=== What our code generates ===');
  
  // This is the exact code from eposnow.js
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow).toISOString().replace('Z', '');
  
  console.log('Current UTC:', new Date().toISOString());
  console.log('Current CT:', ctNow);
  console.log('What we send as DateTime:', ctDate);
  console.log('');
  
  // The problem: toLocaleString returns local-formatted string, 
  // but new Date() parses it back to UTC, so toISOString() gives UTC again
  console.log('=== THE BUG ===');
  console.log('toLocaleString gives:', ctNow);
  console.log('new Date(ctNow) parses to:', new Date(ctNow).toISOString());
  console.log('After .replace("Z",""):', ctDate);
  console.log('');
  
  // What we actually need
  const now = new Date();
  const ctOffset = -5; // CDT is UTC-5 in March (daylight saving)
  const ctTime = new Date(now.getTime() + ctOffset * 60 * 60 * 1000);
  const correctCT = ctTime.toISOString().replace('Z', '');
  console.log('=== CORRECT approach ===');
  console.log('Manual offset CT:', correctCT);
})();
