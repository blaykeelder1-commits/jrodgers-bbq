const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const API_URL = 'https://api.eposnowhq.com';

async function main() {
  const products = [
    { Name: 'BK BBQ Sauce', Description: 'BK BBQ Sauce', CategoryId: 1247894, SalePrice: 0.01, CostPrice: 0, EatOutPrice: 0, SalePriceTaxGroupId: 430664, EatOutPriceTaxGroupId: 430664, CostPriceTaxGroupId: 430664, SellOnTill: true, ProductType: 0 },
    { Name: 'BBQ Sauce', Description: 'BBQ Sauce', CategoryId: 1247894, SalePrice: 0.01, CostPrice: 0, EatOutPrice: 0, SalePriceTaxGroupId: 430664, EatOutPriceTaxGroupId: 430664, CostPriceTaxGroupId: 430664, SellOnTill: true, ProductType: 0 }
  ];

  const resp = await fetch(API_URL + '/api/v4/Product', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(products)
  });
  
  console.log('Status:', resp.status);
  const data = await resp.json();
  
  for (const p of data) {
    console.log('Created:', p.Id, p.Name, '$' + p.SalePrice);
  }
  
  console.log('\nUpdate eposProductMap.js:');
  console.log("  'sauce-bk': " + data[0].Id + ',');
  console.log("  'sauce-regular': " + data[1].Id + ',');
}

main().catch(e => console.error(e));
