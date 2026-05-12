const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const BASE_URL = 'https://api.eposnowhq.com';

const DEVICE_ID = 127821;
const STAFF_ID = 206697;
const TENDER_TYPE_ID = 130092;
const PRODUCT_ID = 39332879; // BK BBQ Sauce

async function main() {
  const now = new Date().toISOString();

  const body = {
    DeviceId: DEVICE_ID,
    StaffId: STAFF_ID,
    DateTime: now,
    StatusId: 1,
    ServiceType: 1,
    TotalAmount: 0.01,
    TransactionItems: [
      {
        ProductId: PRODUCT_ID,
        Quantity: 1,
        UnitPrice: 0.01,
        Notes: 'ONLINE ORDER | TEST | Pickup: ASAP | PICKUP',
      },
    ],
    Tenders: [
      {
        TenderTypeId: TENDER_TYPE_ID,
        Amount: 0.01,
      },
    ],
  };

  // --- Step 1: POST the transaction ---
  console.log('='.repeat(60));
  console.log('POST /api/v4/Transaction');
  console.log('='.repeat(60));
  console.log('Request body:', JSON.stringify(body, null, 2));

  const res = await fetch(`${BASE_URL}/api/v4/Transaction`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  console.log(`\nStatus: ${res.status} ${res.statusText}`);

  const text = await res.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch { parsed = text; }
  console.log('Response:', typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2));

  if (res.status !== 201) {
    console.error('\nTransaction creation FAILED.');
    process.exit(1);
  }

  const transactionId = parsed.Id;
  console.log(`\nSUCCESS — Transaction created. ID: ${transactionId}`);

  // --- Step 2: GET the transaction back to verify ---
  console.log('\n' + '='.repeat(60));
  console.log(`GET /api/v4/Transaction/${transactionId}`);
  console.log('='.repeat(60));

  const verifyRes = await fetch(`${BASE_URL}/api/v4/Transaction/${transactionId}`, {
    headers: {
      'Authorization': `Basic ${API_KEY}`,
    },
  });

  console.log(`\nStatus: ${verifyRes.status} ${verifyRes.statusText}`);

  const verifyText = await verifyRes.text();
  let verifyParsed;
  try { verifyParsed = JSON.parse(verifyText); } catch { verifyParsed = verifyText; }
  console.log('Response:', typeof verifyParsed === 'string' ? verifyParsed : JSON.stringify(verifyParsed, null, 2));

  if (verifyRes.status === 200) {
    console.log(`\nVERIFIED — Transaction ${transactionId} exists in EPOS Now.`);
  } else {
    console.error(`\nVerification FAILED — could not GET transaction ${transactionId}.`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
