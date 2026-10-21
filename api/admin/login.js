export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch {}
    }
    const providedPassword = (body?.password || '').trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'careplus2026!';

    if (!providedPassword || providedPassword !== adminPassword) {
      return res.status(401).json({ success: false, message: 'Incorrect admin password. Please try again.' });
    }

    const token = Buffer.from(`careplus-admin:${Date.now()}:${Math.random().toString(36)}`).toString('base64');
    return res.status(200).json({
      success: true,
      token,
      role: 'Super Admin',
      pharmacy: 'Wilmslow Road Pharmacy (CarePlus)',
      neonBranch: process.env.NEON_BRANCH || 'production',
      expiresIn: '24h',
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
