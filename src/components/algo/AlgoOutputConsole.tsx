import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  Layers,
  Sparkles,
  RefreshCw,
  Terminal,
  Check,
  Clock
} from 'lucide-react';
import { AlgoEvaluationResult, TestCaseResult } from '../../types';

interface AlgoOutputConsoleProps {
  evaluation: AlgoEvaluationResult | null;
  isEvaluating: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  activeTab: 'matrix' | 'testcases' | 'notes';
  onSelectTab: (tab: 'matrix' | 'testcases' | 'notes') => void;
}

export const AlgoOutputConsole: React.FC<AlgoOutputConsoleProps> = ({
  evaluation,
  isEvaluating,
  isExpanded,
  onToggleExpanded,
  activeTab,
  onSelectTab
}) => {
  return (
    <div
      id="algo-output-console"
      className="border-t border-[#CAD2C5]/40 dark:border-[#52796F]/30 bg-white dark:bg-[#2F3E46] flex flex-col flex-shrink-0 transition-all duration-300 z-30"
      style={{ height: isExpanded ? '440px' : '40px' }}
    >
      {/* Console Header Bar */}
      <div className="h-10 px-4 border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30 flex items-center justify-between bg-white dark:bg-[#2F3E46] select-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tab Navigation Segmented Control */}
          <div className="flex items-center bg-[#F4F6F4] dark:bg-[#1E272C] p-0.5 rounded-full border border-[#CAD2C5]/80 dark:border-[#52796F]/40">
            <button
              id="console-tab-matrix"
              onClick={() => {
                if (!isExpanded) onToggleExpanded();
                onSelectTab('matrix');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'matrix' && isExpanded
                  ? 'bg-white dark:bg-[#52796F] text-[#2F3E46] dark:text-white shadow-xs font-semibold'
                  : 'text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#52796F] dark:text-[#84A98C]" />
              <span>AI Evaluation Matrix</span>
            </button>

            <button
              id="console-tab-testcases"
              onClick={() => {
                if (!isExpanded) onToggleExpanded();
                onSelectTab('testcases');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'testcases' && isExpanded
                  ? 'bg-white dark:bg-[#52796F] text-[#2F3E46] dark:text-white shadow-xs font-semibold'
                  : 'text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#84A98C]" />
              <span>Test Invariants</span>
              {evaluation && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-[#CAD2C5]/30 dark:bg-[#354F52] text-[#2F3E46] dark:text-[#CAD2C5] font-mono">
                  {evaluation.testCases.filter((t) => t.passed).length}/{evaluation.testCases.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right Status & Expand toggle */}
        <div className="flex items-center gap-3">
          {isEvaluating && (
            <div className="flex items-center gap-1.5 text-xs text-[#52796F] dark:text-[#84A98C] font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Synthesizing plain-English logic...</span>
            </div>
          )}

          {!isEvaluating && evaluation && (
            <div className="flex items-center gap-2">
              {evaluation.engine && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#52796F] dark:text-[#CAD2C5]/80 bg-[#F4F6F4] dark:bg-[#354F52]/60 px-2 py-0.5 rounded-full border border-[#CAD2C5]/60 dark:border-[#52796F]/40 font-mono font-medium">
                  <Sparkles className="w-3 h-3 text-[#52796F] dark:text-[#84A98C]" />
                  {evaluation.engine}
                </span>
              )}
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  evaluation.passed
                    ? 'bg-emerald-50 text-[#84A98C] border border-emerald-200/70 dark:bg-emerald-950/40 dark:border-emerald-800/60'
                    : 'bg-red-50 text-[#FF3B30] border border-red-200/70 dark:bg-red-950/40 dark:border-red-800/60'
                }`}
              >
                {evaluation.passed ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Invariants Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    <span>Invariants Failed</span>
                  </>
                )}
              </span>
            </div>
          )}

          <button
            type="button"
            id="algo-console-toggle-btn"
            onClick={onToggleExpanded}
            className="p-1 rounded-full hover:bg-[#CAD2C5]/30 dark:hover:bg-white/10 text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse Console' : 'Expand Console'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Console Body */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4 text-xs font-mono text-[#2F3E46] dark:text-[#CAD2C5] bg-[#F4F6F4] dark:bg-[#1E272C]">
          {isEvaluating ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-[#52796F] dark:text-[#CAD2C5]/70">
              <div className="w-7 h-7 border-2 border-[#84A98C]/25 border-t-[#84A98C] rounded-full animate-spin" />
              <div className="text-center font-sans">
                <div className="font-semibold text-[#1D1D1F] dark:text-white text-sm">Evaluating Algorithmic Invariants</div>
                <div className="text-xs text-[#86868B] dark:text-neutral-400 mt-0.5 font-mono">
                  Checking Determinism, Boundary Invariants, Time/Space Complexity...
                </div>
              </div>
            </div>
          ) : !evaluation ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#86868B] dark:text-neutral-400 font-sans space-y-2">
              <Terminal className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
              <div className="font-semibold text-[#1D1D1F] dark:text-white">Execution Console Ready</div>
              <p className="text-xs text-[#6E6E73] dark:text-neutral-400 max-w-sm">
                Select <strong>"Verify Algo Prose"</strong> or <strong>"Run Logic"</strong> to execute deterministic reasoning validation against test cases and asymptotic invariants.
              </p>
            </div>
          ) : (
            <div>
              {/* TAB 1: AI Evaluation Matrix */}
              {activeTab === 'matrix' && (
                <div className="space-y-4 font-sans">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Correctness */}
                    <div className="bg-white dark:bg-[#2F3E46] border border-[#CAD2C5]/60 dark:border-[#52796F]/40 rounded-xl p-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[#52796F] dark:text-[#CAD2C5]/70 text-[11px] font-semibold font-mono">
                        <span>Correctness</span>
                        <span className="text-[#84A98C] font-bold">{evaluation.matrix.correctness}%</span>
                      </div>
                      <div className="w-full bg-[#CAD2C5]/30 dark:bg-[#1E272C] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#84A98C] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.matrix.correctness}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/60">Invariants &amp; bounds</p>
                    </div>

                    {/* Determinism */}
                    <div className="bg-white dark:bg-[#2F3E46] border border-[#CAD2C5]/60 dark:border-[#52796F]/40 rounded-xl p-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[#52796F] dark:text-[#CAD2C5]/70 text-[11px] font-semibold font-mono">
                        <span>Determinism</span>
                        <span className="text-[#52796F] dark:text-[#CAD2C5] font-bold">{evaluation.matrix.determinism}%</span>
                      </div>
                      <div className="w-full bg-[#CAD2C5]/30 dark:bg-[#1E272C] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#52796F] dark:bg-[#CAD2C5] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.matrix.determinism}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/60">Unambiguous logic</p>
                    </div>

                    {/* Efficiency */}
                    <div className="bg-white dark:bg-[#2F3E46] border border-[#CAD2C5]/60 dark:border-[#52796F]/40 rounded-xl p-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[#52796F] dark:text-[#CAD2C5]/70 text-[11px] font-semibold font-mono">
                        <span>Efficiency</span>
                        <span className="text-[#84A98C] font-bold">{evaluation.matrix.efficiency}%</span>
                      </div>
                      <div className="w-full bg-[#CAD2C5]/30 dark:bg-[#1E272C] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#84A98C] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.matrix.efficiency}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/60">Asymptotic optimality</p>
                    </div>

                    {/* Brevity */}
                    <div className="bg-white dark:bg-[#2F3E46] border border-[#CAD2C5]/60 dark:border-[#52796F]/40 rounded-xl p-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[#52796F] dark:text-[#CAD2C5]/70 text-[11px] font-semibold font-mono">
                        <span>Brevity</span>
                        <span className="text-[#354F52] dark:text-[#84A98C] font-bold">{evaluation.matrix.brevity}%</span>
                      </div>
                      <div className="w-full bg-[#CAD2C5]/30 dark:bg-[#1E272C] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#354F52] dark:bg-[#84A98C] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.matrix.brevity}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/60">No redundant chatter</p>
                    </div>
                  </div>

                  {/* Feedback Box */}
                  <div className="p-4 rounded-xl border border-[#CAD2C5]/60 dark:border-[#52796F]/40 bg-white dark:bg-[#2F3E46] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#2F3E46] dark:text-white">
                        <Sparkles className="w-4 h-4 text-[#52796F] dark:text-[#84A98C]" />
                        <span>Architectural &amp; Logic Feedback</span>
                      </div>
                      {evaluation.complexityDetected && (
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="bg-[#CAD2C5]/30 dark:bg-[#1E272C] px-2 py-0.5 rounded text-[#2F3E46] dark:text-[#CAD2C5]">
                            Time: <strong>{evaluation.complexityDetected.time}</strong>
                          </span>
                          <span className="bg-[#CAD2C5]/30 dark:bg-[#1E272C] px-2 py-0.5 rounded text-[#2F3E46] dark:text-[#CAD2C5]">
                            Space: <strong>{evaluation.complexityDetected.space}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#52796F] dark:text-[#CAD2C5]/90 leading-relaxed whitespace-pre-line">
                      {evaluation.feedback}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: Test Cases */}
              {activeTab === 'testcases' && (
                <div id="test-invariants-container" className="space-y-3 font-mono">
                  <div id="test-invariants-grid" className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {evaluation.testCases.map((tc, idx) => (
                      <div
                        key={tc.id || idx}
                        id={`test-case-item-${idx}`}
                        className={`p-3 rounded-xl border transition-all ${
                          tc.passed
                            ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20'
                            : 'border-red-200 dark:border-red-500/30 bg-red-50/40 dark:bg-red-950/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            {tc.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-[#FF3B30]" />
                            )}
                            <span className={tc.passed ? 'text-[#1E7E34] dark:text-emerald-400' : 'text-[#FF3B30] dark:text-red-400'}>
                              {tc.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#86868B] dark:text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tc.executionTimeMs}ms
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px] text-[#1D1D1F] dark:text-[#E6EDF3]">
                          <div>
                            <span className="text-[#86868B] dark:text-neutral-400">Input: </span>
                            <span>{tc.input}</span>
                          </div>
                          <div>
                            <span className="text-[#86868B] dark:text-neutral-400">Expected: </span>
                            <span className="text-[#34C759] dark:text-emerald-400">{tc.expected}</span>
                          </div>
                          <div>
                            <span className="text-[#86868B] dark:text-neutral-400">Actual: </span>
                            <span className={tc.passed ? 'text-[#34C759] dark:text-emerald-400' : 'text-[#FF3B30] dark:text-red-400'}>
                              {tc.actual}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
