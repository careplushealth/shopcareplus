import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import url from 'url';
import loginHandler from './api/admin/login.js';
import verifyHandler from './api/admin/verify.js';
import healthHandler from './api/health.js';
import productsHandler from './api/products.js';
import stripeConfigHandler from './api/stripe-config.js';
import createCheckoutSessionHandler from './api/create-checkout-session.js';

function neonApiPlugin(): Plugin {
  return {
    name: 'neon-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const parsedUrl = url.parse(req.url || '', true);
        const pathname = parsedUrl.pathname || '';

        // Attach res.status and res.json helpers to simulate Vercel serverless environment locally
        res.status = function (code: number) {
          this.statusCode = code;
          return this;
        };
        res.json = function (data: any) {
          this.setHeader('Content-Type', 'application/json');
          this.end(JSON.stringify(data));
        };

        if (pathname === '/api/admin/login') {
          if (!req.body) {
            let body = '';
            for await (const chunk of req) body += chunk;
            try { req.body = JSON.parse(body); } catch { req.body = {}; }
          }
          return loginHandler(req, res);
        }
        if (pathname === '/api/admin/verify') {
          return verifyHandler(req, res);
        }
        if (pathname === '/api/health') {
          return healthHandler(req, res);
        }
        if (pathname === '/api/products') {
          return productsHandler(req, res);
        }
        if (pathname === '/api/stripe-config') {
          return stripeConfigHandler(req, res);
        }
        if (pathname === '/api/create-checkout-session') {
          if (!req.body) {
            let body = '';
            for await (const chunk of req) body += chunk;
            try { req.body = JSON.parse(body); } catch { req.body = {}; }
          }
          return createCheckoutSessionHandler(req, res);
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), neonApiPlugin()],
});
