const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const URL = 'https://api.eposnowhq.com';

async function get(path) {
  const resp = await fetch(URL + path, { headers: { 'Authorization': 'Basic ' + API_KEY } });
  return { status: resp.status, data: await resp.text() };
}

async function main() {
  // Check every possible print/notification endpoint
  const endpoints = [
    '/api/v4/LocalMessagingConfiguration',
    '/api/V2/Printer',
    '/api/V2/PrinterCollection',
    '/api/V2/Receipt',
    '/api/V2/OrderedTransaction',
    '/api/V2/CompleteTransaction',
    '/api/V2/Transaction/Print',
    '/api/v4/Webhook',
    '/api/V2/Device/100304/Print',
    '/api/V2/KitchenOrder',
  ];

  for (const ep of endpoints) {
    const r = await get(ep);
    console.log(`GET ${ep} — ${r.status}`);
    if (r.status === 200) console.log('  Response:', r.data.substring(0, 200));
  }

  // Try V2 CompleteTransaction POST (different auth gateway)
  console.log('\n=== Try POST /api/V2/CompleteTransaction ===');
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow).toISOString().replace('Z', '');
  
  const body = {
    DeviceId: 100304,
    StaffId: 206697,
    DateTime: ctDate,
    EatOut: 1,
    TransactionLines: [{
      ProductId: 39332879,
      Quantity: 1,
      Notes: 'ONLINE ORDER | PRINT TEST'
    }],
    TenderLines: [{
      TenderTypeId: 130092,
      Amount: 0.01
    }]
  };

  const resp = await fetch(URL + '/api/V2/CompleteTransaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  console.log('Status:', resp.status);
  console.log('Response:', (await resp.text()).substring(0, 500));

  // Try V2 OrderedTransaction POST
  console.log('\n=== Try POST /api/V2/OrderedTransaction ===');
  const orderedBody = {
    DeviceId: 100304,
    StaffId: 206697,
    DateTime: ctDate,
    EatOut: 1,
    TransactionLines: [{
      ProductId: 39332879,
      Quantity: 1,
      Notes: 'ONLINE ORDER | ORDERED TX TEST'
    }]
  };

  const resp2 = await fetch(URL + '/api/V2/OrderedTransaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(orderedBody)
  });
  console.log('Status:', resp2.status);
  console.log('Response:', (await resp2.text()).substring(0, 500));
}

main().catch(e => console.error(e));
