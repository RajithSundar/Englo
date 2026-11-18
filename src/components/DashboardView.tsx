import React from 'react';
import { Search, Check, ArrowRight, Flame, CreditCard } from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { usePlatformStore } from '../store/usePlatformStore';
import { audioService } from '../services/audioService';
import { Difficulty, ProblemCategory } from '../types';

const difficultyChip = (d: Difficulty) =>
  d === 'Easy' ? 'chip chip-easy' : d === 'Medium' ? 'chip chip-medium' : 'chip chip-hard';

const kindLabel = (c: ProblemCategory) => (c === 'algorithm' ? 'Algorithm' : 'System design');

const plainDescription = (text: string) =>
  text
    .replace(/###.*?\n/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\$O\((.*?)\)\$/g, 'O($1)');

const TAG_FILTERS: { label: string; value: string; id?: string }[] = [
  { label: 'All tags', value: '' },
  { label: 'Razorpay Fintech', value: 'Razorpay Fintech', id: 'tag-filter-razorpay' },
  { label: 'Idempotency', value: 'Idempotency' },
  { label: 'Concurrency', value: 'Concurrency' },
  { label: 'Distributed Cache', value: 'Distributed Cache' }
];

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

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
  const solvedPct = totalProblems ? Math.round((totalSolved / totalProblems) * 100) : 0;

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

  const resetFilters = () => {
    setSearchQuery('');
    setFilterCategory('all');
    setFilterDifficulty('all');
  };

  return (
    <div id="dashboard-scroll-container" className="flex-1 overflow-y-auto w-full h-full bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-10 md:py-14 space-y-10 pb-28">
        {/* Header */}
        <header>
          <span className="marker mb-5" />
          <h1 className="text-[32px] md:text-[40px] font-medium leading-[1.1] tracking-[-0.02em] text-ink">Problems</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">
            Pick a problem, answer it in plain English or as a system diagram, and check your work against its tests.
          </p>
        </header>

        {/* Continue + Progress */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <section className="glass rounded-xl p-6 lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="label">Continue where you left off</span>
              <h2 className="text-2xl font-medium tracking-[-0.015em] text-ink">{featuredProblem.title}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip">{kindLabel(featuredProblem.category)}</span>
                <span className={difficultyChip(featuredProblem.difficulty)}>{featuredProblem.difficulty}</span>
                {featuredIsSolved && (
                  <span className="chip chip-accent">
                    <Check className="w-3 h-3" />
                    Solved
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-ink-2 line-clamp-2">
                {plainDescription(featuredProblem.description)}
              </p>
            </div>
            <div>
              <button
                id="spotlight-open-studio-btn"
                type="button"
                onClick={() => handleOpenProblem(featuredProblem.id, featuredProblem.category)}
                className="btn-primary cursor-pointer"
              >
                Open workspace
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          <section className="glass rounded-xl p-6 lg:col-span-5 flex flex-col gap-5">
            <span className="label">Progress</span>
            <div className="space-y-2.5">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-medium tracking-[-0.02em] text-ink">{totalSolved}</span>
                <span className="text-sm text-muted">of {totalProblems} solved</span>
              </div>
              <div
                className="h-1 w-full overflow-hidden rounded-full bg-ink/10"
                role="progressbar"
                aria-valuenow={solvedPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Problems solved"
              >
                <div
                  className="h-full rounded-full bg-accent shadow-glow-1 transition-all duration-700"
                  style={{ width: `${solvedPct}%` }}
                />
              </div>
            </div>
            <dl className="divide-y divide-rule border-y border-rule text-sm">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-ink-2">Algorithms</dt>
                <dd className="text-ink tabular-nums">
                  {solvedAlgo} / {algoProblems.length}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-ink-2">System designs</dt>
                <dd className="text-ink tabular-nums">
                  {solvedSys} / {sysProblems.length}
                </dd>
              </div>
            </dl>
            <p className="flex items-center gap-2 text-sm text-ink-2">
              <Flame className="w-4 h-4 text-accent" />
              {streakCount} day{streakCount === 1 ? '' : 's'} in a row
            </p>
          </section>
        </div>

        {/* Filters + list */}
        <section className="space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="ledger-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems or tags"
                aria-label="Search problems"
                className="field pl-9 pr-14 placeholder:text-muted"
              />
              <kbd className="kbd absolute right-3 top-1/2 -translate-y-1/2">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="seg" role="tablist" aria-label="Category">
                {(
                  [
                    ['all', 'All'],
                    ['algorithm', 'Algorithms'],
                    ['system_design', 'System design']
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={filterCategory === key}
                    onClick={() => setFilterCategory(key)}
                    className="seg-item cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="seg" role="tablist" aria-label="Difficulty">
                {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    role="tab"
                    aria-selected={filterDifficulty === diff}
                    onClick={() => setFilterDifficulty(diff)}
                    className="seg-item cursor-pointer"
                  >
                    {diff === 'all' ? 'Any' : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {TAG_FILTERS.map((tag) => (
              <button
                key={tag.label}
                id={tag.id}
                type="button"
                aria-pressed={searchQuery === tag.value}
                onClick={() => setSearchQuery(tag.value)}
                className={`${searchQuery === tag.value ? 'chip chip-accent' : 'chip hover:text-ink hover:border-rule-2'} cursor-pointer`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {filteredProblems.length === 0 ? (
            <div className="border-t border-rule py-16 text-center">
              <h3 className="text-base font-medium text-ink">No problems match</h3>
              <p className="mt-1 text-sm text-muted">Try another search or clear the filters.</p>
              <button type="button" onClick={resetFilters} className="btn mt-5 cursor-pointer">
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="border-t border-rule">
              {filteredProblems.map((p, i) => {
                const isSolved = solvedProblemIds.includes(p.id);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      id={`ledger-problem-item-${p.id}`}
                      onClick={() => handleOpenProblem(p.id, p.category)}
                      className="group grid w-full cursor-pointer grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-rule py-4 text-left transition-colors hover:bg-ink/[0.03] md:grid-cols-[2.5rem_1fr_8rem_5rem_1.25rem_1.25rem] md:px-2"
                    >
                      <span className="font-mono text-xs text-muted tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] text-ink">{p.title}</span>
                        {p.tags.length > 0 && (
                          <span className="mt-0.5 block truncate text-xs text-muted">{p.tags.join(' · ')}</span>
                        )}
                      </span>
                      <span className="hidden text-sm text-muted md:block">{kindLabel(p.category)}</span>
                      <span>
                        <span className={difficultyChip(p.difficulty)}>{p.difficulty}</span>
                      </span>
                      <span className="hidden md:flex md:justify-center" aria-label={isSolved ? 'Solved' : 'Not solved'}>
                        {isSolved ? (
                          <Check className="h-4 w-4 text-accent" />
                        ) : (
                          <span className="h-3.5 w-3.5 rounded-full border border-rule-2" />
                        )}
                      </span>
                      <ArrowRight className="hidden h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent md:block" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Billing */}
        <section
          id="evaluator-credits-section"
          className="glass rounded-xl p-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
        >
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-medium text-ink">Assessment credits</h2>
              <span className={isEvaluatorPro ? 'chip chip-accent' : 'chip'}>
                {isEvaluatorPro ? 'Enterprise' : 'Free tier'}
              </span>
            </div>
            <p className="text-sm text-muted">
              Balance: <span id="evaluator-credit-balance" className="text-ink tabular-nums">{assessmentCredits}</span> credits
            </p>
          </div>
          <button
            type="button"
            id="btn-purchase-enterprise-credits"
            onClick={() => {
              audioService.playTap();
              setCheckoutModalOpen(true);
            }}
            className="btn cursor-pointer self-start md:self-auto"
          >
            <CreditCard className="w-4 h-4" />
            Buy credits
          </button>
        </section>
      </div>
    </div>
  );
};
