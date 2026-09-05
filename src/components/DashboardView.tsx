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
  Filter,
  CreditCard,
  Tag
} from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { usePlatformStore } from '../store/usePlatformStore';
import { audioService } from '../services/audioService';
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
    setTestRunnerOpen,
    streakCount,
    isEvaluatorPro,
    assessmentCredits,
    setCheckoutModalOpen
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
    <div id="dashboard-scroll-container" className="flex-1 overflow-y-auto w-full h-full bg-[#F4F6F4] dark:bg-[#2F3E46] text-[#2F3E46] dark:text-[#CAD2C5]">
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 pb-28">
        {/* Top Editorial Header */}
      <div className="border-b border-[#CAD2C5]/60 dark:border-[#52796F]/30 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-[#52796F] dark:text-[#84A98C] text-xs font-semibold uppercase tracking-widest font-mono">
            <span className="w-2 h-2 rounded-full bg-[#84A98C]" />
            <span>Curated Algorithmic &amp; Architectural Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2F3E46] dark:text-white leading-tight">
            Engineering Mastery in Plain Logic &amp; Topology
          </h1>
          <p className="text-sm text-[#52796F] dark:text-[#CAD2C5]/80 leading-relaxed max-w-xl">
            Syntax boilerplate obscures core engineering intuition. Articulate algorithmic invariants in verifiable deterministic English, and model distributed topologies with Cupertino precision.
          </p>
        </div>

        {/* Action button: Platform Verification Suite */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTestRunnerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white dark:bg-[#354F52] hover:bg-[#EBF0EB] dark:hover:bg-[#354F52]/80 text-[#2F3E46] dark:text-white border border-[#CAD2C5] dark:border-[#52796F]/40 shadow-apple hover:shadow-apple-hover transition-all active:scale-97 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#84A98C]" />
            <span>Platform Verification Matrix</span>
          </button>
        </div>
      </div>

        {/* Asymmetric Split: 65% Problem Spotlight + 35% Mastery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Featured Problem Spotlight (7 cols) */}
        <div className="apple-lift lg:col-span-7 bg-white dark:bg-[#354F52] border border-[#CAD2C5]/80 dark:border-[#52796F]/30 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-apple hover:shadow-apple-hover">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {featuredProblem.category === 'algorithm' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#CAD2C5]/20 dark:bg-[#2F3E46] text-[#52796F] dark:text-[#84A98C] border border-[#CAD2C5] dark:border-[#52796F]/50">
                    <Terminal className="w-3 h-3" />
                    Algo-English Studio
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#CAD2C5]/20 dark:bg-[#2F3E46] text-[#52796F] dark:text-[#84A98C] border border-[#CAD2C5] dark:border-[#52796F]/50">
                    <Network className="w-3 h-3" />
                    Distributed Canvas
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    featuredProblem.difficulty === 'Easy'
                      ? 'bg-emerald-50 text-[#34C759] border border-emerald-200/70 dark:bg-emerald-950/40 dark:border-emerald-800/60'
                      : featuredProblem.difficulty === 'Medium'
                      ? 'bg-amber-50 text-[#FF9500] border border-amber-200/70 dark:bg-amber-950/40 dark:border-amber-800/60'
                      : 'bg-red-50 text-[#FF3B30] border border-red-200/70 dark:bg-red-950/40 dark:border-red-800/60'
                  }`}
                >
                  {featuredProblem.difficulty}
                </span>
              </div>

              {featuredIsSolved && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#84A98C] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/60">
                  <Check className="w-3 h-3" />
                  Solved &amp; Verified
                </span>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-[#52796F] dark:text-[#CAD2C5]/70 uppercase font-mono tracking-wider font-semibold">
                Spotlight Practice Problem
              </span>
              <h3 className="text-2xl sm:text-3xl text-[#2F3E46] dark:text-white font-bold leading-snug">
                {featuredProblem.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#52796F] dark:text-[#CAD2C5]/80 line-clamp-3 leading-relaxed">
                {featuredProblem.description.replace(/###.*?\n/g, '').replace(/```[\s\S]*?```/g, '').replace(/\*\*/g, '').replace(/`/g, '').replace(/\$O\((.*?)\)\$/g, 'O($1)')}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {featuredProblem.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#EBF0EB] dark:bg-[#2F3E46] text-[#52796F] dark:text-[#CAD2C5] border border-[#CAD2C5]/80 dark:border-[#52796F]/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#CAD2C5]/40 dark:border-[#52796F]/30 flex items-center justify-between">
            <div className="text-xs text-[#52796F] dark:text-[#CAD2C5]/70">
              Acceptance Benchmark: <strong className="text-[#2F3E46] dark:text-white font-mono">{featuredProblem.acceptanceRate}</strong>
            </div>
            <button
              id="spotlight-open-studio-btn"
              onClick={() => handleOpenProblem(featuredProblem.id, featuredProblem.category)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-[#84A98C] hover:bg-[#52796F] text-[#2F3E46] hover:text-white transition-all shadow-[0_2px_8px_rgba(132,169,140,0.3)] hover:shadow-[0_4px_12px_rgba(132,169,140,0.4)] active:scale-97 group cursor-pointer"
            >
              <span>{featuredIsSolved ? 'Review Workspace' : 'Open Active Studio'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right: Mastery Progress Breakdown (5 cols) */}
        <div className="apple-lift lg:col-span-5 bg-white dark:bg-[#354F52]/40 border border-[#CAD2C5]/60 dark:border-[#52796F]/40 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-apple hover:shadow-apple-hover">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#52796F] dark:text-[#CAD2C5]/70 uppercase tracking-wider font-mono">
                Candidate Mastery Ledger
              </span>
              <span className="font-mono text-xs font-semibold text-[#52796F] dark:text-[#84A98C]">
                {totalSolved}/{totalProblems} Completed
              </span>
            </div>

            {/* Apple health-style progress bar */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full bg-[#CAD2C5]/20 dark:bg-[#2F3E46] rounded-full overflow-hidden p-0.5 border border-[#CAD2C5]/40 dark:border-[#52796F]/40">
                <div
                  className="h-full bg-[#84A98C] rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(8, Math.round((totalSolved / totalProblems) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70 font-mono">
                <span>0%</span>
                <span>Platform Completion: {Math.round((totalSolved / totalProblems) * 100)}%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Discipline Breakdown Cards */}
            <div className="space-y-2.5 pt-2">
              <div className="p-3.5 rounded-xl bg-[#F4F6F4] dark:bg-[#2F3E46] border border-[#CAD2C5]/60 dark:border-[#52796F]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#CAD2C5]/30 dark:bg-[#354F52] border border-[#CAD2C5] dark:border-[#52796F]/50 flex items-center justify-center text-[#52796F] dark:text-[#84A98C]">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#2F3E46] dark:text-white">Algo-English Reasoning</div>
                    <div className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70">Invariants, hash maps &amp; pointers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-[#2F3E46] dark:text-white">
                    {solvedAlgo}/{algoProblems.length}
                  </div>
                  <div className="text-[10px] text-[#84A98C] font-semibold">Verified</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4F6F4] dark:bg-[#2F3E46] border border-[#CAD2C5]/60 dark:border-[#52796F]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#CAD2C5]/30 dark:bg-[#354F52] border border-[#CAD2C5] dark:border-[#52796F]/50 flex items-center justify-center text-[#52796F] dark:text-[#CAD2C5]">
                    <Network className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#2F3E46] dark:text-white">Distributed Topologies</div>
                    <div className="text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70">Scalability, failover &amp; cache layers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-[#2F3E46] dark:text-white">
                    {solvedSys}/{sysProblems.length}
                  </div>
                  <div className="text-[10px] text-[#84A98C] font-semibold">Verified</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#CAD2C5]/40 dark:border-[#52796F]/30 flex items-center justify-between text-xs text-[#52796F] dark:text-[#CAD2C5]/70">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#84A98C] fill-[#84A98C]" />
              <span className="text-[#2F3E46] dark:text-white font-semibold">{streakCount} Day{streakCount === 1 ? '' : 's'}</span> Active Practice
            </span>
            <span className="font-mono text-[11px] text-[#52796F] dark:text-[#84A98C] font-semibold">Top 98.4%</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#2F3E46] border border-[#CAD2C5]/60 dark:border-[#52796F]/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-apple">
        {/* Search input with ⌘K */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#52796F] dark:text-[#CAD2C5]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="ledger-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, invariants, tags..."
            className="w-full pl-9 pr-12 py-2 bg-[#F4F6F4] dark:bg-[#1E272C] border border-[#CAD2C5]/80 dark:border-[#52796F]/50 rounded-full text-xs text-[#2F3E46] dark:text-white placeholder-[#52796F]/60 dark:placeholder-[#CAD2C5]/50 focus:outline-none focus:ring-2 focus:ring-[#84A98C]/30 focus:border-[#84A98C] transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-[#354F52] border border-[#CAD2C5] dark:border-[#52796F] text-[#52796F] dark:text-[#CAD2C5] shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Category Filter Pills */}
          <div className="flex items-center bg-[#F4F6F4] dark:bg-[#1E272C] p-1 rounded-full border border-[#CAD2C5]/80 dark:border-[#52796F]/50">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#84A98C] dark:bg-[#52796F] text-[#2F3E46] dark:text-white shadow-xs font-semibold'
                  : 'text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterCategory('algorithm')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterCategory === 'algorithm'
                  ? 'bg-[#84A98C] dark:bg-[#52796F] text-[#2F3E46] dark:text-white shadow-xs font-semibold'
                  : 'text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white'
              }`}
            >
              Algo-English
            </button>
            <button
              onClick={() => setFilterCategory('system_design')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterCategory === 'system_design'
                  ? 'bg-[#84A98C] dark:bg-[#52796F] text-[#2F3E46] dark:text-white shadow-xs font-semibold'
                  : 'text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white'
              }`}
            >
              System Design
            </button>
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex items-center bg-[#F4F6F4] dark:bg-[#1E272C] p-1 rounded-full border border-[#CAD2C5]/80 dark:border-[#52796F]/50">
            {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  filterDifficulty === diff
                    ? 'bg-[#84A98C] dark:bg-[#52796F] text-[#2F3E46] dark:text-white shadow-xs font-semibold'
                    : 'text-[#52796F] dark:text-[#CAD2C5]/70 hover:text-[#2F3E46] dark:hover:text-white'
                }`}
              >
                {diff === 'all' ? 'Any' : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full pt-2 border-t border-[#CAD2C5]/30 dark:border-[#52796F]/20">
          <span className="text-[10px] font-mono text-[#52796F] dark:text-[#CAD2C5]/70 uppercase tracking-wider mr-1">Tags:</span>
          {[
            { label: 'All', value: '' },
            { label: 'Razorpay Fintech', value: 'Razorpay Fintech', id: 'tag-filter-razorpay' },
            { label: 'Idempotency', value: 'Idempotency' },
            { label: 'Concurrency', value: 'Concurrency' },
            { label: 'Distributed Cache', value: 'Distributed Cache' }
          ].map((tag) => (
            <button
              key={tag.label}
              id={tag.id}
              type="button"
              onClick={() => setSearchQuery(tag.value)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                searchQuery === tag.value
                  ? 'bg-[#52796F] dark:bg-[#84A98C] text-white dark:text-[#2F3E46] shadow-2xs font-semibold'
                  : 'bg-[#F4F6F4] dark:bg-[#1E272C] text-[#52796F] dark:text-[#CAD2C5]/80 hover:text-[#2F3E46] dark:hover:text-white border border-[#CAD2C5]/80 dark:border-[#52796F]/40'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Evaluator B2B Billing & Assessment Credits Dashboard */}
      <div 
        id="evaluator-credits-section"
        className="bg-white dark:bg-[#2F3E46] border border-[#CAD2C5]/60 dark:border-[#52796F]/40 rounded-2xl p-6 shadow-apple flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#52796F] dark:text-[#84A98C] font-bold">
              B2B Evaluator &amp; Enterprise Licensing
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
              isEvaluatorPro
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-[#CAD2C5]/20 dark:bg-[#354F52] text-[#52796F] dark:text-[#CAD2C5]'
            }`}>
              {isEvaluatorPro ? 'Enterprise License Active' : 'Evaluation Sandbox Tier'}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#2F3E46] dark:text-white">
            Billing / Assessment Credits
          </h2>
          <p className="text-xs text-[#52796F] dark:text-[#CAD2C5]/80 max-w-xl leading-relaxed">
            Manage enterprise assessment tokens, team credits, and live Razorpay billing for automated candidate evaluation pipelines.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-end">
          <div className="p-3 px-4 rounded-xl bg-[#F4F6F4] dark:bg-[#1E272C] border border-[#CAD2C5]/80 dark:border-[#52796F]/40">
            <div className="text-[10px] uppercase font-mono text-[#52796F] dark:text-[#CAD2C5]/70">Available Balance</div>
            <div className="text-lg font-bold font-mono text-[#2F3E46] dark:text-white flex items-center gap-1.5">
              <span id="evaluator-credit-balance">{assessmentCredits}</span>
              <span className="text-xs font-normal text-[#52796F] dark:text-[#CAD2C5]/70">Credits</span>
            </div>
          </div>

          <button
            type="button"
            id="btn-purchase-enterprise-credits"
            onClick={() => {
              audioService.playTap();
              setCheckoutModalOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#84A98C] hover:bg-[#52796F] text-[#2F3E46] hover:text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-97 transition-all cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Purchase Enterprise Credits</span>
          </button>
        </div>
      </div>

      {/* Problem Directory Table */}
      <div className="bg-white dark:bg-[#2F3E46] border border-[#CAD2C5]/60 dark:border-[#52796F]/40 rounded-2xl overflow-hidden shadow-apple">
        <div className="px-6 py-4 border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30 flex items-center justify-between bg-white dark:bg-[#2F3E46]">
          <span className="font-mono text-xs text-[#52796F] dark:text-[#CAD2C5]/70 uppercase tracking-wider font-semibold">
            {filteredProblems.length} Problems Available
          </span>
          <span className="text-xs text-[#52796F] dark:text-[#CAD2C5]/70 font-mono">
            Showing benchmark problem set
          </span>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="py-16 px-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#CAD2C5]/20 dark:bg-[#354F52] border border-[#CAD2C5] dark:border-[#52796F]/50 flex items-center justify-center mx-auto text-[#52796F] dark:text-[#CAD2C5]">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[#2F3E46] dark:text-white">No Matching Problems</h3>
              <p className="text-xs text-[#52796F] dark:text-[#CAD2C5]/70 max-w-sm mx-auto">
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
              className="px-4 py-2 rounded-full text-xs font-semibold bg-[#84A98C] hover:bg-[#52796F] text-[#2F3E46] hover:text-white transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#CAD2C5]/40 dark:divide-[#52796F]/30">
            {filteredProblems.map((p) => {
              const isSolved = solvedProblemIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  id={`ledger-problem-item-${p.id}`}
                  onClick={() => handleOpenProblem(p.id, p.category)}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#CAD2C5]/15 dark:hover:bg-[#354F52]/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Solved Status Indicator */}
                    <div className="w-6 flex items-center justify-center shrink-0">
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-[#84A98C]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#CAD2C5] dark:border-[#52796F] group-hover:border-[#84A98C] transition-colors" />
                      )}
                    </div>

                    {/* Title & Tags */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-sm text-[#2F3E46] dark:text-white group-hover:text-[#52796F] dark:group-hover:text-[#84A98C] transition-colors truncate">
                          {p.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.2 rounded-full shrink-0 ${
                            p.difficulty === 'Easy'
                              ? 'bg-emerald-50 text-[#34C759] border border-emerald-200/70 dark:bg-emerald-950/40 dark:border-emerald-800/60'
                              : p.difficulty === 'Medium'
                              ? 'bg-amber-50 text-[#FF9500] border border-amber-200/70 dark:bg-amber-950/40 dark:border-amber-800/60'
                              : 'bg-red-50 text-[#FF3B30] border border-red-200/70 dark:bg-red-950/40 dark:border-red-800/60'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono text-[#52796F] dark:text-[#CAD2C5]/70 uppercase mr-1">
                          {p.category === 'algorithm' ? 'Algorithm' : 'Architecture'}
                        </span>
                        {p.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#CAD2C5]/20 dark:bg-[#1E272C] text-[#52796F] dark:text-[#CAD2C5]/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right metadata & Action */}
                  <div className="flex items-center gap-6 shrink-0">
                    <span className="hidden sm:inline font-mono text-xs text-[#52796F] dark:text-[#CAD2C5]/70">
                      {p.acceptanceRate}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#52796F] dark:text-[#84A98C] group-hover:translate-x-1 transition-all">
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
  </div>
  );
};
