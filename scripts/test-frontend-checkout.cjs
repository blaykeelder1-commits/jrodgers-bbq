// Simulate the exact request the frontend sends to /api/create-checkout
async function main() {
  const payload = {
    items: [{
      name: 'BK BBQ Sauce',
      itemId: 'sauce-bk',
      quantity: 1,
      price: 0.01,
      selectedSides: undefined,
      selectedMeats: undefined,
      selectedSize: undefined,
      specialInstructions: undefined
    }],
    customerInfo: {
      name: 'Test Verification',
      phone: '2513884324',
      email: 'test@test.com'
    },
    pickupTime: '4:00 PM',
    orderType: 'pickup'
  };

  console.log('=== FRONTEND TEST: Calling /api/create-checkout ===');
  console.log('Payload:', JSON.stringify(payload, null, 2));

  const resp = await fetch('https://jrodgersbbq.net/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  console.log('Status:', resp.status);
  const data = await resp.json();
  console.log('Response:', JSON.stringify(data, null, 2));

  if (data.checkoutUrl) {
    console.log('\n✅ FRONTEND CHECK PASSED — Square checkout URL generated');
    console.log('Checkout URL:', data.checkoutUrl);
    console.log('Order ID:', data.orderId);
  } else {
    console.log('\n❌ FRONTEND CHECK FAILED —', data.error || 'No checkout URL');
  }
}
main().catch(e => console.error('Error:', e.message));
