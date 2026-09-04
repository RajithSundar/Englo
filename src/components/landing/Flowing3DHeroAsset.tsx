import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'motion/react';
import {
  Terminal,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Layers,
  Cpu,
  ShieldCheck,
  Check,
  ChevronRight,
  Globe,
  Server,
  Database,
  Activity,
  Award,
  ArrowRight,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

interface Snippet {
  title: string;
  category: string;
  complexity: string;
  technique: string;
  lines: string[];
}

const SNIPPETS: Snippet[] = [
  {
    title: 'Two Sum',
    category: 'Array Invariants',
    complexity: 'O(N) Time • O(N) Space',
    technique: 'Hash Map Lookup',
    lines: [
      'Step 1: Initialize hash map seen = {} to store {num: index}.',
      'Step 2: For each number with index i:',
      '         complement = target - nums[i]',
      '         if complement in seen: return [seen[complement], i]',
      '         seen[nums[i]] = i',
      'Step 3: Return empty list if no valid pair satisfies target.'
    ]
  },
  {
    title: 'LRU Cache',
    category: 'O(1) Data Structures',
    complexity: 'O(1) Get • O(1) Put',
    technique: 'Doubly Linked List + Map',
    lines: [
      'Step 1: Maintain doubly linked list with head/tail sentinels.',
      'Step 2: Maintain hash map mapping key to node pointer.',
      'Step 3: On get(key): if present, unlink node & re-insert at head.',
      'Step 4: On put(key, val): update or insert at head. If capacity',
      '         is exceeded, evict least recently used node at tail.'
    ]
  },
  {
    title: 'Trapping Rain Water',
    category: 'Two-Pointer Bounds',
    complexity: 'O(N) Time • O(1) Space',
    technique: 'Two-Pointer Invariants',
    lines: [
      'Step 1: Initialize left = 0, right = length - 1.',
      'Step 2: Maintain max_left = 0, max_right = 0, total_water = 0.',
      'Step 3: While left < right:',
      '         if height[left] < height[right]: advance left & trap water',
      '         else: advance right & trap water.',
      'Step 4: Return total_water accumulated across elevation.'
    ]
  }
];

const CHAPTER_NAMES = [
  'Hero',
  'How It Works',
  'The Advantage',
  'System Topology',
  'Problem Ledger'
];

export const Flowing3DHeroAsset: React.FC = () => {
  const { isDarkMode, setActiveProblem, setActiveView } = usePlatformStore();
  const [snippetIndex, setSnippetIndex] = useState(0);
  const currentSnippet = SNIPPETS[snippetIndex];

  // Typewriter state
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Scroll tracking state
  const [isDocked, setIsDocked] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const heroCardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking for Hero card
  const heroMouseX = useMotionValue(0);
  const heroMouseY = useMotionValue(0);
  const heroSpringTiltX = useSpring(useTransform(heroMouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 260,
    damping: 26
  });
  const heroSpringTiltY = useSpring(useTransform(heroMouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 260,
    damping: 26
  });

  // Mouse tilt tracking for Docked card
  const dockedMouseX = useMotionValue(0);
  const dockedMouseY = useMotionValue(0);
  const dockedSpringTiltX = useSpring(useTransform(dockedMouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 260,
    damping: 26
  });
  const dockedSpringTiltY = useSpring(useTransform(dockedMouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 260,
    damping: 26
  });

  // Specular reflection for Hero card
  const glareX = useSpring(useTransform(heroMouseX, [-0.5, 0.5], [15, 85]), {
    stiffness: 200,
    damping: 25
  });
  const glareY = useSpring(useTransform(heroMouseY, [-0.5, 0.5], [15, 85]), {
    stiffness: 200,
    damping: 25
  });

  // Handle hero mouse movements
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroMouseX.set(x);
    heroMouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    heroMouseX.set(0);
    heroMouseY.set(0);
  };

  // Handle docked mouse movements
  const handleDockedMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    dockedMouseX.set(x);
    dockedMouseY.set(y);
  };

  const handleDockedMouseLeave = () => {
    dockedMouseX.set(0);
    dockedMouseY.set(0);
  };

  // Scroll listener: detects when user scrolls past hero and which chapter is active
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Dock when scrolled past 340px
      setIsDocked(scrollY > 340);

      // Detect current chapter based on scroll position / section offsets
      const howItWorks = document.getElementById('how-it-works');
      const advantage = document.getElementById('advantage');
      const architecture = document.getElementById('architecture');
      const problemCatalog = document.getElementById('problem-catalog');

      if (problemCatalog && scrollY >= problemCatalog.offsetTop - 300) {
        setActiveChapter(4);
      } else if (architecture && scrollY >= architecture.offsetTop - 300) {
        setActiveChapter(3);
      } else if (advantage && scrollY >= advantage.offsetTop - 300) {
        setActiveChapter(2);
      } else if (howItWorks && scrollY >= howItWorks.offsetTop - 300) {
        setActiveChapter(1);
      } else {
        setActiveChapter(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Continuous Typewriter animation loop
  useEffect(() => {
    if (isPaused) return;

    if (lineIndex >= currentSnippet.lines.length) {
      if (!isVerified) setIsVerified(true);
      const pauseTimer = setTimeout(() => {
        setIsVerified(false);
        setLineIndex(0);
        setCharIndex(0);
        setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
      }, 4200);
      return () => clearTimeout(pauseTimer);
    }

    const currentLine = currentSnippet.lines[lineIndex];
    if (charIndex < currentLine.length) {
      const typeSpeed = Math.random() * 18 + 14;
      const timer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, typeSpeed);
      return () => clearTimeout(timer);
    } else {
      const linePause = setTimeout(() => {
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
      }, 320);
      return () => clearTimeout(linePause);
    }
  }, [lineIndex, charIndex, isPaused, snippetIndex, currentSnippet, isVerified]);

  return (
    <>
      {/* =========================================================================
          1. HERO IN-FLOW SHOWCASE CARD
          Rendered right inside the Hero flow:
          - Zero overlap with H1 headline, subtitle, or CTA buttons
          - Full 3D perspective and mouse-tilt tracking
          - Live typewriter terminal
          - Live algorithm switcher tabs
          - Mathematical proof telemetry
          ========================================================================= */}
      <div 
        className="w-full max-w-4xl mx-auto my-6 px-2 sm:px-4"
        style={{ perspective: '1400px' }}
      >
        <motion.div
          ref={heroCardRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          style={{
            rotateX: heroSpringTiltX,
            rotateY: heroSpringTiltY,
            transformStyle: 'preserve-3d'
          }}
          className={`relative w-full rounded-3xl p-6 sm:p-8 transition-colors duration-500 border ${
            isDarkMode
              ? 'bg-[#10131D]/95 border-white/15 shadow-[0_32px_90px_rgba(0,0,0,0.85)]'
              : 'bg-white/95 border-black/[0.08] shadow-[0_32px_90px_rgba(0,113,227,0.16)]'
          } backdrop-blur-2xl cursor-default group`}
        >
          {/* Dynamic Glare Reflection */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 transition-opacity duration-300"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx}% ${gy}%, ${
                    isDarkMode ? 'rgba(0, 113, 227, 0.35)' : 'rgba(0, 113, 227, 0.12)'
                  }, transparent 65%)`
              )
            }}
          />

          {/* Glowing 3D Orbiting Rings */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className="absolute w-[480px] h-[480px] rounded-full border border-dashed border-[#0071E3]/40 animate-[spin_32s_linear_infinite]"
              style={{ transform: 'rotateX(68deg) rotateY(18deg) translateZ(-40px)' }}
            />
            <div
              className="absolute w-[560px] h-[560px] rounded-full border border-dashed border-[#34C759]/35 animate-[spin_44s_linear_infinite_reverse]"
              style={{ transform: 'rotateX(-52deg) rotateY(30deg) translateZ(-60px)' }}
            />
          </div>

          {/* Header Chrome */}
          <div className="flex items-center justify-between pb-5 border-b border-black/[0.06] dark:border-white/[0.08] relative z-10">
            <div className="flex items-center gap-3">
              {/* macOS Window Dots */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10 inline-block" />
                <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10 inline-block" />
              </div>

              <div className="flex items-center gap-2 pl-2">
                <span className="flex h-2 w-2 rounded-full bg-[#0071E3] animate-pulse" />
                <span className={`font-mono text-xs font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1D1D1F]'}`}>
                  {currentSnippet.title}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isDarkMode ? 'bg-white/5 border-white/10 text-neutral-300' : 'bg-neutral-100 border-black/5 text-[#6E6E73]'
                }`}>
                  {currentSnippet.technique}
                </span>
              </div>
            </div>

            {/* Algorithm Switcher Tabs */}
            <div className={`flex items-center p-0.5 rounded-full border ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-black/5'
            }`}>
              {SNIPPETS.map((snip, idx) => (
                <button
                  key={snip.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSnippetIndex(idx);
                    setLineIndex(0);
                    setCharIndex(0);
                    setIsVerified(false);
                  }}
                  className={`px-3 py-1 text-[11px] font-mono font-semibold rounded-full transition-all cursor-pointer ${
                    snippetIndex === idx
                      ? 'bg-[#0071E3] text-white shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {snip.title}
                </button>
              ))}
            </div>
          </div>

          {/* Main Plain-English Typewriter Terminal Body */}
          <div className="py-6 space-y-3 font-mono text-[12px] sm:text-[13px] leading-relaxed relative z-10 text-left">
            {currentSnippet.lines.map((line, idx) => {
              const isCurrentLine = idx === lineIndex;
              const isPastLine = idx < lineIndex;
              const displayedText = isPastLine ? line : isCurrentLine ? line.slice(0, charIndex) : '';

              if (!isPastLine && !isCurrentLine) {
                return (
                  <div key={idx} className="opacity-20 text-neutral-400 select-none">
                    {line}
                  </div>
                );
              }

              return (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className={`text-[11px] pt-0.5 select-none font-bold ${
                    isPastLine ? 'text-[#34C759]' : 'text-[#0071E3]'
                  }`}>
                    0{idx + 1}
                  </span>
                  <div className="flex-1">
                    <span className={isDarkMode ? 'text-neutral-100' : 'text-[#1D1D1F]'}>
                      {displayedText}
                    </span>
                    {isCurrentLine && (
                      <span className="inline-block w-2 h-4 ml-0.5 bg-[#0071E3] animate-pulse align-middle" />
                    )}
                  </div>
                  {isPastLine && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759] shrink-0 mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Invariant & Mathematical Proof Indicator Footer */}
          <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Mathematical Proof Indicator */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 border ${
                  isVerified 
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-[#34C759]' 
                    : 'bg-blue-500/10 border-blue-500/20 text-[#0071E3]'
                }`}>
                  {isVerified ? <CheckCircle2 className="w-4 h-4" /> : <Cpu className="w-4 h-4 animate-spin" />}
                </div>

                <div className="text-left">
                  <div className={`text-xs font-bold flex items-center gap-1.5 ${
                    isVerified ? 'text-[#34C759]' : isDarkMode ? 'text-white' : 'text-[#1D1D1F]'
                  }`}>
                    <span>{isVerified ? 'INVARIANTS VERIFIED' : 'TESTING BOUNDS & INVARIANTS...'}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-500/10 text-[#0071E3] font-bold">
                      {currentSnippet.complexity}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#86868B] mt-0.5">
                    Single-pass algorithmic proof • Zero syntax traps
                  </div>
                </div>
              </div>

              {/* Pause & Solve Controls */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPaused(!isPaused);
                  }}
                  title={isPaused ? 'Resume Typewriter' : 'Pause Typewriter'}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isDarkMode ? 'border-white/10 hover:bg-white/10 text-neutral-300' : 'border-black/10 hover:bg-black/5 text-[#6E6E73]'
                  }`}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProblem('algo-1');
                    setActiveView('algo_workspace');
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#0071E3] hover:bg-[#0077ED] transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <span>Solve Challenge</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* =========================================================================
          2. PERSISTENT FLOATING 3D COMPANION (Desktop: lg+)
          When the user scrolls past the hero section, this companion docks neatly
          in the bottom-right corner. It NEVER leaves the user's view and NEVER
          blocks central content.
          ========================================================================= */}
      <AnimatePresence>
        {isDocked && !isExpanded && (
          <div 
            className="fixed bottom-6 right-6 z-40 hidden lg:block pointer-events-none"
            style={{ perspective: '1200px' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 36, scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onMouseMove={handleDockedMouseMove}
              onMouseLeave={handleDockedMouseLeave}
              style={{
                rotateX: dockedSpringTiltX,
                rotateY: dockedSpringTiltY,
                transformStyle: 'preserve-3d'
              }}
              className={`pointer-events-auto w-[380px] rounded-2xl p-4 border shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-[#10131E]/95 border-white/15 text-white' 
                  : 'bg-white/95 border-black/10 text-[#1D1D1F]'
              }`}
            >
              {/* Companion Header Pill */}
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0071E3] text-white shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>3D Companion · {CHAPTER_NAMES[activeChapter]}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsExpanded(true)}
                    title="Expand 3D Asset"
                    className="p-1 rounded-md text-[#86868B] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Compact Typewriter Snippet Body */}
              <div className="py-3 font-mono text-[11px] leading-relaxed space-y-1.5 text-left">
                <div className="flex items-center justify-between text-[#86868B] text-[10px]">
                  <span>Algorithmic Invariant:</span>
                  <span className="text-[#0071E3] font-bold">{currentSnippet.title}</span>
                </div>
                
                <div className={`p-2.5 rounded-xl border ${
                  isDarkMode ? 'bg-black/30 border-white/5' : 'bg-neutral-50 border-black/5'
                }`}>
                  <div className="flex items-start gap-2">
                    <span className="text-[#0071E3] font-bold select-none pt-0.5 text-[10px]">
                      0{Math.min(lineIndex + 1, currentSnippet.lines.length)}
                    </span>
                    <div className="flex-1">
                      <span className={isDarkMode ? 'text-neutral-200' : 'text-[#1D1D1F]'}>
                        {lineIndex < currentSnippet.lines.length
                          ? currentSnippet.lines[lineIndex].slice(0, charIndex)
                          : currentSnippet.lines[currentSnippet.lines.length - 1]}
                      </span>
                      <span className="inline-block w-1.5 h-3 ml-0.5 bg-[#0071E3] animate-pulse align-middle" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Compact Footer Status */}
              <div className="pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-[#34C759] font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{currentSnippet.complexity}</span>
                </div>

                <button
                  onClick={() => {
                    setActiveProblem('algo-1');
                    setActiveView('algo_workspace');
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0071E3] text-white text-[10px] font-bold hover:bg-[#0077ED] transition-colors cursor-pointer"
                >
                  <span>Solve</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          3. EXPANDED FULL-SCREEN INSPECTION MODAL
          Allows user to inspect or interact with the full 3D asset anytime from
          any scroll position.
          ========================================================================= */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className={`relative w-full max-w-3xl rounded-3xl p-6 sm:p-8 border shadow-2xl ${
                isDarkMode ? 'bg-[#10131E] border-white/15 text-white' : 'bg-white border-black/10 text-[#1D1D1F]'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 pb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="font-mono text-sm font-bold pl-2">{currentSnippet.title}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-[#0071E3] font-bold">
                  {currentSnippet.complexity}
                </span>
              </div>

              {/* Modal Terminal Body */}
              <div className="py-6 space-y-3 font-mono text-sm leading-relaxed text-left">
                {currentSnippet.lines.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-[#0071E3] font-bold select-none text-xs pt-0.5">0{idx + 1}</span>
                    <span className="flex-1">{line}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#34C759] shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#34C759] font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All Invariants Verified Single-Pass</span>
                </div>
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setActiveProblem('algo-1');
                    setActiveView('algo_workspace');
                  }}
                  className="px-5 py-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Solve Challenge Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
