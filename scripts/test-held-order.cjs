const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const URL = 'https://api.eposnowhq.com';

async function main() {
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow).toISOString().replace('Z', '');

  // Test 1: Create directly with StatusId 2 (Held) — NO tenders (held orders aren't paid yet)
  console.log('=== Test 1: V4 POST StatusId=2, no tenders ===');
  const resp1 = await fetch(URL + '/api/v4/Transaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      DeviceId: 100304,
      StaffId: 206697,
      DateTime: ctDate,
      StatusId: 2,
      ServiceType: 1,
      TotalAmount: 0.01,
      TransactionItems: [{
        ProductId: 39332879,
        Quantity: 1,
        UnitPrice: 0.01,
        Notes: 'ONLINE ORDER | HELD TEST 1 | Pickup: 5:00 PM'
      }]
    })
  });
  console.log('Status:', resp1.status);
  console.log('Response:', (await resp1.text()).substring(0, 500));

  // Test 2: V2 CompleteTransaction without tenders (creates unpaid/partial)
  console.log('\n=== Test 2: V2 CompleteTransaction, no tenders ===');
  const resp2 = await fetch(URL + '/api/V2/CompleteTransaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      DeviceId: 100304,
      StaffId: 206697,
      DateTime: ctDate,
      EatOut: 1,
      TransactionItems: [{
        ProductId: 39332879,
        Quantity: 1,
        UnitPrice: 0.01,
        Notes: 'ONLINE ORDER | HELD TEST 2 | Pickup: 5:00 PM'
      }]
    })
  });
  console.log('Status:', resp2.status);
  const data2 = await resp2.text();
  console.log('Response:', data2.substring(0, 500));

  // Test 3: Create as completed, then try PUT to change to held
  console.log('\n=== Test 3: Create completed V4, then PUT to StatusId=2 with items ===');
  const resp3 = await fetch(URL + '/api/v4/Transaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      DeviceId: 100304,
      StaffId: 206697,
      DateTime: ctDate,
      StatusId: 1,
      ServiceType: 1,
      TotalAmount: 0.01,
      TransactionItems: [{
        ProductId: 39332879,
        Quantity: 1,
        UnitPrice: 0.01,
        Notes: 'ONLINE ORDER | HELD TEST 3 | Pickup: 5:00 PM'
      }],
      Tenders: [{ TenderTypeId: 130092, Amount: 0.01 }]
    })
  });
  const tx3 = await resp3.json();
  console.log('Created:', tx3.Id, '| StatusId:', tx3.StatusId);

  // Now PUT to change status to Held, including the transaction items
  const getResp = await fetch(URL + '/api/v4/Transaction/' + tx3.Id + '/true', {
    headers: { 'Authorization': 'Basic ' + API_KEY }
  });
  const fullTx = await getResp.json();
  
  const putResp = await fetch(URL + '/api/v4/Transaction/' + tx3.Id, {
    method: 'PUT',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      StatusId: 2,
      TransactionItems: fullTx.TransactionItems.map(i => ({
        ProductId: i.ProductId,
        Quantity: i.Quantity,
        UnitPrice: i.UnitPrice
      }))
    })
  });
  console.log('PUT to Held — Status:', putResp.status);
  console.log('Response:', (await putResp.text()).substring(0, 500));

  console.log('\n=== CHECK THE FRONT MACHINE ===');
  console.log('Look in the "Held" or "Parked" orders section on the RESTAURANT till.');
  console.log('If any of these tests show up there, we have our solution.');
}

main().catch(e => console.error(e));
