const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const BASE_URL = 'https://api.eposnowhq.com';

async function postTransaction(label, body) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`ATTEMPT: ${label}`);
  console.log(`${'='.repeat(60)}`);
  console.log('Request body:', JSON.stringify(body, null, 2));

  const res = await fetch(`${BASE_URL}/api/v4/Transaction`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  console.log(`Status: ${res.status} ${res.statusText}`);
  const text = await res.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch { parsed = text; }
  console.log('Response:', typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2));

  if (res.status === 201) {
    console.log('\n*** SUCCESS! Transaction created. ***');
    return true;
  }
  return false;
}

async function getStaff() {
  console.log('Fetching staff list...');
  const res = await fetch(`${BASE_URL}/api/v4/Staff`, {
    headers: { 'Authorization': `Basic ${API_KEY}` },
  });
  const data = await res.json();
  console.log('Staff:', JSON.stringify(data, null, 2));
  return data;
}

async function getTransactionStatuses() {
  console.log('\nFetching transaction statuses...');
  const res = await fetch(`${BASE_URL}/api/v4/TransactionStatus`, {
    headers: { 'Authorization': `Basic ${API_KEY}` },
  });
  const data = await res.json();
  console.log('Transaction Statuses:', JSON.stringify(data, null, 2));
  return data;
}

async function main() {
  const staff = await getStaff();
  const staffId = Array.isArray(staff) && staff.length > 0 ? staff[0].Id : 1;
  console.log(`Using StaffId: ${staffId}`);

  const statuses = await getTransactionStatuses();

  const now = new Date().toISOString();

  // Try each known status to find one that works
  const statusesToTry = [1, 2, 3, 4, 5];

  for (const sid of statusesToTry) {
    const body = {
      StatusId: sid,
      ServiceType: 1,
      DeviceId: 127821,
      StaffId: staffId,
      DateTime: now,
      TransactionItems: [
        {
          ProductId: 34737286,
          Quantity: 1,
          UnitPrice: 7.99,
        },
      ],
      Tenders: [
        {
          TenderTypeId: 130092,
          Amount: 7.99,
        },
      ],
      TotalAmount: 7.99,
    };

    if (await postTransaction(`StatusId=${sid} with Tenders`, body)) return;
  }

  // Try without Tenders for StatusId 3
  const bodyNoTender = {
    StatusId: 3,
    ServiceType: 1,
    DeviceId: 127821,
    StaffId: staffId,
    DateTime: now,
    TransactionItems: [
      {
        ProductId: 34737286,
        Quantity: 1,
        UnitPrice: 7.99,
      },
    ],
    TotalAmount: 7.99,
  };

  if (await postTransaction('StatusId=3 without Tenders', bodyNoTender)) return;

  console.log('\n--- All attempts failed. ---');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
