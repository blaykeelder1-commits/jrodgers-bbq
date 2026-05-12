const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const URL = 'https://api.eposnowhq.com';

async function check(method, path, body) {
  const opts = { headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' } };
  if (method === 'POST') opts.method = 'POST';
  if (body) opts.body = JSON.stringify(body);
  const resp = await fetch(URL + path, opts);
  return { status: resp.status, data: await resp.text() };
}

async function main() {
  // Check TablePlan - tables/tabs can hold open orders
  console.log('=== TablePlan (open tabs/orders on tablet) ===');
  let r = await check('GET', '/api/v4/TablePlan');
  console.log('Status:', r.status);
  if (r.status === 200) console.log('Data:', r.data.substring(0, 500));

  // Check if we can create a "held" transaction via V2 that shows on tablet
  console.log('\n=== Try creating a Held transaction via V4 PUT ===');
  // First create a normal transaction
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow).toISOString().replace('Z', '');
  
  const createResp = await fetch(URL + '/api/v4/Transaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      DeviceId: 100304,
      StaffId: 206697,
      DateTime: ctDate,
      StatusId: 1,
      ServiceType: 1,
      TotalAmount: 0.01,
      TransactionItems: [{ ProductId: 39332879, Quantity: 1, UnitPrice: 0.01, Notes: 'ONLINE ORDER | TABLET TEST | Pickup: ASAP' }],
      Tenders: [{ TenderTypeId: 130092, Amount: 0.01 }]
    })
  });
  const txData = await createResp.json();
  console.log('Created tx:', txData.Id);
  
  // Try to update it to Held status (2)
  console.log('\nTrying to PUT StatusId=2 (Held)...');
  const putResp = await fetch(URL + '/api/v4/Transaction/' + txData.Id, {
    method: 'PUT',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ StatusId: 2 })
  });
  console.log('PUT Status:', putResp.status);
  console.log('Response:', (await putResp.text()).substring(0, 300));

  // Check Epos Now notifications API
  console.log('\n=== Check notification endpoints ===');
  const notifEndpoints = [
    '/api/v4/Notification',
    '/api/v4/Message',
    '/api/v4/Alert',
    '/api/v4/PushNotification',
    '/api/V2/Notification',
  ];
  for (const ep of notifEndpoints) {
    const nr = await check('GET', ep);
    console.log(`${ep} — ${nr.status}`);
    if (nr.status === 200) console.log('  Data:', nr.data.substring(0, 200));
  }
}

main().catch(e => console.error(e));
