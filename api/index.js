export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  return res.status(200).json({
    status: 'ok',
    service: 'CarePlus Health Shop API',
    endpoints: [
      '/api/health',
      '/api/products',
      '/api/admin/login',
      '/api/admin/verify',
      '/api/stripe-config'
    ]
  });
}
