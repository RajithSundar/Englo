import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Globe, Server, Database, ShieldCheck, Zap, Layers, Activity } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';

export const SplineArchitecture3D: React.FC = () => {
  const { isDarkMode } = usePlatformStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string>('gateway');

  // Mouse tilt motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [45, 65]), {
    stiffness: 200,
    damping: 24
  });
  const rotateZ = useSpring(useTransform(mouseX, [-0.5, 0.5], [-40, -20]), {
    stiffness: 200,
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

  const NODES = {
    edge: { name: 'Anycast Edge CDN', specs: '180 PoPs · DDoS Guard', latency: '0.8ms' },
    gateway: { name: 'Envoy Ingress Gateway', specs: 'Token Bucket · JWT Auth', latency: '1.4ms' },
    cache: { name: 'Redis Replication Mesh', specs: 'Cluster Mode · 99.4% Hit Rate', latency: '0.3ms' },
    storage: { name: 'Sharded Postgres Primary', specs: 'WAL Streaming · B-Tree Index', latency: '4.2ms' }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[400px] flex items-center justify-center select-none overflow-hidden"
      style={{ perspective: '1100px' }}
    >
      {/* 3D Isometric Platform */}
      <motion.div
        style={{
          rotateX,
          rotateZ,
          transformStyle: 'preserve-3d'
        }}
        className={`relative w-[340px] sm:w-[380px] h-[340px] rounded-3xl p-6 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-[#2F3E46]/90 border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.7)]'
            : 'bg-white/90 border border-black/[0.08] shadow-[0_30px_70px_rgba(132,169,140,0.15)]'
        } backdrop-blur-xl`}
      >
        {/* Grid Floor Lines */}
        <div 
          className="absolute inset-4 rounded-2xl opacity-30 border border-dashed border-[#84A98C]/40 pointer-events-none"
          style={{ transform: 'translateZ(-10px)' }}
        />

        {/* Tier 1: Edge CDN (Front Left) */}
        <div
          onClick={() => setSelectedNode('edge')}
          style={{ transform: 'translate3d(30px, 30px, 30px)' }}
          className={`absolute cursor-pointer p-3 rounded-2xl border transition-all duration-300 shadow-md ${
            selectedNode === 'edge'
              ? 'border-[#84A98C] bg-[#84A98C]/15 dark:bg-[#354F52]/80 scale-105'
              : 'border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-[#1E272C]/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#84A98C]" />
            <div>
              <div className="text-[11px] font-bold text-[#2F3E46] dark:text-white">Edge CDN</div>
              <div className="text-[9px] font-mono text-[#52796F] dark:text-neutral-400">Cloudflare TLS</div>
            </div>
          </div>
        </div>

        {/* Dynamic Data Packet Pulse 1 */}
        <motion.div
          animate={{
            x: [60, 160],
            y: [50, 100],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-2 h-2 rounded-full bg-[#84A98C] shadow-[0_0_8px_#84A98C]"
          style={{ transform: 'translateZ(35px)' }}
        />

        {/* Tier 2: Envoy Gateway (Center) */}
        <div
          onClick={() => setSelectedNode('gateway')}
          style={{ transform: 'translate3d(140px, 90px, 60px)' }}
          className={`absolute cursor-pointer p-3.5 rounded-2xl border transition-all duration-300 shadow-lg ${
            selectedNode === 'gateway'
              ? 'border-[#D4A373] bg-amber-50/90 dark:bg-amber-950/80 scale-105'
              : 'border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-[#1E272C]/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#D4A373]" />
            <div>
              <div className="text-[11px] font-bold text-[#2F3E46] dark:text-white">Envoy Gateway</div>
              <div className="text-[9px] font-mono text-[#52796F] dark:text-neutral-400">Rate Limiter</div>
            </div>
          </div>
        </div>

        {/* Dynamic Data Packet Pulse 2 */}
        <motion.div
          animate={{
            x: [180, 70],
            y: [120, 200],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          className="absolute w-2 h-2 rounded-full bg-[#84A98C] shadow-[0_0_8px_#84A98C]"
          style={{ transform: 'translateZ(65px)' }}
        />

        {/* Tier 3: Redis Cache (Left Bottom) */}
        <div
          onClick={() => setSelectedNode('cache')}
          style={{ transform: 'translate3d(40px, 180px, 45px)' }}
          className={`absolute cursor-pointer p-3 rounded-2xl border transition-all duration-300 shadow-md ${
            selectedNode === 'cache'
              ? 'border-[#84A98C] bg-[#84A98C]/15 dark:bg-[#354F52]/80 scale-105'
              : 'border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-[#1E272C]/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#84A98C]" />
            <div>
              <div className="text-[11px] font-bold text-[#2F3E46] dark:text-white">Redis Cluster</div>
              <div className="text-[9px] font-mono text-[#52796F] dark:text-neutral-400">Sub-ms Cache</div>
            </div>
          </div>
        </div>

        {/* Tier 4: PostgreSQL Sharded Storage (Right Bottom) */}
        <div
          onClick={() => setSelectedNode('storage')}
          style={{ transform: 'translate3d(170px, 200px, 50px)' }}
          className={`absolute cursor-pointer p-3 rounded-2xl border transition-all duration-300 shadow-md ${
            selectedNode === 'storage'
              ? 'border-[#52796F] bg-[#52796F]/15 dark:bg-[#354F52]/80 scale-105'
              : 'border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-[#1E272C]/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#52796F] dark:text-[#84A98C]" />
            <div>
              <div className="text-[11px] font-bold text-[#2F3E46] dark:text-white">Postgres DB</div>
              <div className="text-[9px] font-mono text-[#52796F] dark:text-neutral-400">Sharded Primary</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Telemetry HUD Floating Card */}
      <div 
        className={`absolute bottom-2 left-4 right-4 sm:left-auto sm:right-6 sm:w-64 p-3.5 rounded-2xl border backdrop-blur-xl shadow-lg transition-colors duration-300 ${
          isDarkMode
            ? 'bg-[#2F3E46]/95 border-white/10 text-white'
            : 'bg-white/95 border-black/[0.08] text-[#2F3E46]'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
          <span className="text-[#84A98C] flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" />
            {NODES[selectedNode as keyof typeof NODES].name}
          </span>
          <span className="text-[#84A98C]">
            {NODES[selectedNode as keyof typeof NODES].latency}
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#CAD2C5] dark:text-[#CAD2C5]">
          {NODES[selectedNode as keyof typeof NODES].specs}
        </div>
      </div>
    </div>
  );
};
