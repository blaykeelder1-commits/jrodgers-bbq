// Test pushing a transaction to EPOS Now - exactly as the webhook would do it
async function test() {
  const apiKey = process.env.EPOSNOW_API_KEY;
  const apiUrl = process.env.EPOSNOW_API_URL;

  console.log('API URL:', apiUrl);
  console.log('API Key (first 20 chars):', apiKey?.substring(0, 20));

  // Step 1: Verify credentials with GET /Device
  console.log('\n--- Step 1: Verify credentials ---');
  const deviceResp = await fetch(apiUrl + '/api/v4/Device', {
    headers: { 'Authorization': 'Basic ' + apiKey, 'Content-Type': 'application/json' }
  });
  console.log('Device endpoint status:', deviceResp.status);
  if (!deviceResp.ok) {
    console.error('CREDENTIALS FAILED:', await deviceResp.text());
    return;
  }
  const devices = await deviceResp.json();
  console.log('Devices found:', devices.length, '- Names:', devices.map(d => d.Name).join(', '));

  // Step 2: Check what endpoints are available - try listing transactions
  console.log('\n--- Step 2: Check Transaction endpoint ---');
  const txListResp = await fetch(apiUrl + '/api/v4/Transaction?page=1', {
    headers: { 'Authorization': 'Basic ' + apiKey, 'Content-Type': 'application/json' }
  });
  console.log('GET Transaction status:', txListResp.status);
  const txListText = await txListResp.text();
  console.log('Response (first 500 chars):', txListText.substring(0, 500));

  // Step 3: Push a test transaction - exactly matching the format in eposnow.js
  console.log('\n--- Step 3: Push test transaction ---');
  const transaction = {
    DateTime: new Date().toISOString(),
    Items: [
      { Name: 'TEST - BK BBQ Sauce', Quantity: 1, UnitPrice: 0.01 }
    ],
    TotalAmount: 0.01,
    Notes: 'ONLINE ORDER | TEST ORDER | Pickup: ASAP | PICKUP'
  };

  console.log('Sending transaction:', JSON.stringify(transaction, null, 2));

  const pushResp = await fetch(apiUrl.replace(/\/+$/, '') + '/api/v4/Transaction', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  });

  console.log('POST Transaction status:', pushResp.status);
  const pushBody = await pushResp.text();
  console.log('Response:', pushBody);

  if (pushResp.ok) {
    console.log('\n✅ SUCCESS - Transaction pushed to EPOS Now!');
  } else {
    console.log('\n❌ FAILED - Transaction was rejected');

    // Step 4: If transaction endpoint doesn't work, explore the API
    console.log('\n--- Step 4: Exploring alternative endpoints ---');

    // Try /api/v4/Order instead
    const orderResp = await fetch(apiUrl + '/api/v4/Order', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    console.log('POST /api/v4/Order status:', orderResp.status);
    console.log('Response:', (await orderResp.text()).substring(0, 500));

    // Try /api/v4/CompletedTransaction
    const completedResp = await fetch(apiUrl + '/api/v4/CompletedTransaction', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    console.log('POST /api/v4/CompletedTransaction status:', completedResp.status);
    console.log('Response:', (await completedResp.text()).substring(0, 500));
  }
}

test().catch(e => console.error('Error:', e.message, e.stack));
