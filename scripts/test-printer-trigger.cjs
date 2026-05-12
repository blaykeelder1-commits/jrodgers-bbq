const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const URL = 'https://api.eposnowhq.com';

async function tryTransaction(statusId, label) {
  console.log(`\n=== Testing StatusId ${statusId} (${label}) ===`);
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow).toISOString().replace('Z', '');
  
  const tx = {
    DeviceId: 127821,
    StaffId: 206697,
    DateTime: ctDate,
    StatusId: statusId,
    ServiceType: 1,
    TotalAmount: 0.01,
    TransactionItems: [{
      ProductId: 39332879,
      Quantity: 1,
      UnitPrice: 0.01,
      Notes: 'PRINTER TEST | Pickup: ASAP | PICKUP'
    }],
    Tenders: [{ TenderTypeId: 130092, Amount: 0.01 }]
  };

  const resp = await fetch(URL + '/api/v4/Transaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(tx)
  });
  
  console.log('Status:', resp.status);
  const text = await resp.text();
  try {
    const data = JSON.parse(text);
    console.log('Transaction ID:', data.Id, '| StatusId:', data.StatusId);
    return data;
  } catch {
    console.log('Response:', text.substring(0, 300));
    return null;
  }
}

async function tryWithoutTenders(statusId, label) {
  console.log(`\n=== Testing StatusId ${statusId} (${label}) WITHOUT Tenders ===`);
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow).toISOString().replace('Z', '');
  
  const tx = {
    DeviceId: 127821,
    StaffId: 206697,
    DateTime: ctDate,
    StatusId: statusId,
    ServiceType: 1,
    TotalAmount: 0.01,
    TransactionItems: [{
      ProductId: 39332879,
      Quantity: 1,
      UnitPrice: 0.01,
      Notes: 'PRINTER TEST NO TENDER | Pickup: ASAP'
    }]
  };

  const resp = await fetch(URL + '/api/v4/Transaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(tx)
  });
  
  console.log('Status:', resp.status);
  const text = await resp.text();
  try {
    const data = JSON.parse(text);
    console.log('Transaction ID:', data.Id, '| StatusId:', data.StatusId);
    return data;
  } catch {
    console.log('Response:', text.substring(0, 300));
    return null;
  }
}

async function checkLocalMessaging() {
  console.log('\n=== Checking LocalMessagingConfiguration ===');
  const resp = await fetch(URL + '/api/v4/LocalMessagingConfiguration', {
    headers: { 'Authorization': 'Basic ' + API_KEY }
  });
  console.log('Status:', resp.status);
  const data = await resp.json();
  console.log('Config:', JSON.stringify(data, null, 2));
}

async function tryDeviceRestaurant() {
  console.log('\n=== Testing on RESTAURANT device (100304) instead of API ===');
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow).toISOString().replace('Z', '');
  
  const tx = {
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
      Notes: 'ONLINE ORDER | RESTAURANT DEVICE TEST | Pickup: ASAP'
    }],
    Tenders: [{ TenderTypeId: 130092, Amount: 0.01 }]
  };

  const resp = await fetch(URL + '/api/v4/Transaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(tx)
  });
  
  console.log('Status:', resp.status);
  const text = await resp.text();
  try {
    const data = JSON.parse(text);
    console.log('Transaction ID:', data.Id, '| StatusId:', data.StatusId);
  } catch {
    console.log('Response:', text.substring(0, 300));
  }
}

async function main() {
  // Test 1: StatusId 3 (Ordered) - this is what normally triggers kitchen printer
  await tryTransaction(3, 'Ordered');
  
  // Test 2: StatusId 2 (Held)
  await tryTransaction(2, 'Held');
  
  // Test 3: StatusId 3 without tenders
  await tryWithoutTenders(3, 'Ordered');
  
  // Test 4: Check local messaging config
  await checkLocalMessaging();
  
  // Test 5: Try RESTAURANT device instead of API
  await tryDeviceRestaurant();
  
  console.log('\n=== SUMMARY ===');
  console.log('Check the kitchen printer after each test.');
  console.log('The RESTAURANT device (100304) is the physical terminal that likely has the printer connected.');
  console.log('If RESTAURANT device triggers the printer but API does not,');
  console.log('we may need to route orders through the RESTAURANT device.');
}

main().catch(e => console.error(e));
