const https = require('https');

const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const BASE_URL = 'https://api.eposnowhq.com';
const SAUCE_PRODUCT_IDS = [39332879, 39332880];
const TODAY = '2026-03-26';

function get(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
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
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`JSON parse error: ${e.message}\nBody: ${data.slice(0, 500)}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 500)}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log(`Fetching latest transactions from Epos Now...\n`);

  const transactions = await get('/api/v4/Transaction/GetLatest');

  if (!Array.isArray(transactions)) {
    console.log('Response is not an array. Full response:');
    console.log(JSON.stringify(transactions, null, 2));
    return;
  }

  console.log(`Total transactions returned: ${transactions.length}\n`);

  // Filter to today's transactions
  const todayTxns = transactions.filter((t) => {
    const dt = t.DateTime || t.dateTime || '';
    return dt.startsWith(TODAY);
  });

  console.log(`Transactions from today (${TODAY}): ${todayTxns.length}\n`);

  if (todayTxns.length === 0) {
    console.log('No transactions found for today. Showing all returned transactions dates:');
    transactions.forEach((t) => {
      console.log(`  ID=${t.Id || t.id}  DateTime=${t.DateTime || t.dateTime}`);
    });
    console.log();
  }

  const sauceTransactions = [];

  for (const t of todayTxns) {
    const id = t.Id ?? t.id;
    const dt = t.DateTime ?? t.dateTime;
    const device = t.DeviceName ?? t.deviceName ?? t.DeviceId ?? t.deviceId ?? 'N/A';
    const status = t.StatusId ?? t.statusId ?? 'N/A';
    const total = t.TotalAmount ?? t.totalAmount ?? 'N/A';
    const items = t.TransactionItems ?? t.transactionItems ?? [];

    console.log('─'.repeat(60));
    console.log(`Transaction ID : ${id}`);
    console.log(`DateTime       : ${dt}`);
    console.log(`Device         : ${device}`);
    console.log(`StatusId       : ${status}`);
    console.log(`TotalAmount    : ${total}`);
    console.log(`Items (${items.length}):`);

    for (const item of items) {
      const pid = item.ProductId ?? item.productId ?? 'N/A';
      const name = item.Name ?? item.name ?? item.ProductName ?? item.productName ?? '';
      const price = item.UnitPrice ?? item.unitPrice ?? 'N/A';
      const qty = item.Quantity ?? item.quantity ?? 'N/A';
      const notes = item.Notes ?? item.notes ?? '';

      const isSauce = SAUCE_PRODUCT_IDS.includes(pid);
      const marker = isSauce ? ' *** SAUCE PRODUCT ***' : '';

      console.log(`  - ProductId: ${pid}  Name: "${name}"  UnitPrice: ${price}  Qty: ${qty}  Notes: "${notes}"${marker}`);

      if (isSauce) {
        sauceTransactions.push({ transactionId: id, dateTime: dt, productId: pid, name, price, qty, notes });
      }
    }
    console.log();
  }

  console.log('═'.repeat(60));
  if (sauceTransactions.length > 0) {
    console.log(`\nFOUND ${sauceTransactions.length} SAUCE ITEM(S) (ProductId 39332879 or 39332880):\n`);
    for (const s of sauceTransactions) {
      console.log(`  Transaction ${s.transactionId} @ ${s.dateTime}`);
      console.log(`    ProductId: ${s.productId}  Name: "${s.name}"  Price: ${s.price}  Qty: ${s.qty}  Notes: "${s.notes}"`);
    }
  } else {
    console.log('\nNo sauce products (39332879 / 39332880) found in today\'s transactions.');
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
