async function main() {
  const { SquareClient, SquareEnvironment } = await import('square');
  const client = new SquareClient({ token: process.env.SQUARE_ACCESS_TOKEN, environment: SquareEnvironment.Production });
  
  const orderId = 'Y4VWWhMxURrHK13WVBcXH4NWgkCZY';
  const resp = await client.orders.get({ orderId });
  const order = resp.order;
  
  console.log('=== SQUARE ORDER METADATA VERIFICATION ===');
  console.log('Order ID:', order.id);
  console.log('State:', order.state);
  console.log('Metadata:', JSON.stringify(order.metadata, null, 2));
  console.log('Line Items:');
  for (const li of order.lineItems || []) {
    console.log('  -', li.quantity + 'x', li.name, '— $' + (Number(li.basePriceMoney?.amount || 0) / 100).toFixed(2));
  }
  
  // Check item_ids_0
  if (order.metadata?.item_ids_0 === 'sauce-bk') {
    console.log('\n✅ METADATA CHECK PASSED — item_ids_0 = "sauce-bk"');
  } else {
    console.log('\n❌ METADATA CHECK FAILED — item_ids_0 =', order.metadata?.item_ids_0);
  }
  
  if (order.metadata?.customer_name && order.metadata?.pickup_time) {
    console.log('✅ Customer info present:', order.metadata.customer_name, '| Pickup:', order.metadata.pickup_time);
  }
}
main().catch(e => console.error(e.message));
