import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { evaluateAlgoWithVertex, evaluateArchWithVertex } from './src/server/vertexService';

function vertexAiApiPlugin(): Plugin {
  return {
    name: 'vertex-ai-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url ? req.url.split('?')[0].replace(/\/$/, '') : '';

        if (pathname === '/api/evaluate-algo' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { problem, codeText } = JSON.parse(body);
              const result = await evaluateAlgoWithVertex(problem, codeText);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              console.error('API /api/evaluate-algo error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Evaluation error' }));
            }
          });
          return;
        }

        if (pathname === '/api/evaluate-arch' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { problem, nodes, edges } = JSON.parse(body);
              const result = await evaluateArchWithVertex(problem, nodes, edges || []);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              console.error('API /api/evaluate-arch error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err?.message || 'Evaluation error' }));
            }
          });
          return;
        }

        if (pathname === '/api/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              status: 'ok',
              engine: 'Google Cloud Vertex AI Gemini 2.5 Flash',
              project: process.env.GCP_PROJECT_ID,
            })
          );
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), vertexAiApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              ignored: [
                '**/*.zip',
                '**/dist/**',
                '**/.git/**',
                '**/node_modules/**',
                '**/.agents/**',
                '**/.agent/**',
                '**/.ontoindex/**',
              ],
            },
    },
  };
});
