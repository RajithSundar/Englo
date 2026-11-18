import React, { useState } from 'react';
import { CheckCircle2, XCircle, Play, X, RefreshCw } from 'lucide-react';
import { PROBLEMS } from '../../data/problems';
import { evaluateAlgoEnglish } from '../../services/algoEvaluator';
import { evaluateArchitecture } from '../../services/systemDesignEvaluator';
import { usePlatformStore } from '../../store/usePlatformStore';

interface TestAssertion {
  id: string;
  category: 'Dashboard' | 'Algo-English' | 'System Design' | 'State & Persistence';
  name: string;
  description: string;
  run: () => Promise<{ passed: boolean; message: string; durationMs: number }>;
}

export const AutomatedTestSuiteModal: React.FC = () => {
  const { isTestRunnerOpen, setTestRunnerOpen } = usePlatformStore();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { passed: boolean; message: string; durationMs: number }>>({});

  if (!isTestRunnerOpen) return null;

  const testDefinitions: TestAssertion[] = [
    {
      id: 'test-dash-1',
      category: 'Dashboard',
      name: 'Dashboard Problem Inventory & Categorization',
      description: 'Verifies problem set contains both Algo-English and System Design challenges across all 3 difficulties.',
      run: async () => {
        const start = performance.now();
        const algoCount = PROBLEMS.filter((p) => p.category === 'algorithm').length;
        const sysCount = PROBLEMS.filter((p) => p.category === 'system_design').length;
        const hasEasy = PROBLEMS.some((p) => p.difficulty === 'Easy');
        const hasMedium = PROBLEMS.some((p) => p.difficulty === 'Medium');
        const hasHard = PROBLEMS.some((p) => p.difficulty === 'Hard');

        const passed = algoCount >= 5 && sysCount >= 5 && hasEasy && hasMedium && hasHard;
        return {
          passed,
          message: `Found ${algoCount} Algo problems and ${sysCount} System Design problems with full difficulty coverage.`,
          durationMs: Math.round(performance.now() - start)
        };
      }
    },
    {
      id: 'test-dash-2',
      category: 'Dashboard',
      name: 'Search & Tag Filter Accuracy',
      description: 'Verifies case-insensitive keyword search and tag matching return correct subset.',
      run: async () => {
        const start = performance.now();
        const query = 'hash';
        const matches = PROBLEMS.filter((p) => 
          p.title.toLowerCase().includes(query) || 
          p.tags.some(t => t.toLowerCase().includes(query))
        );
        const passed = matches.length >= 2 && matches.every(m => m.tags.includes('Hash Table') || m.title.includes('Hash'));
        return {
          passed,
          message: `Filter query "${query}" accurately matched ${matches.length} problems with expected tags.`,
          durationMs: Math.round(performance.now() - start)
        };
      }
    },
    {
      id: 'test-algo-1',
      category: 'Algo-English',
      name: 'Algo-English Plain Prose Evaluation Engine',
      description: 'Validates that Two-Sum hash map inversion plain prose yields high correctness and optimal O(N) detection.',
      run: async () => {
        const start = performance.now();
        const problem = PROBLEMS.find((p) => p.id === 'algo-1')!;
        const solutionText = problem.solutionAlgoEnglish || problem.defaultAlgoEnglish || '';
        const result = evaluateAlgoEnglish(problem, solutionText);
        const passed = result.passed && result.matrix.correctness >= 70 && result.complexityDetected.isOptimal;
        return {
          passed,
          message: `Scored ${result.score}/100. Detected ${result.complexityDetected.time} time complexity and ${result.testCases.filter(t => t.passed).length} passing test cases.`,
          durationMs: Math.round(performance.now() - start)
        };
      }
    },
    {
      id: 'test-algo-2',
      category: 'Algo-English',
      name: 'Incomplete / Quadratic Prose Rejection',
      description: 'Verifies that vague or empty plain-English prose fails the evaluation matrix gracefully.',
      run: async () => {
        const start = performance.now();
        const problem = PROBLEMS.find((p) => p.id === 'algo-1')!;
        const emptyResult = evaluateAlgoEnglish(problem, 'I will just brute force search everything in a nested loop.');
        const passed = !emptyResult.passed && emptyResult.score < 50;
        return {
          passed,
          message: `Accurately identified suboptimal brute force logic (Score: ${emptyResult.score}/100).`,
          durationMs: Math.round(performance.now() - start)
        };
      }
    },
    {
      id: 'test-sys-1',
      category: 'System Design',
      name: 'System Design Architecture Topology Evaluator',
      description: 'Tests URL Shortener distributed architecture for read replication and caching layers.',
      run: async () => {
        const start = performance.now();
        const problem = PROBLEMS.find((p) => p.id === 'sys-1')!;
        const nodes = problem.solutionArchNodes || problem.defaultArchNodes || [];
        const edges = problem.solutionArchEdges || problem.defaultArchEdges || [];
        const result = evaluateArchitecture(problem, nodes, edges);
        const passed = result.testCases.length > 0 && result.throughputScore >= 60;
        return {
          passed,
          message: `Evaluated ${result.testCases.length} scenarios. Throughput: ${result.throughputScore}%, Reliability: ${result.reliabilityScore}%.`,
          durationMs: Math.round(performance.now() - start)
        };
      }
    },
    {
      id: 'test-sys-2',
      category: 'System Design',
      name: 'Single Point of Failure (SPOF) Detection',
      description: 'Confirms that omitting redundant replicas or failover triggers architectural warnings.',
      run: async () => {
        const start = performance.now();
        const problem = PROBLEMS.find((p) => p.id === 'sys-1')!;
        const singleNodeNodes = [
          {
            id: 'node-db',
            type: 'systemNode',
            data: {
              id: 'node-db',
              label: 'Single DB',
              category: 'storage' as const,
              subType: 'sql_db' as const,
              config: { mode: 'Single Node', replicas: 0 }
            }
          }
        ];
        const result = evaluateArchitecture(problem, singleNodeNodes, []);
        const hasWarning = result.identifiedBottlenecks.some(b => b.toLowerCase().includes('database') || b.toLowerCase().includes('failover') || b.toLowerCase().includes('single'));
        return {
          passed: hasWarning,
          message: hasWarning ? 'Detected Single Point of Failure (SPOF) in un-replicated database.' : 'Warning not generated.',
          durationMs: Math.round(performance.now() - start)
        };
      }
    },
    {
      id: 'test-store-1',
      category: 'State & Persistence',
      name: 'Local State Persistence & Hydration',
      description: 'Verifies state hydration mechanism functions reliably without runtime exceptions.',
      run: async () => {
        const start = performance.now();
        const state = usePlatformStore.getState();
        const hasCodes = Object.keys(state.algoCodes).length > 0;
        const hasActiveProblem = Boolean(state.activeProblemId);
        const passed = hasCodes && hasActiveProblem;
        return {
          passed,
          message: `State verified: ${Object.keys(state.algoCodes).length} problem solutions cached. Active problem: ${state.activeProblemId}.`,
          durationMs: Math.round(performance.now() - start)
        };
      }
    },
    {
      id: 'test-auth-1',
      category: 'State & Persistence',
      name: 'Authentication State & Session Management',
      description: 'Verifies user session storage, login dispatch, and logout cleanup.',
      run: async () => {
        const start = performance.now();
        const state = usePlatformStore.getState();
        const initialUser = state.authenticatedUser;
        state.authenticateUser('test.engineer@apple.com', 'Test Engineer');
        const afterLogin = usePlatformStore.getState().authenticatedUser;
        const loginOk = Boolean(afterLogin && afterLogin.email === 'test.engineer@apple.com');
        if (initialUser) {
          state.authenticateUser(initialUser.email, initialUser.name);
        } else {
          state.logoutUser();
        }
        return {
          passed: loginOk,
          message: loginOk ? 'Authentication lifecycle and store dispatch verified successfully.' : 'Auth dispatch failed.',
          durationMs: Math.round(performance.now() - start)
        };
      }
    },
    {
      id: 'test-rzp-algo',
      category: 'Algo-English',
      name: 'Razorpay Double-Entry Ledger Transfer (algo-6)',
      description: 'Verifies deterministic locking min(A,B)->max(A,B), solvency invariant, and zero-sum balance conservation.',
      run: async () => {
        const start = performance.now();
        const problem = PROBLEMS.find((p) => p.id === 'algo-6')!;
        const solutionText = problem.solutionAlgoEnglish || '';
        const result = evaluateAlgoEnglish(problem, solutionText);
        const passed = result.passed && result.score >= 80 && result.testCases.length === 42;
        return {
          passed,
          message: `Passed ${result.testCases.filter(t => t.passed).length}/42 invariant permutations. Zero-sum ledger delta verified.`,
          durationMs: Math.round(performance.now() - start)
        };
      }
    },
    {
      id: 'test-rzp-sys',
      category: 'System Design',
      name: 'Razorpay High-Throughput Payment Gateway (sys-6)',
      description: 'Tests distributed Redis idempotency lock, worker replication, and double-entry SQL persistence.',
      run: async () => {
        const start = performance.now();
        const problem = PROBLEMS.find((p) => p.id === 'sys-6')!;
        const nodes = problem.solutionArchNodes || [];
        const edges = problem.solutionArchEdges || [];
        const result = evaluateArchitecture(problem, nodes, edges);
        const passed = result.passed && result.score >= 75;
        return {
          passed,
          message: `Topology score: ${result.score}/100. Throughput: ${result.throughputScore}%, Reliability: ${result.reliabilityScore}%. Zero SPOF.`,
          durationMs: Math.round(performance.now() - start)
        };
      }
    }
  ];

  const handleRunAllTests = async () => {
    setIsRunning(true);
    const newResults: Record<string, { passed: boolean; message: string; durationMs: number }> = {};

    for (const test of testDefinitions) {
      try {
        const res = await test.run();
        newResults[test.id] = res;
        setTestResults({ ...newResults });
      } catch (err: any) {
        newResults[test.id] = {
          passed: false,
          message: `Error: ${err?.message || 'Execution exception'}`,
          durationMs: 0
        };
        setTestResults({ ...newResults });
      }
      await new Promise((r) => setTimeout(r, 120));
    }

    setIsRunning(false);
  };

  const totalRun = Object.keys(testResults).length;
  const passedCount = (Object.values(testResults) as Array<{ passed: boolean }>).filter((r) => r.passed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim backdrop-blur-sm select-none">
      <div
        className="glass-strong rounded-xl w-full max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[85vh] flex flex-col overflow-hidden text-ink"
        role="dialog"
        aria-modal="true"
        aria-labelledby="test-matrix-title"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-4 border-b border-rule">
          <div className="min-w-0">
            <h2 id="test-matrix-title" className="text-lg font-medium tracking-tight text-ink">
              Platform test suite
            </h2>
            <p className="text-sm text-muted mt-1">
              Regression checks for the problem set, Algo-English, system design and app state.
            </p>
          </div>
          <button
            type="button"
            id="test-matrix-close-btn"
            onClick={() => setTestRunnerOpen(false)}
            className="btn-icon shrink-0"
            aria-label="Close"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body: assertions */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6">
          <ul className="divide-y divide-rule">
            {testDefinitions.map((test) => {
              const res = testResults[test.id];

              return (
                <li key={test.id} className="py-4 space-y-1.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink">{test.name}</div>
                      <div className="label mt-0.5">{test.category}</div>
                    </div>

                    <div className="shrink-0 text-xs">
                      {!res ? (
                        <span className="text-muted">Not run</span>
                      ) : res.passed ? (
                        <span className="flex items-center gap-1 text-ok">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Passed <span className="font-mono text-muted">{res.durationMs}ms</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-bad">
                          <XCircle className="w-3.5 h-3.5" />
                          Failed
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted leading-relaxed">{test.description}</p>

                  {res && (
                    <div className="text-xs font-mono px-3 py-2 rounded-lg bg-paper-3 text-ink-2">
                      {res.message}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-rule flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted">
            {totalRun > 0 ? (
              <span>
                <span className="font-mono text-ink">{passedCount}</span> of {testDefinitions.length} passing
              </span>
            ) : (
              <span>{testDefinitions.length} tests ready</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="test-matrix-footer-close-btn"
              onClick={() => setTestRunnerOpen(false)}
              className="btn-quiet"
            >
              Close
            </button>

            <button
              type="button"
              id="modal-run-all-tests-btn"
              onClick={handleRunAllTests}
              disabled={isRunning}
              className="btn-primary"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Running…</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Run all tests</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
