# Stripe Integration Guide & Next Steps

This document is the single source of truth for the Stripe Checkout integration on **CarePlus Health Shop**.

---

## Values to Replace

The following values are placeholders and must be updated before going live.

**Files containing placeholders:**
- [vite.config.ts](vite.config.ts)
- [.env.local](.env.local)

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| `mode` | `payment` | Set to `"payment"` for one-time purchases or `"subscription"` for recurring replenishment orders. |
| `line_items[].price` | `price_...` (or dynamic cart `price_data`) | Your actual Stripe Price ID from your Stripe Dashboard ([https://dashboard.stripe.com/prices](https://dashboard.stripe.com/prices)) or created via API. |
| `STRIPE_SECRET_KEY` | `sk_live_...` *(Configured in .env.local)* | Live secret key active in private `.env.local` file (never commit). |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` *(Configured in .env.local)* | Live publishable key active in private `.env.local` file. |
| `STRIPE_WEBHOOK_SECRET` | *(Optional / pending)* | Webhook signing secret starting with `whsec_...` from [https://dashboard.stripe.com/workbench/webhooks](https://dashboard.stripe.com/workbench/webhooks) (if receiving webhooks). |

---

## Configured Parameters

These parameters were configured in Checkout Studio and are already set correctly in [vite.config.ts](vite.config.ts) and [src/pages/CheckoutPage.tsx](src/pages/CheckoutPage.tsx).

**Files containing these parameters:**
- [vite.config.ts](vite.config.ts)
- [src/pages/CheckoutPage.tsx](src/pages/CheckoutPage.tsx)

| Parameter | Value | Description |
|-----------|-------|-------------|
| `ui_mode` | `form` | Embedded payment form inside the CarePlus checkout experience. |
| `billing_address_collection` | `auto` | Automatically collects billing address when required by the card issuer. |
| `phone_number_collection.enabled` | `false` | Phone collection managed through customer form fields. |
| `automatic_tax.enabled` | `false` | UK healthcare and retail VAT handled by the dispensary catalog. |
| `submit_type` | `auto` | Automatically presents payment confirmation based on checkout intent. |
| `name_collection.individual.enabled` | `true` | Enables individual customer name collection on the form. |
| `name_collection.individual.optional` | `true` | Makes individual name optional if prefilled from patient details. |
| `name_collection.business.enabled` | `true` | Allows business/corporate orders if purchasing on behalf of a clinic. |
| `name_collection.business.optional` | `true` | Business name optional for general retail patients. |
| `saved_payment_method_options.payment_method_save` | `enabled` | Allows customers to securely save payment cards for future refills. |
| `integration_identifier` | `custom_embedded_web_0001` | Checkout Studio integration tracking identifier. |

---

## Setup and Next Steps

### 1. Environment Variables & API Keys
Add your Stripe keys to your `.env.local` file:

```bash
# Stripe API Keys (Get from https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Webhook signing secret (Get from https://dashboard.stripe.com/workbench/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...
```

> **Note on Naming Consistency:** Because this application is built with Vite, all browser-accessible variables are prefixed with `VITE_` (`VITE_STRIPE_PUBLISHABLE_KEY`), while server-only variables (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`) do not use this prefix.

### 2. Project Structure & Key Files
- [index.html](index.html): Loads the official Stripe Dahlia SDK (`https://js.stripe.com/dahlia/stripe.js`) directly in `<head>`.
- [vite.config.ts](vite.config.ts):
  - `POST /api/create-checkout-session`: Server endpoint creating the Stripe Checkout session with `ui_mode: "form"`.
  - `POST /api/webhook`: Webhook endpoint listening for `checkout.session.completed` events.
  - `GET /api/stripe-config` & `POST /api/stripe-config`: Configuration endpoints allowing seamless key verification from the app.
- [src/pages/CheckoutPage.tsx](src/pages/CheckoutPage.tsx):
  - Renders `<div id="checkout-form"></div>` container.
  - Initializes `stripe.initCheckoutFormSdk({ clientSecret, appearance })`.
  - Mounts the embedded form and wires the `confirm` event handler to verify and complete orders into Neon Postgres.

### 3. How the Integration Works
```
1. Customer enters delivery address & shipping service on #checkout
2. Client calls POST /api/create-checkout-session
3. Server invokes stripe.checkout.sessions.create({ ui_mode: 'form', ... })
4. Server returns { client_secret: session.client_secret }
5. Client calls stripe.initCheckoutFormSdk({ clientSecret, appearance })
6. Form mounts into <div id="checkout-form"></div>
7. Customer enters card details and submits
8. form.on('confirm') triggers actions.confirm({ formConfirmEvent: event })
9. Order details & payment reference are persisted in Neon Postgres
10. Customer is redirected to #order-confirmation with receipt
```

### 4. Testing Cards & Test Mode
When using test keys (`pk_test_...` and `sk_test_...`), test payments using standard Stripe test card numbers:

| Card Type | Card Number | Expiry | CVC | Country |
|-----------|-------------|--------|-----|---------|
| Standard UK Visa | `4242 4242 4242 4242` | Any future date | Any 3 digits | United Kingdom |
| 3D Secure / SCA Verification | `4000 0027 6000 3184` | Any future date | Any 3 digits | United Kingdom |
| Declined Card Test | `4000 0588 5000 4880` | Any future date | Any 3 digits | United Kingdom |

### 5. Next Steps
1. **Replace `price_...` placeholder:** Create your products or prices in Stripe Dashboard ([https://dashboard.stripe.com/prices](https://dashboard.stripe.com/prices)) and map them in `sessionParams.line_items`.
2. **Set up Webhook Listener:** For local webhook testing, run the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:5174/api/webhook
   ```
3. **Fulfillment & Order Tracking:** Review completed orders in the Admin Portal ([http://localhost:5174/#admin](http://localhost:5174/#admin)) under the **Customer Orders** tab.

### Resources
- Stripe Support: [https://support.stripe.com](https://support.stripe.com)
- Stripe Documentation & MCP: [https://docs.stripe.com/mcp](https://docs.stripe.com/mcp)
- Embedded Form Integration Guide: [https://docs.stripe.com/checkout/embedded/quickstart](https://docs.stripe.com/checkout/embedded/quickstart)
