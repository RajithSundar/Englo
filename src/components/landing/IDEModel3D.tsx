import React from 'react';
import { motion, MotionValue } from 'motion/react';

/**
 * A hand-built 3D model of the Englo workspace, made of six stacked planes.
 * Stacked (explode = 0) the planes read as one IDE window; as `explode`
 * grows they separate along Z, like an exploded assembly drawing.
 *
 * Everything is driven from outside through MotionValues so the landing
 * page's scroll position controls the whole choreography.
 */

export const IDE_WIDTH = 720;
export const IDE_HEIGHT = 450;

/** Order of the planes from the back (0) to the front (5). */
export const IDE_LAYERS = ['frame', 'problem', 'editor', 'analysis', 'tests', 'review'] as const;
export type IDELayer = (typeof IDE_LAYERS)[number];

/** Scroll-driven state of one plane. */
export interface LayerMotion {
  /** Height of the plane above the window frame, in px. */
  z: MotionValue<number>;
  /** 0..1: how visible the plane's glass sheet is (shown once it has lifted off). */
  sheet: MotionValue<number>;
}

interface IDEModel3DProps {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  rotateZ: MotionValue<number>;
  /** One entry per plane, in IDE_LAYERS order. */
  layers: LayerMotion[];
}

const STEPS = [
  'Keep a hash map called seen: number -> index.',
  'Walk through nums with index i.',
  '  complement = target - nums[i]',
  '  If complement is in seen,',
  '    return [seen[complement], i].',
  '  Otherwise store seen[nums[i]] = i.',
  'If no pair is found, return [].',
];

const Plane: React.FC<{
  motion: LayerMotion;
  children: React.ReactNode;
}> = ({ motion: { z, sheet }, children }) => {
  return (
    <motion.div
      className="absolute inset-0"
      style={{ z, transformStyle: 'preserve-3d' }}
    >
      {/* The glass sheet that shows each plane once the stack separates. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[14px] border border-[#00C8FF]/30 bg-white/[0.025]"
        style={{ opacity: sheet, boxShadow: '0 0 24px rgba(0,200,255,0.10) inset' }}
      />
      {children}
    </motion.div>
  );
};

const mono = { fontFamily: "'Atkinson Hyperlegible Mono', 'JetBrains Mono', ui-monospace, monospace" };

export const IDEModel3D: React.FC<IDEModel3DProps> = ({ rotateX, rotateY, rotateZ, layers }) => {
  return (
    <motion.div
      className="relative"
      style={{
        width: IDE_WIDTH,
        height: IDE_HEIGHT,
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
        rotateZ,
      }}
    >
      {/* 0. Window frame */}
      <Plane motion={layers[0]}>
        <div
          className="absolute inset-0 rounded-[14px] border border-white/10 bg-[#03060A]"
          style={{
            boxShadow:
              '0 0 0 1px rgba(0,200,255,0.35), 0 0 40px rgba(0,200,255,0.18), 0 40px 80px rgba(0,0,0,0.8)',
          }}
        >
          <div className="flex h-9 items-center gap-3 border-b border-white/10 px-4">
            <span className="text-[13px] font-medium text-[#EEF2F5]">Englo</span>
            <span className="h-4 w-px bg-white/10" />
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-[#CBD2D7]" style={mono}>
              two-sum
            </span>
            <span className="ml-auto rounded-full bg-[#00C8FF] px-3 py-0.5 text-[11px] font-medium text-[#00182B]">
              Submit
            </span>
          </div>
          <div className="absolute bottom-0 left-[240px] top-9 w-px bg-white/10" />
        </div>
      </Plane>

      {/* 1. Problem statement (left column) */}
      <Plane motion={layers[1]}>
        <div className="absolute left-0 top-9 h-[414px] w-[240px] p-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-[#EEF2F5]">Two Sum</span>
            <span className="rounded-full border border-[#74E791]/40 px-2 text-[10px] text-[#74E791]">Easy</span>
          </div>
          <p className="mt-3 text-[11px] leading-[1.55] text-[#9DA6AD]">
            Given an array of integers <span className="text-[#CBD2D7]" style={mono}>nums</span> and a{' '}
            <span className="text-[#CBD2D7]" style={mono}>target</span>, describe in plain English how to return the
            indices of the two numbers that add up to the target.
          </p>
          <div className="mt-4 rounded-lg border border-white/10 bg-black p-3 text-[10.5px] leading-[1.6] text-[#CBD2D7]" style={mono}>
            <div className="text-[#9DA6AD]">Example 1</div>
            <div>nums = [2, 7, 11, 15]</div>
            <div>target = 9</div>
            <div className="text-[#9DA6AD]">Output: [0, 1]</div>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 w-[85%] rounded bg-white/[0.07]" />
            <div className="h-1.5 w-[70%] rounded bg-white/[0.07]" />
            <div className="h-1.5 w-[78%] rounded bg-white/[0.07]" />
          </div>
        </div>
      </Plane>

      {/* 2. Plain-English editor */}
      <Plane motion={layers[2]}>
        <div className="absolute left-[240px] right-0 top-9 h-[250px] px-4 py-3" style={mono}>
          {STEPS.map((line, i) => (
            <div key={i} className="flex text-[12px] leading-[1.85]">
              <span className="w-7 shrink-0 text-right text-[#4C555D]">{i + 1}</span>
              <span className={`ml-4 whitespace-pre ${i === 0 ? 'text-[#EEF2F5]' : 'text-[#CBD2D7]'}`}>{line}</span>
              {i === STEPS.length - 1 && <span className="ml-0.5 inline-block h-[15px] w-[2px] translate-y-[5px] bg-[#00C8FF] shadow-[0_0_8px_#00C8FF]" />}
            </div>
          ))}
          <div className="absolute bottom-3 left-4 top-3 w-[2px] rounded bg-[#00C8FF] shadow-[0_0_10px_rgba(0,200,255,0.7)]" />
        </div>
      </Plane>

      {/* 3. Technique and complexity strip */}
      <Plane motion={layers[3]}>
        <div
          className="absolute left-[240px] right-0 top-[286px] flex h-10 items-center gap-5 border-y border-white/10 bg-[#03060A] px-4 text-[11px]"
          style={mono}
        >
          <span className="text-[#9DA6AD]">Technique <span className="text-[#AAD3DD]">hash map lookup</span></span>
          <span className="text-[#9DA6AD]">Time <span className="text-[#AAD3DD]">O(n)</span></span>
          <span className="text-[#9DA6AD]">Space <span className="text-[#AAD3DD]">O(n)</span></span>
        </div>
      </Plane>

      {/* 4. Test cases console */}
      <Plane motion={layers[4]}>
        <div className="absolute bottom-0 left-[240px] right-0 top-[326px] px-4 py-2.5 text-[11px]" style={mono}>
          {[
            ['nums = [2,7,11,15], target = 9', '[0, 1]'],
            ['nums = [3,2,4], target = 6', '[1, 2]'],
            ['nums = [3,3], target = 6', '[0, 1]'],
          ].map(([input, out]) => (
            <div key={input} className="flex items-center gap-3 leading-[1.95]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#74E791] shadow-[0_0_6px_#74E791]" />
              <span className="text-[#CBD2D7]">{input}</span>
              <span className="ml-auto text-[#9DA6AD]">{out}</span>
            </div>
          ))}
        </div>
      </Plane>

      {/* 5. Logic review card */}
      <Plane motion={layers[5]}>
        <div
          className="absolute right-5 top-[58px] w-[200px] rounded-xl border border-[#00C8FF]/40 bg-[#02070C]/95 p-3.5"
          style={{ boxShadow: '0 0 0 1px rgba(0,200,255,0.15), 0 0 28px rgba(0,200,255,0.22)' }}
        >
          <div className="text-[11px] font-medium text-[#EEF2F5]">Logic review</div>
          <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10.5px] text-[#9DA6AD]">
            {['Correctness', 'Determinism', 'Efficiency', 'Brevity'].map((k) => (
              <div key={k} className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-[#00C8FF] shadow-[0_0_6px_#00C8FF]" />
                <span>{k}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-1.5 border-t border-white/10 pt-2.5">
            <div className="h-1.5 w-[92%] rounded bg-white/[0.08]" />
            <div className="h-1.5 w-[76%] rounded bg-white/[0.08]" />
            <div className="h-1.5 w-[84%] rounded bg-white/[0.08]" />
          </div>
        </div>
      </Plane>
    </motion.div>
  );
};
