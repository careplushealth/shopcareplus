import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import url from 'url';
import { handleApiRequest } from './api/_handler';

function neonApiPlugin(): Plugin {
  return {
    name: 'neon-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const parsedUrl = url.parse(req.url || '', true);
        const pathname = parsedUrl.pathname || '';
        if (!pathname.startsWith('/api')) {
          return next();
        }
        await handleApiRequest(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const parsedUrl = url.parse(req.url || '', true);
        const pathname = parsedUrl.pathname || '';
        if (!pathname.startsWith('/api')) {
          return next();
        }
        await handleApiRequest(req, res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), neonApiPlugin()],
});
