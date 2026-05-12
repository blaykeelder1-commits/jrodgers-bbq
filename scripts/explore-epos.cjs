const https = require('https');

const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const BASE_URL = 'https://api.eposnowhq.com';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Authorization': `Basic ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  // 1. Products page 1
  console.log('='.repeat(80));
  console.log('1. PRODUCTS (Page 1)');
  console.log('='.repeat(80));
  const products1 = await request('GET', '/api/v4/Product?page=1');
  console.log(`Status: ${products1.status}`);
  if (Array.isArray(products1.data)) {
    console.log(`Count: ${products1.data.length}`);
    products1.data.forEach(p => {
      console.log(`  ID: ${p.Id} | Name: ${p.Name} | CategoryId: ${p.CategoryId} | CostPrice: ${p.CostPrice} | SellPriceIncTax: ${p.SellPriceIncTax}`);
    });
  } else {
    console.log(JSON.stringify(products1.data, null, 2));
  }

  // 2. Categories
  console.log('\n' + '='.repeat(80));
  console.log('2. CATEGORIES');
  console.log('='.repeat(80));
  const categories = await request('GET', '/api/v4/Category');
  console.log(`Status: ${categories.status}`);
  if (Array.isArray(categories.data)) {
    console.log(`Count: ${categories.data.length}`);
    categories.data.forEach(c => {
      console.log(`  ID: ${c.Id} | Name: ${c.Name} | ParentId: ${c.ParentId}`);
    });
  } else {
    console.log(JSON.stringify(categories.data, null, 2));
  }

  // 3. Tender Types
  console.log('\n' + '='.repeat(80));
  console.log('3. TENDER TYPES');
  console.log('='.repeat(80));
  const tenders = await request('GET', '/api/v4/TenderType');
  console.log(`Status: ${tenders.status}`);
  if (Array.isArray(tenders.data)) {
    console.log(`Count: ${tenders.data.length}`);
    tenders.data.forEach(t => {
      console.log(`  ID: ${t.Id} | Name: ${t.Name} | Type: ${t.Type} | ${JSON.stringify(t)}`);
    });
  } else {
    console.log(JSON.stringify(tenders.data, null, 2));
  }

  // 4. Transactions page 1
  console.log('\n' + '='.repeat(80));
  console.log('4. TRANSACTIONS (Page 1)');
  console.log('='.repeat(80));
  const transactions = await request('GET', '/api/v4/Transaction?page=1');
  console.log(`Status: ${transactions.status}`);
  if (Array.isArray(transactions.data)) {
    console.log(`Count: ${transactions.data.length}`);
    // Show first 3 in full detail, rest summarized
    transactions.data.slice(0, 3).forEach((t, i) => {
      console.log(`\n  --- Transaction ${i + 1} (FULL) ---`);
      console.log(JSON.stringify(t, null, 2));
    });
    if (transactions.data.length > 3) {
      console.log(`\n  ... and ${transactions.data.length - 3} more transactions`);
      transactions.data.slice(3).forEach(t => {
        console.log(`  ID: ${t.Id} | DateTime: ${t.DateTime} | Total: ${t.Total}`);
      });
    }
  } else {
    console.log(JSON.stringify(transactions.data, null, 2));
  }

  // 5. Products page 2
  console.log('\n' + '='.repeat(80));
  console.log('5. PRODUCTS (Page 2)');
  console.log('='.repeat(80));
  const products2 = await request('GET', '/api/v4/Product?page=2');
  console.log(`Status: ${products2.status}`);
  if (Array.isArray(products2.data)) {
    console.log(`Count: ${products2.data.length}`);
    products2.data.forEach(p => {
      console.log(`  ID: ${p.Id} | Name: ${p.Name} | CategoryId: ${p.CategoryId} | CostPrice: ${p.CostPrice} | SellPriceIncTax: ${p.SellPriceIncTax}`);
    });
  } else {
    console.log(JSON.stringify(products2.data, null, 2));
  }

  // 6. Test CompleteTransaction POST
  console.log('\n' + '='.repeat(80));
  console.log('6. TEST CompleteTransaction POST (minimal payload)');
  console.log('='.repeat(80));
  const testPayload = {
    TransactionItems: [
      {
        ProductId: products1.data?.[0]?.Id || 1,
        Quantity: 1,
        UnitPrice: 1.00,
      }
    ],
    TenderTypeId: tenders.data?.[0]?.Id || 1,
    TotalAmount: 1.00,
  };
  console.log('Payload:', JSON.stringify(testPayload, null, 2));
  const txnResult = await request('POST', '/api/v4/CompleteTransaction', testPayload);
  console.log(`Status: ${txnResult.status}`);
  console.log(JSON.stringify(txnResult.data, null, 2));
}

main().catch(console.error);
