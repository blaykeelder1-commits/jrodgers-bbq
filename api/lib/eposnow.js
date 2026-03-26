/**
 * Epos Now POS integration helper.
 * Pushes online orders to the restaurant's Epos Now system as completed transactions.
 */
import { eposProductMap, eposSizedProductMap } from './eposProductMap.js';

// EPOS Now constants
const DEVICE_ID = 127821;   // "API" device
const STAFF_ID = 206697;    // "Manager"
const TENDER_TYPE_ID = 130092; // "Pay By Link"

/**
 * Resolve a line item to an EPOS Now ProductId.
 * Returns the ProductId or null if no match exists.
 */
function resolveProductId(lineItem) {
  // Extract the base item ID (strip size suffix from name like "YO - Jo Beans (Small)")
  const itemId = lineItem.itemId;
  if (!itemId) return null;

  // Check sized items first
  if (eposSizedProductMap[itemId] && lineItem.selectedSize) {
    return eposSizedProductMap[itemId][lineItem.selectedSize] || null;
  }

  // Check direct mapping
  return eposProductMap[itemId] || null;
}

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

  // Build transaction items from line items
  const transactionItems = [];
  const unmappedItems = [];

  for (const li of lineItems) {
    const productId = resolveProductId(li);
    if (productId) {
      transactionItems.push({
        ProductId: productId,
        Quantity: li.quantity,
        UnitPrice: li.unitPriceCents / 100,
        Notes: li.notes || ''
      });
    } else {
      // Track unmapped items — still include as notes so kitchen knows
      unmappedItems.push(`${li.quantity}x ${li.name} ($${(li.unitPriceCents / 100).toFixed(2)})`);
    }
  }

  // If no items could be mapped, log and skip
  if (transactionItems.length === 0 && unmappedItems.length === 0) {
    console.warn('[eposnow] No items to push');
    return { skipped: true, reason: 'no items' };
  }

  // Build order notes for kitchen
  const notesParts = [
    'ONLINE ORDER',
    customerName,
    `Pickup: ${pickupTime}`,
    orderType?.toUpperCase()
  ];
  if (unmappedItems.length > 0) {
    notesParts.push(`ALSO: ${unmappedItems.join(', ')}`);
  }

  // Add notes to the first transaction item so kitchen sees it
  if (transactionItems.length > 0) {
    const orderNote = notesParts.join(' | ').substring(0, 80);
    transactionItems[0].Notes = orderNote;
  }

  const transaction = {
    DeviceId: DEVICE_ID,
    StaffId: STAFF_ID,
    DateTime: new Date().toISOString(),
    StatusId: 1, // Completed
    ServiceType: orderType === 'to-go' ? 1 : 1, // Takeaway for both pickup and to-go
    TotalAmount: totalCents / 100,
    TransactionItems: transactionItems,
    Tenders: [
      {
        TenderTypeId: TENDER_TYPE_ID,
        Amount: totalCents / 100
      }
    ]
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
    console.log(`[eposnow] Transaction created: ${data.Id || data.id || 'ok'} (${transactionItems.length} items mapped, ${unmappedItems.length} unmapped)`);
    return { success: true, data, unmappedItems };
  } catch (err) {
    console.error('[eposnow] Error:', err.message);
    return { success: false, error: err.message };
  }
}
