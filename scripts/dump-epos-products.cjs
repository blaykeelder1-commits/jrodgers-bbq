const https = require('https');

const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const BASE_URL = 'api.eposnowhq.com';

function fetchPage(page) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: `/api/v4/Product?page=${page}`,
      method: 'GET',
      headers: {
        'Authorization': `Basic ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse page ${page}: ${data.substring(0, 200)}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const allProducts = [];
  for (let page = 1; page <= 3; page++) {
    console.log(`Fetching page ${page}...`);
    const products = await fetchPage(page);
    if (!Array.isArray(products)) {
      console.log(`Page ${page} returned:`, JSON.stringify(products).substring(0, 200));
      break;
    }
    allProducts.push(...products);
    console.log(`  Got ${products.length} products`);
  }

  console.log(`\nTotal products: ${allProducts.length}\n`);
  console.log('Id | Name | CategoryId | SalePrice');
  console.log('---|------|------------|----------');

  for (const p of allProducts) {
    console.log(`${p.Id} | ${p.Name} | ${p.CategoryId} | ${p.SalePrice}`);
  }
}

main().catch(console.error);
