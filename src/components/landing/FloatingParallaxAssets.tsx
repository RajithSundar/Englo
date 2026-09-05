import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Terminal, Sparkles, Layers, Cpu, ShieldCheck, Network, Zap } from 'lucide-react';

export const FloatingParallaxAssets: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Different parallax speeds for distinct depth layers
  const yLayer1 = useTransform(scrollYProgress, [0, 1], [0, -280]);
  const yLayer2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const yLayer3 = useTransform(scrollYProgress, [0, 1], [0, -750]);
  const rotateOrb1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotateOrb2 = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const scalePill = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.12, 0.95]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Ambient Apple Gradient Lights */}
      <motion.div
        style={{ y: yLayer1, rotate: rotateOrb1 }}
        className="absolute top-28 left-[10%] w-72 h-72 rounded-full bg-gradient-to-tr from-[#84A98C]/20 to-[#52796F]/10 blur-3xl"
      />
      <motion.div
        style={{ y: yLayer2, rotate: rotateOrb2 }}
        className="absolute top-[45rem] right-[8%] w-80 h-80 rounded-full bg-gradient-to-bl from-[#52796F]/15 via-[#354F52]/10 to-transparent blur-3xl"
      />
      <motion.div
        style={{ y: yLayer3 }}
        className="absolute top-[85rem] left-[15%] w-96 h-96 rounded-full bg-gradient-to-tr from-[#84A98C]/15 via-[#CAD2C5]/10 to-transparent blur-3xl"
      />

      {/* 2. Floating 3D Glass Logic Orbs & Badges (Layer 1 - Slow) */}
      <motion.div
        style={{ y: yLayer1, scale: scalePill }}
        className="absolute top-48 right-[12%] hidden xl:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-black/[0.06] shadow-apple text-xs font-mono text-[#2F3E46]"
      >
        <div className="w-6 h-6 rounded-lg bg-[#84A98C]/15 border border-[#84A98C]/30 flex items-center justify-center text-[#52796F]">
          <Terminal className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="text-[10px] text-[#84A98C] uppercase">Invariant</div>
          <div className="font-semibold text-[#52796F]">O(N) Deterministic</div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yLayer2 }}
        className="absolute top-[28rem] left-[8%] hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.06] shadow-apple text-xs font-mono text-[#1D1D1F]"
      >
        <span className="w-2 h-2 rounded-full bg-[#34C759] ring-4 ring-emerald-100" />
        <span className="font-medium text-[11px]">42/42 Invariants Verified</span>
      </motion.div>

      {/* 4. Distributed System Floating Node Token (Layer 3 - Fast) */}
      <motion.div
        style={{ y: yLayer3 }}
        className="absolute top-[68rem] right-[7%] hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-200/60 shadow-apple text-xs text-[#1D1D1F]"
      >
        <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center text-[#AF00DB]">
          <Network className="w-3.5 h-3.5" />
        </div>
        <div className="font-mono text-[11px]">
          <span className="text-[#86868B]">Redis Cache: </span>
          <strong className="text-[#AF00DB]">99.8% Hit Ratio</strong>
        </div>
      </motion.div>

      <motion.div
        style={{ y: yLayer3 }}
        className="absolute top-[102rem] left-[10%] hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.06] shadow-apple text-xs font-mono text-[#1D1D1F]"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#FF9500]" />
        <span>Gemini 2.5 Flash Evaluation</span>
      </motion.div>
    </div>
  );
};
