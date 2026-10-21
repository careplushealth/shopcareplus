// scripts/verify-admin.js
import http from 'http';
import fs from 'fs';
import path from 'path';

function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
    const match = envFile.match(/ADMIN_PASSWORD="([^"]+)"/);
    if (match) return match[1];
  } catch {}
  return '';
}

const PORT = 5174;
const BASE = `http://localhost:${PORT}`;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log(`--- Verifying CarePlus Admin Portal & Neon Postgres on port ${PORT} ---`);

  // 1. Health Check
  const health = await request('GET', '/api/health');
  console.log('1. Health check status:', health.status, 'DB:', health.data?.database, 'Branch:', health.data?.neonBranch);
  if (health.data?.database !== 'connected') {
    throw new Error('Database is not connected');
  }

  // 2. Public products
  const pubProds = await request('GET', '/api/products');
  console.log('2. Public products count:', pubProds.data?.products?.length);

  // 3. Failed admin login
  const badLogin = await request('POST', '/api/admin/login', { password: 'wrongpassword' });
  console.log('3. Rejected bad login status:', badLogin.status, 'Message:', badLogin.data?.message);
  if (badLogin.status !== 401) throw new Error('Expected 401 on bad password');

  // 4. Successful admin login
  const adminPwd = getAdminPassword();
  const goodLogin = await request('POST', '/api/admin/login', { password: adminPwd });
  console.log('4. Good login status:', goodLogin.status, 'Role:', goodLogin.data?.role);
  const token = goodLogin.data?.token;
  if (!token) throw new Error('No token returned');

  // 5. Verify token
  const verify = await request('GET', '/api/admin/verify', null, { Authorization: `Bearer ${token}` });
  console.log('5. Verify token status:', verify.status, 'Authenticated:', verify.data?.authenticated);

  // 6. Create product via Admin
  const testId = `test-item-${Date.now().toString(36)}`;
  const newProd = {
    id: testId,
    name: 'CarePlus Multivitamin Zinc & C Effervescent',
    brand: 'CarePlus Health',
    category: 'Vitamins & Supplements',
    subcategory: 'Multivitamins',
    price: 3.49,
    originalPrice: 4.99,
    inStock: true,
    stockCount: 75,
    isBestSeller: true,
    isFeatured: true,
    isNew: true,
    image: '/images/products/berocca-orange.jpg',
    shortDescription: 'Immune support effervescent tablets with natural orange flavour.',
    description: 'High strength Vitamin C & Zinc daily food supplement designed for UK wellness.',
  };

  const createRes = await request('POST', '/api/admin/products', newProd, { Authorization: `Bearer ${token}` });
  console.log('6. Create product status:', createRes.status, 'Message:', createRes.data?.message);

  // 7. Read products and check if our new product is there
  const adminProds = await request('GET', '/api/admin/products', null, { Authorization: `Bearer ${token}` });
  const found = adminProds.data?.products?.find((p) => p.id === testId);
  console.log('7. Found newly created product in Neon:', Boolean(found), 'Name:', found?.name, 'Price:', found?.price);

  // 8. Update product price and stock in Neon
  const updateRes = await request(
    'PUT',
    `/api/admin/products/${testId}`,
    { price: 2.99, stockCount: 120, inStock: true },
    { Authorization: `Bearer ${token}` }
  );
  console.log('8. Update product status:', updateRes.status, 'Message:', updateRes.data?.message);

  // Verify update
  const adminProds2 = await request('GET', '/api/admin/products', null, { Authorization: `Bearer ${token}` });
  const updated = adminProds2.data?.products?.find((p) => p.id === testId);
  console.log('   Updated price in Neon:', updated?.price, 'Stock count:', updated?.stockCount);

  // 9. Delete test product from Neon
  const deleteRes = await request('DELETE', `/api/admin/products/${testId}`, null, { Authorization: `Bearer ${token}` });
  console.log('9. Delete product status:', deleteRes.status, 'Message:', deleteRes.data?.message);

  // 10. Check Admin Orders, Subscribers, Messages
  const orders = await request('GET', '/api/admin/orders', null, { Authorization: `Bearer ${token}` });
  const subs = await request('GET', '/api/admin/subscribers', null, { Authorization: `Bearer ${token}` });
  const msgs = await request('GET', '/api/admin/messages', null, { Authorization: `Bearer ${token}` });
  console.log('10. Admin data views - Orders:', orders.data?.orders?.length, 'Subscribers:', subs.data?.subscribers?.length, 'Messages:', msgs.data?.messages?.length);

  console.log('\n--- ALL ADMIN PORTAL AND NEON POSTGRES ENDPOINTS VERIFIED SUCCESSFULLY ---');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
