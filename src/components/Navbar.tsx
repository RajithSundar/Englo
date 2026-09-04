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
  LogOut
} from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { usePlatformStore } from '../store/usePlatformStore';

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
    activityDates
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
    <header className="h-14 border-b border-black/[0.06] bg-white/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between select-none z-50 sticky top-0 transition-all">
      {/* Brand & Left Navigation */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div 
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="nav-brand-logo"
        >
          <div className="w-7 h-7 rounded-lg bg-[#0071E3] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-all">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#1D1D1F] flex items-center gap-1.5 group-hover:text-[#0071E3] transition-colors">
            Englo
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full border border-neutral-200 bg-[#F5F5F7] text-[#6E6E73]">
              Studio
            </span>
          </span>
        </div>

        {/* View Switcher Segmented Control */}
        <div className="flex items-center bg-[#F5F5F7] p-1 rounded-full border border-neutral-200/80">
          <button
            id="nav-tab-landing"
            onClick={() => setActiveView('landing')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeView === 'landing'
                ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            <span>Overview</span>
          </button>

          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveView('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeView === 'dashboard'
                ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
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
                ? 'bg-white text-[#1D1D1F] shadow-xs font-semibold'
                : 'text-[#6E6E73] hover:text-[#1D1D1F]'
            }`}
          >
            {activeProblem.category === 'algorithm' ? (
              <Terminal className="w-3.5 h-3.5 text-[#0071E3]" />
            ) : (
              <Network className="w-3.5 h-3.5 text-[#0071E3]" />
            )}
            <span>Active Studio</span>
          </button>
        </div>
      </div>

      {/* Middle: Active Problem Quick Selector Dropdown (when inside workspace) */}
      {activeView !== 'dashboard' && activeView !== 'landing' && (
        <div className="hidden md:flex items-center gap-2 bg-[#F5F5F7] border border-neutral-200/80 rounded-full px-3 py-1 text-xs">
          <span className="text-[#86868B] font-mono">Current:</span>
          <div className="relative flex items-center">
            <select
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
              className="bg-transparent text-[#1D1D1F] font-semibold text-xs pr-6 focus:outline-none cursor-pointer appearance-none"
            >
              {PROBLEMS.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-[#1D1D1F]">
                  {p.title} ({p.category === 'algorithm' ? 'Algo' : 'Arch'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#86868B] absolute right-0 pointer-events-none" />
          </div>

          <span
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeProblem.difficulty === 'Easy'
                ? 'bg-emerald-50 text-[#34C759] border border-emerald-200/70'
                : activeProblem.difficulty === 'Medium'
                ? 'bg-amber-50 text-[#FF9500] border border-amber-200/70'
                : 'bg-red-50 text-[#FF3B30] border border-red-200/70'
            }`}
          >
            {activeProblem.difficulty}
          </span>
        </div>
      )}

      {/* Right Navigation & Status Controls */}
      <div className="flex items-center gap-3">
        {/* Daily Streak Indicator - Only when authenticated */}
        {authenticatedUser && (
          <div className="relative" ref={streakRef}>
            <button
              type="button"
              onClick={() => setIsStreakPopoverOpen(!isStreakPopoverOpen)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/90 hover:bg-amber-100/90 border border-amber-200/70 text-[#B25E00] text-xs font-mono font-medium transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="View Daily Practice Streak"
            >
              <Flame className="w-3.5 h-3.5 text-[#FF9500] fill-[#FF9500] animate-pulse" />
              <span>{streakCount}d Streak</span>
            </button>

            {isStreakPopoverOpen && (
              <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl border border-black/[0.08] shadow-apple p-4 z-[70] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100/80 flex items-center justify-center text-[#FF9500]">
                      <Flame className="w-5 h-5 fill-[#FF9500]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#1D1D1F] font-sans">
                        {streakCount} Day{streakCount === 1 ? '' : 's'} Active
                      </div>
                      <div className="text-[11px] text-[#86868B] font-sans">
                        Personal best: {bestStreak} day{bestStreak === 1 ? '' : 's'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-[#34C759] border border-emerald-200/60 font-semibold">
                    Active Today
                  </span>
                </div>

                {/* 7-Day Activity Matrix */}
                <div className="mb-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#86868B] mb-2">
                    Recent Practice (Last 7 Days)
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {recentDays.map((day) => (
                      <div key={day.date} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-mono text-[#86868B]">{day.label}</span>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            day.isActive
                              ? 'bg-[#FF9500] text-white shadow-xs'
                              : 'bg-neutral-100 text-neutral-400 border border-neutral-200/60'
                          }`}
                          title={`${day.date}: ${day.isActive ? 'Active' : 'No activity'}`}
                        >
                          {day.dayNum}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-[#6E6E73] bg-[#F5F5F7] rounded-xl p-2.5 font-sans leading-tight">
                  Solve algorithmic problems or design system topologies daily to preserve your pure logic momentum!
                </div>
              </div>
            )}
          </div>
        )}

        {/* Platform Verification Suite Trigger */}
        <button
          onClick={() => setTestRunnerOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F5F5F7] hover:bg-neutral-200/70 text-[#1D1D1F] border border-neutral-200/80 transition-all active:scale-97 shadow-2xs"
          title="Run complete platform automated test suite"
        >
          <CheckSquare className="w-3.5 h-3.5 text-[#0071E3]" />
          <span>Verification Matrix</span>
        </button>

        {/* User profile / Session */}
        {authenticatedUser ? (
          <div className="relative pl-2 border-l border-neutral-200">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-black/[0.04] transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#0071E3] font-mono text-[11px] font-bold shadow-2xs">
                {authenticatedUser.handle.replace('@', '').slice(0, 2).toUpperCase()}
              </div>
              <span className="hidden md:inline text-xs font-semibold text-[#1D1D1F] font-mono">
                {authenticatedUser.handle}
              </span>
              <ChevronDown className="w-3 h-3 text-[#86868B]" />
            </button>

            {/* Cupertino User Dropdown Menu */}
            {isUserMenuOpen && (
              <div 
                className="absolute right-0 top-10 w-64 bg-white rounded-2xl border border-black/[0.08] shadow-apple p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="p-2 border-b border-neutral-100 mb-2">
                  <div className="text-xs font-bold text-[#1D1D1F]">
                    {authenticatedUser.name || authenticatedUser.handle}
                  </div>
                  <div className="text-[11px] text-[#86868B] font-mono truncate">
                    {authenticatedUser.email}
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-[#0071E3] font-medium">
                    {authenticatedUser.role || 'Staff Engineer'}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-between transition-colors"
                  >
                    <span>Problem Ledger</span>
                    <span className="font-mono text-[11px] text-[#0071E3]">{totalSolved}/{totalProblems}</span>
                  </button>

                  <button
                    onClick={() => {
                      logoutUser();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-50 text-[#FF3B30] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200">
            <button
              onClick={() => openAuth('login')}
              className="px-3 py-1 rounded-full text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth('register')}
              className="px-3.5 py-1.5 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold shadow-xs active:scale-97 transition-all cursor-pointer"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
