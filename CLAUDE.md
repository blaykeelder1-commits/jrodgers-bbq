# J Rodgers BBQ & Soul Food

Online ordering platform for BBQ restaurant in Saraland, Alabama.
Live at https://jrodgersbbq.net — deployed on Vercel.

## Tech Stack

- **Frontend:** React 19 + Vite 7, vanilla CSS with CSS variables
- **Backend:** Vercel serverless functions (Node.js)
- **Payments:** Square (payment links, not on-site processing)
- **Email:** Resend API (plain fetch, no SDK)
- **POS:** EPOS Now integration for kitchen orders
- **No TypeScript** — pure JSX/JS

## Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main router, providers |
| `src/pages/Order.jsx` | Shopping cart, 3-step checkout flow |
| `src/pages/Menu.jsx` | Menu display from static data |
| `src/pages/KitchenOrders.jsx` | Admin order dashboard |
| `src/context/CartContext.jsx` | Cart state (useReducer + localStorage) |
| `src/data/menuData.js` | All menu items, prices, customizations (static, no CMS) |
| `src/styles/variables.css` | Design tokens (colors, spacing, typography) |
| `api/create-checkout.js` | Creates Square payment link |
| `api/webhooks/square.js` | Payment completion → emails + EPOS push |
| `api/cron/push-orders.js` | Daily safety net for missed EPOS syncs |
| `api/lib/email.js` | Email templates + sending |
| `api/lib/eposnow.js` | EPOS Now POS integration |
| `api/lib/eposProductMap.js` | Menu item → EPOS Product ID mapping |

## Development

```bash
npm run dev      # Vite dev server (HMR)
npm run build    # Production build → /dist
npm run lint     # ESLint
```

Deploys automatically on git push to Vercel.

## Gotchas

- **Menu is static** — prices/items hardcoded in `menuData.js`, changes require redeploy
- **Tax rate 10%** hardcoded in `Order.jsx` and `create-checkout.js`
- **3% credit card surcharge** hardcoded in multiple places
- **Pickup minimum 45 min** — auto-pushed forward if customer picks closer time
- **Square metadata chunking** — item IDs split across `item_ids_0`, `item_ids_1` etc. (60-char limit per key)
- **EPOS resilience** — webhook pushes to EPOS first; if it fails, alert email sent; daily cron catches misses
- **Idempotency** — `emails_sent` and `epos_sent` flags in Square metadata prevent duplicate processing
- **Webhook signature** — verified in production only; skipped in dev if key not set
- **Cron processes max 3 orders/run** — safety measure for serverless timeout
- **Timezone** — America/Chicago (Central Time) for all time displays

## Environment Variables

Backend (Vercel):
- `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_WEBHOOK_SIGNATURE_KEY`
- `RESEND_API_KEY`, `RESEND_DOMAIN_VERIFIED` (string 'true')
- `EPOSNOW_API_KEY`, `EPOSNOW_API_URL`
- `SITE_URL` (defaults to https://jrodgersbbq.net)
- `CRON_SECRET` (Bearer token for cron auth)

## Code Conventions

- 2-space indentation, functional components + hooks only
- CSS: BEM-inspired naming, CSS variables for tokens, mobile-first
- API: Vercel serverless handlers, JSON responses, HMAC webhook verification
- Cart: useReducer with localStorage persistence, dedup by customization hash

## Project Rules

- **No TypeScript** — this project is pure JS/JSX. Don't introduce .ts files.
- **No CSS frameworks** — vanilla CSS with variables only. No Tailwind, no styled-components.
- **Menu changes = menuData.js** — all menu items, prices, and customizations live in `src/data/menuData.js`. Never hardcode menu data elsewhere.
- **Test payments via Square sandbox** — never use production Square keys in dev.
- **Verify EPOS mapping** — when adding menu items, update `api/lib/eposProductMap.js` with the corresponding EPOS Now Product ID.
- **Idempotency is sacred** — any webhook/cron handler must check metadata flags before acting. Never skip this.
- **Deploy = git push** — Vercel auto-deploys. Run `npm run build` locally first to catch errors before pushing.
