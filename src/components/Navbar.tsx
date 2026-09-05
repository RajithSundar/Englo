import React from 'react';
import {
  Layers,
  LayoutDashboard,
  Terminal,
  Network,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  CheckSquare,
  RotateCcw,
  Flame,
  ArrowRight,
  Search,
  ExternalLink,
  User,
  LogOut,
  Sun,
  Moon,
  Award,
  HelpCircle,
  CreditCard,
  IndianRupee
} from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { usePlatformStore } from '../store/usePlatformStore';
import { audioService } from '../services/audioService';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeProblemId,
    setActiveProblem,
    solvedProblemIds,
    resetProblem,
    setTestRunnerOpen,
    authenticatedUser,
    logoutUser,
    openAuth,
    streakCount,
    bestStreak,
    lastActiveDate,
    activityDates,
    isDarkMode,
    toggleDarkMode,
    setCertificateModalOpen,
    setShortcutsModalOpen,
    setCheckoutModalOpen,
    setBountyModalOpen,
    isEvaluatorPro,
    bountyClaimed
  } = usePlatformStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isStreakPopoverOpen, setIsStreakPopoverOpen] = React.useState(false);
  const streakRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (streakRef.current && !streakRef.current.contains(e.target as Node)) {
        setIsStreakPopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const recentDays = React.useMemo(() => {
    const days = [];
    const today = new Date();
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = dayNames[d.getDay()];
      const dayNum = d.getDate();
      const isActive = (activityDates || []).includes(dateStr) || (i === 0 && Boolean(lastActiveDate));
      days.push({ date: dateStr, label, dayNum, isActive });
    }
    return days;
  }, [activityDates, lastActiveDate]);

  const activeProblem = PROBLEMS.find((p) => p.id === activeProblemId) || PROBLEMS[0];
  const totalSolved = solvedProblemIds.length;
  const totalProblems = PROBLEMS.length;

  return (
    <header className="h-14 border-b border-[#cad2c5]/60 dark:border-[#52796f]/30 bg-[#f4f6f4]/90 dark:bg-[#2f3e46]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between select-none z-50 sticky top-0 transition-all">
      {/* Brand & Left Navigation */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div 
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="nav-brand-logo"
        >
          <div className="w-7 h-7 rounded-lg bg-[#84a98c] flex items-center justify-center text-[#2f3e46] shadow-2xs group-hover:scale-105 transition-all">
            <Layers className="w-4 h-4 text-[#2f3e46]" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#2f3e46] dark:text-[#cad2c5] flex items-center gap-1.5 group-hover:text-[#84a98c] transition-colors">
            Englo
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full border border-[#cad2c5]/80 dark:border-[#52796f]/40 bg-[#ebf0eb] dark:bg-[#354f52] text-[#52796f] dark:text-[#cad2c5]">
              Studio
            </span>
          </span>
        </div>

        {/* View Switcher Segmented Control */}
        <div className="flex items-center bg-[#ebf0eb] dark:bg-[#354f52]/70 p-1 rounded-full border border-[#cad2c5]/80 dark:border-[#52796f]/40">
          <button
            id="nav-tab-landing"
            onClick={() => setActiveView('landing')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeView === 'landing'
                ? 'bg-white dark:bg-[#52796f] text-[#2f3e46] dark:text-white shadow-xs font-semibold'
                : 'text-[#52796f] dark:text-[#cad2c5]/70 hover:text-[#2f3e46] dark:hover:text-white'
            }`}
          >
            <span>Overview</span>
          </button>

          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeView === 'dashboard'
                ? 'bg-white dark:bg-[#52796f] text-[#2f3e46] dark:text-white shadow-xs font-semibold'
                : 'text-[#52796f] dark:text-[#cad2c5]/70 hover:text-[#2f3e46] dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Problem Ledger</span>
          </button>

          <button
            id="nav-tab-workspace"
            onClick={() => {
              if (activeProblem.category === 'algorithm') {
                setActiveView('algo_workspace');
              } else {
                setActiveView('system_design_workspace');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeView !== 'dashboard' && activeView !== 'landing'
                ? 'bg-white dark:bg-[#52796f] text-[#2f3e46] dark:text-white shadow-xs font-semibold'
                : 'text-[#52796f] dark:text-[#cad2c5]/70 hover:text-[#2f3e46] dark:hover:text-white'
            }`}
          >
            {activeProblem.category === 'algorithm' ? (
              <Terminal className="w-3.5 h-3.5 text-[#84a98c]" />
            ) : (
              <Network className="w-3.5 h-3.5 text-[#84a98c]" />
            )}
            <span>Active Studio</span>
          </button>
        </div>
      </div>

      {/* Middle: Active Problem Quick Selector Dropdown (when inside workspace) */}
      {activeView !== 'dashboard' && activeView !== 'landing' && (
        <div className="hidden md:flex items-center gap-2 bg-[#F5F5F7] dark:bg-white/[0.06] border border-neutral-200/80 dark:border-white/10 rounded-full px-3 py-1 text-xs">
          <span className="text-[#86868B] dark:text-neutral-400 font-mono">Current:</span>
          <div className="relative flex items-center">
            <select
              id="navbar-problem-select"
              value={activeProblemId}
              onChange={(e) => {
                const target = PROBLEMS.find((p) => p.id === e.target.value);
                if (target) {
                  setActiveProblem(target.id);
                  if (target.category === 'algorithm') {
                    setActiveView('algo_workspace');
                  } else {
                    setActiveView('system_design_workspace');
                  }
                }
              }}
              className="bg-transparent text-[#1D1D1F] dark:text-white font-semibold text-xs pr-6 focus:outline-none cursor-pointer appearance-none"
            >
              {PROBLEMS.map((p) => (
                <option key={p.id} value={p.id} className="bg-white dark:bg-[#161B22] text-[#1D1D1F] dark:text-white">
                  {p.title} ({p.category === 'algorithm' ? 'Algo' : 'Arch'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#86868B] dark:text-neutral-400 absolute right-0 pointer-events-none" />
          </div>

          <span
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeProblem.difficulty === 'Easy'
                ? 'bg-emerald-50 text-[#34C759] border border-emerald-200/70 dark:bg-emerald-950/40 dark:border-emerald-800/60'
                : activeProblem.difficulty === 'Medium'
                ? 'bg-amber-50 text-[#FF9500] border border-amber-200/70 dark:bg-amber-950/40 dark:border-amber-800/60'
                : 'bg-red-50 text-[#FF3B30] border border-red-200/70 dark:bg-red-950/40 dark:border-red-800/60'
            }`}
          >
            {activeProblem.difficulty}
          </span>
        </div>
      )}

      {/* Right Navigation & Status Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Daily Streak Indicator - Only when authenticated */}
        {authenticatedUser && (
          <div className="relative" ref={streakRef}>
            <button
              type="button"
              onClick={() => setIsStreakPopoverOpen(!isStreakPopoverOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/90 dark:bg-amber-950/30 hover:bg-amber-100/90 dark:hover:bg-amber-900/40 border border-amber-200/70 dark:border-amber-700/50 text-[#B25E00] dark:text-amber-400 text-xs font-mono font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="View Daily Practice Streak"
            >
              <Flame className="w-3.5 h-3.5 text-[#FF9500] fill-[#FF9500] animate-pulse" />
              <span>{streakCount}d Streak</span>
            </button>

            {isStreakPopoverOpen && (
              <div className="absolute right-0 top-11 w-72 bg-white dark:bg-[#161B22] rounded-2xl border border-black/[0.08] dark:border-white/10 shadow-apple p-4 z-[70] animate-in fade-in zoom-in-95 duration-150 text-[#1D1D1F] dark:text-white">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100/80 dark:bg-amber-900/40 flex items-center justify-center text-[#FF9500]">
                      <Flame className="w-5 h-5 fill-[#FF9500]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1D1D1F] dark:text-white font-sans">
                        {streakCount} Day{streakCount === 1 ? '' : 's'} Active
                      </div>
                      <div className="text-[11px] text-[#86868B] dark:text-neutral-400 font-sans">
                        Personal best: {bestStreak} day{bestStreak === 1 ? '' : 's'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-[#34C759] border border-emerald-200/60 dark:bg-emerald-950/40 dark:border-emerald-800/60 font-semibold">
                    Active Today
                  </span>
                </div>

                {/* 7-Day Activity Matrix */}
                <div className="mb-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#86868B] dark:text-neutral-400 mb-2">
                    Recent Practice (Last 7 Days)
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {recentDays.map((day) => (
                      <div key={day.date} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-mono text-[#86868B] dark:text-neutral-400">{day.label}</span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            day.isActive
                              ? 'bg-[#FF9500] text-white shadow-xs'
                              : 'bg-neutral-100 dark:bg-white/5 text-neutral-400 dark:text-neutral-500 border border-neutral-200/60 dark:border-white/10'
                          }`}
                          title={`${day.date}: ${day.isActive ? 'Active' : 'No activity'}`}
                        >
                          {day.dayNum}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-[#6E6E73] dark:text-neutral-300 bg-[#F5F5F7] dark:bg-white/5 rounded-xl p-2.5 font-sans leading-tight">
                  Solve algorithmic problems or design system topologies daily to preserve your pure logic momentum!
                </div>
              </div>
            )}
          </div>
        )}

        {/* RazorpayX ₹5,000 Bounty Trigger */}
        <button
          id="nav-bounty-trigger"
          onClick={() => {
            audioService.playTap();
            setBountyModalOpen(true);
          }}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-97 shadow-2xs cursor-pointer ${
            bountyClaimed
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-300/60 dark:border-emerald-700/60'
              : 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 hover:from-emerald-500/20 hover:to-blue-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
          }`}
          title="Claim ₹5,000 Interview Bounty disbursed instantly via RazorpayX"
        >
          <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
          <span>{bountyClaimed ? '₹5,000 Disbursed' : '₹5,000 Bounty'}</span>
          {!bountyClaimed && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          )}
        </button>

        {/* Razorpay Evaluator Pro Trigger */}
        <button
          id="nav-evaluator-checkout-trigger"
          onClick={() => {
            audioService.playTap();
            setCheckoutModalOpen(true);
          }}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-97 shadow-2xs cursor-pointer ${
            isEvaluatorPro
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-300/60 dark:border-indigo-700/60'
              : 'bg-white dark:bg-white/[0.06] hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 border border-neutral-300/80 dark:border-white/15'
          }`}
          title="Upgrade to Evaluator Pro via Razorpay Standard Checkout"
        >
          <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
          <span>{isEvaluatorPro ? 'Evaluator Pro' : 'Upgrade Pro'}</span>
        </button>

        {/* Verified Credential Modal Trigger */}
        <button
          onClick={() => {
            audioService.playTap();
            setCertificateModalOpen(true);
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/10 to-[#84a98c]/15 hover:from-amber-500/20 hover:to-[#84a98c]/25 text-[#52796f] dark:text-[#84a98c] border border-[#84a98c]/30 transition-all active:scale-97 shadow-2xs cursor-pointer"
          title="Inspect verified proof of engineering competence credential"
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Credential</span>
        </button>

        {/* Platform Verification Suite Trigger */}
        <button
          onClick={() => {
            audioService.playTap();
            setTestRunnerOpen(true);
          }}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#ebf0eb] dark:bg-white/[0.06] hover:bg-neutral-200/70 dark:hover:bg-white/10 text-[#2f3e46] dark:text-neutral-200 border border-[#cad2c5]/80 dark:border-white/10 transition-all active:scale-97 shadow-2xs cursor-pointer"
          title="Run complete platform automated test suite"
        >
          <CheckSquare className="w-3.5 h-3.5 text-[#84a98c]" />
          <span>Verification Matrix</span>
        </button>

        {/* Keyboard Shortcuts Trigger */}
        <button
          onClick={() => {
            audioService.playTap();
            setShortcutsModalOpen(true);
          }}
          className="p-1.5 rounded-full border border-[#cad2c5]/80 dark:border-white/10 text-[#52796f] dark:text-neutral-400 hover:text-[#2f3e46] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer"
          title="Keyboard shortcuts (?)"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Dark Mode Toggle Button */}
        <button
          id="nav-dark-mode-toggle"
          onClick={toggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`p-1.5 rounded-full border transition-all duration-300 cursor-pointer ${
            isDarkMode
              ? 'bg-white/10 border-white/20 text-yellow-400 hover:bg-white/15'
              : 'bg-black/[0.04] border-black/[0.08] text-neutral-700 hover:bg-black/[0.08]'
          }`}
        >
          {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {/* User profile / Session */}
        {authenticatedUser ? (
          <div className="relative pl-2 border-l border-[#cad2c5]/80 dark:border-white/10">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#ebf0eb] dark:bg-[#354f52] border border-[#cad2c5] dark:border-[#52796f]/50 flex items-center justify-center text-[#52796f] dark:text-[#84a98c] font-mono text-[11px] font-bold shadow-2xs">
                {authenticatedUser.handle.replace('@', '').slice(0, 2).toUpperCase()}
              </div>
              <span className="hidden md:inline text-xs font-semibold text-[#2f3e46] dark:text-white font-mono">
                {authenticatedUser.handle}
              </span>
              <ChevronDown className="w-3 h-3 text-[#52796f] dark:text-neutral-400" />
            </button>

            {/* Cupertino User Dropdown Menu */}
            {isUserMenuOpen && (
              <div 
                className="absolute right-0 top-10 w-64 bg-white dark:bg-[#2f3e46] rounded-2xl border border-[#cad2c5] dark:border-[#52796f]/40 shadow-apple p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-[#2f3e46] dark:text-white"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="p-2 border-b border-neutral-100 dark:border-white/10 mb-2">
                  <div className="text-xs font-bold text-[#2f3e46] dark:text-white">
                    {authenticatedUser.name || authenticatedUser.handle}
                  </div>
                  <div className="text-[11px] text-[#52796f] dark:text-neutral-400 font-mono truncate">
                    {authenticatedUser.email}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#ebf0eb] dark:bg-[#354f52] text-[#52796f] dark:text-[#84a98c] font-medium border border-[#cad2c5]/80 dark:border-[#52796f]/40">
                    {authenticatedUser.role || 'Staff Engineer'}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#ebf0eb] dark:hover:bg-white/5 text-[#2f3e46] dark:text-white flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>Problem Ledger</span>
                    <span className="font-mono text-[11px] text-[#84a98c] font-bold">{totalSolved}/{totalProblems}</span>
                  </button>

                  <button
                    onClick={() => {
                      logoutUser();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-[#FF3B30] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#cad2c5]/80 dark:border-white/10">
            <button
              onClick={() => openAuth('login')}
              className="px-3 py-1 rounded-full text-xs font-semibold text-[#52796f] dark:text-neutral-300 hover:text-[#2f3e46] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-3.5 py-1.5 rounded-full bg-[#84a98c] hover:bg-[#52796f] text-[#2f3e46] hover:text-white text-xs font-bold shadow-xs active:scale-97 transition-all cursor-pointer"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
