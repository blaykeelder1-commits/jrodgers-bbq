/**
 * Email helpers using Resend API (plain fetch, no SDK).
 */

const RESEND_URL = 'https://api.resend.com/emails';
const RESTAURANT_EMAIL = 'jrodgersbbq@protonmail.com';
const FROM_ADDRESS = 'J Rodgers BBQ <orders@jrodgersbbq.net>';

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

  const itemsHtml = lineItems
    .map(li => `<tr><td style="padding:4px 8px">${li.quantity}x ${li.name}</td><td style="padding:4px 8px;text-align:right">${li.total}</td></tr>`)
    .join('');

  const results = {};

  // Customer confirmation (only if email provided)
  if (customerEmail) {
    const customerHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#c41e3a">Thanks for your order, ${escapeHtml(customerName)}!</h2>
        <p><strong>Pickup Time:</strong> ${escapeHtml(pickupTime)}</p>
        <p><strong>Order Type:</strong> ${escapeHtml(orderType)}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead><tr style="border-bottom:2px solid #c41e3a"><th style="text-align:left;padding:4px 8px">Item</th><th style="text-align:right;padding:4px 8px">Price</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot><tr style="border-top:2px solid #333"><td style="padding:8px;font-weight:bold">Total</td><td style="padding:8px;text-align:right;font-weight:bold">${totalDisplay}</td></tr></tfoot>
        </table>
        <hr style="border:none;border-top:1px solid #ddd;margin:24px 0">
        <p><strong>J Rodgers BBQ & Soul Food</strong><br>
        Phone: (251) 675-3282<br>
        <a href="https://jrodgersbbq.net">jrodgersbbq.net</a></p>
      </div>`;

    results.customer = await sendEmail(apiKey, {
      from: FROM_ADDRESS,
      to: customerEmail,
      subject: 'Your J Rodgers BBQ Order Confirmation',
      html: customerHtml
    });
  }

  // Restaurant notification
  const restaurantHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#c41e3a;text-transform:uppercase">🔔 New Online Order</h2>
      <div style="background:#fff3cd;padding:12px;border-radius:6px;margin-bottom:16px">
        <p style="margin:0;font-size:18px"><strong>Order Type:</strong> ${escapeHtml(orderType)}</p>
        <p style="margin:4px 0 0;font-size:18px"><strong>Pickup Time:</strong> ${escapeHtml(pickupTime)}</p>
      </div>
      <p><strong>Customer:</strong> ${escapeHtml(customerName)}<br>
      <strong>Phone:</strong> ${escapeHtml(customerPhone)}<br>
      ${customerEmail ? `<strong>Email:</strong> ${escapeHtml(customerEmail)}<br>` : ''}</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead><tr style="border-bottom:2px solid #c41e3a"><th style="text-align:left;padding:4px 8px">Item</th><th style="text-align:right;padding:4px 8px">Price</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot><tr style="border-top:2px solid #333"><td style="padding:8px;font-weight:bold">Total</td><td style="padding:8px;text-align:right;font-weight:bold">${totalDisplay}</td></tr></tfoot>
      </table>
    </div>`;

  results.restaurant = await sendEmail(apiKey, {
    from: FROM_ADDRESS,
    to: RESTAURANT_EMAIL,
    subject: `New Online Order - ${customerName}`,
    html: restaurantHtml
  });

  return results;
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
