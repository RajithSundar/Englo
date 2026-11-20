import React from 'react';
import {
  ChevronDown,
  Flame,
  LogOut,
  Sun,
  Moon,
  Award,
  Keyboard,
  CreditCard,
  IndianRupee,
  CheckSquare,
  Wrench,
  LayoutDashboard
} from 'lucide-react';
import { PROBLEMS } from '../data/problems';
import { usePlatformStore } from '../store/usePlatformStore';
import { audioService } from '../services/audioService';

const isMac =
  typeof navigator !== 'undefined' && /mac|iphone|ipad|ipod/i.test(navigator.platform || '');
const MOD = isMac ? '⌘' : 'Ctrl';

/** Closes a popover on outside mousedown and on Escape. */
function useDismiss(
  open: boolean,
  ref: React.RefObject<HTMLElement | null>,
  close: (viaEscape: boolean) => void
) {
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close(true);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, ref, close]);
}

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    activeProblemId,
    setActiveProblem,
    solvedProblemIds,
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
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);

  const streakRef = React.useRef<HTMLDivElement>(null);
  const userRef = React.useRef<HTMLDivElement>(null);
  const toolsRef = React.useRef<HTMLDivElement>(null);
  const toolsButtonRef = React.useRef<HTMLButtonElement>(null);
  const toolsMenuRef = React.useRef<HTMLDivElement>(null);

  const closeStreak = React.useCallback(() => setIsStreakPopoverOpen(false), []);
  const closeUser = React.useCallback(() => setIsUserMenuOpen(false), []);
  const closeTools = React.useCallback((viaEscape: boolean) => {
    setIsToolsOpen(false);
    if (viaEscape) toolsButtonRef.current?.focus();
  }, []);

  useDismiss(isStreakPopoverOpen, streakRef, closeStreak);
  useDismiss(isUserMenuOpen, userRef, closeUser);
  useDismiss(isToolsOpen, toolsRef, closeTools);

  // Move focus into the Tools menu when it opens.
  React.useEffect(() => {
    if (isToolsOpen) {
      toolsMenuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus();
    }
  }, [isToolsOpen]);

  const onToolsMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
    const items: HTMLButtonElement[] = toolsMenuRef.current
      ? Array.from(toolsMenuRef.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'))
      : [];
    if (!items.length) return;
    e.preventDefault();
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);
    let next = 0;
    if (e.key === 'ArrowDown') next = (idx + 1) % items.length;
    else if (e.key === 'ArrowUp') next = (idx - 1 + items.length) % items.length;
    else if (e.key === 'End') next = items.length - 1;
    items[next].focus();
  };

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
  const inWorkspace = activeView === 'algo_workspace' || activeView === 'system_design_workspace';
  const activeToday = recentDays[recentDays.length - 1]?.isActive;

  const difficultyChip =
    activeProblem.difficulty === 'Easy'
      ? 'chip-easy'
      : activeProblem.difficulty === 'Medium'
      ? 'chip-medium'
      : 'chip-hard';

  const goWorkspace = () => {
    if (activeProblem.category === 'algorithm') {
      setActiveView('algo_workspace');
    } else {
      setActiveView('system_design_workspace');
    }
  };

  const viewSwitcher = (
    <div className="seg" role="tablist" aria-label="Views">
      <button
        id="nav-tab-landing"
        type="button"
        role="tab"
        aria-selected={activeView === 'landing'}
        onClick={() => setActiveView('landing')}
        className="seg-item"
      >
        Overview
      </button>
      <button
        id="nav-tab-dashboard"
        type="button"
        role="tab"
        aria-selected={activeView === 'dashboard'}
        onClick={() => setActiveView('dashboard')}
        className="seg-item"
      >
        Problems
      </button>
      <button
        id="nav-tab-workspace"
        type="button"
        role="tab"
        aria-selected={inWorkspace}
        onClick={goWorkspace}
        className="seg-item"
      >
        Workspace
      </button>
      <button
        id="nav-tab-learn"
        type="button"
        role="tab"
        aria-selected={activeView === 'learn'}
        onClick={() => setActiveView('learn')}
        className="seg-item"
      >
        Learn
      </button>
    </div>
  );

  const problemSelect = inWorkspace && (
    <div className="flex items-center gap-2 min-w-0">
      <div className="relative flex items-center min-w-0">
        <label htmlFor="navbar-problem-select" className="sr-only">
          Current problem
        </label>
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
          className="h-8 max-w-[16rem] truncate rounded-lg border border-rule bg-transparent pl-3 pr-8 text-[13px] font-medium text-ink appearance-none cursor-pointer transition-colors hover:border-rule-2 focus:outline-none focus:border-accent focus:"
        >
          {PROBLEMS.map((p) => (
            <option key={p.id} value={p.id} className="bg-paper-2 text-ink">
              {p.title} ({p.category === 'algorithm' ? 'Algorithm' : 'System design'})
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-2.5 pointer-events-none" />
      </div>
      <span className={`chip ${difficultyChip}`}>{activeProblem.difficulty}</span>
    </div>
  );

  const toolItems: {
    id?: string;
    icon: React.ReactNode;
    label: string;
    description: string;
    keys?: string[];
    onClick: () => void;
  }[] = [
    {
      id: 'nav-bounty-trigger',
      icon: <IndianRupee className="w-4 h-4" />,
      label: bountyClaimed ? '₹5,000 bounty paid out' : '₹5,000 bounty',
      description: 'Claim the interview bounty via RazorpayX',
      onClick: () => {
        audioService.playTap();
        setBountyModalOpen(true);
      }
    },
    {
      id: 'nav-evaluator-checkout-trigger',
      icon: <CreditCard className="w-4 h-4" />,
      label: isEvaluatorPro ? 'Evaluator Pro' : 'Upgrade to Pro',
      description: isEvaluatorPro ? 'Your Pro plan details' : 'Evaluator Pro through Razorpay checkout',
      onClick: () => {
        audioService.playTap();
        setCheckoutModalOpen(true);
      }
    },
    {
      icon: <Award className="w-4 h-4" />,
      label: 'Credential',
      description: 'Your verified record of solved work',
      keys: [MOD, 'Shift', 'C'],
      onClick: () => {
        audioService.playTap();
        setCertificateModalOpen(true);
      }
    },
    {
      icon: <CheckSquare className="w-4 h-4" />,
      label: 'Verification matrix',
      description: 'Run the platform test suite',
      onClick: () => {
        audioService.playTap();
        setTestRunnerOpen(true);
      }
    },
    {
      icon: <Keyboard className="w-4 h-4" />,
      label: 'Keyboard shortcuts',
      description: 'Every shortcut in one sheet',
      keys: ['?'],
      onClick: () => {
        audioService.playTap();
        setShortcutsModalOpen(true);
      }
    }
  ];

  return (
    <header className="glass-strong sticky top-0 z-50 shrink-0 select-none rounded-none border-x-0 border-t-0">
      <div className="px-4 sm:px-6 flex flex-wrap md:flex-nowrap items-center gap-x-4">
        {/* Wordmark */}
        <button
          type="button"
          id="nav-brand-logo"
          onClick={() => setActiveView('landing')}
          className="wordmark order-1 h-14 text-[17px] text-ink hover:text-accent transition-colors cursor-pointer"
        >
          Englo
        </button>

        {/* View switcher + problem select: inline from md, second row below md */}
        <div className="order-3 md:order-2 w-full md:w-auto md:flex-1 min-w-0 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 pb-2.5 md:pb-0">
          {viewSwitcher}
          <div className="md:flex-1 min-w-0 flex md:justify-center">{problemSelect}</div>
        </div>

        {/* Right: streak, tools, theme, account */}
        <div className="order-2 md:order-3 ml-auto h-14 flex items-center gap-2 shrink-0">
          {authenticatedUser && (
            <div className="relative" ref={streakRef}>
              <button
                type="button"
                onClick={() => setIsStreakPopoverOpen(!isStreakPopoverOpen)}
                aria-haspopup="dialog"
                aria-expanded={isStreakPopoverOpen}
                className="chip h-8 px-2.5 text-[12px] cursor-pointer hover:border-rule-2 transition-colors"
                title="Daily practice streak"
              >
                <Flame className="w-3.5 h-3.5 text-warn" />
                <span>
                  {streakCount}
                  <span className="hidden sm:inline"> day streak</span>
                  <span className="sm:hidden">d</span>
                </span>
              </button>

              {isStreakPopoverOpen && (
                <div
                  role="dialog"
                  aria-label="Practice streak"
                  className="glass-strong absolute right-0 top-11 w-72 rounded-xl p-4 z-[70] text-ink"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-rule pb-3 mb-3">
                    <div>
                      <div className="text-sm font-medium text-ink">
                        {streakCount} day{streakCount === 1 ? '' : 's'} active
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        Personal best: {bestStreak} day{bestStreak === 1 ? '' : 's'}
                      </div>
                    </div>
                    {activeToday && <span className="chip chip-easy">Active today</span>}
                  </div>

                  <div className="label mb-2">Last 7 days</div>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {recentDays.map((day) => (
                      <div key={day.date} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted">{day.label}</span>
                        <div
                          className={`w-7 h-7 rounded-none flex items-center justify-center text-[11px] font-medium ${
                            day.isActive
                              ? 'bg-accent/15 text-ink border border-accent/60'
                              : 'text-muted border border-rule'
                          }`}
                          title={`${day.date}: ${day.isActive ? 'Active' : 'No activity'}`}
                        >
                          {day.dayNum}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tools menu */}
          <div className="relative" ref={toolsRef}>
            <button
              ref={toolsButtonRef}
              id="nav-tools-menu-trigger"
              type="button"
              aria-haspopup="menu"
              aria-expanded={isToolsOpen}
              aria-controls="nav-tools-menu"
              onClick={() => {
                audioService.playTap();
                setIsToolsOpen(!isToolsOpen);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' && !isToolsOpen) {
                  e.preventDefault();
                  setIsToolsOpen(true);
                }
              }}
              className="btn-quiet h-8 cursor-pointer"
              title="Tools"
            >
              <Wrench className="w-4 h-4" />
              <span className="hidden sm:inline">Tools</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-muted transition-transform ${isToolsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Kept mounted so the item ids stay in the DOM for scripts. */}
            <div
              id="nav-tools-menu"
              ref={toolsMenuRef}
              role="menu"
              aria-label="Tools"
              hidden={!isToolsOpen}
              onKeyDown={onToolsMenuKeyDown}
              className="glass-strong absolute right-0 top-11 w-[19rem] max-w-[calc(100vw-2rem)] rounded-xl p-1.5 z-[70]"
            >
              {toolItems.map((item) => (
                <button
                  key={item.label}
                  id={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsToolsOpen(false);
                    item.onClick();
                  }}
                  className="w-full flex items-start gap-3 rounded-lg px-2.5 py-2 text-left cursor-pointer transition-colors hover:bg-paper-3 focus:outline-none focus-visible:bg-paper-3 focus-visible:"
                >
                  <span className="mt-0.5 text-muted">{item.icon}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm text-ink">{item.label}</span>
                    <span className="block text-xs text-muted truncate">{item.description}</span>
                  </span>
                  {item.keys && (
                    <span className="mt-0.5 flex items-center gap-1 shrink-0">
                      {item.keys.map((k) => (
                        <kbd key={k} className="kbd">
                          {k}
                        </kbd>
                      ))}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Theme toggle */}
          <button
            id="nav-dark-mode-toggle"
            type="button"
            onClick={toggleDarkMode}
            title={`${isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'} (${MOD}+B)`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="btn-icon w-8 h-8 cursor-pointer"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Account */}
          {authenticatedUser ? (
            <div className="relative" ref={userRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-none hover:bg-ink/[0.06] transition-colors cursor-pointer"
              >
                <span className="w-7 h-7 rounded-none border border-rule-2 flex items-center justify-center text-ink-2 text-[11px] font-medium">
                  {authenticatedUser.handle.replace('@', '').slice(0, 2).toUpperCase()}
                </span>
                <span className="hidden md:inline text-[13px] text-ink-2 max-w-[9rem] truncate">
                  {authenticatedUser.handle}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted" />
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="glass-strong absolute right-0 top-11 w-64 rounded-xl p-1.5 z-[70] text-ink"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-2.5 py-2 border-b border-rule mb-1">
                    <div className="text-sm font-medium text-ink truncate">
                      {authenticatedUser.name || authenticatedUser.handle}
                    </div>
                    <div className="text-xs text-muted truncate">{authenticatedUser.email}</div>
                    {authenticatedUser.role && (
                      <span className="chip mt-1.5">{authenticatedUser.role}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => setActiveView('dashboard')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-paper-3 text-sm text-ink flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-muted" />
                      Problems
                    </span>
                    <span className="text-xs text-muted">
                      {totalSolved}/{totalProblems} solved
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      logoutUser();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-bad-soft text-sm text-bad flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openAuth('login')}
                className="btn-quiet h-8 cursor-pointer"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => openAuth('register')}
                className="btn-primary h-8 px-3.5 cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};
