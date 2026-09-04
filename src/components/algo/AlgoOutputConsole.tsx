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
      className="border-t border-black/[0.06] bg-white flex flex-col flex-shrink-0 transition-all duration-300"
      style={{ height: isExpanded ? '340px' : '40px' }}
    >
      {/* Console Header Bar */}
      <div className="h-10 px-4 border-b border-black/[0.06] flex items-center justify-between bg-white select-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tab Navigation Segmented Control */}
          <div className="flex items-center bg-[#F5F5F7] p-0.5 rounded-full border border-neutral-200/80">
            <button
              id="console-tab-matrix"
              onClick={() => {
                if (!isExpanded) onToggleExpanded();
                onSelectTab('matrix');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTab === 'matrix' && isExpanded
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>AI Evaluation Matrix</span>
            </button>

            <button
              id="console-tab-testcases"
              onClick={() => {
                if (!isExpanded) onToggleExpanded();
                onSelectTab('testcases');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTab === 'testcases' && isExpanded
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#FF9500]" />
              <span>Test Invariants</span>
              {evaluation && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 text-[#1D1D1F] font-mono">
                  {evaluation.testCases.filter((t) => t.passed).length}/{evaluation.testCases.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right Status & Expand toggle */}
        <div className="flex items-center gap-3">
          {isEvaluating && (
            <div className="flex items-center gap-1.5 text-xs text-[#0071E3] font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Synthesizing plain-English logic...</span>
            </div>
          )}

          {!isEvaluating && evaluation && (
            <div className="flex items-center gap-2">
              {evaluation.engine && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-full border border-black/[0.05] font-mono font-medium">
                  <Sparkles className="w-3 h-3 text-[#0071E3]" />
                  {evaluation.engine}
                </span>
              )}
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  evaluation.passed
                    ? 'bg-emerald-50 text-[#34C759] border border-emerald-200/70'
                    : 'bg-red-50 text-[#FF3B30] border border-red-200/70'
                }`}
              >
                {evaluation.passed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed ({evaluation.score}/100)
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    Needs Revision ({evaluation.score}/100)
                  </>
                )}
              </span>
            </div>
          )}

          <button
            id="console-collapse-toggle"
            onClick={onToggleExpanded}
            className="p-1 text-[#86868B] hover:text-[#1D1D1F] rounded-full hover:bg-neutral-100 transition-colors"
            title={isExpanded ? 'Collapse Console' : 'Expand Console'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Console Body */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4 text-xs font-mono text-[#1D1D1F] bg-[#FBFBFD]">
          {isEvaluating ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-[#6E6E73]">
              <div className="w-7 h-7 border-2 border-[#0071E3]/25 border-t-[#0071E3] rounded-full animate-spin" />
              <div className="text-center font-sans">
                <div className="font-semibold text-[#1D1D1F] text-sm">Evaluating Algorithmic Invariants</div>
                <div className="text-xs text-[#86868B] mt-0.5 font-mono">
                  Checking Determinism, Boundary Invariants, Time/Space Complexity...
                </div>
              </div>
            </div>
          ) : !evaluation ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#86868B] font-sans space-y-2">
              <Terminal className="w-8 h-8 text-neutral-300" />
              <div className="font-semibold text-[#1D1D1F]">Execution Console Ready</div>
              <p className="text-xs text-[#6E6E73] max-w-sm">
                Select <strong>"Verify Algo Prose"</strong> in the problem panel to execute deterministic reasoning validation against test cases and asymptotic invariants.
              </p>
            </div>
          ) : (
            <div>
              {/* TAB 1: AI Evaluation Matrix */}
              {activeTab === 'matrix' && (
                <div className="space-y-4 font-sans">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Correctness */}
                    <div className="bg-white border border-black/[0.06] rounded-xl p-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[#86868B] text-[11px] font-semibold font-mono">
                        <span>Correctness</span>
                        <span className="text-[#0071E3]">{evaluation.matrix.correctness}%</span>
                      </div>
                      <div className="w-full bg-[#F5F5F7] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0071E3] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.matrix.correctness}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#86868B]">Invariants &amp; bounds</p>
                    </div>

                    {/* Determinism */}
                    <div className="bg-white border border-black/[0.06] rounded-xl p-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[#86868B] text-[11px] font-semibold font-mono">
                        <span>Determinism</span>
                        <span className="text-[#34C759]">{evaluation.matrix.determinism}%</span>
                      </div>
                      <div className="w-full bg-[#F5F5F7] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#34C759] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.matrix.determinism}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#86868B]">Unambiguous logic</p>
                    </div>

                    {/* Efficiency */}
                    <div className="bg-white border border-black/[0.06] rounded-xl p-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[#86868B] text-[11px] font-semibold font-mono">
                        <span>Efficiency</span>
                        <span className="text-[#FF9500]">{evaluation.matrix.efficiency}%</span>
                      </div>
                      <div className="w-full bg-[#F5F5F7] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#FF9500] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.matrix.efficiency}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#86868B]">Asymptotic optimality</p>
                    </div>

                    {/* Brevity */}
                    <div className="bg-white border border-black/[0.06] rounded-xl p-3 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[#86868B] text-[11px] font-semibold font-mono">
                        <span>Brevity</span>
                        <span className="text-[#AF00DB]">{evaluation.matrix.brevity}%</span>
                      </div>
                      <div className="w-full bg-[#F5F5F7] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#AF00DB] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.matrix.brevity}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#86868B]">No redundant chatter</p>
                    </div>
                  </div>

                  {/* Feedback Box */}
                  <div className="p-4 rounded-xl border border-black/[0.06] bg-white space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#1D1D1F]">
                        <Sparkles className="w-4 h-4 text-[#0071E3]" />
                        <span>Architectural &amp; Logic Feedback</span>
                      </div>
                      {evaluation.complexityDetected && (
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="bg-neutral-100 px-2 py-0.5 rounded text-[#1D1D1F]">
                            Time: <strong>{evaluation.complexityDetected.time}</strong>
                          </span>
                          <span className="bg-neutral-100 px-2 py-0.5 rounded text-[#1D1D1F]">
                            Space: <strong>{evaluation.complexityDetected.space}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#6E6E73] leading-relaxed whitespace-pre-line">
                      {evaluation.feedback}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: Test Cases */}
              {activeTab === 'testcases' && (
                <div className="space-y-3 font-mono">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {evaluation.testCases.map((tc, idx) => (
                      <div
                        key={tc.id || idx}
                        className={`p-3 rounded-xl border transition-all ${
                          tc.passed
                            ? 'border-emerald-200 bg-emerald-50/40'
                            : 'border-red-200 bg-red-50/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-xs">
                            {tc.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-[#FF3B30]" />
                            )}
                            <span className={tc.passed ? 'text-[#1E7E34]' : 'text-[#FF3B30]'}>
                              {tc.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#86868B] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tc.executionTimeMs}ms
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px] text-[#1D1D1F]">
                          <div>
                            <span className="text-[#86868B]">Input: </span>
                            <span>{tc.input}</span>
                          </div>
                          <div>
                            <span className="text-[#86868B]">Expected: </span>
                            <span className="text-[#34C759]">{tc.expected}</span>
                          </div>
                          <div>
                            <span className="text-[#86868B]">Actual: </span>
                            <span className={tc.passed ? 'text-[#34C759]' : 'text-[#FF3B30]'}>
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
