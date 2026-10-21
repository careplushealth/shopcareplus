export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, authenticated: false, message: 'Missing token' });
  }

  const token = auth.slice(7);
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (decoded.startsWith('careplus-admin:')) {
      return res.status(200).json({ success: true, authenticated: true, role: 'Super Admin' });
    }
  } catch {}

  return res.status(401).json({ success: false, authenticated: false, message: 'Invalid or expired token' });
}
