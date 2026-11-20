import React from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { AlgoEvaluationResult } from '../../types';

type ConsoleTab = 'matrix' | 'testcases' | 'notes';

interface AlgoOutputConsoleProps {
  evaluation: AlgoEvaluationResult | null;
  isEvaluating: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  activeTab: ConsoleTab;
  onSelectTab: (tab: ConsoleTab) => void;
}

const CRITERIA: { key: 'correctness' | 'determinism' | 'efficiency' | 'brevity'; label: string }[] = [
  { key: 'correctness', label: 'Correctness' },
  { key: 'determinism', label: 'Determinism' },
  { key: 'efficiency', label: 'Efficiency' },
  { key: 'brevity', label: 'Brevity' },
];

const isRealNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export const AlgoOutputConsole: React.FC<AlgoOutputConsoleProps> = ({
  evaluation,
  isEvaluating,
  isExpanded,
  onToggleExpanded,
  activeTab,
  onSelectTab
}) => {
  const testCases = evaluation?.testCases ?? [];
  const passedCount = testCases.filter((t) => t.passed).length;
  const criteria = evaluation?.matrix
    ? CRITERIA.filter((c) => isRealNumber(evaluation.matrix[c.key]))
    : [];
  const techniques = evaluation?.keyTechniquesDetected?.filter(Boolean) ?? [];

  const selectTab = (tab: ConsoleTab) => {
    if (!isExpanded) onToggleExpanded();
    onSelectTab(tab);
  };

  const tabButton = (tab: ConsoleTab, id: string, label: React.ReactNode) => (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={activeTab === tab && isExpanded}
      onClick={() => selectTab(tab)}
      className="seg-item h-7 inline-flex items-center gap-1.5 cursor-pointer"
    >
      {label}
    </button>
  );

  return (
    <div
      id="algo-output-console"
      className="border-t border-rule bg-paper flex flex-col flex-shrink-0 z-30"
      style={{ height: isExpanded ? '440px' : '48px' }}
    >
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between gap-3 flex-shrink-0 select-none">
        <div role="tablist" aria-label="Console" className="seg">
          {tabButton('matrix', 'console-tab-matrix', 'Results')}
          {tabButton(
            'testcases',
            'console-tab-testcases',
            <>
              <span>Tests</span>
              {evaluation && testCases.length > 0 && (
                <span className="font-mono text-xs text-muted">
                  {passedCount}/{testCases.length}
                </span>
              )}
            </>
          )}
          {tabButton('notes', 'console-tab-notes', 'Feedback')}
        </div>

        <div className="flex items-center gap-3 min-w-0">
          {isEvaluating ? (
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Checking</span>
            </span>
          ) : (
            evaluation?.engine && (
              <span className="hidden sm:inline text-xs text-muted truncate" title="Evaluation engine">
                {evaluation.engine}
              </span>
            )
          )}

          <button
            type="button"
            id="algo-console-toggle-btn"
            onClick={onToggleExpanded}
            className="btn-icon w-8 h-8 border-transparent"
            title={isExpanded ? 'Collapse console' : 'Expand console'}
            aria-label={isExpanded ? 'Collapse console' : 'Expand console'}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-2 border-t border-rule text-sm text-ink-2">
          {isEvaluating ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
              <div className="text-ink font-medium">Checking your answer</div>
              <div className="text-muted">Running the test cases and reading the logic.</div>
            </div>
          ) : !evaluation ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
              <div className="text-ink font-medium">No results yet</div>
              <div className="text-muted flex items-center gap-1.5 flex-wrap justify-center">
                <span>Press Run or</span>
                <span className="kbd">Ctrl</span>
                <span className="kbd">Enter</span>
                <span>to check your answer.</span>
              </div>
            </div>
          ) : (
            <>
              {/* Results */}
              {activeTab === 'matrix' && (
                <div className="space-y-6 pt-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-none ${evaluation.passed ? 'bg-ok' : 'bg-bad'}`} />
                      <span className="text-base font-medium text-ink">
                        {evaluation.passed ? 'Passed' : 'Not passing yet'}
                      </span>
                      {testCases.length > 0 && (
                        <span className="text-muted">
                          {passedCount} of {testCases.length} tests passed
                        </span>
                      )}
                    </div>

                    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
                      {techniques.length > 0 && (
                        <>
                          <dt className="text-muted">Technique</dt>
                          <dd className="text-ink">{techniques.join(', ')}</dd>
                        </>
                      )}
                      {evaluation.complexityDetected && (
                        <>
                          <dt className="text-muted">Time</dt>
                          <dd className="font-mono text-ink">{evaluation.complexityDetected.time}</dd>
                          <dt className="text-muted">Space</dt>
                          <dd className="font-mono text-ink">{evaluation.complexityDetected.space}</dd>
                        </>
                      )}
                    </dl>
                  </div>

                  {criteria.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-2xl">
                      {criteria.map(({ key, label }) => {
                        const v = Math.max(0, Math.min(100, evaluation.matrix[key]));
                        return (
                          <div key={key} className="space-y-1.5">
                            <div className="flex items-baseline justify-between">
                              <span className="text-ink-2">{label}</span>
                              <span className="font-mono text-xs text-muted">{evaluation.matrix[key]}</span>
                            </div>
                            <div className="h-1 rounded-none bg-paper-3 overflow-hidden">
                              <div
                                className="h-full rounded-none bg-accent"
                                style={{ width: `${v}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {evaluation.feedback && (
                    <div className="max-w-prose space-y-1.5">
                      <p className="text-ink-2 leading-relaxed whitespace-pre-line line-clamp-3">{evaluation.feedback}</p>
                      <button
                        type="button"
                        onClick={() => onSelectTab('notes')}
                        className="text-sm text-accent hover:underline cursor-pointer"
                      >
                        Read all feedback
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tests */}
              {activeTab === 'testcases' && (
                <div id="test-invariants-container" className="pt-1">
                  {testCases.length === 0 ? (
                    <div className="pt-6 text-muted">No test cases were reported for this run.</div>
                  ) : (
                    <div id="test-invariants-grid" className="divide-y divide-rule">
                      {testCases.map((tc, idx) => (
                        <div key={tc.id || idx} id={`test-case-item-${idx}`} className="py-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-1.5 h-1.5 rounded-none shrink-0 ${tc.passed ? 'bg-ok' : 'bg-bad'}`} />
                            <span className="text-ink truncate">{tc.name}</span>
                            <span className={`text-xs ${tc.passed ? 'text-muted' : 'text-bad'}`}>
                              {tc.passed ? 'ok' : 'failed'}
                            </span>
                            {isRealNumber(tc.executionTimeMs) && (
                              <span className="ml-auto font-mono text-xs text-muted">{tc.executionTimeMs} ms</span>
                            )}
                          </div>
                          <div className="mt-1 pl-4 font-mono text-xs leading-relaxed text-ink-2 grid grid-cols-[auto_1fr] gap-x-3">
                            <span className="text-muted">in</span>
                            <span className="break-all">{tc.input}</span>
                            <span className="text-muted">want</span>
                            <span className="break-all">{tc.expected}</span>
                            {!tc.passed && (
                              <>
                                <span className="text-muted">got</span>
                                <span className="break-all text-bad">{tc.actual}</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Feedback */}
              {activeTab === 'notes' && (
                <div className="pt-3 max-w-prose">
                  {evaluation.feedback ? (
                    <p className="text-[15px] leading-7 text-ink-2 whitespace-pre-line">{evaluation.feedback}</p>
                  ) : (
                    <p className="text-muted">No written feedback for this run.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
