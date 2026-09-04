import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { evaluateAlgoWithVertex, evaluateArchWithVertex } from './src/server/vertexService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Vertex AI Gemini 2.5 Flash', project: process.env.GCP_PROJECT_ID });
});

// Algo English Solution Evaluation
app.post('/api/evaluate-algo', async (req, res) => {
  try {
    const { problem, codeText } = req.body;
    if (!problem || typeof codeText !== 'string') {
      return res.status(400).json({ error: 'Missing problem or codeText' });
    }
    const result = await evaluateAlgoWithVertex(problem, codeText);
    res.json(result);
  } catch (error: any) {
    console.error('Vertex AI Algo Evaluation Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to evaluate algorithm logic' });
  }
});

// System Design Topology Evaluation
app.post('/api/evaluate-arch', async (req, res) => {
  try {
    const { problem, nodes, edges } = req.body;
    if (!problem || !nodes) {
      return res.status(400).json({ error: 'Missing problem or nodes' });
    }
    const result = await evaluateArchWithVertex(problem, nodes, edges || []);
    res.json(result);
  } catch (error: any) {
    console.error('Vertex AI Architecture Evaluation Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to evaluate architecture topology' });
  }
});

// Serve production static assets if dist exists
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Englo backend server active on http://localhost:${PORT}`);
  console.log(`Connected to Google Cloud Vertex AI: ${process.env.GCP_PROJECT_ID} (${process.env.MODEL_FAST})`);
});
