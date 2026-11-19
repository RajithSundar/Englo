import React from 'react';
import { motion, MotionValue } from 'motion/react';

/**
 * A hand-built 3D model of the Englo workspace, made of six stacked planes.
 * Stacked (explode = 0) the planes read as one IDE window; as `explode`
 * grows they separate along Z, like an exploded assembly drawing.
 *
 * Everything is driven from outside through MotionValues so the landing
 * page's scroll position controls the whole choreography. Colours come from
 * the Console tokens of the page around it (amber for what the person wrote,
 * cool blue for what the checker measured); nothing glows.
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
  /** 0..1: how visible the plane's sheet is (shown once it has lifted off). */
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
  'Keep a hash map called seen: number to index.',
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
    <motion.div className="absolute inset-0" style={{ z, transformStyle: 'preserve-3d' }}>
      {/* The sheet that shows each plane once the stack separates: a hairline and a faint fill. */}
      <motion.div aria-hidden className="absolute inset-0 rounded-card border border-rule-2 bg-paper-2/40" style={{ opacity: sheet }} />
      {children}
    </motion.div>
  );
};

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
        <div className="absolute inset-0 rounded-card border border-rule-2 bg-paper-2">
          <div className="flex h-9 items-center gap-3 border-b border-rule px-4">
            <span className="text-[13px] font-medium text-ink">Englo</span>
            <span className="h-4 w-px bg-rule" />
            <span className="measured rounded-[4px] border border-rule px-2 py-0.5 text-[11px] text-ink-2">two-sum</span>
            <span className="ml-auto rounded-[4px] bg-accent px-3 py-0.5 text-[11px] font-medium text-accent-ink">Submit</span>
          </div>
          <div className="absolute bottom-0 left-[240px] top-9 w-px bg-rule" />
        </div>
      </Plane>

      {/* 1. Problem statement (left column) */}
      <Plane motion={layers[1]}>
        <div className="absolute left-0 top-9 h-[414px] w-[240px] p-4">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-ink">Two Sum</span>
            <span className="rounded-[4px] border border-rule px-1.5 text-[10px] text-ok">Easy</span>
          </div>
          <p className="mt-3 text-[11px] leading-[1.55] text-muted">
            Given an array of integers <span className="measured text-ink-2">nums</span> and a{' '}
            <span className="measured text-ink-2">target</span>, describe in plain English how to return the indices of
            the two numbers that add up to the target.
          </p>
          <div className="measured mt-4 rounded-[6px] border border-rule bg-paper-3 p-3 text-[10.5px] leading-[1.6] text-ink-2">
            <div className="text-muted">Example 1</div>
            <div>nums = [2, 7, 11, 15]</div>
            <div>target = 9</div>
            <div className="text-muted">Output: [0, 1]</div>
          </div>
          <div className="mt-3 space-y-1.5" aria-hidden>
            <div className="h-1.5 w-[85%] rounded bg-rule" />
            <div className="h-1.5 w-[70%] rounded bg-rule" />
            <div className="h-1.5 w-[78%] rounded bg-rule" />
          </div>
        </div>
      </Plane>

      {/* 2. Plain-English editor: what the person wrote, so the caret is amber */}
      <Plane motion={layers[2]}>
        <div className="measured absolute left-[240px] right-0 top-9 h-[250px] px-4 py-3">
          {STEPS.map((line, i) => (
            <div key={i} className="flex text-[12px] leading-[1.85]">
              <span className="w-7 shrink-0 text-right text-muted">{i + 1}</span>
              <span className={`ml-4 whitespace-pre ${i === 0 ? 'text-ink' : 'text-ink-2'}`}>{line}</span>
              {i === STEPS.length - 1 && <span className="ml-0.5 inline-block h-[15px] w-[2px] translate-y-[5px] bg-accent" />}
            </div>
          ))}
        </div>
      </Plane>

      {/* 3. Technique and complexity: what the checker measured, so the readings are cool */}
      <Plane motion={layers[3]}>
        <div className="measured absolute left-[240px] right-0 top-[286px] flex h-10 items-center gap-5 border-y border-rule bg-paper-3 px-4 text-[11px]">
          <span className="text-muted">
            Technique <span className="text-cool">hash map lookup</span>
          </span>
          <span className="text-muted">
            Time <span className="text-cool">O(n)</span>
          </span>
          <span className="text-muted">
            Space <span className="text-cool">O(n)</span>
          </span>
        </div>
      </Plane>

      {/* 4. Test cases */}
      <Plane motion={layers[4]}>
        <div className="measured absolute bottom-0 left-[240px] right-0 top-[326px] px-4 py-2.5 text-[11px]">
          {[
            ['nums = [2,7,11,15], target = 9', '[0, 1]'],
            ['nums = [3,2,4], target = 6', '[1, 2]'],
            ['nums = [3,3], target = 6', '[0, 1]'],
          ].map(([input, out]) => (
            <div key={input} className="flex items-center gap-3 leading-[1.95]">
              <span className="text-ok">pass</span>
              <span className="text-ink-2">{input}</span>
              <span className="ml-auto text-muted">{out}</span>
            </div>
          ))}
        </div>
      </Plane>

      {/* 5. Logic review card */}
      <Plane motion={layers[5]}>
        <div className="absolute right-5 top-[58px] w-[200px] rounded-card border border-rule-2 bg-paper-2 p-3.5">
          <div className="text-[11px] font-medium text-ink">Logic review</div>
          <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10.5px] text-muted">
            {['Correctness', 'Determinism', 'Efficiency', 'Brevity'].map((k) => (
              <div key={k}>{k}</div>
            ))}
          </div>
          <div className="mt-3 space-y-1.5 border-t border-rule pt-2.5" aria-hidden>
            <div className="h-1.5 w-[92%] rounded bg-rule" />
            <div className="h-1.5 w-[76%] rounded bg-rule" />
            <div className="h-1.5 w-[84%] rounded bg-rule" />
          </div>
        </div>
      </Plane>
    </motion.div>
  );
};
