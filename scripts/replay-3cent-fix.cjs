const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
const URL = 'https://api.eposnowhq.com';
(async () => {
  const ctNow = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
  const ctDate = new Date(ctNow).toISOString().replace('Z', '');
  const tx = {
    DeviceId: 100304, StaffId: 206697, DateTime: ctDate, StatusId: 1, ServiceType: 1, TotalAmount: 0.03,
    TransactionItems: [
      { ProductId: 39336527, Quantity: 1, UnitPrice: 0.01, Notes: 'ONLINE ORDER | blayke elder | Pickup: 8:30 PM | TO-GO' },
      { ProductId: 39336531, Quantity: 1, UnitPrice: 0.01 },
      { ProductId: 39336526, Quantity: 1, UnitPrice: 0.01 }
    ],
    Tenders: [{ TenderTypeId: 130092, Amount: 0.03 }]
  };
  const resp = await fetch(URL + '/api/v4/Transaction', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(tx)
  });
  console.log('Status:', resp.status);
  const data = await resp.json();
  console.log('Transaction ID:', data.Id);
  if (resp.ok) console.log('✅ 3-cent order pushed to EPOS Now successfully');
})();
