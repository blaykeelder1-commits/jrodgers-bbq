const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const URL = 'https://api.eposnowhq.com';

async function main() {
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow).toISOString().replace('Z', '');

  // V2 CompleteTransaction with correct field names
  const body = {
    DeviceId: 100304,
    StaffId: 206697,
    DateTime: ctDate,
    EatOut: 1,
    TransactionItems: [{
      ProductId: 39332879,
      Quantity: 1,
      UnitPrice: 0.01,
      Notes: 'ONLINE ORDER | V2 PRINT TEST | Pickup: ASAP'
    }],
    Tenders: [{
      TenderTypeId: 130092,
      Amount: 0.01
    }]
  };

  console.log('POST /api/V2/CompleteTransaction');
  console.log('Body:', JSON.stringify(body, null, 2));
  
  const resp = await fetch(URL + '/api/V2/CompleteTransaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  
  console.log('Status:', resp.status);
  const text = await resp.text();
  console.log('Response:', text.substring(0, 1000));
  
  if (resp.ok) {
    console.log('\n✅ V2 CompleteTransaction SUCCEEDED — check the kitchen printer!');
    console.log('This endpoint may trigger the print queue through the till app.');
  }
}

main().catch(e => console.error(e));
