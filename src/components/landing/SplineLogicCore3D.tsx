import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, CheckCircle2, Zap, ShieldCheck, Cpu, Code2 } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const SplineLogicCore3D: React.FC = () => {
  const { isDarkMode } = usePlatformStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeInvariant, setActiveInvariant] = useState<number>(0);

  // Mouse tilt motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), {
    stiffness: 220,
    damping: 24
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-18, 18]), {
    stiffness: 220,
    damping: 24
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const INVARIANTS = [
    { label: 'Map Lookup', formula: 'seen[complement]', complexity: 'O(1) Access', color: '#0071E3' },
    { label: 'Bound Guard', formula: '0 ≤ i < length', complexity: 'Zero Panic', color: '#34C759' },
    { label: 'Space Bound', formula: 'Space ≤ O(N)', complexity: 'Bounded Heap', color: '#AF00DB' },
    { label: 'Time Guarantee', formula: 'Single Pass Loop', complexity: 'O(N) Optimal', color: '#FF9500' }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[420px] flex items-center justify-center select-none"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        className={`relative w-[340px] sm:w-[400px] h-[360px] rounded-3xl p-6 flex flex-col justify-between transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-[#12141C]/90 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.6)]' 
            : 'bg-white/90 border border-black/[0.08] shadow-[0_24px_60px_rgba(0,113,227,0.12)]'
        } backdrop-blur-xl`}
      >
        {/* Ambient Core Radial Glow */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-50 blur-2xl transition-opacity duration-300"
          style={{
            background: isDarkMode
              ? 'radial-gradient(circle at 50% 50%, rgba(0, 113, 227, 0.25), rgba(52, 199, 89, 0.1), transparent 70%)'
              : 'radial-gradient(circle at 50% 50%, rgba(0, 113, 227, 0.15), rgba(52, 199, 89, 0.08), transparent 70%)'
          }}
        />

        {/* Top Status Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0071E3] animate-ping" />
            <span className={`text-[11px] font-mono font-bold tracking-wider uppercase ${isDarkMode ? 'text-blue-400' : 'text-[#0071E3]'}`}>
              3D Semantic Logic Engine
            </span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            isDarkMode 
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
              : 'bg-emerald-50 text-[#1E7E34] border-emerald-200'
          }`}>
            Live Proof
          </span>
        </div>

        {/* Center 3D Orbital Rings & Glowing Core */}
        <div className="relative w-full h-[180px] flex items-center justify-center my-auto" style={{ transformStyle: 'preserve-3d' }}>
          {/* Outer Orbital Ring 1 */}
          <div
            className="absolute w-44 h-44 rounded-full border border-dashed border-[#0071E3]/40 animate-[spin_18s_linear_infinite]"
            style={{
              transform: 'rotateX(68deg) rotateY(18deg)',
              transformStyle: 'preserve-3d'
            }}
          />

          {/* Counter-Rotating Orbital Ring 2 */}
          <div
            className="absolute w-52 h-52 rounded-full border border-dashed border-[#34C759]/40 animate-[spin_24s_linear_infinite_reverse]"
            style={{
              transform: 'rotateX(-55deg) rotateY(35deg)',
              transformStyle: 'preserve-3d'
            }}
          />

          {/* Tertiary Ring with Accent Node */}
          <div
            className="absolute w-60 h-60 rounded-full border border-black/10 dark:border-white/10 animate-[spin_32s_linear_infinite]"
            style={{
              transform: 'rotateX(75deg) rotateZ(45deg)',
              transformStyle: 'preserve-3d'
            }}
          />

          {/* Central Pulsing Logic Core Sphere */}
          <motion.div
            animate={{
              scale: [1, 1.06, 1],
              boxShadow: isDarkMode
                ? [
                    '0 0 25px rgba(0,113,227,0.5)',
                    '0 0 45px rgba(0,113,227,0.8)',
                    '0 0 25px rgba(0,113,227,0.5)'
                  ]
                : [
                    '0 0 20px rgba(0,113,227,0.3)',
                    '0 0 35px rgba(0,113,227,0.55)',
                    '0 0 20px rgba(0,113,227,0.3)'
                  ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#0071E3] via-[#0099FF] to-[#34C759] flex items-center justify-center text-white shadow-lg cursor-pointer z-10"
            style={{ transform: 'translateZ(40px)' }}
          >
            <Cpu className="w-8 h-8 text-white animate-pulse" />
          </motion.div>

          {/* Floating Orbiting Invariant Node 1 */}
          <motion.div
            animate={{
              y: [-6, 6, -6],
              rotate: [0, 4, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute top-1 left-2 sm:left-4 px-3 py-1.5 rounded-xl border text-[10px] font-mono shadow-md backdrop-blur-md cursor-pointer transition-all ${
              activeInvariant === 0
                ? 'border-[#0071E3] bg-blue-50/90 dark:bg-blue-950/80 text-[#0071E3] dark:text-blue-300 scale-105'
                : 'border-black/[0.08] dark:border-white/10 bg-white/80 dark:bg-[#1A1D27]/80 text-[#6E6E73] dark:text-neutral-300'
            }`}
            onClick={() => setActiveInvariant(0)}
            style={{ transform: 'translateZ(60px)' }}
          >
            <div className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#34C759]" />
              <span>seen = &#123;&#125;</span>
            </div>
          </motion.div>

          {/* Floating Orbiting Invariant Node 2 */}
          <motion.div
            animate={{
              y: [6, -6, 6],
              rotate: [0, -3, 0]
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className={`absolute bottom-2 right-2 sm:right-4 px-3 py-1.5 rounded-xl border text-[10px] font-mono shadow-md backdrop-blur-md cursor-pointer transition-all ${
              activeInvariant === 1
                ? 'border-[#34C759] bg-emerald-50/90 dark:bg-emerald-950/80 text-[#1E7E34] dark:text-emerald-300 scale-105'
                : 'border-black/[0.08] dark:border-white/10 bg-white/80 dark:bg-[#1A1D27]/80 text-[#6E6E73] dark:text-neutral-300'
            }`}
            onClick={() => setActiveInvariant(1)}
            style={{ transform: 'translateZ(50px)' }}
          >
            <div className="font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF9500]" />
              <span>target − nums[i]</span>
            </div>
          </motion.div>
        </div>

        {/* Invariant Detail Bar */}
        <div className="z-10 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className={`font-semibold ${isDarkMode ? 'text-neutral-200' : 'text-[#1D1D1F]'}`}>
              {INVARIANTS[activeInvariant].label}
            </span>
            <span className="text-[#34C759] font-bold">
              {INVARIANTS[activeInvariant].complexity}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#86868B]">
            <span>Invariant Rule:</span>
            <span className={isDarkMode ? 'text-blue-300' : 'text-[#0071E3]'}>
              {INVARIANTS[activeInvariant].formula}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
