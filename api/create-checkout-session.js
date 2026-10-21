import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

function getStripeSecretKey() {
  if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY;
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
    const match = envFile.match(/STRIPE_SECRET_KEY=["']?([^"'\n\r]+)["']?/);
    if (match) return match[1].trim();
  } catch {}
  return '';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secretKey = getStripeSecretKey();
  if (!secretKey) {
    return res.status(200).json({
      client_secret: 'cs_test_mock_secret',
      message: 'STRIPE_SECRET_KEY not set in environment',
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch {}
    }
    const items = Array.isArray(body?.items) && body.items.length > 0 ? body.items : null;

    let line_items = [
      {
        price_data: {
          currency: 'gbp',
          product_data: { name: 'CarePlus Health Dispensary Order' },
          unit_amount: 1000,
        },
        quantity: 1,
      },
    ];

    if (items) {
      line_items = items.map((item) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.product?.name || item.name || 'CarePlus Pharmacy Item',
          },
          unit_amount: Math.max(50, Math.round(Number(item.product?.price || item.price || 0) * 100)),
        },
        quantity: Number(item.quantity || 1),
      }));
    }

    const sessionParams = {
      ui_mode: 'form',
      mode: 'payment',
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: false },
      automatic_tax: { enabled: false },
      submit_type: 'auto',
      name_collection: {
        individual: { enabled: true, optional: true },
        business: { enabled: true, optional: true },
      },
      saved_payment_method_options: { payment_method_save: 'enabled' },
      integration_identifier: 'custom_embedded_web_0001',
      line_items,
    };

    const stripe = new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia' });
    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({ client_secret: session.client_secret });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
