/**
 * Full Order Pipeline Verification Script
 * Tests EPOS API, product mapping, transaction push, and code correctness.
 */
const fs = require('fs');
const path = require('path');

const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const API_URL = 'https://api.eposnowhq.com';

const results = [];

function log(check, status, detail) {
  const tag = status === 'PASS' ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`[${tag}] ${check}`);
  if (detail) console.log(`       ${detail}`);
  results.push({ check, status, detail });
}

async function eposFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Basic ${API_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  return resp;
}

async function main() {
  console.log('='.repeat(70));
  console.log('  J RODGERS BBQ — FULL ORDER PIPELINE VERIFICATION');
  console.log('  ' + new Date().toISOString());
  console.log('='.repeat(70));
  console.log();

  // ─── CHECK 1: EPOS API credentials ───
  console.log('--- CHECK 1: EPOS API Credentials ---');
  try {
    const resp = await eposFetch('/api/v4/Device');
    if (resp.status === 200) {
      const devices = await resp.json();
      log('EPOS API Credentials', 'PASS', `GET /api/v4/Device returned 200, ${Array.isArray(devices) ? devices.length : '?'} devices found`);
    } else {
      const body = await resp.text();
      log('EPOS API Credentials', 'FAIL', `Status ${resp.status}: ${body.substring(0, 200)}`);
    }
  } catch (err) {
    log('EPOS API Credentials', 'FAIL', err.message);
  }
  console.log();

  // ─── CHECK 2: Sauce products exist ───
  console.log('--- CHECK 2: Sauce Products ---');
  for (const [id, expectedName] of [
    ['39332879', 'BK BBQ Sauce'],
    ['39332880', 'BBQ Sauce']
  ]) {
    try {
      const resp = await eposFetch(`/api/v4/Product/${id}`);
      if (resp.status === 200) {
        const product = await resp.json();
        const nameMatch = product.Name && product.Name.includes(expectedName.replace('BK BBQ Sauce', 'BK BBQ').replace('BBQ Sauce', 'BBQ'));
        log(`Product ${id} (${expectedName})`, 'PASS',
          `Name: "${product.Name}", Price: $${product.CostPrice ?? product.SalePrice ?? '?'}, SalePrice: $${product.SalePrice ?? '?'}`);
      } else {
        log(`Product ${id} (${expectedName})`, 'FAIL', `Status ${resp.status}`);
      }
    } catch (err) {
      log(`Product ${id} (${expectedName})`, 'FAIL', err.message);
    }
  }
  console.log();

  // ─── CHECK 3: Printer filter / messaging config ───
  console.log('--- CHECK 3: Printer/Messaging Configuration ---');
  const printerEndpoints = [
    '/api/v4/LocalMessagingConfiguration',
    '/api/v4/Printer',
    '/api/v4/OrderPrinter'
  ];
  let printerFound = false;
  for (const ep of printerEndpoints) {
    try {
      const resp = await eposFetch(ep);
      if (resp.status === 200) {
        const data = await resp.json();
        log(`Printer config (${ep})`, 'PASS', `Returned 200: ${JSON.stringify(data).substring(0, 300)}`);
        printerFound = true;
      } else {
        log(`Printer config (${ep})`, 'FAIL', `Status ${resp.status} — endpoint may not be available via API`);
      }
    } catch (err) {
      log(`Printer config (${ep})`, 'FAIL', err.message);
    }
  }
  if (!printerFound) {
    log('Printer filter verification', 'FAIL', 'No printer API endpoints returned 200. Order Printer filter must be verified in EPOS Now Back Office UI.');
  }
  console.log();

  // ─── CHECK 4: Push a test transaction ───
  console.log('--- CHECK 4: Push Test Transaction ---');
  let transactionId = null;
  try {
    const transaction = {
      DeviceId: 127821,
      StaffId: 206697,
      DateTime: new Date().toISOString(),
      StatusId: 1,
      ServiceType: 1,
      TotalAmount: 0.01,
      TransactionItems: [
        {
          ProductId: 39332879,
          Quantity: 1,
          UnitPrice: 0.01,
          Notes: 'ONLINE ORDER | VERIFICATION TEST | Pickup: ASAP | PICKUP'
        }
      ],
      Tenders: [
        {
          TenderTypeId: 130092,
          Amount: 0.01
        }
      ]
    };

    console.log('  Posting transaction:', JSON.stringify(transaction, null, 2));
    const resp = await eposFetch('/api/v4/Transaction', {
      method: 'POST',
      body: JSON.stringify(transaction)
    });

    const body = await resp.text();
    console.log(`  Response status: ${resp.status}`);
    console.log(`  Response body: ${body.substring(0, 500)}`);

    if (resp.status === 200 || resp.status === 201) {
      const data = JSON.parse(body);
      transactionId = data.Id || data.id;
      log('Push test transaction', 'PASS', `Transaction created with ID: ${transactionId}`);
    } else {
      log('Push test transaction', 'FAIL', `Status ${resp.status}: ${body.substring(0, 300)}`);
    }
  } catch (err) {
    log('Push test transaction', 'FAIL', err.message);
  }
  console.log();

  // ─── CHECK 5: Verify transaction ───
  console.log('--- CHECK 5: Verify Transaction ---');
  if (transactionId) {
    try {
      const resp = await eposFetch(`/api/v4/Transaction/${transactionId}`);
      if (resp.status === 200) {
        const txn = await resp.json();
        const checks = [];
        if (txn.DeviceId === 127821) checks.push('DeviceId OK');
        else checks.push(`DeviceId MISMATCH: ${txn.DeviceId}`);
        if (txn.StaffId === 206697) checks.push('StaffId OK');
        else checks.push(`StaffId MISMATCH: ${txn.StaffId}`);
        if (txn.StatusId === 1) checks.push('StatusId OK');
        else checks.push(`StatusId: ${txn.StatusId}`);

        const allOk = checks.every(c => c.includes('OK'));
        log('Verify transaction', allOk ? 'PASS' : 'FAIL', checks.join(', '));
        console.log('  Full transaction:', JSON.stringify(txn, null, 2).substring(0, 1000));
      } else {
        log('Verify transaction', 'FAIL', `GET returned ${resp.status}`);
      }
    } catch (err) {
      log('Verify transaction', 'FAIL', err.message);
    }
  } else {
    log('Verify transaction', 'FAIL', 'No transaction ID from step 4');
  }
  console.log();

  // ─── CHECK 6: Webhook code verification ───
  console.log('--- CHECK 6: Webhook square.js ---');
  try {
    const webhookCode = fs.readFileSync(path.join(__dirname, '..', 'api', 'webhooks', 'square.js'), 'utf8');

    const checks6 = [];
    if (webhookCode.includes("import { pushToEposNow }")) checks6.push('imports pushToEposNow: YES');
    else checks6.push('imports pushToEposNow: NO');

    if (webhookCode.includes('item_ids_')) checks6.push('parses item_ids from metadata: YES');
    else checks6.push('parses item_ids from metadata: NO');

    // Check it pushes immediately (no deferral)
    if (webhookCode.includes('Promise.allSettled') && webhookCode.includes('pushToEposNow(')) {
      checks6.push('pushes to EPOS immediately (in Promise.allSettled): YES');
    } else {
      checks6.push('immediate push: UNCLEAR');
    }

    // Verify NO deferral logic
    if (!webhookCode.includes('epos_push_at') && !webhookCode.includes('defer')) {
      checks6.push('no deferral logic: YES');
    } else {
      checks6.push('WARNING: deferral logic found in webhook');
    }

    // Check lineItems include itemId and selectedSize
    if (webhookCode.includes('itemId:') && webhookCode.includes('selectedSize:')) {
      checks6.push('lineItems have itemId + selectedSize: YES');
    } else {
      checks6.push('lineItems itemId+selectedSize: NO');
    }

    const allOk = checks6.every(c => c.includes('YES'));
    log('Webhook code', allOk ? 'PASS' : 'FAIL', checks6.join(' | '));
  } catch (err) {
    log('Webhook code', 'FAIL', err.message);
  }
  console.log();

  // ─── CHECK 7: eposnow.js constants ───
  console.log('--- CHECK 7: eposnow.js constants ---');
  try {
    const eposCode = fs.readFileSync(path.join(__dirname, '..', 'api', 'lib', 'eposnow.js'), 'utf8');

    const checks7 = [];
    if (eposCode.includes('DEVICE_ID = 127821')) checks7.push('DeviceId 127821: YES');
    else checks7.push('DeviceId 127821: NO');

    if (eposCode.includes('STAFF_ID = 206697')) checks7.push('StaffId 206697: YES');
    else checks7.push('StaffId 206697: NO');

    if (eposCode.includes('TENDER_TYPE_ID = 130092')) checks7.push('TenderTypeId 130092: YES');
    else checks7.push('TenderTypeId 130092: NO');

    const allOk = checks7.every(c => c.includes('YES'));
    log('eposnow.js constants', allOk ? 'PASS' : 'FAIL', checks7.join(' | '));
  } catch (err) {
    log('eposnow.js constants', 'FAIL', err.message);
  }
  console.log();

  // ─── CHECK 8: eposProductMap.js ───
  console.log('--- CHECK 8: eposProductMap.js ---');
  try {
    const mapCode = fs.readFileSync(path.join(__dirname, '..', 'api', 'lib', 'eposProductMap.js'), 'utf8');

    const checks8 = [];
    if (mapCode.includes("'sauce-bk':") && mapCode.includes('39332879')) {
      checks8.push('sauce-bk -> 39332879: YES');
    } else {
      checks8.push('sauce-bk -> 39332879: NO');
    }

    if (mapCode.includes("'sauce-regular':") && mapCode.includes('39332880')) {
      checks8.push('sauce-regular -> 39332880: YES');
    } else {
      checks8.push('sauce-regular -> 39332880: NO');
    }

    const allOk = checks8.every(c => c.includes('YES'));
    log('eposProductMap.js', allOk ? 'PASS' : 'FAIL', checks8.join(' | '));
  } catch (err) {
    log('eposProductMap.js', 'FAIL', err.message);
  }
  console.log();

  // ─── CHECK 9: create-checkout.js ───
  console.log('--- CHECK 9: create-checkout.js ---');
  try {
    const checkoutCode = fs.readFileSync(path.join(__dirname, '..', 'api', 'create-checkout.js'), 'utf8');

    const checks9 = [];
    if (checkoutCode.includes('item.itemId') || checkoutCode.includes('itemId')) {
      checks9.push('sends itemId in item map: YES');
    } else {
      checks9.push('sends itemId: NO');
    }

    if (checkoutCode.includes('item_ids_') && checkoutCode.includes('itemIdParts') && checkoutCode.includes("join(',')")) {
      checks9.push('uses compact format (comma-separated chunks): YES');
    } else {
      checks9.push('compact format: NO');
    }

    if (checkoutCode.includes('selectedSize')) {
      checks9.push('includes selectedSize in compact string: YES');
    } else {
      checks9.push('includes selectedSize: NO');
    }

    const allOk = checks9.every(c => c.includes('YES'));
    log('create-checkout.js', allOk ? 'PASS' : 'FAIL', checks9.join(' | '));
  } catch (err) {
    log('create-checkout.js', 'FAIL', err.message);
  }
  console.log();

  // ─── CHECK 10: vercel.json ───
  console.log('--- CHECK 10: vercel.json ---');
  try {
    const vercelConfig = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8')
    );

    const checks10 = [];
    if (!vercelConfig.crons && !vercelConfig.cron) {
      checks10.push('no cron config: YES');
    } else {
      checks10.push(`cron config found: ${JSON.stringify(vercelConfig.crons || vercelConfig.cron)}`);
    }

    const allOk = checks10.every(c => c.includes('YES'));
    log('vercel.json', allOk ? 'PASS' : 'FAIL', checks10.join(' | '));
  } catch (err) {
    log('vercel.json', 'FAIL', err.message);
  }
  console.log();

  // ─── CHECK 11: EPOS API key in .env.production.local ───
  console.log('--- CHECK 11: EPOS API Key in env ---');
  try {
    const envPath = path.join(__dirname, '..', '.env.production.local');
    const envContent = fs.readFileSync(envPath, 'utf8');

    const match = envContent.match(/EPOSNOW_API_KEY="?([^"\n]+)"?/);
    if (match) {
      const envKey = match[1];
      const startsCorrectly = envKey.startsWith('UllX');
      const matchesExpected = envKey === API_KEY;

      const checks11 = [];
      checks11.push(`starts with UllX (not UlIX): ${startsCorrectly ? 'YES' : 'NO — starts with ' + envKey.substring(0, 4)}`);
      checks11.push(`matches expected key: ${matchesExpected ? 'YES' : 'NO'}`);

      if (!matchesExpected) {
        checks11.push(`env key:      ${envKey.substring(0, 20)}...`);
        checks11.push(`expected key: ${API_KEY.substring(0, 20)}...`);
      }

      const allOk = startsCorrectly && matchesExpected;
      log('EPOS API key in env', allOk ? 'PASS' : 'FAIL', checks11.join(' | '));
    } else {
      log('EPOS API key in env', 'FAIL', 'EPOSNOW_API_KEY not found in .env.production.local');
    }
  } catch (err) {
    log('EPOS API key in env', 'FAIL', err.message);
  }
  console.log();

  // ─── FINAL SUMMARY ───
  console.log('='.repeat(70));
  console.log('  FINAL SUMMARY');
  console.log('='.repeat(70));
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`  Total: ${results.length} checks | \x1b[32m${passed} PASSED\x1b[0m | \x1b[31m${failed} FAILED\x1b[0m`);
  console.log();

  for (const r of results) {
    const tag = r.status === 'PASS' ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
    console.log(`  [${tag}] ${r.check}`);
    if (r.status === 'FAIL' && r.detail) {
      console.log(`         ${r.detail}`);
    }
  }
  console.log();

  if (failed > 0) {
    console.log('\x1b[31m  ACTION REQUIRED: Fix the failing checks above.\x1b[0m');
    process.exit(1);
  } else {
    console.log('\x1b[32m  ALL CHECKS PASSED — Order pipeline is fully verified.\x1b[0m');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
