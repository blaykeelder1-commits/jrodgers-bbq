/**
 * Epos Now POS integration helper.
 * Pushes online orders to the restaurant's Epos Now system.
 */

/**
 * Push an order to Epos Now POS.
 * Gracefully skips if EPOSNOW_API_KEY or EPOSNOW_API_URL are not configured.
 */
export async function pushToEposNow({ customerName, pickupTime, orderType, lineItems, totalCents }) {
  const apiKey = process.env.EPOSNOW_API_KEY;
  const apiUrl = process.env.EPOSNOW_API_URL;

  if (!apiKey || !apiUrl) {
    console.warn('[eposnow] EPOSNOW_API_KEY or EPOSNOW_API_URL not configured — skipping POS push');
    return { skipped: true };
  }

  const transactionItems = lineItems.map(li => ({
    Name: li.name,
    Quantity: li.quantity,
    UnitPrice: li.unitPriceCents / 100
  }));

  const transaction = {
    DateTime: new Date().toISOString(),
    Items: transactionItems,
    TotalAmount: totalCents / 100,
    Notes: `ONLINE ORDER | ${customerName} | Pickup: ${pickupTime} | ${orderType}`.toUpperCase()
  };

  try {
    const resp = await fetch(`${apiUrl.replace(/\/+$/, '')}/api/v4/Transaction`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error(`[eposnow] Failed: ${resp.status} ${body}`);
      return { success: false, error: body };
    }

    const data = await resp.json();
    console.log(`[eposnow] Transaction created:`, data.Id || data.id || 'ok');
    return { success: true, data };
  } catch (err) {
    console.error('[eposnow] Error:', err.message);
    return { success: false, error: err.message };
  }
}
