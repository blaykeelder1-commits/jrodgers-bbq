const https = require('https');

const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const BASE_URL = 'https://api.eposnowhq.com';

function request(method, path) {
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
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  // Products page 3
  console.log('PRODUCTS (Page 3)');
  console.log('='.repeat(80));
  const p3 = await request('GET', '/api/v4/Product?page=3');
  console.log(`Status: ${p3.status}, Count: ${Array.isArray(p3.data) ? p3.data.length : 'N/A'}`);
  if (Array.isArray(p3.data)) {
    p3.data.forEach(p => {
      console.log(`  ID: ${p.Id} | Name: ${p.Name} | CategoryId: ${p.CategoryId} | CostPrice: ${p.CostPrice}`);
    });
  } else {
    console.log(JSON.stringify(p3.data, null, 2));
  }

  // All categories (paginated)
  console.log('\nALL CATEGORIES (page 2)');
  console.log('='.repeat(80));
  const c2 = await request('GET', '/api/v4/Category?page=2');
  console.log(`Status: ${c2.status}, Count: ${Array.isArray(c2.data) ? c2.data.length : 'N/A'}`);
  if (Array.isArray(c2.data)) {
    c2.data.forEach(c => {
      console.log(`  ID: ${c.Id} | Name: ${c.Name} | ParentId: ${c.ParentId}`);
    });
  } else {
    console.log(JSON.stringify(c2.data, null, 2));
  }

  // Get a single product to see full field names (for SellPrice)
  console.log('\nSINGLE PRODUCT DETAIL (first food item)');
  console.log('='.repeat(80));
  const detail = await request('GET', '/api/v4/Product/34737052');
  console.log(JSON.stringify(detail.data, null, 2));
}

main().catch(console.error);
