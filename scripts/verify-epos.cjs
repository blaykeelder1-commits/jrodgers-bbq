const https = require('https');

const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const BASE = 'https://api.eposnowhq.com';

function get(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + API_KEY,
        'Accept': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('=== 1) GET Transaction 490481390 ===');
  try {
    const r1 = await get('/api/v4/Transaction/490481390/true');
    console.log('Status:', r1.status);
    try {
      console.log(JSON.stringify(JSON.parse(r1.body), null, 2));
    } catch {
      console.log('Raw body:', r1.body);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }

  console.log('\n=== 2) GET Latest Transaction ===');
  try {
    const r2 = await get('/api/v4/Transaction/GetLatest');
    console.log('Status:', r2.status);
    try {
      console.log(JSON.stringify(JSON.parse(r2.body), null, 2));
    } catch {
      console.log('Raw body:', r2.body);
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
