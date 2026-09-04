import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
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
  ChevronRight
} from 'lucide-react';

interface TypingSnippet {
  title: string;
  problem: string;
  lines: string[];
  complexity: string;
  technique: string;
}

const SNIPPETS: TypingSnippet[] = [
  {
    title: 'Two Sum',
    problem: 'Find two indices that sum to target',
    complexity: 'O(N) Time • O(N) Space',
    technique: 'Hash Map Lookup',
    lines: [
      'Step 1: Initialize hash map seen = {} to store {num: index}.',
      'Step 2: Iterate through nums with index i:',
      '         complement = target - nums[i]',
      '         if complement in seen: return [seen[complement], i]',
      '         seen[nums[i]] = i',
      'Step 3: Return empty list if no pair satisfies target.'
    ]
  },
  {
    title: 'LRU Cache',
    problem: 'Least Recently Used Cache in O(1)',
    complexity: 'O(1) Get • O(1) Put',
    technique: 'Doubly Linked List + Hash Map',
    lines: [
      'Step 1: Maintain doubly linked list for eviction order.',
      'Step 2: Maintain hash map mapping key to node reference.',
      'Step 3: On get(key): if present, move node to head and return value.',
      'Step 4: On put(key, val): insert at head. If capacity exceeded,',
      '         evict node at tail and remove from hash map.'
    ]
  },
  {
    title: 'Trapping Rain Water',
    problem: 'Calculate water units trapped in elevation map',
    complexity: 'O(N) Time • O(1) Space',
    technique: 'Two-Pointer Invariants',
    lines: [
      'Step 1: Initialize left = 0, right = length - 1.',
      'Step 2: Maintain max_left = 0, max_right = 0, total_water = 0.',
      'Step 3: While left < right:',
      '         if height[left] < height[right]: advance left & trap water',
      '         else: advance right & trap water.',
      'Step 4: Return total_water accumulated.'
    ]
  }
];

export const Interactive3DHeroCard: React.FC = () => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const currentSnippet = SNIPPETS[snippetIndex];

  // Typing state
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Card reference for mouse tracking
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse tilt motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for 3D rotation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 260,
    damping: 24
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-16, 16]), {
    stiffness: 260,
    damping: 24
  });

  // Glare reflection coordinates
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), {
    stiffness: 200,
    damping: 25
  });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), {
    stiffness: 200,
    damping: 25
  });

  // Scroll parallax mapping
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });

  const scrollElevateY = useTransform(scrollYProgress, [0, 0.5, 1], [40, 0, -60]);
  const scrollRotateZ = useTransform(scrollYProgress, [0, 0.5, 1], [-1.5, 0, 2]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.98]);

  // Handle mouse move inside the card container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Typing effect loop
  useEffect(() => {
    if (isPaused) return;

    if (lineIndex >= currentSnippet.lines.length) {
      if (!isVerified) {
        setIsVerified(true);
      }
      const pauseTimer = setTimeout(() => {
        setIsVerified(false);
        setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
        setLineIndex(0);
        setCharIndex(0);
      }, 4000);
      return () => clearTimeout(pauseTimer);
    }

    const currentLine = currentSnippet.lines[lineIndex];
    if (charIndex < currentLine.length) {
      const typeSpeed = Math.random() * 22 + 18;
      const timer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, typeSpeed);
      return () => clearTimeout(timer);
    } else {
      const nextLineTimer = setTimeout(() => {
        setLineIndex((prev) => prev + 1);
        setCharIndex(0);
      }, 220);
      return () => clearTimeout(nextLineTimer);
    }
  }, [lineIndex, charIndex, isPaused, currentSnippet, isVerified]);

  const handleResetSnippet = () => {
    setIsVerified(false);
    setLineIndex(0);
    setCharIndex(0);
  };

  const handleNextSnippet = () => {
    setIsVerified(false);
    setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
    setLineIndex(0);
    setCharIndex(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-4xl mx-auto my-12 px-4 select-none perspective-[1200px]"
    >
      {/* 3D Elevated Card Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          rotateZ: scrollRotateZ,
          y: scrollElevateY,
          scale: scrollScale,
          transformStyle: 'preserve-3d'
        }}
        className="relative bg-white/85 backdrop-blur-xl border border-black/[0.08] rounded-3xl shadow-[0_24px_70px_rgba(0,113,227,0.12),0_1px_3px_rgba(0,0,0,0.06)] overflow-visible transition-shadow duration-300"
      >
        {/* Dynamic Specular Glass Reflection Layer */}
        <motion.div
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)`
          }}
          className="absolute inset-0 rounded-3xl pointer-events-none z-30 opacity-70"
        />

        {/* 1. Card Window Top Bar */}
        <div className="h-12 px-5 border-b border-black/[0.06] flex items-center justify-between bg-white/70 backdrop-blur-md rounded-t-3xl select-none z-20 relative">
          {/* Traffic Light Window Buttons */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 shadow-2xs" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-2xs" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-2xs" />
            <span className="ml-3 font-mono text-xs text-[#86868B] font-medium hidden sm:inline">
              Englo Plain-English Compiler • {currentSnippet.title}.algo
            </span>
          </div>

          {/* Interactive Snippet Controls */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
              title={isPaused ? 'Resume Typing' : 'Pause Typing'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-[#0071E3]" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleResetSnippet}
              className="p-1.5 rounded-lg text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
              title="Restart Problem"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextSnippet}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-[#0071E3] hover:bg-blue-100/80 font-mono text-[11px] font-medium transition-all"
              title="Next Problem Snippet"
            >
              <span>Next Example</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 2. Interactive Plain-English Code Area */}
        <div className="p-6 sm:p-8 font-mono text-xs sm:text-[13px] leading-7 text-[#1D1D1F] min-h-[260px] sm:min-h-[290px] flex flex-col justify-between relative z-10 bg-[#FBFBFD]/60">
          <div className="space-y-1">
            {/* Context header */}
            <div className="text-[11px] text-[#86868B] pb-2 border-b border-black/[0.04] flex items-center justify-between">
              <span>// Goal: {currentSnippet.problem}</span>
              <span className="text-[#0071E3] font-semibold">{currentSnippet.technique}</span>
            </div>

            {/* Typewritten Lines */}
            <div className="pt-3 space-y-1.5 font-mono">
              {currentSnippet.lines.map((line, idx) => {
                if (idx > lineIndex) return null;
                const isCurrentLine = idx === lineIndex;
                const displayText = isCurrentLine ? line.substring(0, charIndex) : line;

                return (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-[#86868B] select-none text-[11px] w-5 text-right shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 whitespace-pre-wrap">
                      <span
                        className={
                          line.startsWith('Step')
                            ? 'text-[#0071E3] font-semibold'
                            : line.includes('return')
                            ? 'text-emerald-600 font-semibold'
                            : 'text-[#1D1D1F]'
                        }
                      >
                        {displayText}
                      </span>
                      {isCurrentLine && (
                        <span className="inline-block w-1.5 h-4 bg-[#0071E3] ml-1 translate-y-0.5 animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Card Metric Bar */}
          <div className="pt-4 mt-4 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deterministic Proof</span>
              </span>
              <span className="text-[#86868B]">•</span>
              <span className="text-[#6E6E73]">{currentSnippet.complexity}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#86868B]">
                Engine:
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-black/[0.06] text-[#0071E3] font-mono text-[10px] font-semibold shadow-2xs">
                <Sparkles className="w-2.5 h-2.5" />
                Vertex AI Gemini 2.5
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. FLOATING 3D Z-ELEVATED BADGES (Physical Depth & Spline Echoes)
            ========================================================================= */}
        {/* Floating Top-Right 3D Pill (translateZ 45px) */}
        <motion.div
          style={{ transform: 'translateZ(45px)' }}
          className="absolute -top-5 -right-3 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-black/[0.08] shadow-[0_8px_24px_rgba(0,113,227,0.18)] z-40 text-xs font-mono text-[#1D1D1F]"
        >
          <span className="w-2 h-2 rounded-full bg-[#0071E3] ring-4 ring-blue-100 animate-ping" />
          <span className="font-semibold text-[11px] text-[#0071E3]">Live Semantic Proof</span>
        </motion.div>

        {/* Floating Bottom-Left 3D Pill (translateZ 55px) */}
        <motion.div
          style={{ transform: 'translateZ(55px)' }}
          className={`absolute -bottom-4 -left-3 flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-black/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.12)] z-40 text-xs transition-all duration-300 ${
            isVerified ? 'ring-2 ring-[#34C759] scale-105' : ''
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#34C759] shadow-2xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <div>
            <div className="font-bold text-[#1D1D1F] text-[11px]">
              {isVerified ? 'All 42 Assertions Passed' : 'Verifying Invariants...'}
            </div>
            <div className="text-[10px] text-[#86868B] font-mono">
              Zero Syntax Traps • 14ms Compile
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
