import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { PROBLEMS } from '../../data/problems';
import { Flowing3DHeroAsset } from './Flowing3DHeroAsset';
import { FloatingParallaxAssets } from './FloatingParallaxAssets';
import { SplineLogicCore3D } from './SplineLogicCore3D';
import { SplineArchitecture3D } from './SplineArchitecture3D';
import { MultiFormatPitchAsset } from './MultiFormatPitchAsset';
import {
  Terminal,
  Play,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Search,
  Sparkles,
  Layers,
  Cpu,
  ShieldCheck,
  Flame,
  Check,
  Code2,
  Network,
  RotateCcw,
  Zap,
  Activity,
  Award,
  ChevronRight,
  ExternalLink,
  Users,
  Mic,
  Sliders,
  Database,
  Server,
  Globe,
  Gauge,
  X,
  RefreshCw,
  Clock,
  Sun,
  Moon,
  Compass,
  CheckCircle,
  Star,
  Lock,
  Workflow,
  Laptop
} from 'lucide-react';

interface ProblemComparison {
  id: string;
  name: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  complexity: string;
  traditionalSnippet: {
    language: string;
    code: string[];
    errorLine: number;
    errorText: string;
    bugTitle: string;
    bugExplanation: string;
  };
  engloSteps: {
    id: number;
    step: string;
    benefit: string;
  }[];
  verdict: {
    tests: string;
    percentile: string;
    time: string;
    space: string;
  };
}

const COMPARISON_PROBLEMS: ProblemComparison[] = [
  {
    id: 'two-sum',
    name: 'Problem #01 — Two Sum',
    category: 'Array • Hash Table',
    difficulty: 'Easy',
    complexity: 'O(N) Time • O(N) Space',
    traditionalSnippet: {
      language: 'JavaScript / TypeScript',
      code: [
        'function twoSum(nums, target) {',
        '  const map = new Map();',
        '  for (let i = 0; i <= nums.length; i++) { // BUG: off-by-one',
        '    let comp = target - nums[i];',
        '    if (map.has(comp)) {',
        '      return [map.get(comp), i];',
        '    }',
        '    map.set(nums[i], i);',
        '  }',
        '}'
      ],
      errorLine: 3,
      errorText: 'IndexOutOfBounds: index 4 exceeds array length 4',
      bugTitle: 'Off-By-One Boundary Crash',
      bugExplanation: 'Evaluating i <= nums.length causes undefined memory access, failing the automated test suite despite knowing the right algorithm.'
    },
    engloSteps: [
      {
        id: 1,
        step: 'Keep track of previously seen numbers and their indices in a hash map.',
        benefit: 'seen = { value: index }'
      },
      {
        id: 2,
        step: 'For each number in the array, compute complement = target − current.',
        benefit: 'Guarantees complement + current === target'
      },
      {
        id: 3,
        step: 'If complement exists in map, return [seen[complement], current_index].',
        benefit: 'Instant O(1) constant-time return'
      },
      {
        id: 4,
        step: 'Otherwise, store current number into map and proceed.',
        benefit: '100% deterministic single-pass runtime'
      }
    ],
    verdict: {
      tests: '42 / 42 Test Cases Passed',
      percentile: 'Top 99.4%',
      time: 'O(N) single pass',
      space: 'O(N) optimal map'
    }
  },
  {
    id: 'lru-cache',
    name: 'Problem #146 — LRU Cache',
    category: 'Hash Map • Doubly Linked List',
    difficulty: 'Medium',
    complexity: 'O(1) Get • O(1) Put',
    traditionalSnippet: {
      language: 'C++ / Raw Pointers',
      code: [
        'class LRUCache {',
        '  Node* head; Node* tail;',
        '  void remove(Node* node) {',
        '    node->prev->next = node->next; // BUG: null deref',
        '    node->next->prev = node->prev;',
        '    delete node;',
        '  }',
        '  // 40+ lines of fragile pointer plumbing...',
        '};'
      ],
      errorLine: 4,
      errorText: 'Segmentation Fault (SIGSEGV): null pointer dereference',
      bugTitle: 'Raw Pointer Null Dereference',
      bugExplanation: 'Missing boundary sentinel guards triggers a segmentation fault on edge eviction, costing 20 minutes of live whiteboard time.'
    },
    engloSteps: [
      {
        id: 1,
        step: 'Maintain a doubly linked list with head and tail sentinels for eviction order.',
        benefit: 'Eliminates all null pointer edge cases'
      },
      {
        id: 2,
        step: 'Maintain a hash map mapping key to node reference for instant lookup.',
        benefit: 'Enables true O(1) key-to-node indexing'
      },
      {
        id: 3,
        step: 'On get(key): if present, unlink node and move to head; return value.',
        benefit: 'Promotes item to Most Recently Used in O(1)'
      },
      {
        id: 4,
        step: 'On put(key, val): insert at head. If capacity exceeded, evict tail node.',
        benefit: 'Preserves strict memory capacity invariant'
      }
    ],
    verdict: {
      tests: '22 / 22 Stress Tests Passed',
      percentile: 'Top 98.9%',
      time: 'O(1) strict constant',
      space: 'O(Capacity) bounded'
    }
  }
];

export const LandingPage: React.FC = () => {
  const { 
    setActiveView, 
    setActiveProblem, 
    authenticateUser, 
    openAuth, 
    authenticatedUser,
    isDarkMode,
    toggleDarkMode,
    streakCount
  } = usePlatformStore();

  // Scroll tracking for gradient transition
  const { scrollYProgress } = useScroll();

  // Comparison problem selection
  const [selectedCompIndex, setSelectedCompIndex] = useState<number>(0);
  const activeComp = COMPARISON_PROBLEMS[selectedCompIndex];

  // Simulation state for workbench
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(100);
  const [heroEmail, setHeroEmail] = useState<string>('');
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'algorithm' | 'system_design'>('all');
  const [streakModalOpen, setStreakModalOpen] = useState<boolean>(false);

  // Floating Tweaks widget state
  const [isTweaksOpen, setIsTweaksOpen] = useState<boolean>(false);
  const [accentTheme, setAccentTheme] = useState<'blue' | 'emerald' | 'graphite'>('blue');
  const [densityMode, setDensityMode] = useState<'standard' | 'compact'>('standard');
  const [motionLevel, setMotionLevel] = useState<'spring' | 'reduced'>('spring');

  // Interactive simulation runner
  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentStep(1);
    setSimProgress(25);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 4) {
          clearInterval(stepInterval);
          setIsSimulating(false);
          setSimProgress(100);
          return 4;
        }
        const next = prev + 1;
        setSimProgress(next * 25);
        return next;
      });
    }, 650);
  };

  const handleStartProblem = (problemId: string, category: 'algorithm' | 'system_design') => {
    setActiveProblem(problemId);
    if (category === 'algorithm') {
      setActiveView('algo_workspace');
    } else {
      setActiveView('system_design_workspace');
    }
  };

  const handleQuickSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroEmail.trim()) {
      authenticateUser(heroEmail.trim(), heroEmail.trim().split('@')[0]);
      setActiveProblem('algo-1');
      setActiveView('dashboard');
    } else {
      openAuth('register');
    }
  };

  const filteredPreviewProblems = PROBLEMS.filter((p) => {
    if (catalogFilter !== 'all' && p.category !== catalogFilter) return false;
    return true;
  }).slice(0, 6);

  // Accent styles
  const accentBgClass = accentTheme === 'blue' ? 'bg-[#84A98C]' : accentTheme === 'emerald' ? 'bg-[#52796F]' : 'bg-[#2F3E46] dark:bg-[#CAD2C5] dark:text-[#2F3E46]';
  const accentTextClass = accentTheme === 'blue' ? 'text-[#84A98C]' : accentTheme === 'emerald' ? 'text-[#52796F]' : 'text-[#2F3E46] dark:text-white';
  const accentBorderClass = accentTheme === 'blue' ? 'border-[#84A98C]' : accentTheme === 'emerald' ? 'border-[#52796F]' : 'border-[#354F52] dark:border-[#52796F]';

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 flex flex-col selection:bg-[#52796F] selection:text-[#CAD2C5] dark:selection:bg-[#84A98C] dark:selection:text-[#2F3E46] relative overflow-x-hidden ${
        isDarkMode 
          ? 'bg-[#1E272C] text-[#CAD2C5]' 
          : 'bg-[#F4F6F4] text-[#2F3E46]'
      } ${densityMode === 'compact' ? 'text-[13px]' : 'text-[15px]'}`}
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Google Sans', 'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* 3D Floating Parallax Assets */}
      <FloatingParallaxAssets />

      {/* =========================================================================
          1. PRODUCT ANNOUNCEMENT BANNER (No Third-Party Branding)
          ========================================================================= */}
      <div className={`py-2 px-4 text-center text-xs font-medium tracking-tight flex items-center justify-center gap-2 border-b z-50 transition-colors ${
        isDarkMode 
          ? 'bg-[#2F3E46] text-[#CAD2C5] border-[#52796F]/30' 
          : 'bg-[#2F3E46] text-[#CAD2C5] border-[#354F52]'
      }`}>
        <span className="flex h-2 w-2 rounded-full bg-[#84A98C] animate-pulse" />
        <span className="font-semibold text-white">Englo 1.4:</span>
        <span className="text-[#CAD2C5]/90">
          The first algorithmic interview platform that tests your architectural logic, not punctuation.
        </span>
        <button
          onClick={() => handleStartProblem('algo-1', 'algorithm')}
          className="underline font-semibold hover:text-[#84A98C] ml-1 transition-colors cursor-pointer text-[#84A98C]"
        >
          Try Two Sum Free →
        </button>
      </div>

      {/* =========================================================================
          2. FROSTED GLASS STICKY HEADER (Fixed Navigation & Clean Links)
          ========================================================================= */}
      <header className={`sticky top-0 inset-x-0 z-40 h-14 border-b transition-all duration-300 backdrop-blur-xl ${
        isDarkMode 
          ? 'bg-[#090A0D]/85 border-white/[0.08]' 
          : 'bg-white/85 border-black/[0.06]'
      }`}>
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-8">
            <div 
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className={`w-7 h-7 rounded-lg ${accentBgClass} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-all duration-300`}>
                <Layers className="w-4 h-4" />
              </div>
              <span className={`text-[15px] font-bold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>
                Englo
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full border ${
                  isDarkMode 
                    ? 'border-white/10 bg-white/5 text-neutral-400' 
                    : 'border-black/[0.06] bg-[#F5F5F7] text-[#6E6E73]'
                }`}>
                  Studio
                </span>
              </span>
            </div>

            {/* Clean, Non-Redundant Navigation */}
            <nav className={`hidden md:flex items-center gap-1 text-[13px] font-semibold ${isDarkMode ? 'text-neutral-400' : 'text-[#6E6E73]'}`}>
              <a
                href="#how-it-works"
                className={`px-3 py-1.5 rounded-full transition-all ${
                  isDarkMode ? 'hover:text-white hover:bg-white/[0.06]' : 'hover:text-[#1D1D1F] hover:bg-black/[0.04]'
                }`}
              >
                How It Works
              </a>
              <a
                href="#advantage"
                className={`px-3 py-1.5 rounded-full transition-all ${
                  isDarkMode ? 'hover:text-white hover:bg-white/[0.06]' : 'hover:text-[#1D1D1F] hover:bg-black/[0.04]'
                }`}
              >
                Why Englo
              </a>
              <a
                href="#architecture"
                className={`px-3 py-1.5 rounded-full transition-all ${
                  isDarkMode ? 'hover:text-white hover:bg-white/[0.06]' : 'hover:text-[#1D1D1F] hover:bg-black/[0.04]'
                }`}
              >
                System Design
              </a>
              <button
                id="landing-nav-ledger"
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                  isDarkMode ? 'hover:text-white hover:bg-white/[0.06]' : 'hover:text-[#1D1D1F] hover:bg-black/[0.04]'
                }`}
              >
                Problem Ledger
              </button>
            </nav>
          </div>

          {/* Header Controls & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Find Shortcut */}
            <button
              onClick={() => setActiveView('dashboard')}
              className={`hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs rounded-full border transition-all duration-300 w-36 shadow-xs ${
                isDarkMode 
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 text-neutral-400' 
                  : 'bg-[#F5F5F7] hover:bg-[#EBEBED] border-black/[0.06] text-[#6E6E73]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="flex-1 text-left font-medium">Find...</span>
              <kbd className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${
                isDarkMode ? 'bg-[#181B26] border-white/10 text-neutral-300' : 'bg-white border-neutral-200 text-[#86868B]'
              }`}>
                ⌘K
              </kbd>
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 rounded-full border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-white/10 border-white/20 text-yellow-400 hover:bg-white/15' 
                  : 'bg-black/[0.04] border-black/[0.08] text-neutral-700 hover:bg-black/[0.08]'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {authenticatedUser ? (
              <div className="flex items-center gap-2">
                {/* Dynamic Streak Indicator - Only when authenticated */}
                <div 
                  onClick={() => setActiveView('dashboard')}
                  title="Click to view full streak and progress"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-mono font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{streakCount}d Streak</span>
                </div>

                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold transition-all ${
                    isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-black/[0.06] bg-neutral-50 text-[#1D1D1F]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${accentBgClass} text-white flex items-center justify-center text-[10px] font-bold`}>
                    {authenticatedUser.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline font-mono text-[11px]">{authenticatedUser.name}</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                    isDarkMode ? 'text-neutral-300 hover:text-white hover:bg-white/5' : 'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-neutral-100'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className={`hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    isDarkMode 
                      ? 'bg-[#84A98C]/20 text-[#84A98C] border border-[#84A98C]/40 hover:bg-[#84A98C]/30' 
                      : 'bg-[#CAD2C5]/30 text-[#52796F] border border-[#CAD2C5] hover:bg-[#CAD2C5]/50'
                  }`}
                >
                  Register
                </button>
              </>
            )}

            <button
              id="landing-start-free-btn"
              onClick={() => {
                setActiveProblem('algo-1');
                setActiveView('algo_workspace');
              }}
              className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-bold text-[#2F3E46] hover:text-white bg-[#84A98C] hover:bg-[#52796F] rounded-full transition-all duration-200 shadow-[0_2px_8px_rgba(132,169,140,0.3)] active:scale-[0.97] cursor-pointer"
            >
              Start Free
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          3. HERO SECTION — Product-First Value Proposition
          ========================================================================= */}
      <section className="relative pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden">
        {/* Soft atmospheric gradient glow */}
        <div 
          className="absolute top-4 left-1/2 -translate-x-1/2 w-[980px] h-[460px] blur-3xl -z-10 pointer-events-none rounded-full transition-colors duration-500"
          style={{
            background: isDarkMode
              ? 'radial-gradient(ellipse at center, rgba(132, 169, 140, 0.2), rgba(82, 121, 111, 0.1), transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(132, 169, 140, 0.15), rgba(202, 210, 197, 0.4), transparent 70%)'
          }}
        />

        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          {/* Product Pill Badge */}
          <div 
            onClick={() => handleStartProblem('algo-1', 'algorithm')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xs transition-all duration-300 mb-4 group cursor-pointer ${
              isDarkMode 
                ? 'bg-[#2F3E46] border-[#52796F]/50 hover:border-[#84A98C]' 
                : 'bg-white border-[#CAD2C5]/80 hover:border-[#84A98C]'
            }`}
          >
            <span className="flex h-2 w-2 rounded-full bg-[#84A98C] ring-4 ring-[#84A98C]/20 group-hover:scale-110 transition-transform" />
            <span className={`text-xs font-bold tracking-tight ${isDarkMode ? 'text-[#CAD2C5]' : 'text-[#2F3E46]'}`}>
              Built for Staff &amp; Senior Engineering Interviews
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#52796F] dark:text-[#CAD2C5]/70 group-hover:text-[#84A98C] transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>

          {/* Compelling Value Proposition Headline */}
          <h1 className={`text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.035em] max-w-4xl leading-[1.08] mb-4 ${
            isDarkMode ? 'text-white' : 'text-[#2F3E46]'
          }`}>
            Interview like an Architect.{' '}
            <span className="text-[#84A98C] inline-block">
              Solve in Pure Logic.
            </span>
            <br />
            Zero Syntax Traps.
          </h1>

          {/* Subtitle Selling the Product */}
          <p className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-5 font-normal tracking-tight ${
            isDarkMode ? 'text-[#CAD2C5]/80' : 'text-[#52796F]'
          }`}>
            Stop failing technical interviews because of missing semicolons or off-by-one errors. Englo turns your algorithmic invariants into verified execution proofs, Big-O benchmarks, and distributed blueprints.
          </p>

          {/* Interactive Invariant Prompt Starters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5 max-w-2xl">
            <span className="text-[11px] font-mono text-[#52796F] dark:text-[#CAD2C5]/70 uppercase tracking-wider mr-1">
              Select Logic:
            </span>
            <button
              onClick={() => handleStartProblem('algo-1', 'algorithm')}
              className={`text-xs px-3 py-1 rounded-full border shadow-xs font-semibold transition-all ${
                isDarkMode 
                  ? 'bg-[#2F3E46] border-[#52796F]/40 text-[#CAD2C5] hover:border-[#84A98C] hover:text-white' 
                  : 'bg-white border-[#CAD2C5]/80 text-[#2F3E46] hover:border-[#84A98C] hover:text-[#52796F]'
              }`}
            >
              "Two Sum with O(1) hash lookup"
            </button>
            <button
              onClick={() => handleStartProblem('algo-2', 'algorithm')}
              className={`text-xs px-3 py-1 rounded-full border shadow-xs font-semibold transition-all ${
                isDarkMode 
                  ? 'bg-[#2F3E46] border-[#52796F]/40 text-[#CAD2C5] hover:border-[#84A98C] hover:text-white' 
                  : 'bg-white border-[#CAD2C5]/80 text-[#2F3E46] hover:border-[#84A98C] hover:text-[#52796F]'
              }`}
            >
              "LRU Cache with O(1) eviction sentinels"
            </button>
            <button
              onClick={() => handleStartProblem('algo-3', 'algorithm')}
              className={`text-xs px-3 py-1 rounded-full border shadow-xs font-semibold transition-all ${
                isDarkMode 
                  ? 'bg-[#2F3E46] border-[#52796F]/40 text-[#CAD2C5] hover:border-[#84A98C] hover:text-white' 
                  : 'bg-white border-[#CAD2C5]/80 text-[#2F3E46] hover:border-[#84A98C] hover:text-[#52796F]'
              }`}
            >
              "Trapping Rain Water with two pointers"
            </button>
          </div>

          {/* Main Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-8">
            <button
              id="hero-btn-explore-ledger"
              onClick={() => setActiveView('dashboard')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-[#84A98C] text-[#2F3E46] hover:bg-[#52796F] hover:text-white transition-all duration-300 shadow-[0_4px_16px_rgba(132,169,140,0.3)] hover:shadow-[0_6px_22px_rgba(132,169,140,0.4)] active:scale-[0.98] group cursor-pointer"
            >
              <Workflow className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Explore Problem Ledger</span>
            </button>

            <button
              onClick={() => handleStartProblem('algo-1', 'algorithm')}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold border transition-all duration-300 active:scale-[0.98] cursor-pointer ${
                isDarkMode 
                  ? 'bg-[#2F3E46] border-[#52796F]/40 text-white hover:bg-[#354F52]' 
                  : 'bg-white border-[#CAD2C5]/80 text-[#2F3E46] hover:bg-[#F4F6F4] shadow-xs'
              }`}
            >
              <Terminal className="w-4 h-4 text-[#52796F] dark:text-[#84A98C]" />
              <span>Launch Daily Challenge: Two Sum</span>
            </button>
          </div>

          {/* Continuous Flowing 3D Hero Asset — Journeys through all 5 sections as user scrolls */}
          <div className="w-full my-2">
            <Flowing3DHeroAsset />
          </div>

          {/* Trust & Performance Proof Ribbon */}
          <div className={`w-full max-w-4xl py-3 px-6 rounded-2xl border shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-[#12151F]/80 border-white/[0.08] text-neutral-400' 
              : 'bg-white/80 border-black/[0.06] text-[#6E6E73]'
          } backdrop-blur-md`}>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#34C759]" />
              <span><strong className={isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}>100% Invariant Verification:</strong> Edge cases proved mathematically</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#84A98C]" />
              <span><strong className={isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}>Big-O Guarantees:</strong> Time &amp; space validated automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-[#AF00DB]" />
              <span><strong className={isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}>Distributed Canvas:</strong> Live system design topology</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HOW IT WORKS — Interactive Logic Stepper vs Syntax Trap
          ========================================================================= */}
      <section id="how-it-works" className={`py-24 border-t transition-colors duration-500 relative ${
        isDarkMode 
          ? 'bg-gradient-to-b from-[#0C0E14] via-[#0E1018] to-[#0A0C11] border-white/[0.06]' 
          : 'bg-gradient-to-b from-[#F4F6FB] via-[#EFF3F9] to-[#F7F9FC] border-black/[0.06]'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 gap-6 border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30 mb-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#52796F] dark:text-[#84A98C] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Core Advantage</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#2F3E46]'}`}>
                The Cost of Syntax vs. The Freedom of Logic
              </h2>
              <p className={`text-sm max-w-xl ${isDarkMode ? 'text-[#CAD2C5]/70' : 'text-[#52796F]'}`}>
                Traditional platforms penalize you for memory slips. Englo parses paragraphs, bullet points, or stepped prose to verify your invariant logic with zero formatting friction.
              </p>
            </div>

            {/* Problem Tab Switcher & Run Simulation */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className={`flex items-center p-1 rounded-full border shadow-2xs ${
                isDarkMode ? 'bg-[#2F3E46] border-[#52796F]/40' : 'bg-white border-[#CAD2C5]/80'
              }`}>
                {COMPARISON_PROBLEMS.map((comp, idx) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setSelectedCompIndex(idx);
                      setCurrentStep(1);
                      setSimProgress(25);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCompIndex === idx
                        ? 'bg-[#84A98C] text-[#2F3E46] shadow-xs'
                        : isDarkMode ? 'text-[#CAD2C5]/70 hover:text-white' : 'text-[#52796F] hover:text-[#2F3E46]'
                    }`}
                  >
                    {comp.id === 'two-sum' ? 'Two Sum (Array)' : 'LRU Cache (O(1))'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-[#2F3E46] hover:text-white bg-[#84A98C] hover:bg-[#52796F] active:scale-95 transition-all shadow-[0_2px_8px_rgba(132,169,140,0.3)] cursor-pointer disabled:opacity-70"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? 'Testing Invariants...' : 'Run Simulation'}</span>
              </button>
            </div>
          </div>

          {/* Split Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* The Brittle Syntax Trap (Left) */}
            <div className={`lg:col-span-5 rounded-2xl border p-7 flex flex-col justify-between shadow-xs transition-all duration-300 ${
              isDarkMode ? 'bg-[#2F3E46] border-[#52796F]/40' : 'bg-white border-[#CAD2C5]/60'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#84A98C]" />
                    <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-[#52796F] dark:text-[#CAD2C5]/70 font-bold">
                      Brittle Syntax Trap
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#FF3B30] bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                    <AlertCircle className="w-3 h-3" /> Interview Failure
                  </span>
                </div>

                <div className="py-6 font-mono text-[12px] leading-6 select-none overflow-x-auto">
                  {activeComp.traditionalSnippet.code.map((line, idx) => {
                    const isError = idx + 1 === activeComp.traditionalSnippet.errorLine;
                    return (
                      <div 
                        key={idx} 
                        className={isError ? 'bg-red-500/15 -mx-4 px-4 py-0.5 border-l-2 border-[#FF3B30] rounded-r font-bold text-[#FF3B30]' : isDarkMode ? 'text-[#CAD2C5]' : 'text-[#2F3E46]'}
                      >
                        <span className={`inline-block w-6 ${isError ? 'text-[#FF3B30] font-bold' : 'text-[#52796F]'}`}>
                          {idx + 1}
                        </span>
                        <span>{line}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#FF3B30] mb-0.5">
                      {activeComp.traditionalSnippet.bugTitle}
                    </div>
                    <p className={`leading-relaxed text-[11px] ${isDarkMode ? 'text-[#CAD2C5]/70' : 'text-[#52796F]'}`}>
                      {activeComp.traditionalSnippet.bugExplanation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-[#CAD2C5]/40 dark:border-[#52796F]/30 flex items-center justify-between text-xs font-mono text-[#52796F] dark:text-[#CAD2C5]/70">
                <span>Interview Outcome:</span>
                <span className="text-[#FF3B30] font-bold">Failed on syntax minutiae</span>
              </div>
            </div>

            {/* Middle Evaluator Column */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-6 gap-3 text-center">
              <div 
                onClick={handleRunSimulation}
                className={`w-12 h-12 rounded-full border flex items-center justify-center text-[#52796F] dark:text-[#84A98C] shadow-xs hover:scale-110 hover:shadow-[0_0_20px_rgba(132,169,140,0.3)] transition-all duration-300 cursor-pointer ${
                  isDarkMode ? 'bg-[#2F3E46] border-[#52796F]/40' : 'bg-white border-[#CAD2C5]/80'
                }`}
              >
                <Cpu className={`w-5 h-5 ${isSimulating ? 'animate-spin' : ''}`} />
              </div>
              <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-[#2F3E46]'}`}>
                Englo Logic Engine
              </span>
              <span className={`text-xs max-w-[150px] leading-normal font-medium ${isDarkMode ? 'text-[#CAD2C5]/70' : 'text-[#52796F]'}`}>
                Verifies loop bounds &amp; invariants automatically
              </span>
            </div>

            {/* The Englo Way (Right) */}
            <div className={`lg:col-span-5 rounded-2xl border border-[#84A98C]/50 p-7 flex flex-col justify-between shadow-[0_8px_30px_rgba(132,169,140,0.12)] relative overflow-hidden ring-1 ring-[#84A98C]/30 ${
              isDarkMode ? 'bg-[#2F3E46]' : 'bg-white'
            }`}>
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-5 border-b border-[#CAD2C5]/40 dark:border-[#52796F]/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#84A98C] animate-pulse" />
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#52796F] dark:text-[#84A98C] font-bold">
                      The Englo Way / Any Format Accepted
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isDarkMode ? 'bg-[#1E272C] text-[#CAD2C5]' : 'bg-[#F4F6F4] text-[#52796F]'
                    }`}>
                      Invariants {currentStep} of 4
                    </span>
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full border border-[#84A98C]/40 bg-[#84A98C]/15 text-[#52796F] dark:text-[#84A98C] font-bold">
                      Format-Agnostic
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 font-sans text-[13px] leading-relaxed">
                  {activeComp.engloSteps.map((stepItem) => {
                    const isActive = currentStep === stepItem.id;
                    const isPassed = currentStep >= stepItem.id;
                    return (
                      <div 
                        key={stepItem.id}
                        onClick={() => setCurrentStep(stepItem.id)}
                        className={`cursor-pointer p-3 rounded-xl border flex items-start gap-3 transition-all duration-200 ${
                          isActive
                            ? 'border-[#84A98C] bg-[#84A98C]/15 shadow-xs'
                            : isDarkMode 
                              ? 'border-[#52796F]/30 bg-[#1E272C] hover:border-[#84A98C]/50' 
                              : 'border-[#CAD2C5]/60 bg-[#F4F6F4] hover:border-[#84A98C]/50'
                        }`}
                      >
                        <span className="text-[#52796F] dark:text-[#84A98C] font-mono font-bold text-[11px] pt-0.5">
                          0{stepItem.id}
                        </span>
                        <div className="flex-1">
                          <div className={`font-semibold leading-snug ${isDarkMode ? 'text-white' : 'text-[#2F3E46]'}`}>
                            {stepItem.step}
                          </div>
                          <div className="font-mono text-[10px] text-[#52796F] dark:text-[#CAD2C5]/70 mt-0.5">
                            {stepItem.benefit}
                          </div>
                        </div>
                        <CheckCircle2 className={`w-4 h-4 text-[#84A98C] transition-opacity ${isPassed ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 font-sans text-xs shadow-xs relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-[3px] bg-[#84A98C] transition-all duration-500" 
                    style={{ width: `${simProgress}%` }}
                  />
                  <div className="flex items-center justify-between text-[#84A98C] font-bold mb-1.5 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ACCEPTED • {activeComp.verdict.tests}</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                      {activeComp.verdict.percentile}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[#52796F] dark:text-[#CAD2C5]/70 font-mono text-[11px] pt-1.5 border-t border-emerald-500/20">
                    <span>Time: <strong className={isDarkMode ? 'text-white' : 'text-[#2F3E46]'}>{activeComp.verdict.time}</strong></span>
                    <span>Space: <strong className={isDarkMode ? 'text-white' : 'text-[#2F3E46]'}>{activeComp.verdict.space}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-[#CAD2C5]/40 dark:border-[#52796F]/30 flex items-center justify-between text-xs font-mono text-[#52796F] dark:text-[#CAD2C5]/70">
                <span>Interview Outcome:</span>
                <span className="text-[#52796F] dark:text-[#84A98C] font-bold flex items-center gap-1">
                  Passed with Senior Staff Feedback
                  <Check className="w-3.5 h-3.5 text-[#84A98C]" />
                </span>
              </div>
            </div>
          </div>

          {/* Format-Independent Pitch Showcase Asset */}
          <div className="mt-14">
            <MultiFormatPitchAsset isDarkMode={isDarkMode} />
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. WHY ENGLO & 3D LOGIC CORE (Product Advantage + 3D Spline Asset)
          ========================================================================= */}
      <section id="advantage" className={`py-28 max-w-7xl mx-auto px-6 transition-colors duration-500`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Product Value Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#84A98C]/10 border border-[#84A98C]/30 text-[#52796F] dark:text-[#84A98C]">
              <Cpu className="w-3.5 h-3.5" />
              <span>THE ENGLO ADVANTAGE</span>
            </div>

            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>
              Built for How Top Tech Companies Actually Hire
            </h2>

            <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-neutral-300' : 'text-[#6E6E73]'}`}>
              Google, Meta, and Apple don't hire engineers for typing speed. They hire for your ability to explain complex invariants, choose optimal data structures, and handle concurrency gracefully.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#84A98C]/10 text-[#52796F] dark:text-[#84A98C] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <div>
                  <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>
                    Never Stumble on Syntax Under Pressure
                  </div>
                  <p className={`text-xs mt-0.5 leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-[#6E6E73]'}`}>
                    Write loop conditions, hash maps, and pointer bounds in clean English sentences. Englo verifies correctness without punctuation penalties.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-[#84A98C] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <div>
                  <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>
                    Immediate Invariant Simulation
                  </div>
                  <p className={`text-xs mt-0.5 leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-[#6E6E73]'}`}>
                    Watch state transitions, array pointers, and memory maps step forward dynamically as each logical sentence compiles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#52796F]/10 text-[#52796F] dark:text-[#84A98C] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <div>
                  <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>
                    Mathematical Big-O Proofs
                  </div>
                  <p className={`text-xs mt-0.5 leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-[#6E6E73]'}`}>
                    Get automatic proof of time and space complexity so you can walk into your interview loop completely confident.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleStartProblem('algo-1', 'algorithm')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#84A98C] hover:bg-[#52796F] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span>Try an Interactive Problem</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive 3D Spline Logic Core Asset */}
          <div className="lg:col-span-6 flex justify-center">
            <SplineLogicCore3D />
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SYSTEM DESIGN CANVAS & 3D ARCHITECTURE (Interactive 3D Asset)
          ========================================================================= */}
      <section id="architecture" className={`py-24 border-t transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-[#1E272C] border-white/[0.06]' 
          : 'bg-[#EBF0EB] border-black/[0.06]'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Interactive 3D Architecture Canvas */}
            <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
              <SplineArchitecture3D />
            </div>

            {/* Right Column: Distributed System Value Proposition */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#84A98C]/15 border border-[#84A98C]/30 text-[#52796F] dark:text-[#84A98C]">
                <Network className="w-3.5 h-3.5" />
                <span>DISTRIBUTED ARCHITECTURE STUDIO</span>
              </div>

              <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#2F3E46]'}`}>
                Master L5 / L6 System Design with Visual Proof
              </h2>

              <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? 'text-neutral-300' : 'text-[#52796F]'}`}>
                Senior engineering interviews test distributed topology. Model real cloud systems on an interactive canvas with instant capacity sizing, failover scenarios, and throughput analysis.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className={`p-4 rounded-2xl border transition-all ${
                  isDarkMode ? 'bg-[#2F3E46] border-white/10' : 'bg-white border-black/[0.06] shadow-xs'
                }`}>
                  <div className="text-xs font-bold text-[#84A98C] flex items-center gap-1.5 mb-1">
                    <Globe className="w-4 h-4" />
                    <span>Global CDN &amp; Ingress</span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-[#CAD2C5]' : 'text-[#52796F]'}`}>
                    Simulate edge caching, DDoS absorption, and TLS termination before traffic hits microservices.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  isDarkMode ? 'bg-[#2F3E46] border-white/10' : 'bg-white border-black/[0.06] shadow-xs'
                }`}>
                  <div className="text-xs font-bold text-[#D4A373] flex items-center gap-1.5 mb-1">
                    <Server className="w-4 h-4" />
                    <span>Rate Limiter &amp; Gateway</span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-[#CAD2C5]' : 'text-[#52796F]'}`}>
                    Evaluate token bucket algorithms, Envoy routing, and circuit breakers under sudden traffic spikes.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  isDarkMode ? 'bg-[#2F3E46] border-white/10' : 'bg-white border-black/[0.06] shadow-xs'
                }`}>
                  <div className="text-xs font-bold text-[#84A98C] flex items-center gap-1.5 mb-1">
                    <Zap className="w-4 h-4" />
                    <span>Distributed Cache Tier</span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-[#CAD2C5]' : 'text-[#52796F]'}`}>
                    Test Redis cluster replication, cache stampede prevention, and sub-millisecond retrieval.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border transition-all ${
                  isDarkMode ? 'bg-[#2F3E46] border-white/10' : 'bg-white border-black/[0.06] shadow-xs'
                }`}>
                  <div className="text-xs font-bold text-[#52796F] dark:text-[#84A98C] flex items-center gap-1.5 mb-1">
                    <Database className="w-4 h-4" />
                    <span>Sharded Storage &amp; WAL</span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-[#CAD2C5]' : 'text-[#52796F]'}`}>
                    Calculate database IOPS, partition keys, read replicas, and write-ahead log persistence guarantees.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleStartProblem('sys-1', 'system_design')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#84A98C] hover:bg-[#52796F] transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Launch System Design Sandbox: URL Shortener</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. PROBLEM LEDGER (Curated Benchmark Sets)
          ========================================================================= */}
      <section id="problem-catalog" className={`py-24 border-t transition-colors duration-500 ${
        isDarkMode ? 'bg-[#1E272C] border-white/[0.06]' : 'bg-[#F4F6F4] border-black/[0.06]'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 gap-6 border-b border-black/[0.06] dark:border-white/[0.06] mb-10">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-widest text-[#84A98C] font-bold">
                Problem Ledger
              </span>
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#2F3E46]'}`}>
                Curated Challenge Sets
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`flex items-center p-1 rounded-full border ${
                isDarkMode ? 'bg-[#2F3E46] border-white/10' : 'bg-white border-black/[0.06]'
              }`}>
                <button
                  onClick={() => setCatalogFilter('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    catalogFilter === 'all' 
                      ? isDarkMode ? 'bg-[#354F52] text-white shadow-xs' : 'bg-[#EBF0EB] text-[#2F3E46] shadow-xs' 
                      : isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-[#52796F] hover:text-[#2F3E46]'
                  }`}
                >
                  All ({PROBLEMS.length})
                </button>
                <button
                  onClick={() => setCatalogFilter('algorithm')}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    catalogFilter === 'algorithm' 
                      ? isDarkMode ? 'bg-[#354F52] text-white shadow-xs' : 'bg-[#EBF0EB] text-[#2F3E46] shadow-xs' 
                      : isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-[#52796F] hover:text-[#2F3E46]'
                  }`}
                >
                  Algorithms
                </button>
                <button
                  onClick={() => setCatalogFilter('system_design')}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    catalogFilter === 'system_design' 
                      ? isDarkMode ? 'bg-[#354F52] text-white shadow-xs' : 'bg-[#EBF0EB] text-[#2F3E46] shadow-xs' 
                      : isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-[#52796F] hover:text-[#2F3E46]'
                  }`}
                >
                  System Design
                </button>
              </div>

              <button
                onClick={() => setActiveView('dashboard')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#84A98C] hover:text-[#52796F] transition-colors ml-2 cursor-pointer"
              >
                <span>Full Ledger (24+)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Problem Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPreviewProblems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => handleStartProblem(problem.id, problem.category)}
                className={`p-6 rounded-2xl border flex flex-col justify-between gap-4 cursor-pointer transition-all duration-300 group ${
                  isDarkMode 
                    ? 'bg-[#2F3E46] border-white/[0.08] hover:border-[#84A98C]/50 hover:bg-[#354F52]' 
                    : 'bg-white border-black/[0.06] hover:bg-[#EBF0EB] hover:border-[#84A98C]/40 hover:shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-[#84A98C] border border-emerald-500/30'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-[#D4A373] border border-amber-500/30'
                          : 'bg-red-500/10 text-[#E07A5F] border border-red-500/30'
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="font-mono text-[11px] text-[#84A98C] dark:text-[#CAD2C5]">
                      {problem.category === 'algorithm' ? 'Algo-English' : 'System Design'}
                    </span>
                  </div>

                  <h3 className={`text-base font-bold transition-colors line-clamp-1 group-hover:text-[#84A98C] ${
                    isDarkMode ? 'text-white' : 'text-[#2F3E46]'
                  }`}>
                    {problem.title}
                  </h3>

                  <p className={`text-xs line-clamp-2 leading-relaxed font-normal ${
                    isDarkMode ? 'text-[#CAD2C5]' : 'text-[#52796F]'
                  }`}>
                    {problem.description.replace(/###.*?\n/g, '').replace(/```[\s\S]*?```/g, '').replace(/\*\*/g, '').replace(/`/g, '').replace(/\$O\((.*?)\)\$/g, 'O($1)')}
                  </p>
                </div>

                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {problem.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          isDarkMode ? 'bg-white/5 text-[#CAD2C5]' : 'bg-neutral-100 text-[#52796F]'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="inline-flex items-center gap-1 font-bold text-[#84A98C] text-xs group-hover:translate-x-0.5 transition-transform">
                    <span>Solve</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. PRODUCT CALL TO ACTION & FOOTER
          ========================================================================= */}
      <footer className={`py-24 border-t transition-colors duration-500 relative overflow-hidden text-center ${
        isDarkMode ? 'bg-[#182024] border-white/[0.06]' : 'bg-[#F4F6F4] border-black/[0.06]'
      }`}>
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#84A98C] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#84A98C]/20">
            <Layers className="w-6 h-6" />
          </div>

          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-[#2F3E46]'
          }`}>
            Master the Interview. Prove the Architecture.
          </h2>

          <p className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-[#CAD2C5]' : 'text-[#52796F]'
          }`}>
            Join hundreds of software engineers preparing for senior and staff loops with algorithmic clarity. No credit card required.
          </p>

          <form onSubmit={handleQuickSignup} className="max-w-md mx-auto flex items-center gap-2">
            <input
              type="email"
              value={heroEmail}
              onChange={(e) => setHeroEmail(e.target.value)}
              placeholder="Enter your engineer email..."
              className={`flex-1 px-4 py-2.5 rounded-full border text-xs focus:outline-none focus:ring-2 focus:ring-[#84A98C]/25 focus:border-[#84A98C] shadow-xs ${
                isDarkMode 
                  ? 'bg-[#2F3E46] border-white/10 text-white placeholder-neutral-400' 
                  : 'bg-white border-neutral-200/90 text-[#2F3E46]'
              }`}
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#84A98C] hover:bg-[#52796F] text-white text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Get Started Free
            </button>
          </form>

          <div className="pt-10 border-t border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-[#84A98C] dark:text-[#CAD2C5] font-mono gap-3">
            <span>© 2026 Englo Studio · Algorithmic Reasoning in Pure Logic</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveView('dashboard')} className="hover:text-[#52796F] dark:hover:text-white transition-colors cursor-pointer">
                Dashboard
              </button>
              <span>•</span>
              <a href="#how-it-works" className="hover:text-[#52796F] dark:hover:text-white transition-colors">
                How It Works
              </a>
              <span>•</span>
              <a href="#architecture" className="hover:text-[#52796F] dark:hover:text-white transition-colors">
                Architecture
              </a>
              <span>•</span>
              <a href="#problem-catalog" className="hover:text-[#52796F] dark:hover:text-white transition-colors">
                Problems
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          9. FLOATING TWEAKS & CONTROLS PANEL (Moved to bottom-left)
          ========================================================================= */}
      <div className="fixed bottom-5 left-5 z-50">
        <AnimatePresence>
          {isTweaksOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`mb-3 w-80 rounded-2xl border p-5 shadow-[0_12px_40px_rgba(0,0,0,0.3)] font-sans space-y-4 backdrop-blur-xl ${
                isDarkMode 
                  ? 'bg-[#2F3E46]/95 border-white/10 text-white' 
                  : 'bg-white/95 border-black/[0.08] text-[#2F3E46]'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#84A98C]" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Tweaks &amp; Dials
                  </span>
                </div>
                <button
                  onClick={() => setIsTweaksOpen(false)}
                  className="w-6 h-6 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/[0.05] flex items-center justify-center text-[#CAD2C5] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Theme Toggle Dial */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-[#84A98C] dark:text-[#CAD2C5] uppercase">
                  Theme Appearance
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => isDarkMode && toggleDarkMode()}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      !isDarkMode
                        ? 'border-[#84A98C] bg-[#84A98C]/15 text-[#52796F]'
                        : 'border-white/10 text-neutral-400 hover:bg-white/5'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => !isDarkMode && toggleDarkMode()}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isDarkMode
                        ? 'border-[#84A98C] bg-[#84A98C]/20 text-[#84A98C]'
                        : 'border-black/[0.06] text-[#52796F] hover:bg-neutral-50'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Accent Color Dial */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-[#84A98C] dark:text-[#CAD2C5] uppercase">
                  Accent Color
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setAccentTheme('blue')}
                    className={`py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      accentTheme === 'blue'
                        ? 'border-[#84A98C] bg-[#84A98C]/20 text-[#52796F] dark:text-[#84A98C]'
                        : 'border-black/[0.06] dark:border-white/10 text-neutral-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#84A98C]" />
                    <span>Sage</span>
                  </button>
                  <button
                    onClick={() => setAccentTheme('emerald')}
                    className={`py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      accentTheme === 'emerald'
                        ? 'border-[#52796F] bg-[#52796F]/20 text-[#52796F] dark:text-[#CAD2C5]'
                        : 'border-black/[0.06] dark:border-white/10 text-neutral-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#52796F]" />
                    <span>Forest</span>
                  </button>
                  <button
                    onClick={() => setAccentTheme('graphite')}
                    className={`py-1 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      accentTheme === 'graphite'
                        ? 'border-[#354F52] bg-[#354F52]/20 text-[#354F52] dark:text-white'
                        : 'border-black/[0.06] dark:border-white/10 text-neutral-400'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#354F52]" />
                    <span>Spruce</span>
                  </button>
                </div>
              </div>

              {/* Density Mode Dial */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-[#84A98C] dark:text-[#CAD2C5] uppercase">
                  Information Density
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setDensityMode('standard')}
                    className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      densityMode === 'standard'
                        ? 'border-[#84A98C] bg-[#84A98C]/20 text-[#52796F] dark:text-[#84A98C]'
                        : 'border-black/[0.06] dark:border-white/10 text-neutral-400'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => setDensityMode('compact')}
                    className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      densityMode === 'compact'
                        ? 'border-[#84A98C] bg-[#84A98C]/20 text-[#52796F] dark:text-[#84A98C]'
                        : 'border-black/[0.06] dark:border-white/10 text-neutral-400'
                    }`}
                  >
                    Compact (Eng)
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsTweaksOpen(!isTweaksOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#84A98C] hover:bg-[#52796F] text-white text-xs font-bold shadow-[0_4px_16px_rgba(132,169,140,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Tweaks</span>
        </button>
      </div>
    </div>
  );
};
