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
    openAuth
  } = usePlatformStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const activeProblem = PROBLEMS.find((p) => p.id === activeProblemId) || PROBLEMS[0];
  const totalSolved = solvedProblemIds.length;
  const totalProblems = PROBLEMS.length;

  return (
    <header className="h-14 border-b border-black/[0.06] bg-white/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between select-none z-30 sticky top-0 transition-all">
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
        {/* Daily Streak Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/80 border border-amber-200/60 text-[#B25E00] text-xs font-mono font-medium">
          <Flame className="w-3.5 h-3.5 text-[#FF9500] fill-[#FF9500]" />
          <span>18d Streak</span>
        </div>

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
