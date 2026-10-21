import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
    const match = envFile.match(/DATABASE_URL="([^"]+)"/);
    if (match) return match[1];
  } catch {}
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
    const match = envFile.match(/DATABASE_URL="([^"]+)"/);
    if (match) return match[1];
  } catch {}
  throw new Error('DATABASE_URL not found in environment or .env.local');
}

async function init() {
  const dbUrl = getDatabaseUrl();
  console.log('Connecting to Neon Postgres...');
  const sql = neon(dbUrl);

  console.log('Creating tables in Neon database...');

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      order_number VARCHAR(50) PRIMARY KEY,
      order_date VARCHAR(50) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50),
      customer_name VARCHAR(255) NOT NULL,
      delivery_address TEXT NOT NULL,
      postcode VARCHAR(50) NOT NULL,
      delivery_method VARCHAR(100) NOT NULL,
      payment_method VARCHAR(50) NOT NULL,
      items JSONB NOT NULL,
      subtotal NUMERIC(10, 2) NOT NULL,
      shipping NUMERIC(10, 2) NOT NULL,
      discount NUMERIC(10, 2) NOT NULL,
      total NUMERIC(10, 2) NOT NULL,
      status VARCHAR(50) DEFAULT 'confirmed',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log('✓ Table "orders" ready.');

  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log('✓ Table "newsletter_subscribers" ready.');

  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      order_number VARCHAR(100),
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log('✓ Table "contact_messages" ready.');

  const res = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;

  console.log('Public tables in Neon:', res.map(r => r.table_name));
  console.log('Neon database initialization completed successfully!');
}

init().catch((err) => {
  console.error('Failed to initialize Neon database:', err);
  process.exit(1);
});
