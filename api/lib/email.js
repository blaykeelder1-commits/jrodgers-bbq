/**
 * Email helpers using Resend API (plain fetch, no SDK).
 */

const RESEND_URL = 'https://api.resend.com/emails';
const RESTAURANT_EMAIL = 'jrodgersbbq@protonmail.com';
const FROM_ADDRESS = process.env.RESEND_DOMAIN_VERIFIED === 'true'
  ? 'J Rodgers BBQ <orders@jrodgersbbq.net>'
  : 'J Rodgers BBQ <onboarding@resend.dev>';

/**
 * Ensure pickup time is at least 45 minutes from now.
 * If the customer selected a specific time, push it out if it's less than 45 min away.
 * If ASAP or empty, set to 45 minutes from now.
 */
function resolvePickupTime(pickupTime) {
  const now = new Date();
  const fortyFiveOut = new Date(now.getTime() + 45 * 60 * 1000);

  // Format a Date to readable time like "4:30 PM"
  const formatTime = (d) => d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Chicago'
  });

  // If ASAP or not provided, default to 45 min out
  if (!pickupTime || pickupTime.toLowerCase() === 'asap') {
    return formatTime(fortyFiveOut);
  }

  // Try to parse the provided time and ensure it's at least 45 min out
  try {
    const today = now.toISOString().split('T')[0];
    const parsed = new Date(`${today}T${to24Hour(pickupTime)}`);
    if (!isNaN(parsed.getTime()) && parsed < fortyFiveOut) {
      return formatTime(fortyFiveOut);
    }
  } catch {
    // Can't parse — just return the original
  }

  return pickupTime;
}

/** Convert "3:30 PM" style to "15:30" for parsing */
function to24Hour(timeStr) {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return timeStr;
  let h = parseInt(match[1]);
  const m = match[2];
  const period = match[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m}:00`;
}

/**
 * Send both customer confirmation and restaurant notification emails.
 * Skips customer email if no email address was provided.
 */
export async function sendOrderEmails({ customerName, customerPhone, customerEmail, pickupTime, orderType, lineItems, totalDisplay }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not configured — skipping emails');
    return { customer: null, restaurant: null };
  }

  // Ensure pickup is at least 45 min out
  const resolvedPickup = resolvePickupTime(pickupTime);

  const itemRows = lineItems
    .map(li => `
      <tr>
        <td style="padding:14px 20px;border-bottom:1px solid #f0e6d3;color:#3d2b1f;font-size:15px">${li.quantity}x ${escapeHtml(li.name)}</td>
        <td class="item-price" style="padding:14px 20px;border-bottom:1px solid #f0e6d3;text-align:right;color:#3d2b1f;font-size:15px;white-space:nowrap">${li.total}</td>
      </tr>`)
    .join('');

  const results = {};

  // ── Customer confirmation ──
  if (customerEmail) {
    const customerHtml = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  @media only screen and (max-width: 480px) {
    .pickup-table tr, .pickup-table td { display: block !important; text-align: left !important; padding: 8px 0 !important; }
    .section-pad { padding-left: 16px !important; padding-right: 16px !important; }
    .header-title { font-size: 22px !important; }
    .item-price { white-space: normal !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'Georgia','Times New Roman',serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff">

    <!-- Header -->
    <div style="background:#2c1810;padding:32px 20px;text-align:center">
      <h1 class="header-title" style="margin:0;color:#e8c36a;font-size:28px;font-weight:700;letter-spacing:1px">J RODGERS BBQ</h1>
      <p style="margin:4px 0 0;color:#d4a574;font-size:13px;letter-spacing:3px;text-transform:uppercase">& Soul Food</p>
    </div>

    <!-- Welcome -->
    <div class="section-pad" style="padding:32px 28px 20px;text-align:center">
      <p style="color:#c41e3a;font-size:14px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Order Confirmed</p>
      <h2 style="margin:0 0 8px;color:#2c1810;font-size:24px;font-weight:400">Thank you, ${escapeHtml(customerName)}!</h2>
      <p style="color:#6b5744;font-size:15px;margin:0;line-height:1.6">We're firing up the smoker and getting your order ready.<br>Here's a summary of what's coming your way.</p>
    </div>

    <!-- Pickup Info -->
    <div style="margin:0 28px;background:#fdf8f0;border-left:4px solid #c41e3a;padding:16px 20px;border-radius:0 6px 6px 0">
      <table class="pickup-table" style="width:100%"><tr>
        <td style="padding:0">
          <p style="margin:0;color:#8b6914;font-size:12px;text-transform:uppercase;letter-spacing:1px">Pickup Time</p>
          <p style="margin:4px 0 0;color:#2c1810;font-size:20px;font-weight:700">${escapeHtml(resolvedPickup)}</p>
        </td>
        <td style="padding:0;text-align:right">
          <p style="margin:0;color:#8b6914;font-size:12px;text-transform:uppercase;letter-spacing:1px">Order Type</p>
          <p style="margin:4px 0 0;color:#2c1810;font-size:20px;font-weight:700">${escapeHtml(capitalize(orderType))}</p>
        </td>
      </tr></table>
    </div>

    <!-- Order Items -->
    <div class="section-pad" style="padding:24px 28px">
      <p style="color:#8b6914;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid #e8c36a">Your Order</p>
      <table style="width:100%;border-collapse:collapse">
        ${itemRows}
        <tr>
          <td style="padding:16px 20px 8px;font-weight:700;color:#2c1810;font-size:17px">Total</td>
          <td style="padding:16px 20px 8px;text-align:right;font-weight:700;color:#c41e3a;font-size:20px">${totalDisplay}</td>
        </tr>
      </table>
    </div>

    <!-- Divider -->
    <div class="section-pad" style="padding:0 28px"><hr style="border:none;border-top:1px solid #f0e6d3;margin:0"></div>

    <!-- Footer -->
    <div class="section-pad" style="padding:24px 28px 32px;text-align:center">
      <p style="color:#2c1810;font-size:16px;font-weight:700;margin:0 0 6px">J Rodgers BBQ & Soul Food</p>
      <p style="color:#6b5744;font-size:14px;margin:0 0 4px;line-height:1.5">(251) 675-3282</p>
      <a href="https://jrodgersbbq.net" style="color:#c41e3a;font-size:14px;text-decoration:none">jrodgersbbq.net</a>
      <p style="color:#a89279;font-size:12px;margin:20px 0 0;line-height:1.5">Questions about your order? Give us a call — we're happy to help.</p>
    </div>

  </div>
</body></html>`;

    results.customer = await sendEmail(apiKey, {
      from: FROM_ADDRESS,
      to: customerEmail,
      subject: 'Your J Rodgers BBQ Order Confirmation',
      html: customerHtml
    });
  }

  // ── Restaurant notification ──
  const restaurantHtml = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  @media only screen and (max-width: 480px) {
    .order-table tr, .order-table td { display: block !important; text-align: left !important; padding: 8px 0 !important; }
    .section-pad { padding-left: 12px !important; padding-right: 12px !important; }
    .item-price { white-space: normal !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#fff">

    <div style="background:#c41e3a;padding:20px;text-align:center">
      <h2 style="margin:0;color:#fff;font-size:22px;text-transform:uppercase;letter-spacing:2px">New Online Order</h2>
    </div>

    <div class="section-pad" style="background:#fff3cd;padding:16px 24px;border-bottom:3px solid #e8c36a">
      <table class="order-table" style="width:100%"><tr>
        <td><p style="margin:0;font-size:13px;color:#856404;text-transform:uppercase">Order Type</p><p style="margin:4px 0 0;font-size:22px;font-weight:700;color:#2c1810">${escapeHtml(capitalize(orderType))}</p></td>
        <td style="text-align:right"><p style="margin:0;font-size:13px;color:#856404;text-transform:uppercase">Ready By</p><p style="margin:4px 0 0;font-size:22px;font-weight:700;color:#c41e3a">${escapeHtml(resolvedPickup)}</p></td>
      </tr></table>
    </div>

    <div class="section-pad" style="padding:20px 24px;background:#f8f9fa;border-bottom:1px solid #e9ecef">
      <p style="margin:0;font-size:15px"><strong>Customer:</strong> ${escapeHtml(customerName)}</p>
      <p style="margin:4px 0 0;font-size:15px"><strong>Phone:</strong> ${escapeHtml(customerPhone)}</p>
      ${customerEmail ? `<p style="margin:4px 0 0;font-size:15px"><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>` : ''}
    </div>

    <div class="section-pad" style="padding:20px 24px">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr><th style="text-align:left;padding:8px 12px;border-bottom:2px solid #c41e3a;font-size:13px;text-transform:uppercase;color:#666">Item</th><th style="text-align:right;padding:8px 12px;border-bottom:2px solid #c41e3a;font-size:13px;text-transform:uppercase;color:#666">Price</th></tr></thead>
        <tbody>
          ${lineItems.map(li => `<tr><td style="padding:10px 12px;border-bottom:1px solid #eee;font-size:15px">${li.quantity}x ${escapeHtml(li.name)}</td><td class="item-price" style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-size:15px;white-space:nowrap">${li.total}</td></tr>`).join('')}
        </tbody>
        <tfoot><tr><td style="padding:14px 12px;font-weight:700;font-size:17px">Total</td><td style="padding:14px 12px;text-align:right;font-weight:700;font-size:20px;color:#c41e3a">${totalDisplay}</td></tr></tfoot>
      </table>
    </div>

  </div>
</body></html>`;

  results.restaurant = await sendEmail(apiKey, {
    from: FROM_ADDRESS,
    to: RESTAURANT_EMAIL,
    subject: `New Online Order - ${customerName}`,
    html: restaurantHtml
  });

  return results;
}

/**
 * Send an alert email when an order fails to push to EPOS after max retries.
 * Gives staff the info they need to manually enter it.
 */
export async function sendEposFailureAlert({ orderId, customerName, customerPhone, pickupTime, items, total, retries }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not configured — cannot send EPOS failure alert');
    return { success: false, error: 'no api key' };
  }

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#fff">
    <div style="background:#c41e3a;padding:20px;text-align:center">
      <h2 style="margin:0;color:#fff;font-size:20px">EPOS Push Failed — Manual Entry Needed</h2>
    </div>
    <div style="padding:24px">
      <p style="font-size:15px;color:#333;margin:0 0 16px">An online order failed to sync to EPOS after ${retries} attempts. Please enter it manually.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:8px 0;font-weight:700;color:#666;width:120px">Customer</td><td style="padding:8px 0;color:#333">${escapeHtml(customerName)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;color:#666">Phone</td><td style="padding:8px 0;color:#333">${escapeHtml(customerPhone)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;color:#666">Pickup</td><td style="padding:8px 0;color:#333">${escapeHtml(pickupTime)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;color:#666">Items</td><td style="padding:8px 0;color:#333">${escapeHtml(items)}</td></tr>
        <tr><td style="padding:8px 0;font-weight:700;color:#666">Total</td><td style="padding:8px 0;color:#c41e3a;font-weight:700;font-size:18px">${escapeHtml(total)}</td></tr>
      </table>
      <p style="font-size:12px;color:#999;margin:16px 0 0">Order ID: ${escapeHtml(orderId)}</p>
    </div>
  </div>
</body></html>`;

  return sendEmail(apiKey, {
    from: FROM_ADDRESS,
    to: RESTAURANT_EMAIL,
    subject: `EPOS Alert: Order from ${customerName} needs manual entry`,
    html
  });
}

async function sendEmail(apiKey, { from, to, subject, html }) {
  try {
    const resp = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to, subject, html })
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error(`[email] Failed to send to ${to}: ${resp.status} ${body}`);
      return { success: false, error: body };
    }

    const data = await resp.json();
    console.log(`[email] Sent to ${to}: ${data.id}`);
    return { success: true, id: data.id };
  } catch (err) {
    console.error(`[email] Error sending to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
