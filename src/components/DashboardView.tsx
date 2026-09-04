import React from 'react';
import {
  Terminal,
  Network,
  Search,
  Check,
  CheckCircle2,
  ChevronRight,
  Layers,
  CheckSquare,
  Sparkles,
  ArrowUpRight,
  Flame,
  Filter
} from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { usePlatformStore } from '../store/usePlatformStore';
import { Difficulty, ProblemCategory } from '../types';

export const DashboardView: React.FC = () => {
  const {
    activeProblemId,
    setActiveProblem,
    setActiveView,
    solvedProblemIds,
    filterCategory,
    setFilterCategory,
    filterDifficulty,
    setFilterDifficulty,
    searchQuery,
    setSearchQuery,
    setTestRunnerOpen
  } = usePlatformStore();

  const totalProblems = PROBLEMS.length;
  const totalSolved = solvedProblemIds.length;
  const algoProblems = PROBLEMS.filter((p) => p.category === 'algorithm');
  const sysProblems = PROBLEMS.filter((p) => p.category === 'system_design');
  const solvedAlgo = algoProblems.filter((p) => solvedProblemIds.includes(p.id)).length;
  const solvedSys = sysProblems.filter((p) => solvedProblemIds.includes(p.id)).length;

  const featuredProblem = PROBLEMS.find((p) => p.id === activeProblemId) || PROBLEMS[0];
  const featuredIsSolved = solvedProblemIds.includes(featuredProblem.id);

  const filteredProblems = PROBLEMS.filter((p) => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterDifficulty !== 'all' && p.difficulty !== filterDifficulty) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchTag && !matchDesc) return false;
    }
    return true;
  });

  const handleOpenProblem = (problemId: string, category: ProblemCategory) => {
    setActiveProblem(problemId);
    if (category === 'algorithm') {
      setActiveView('algo_workspace');
    } else {
      setActiveView('system_design_workspace');
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#FBFBFD] text-[#1D1D1F] p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Top Editorial Header */}
      <div className="border-b border-black/[0.06] pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-[#0071E3] text-xs font-semibold uppercase tracking-widest font-mono">
            <span className="w-2 h-2 rounded-full bg-[#0071E3]" />
            <span>Curated Algorithmic &amp; Architectural Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1D1D1F] leading-tight">
            Engineering Mastery in Plain Logic &amp; Topology
          </h1>
          <p className="text-sm text-[#6E6E73] leading-relaxed max-w-xl">
            Syntax boilerplate obscures core engineering intuition. Articulate algorithmic invariants in verifiable deterministic English, and model distributed topologies with Cupertino precision.
          </p>
        </div>

        {/* Action button: Platform Verification Suite */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTestRunnerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-neutral-200/90 shadow-apple hover:shadow-apple-hover transition-all active:scale-97"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Platform Verification Matrix</span>
          </button>
        </div>
      </div>

      {/* Asymmetric Split: 65% Problem Spotlight + 35% Mastery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Featured Problem Spotlight (7 cols) */}
        <div className="apple-lift lg:col-span-7 bg-white border border-black/[0.06] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-apple hover:shadow-apple-hover">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {featuredProblem.category === 'algorithm' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0071E3] border border-blue-200/70">
                    <Terminal className="w-3 h-3" />
                    Algo-English Studio
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-[#AF00DB] border border-purple-200/70">
                    <Network className="w-3 h-3" />
                    Distributed Canvas
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    featuredProblem.difficulty === 'Easy'
                      ? 'bg-emerald-50 text-[#34C759] border border-emerald-200/70'
                      : featuredProblem.difficulty === 'Medium'
                      ? 'bg-amber-50 text-[#FF9500] border border-amber-200/70'
                      : 'bg-red-50 text-[#FF3B30] border border-red-200/70'
                  }`}
                >
                  {featuredProblem.difficulty}
                </span>
              </div>

              {featuredIsSolved && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#34C759] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                  <Check className="w-3 h-3" />
                  Solved &amp; Verified
                </span>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-[#86868B] uppercase font-mono tracking-wider font-semibold">
                Spotlight Practice Problem
              </span>
              <h3 className="text-2xl sm:text-3xl text-[#1D1D1F] font-bold leading-snug">
                {featuredProblem.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6E73] line-clamp-3 leading-relaxed">
                {featuredProblem.description.replace(/###.*?\n/g, '').replace(/```[\s\S]*?```/g, '')}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {featuredProblem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[#6E6E73] border border-neutral-200/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-neutral-100 flex items-center justify-between">
            <div className="text-xs text-[#86868B]">
              Acceptance Benchmark: <strong className="text-[#1D1D1F] font-mono">{featuredProblem.acceptanceRate}</strong>
            </div>
            <button
              onClick={() => handleOpenProblem(featuredProblem.id, featuredProblem.category)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0071E3] hover:bg-[#0077ED] text-white transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:shadow-[0_4px_12px_rgba(0,113,227,0.35)] active:scale-97 group"
            >
              <span>{featuredIsSolved ? 'Review Workspace' : 'Open Active Studio'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right: Mastery Progress Breakdown (5 cols) */}
        <div className="apple-lift lg:col-span-5 bg-white border border-black/[0.06] rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-apple hover:shadow-apple-hover">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#86868B] uppercase tracking-wider font-mono">
                Candidate Mastery Ledger
              </span>
              <span className="font-mono text-xs font-semibold text-[#0071E3]">
                {totalSolved}/{totalProblems} Completed
              </span>
            </div>

            {/* Apple health-style progress bar */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full bg-[#F5F5F7] rounded-full overflow-hidden p-0.5 border border-neutral-200/60">
                <div
                  className="h-full bg-[#0071E3] rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(8, Math.round((totalSolved / totalProblems) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#86868B] font-mono">
                <span>0%</span>
                <span>Platform Completion: {Math.round((totalSolved / totalProblems) * 100)}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Discipline Breakdown Cards */}
            <div className="space-y-2.5 pt-2">
              <div className="p-3.5 rounded-xl bg-[#FBFBFD] border border-neutral-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#0071E3]">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1D1D1F]">Algo-English Reasoning</div>
                    <div className="text-[10px] text-[#86868B]">Invariants, hash maps &amp; pointers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-[#1D1D1F]">
                    {solvedAlgo}/{algoProblems.length}
                  </div>
                  <div className="text-[10px] text-[#34C759] font-medium">Verified</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FBFBFD] border border-neutral-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200/60 flex items-center justify-center text-[#AF00DB]">
                    <Network className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1D1D1F]">Distributed Topologies</div>
                    <div className="text-[10px] text-[#86868B]">Scalability, failover &amp; cache layers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-[#1D1D1F]">
                    {solvedSys}/{sysProblems.length}
                  </div>
                  <div className="text-[10px] text-[#34C759] font-medium">Verified</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-[#86868B]">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FF9500] fill-[#FF9500]" />
              <span className="text-[#1D1D1F] font-semibold">18 Days</span> Active Practice
            </span>
            <span className="font-mono text-[11px] text-[#0071E3]">Top 98.4%</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-black/[0.06] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-apple">
        {/* Search input with ⌘K */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="ledger-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, invariants, tags..."
            className="w-full pl-9 pr-12 py-2 bg-[#F5F5F7] border border-neutral-200/80 rounded-full text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/20 focus:border-[#0071E3] transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white border border-neutral-200 text-[#86868B] shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Category Filter Pills */}
          <div className="flex items-center bg-[#F5F5F7] p-1 rounded-full border border-neutral-200/80">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterCategory === 'all'
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterCategory('algorithm')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterCategory === 'algorithm'
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              Algo-English
            </button>
            <button
              onClick={() => setFilterCategory('system_design')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterCategory === 'system_design'
                  ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              System Design
            </button>
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex items-center bg-[#F5F5F7] p-1 rounded-full border border-neutral-200/80">
            {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  filterDifficulty === diff
                    ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                {diff === 'all' ? 'Any' : diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Directory Table */}
      <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-apple">
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-white">
          <span className="font-mono text-xs text-[#86868B] uppercase tracking-wider font-semibold">
            {filteredProblems.length} Problems Available
          </span>
          <span className="text-xs text-[#86868B] font-mono">
            Showing benchmark problem set
          </span>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] border border-neutral-200/80 flex items-center justify-center mx-auto text-[#86868B]">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[#1D1D1F]">No Matching Problems</h3>
              <p className="text-xs text-[#6E6E73] max-w-sm mx-auto">
                No problems match your current search query or filter combination.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
                setFilterDifficulty('all');
              }}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#0071E3] hover:bg-[#0077ED] text-white transition-all shadow-xs active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-black/[0.04]">
            {filteredProblems.map((p) => {
              const isSolved = solvedProblemIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => handleOpenProblem(p.id, p.category)}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#F5F5F7] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Solved Status Indicator */}
                    <div className="w-6 flex items-center justify-center shrink-0">
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-neutral-300 group-hover:border-[#0071E3] transition-colors" />
                      )}
                    </div>

                    {/* Title & Tags */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-sm text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors truncate">
                          {p.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full shrink-0 ${
                            p.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-[#34C759] border border-emerald-200/70'
                              : p.difficulty === 'Medium'
                              ? 'bg-amber-50 text-[#FF9500] border border-amber-200/70'
                              : 'bg-red-50 text-[#FF3B30] border border-red-200/70'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#86868B] uppercase mr-1">
                          {p.category === 'algorithm' ? 'Algorithm' : 'Architecture'}
                        </span>
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-neutral-100 text-[#6E6E73]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right metadata & Action */}
                  <div className="flex items-center gap-6 shrink-0">
                    <span className="hidden sm:inline font-mono text-xs text-[#86868B]">
                      {p.acceptanceRate}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#0071E3] group-hover:translate-x-1 transition-all">
                      <span>Solve</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
