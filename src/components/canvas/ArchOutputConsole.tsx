import React from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { ArchitectureEvaluationResult } from '../../types';

interface ArchOutputConsoleProps {
  evaluation: ArchitectureEvaluationResult | null;
  isEvaluating: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  activeTab: 'scenarios' | 'metrics' | 'recommendations';
  onSelectTab: (tab: 'scenarios' | 'metrics' | 'recommendations') => void;
}

type TabId = ArchOutputConsoleProps['activeTab'];

const TABS: { id: TabId; domId: string; label: string }[] = [
  { id: 'scenarios', domId: 'arch-tab-scenarios', label: 'Scenarios' },
  { id: 'metrics', domId: 'arch-tab-metrics', label: 'Scores' },
  { id: 'recommendations', domId: 'arch-tab-recommendations', label: 'Feedback' }
];

export const ArchOutputConsole: React.FC<ArchOutputConsoleProps> = ({
  evaluation,
  isEvaluating,
  isExpanded,
  onToggleExpanded,
  activeTab,
  onSelectTab
}) => {
  const passedCount = evaluation ? evaluation.testCases.filter((t) => t.passed).length : 0;
  const totalCount = evaluation ? evaluation.testCases.length : 0;

  const scores = evaluation
    ? [
        { label: 'Throughput', hint: 'Capacity under load', value: evaluation.throughputScore },
        { label: 'Reliability', hint: 'Redundancy and failover', value: evaluation.reliabilityScore },
        { label: 'Scalability', hint: 'Horizontal scaling and sharding', value: evaluation.scalabilityScore }
      ]
    : [];

  return (
    <section
      id="arch-output-console"
      aria-label="Scenario results"
      className="border-t border-rule bg-paper-2 flex flex-col flex-shrink-0 z-30"
      style={{ height: isExpanded ? '330px' : '44px' }}
    >
      {/* Header */}
      <div className="h-11 px-3 flex items-center justify-between gap-3 select-none shrink-0">
        <div role="tablist" aria-label="Result views" className="seg">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              id={tab.domId}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id && isExpanded}
              onClick={() => {
                if (!isExpanded) onToggleExpanded();
                onSelectTab(tab.id);
              }}
              className="seg-item cursor-pointer"
            >
              {tab.label}
              {tab.id === 'scenarios' && evaluation && (
                <span className="ml-1.5 text-muted tabular-nums">
                  {passedCount}/{totalCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 min-w-0">
          {isEvaluating && (
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Running scenarios</span>
            </span>
          )}

          {!isEvaluating && evaluation && (
            <span className="flex items-center gap-1.5 text-xs text-ink-2 whitespace-nowrap">
              <span
                aria-hidden="true"
                className={`w-2 h-2 rounded-none ${evaluation.passed ? 'bg-ok' : 'bg-bad'}`}
              />
              {evaluation.passed ? 'Passed' : 'Needs work'}
              <span className="text-muted tabular-nums">{evaluation.score}/100</span>
            </span>
          )}

          <button
            type="button"
            onClick={onToggleExpanded}
            className="btn-icon border-transparent w-8 h-8"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse results' : 'Expand results'}
            title={isExpanded ? 'Collapse results' : 'Expand results'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto border-t border-rule bg-paper px-5 py-4 text-sm text-ink-2">
          {isEvaluating ? (
            <div className="h-full flex items-center justify-center gap-2 text-muted">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running load and failover scenarios on your design</span>
            </div>
          ) : !evaluation ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-1">
              <p className="text-ink font-medium">No results yet</p>
              <p className="text-muted max-w-sm">
                Press <span className="text-ink">Run scenarios</span> to test your design for load, failover and bottlenecks.
              </p>
            </div>
          ) : (
            <div className="max-w-4xl space-y-4">
              {/* Summary first, in plain words */}
              <p className="text-ink-2">
                <span className="text-ink font-medium">
                  {evaluation.passed ? 'Your design passed.' : 'Your design needs work.'}
                </span>{' '}
                {passedCount} of {totalCount} scenarios held up. Score {evaluation.score}/100.
                {evaluation.engine && <span className="text-muted text-xs"> Checked by {evaluation.engine}.</span>}
              </p>

              {activeTab === 'scenarios' && (
                <ul className="divide-y divide-rule border-y border-rule">
                  {evaluation.testCases.map((tc) => (
                    <li key={tc.id} className="py-2.5 flex gap-3">
                      <span
                        role="img"
                        aria-label={tc.passed ? 'Passed' : 'Failed'}
                        className={`mt-1.5 w-2 h-2 rounded-none shrink-0 ${tc.passed ? 'bg-ok' : 'bg-bad'}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-ink font-medium">{tc.name}</span>
                          <span className="text-xs text-muted tabular-nums shrink-0">+{tc.impactScore} pts</span>
                        </div>
                        <p className="text-muted leading-relaxed mt-0.5">{tc.details}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'metrics' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {scores.map((s) => (
                    <div key={s.label} className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-ink font-medium">{s.label}</span>
                        <span className="text-ink tabular-nums">{s.value}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-none bg-rule overflow-hidden">
                        <div
                          className="h-full rounded-none bg-accent"
                          style={{ width: `${s.value}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted">{s.hint}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="label">Bottlenecks</h3>
                    {evaluation.identifiedBottlenecks.length > 0 ? (
                      <ul className="space-y-2">
                        {evaluation.identifiedBottlenecks.map((b, i) => (
                          <li key={i} className="flex gap-2.5 leading-relaxed">
                            <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-none bg-bad shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">None found.</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="label">What to improve</h3>
                    {evaluation.recommendations.length > 0 ? (
                      <ul className="space-y-2">
                        {evaluation.recommendations.map((r, i) => (
                          <li key={i} className="flex gap-2.5 leading-relaxed">
                            <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 rounded-none bg-accent shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">Nothing to add.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
