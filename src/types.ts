export type ProblemCategory = 'algorithm' | 'system_design';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expected: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface ArchScenarioTest {
  id: string;
  name: string;
  description: string;
  criteria: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  category: ProblemCategory;
  difficulty: Difficulty;
  acceptanceRate: string;
  tags: string[];
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: string[];
  starterTemplate?: string;
  solutionAlgoEnglish?: string;
  defaultAlgoEnglish?: string;
  defaultArchNodes?: any[];
  defaultArchEdges?: any[];
  solutionArchNodes?: any[];
  solutionArchEdges?: any[];
  archScenarios?: ArchScenarioTest[];
}

export interface EvaluationMatrix {
  correctness: number; // 0 - 100
  determinism: number; // 0 - 100
  efficiency: number;  // 0 - 100
  brevity: number;     // 0 - 100
}

export interface TestCaseResult {
  id: string;
  name: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  executionTimeMs: number;
  explanation?: string;
}

export interface AlgoEvaluationResult {
  passed: boolean;
  score: number;
  matrix: EvaluationMatrix;
  testCases: TestCaseResult[];
  feedback: string;
  complexityDetected: {
    time: string;
    space: string;
    isOptimal: boolean;
  };
  keyTechniquesDetected: string[];
  engine?: string;
}

export type SystemNodeCategory = 'client' | 'network' | 'compute' | 'storage';

export type SystemNodeType =
  | 'smart_tv'
  | 'mobile'
  | 'browser'
  | 'api_gateway'
  | 'load_balancer'
  | 'cdn'
  | 'web_server'
  | 'worker'
  | 'lambda'
  | 'sql_db'
  | 'nosql_db'
  | 'redis_cache'
  | 's3_storage';

export interface SystemNodeData {
  id: string;
  label: string;
  category: SystemNodeCategory;
  subType: SystemNodeType;
  config: {
    mode?: string;             // e.g. 'Primary-Replica', 'Sharded', 'Multi-AZ'
    replicas?: number;
    algorithm?: string;        // e.g. 'Round Robin', 'Least Conn'
    cachePolicy?: string;      // e.g. 'LRU', 'LFU', 'FIFO'
    ttlSeconds?: number;
    concurrency?: number;
    capacityRps?: number;
    storageClass?: string;
    notes?: string;
  };
  metrics?: {
    rps?: string;
    latency?: string;
    availability?: string;
  };
  status?: 'healthy' | 'warning' | 'error';
}

export interface ArchTestCaseResult {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  details: string;
  impactScore: number;
}

export interface ArchitectureEvaluationResult {
  passed: boolean;
  score: number;
  testCases: ArchTestCaseResult[];
  throughputScore: number;
  reliabilityScore: number;
  scalabilityScore: number;
  identifiedBottlenecks: string[];
  recommendations: string[];
  engine?: string;
}
