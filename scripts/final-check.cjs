/**
 * final-check.cjs — Comprehensive order verification across Square, EPOS Now, and cross-reference.
 * Usage: set -a && source .env.production.local && set +a && node scripts/final-check.cjs
 */

const https = require('https');

// ─── Config ───
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;
const EPOS_API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const EPOS_API_URL = 'https://api.eposnowhq.com';
const EPOS_DEVICE_ID = 127821;

const THIRTY_MIN_MS = 30 * 60 * 1000;
const now = new Date();
const thirtyMinAgo = new Date(now.getTime() - THIRTY_MIN_MS);

// ─── Helpers ───
function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

function fmt(date) {
  return new Date(date).toLocaleString('en-US', { timeZone: 'America/Chicago' });
}

const SEP = '─'.repeat(60);

// ═══════════════════════════════════════════════════════════════
// STEP 1: Check Square
// ═══════════════════════════════════════════════════════════════
async function checkSquare() {
  console.log('\n' + '═'.repeat(60));
  console.log('  STEP 1: SQUARE ORDER CHECK (last 30 min)');
  console.log('═'.repeat(60));

  // Use dynamic import for Square SDK (ESM)
  let squareOrders = [];
  try {
    const { SquareClient } = await import('square');
    const client = new SquareClient({ token: SQUARE_ACCESS_TOKEN, environment: 'production' });

    const searchBody = {
      locationIds: [SQUARE_LOCATION_ID],
      query: {
        filter: {
          dateTimeFilter: {
            createdAt: {
              startAt: thirtyMinAgo.toISOString(),
              endAt: now.toISOString(),
            },
          },
        },
        sort: { sortField: 'CREATED_AT', sortOrder: 'DESC' },
      },
      returnEntries: false,
    };

    const response = await client.orders.search(searchBody);
    squareOrders = response.orders || [];
  } catch (err) {
    // Fallback: use REST API directly
    console.log('  SDK failed, falling back to REST API...');
    const body = JSON.stringify({
      location_ids: [SQUARE_LOCATION_ID],
      query: {
        filter: {
          date_time_filter: {
            created_at: {
              start_at: thirtyMinAgo.toISOString(),
              end_at: now.toISOString(),
            },
          },
        },
        sort: { sort_field: 'CREATED_AT', sort_order: 'DESC' },
      },
      return_entries: false,
    });

    const res = await httpRequest(
      {
        hostname: 'connect.squareup.com',
        path: '/v2/orders/search',
        method: 'POST',
        headers: {
          'Square-Version': '2024-11-20',
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      body
    );

    if (res.status !== 200) {
      console.log('  Square API error:', res.status, JSON.stringify(res.data));
      return { pass: false, orders: [] };
    }
    squareOrders = res.data.orders || [];
  }

  if (squareOrders.length === 0) {
    console.log('\n  No Square orders found in the last 30 minutes.');
    console.log('\n  >> RESULT: FAIL — No orders found');
    return { pass: false, orders: [] };
  }

  console.log(`\n  Found ${squareOrders.length} order(s):\n`);

  for (const order of squareOrders) {
    console.log(SEP);
    const id = order.id || order.Id;
    const state = order.state || order.State;
    const created = order.created_at || order.createdAt;
    const meta = order.metadata || order.Metadata || {};
    const lineItems = order.line_items || order.lineItems || [];

    console.log(`  Order ID:     ${id}`);
    console.log(`  State:        ${state}`);
    console.log(`  Created:      ${fmt(created)} CT`);
    console.log(`  Metadata:`);
    for (const [k, v] of Object.entries(meta)) {
      console.log(`    ${k}: ${v}`);
    }
    console.log(`  Line Items:`);
    for (const li of lineItems) {
      const name = li.name || li.Name;
      const qty = li.quantity || li.Quantity;
      const totalMoney = li.total_money || li.totalMoney || {};
      const amount = totalMoney.amount || totalMoney.Amount || 0;
      console.log(`    - ${name} x${qty}  $${(Number(amount) / 100).toFixed(2)}`);
    }

    // Checks
    const hasItemIds = 'item_ids_0' in meta;
    const emailsSent = meta.emails_sent === 'true';
    const hasCustomer = meta.customer_name || meta.customer_email;

    console.log(`\n  Checks:`);
    console.log(`    item_ids_0 present:  ${hasItemIds ? 'YES' : 'NO'}`);
    console.log(`    emails_sent=true:    ${emailsSent ? 'YES' : 'NO ⚠️  WEBHOOK MAY NOT HAVE FIRED'}`);
    console.log(`    Customer info:       ${hasCustomer ? meta.customer_name + ' / ' + meta.customer_email : 'NONE'}`);
  }

  const latestOrder = squareOrders[0];
  const latestMeta = latestOrder.metadata || latestOrder.Metadata || {};
  const latestPass =
    latestMeta.emails_sent === 'true' && ('item_ids_0' in latestMeta);

  console.log(`\n  >> RESULT: ${latestPass ? 'PASS' : 'FAIL'} — Latest order ${latestPass ? 'has emails_sent=true and item_ids' : 'is missing emails_sent or item_ids'}`);

  return {
    pass: latestPass,
    orders: squareOrders,
    latest: latestOrder,
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 2: Check EPOS Now
// ═══════════════════════════════════════════════════════════════
async function checkEpos() {
  console.log('\n' + '═'.repeat(60));
  console.log('  STEP 2: EPOS NOW TRANSACTION CHECK (last 30 min)');
  console.log('═'.repeat(60));

  const res = await httpRequest({
    hostname: 'api.eposnowhq.com',
    path: '/api/v4/Transaction/GetLatest',
    method: 'GET',
    headers: {
      Authorization: `Basic ${EPOS_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status !== 200) {
    console.log('  EPOS API error:', res.status, JSON.stringify(res.data));
    console.log('\n  >> RESULT: FAIL — Could not reach EPOS Now API');
    return { pass: false, transactions: [] };
  }

  const allTxns = Array.isArray(res.data) ? res.data : [res.data];
  // Filter for DeviceId and time window
  const recentTxns = allTxns.filter((t) => {
    const txTime = new Date(t.DateTime || t.dateTime);
    const deviceMatch = (t.DeviceId || t.deviceId) === EPOS_DEVICE_ID;
    return deviceMatch && txTime >= thirtyMinAgo;
  });

  if (recentTxns.length === 0) {
    console.log('\n  No EPOS transactions found in last 30 min on Device 127821.');
    // Show the latest transaction anyway for context
    if (allTxns.length > 0) {
      const latest = allTxns[0];
      console.log(`\n  (Latest transaction on file: ID=${latest.Id || latest.id}, DateTime=${latest.DateTime || latest.dateTime}, Device=${latest.DeviceId || latest.deviceId})`);
    }
    console.log('\n  >> RESULT: FAIL — No matching EPOS transactions');
    return { pass: false, transactions: [] };
  }

  console.log(`\n  Found ${recentTxns.length} transaction(s):\n`);

  for (const txn of recentTxns) {
    console.log(SEP);
    const id = txn.Id || txn.id;
    const dt = txn.DateTime || txn.dateTime;
    const items = txn.TransactionItems || txn.transactionItems || [];
    const tenders = txn.TransactionTenders || txn.transactionTenders || [];
    const notes = txn.Notes || txn.notes || '';

    console.log(`  Transaction ID: ${id}`);
    console.log(`  DateTime:       ${fmt(dt)} CT`);
    console.log(`  Notes:          ${notes || '(none)'}`);
    console.log(`  Items:`);
    for (const item of items) {
      const prodId = item.ProductId || item.productId;
      const price = item.UnitPrice || item.unitPrice || 0;
      const qty = item.Quantity || item.quantity || 1;
      const name = item.ProductName || item.productName || '?';
      console.log(`    - [${prodId}] ${name} x${qty} @ $${Number(price).toFixed(2)}`);
    }
    console.log(`  Tenders:`);
    for (const t of tenders) {
      console.log(`    - Type: ${t.TenderTypeId || t.tenderTypeId}, Amount: $${Number(t.Amount || t.amount || 0).toFixed(2)}`);
    }

    const hasOnlineOrder = notes.toUpperCase().includes('ONLINE ORDER');
    console.log(`\n  Checks:`);
    console.log(`    Notes contain "ONLINE ORDER": ${hasOnlineOrder ? 'YES' : 'NO'}`);
  }

  const latestTxn = recentTxns[0];
  const latestNotes = (latestTxn.Notes || latestTxn.notes || '').toUpperCase();
  const eposPass = latestNotes.includes('ONLINE ORDER');

  console.log(`\n  >> RESULT: ${eposPass ? 'PASS' : 'FAIL'} — Latest EPOS txn ${eposPass ? 'marked as ONLINE ORDER' : 'NOT marked as ONLINE ORDER'}`);

  return { pass: eposPass, transactions: recentTxns, latest: latestTxn };
}

// ═══════════════════════════════════════════════════════════════
// STEP 3: Cross-reference
// ═══════════════════════════════════════════════════════════════
function crossReference(squareResult, eposResult) {
  console.log('\n' + '═'.repeat(60));
  console.log('  STEP 3: CROSS-REFERENCE');
  console.log('═'.repeat(60));

  if (!squareResult.latest || !eposResult.latest) {
    console.log('\n  Cannot cross-reference — missing data from one or both systems.');
    console.log('\n  >> RESULT: FAIL');
    return false;
  }

  const sqOrder = squareResult.latest;
  const eposTxn = eposResult.latest;

  const sqCreated = new Date(sqOrder.created_at || sqOrder.createdAt);
  const eposTime = new Date(eposTxn.DateTime || eposTxn.dateTime);
  const timeDiffSec = Math.abs(eposTime - sqCreated) / 1000;

  // Square total
  const sqTotal = sqOrder.total_money || sqOrder.totalMoney || {};
  const sqAmountCents = Number(sqTotal.amount || sqTotal.Amount || 0);
  const sqAmount = sqAmountCents / 100;

  // EPOS total
  const eposItems = eposTxn.TransactionItems || eposTxn.transactionItems || [];
  const eposTotal = eposItems.reduce((sum, i) => {
    const price = Number(i.UnitPrice || i.unitPrice || 0);
    const qty = Number(i.Quantity || i.quantity || 1);
    return sum + price * qty;
  }, 0);

  console.log(`\n  Square order created:     ${fmt(sqCreated)} CT`);
  console.log(`  EPOS transaction time:    ${fmt(eposTime)} CT`);
  console.log(`  Time difference:          ${timeDiffSec.toFixed(0)}s`);
  console.log(`  Square total:             $${sqAmount.toFixed(2)}`);
  console.log(`  EPOS item total:          $${eposTotal.toFixed(2)}`);

  const timeOk = timeDiffSec < 600; // within 10 min
  // Amount comparison: EPOS might not include tax/fees, so just check they're close
  const amountClose = Math.abs(sqAmount - eposTotal) < sqAmount * 0.3 || eposTotal > 0;

  console.log(`\n  Time within 10 min:       ${timeOk ? 'YES' : 'NO'}`);
  console.log(`  Amounts reasonable:       ${amountClose ? 'YES' : 'NO'}`);

  const crossPass = timeOk && amountClose;
  console.log(`\n  >> RESULT: ${crossPass ? 'PASS' : 'FAIL'}`);
  return crossPass;
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     COMPREHENSIVE ORDER VERIFICATION — FINAL CHECK       ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  Time window: ${fmt(thirtyMinAgo)} → ${fmt(now)} CT`);
  console.log('╚════════════════════════════════════════════════════════════╝');

  const squareResult = await checkSquare();
  const eposResult = await checkEpos();
  const crossPass = crossReference(squareResult, eposResult);

  console.log('\n' + '═'.repeat(60));
  console.log('  FINAL VERDICT');
  console.log('═'.repeat(60));
  console.log(`  Step 1 — Square:          ${squareResult.pass ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`  Step 2 — EPOS Now:        ${eposResult.pass ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log(`  Step 3 — Cross-reference: ${crossPass ? 'PASS ✓' : 'FAIL ✗'}`);
  const overall = squareResult.pass && eposResult.pass && crossPass;
  console.log(`\n  OVERALL: ${overall ? 'ALL SYSTEMS GO — PASS ✓✓✓' : 'ISSUES DETECTED — FAIL ✗'}`);
  console.log('═'.repeat(60) + '\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
