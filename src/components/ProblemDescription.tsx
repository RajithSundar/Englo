import React, { useState } from 'react';
import { ChevronRight, Copy, Check, Play, Loader2, RotateCcw } from 'lucide-react';
import { usePlatformStore } from '../store/usePlatformStore';
import { Problem } from '../types';
import { FormattedMarkdown } from './FormattedMarkdown';

interface ProblemDescriptionProps {
  problem: Problem;
}

const difficultyChip = (d: Problem['difficulty']) =>
  d === 'Easy' ? 'chip chip-easy' : d === 'Medium' ? 'chip chip-medium' : 'chip chip-hard';

const summaryClass =
  'flex items-center gap-2 cursor-pointer select-none list-none text-sm font-medium text-ink [&::-webkit-details-marker]:hidden';

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const {
    solvedProblemIds,
    runAlgoEvaluation,
    runArchEvaluation,
    isEvaluating,
    resetProblem,
    setConsoleExpanded
  } = usePlatformStore();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isSolved = solvedProblemIds.includes(problem.id);
  const isAlgo = problem.category === 'algorithm';

  const handleRun = async () => {
    setConsoleExpanded(true);
    if (isAlgo) {
      await runAlgoEvaluation(problem.id);
    } else {
      await runArchEvaluation(problem.id);
    }
  };

  const copyExample = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div id="workspace-left-pane" className="flex flex-col h-full bg-paper text-ink select-text overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-7">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-2xl font-medium tracking-tight text-ink leading-tight">{problem.title}</h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className={difficultyChip(problem.difficulty)}>{problem.difficulty}</span>
            {isSolved && <span className="chip chip-accent">Solved</span>}
            <span className="text-sm text-muted">
              {[isAlgo ? 'Algorithm' : 'System design', ...problem.tags.slice(0, 3)].join(' · ')}
            </span>
          </div>
        </header>

        {/* Description */}
        <div className="mt-6">
          <FormattedMarkdown content={problem.description} />
          {isAlgo && (
            <p className="mt-3 text-sm text-muted">
              Answer in any format: a paragraph, bullet points or numbered steps.
            </p>
          )}
        </div>

        {/* Examples */}
        {problem.examples && problem.examples.length > 0 && (
          <section className="mt-8 space-y-4">
            {problem.examples.map((ex, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium text-ink">Example {i + 1}</h2>
                  <button
                    type="button"
                    onClick={() => copyExample(`Input: ${ex.input}\nOutput: ${ex.output}`, i)}
                    className="btn-quiet h-7 px-2 text-xs text-muted"
                    title="Copy example"
                    aria-label={`Copy example ${i + 1}`}
                  >
                    {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-ok" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="rounded-lg bg-paper-3 px-4 py-3 font-mono text-[13px] leading-6 text-ink-2 space-y-0.5 overflow-x-auto">
                  <div>
                    <span className="text-muted">Input: </span>
                    <span className="text-ink">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-muted">Output: </span>
                    <span className="text-ink">{ex.output}</span>
                  </div>
                </div>
                {ex.explanation && (
                  <p className="text-sm leading-6 text-muted">{ex.explanation}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Constraints and hints */}
        {((problem.constraints && problem.constraints.length > 0) || (problem.hints && problem.hints.length > 0)) && (
          <div className="mt-8 border-t border-rule divide-y divide-rule">
            {problem.constraints && problem.constraints.length > 0 && (
              <details open className="group py-4">
                <summary className={summaryClass}>
                  <ChevronRight className="w-4 h-4 text-muted transition-transform group-open:rotate-90" />
                  Constraints
                </summary>
                <ul className="mt-3 pl-6 space-y-1.5">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="font-mono text-[13px] leading-6 text-ink-2">
                      {c}
                    </li>
                  ))}
                </ul>
              </details>
            )}

            {problem.hints && problem.hints.length > 0 && (
              <details className="group py-4">
                <summary className={summaryClass}>
                  <ChevronRight className="w-4 h-4 text-muted transition-transform group-open:rotate-90" />
                  Hints
                  <span className="text-muted font-normal">{problem.hints.length}</span>
                </summary>
                <div className="mt-3 pl-6 space-y-2">
                  {problem.hints.map((hint, idx) => (
                    <details key={idx} className="group/hint">
                      <summary className="cursor-pointer select-none list-none text-sm text-ink-2 hover:text-ink [&::-webkit-details-marker]:hidden flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-muted transition-transform group-open/hint:rotate-90" />
                        Hint {idx + 1}
                      </summary>
                      <p className="mt-1.5 pl-5 text-[15px] leading-7 text-ink-2">{hint}</p>
                    </details>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="h-14 px-6 sm:px-7 border-t border-rule flex items-center justify-between gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset this problem to its starting template? Any unsaved work will be cleared.')) {
              resetProblem(problem.id);
            }
          }}
          className="btn-quiet h-8 text-muted"
          title="Reset to starter template"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button type="button" onClick={handleRun} disabled={isEvaluating} className="btn-primary h-8">
          {isEvaluating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Checking</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isAlgo ? 'Check answer' : 'Run scenarios'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
