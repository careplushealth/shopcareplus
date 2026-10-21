export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return Response.json({ success: false, authenticated: false }, { status: 401 });
  }

  const token = auth.slice(7);
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (decoded.startsWith('careplus-admin:')) {
      return Response.json({ success: true, authenticated: true, role: 'Super Admin' }, { status: 200 });
    }
  } catch {}

  return Response.json({ success: false, authenticated: false }, { status: 401 });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    if (res.status) return res.status(204).end();
    res.statusCode = 204;
    return res.end();
  }

  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    if (res.status) return res.status(401).json({ success: false, authenticated: false, message: 'Missing token' });
    res.statusCode = 401;
    return res.end(JSON.stringify({ success: false, authenticated: false }));
  }

  const token = auth.slice(7);
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    if (decoded.startsWith('careplus-admin:')) {
      if (res.status) return res.status(200).json({ success: true, authenticated: true, role: 'Super Admin' });
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, authenticated: true, role: 'Super Admin' }));
    }
  } catch {}

  if (res.status) return res.status(401).json({ success: false, authenticated: false, message: 'Invalid or expired token' });
  res.statusCode = 401;
  return res.end(JSON.stringify({ success: false, authenticated: false }));
}
