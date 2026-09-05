import React, { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Network,
  Play,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { usePlatformStore } from '../store/usePlatformStore';
import { Problem } from '../types';
import { FormattedMarkdown } from './FormattedMarkdown';

interface ProblemDescriptionProps {
  problem: Problem;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const {
    solvedProblemIds,
    runAlgoEvaluation,
    runArchEvaluation,
    isEvaluating,
    resetProblem,
    setConsoleExpanded
  } = usePlatformStore();

  const [expandedHintIndex, setExpandedHintIndex] = useState<number | null>(null);
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
    <div id="workspace-left-pane" className="flex flex-col h-full bg-white dark:bg-[#2F3E46] text-[#2F3E46] dark:text-[#CAD2C5] select-text overflow-hidden border-r border-[#CAD2C5]/40 dark:border-[#52796F]/30 transition-colors">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30 flex-shrink-0 bg-white/95 dark:bg-[#2F3E46]/95 backdrop-blur">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {isAlgo ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CAD2C5]/20 dark:bg-[#354F52] text-[#52796F] dark:text-[#84A98C] border border-[#CAD2C5] dark:border-[#52796F]/50">
                <Terminal className="w-3 h-3" />
                Algo-English
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#CAD2C5]/20 dark:bg-[#354F52] text-[#52796F] dark:text-[#CAD2C5] border border-[#CAD2C5] dark:border-[#52796F]/50">
                <Network className="w-3 h-3" />
                System Design
              </span>
            )}

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#34C759] dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/60'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-[#FF9500] dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/60'
                  : 'bg-red-50 dark:bg-red-950/60 text-[#FF3B30] dark:text-red-400 border border-red-200/70 dark:border-red-800/60'
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          {isSolved && (
            <span className="flex items-center gap-1 text-xs text-[#84A98C] dark:text-[#84A98C] font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#2F3E46] dark:text-white tracking-tight leading-snug">
          {problem.title}
        </h2>
        <div className="text-xs text-[#52796F] dark:text-[#CAD2C5]/70 mt-1.5 flex items-center gap-3 font-mono">
          <span>Acceptance: <strong className="text-[#2F3E46] dark:text-white">{problem.acceptanceRate}</strong></span>
          <span>•</span>
          <span>{problem.tags.slice(0, 3).join(', ')}</span>
        </div>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-sm leading-relaxed">
        {/* Format Freedom Banner */}
        {isAlgo && (
          <div className="p-3.5 rounded-xl border border-[#84A98C]/40 dark:border-[#52796F]/50 bg-[#84A98C]/10 dark:bg-[#354F52]/40 text-xs flex items-start gap-2.5 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#52796F] dark:text-[#84A98C] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[#52796F] dark:text-[#84A98C] font-semibold">Write in Any Format: </strong>
              <span className="text-[#2F3E46] dark:text-[#CAD2C5]">
                Paragraphs, bullet points, or numbered steps are all fully supported. Englo marks your underlying logical invariants and data structures, not your formatting style.
              </span>
            </div>
          </div>
        )}

        {/* Description Section with Formatted Markdown */}
        <div className="space-y-2.5">
          <h3 className="text-xs uppercase tracking-wider text-[#52796F] dark:text-[#CAD2C5]/70 font-mono font-semibold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#52796F] dark:text-[#84A98C]" />
            Specification &amp; Invariants
          </h3>
          <div className="leading-relaxed">
            <FormattedMarkdown content={problem.description} />
          </div>
        </div>

        {/* Examples Section */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-[#52796F] dark:text-[#CAD2C5]/70 font-mono font-semibold">
              Example Proofs
            </h3>
            <div className="space-y-3">
              {problem.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#CAD2C5]/80 dark:border-[#52796F]/40 bg-[#F4F6F4] dark:bg-[#1E272C] p-3.5 text-xs font-mono space-y-2 shadow-2xs relative group"
                >
                  <button
                    onClick={() => copyExample(`Input: ${ex.input}\nOutput: ${ex.output}`, i)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-[#52796F] hover:text-[#2F3E46] dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-colors cursor-pointer"
                    title="Copy Example"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-3.5 h-3.5 text-[#84A98C]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <div>
                    <span className="text-[#52796F] dark:text-[#CAD2C5]/70">Input: </span>
                    <span className="text-[#2F3E46] dark:text-[#CAD2C5] font-semibold">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-[#52796F] dark:text-[#CAD2C5]/70">Output: </span>
                    <span className="text-[#52796F] dark:text-[#84A98C] font-semibold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-[#52796F] dark:text-[#CAD2C5]/80 font-sans text-[11px] pt-1 border-t border-[#CAD2C5]/40 dark:border-[#52796F]/30">
                      <strong className="text-[#2F3E46] dark:text-white">Explanation: </strong>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {problem.constraints && problem.constraints.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider text-[#52796F] dark:text-[#CAD2C5]/70 font-mono font-semibold">
              Boundary Constraints
            </h3>
            <ul className="space-y-1.5">
              {problem.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#2F3E46] dark:text-[#CAD2C5]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84A98C] shrink-0 mt-1.5" />
                  <span className="font-mono bg-[#CAD2C5]/30 dark:bg-[#1E272C] px-1.5 py-0.5 rounded text-[#2F3E46] dark:text-[#CAD2C5]">
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hints */}
        {problem.hints && problem.hints.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t border-[#CAD2C5]/40 dark:border-[#52796F]/30">
            <h3 className="text-xs uppercase tracking-wider text-[#52796F] dark:text-[#CAD2C5]/70 font-mono font-semibold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#84A98C]" />
              Architectural Hints
            </h3>
            <div className="space-y-2">
              {problem.hints.map((hint, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#CAD2C5]/80 dark:border-[#52796F]/40 bg-[#F4F6F4] dark:bg-[#1E272C] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedHintIndex(expandedHintIndex === idx ? null : idx)}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-[#2F3E46] dark:text-[#CAD2C5] flex items-center justify-between hover:bg-[#CAD2C5]/20 dark:hover:bg-[#354F52]/50 transition-colors cursor-pointer"
                  >
                    <span>Hint {idx + 1}</span>
                    {expandedHintIndex === idx ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#52796F] dark:text-[#CAD2C5]/70" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#52796F] dark:text-[#CAD2C5]/70" />
                    )}
                  </button>
                  {expandedHintIndex === idx && (
                    <div className="px-3.5 py-2.5 text-xs text-[#52796F] dark:text-[#CAD2C5]/80 bg-[#CAD2C5]/10 dark:bg-[#2F3E46] border-t border-[#CAD2C5]/40 dark:border-[#52796F]/30 leading-relaxed">
                      {hint}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Run Bar */}
      <div className="p-3.5 sm:p-4 border-t border-[#CAD2C5]/40 dark:border-[#52796F]/30 bg-white dark:bg-[#2F3E46] flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset this problem to its starting template? Any unsaved work will be cleared.')) {
              resetProblem(problem.id);
            }
          }}
          className="px-3 py-1.5 text-xs text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white hover:bg-[#CAD2C5]/30 dark:hover:bg-white/10 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reset to starter template"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={handleRun}
          disabled={isEvaluating}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-[#2F3E46] hover:text-white bg-[#84A98C] hover:bg-[#52796F] active:scale-97 shadow-[0_2px_8px_rgba(132,169,140,0.3)] transition-all disabled:opacity-70 cursor-pointer"
        >
          {isEvaluating ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying Logic...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isAlgo ? 'Verify Algo Prose' : 'Simulate Topology'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
