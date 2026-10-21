import fs from 'fs';
import path from 'path';

function getStripeKeys() {
  let secretKey = process.env.STRIPE_SECRET_KEY || '';
  let publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51TAtERHFkZ7AL18tl7fnD0DgoBGVtILMXubJk5vpBQTr4JelhknSro4Uu5Jmuhz3J4IdQQSCiGUiCxzSGncNIQCC00o17ZvQim';

  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
    const secretMatch = envFile.match(/STRIPE_SECRET_KEY=["']?([^"'\n\r]+)["']?/);
    const pubMatch = envFile.match(/VITE_STRIPE_PUBLISHABLE_KEY=["']?([^"'\n\r]+)["']?/);
    if (secretMatch) secretKey = secretMatch[1].trim();
    if (pubMatch) publishableKey = pubMatch[1].trim();
  } catch {}

  return { secretKey, publishableKey };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const { secretKey, publishableKey } = getStripeKeys();

  const configured = Boolean(
    publishableKey &&
    (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))
  );

  return res.status(200).json({
    configured,
    publishableKey,
    hasSecretKey: Boolean(secretKey),
    currency: 'gbp',
  });
}
