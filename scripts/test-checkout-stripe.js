import http from 'http';

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
  console.log('--- Testing Stripe Checkout Session & Webhook on port ' + PORT + ' ---');

  // 1. Stripe Config
  const config = await request('GET', '/api/stripe-config');
  console.log('1. GET /api/stripe-config:', config.status, config.data);

  // 2. Create Checkout Session
  const sessionRes = await request('POST', '/api/create-checkout-session', {});
  console.log('2. POST /api/create-checkout-session:', sessionRes.status, sessionRes.data);

  // 3. Webhook ping
  const webhookRes = await request('POST', '/api/webhook', {
    type: 'checkout.session.completed',
    data: {
      object: {
        id: 'cs_test_mock_123',
        customer_details: { email: 'customer@example.co.uk' },
        consent: { terms_of_service: 'accepted', promotions: 'opt_in' },
      },
    },
  });
  console.log('3. POST /api/webhook status:', webhookRes.status, webhookRes.data);

  console.log('\n--- VERIFICATION COMPLETE ---');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
