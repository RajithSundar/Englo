import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { PROBLEMS } from './src/data/problems';
import { evaluateAlgoWithVertex, evaluateArchWithVertex } from './src/server/vertexService';
import { evaluateAlgoEnglish } from './src/services/algoEvaluator';
import { evaluateArchitecture } from './src/services/systemDesignEvaluator';
import { storage } from './src/server/storage';

dotenv.config();

// Ensure Google Application Default Credentials path slashes are valid
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS.replace(/\\/g, '/');
}

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!req.url.startsWith('/@') && !req.url.startsWith('/node_modules') && !req.url.startsWith('/src')) {
      console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Healthcheck & System Telemetry
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: isProduction ? 'production' : 'development',
    engine: 'Google Cloud Vertex AI (Gemini 2.5 Flash)',
    projectId: process.env.GCP_PROJECT_ID || 'project-dab42af9-0f52-4527-b40',
    region: process.env.GCP_REGION || 'us-central1',
    stats: storage.getStats()
  });
});

// 2. Algorithm Logic Evaluation
app.post('/api/evaluate-algo', async (req: Request, res: Response) => {
  try {
    const { problem, codeText } = req.body;
    if (!problem || typeof codeText !== 'string') {
      res.status(400).json({ error: 'Missing problem or codeText in request body' });
      return;
    }

    let result;
    try {
      // Primary: Google Cloud Vertex AI Gemini 2.5 Flash
      result = await evaluateAlgoWithVertex(problem, codeText);
    } catch (vertexErr: any) {
      console.warn('Vertex AI evaluation unavailable, executing deterministic heuristic engine fallback:', vertexErr?.message || vertexErr);
      result = evaluateAlgoEnglish(problem, codeText);
      result.engine = 'Englo Deterministic Heuristic Engine (Fallback)';
    }

    storage.incrementEvaluations();
    res.json(result);
  } catch (err: any) {
    console.error('Unhandled evaluate-algo error:', err);
    res.status(500).json({ error: err?.message || 'Algorithm evaluation error' });
  }
});

// 3. System Design Architecture Evaluation
app.post('/api/evaluate-arch', async (req: Request, res: Response) => {
  try {
    const { problem, nodes, edges } = req.body;
    if (!problem || !Array.isArray(nodes)) {
      res.status(400).json({ error: 'Missing problem or nodes in request body' });
      return;
    }

    let result;
    try {
      // Primary: Google Cloud Vertex AI Gemini 2.5 Flash
      result = await evaluateArchWithVertex(problem, nodes, edges || []);
    } catch (vertexErr: any) {
      console.warn('Vertex AI architecture evaluation unavailable, executing topology engine fallback:', vertexErr?.message || vertexErr);
      result = evaluateArchitecture(problem, nodes, edges || []);
      result.engine = 'Englo Topology Engine (Fallback)';
    }

    storage.incrementEvaluations();
    res.json(result);
  } catch (err: any) {
    console.error('Unhandled evaluate-arch error:', err);
    res.status(500).json({ error: err?.message || 'Architecture evaluation error' });
  }
});

// 4. Problems Catalogue
app.get('/api/problems', (req: Request, res: Response) => {
  const { category, difficulty } = req.query;
  let filtered = [...PROBLEMS];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (difficulty && difficulty !== 'all') {
    filtered = filtered.filter((p) => p.difficulty === difficulty);
  }

  // Sanitize out full optimal solutions from the initial catalogue list
  const sanitized = filtered.map(({ solutionAlgoEnglish, solutionArchNodes, solutionArchEdges, ...rest }) => rest);
  res.json({ problems: sanitized, total: sanitized.length });
});

// 5. Problem Detail
app.get('/api/problems/:id', (req: Request, res: Response) => {
  const problem = PROBLEMS.find((p) => p.id === req.params.id);
  if (!problem) {
    res.status(404).json({ error: 'Problem not found' });
    return;
  }
  res.json({ problem });
});

// 6. User Profile & Streak Telemetry
app.get('/api/user/profile', (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email) {
    res.status(400).json({ error: 'Email parameter is required' });
    return;
  }
  const user = storage.getUser(email);
  res.json({ profile: user });
});

// 7. Record User Activity & Sync Dynamic Streak
app.post('/api/user/activity', (req: Request, res: Response) => {
  const { email, date, streakCount } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  const updatedUser = storage.recordUserActivity(email, date, streakCount);
  res.json({ profile: updatedUser });
});

// 8. Record Solved Problem
app.post('/api/user/solve', (req: Request, res: Response) => {
  const { email, problemId } = req.body;
  if (!email || !problemId) {
    res.status(400).json({ error: 'Email and problemId are required' });
    return;
  }
  const updatedUser = storage.recordSolvedProblem(email, problemId);
  res.json({ profile: updatedUser });
});

// 9. Auth Endpoints
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, handle, name, role } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  const user = storage.getOrCreateUser(email, handle, name, role);
  res.json({ user, token: `englo_session_${Date.now()}` });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, handle, name, role } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  const user = storage.getOrCreateUser(email, handle, name, role);
  res.json({ user, token: `englo_session_${Date.now()}` });
});

// 10. Automated Test Suite Runner Endpoint
app.post('/api/test-suite', (req: Request, res: Response) => {
  const results = PROBLEMS.map((p) => {
    let testPassed = true;
    if (p.category === 'algorithm' && p.solutionAlgoEnglish) {
      const evalRes = evaluateAlgoEnglish(p, p.solutionAlgoEnglish);
      testPassed = evalRes.passed;
    } else if (p.category === 'system_design' && p.solutionArchNodes) {
      const archRes = evaluateArchitecture(p, p.solutionArchNodes, p.solutionArchEdges || []);
      testPassed = archRes.passed;
    }
    return {
      problemId: p.id,
      title: p.title,
      category: p.category,
      passed: testPassed
    };
  });

  res.json({
    timestamp: new Date().toISOString(),
    total: results.length,
    passed: results.filter((r) => r.passed).length,
    results
  });
});

// ==========================================
// STATIC ASSET SERVING & SPA FALLBACK
// ==========================================

async function startServer() {
  if (!isProduction) {
    // In development: Attach Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[Dev Server] Vite HMR middleware attached');
  } else {
    // In production: Serve compiled static files
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Prod Server] Serving production build from /dist');
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`🚀 Englo Studio Server running on http://localhost:${PORT}`);
    console.log(`MODE: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`BACKEND API: Active at http://localhost:${PORT}/api/health`);
    console.log(`VERTEX AI: ${process.env.MODEL_FAST || 'gemini-2.5-flash'} (${process.env.GCP_REGION || 'us-central1'})`);
    console.log(`===============================================`);
  });

  const handleShutdown = () => {
    console.log('\nShutting down Englo server gracefully...');
    server.close(() => {
      console.log('Server stopped.');
      process.exit(0);
    });
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
}

startServer().catch((err) => {
  console.error('Fatal server start error:', err);
  process.exit(1);
});
