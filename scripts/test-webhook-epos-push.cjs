// Simulate exactly what the webhook does: parse item_ids, resolve product, push to EPOS
async function main() {
  // 1. Parse compact item_ids format (what webhook does)
  const itemIdStr = 'sauce-bk';
  const sizeMap = { S: 'Small', M: 'Medium', L: 'Large' };
  const parsedItemIds = itemIdStr.split(',').map(part => {
    const [id, sizeChar] = part.split(':');
    return { itemId: id === '?' ? null : id, selectedSize: sizeMap[sizeChar] || null };
  });
  console.log('1. Parsed item IDs:', JSON.stringify(parsedItemIds));

  // 2. Build lineItems (what webhook builds from Square order)
  const lineItems = [{
    name: 'BK BBQ Sauce',
    quantity: 1,
    unitPriceCents: 1,
    total: '$0.01',
    itemId: parsedItemIds[0]?.itemId,
    selectedSize: parsedItemIds[0]?.selectedSize
  }];
  console.log('2. Line items:', JSON.stringify(lineItems));

  // 3. Test the EPOS push using the PRODUCTION env var (not hardcoded)
  const apiKey = process.env.EPOSNOW_API_KEY?.replace(/\n$/, '').replace(/\n$/, '');
  const apiUrl = process.env.EPOSNOW_API_URL?.replace(/\n$/, '').replace(/\n$/, '');
  console.log('3. Using env EPOS key (first 10 chars):', apiKey?.substring(0, 10));
  console.log('   Using env EPOS URL:', apiUrl);

  // 4. Import the product map and resolve
  const { eposProductMap } = await import('../api/lib/eposProductMap.js');
  const productId = eposProductMap[lineItems[0].itemId];
  console.log('4. Resolved ProductId:', productId, '(for itemId:', lineItems[0].itemId + ')');

  if (!productId) {
    console.log('❌ PRODUCT MAPPING FAILED');
    return;
  }

  // 5. Build and push transaction (same as eposnow.js)
  const transaction = {
    DeviceId: 127821,
    StaffId: 206697,
    DateTime: new Date().toISOString(),
    StatusId: 1,
    ServiceType: 1,
    TotalAmount: 0.01,
    TransactionItems: [{
      ProductId: productId,
      Quantity: 1,
      UnitPrice: 0.01,
      Notes: 'ONLINE ORDER | FINAL VERIFY | Pickup: 4:00 PM | PICKUP'
    }],
    Tenders: [{ TenderTypeId: 130092, Amount: 0.01 }]
  };

  console.log('5. Pushing transaction with PRODUCTION env key...');
  const resp = await fetch(apiUrl + '/api/v4/Transaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  });

  console.log('   Status:', resp.status);
  if (resp.ok) {
    const data = await resp.json();
    console.log('   Transaction ID:', data.Id);
    console.log('\n✅ FULL BACKEND PIPELINE PASSED — Order would print to KITCHEN');
  } else {
    const err = await resp.text();
    console.log('   Error:', err);
    console.log('\n❌ BACKEND PUSH FAILED');
  }
}
main().catch(e => console.error(e));
