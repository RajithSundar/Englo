import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
import { AlgoEvaluationResult, ArchitectureEvaluationResult, Problem, SystemNodeData } from '../types';

dotenv.config();

// Ensure Google Application Default Credentials path is set
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS.replace(/\\/g, '/');
}

const projectId = process.env.GCP_PROJECT_ID || 'project-dab42af9-0f52-4527-b40';
const location = process.env.GCP_REGION || 'us-central1';
const modelName = process.env.MODEL_FAST || 'gemini-2.5-flash';

let vertexAI: VertexAI | null = null;

function getVertexAI(): VertexAI {
  if (!vertexAI) {
    vertexAI = new VertexAI({
      project: projectId,
      location: location,
    });
  }
  return vertexAI;
}

/**
 * Generates structured JSON using Google Cloud Vertex AI Gemini 2.5 Flash
 */
async function generateGeminiContent(prompt: string): Promise<string> {
  const client = getVertexAI();
  const model = client.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const response = await model.generateContent(prompt);
  const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Vertex AI Gemini');
  }

  return text;
}

/**
 * Evaluates plain-English algorithm logic using Google Cloud Vertex AI Gemini 2.5 Flash
 */
export async function evaluateAlgoWithVertex(
  problem: Problem,
  codeText: string
): Promise<AlgoEvaluationResult> {
  const prompt = `You are a Principal Staff Software Engineer at Apple evaluating a candidate's algorithm solution.
The candidate expresses their algorithmic logic in plain English prose, avoiding language syntax/punctuation.
You must rigorously evaluate their algorithm against the problem specification and test invariants.

PROBLEM DETAILS:
Title: ${problem.title}
Difficulty: ${problem.difficulty}
Description:
${problem.description}

Constraints:
${(problem.constraints || []).join('\n')}

Examples / Test Cases:
${JSON.stringify(problem.examples || [], null, 2)}

CANDIDATE'S PLAIN-ENGLISH SOLUTION:
"""
${codeText}
"""

Evaluate the solution and return a JSON object with this exact schema:
{
  "passed": boolean, // true if logic is correct and handles constraints
  "score": number,  // 0 to 100 overall score
  "matrix": {
    "correctness": number, // 0 to 100: handles core logic, edge cases, off-by-ones
    "determinism": number, // 0 to 100: unambiguous, ordered steps, specific invariants
    "efficiency": number,  // 0 to 100: time and space optimality
    "brevity": number      // 0 to 100: high signal-to-noise ratio, concise
  },
  "testCases": [
    {
      "id": string,
      "name": string,
      "input": string,
      "expected": string,
      "actual": string,
      "passed": boolean,
      "executionTimeMs": number,
      "explanation": string
    }
  ],
  "feedback": string, // Professional, constructive Cupertino-grade feedback analyzing their invariants, data structure selection, and communication clarity
  "complexityDetected": {
    "time": string, // e.g. "O(N)"
    "space": string, // e.g. "O(N)" or "O(1)"
    "isOptimal": boolean
  },
  "keyTechniquesDetected": string[] // e.g. ["Hash Map Inversion", "Two Pointers", "Sliding Window"]
}
`;

  const text = await generateGeminiContent(prompt);
  const parsed = JSON.parse(text) as AlgoEvaluationResult;
  parsed.engine = 'Google Cloud Vertex AI (Gemini 2.5 Flash)';
  return parsed;
}

/**
 * Evaluates system design topology using Google Cloud Vertex AI Gemini 2.5 Flash
 */
export async function evaluateArchWithVertex(
  problem: Problem,
  nodes: any[],
  edges: any[]
): Promise<ArchitectureEvaluationResult> {
  const topologySummary = {
    components: nodes.map((n) => ({
      id: n.id,
      label: n.data?.label,
      category: n.data?.category,
      subType: n.data?.subType,
      config: n.data?.config,
      metrics: n.data?.metrics,
    })),
    connections: edges.map((e) => ({
      from: e.source,
      to: e.target,
    })),
  };

  const prompt = `You are a Principal Distributed Systems Architect at Apple reviewing an engineering candidate's system design topology.

PROBLEM:
Title: ${problem.title}
Difficulty: ${problem.difficulty}
Description:
${problem.description}

Architectural Scenarios & Requirements:
${JSON.stringify(problem.archScenarios || [], null, 2)}

CANDIDATE'S TOPOLOGY:
${JSON.stringify(topologySummary, null, 2)}

Evaluate the topology against scalability, single points of failure (SPOF), caching layers, database replication, throughput, and failover redundancy.
Return a JSON object with this exact schema:
{
  "passed": boolean,
  "score": number, // 0 to 100
  "throughputScore": number, // 0 to 100
  "reliabilityScore": number, // 0 to 100
  "scalabilityScore": number, // 0 to 100
  "testCases": [
    {
      "id": string,
      "name": string,
      "description": string,
      "passed": boolean,
      "details": string,
      "impactScore": number
    }
  ],
  "identifiedBottlenecks": string[], // Specific identified weaknesses (e.g. "Single database node has no read replicas or failover")
  "recommendations": string[] // Architectural guidance for scaling
}
`;

  const text = await generateGeminiContent(prompt);
  const parsed = JSON.parse(text) as ArchitectureEvaluationResult;
  parsed.engine = 'Google Cloud Vertex AI (Gemini 2.5 Flash)';
  return parsed;
}
