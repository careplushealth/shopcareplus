// Web API standard for Vercel Edge / modern Node functions
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const providedPassword = (body.password || '').trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'careplus2026!';

    if (!providedPassword || providedPassword !== adminPassword) {
      return Response.json(
        { success: false, message: 'Incorrect admin password. Please try again.' },
        { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const token = Buffer.from(`careplus-admin:${Date.now()}:${Math.random().toString(36)}`).toString('base64');
    return Response.json(
      {
        success: true,
        token,
        role: 'Super Admin',
        pharmacy: 'Wilmslow Road Pharmacy (CarePlus)',
        neonBranch: process.env.NEON_BRANCH || 'production',
        expiresIn: '24h',
      },
      { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err) {
    return Response.json(
      { success: false, error: err.message },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

// Node.js serverless format for Vercel / Vite dev
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(204).end();
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    if (res.status) return res.status(405).json({ success: false, message: 'Method not allowed' });
    res.statusCode = 405;
    return res.end(JSON.stringify({ success: false, message: 'Method not allowed' }));
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch {}
    }
    const providedPassword = (body?.password || '').trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'careplus2026!';

    if (!providedPassword || providedPassword !== adminPassword) {
      if (res.status) return res.status(401).json({ success: false, message: 'Incorrect admin password. Please try again.' });
      res.statusCode = 401;
      return res.end(JSON.stringify({ success: false, message: 'Incorrect admin password. Please try again.' }));
    }

    const token = Buffer.from(`careplus-admin:${Date.now()}:${Math.random().toString(36)}`).toString('base64');
    const responsePayload = {
      success: true,
      token,
      role: 'Super Admin',
      pharmacy: 'Wilmslow Road Pharmacy (CarePlus)',
      neonBranch: process.env.NEON_BRANCH || 'production',
      expiresIn: '24h',
    };

    if (res.status) return res.status(200).json(responsePayload);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(responsePayload));
  } catch (err) {
    if (res.status) return res.status(500).json({ success: false, error: err.message });
    res.statusCode = 500;
    return res.end(JSON.stringify({ success: false, error: err.message }));
  }
}
