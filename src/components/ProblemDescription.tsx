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
    <div className="flex flex-col h-full bg-white text-[#1D1D1F] select-text overflow-hidden border-r border-black/[0.06]">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-black/[0.06] flex-shrink-0 bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {isAlgo ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0071E3] border border-blue-200/70">
                <Terminal className="w-3 h-3" />
                Algo-English
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#AF00DB] border border-purple-200/70">
                <Network className="w-3 h-3" />
                System Design
              </span>
            )}

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-[#34C759] border border-emerald-200/70'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-50 text-[#FF9500] border border-amber-200/70'
                  : 'bg-red-50 text-[#FF3B30] border border-red-200/70'
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          {isSolved && (
            <span className="flex items-center gap-1 text-xs text-[#34C759] font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] tracking-tight leading-snug">
          {problem.title}
        </h2>
        <div className="text-xs text-[#6E6E73] mt-1.5 flex items-center gap-3 font-mono">
          <span>Acceptance: <strong className="text-[#1D1D1F]">{problem.acceptanceRate}</strong></span>
          <span>•</span>
          <span>{problem.tags.slice(0, 3).join(', ')}</span>
        </div>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-sm leading-relaxed">
        {/* Format Freedom Banner */}
        {isAlgo && (
          <div className="p-3.5 rounded-xl border border-blue-500/25 bg-blue-50/70 text-xs flex items-start gap-2.5 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[#0071E3] font-semibold">Write in Any Format: </strong>
              <span className="text-[#1D1D1F]">
                Paragraphs, bullet points, or numbered steps are all fully supported. Englo marks your underlying logical invariants and data structures, not your formatting style.
              </span>
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="space-y-2.5">
          <h3 className="text-xs uppercase tracking-wider text-[#86868B] font-mono font-semibold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#0071E3]" />
            Specification &amp; Invariants
          </h3>
          <div className="text-[#1D1D1F] whitespace-pre-line leading-relaxed space-y-2">
            {problem.description}
          </div>
        </div>

        {/* Examples Section */}
        {problem.examples && problem.examples.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-[#86868B] font-mono font-semibold">
              Example Proofs
            </h3>
            <div className="space-y-3">
              {problem.examples.map((ex, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-200/80 bg-[#F5F5F7] p-3.5 text-xs font-mono space-y-2 shadow-2xs relative group"
                >
                  <button
                    onClick={() => copyExample(`Input: ${ex.input}\nOutput: ${ex.output}`, i)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-[#86868B] hover:text-[#1D1D1F] hover:bg-white transition-colors"
                    title="Copy Example"
                  >
                    {copiedIndex === i ? (
                      <Check className="w-3.5 h-3.5 text-[#34C759]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <div>
                    <span className="text-[#86868B]">Input: </span>
                    <span className="text-[#1D1D1F] font-semibold">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-[#86868B]">Output: </span>
                    <span className="text-[#0071E3] font-semibold">{ex.output}</span>
                  </div>
                  {ex.explanation && (
                    <div className="text-[#6E6E73] font-sans text-[11px] pt-1 border-t border-neutral-200">
                      <strong className="text-[#1D1D1F]">Explanation: </strong>
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
            <h3 className="text-xs uppercase tracking-wider text-[#86868B] font-mono font-semibold">
              Boundary Constraints
            </h3>
            <ul className="space-y-1.5">
              {problem.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#1D1D1F]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] shrink-0 mt-1.5" />
                  <span className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-[#1D1D1F]">
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hints */}
        {problem.hints && problem.hints.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t border-neutral-100">
            <h3 className="text-xs uppercase tracking-wider text-[#86868B] font-mono font-semibold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF9500]" />
              Architectural Hints
            </h3>
            <div className="space-y-2">
              {problem.hints.map((hint, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-200/80 bg-[#FBFBFD] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedHintIndex(expandedHintIndex === idx ? null : idx)}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-[#1D1D1F] flex items-center justify-between hover:bg-[#F5F5F7] transition-colors"
                  >
                    <span>Hint {idx + 1}</span>
                    {expandedHintIndex === idx ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#86868B]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#86868B]" />
                    )}
                  </button>
                  {expandedHintIndex === idx && (
                    <div className="px-3.5 py-2.5 text-xs text-[#6E6E73] bg-[#F5F5F7] border-t border-neutral-200 leading-relaxed">
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
      <div className="p-3.5 sm:p-4 border-t border-black/[0.06] bg-white flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset this problem to its starting template? Any unsaved work will be cleared.')) {
              resetProblem(problem.id);
            }
          }}
          className="px-3 py-1.5 text-xs text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-neutral-100 rounded-full flex items-center gap-1.5 transition-colors"
          title="Reset to starter template"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={handleRun}
          disabled={isEvaluating}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0077ED] active:scale-97 shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-all disabled:opacity-70"
        >
          {isEvaluating ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying Logic...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isAlgo ? 'Verify Algo Prose' : 'Simulate Topology'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
