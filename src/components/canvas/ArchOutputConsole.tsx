import React, { useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Zap,
  RefreshCw,
  Layers,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';
import { ArchitectureEvaluationResult } from '../../types';

interface ArchOutputConsoleProps {
  evaluation: ArchitectureEvaluationResult | null;
  isEvaluating: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  activeTab: 'scenarios' | 'metrics' | 'recommendations';
  onSelectTab: (tab: 'scenarios' | 'metrics' | 'recommendations') => void;
}

export const ArchOutputConsole: React.FC<ArchOutputConsoleProps> = ({
  evaluation,
  isEvaluating,
  isExpanded,
  onToggleExpanded,
  activeTab,
  onSelectTab
}) => {

  return (
    <div
      id="arch-output-console"
      className="border-t border-black/[0.06] bg-white flex flex-col flex-shrink-0 transition-all duration-300 z-30"
      style={{ height: isExpanded ? '330px' : '40px' }}
    >
      {/* Console Header Bar */}
      <div className="h-10 px-4 border-b border-black/[0.06] flex items-center justify-between bg-white select-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Segmented Control */}
          <div className="flex items-center bg-[#F5F5F7] p-0.5 rounded-full border border-neutral-200/80">
            <button
              id="arch-tab-scenarios"
              onClick={() => {
                if (!isExpanded) onToggleExpanded();
                onSelectTab('scenarios');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTab === 'scenarios' && isExpanded
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Test Pipeline</span>
              {evaluation && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 text-[#1D1D1F] font-mono">
                  {evaluation.testCases.filter((t) => t.passed).length}/{evaluation.testCases.length}
                </span>
              )}
            </button>

            <button
              id="arch-tab-metrics"
              onClick={() => {
                if (!isExpanded) onToggleExpanded();
                onSelectTab('metrics');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTab === 'metrics' && isExpanded
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#34C759]" />
              <span>Throughput &amp; Reliability</span>
            </button>

            <button
              id="arch-tab-recommendations"
              onClick={() => {
                if (!isExpanded) onToggleExpanded();
                onSelectTab('recommendations');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTab === 'recommendations' && isExpanded
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF9500]" />
              <span>Bottlenecks &amp; Guidance</span>
            </button>
          </div>
        </div>

        {/* Right status */}
        <div className="flex items-center gap-3">
          {isEvaluating && (
            <div className="flex items-center gap-1.5 text-xs text-[#0071E3] font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Simulating traffic load &amp; failover...</span>
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
                    Review Needed ({evaluation.score}/100)
                  </>
                )}
              </span>
            </div>
          )}

          <button
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
            <div className="h-full flex flex-col items-center justify-center gap-3 text-[#6E6E73] font-sans">
              <div className="w-7 h-7 border-2 border-[#0071E3]/25 border-t-[#0071E3] rounded-full animate-spin" />
              <div className="text-center">
                <div className="font-semibold text-[#1D1D1F] text-sm">Simulating Architecture Scenarios</div>
                <div className="text-xs text-[#86868B] font-mono mt-0.5">
                  Injecting peak RPS, testing regional failover, evaluating cache hit ratios...
                </div>
              </div>
            </div>
          ) : !evaluation ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[#86868B] font-sans space-y-2">
              <Layers className="w-8 h-8 text-neutral-300" />
              <div className="font-semibold text-[#1D1D1F]">Architecture Simulation Engine Ready</div>
              <p className="text-xs text-[#6E6E73] max-w-sm">
                Click <strong>"Simulate Topology"</strong> in the problem panel to run synthetic load testing, failover analysis, and bottleneck detection.
              </p>
            </div>
          ) : (
            <div>
              {/* TAB 1: Scenarios */}
              {activeTab === 'scenarios' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                  {evaluation.testCases.map((tc) => (
                    <div
                      key={tc.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        tc.passed
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-red-200 bg-red-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          {tc.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                          ) : (
                            <XCircle className="w-4 h-4 text-[#FF3B30]" />
                          )}
                          <span className={`font-semibold text-xs ${tc.passed ? 'text-[#1E7E34]' : 'text-[#FF3B30]'}`}>
                            {tc.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-[#1D1D1F]">
                          Impact: +{tc.impactScore} pts
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6E73] leading-relaxed">
                        {tc.details}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: Metrics */}
              {activeTab === 'metrics' && (
                <div className="space-y-4 font-sans">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-[#86868B] text-xs font-semibold">
                        <span>Throughput</span>
                        <span className="font-mono text-[#0071E3] font-bold">{evaluation.throughputScore}%</span>
                      </div>
                      <div className="w-full bg-[#F5F5F7] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#0071E3] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.throughputScore}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#86868B]">Capacity handling under load</p>
                    </div>

                    <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-[#86868B] text-xs font-semibold">
                        <span>Reliability</span>
                        <span className="font-mono text-[#34C759] font-bold">{evaluation.reliabilityScore}%</span>
                      </div>
                      <div className="w-full bg-[#F5F5F7] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#34C759] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.reliabilityScore}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#86868B]">Redundancy &amp; failover tolerance</p>
                    </div>

                    <div className="bg-white border border-black/[0.06] rounded-xl p-3.5 space-y-2 shadow-2xs">
                      <div className="flex items-center justify-between text-[#86868B] text-xs font-semibold">
                        <span>Scalability</span>
                        <span className="font-mono text-[#AF00DB] font-bold">{evaluation.scalabilityScore}%</span>
                      </div>
                      <div className="w-full bg-[#F5F5F7] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#AF00DB] h-full rounded-full transition-all duration-700"
                          style={{ width: `${evaluation.scalabilityScore}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-[#86868B]">Horizontal scaling &amp; sharding</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Recommendations & Bottlenecks */}
              {activeTab === 'recommendations' && (
                <div className="space-y-4 font-sans">
                  {evaluation.identifiedBottlenecks.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[#FF3B30] flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Identified Architecture Bottlenecks</span>
                      </div>
                      <div className="space-y-1.5">
                        {evaluation.identifiedBottlenecks.map((b, i) => (
                          <div key={i} className="p-2.5 rounded-xl border border-red-200 bg-red-50/50 text-xs text-[#FF3B30]">
                            • {b}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {evaluation.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[#0071E3] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Engineering Optimization Steps</span>
                      </div>
                      <div className="space-y-1.5">
                        {evaluation.recommendations.map((r, i) => (
                          <div key={i} className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 text-xs text-[#0071E3]">
                            ✓ {r}
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
      )}
    </div>
  );
};
