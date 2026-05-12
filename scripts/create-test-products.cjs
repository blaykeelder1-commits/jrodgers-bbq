const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const URL = 'https://api.eposnowhq.com';

async function main() {
  const products = [
    { Name: 'XL Drink (Test)', Description: 'XL Drink', CategoryId: 1247894, SalePrice: 0.01, CostPrice: 0, EatOutPrice: 0, SalePriceTaxGroupId: 430664, EatOutPriceTaxGroupId: 430664, CostPriceTaxGroupId: 430664, SellOnTill: true, ProductType: 0 },
    { Name: 'Rib Dinner (Test)', Description: 'Rib Dinner Test', CategoryId: 1247894, SalePrice: 0.01, CostPrice: 0, EatOutPrice: 0, SalePriceTaxGroupId: 430664, EatOutPriceTaxGroupId: 430664, CostPriceTaxGroupId: 430664, SellOnTill: true, ProductType: 0 },
    { Name: 'Baked Beans S (Test)', Description: 'Baked Beans Small Test', CategoryId: 1247894, SalePrice: 0.01, CostPrice: 0, EatOutPrice: 0, SalePriceTaxGroupId: 430664, EatOutPriceTaxGroupId: 430664, CostPriceTaxGroupId: 430664, SellOnTill: true, ProductType: 0 },
    { Name: 'Baked Beans M (Test)', Description: 'Baked Beans Medium Test', CategoryId: 1247894, SalePrice: 0.01, CostPrice: 0, EatOutPrice: 0, SalePriceTaxGroupId: 430664, EatOutPriceTaxGroupId: 430664, CostPriceTaxGroupId: 430664, SellOnTill: true, ProductType: 0 },
    { Name: 'Baked Beans L (Test)', Description: 'Baked Beans Large Test', CategoryId: 1247894, SalePrice: 0.01, CostPrice: 0, EatOutPrice: 0, SalePriceTaxGroupId: 430664, EatOutPriceTaxGroupId: 430664, CostPriceTaxGroupId: 430664, SellOnTill: true, ProductType: 0 },
    { Name: 'Apple Pie S (Test)', Description: 'Apple Pie Small Test', CategoryId: 1247894, SalePrice: 0.01, CostPrice: 0, EatOutPrice: 0, SalePriceTaxGroupId: 430664, EatOutPriceTaxGroupId: 430664, CostPriceTaxGroupId: 430664, SellOnTill: true, ProductType: 0 },
    { Name: 'Apple Pie M (Test)', Description: 'Apple Pie Medium Test', CategoryId: 1247894, SalePrice: 0.01, CostPrice: 0, EatOutPrice: 0, SalePriceTaxGroupId: 430664, EatOutPriceTaxGroupId: 430664, CostPriceTaxGroupId: 430664, SellOnTill: true, ProductType: 0 },
    { Name: 'Apple Pie L (Test)', Description: 'Apple Pie Large Test', CategoryId: 1247894, SalePrice: 0.01, CostPrice: 0, EatOutPrice: 0, SalePriceTaxGroupId: 430664, EatOutPriceTaxGroupId: 430664, CostPriceTaxGroupId: 430664, SellOnTill: true, ProductType: 0 }
  ];

  const resp = await fetch(URL + '/api/v4/Product', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(products)
  });

  console.log('Status:', resp.status);
  const data = await resp.json();
  
  for (const p of data) {
    console.log(`Created: ${p.Id} — ${p.Name} — $${p.SalePrice}`);
  }

  console.log('\nMapping for eposProductMap.js:');
  console.log(`  'test-xl-drink': ${data[0].Id},`);
  console.log(`  'test-rib-dinner': ${data[1].Id},`);
  console.log('\nSized mapping for eposSizedProductMap:');
  console.log(`  'test-baked-beans': { 'Small': ${data[2].Id}, 'Medium': ${data[3].Id}, 'Large': ${data[4].Id} },`);
  console.log(`  'test-apple-pie': { 'Small': ${data[5].Id}, 'Medium': ${data[6].Id}, 'Large': ${data[7].Id} },`);
}
main().catch(e => console.error(e));
