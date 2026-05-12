const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const URL = 'https://api.eposnowhq.com';

// Replicate exactly what the webhook would have done
async function main() {
  const { eposProductMap, eposSizedProductMap } = await import('../api/lib/eposProductMap.js');
  
  // These are the items from the Square order
  const items = [
    { name: 'Rib Dinner (Test)', itemId: 'test-rib-dinner', selectedSize: null, quantity: 1, unitPriceCents: 1 },
    { name: 'Apple Pie (Test) (Small)', itemId: 'test-apple-pie', selectedSize: 'Small', quantity: 1, unitPriceCents: 1 },
    { name: 'XL Drink', itemId: 'test-xl-drink', selectedSize: null, quantity: 1, unitPriceCents: 1 }
  ];

  console.log('=== Resolving product IDs ===');
  for (const item of items) {
    let productId = null;
    if (eposSizedProductMap[item.itemId] && item.selectedSize) {
      productId = eposSizedProductMap[item.itemId][item.selectedSize];
      console.log(`${item.name}: sized map[${item.itemId}][${item.selectedSize}] = ${productId}`);
    } else {
      productId = eposProductMap[item.itemId];
      console.log(`${item.name}: direct map[${item.itemId}] = ${productId}`);
    }
  }

  // Now try the actual push
  console.log('\n=== Pushing to EPOS Now ===');
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow).toISOString().replace('Z', '');
  
  const txItems = [];
  txItems.push({ ProductId: 39336527, Quantity: 1, UnitPrice: 0.01, Notes: 'ONLINE ORDER | blayke elder | Pickup: 8:30 PM | TO-GO' });
  txItems.push({ ProductId: 39336531, Quantity: 1, UnitPrice: 0.01, Notes: '' });
  txItems.push({ ProductId: 39336526, Quantity: 1, UnitPrice: 0.01, Notes: '' });

  const tx = {
    DeviceId: 100304,
    StaffId: 206697,
    DateTime: ctDate,
    StatusId: 1,
    ServiceType: 1,
    TotalAmount: 0.03,
    TransactionItems: txItems,
    Tenders: [{ TenderTypeId: 130092, Amount: 0.03 }]
  };

  const resp = await fetch(URL + '/api/v4/Transaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(tx)
  });

  console.log('Status:', resp.status);
  const text = await resp.text();
  console.log('Response:', text.substring(0, 500));
}
main().catch(e => console.error(e));
