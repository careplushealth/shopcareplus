import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(200).json({
      status: 'notice',
      database: 'pending_configuration',
      message: 'DATABASE_URL is not set in Vercel Environment Variables yet. Please configure it in your Vercel Dashboard.'
    });
  }

  try {
    const sql = neon(dbUrl);
    const result = await sql`SELECT 1 as connected, NOW() as server_time, version() as version`;
    return res.status(200).json({
      status: 'ok',
      database: 'connected',
      databaseUrlConfigured: true,
      neonBranch: process.env.NEON_BRANCH || 'production',
      time: result[0]?.server_time,
      version: result[0]?.version
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      database: 'error',
      error: err.message
    });
  }
}
