export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  const publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

  const configured = Boolean(
    secretKey &&
    publishableKey &&
    (secretKey.startsWith('sk_test_') || secretKey.startsWith('sk_live_')) &&
    (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_'))
  );

  return res.status(200).json({
    configured,
    publishableKey: publishableKey || '',
    currency: 'gbp',
  });
}
