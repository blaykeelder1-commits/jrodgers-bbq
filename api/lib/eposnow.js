/**
 * Epos Now POS integration helper.
 * Pushes online orders to the restaurant's Epos Now system as completed transactions.
 */
import { eposProductMap, eposSizedProductMap } from './eposProductMap.js';

// EPOS Now constants
const DEVICE_ID = 100304;   // "RESTAURANT" device (has kitchen printer connected)
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
    // Skip $0 included sides — their names are captured in the parent item's display name
    if (li.unitPriceCents === 0) continue;

    const productId = resolveProductId(li);
    if (productId) {
      const item = {
        ProductId: productId,
        Quantity: li.quantity,
        UnitPrice: li.unitPriceCents / 100
      };
      // Parse customization details from display name, e.g.
      // "Rib Dinner (Sides: Yo-Jo Beans, Cole Slaw | Note: extra sauce)"
      const customMatch = li.name.match(/\((.+)\)$/);
      if (customMatch) {
        item.Notes = customMatch[1];
      }
      if (li.notes) item.Notes = li.notes;
      transactionItems.push(item);
    } else {
      // Track unmapped items — still include as notes so kitchen knows
      unmappedItems.push(`${li.quantity}x ${li.name}`);
    }
  }

  // If no items could be mapped, log and skip
  if (transactionItems.length === 0 && unmappedItems.length === 0) {
    console.warn('[eposnow] No items to push');
    return { skipped: true, reason: 'no items' };
  }

  // Build order-level note for kitchen (attached to first item)
  const notesParts = [
    'ONLINE ORDER',
    customerName,
    `Pickup: ${pickupTime}`,
    orderType === 'to-go' ? 'TO-GO' : 'PICKUP'
  ];
  if (unmappedItems.length > 0) {
    notesParts.push(`ALSO: ${unmappedItems.join(', ')}`);
  }

  // Attach order note to first item, preserving any existing item-level notes (sides/meats)
  if (transactionItems.length > 0) {
    const orderNote = notesParts.join(' | ').substring(0, 250);
    const existing = transactionItems[0].Notes;
    transactionItems[0].Notes = existing
      ? `${orderNote} || ${existing}`
      : orderNote;
  }

  // Send Central Time (Alabama) so EPOS receipt shows correct local time
  // CDT (March-Nov) = UTC-5, CST (Nov-Mar) = UTC-6
  // Determine offset by checking if we're in DST
  const now = new Date();
  const jan = new Date(now.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(now.getFullYear(), 6, 1).getTimezoneOffset();
  // On Vercel (UTC), offset is always 0, so compute CT directly: UTC-5 (CDT) or UTC-6 (CST)
  // Alabama observes CDT from 2nd Sunday March to 1st Sunday November
  const month = now.getUTCMonth(); // 0-11
  const isDST = month >= 2 && month <= 10; // Approximate: March through October
  const ctOffsetHours = isDST ? -5 : -6;
  const ctTime = new Date(now.getTime() + ctOffsetHours * 60 * 60 * 1000);
  const ctDate = ctTime.toISOString().replace('Z', '');

  // Calculate total from the items we're actually sending (EPOS validates this matches)
  const itemsTotal = transactionItems.reduce((sum, item) => sum + item.UnitPrice * item.Quantity, 0);
  const roundedTotal = Math.round(itemsTotal * 100) / 100;

  const transaction = {
    DeviceId: DEVICE_ID,
    StaffId: STAFF_ID,
    DateTime: ctDate,
    StatusId: 1, // Completed
    ServiceType: 1, // Takeaway (both pickup and to-go are takeaway)
    TotalAmount: roundedTotal,
    TransactionItems: transactionItems,
    Tenders: [
      {
        TenderTypeId: TENDER_TYPE_ID,
        Amount: roundedTotal
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
