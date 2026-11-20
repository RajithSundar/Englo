import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import { SolvedBadge } from '../SolvedBadge';
import { usePlatformStore } from '../../store/usePlatformStore';
import { PROBLEMS } from '../../data/problems';
import { SplineIDE } from './SplineIDE';
import { IDE_HEIGHT, IDE_WIDTH, LayerMotion } from './IDEModel3D';

/* ------------------------------------------------------------------ */
/* Look: Console (src/styles/console.css), scoped to this page.        */
/* ------------------------------------------------------------------ */

/** Callouts for the exploded IDE, one per plane, in plane order (back to front). */
const CALLOUTS: { layer: number; side: 'left' | 'right'; title: string; body: string }[] = [
  { layer: 0, side: 'left', title: 'One workspace', body: 'Problem, answer, review and tests on one page.' },
  { layer: 1, side: 'right', title: 'Problem statement', body: 'The task, worked examples, constraints and hints.' },
  { layer: 2, side: 'left', title: 'Plain-English editor', body: 'Prose, bullets or pseudocode. No syntax to get wrong.' },
  { layer: 3, side: 'right', title: 'Technique and complexity', body: 'The technique your steps use, and its time and space cost.' },
  { layer: 4, side: 'left', title: 'Test cases', body: 'Each case marked pass or fail, with a reason.' },
  { layer: 5, side: 'right', title: 'Logic review', body: 'Scores correctness, efficiency and more, and says what to fix.' },
];

/** Exploded-view camera angle (degrees). Used to place callouts beside their plane. */
const EXPLODED_RX = 56;
const SIN_RX = Math.sin((EXPLODED_RX * Math.PI) / 180);
const SCENE_VH = 600; // height of the scroll-driven section, in dvh

/*
 * The breakdown. The IDE turns to the exploded camera angle as one piece
 * (TURN_START..TURN_END), then the layers lift off it one at a time, front to
 * back. The window frame (layer 0) stays put as the base. Each callout appears
 * once its layer has lifted off; the frame's callout comes last.
 */
const TURN_START = 0.46;
const TURN_END = 0.58;
const PEEL_ORDER = [5, 4, 3, 2, 1];
const PEEL_START = 0.6;
const PEEL_STEP = 0.065;
const PEEL_LEN = 0.05;
const STACKED_GAP = 1.5; // px between planes while the IDE is whole

/** Scroll window in which a layer lifts off; the frame's is when its callout shows. */
const peelWindow = (layer: number): [number, number] => {
  const k = PEEL_ORDER.indexOf(layer);
  const start = PEEL_START + (k < 0 ? PEEL_ORDER.length : k) * PEEL_STEP;
  return [start, start + PEEL_LEN];
};
const PEEL_DONE = peelWindow(0)[1];

const useLayerMotion = (p: MotionValue<number>, layer: number, gap: number): LayerMotion => {
  const [a, b] = peelWindow(layer);
  const z = useTransform(p, [a, b], layer === 0 ? [0, 0] : [layer * STACKED_GAP, layer * gap]);
  // The frame's sheet shows as soon as the first layer leaves it.
  const sheet = useTransform(p, layer === 0 ? [PEEL_START, PEEL_START + PEEL_LEN] : [a, b], [0, 1]);
  return { z, sheet };
};

const useIsNarrow = () => {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)').matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return narrow;
};

/* ------------------------------------------------------------------ */

const Callout: React.FC<{
  c: (typeof CALLOUTS)[number];
  progress: MotionValue<number>;
  layer: LayerMotion;
  /** How far the whole model is moved down to keep the stack centred (local px). */
  shift: MotionValue<number>;
  scale: MotionValue<number>;
}> = ({ c, progress, layer, shift, scale }) => {
  // Appears as its layer finishes lifting off.
  const [, end] = peelWindow(c.layer);
  const start = end - 0.025;
  const opacity = useTransform(progress, [start, start + 0.03], [0, 1]);
  const lineScale = useTransform(progress, [start, start + 0.04], [0, 1]);
  // Vertical position of the plane on screen at the exploded camera angle.
  const y = useTransform([layer.z, shift, scale] as MotionValue<number>[], ([z, sh, k]: number[]) => (sh - SIN_RX * z) * k);
  const top = useMotionTemplate`calc(50% + ${y}px)`;
  const left = c.side === 'left';
  return (
    <motion.div
      className="pointer-events-none absolute w-[250px] -translate-y-1/2"
      style={{ top, opacity, ...(left ? { right: 'calc(50% + 250px)' } : { left: 'calc(50% + 250px)' }) }}
    >
      <div className="text-[15px] font-medium text-ink">{c.title}</div>
      <p className="mt-1 text-[14px] leading-[1.5] text-muted">{c.body}</p>
      {/* Leader line toward the model */}
      <motion.span
        aria-hidden
        className="absolute top-[11px] h-px w-[150px] bg-rule-2"
        style={{
          scaleX: lineScale,
          transformOrigin: left ? 'left' : 'right',
          ...(left ? { left: '100%', marginLeft: 12 } : { right: '100%', marginRight: 12 }),
        }}
      />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */

/** The canvas, drawn: the five parts of the URL shortener's starting design. */
const ArchitecturePlate: React.FC = () => {
  const nodes = [
    { label: 'Clients', x: 40, y: 40 },
    { label: 'API gateway', x: 220, y: 40 },
    { label: 'App servers', x: 220, y: 170 },
    { label: 'Redis cache', x: 40, y: 170 },
    { label: 'SQL database', x: 220, y: 300 },
  ];
  return (
    <div
      role="img"
      aria-label="System design diagram: clients, API gateway, app servers, Redis cache and SQL database"
      className="architecture-diagram relative mx-auto h-[400px] w-full max-w-[520px] max-sm:scale-[0.78]"
      style={{ perspective: 1400 }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-[380px] w-[380px] rounded-card border border-rule bg-paper-2"
        style={{ transform: 'translate(-50%, -50%) rotateX(56deg) rotateZ(-34deg)', transformStyle: 'preserve-3d' }}
      >
        <svg className="absolute inset-0 text-rule-2" width="380" height="380" aria-hidden>
          {[
            [100, 58, 280, 58],
            [280, 58, 280, 188],
            [280, 188, 100, 188],
            [280, 188, 280, 318],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" />
          ))}
        </svg>
        {nodes.map((n) => (
          <div
            key={n.label}
            className="absolute flex h-9 w-[120px] items-center justify-center rounded-pill border border-rule-2 bg-paper-3 text-[12px] text-ink-2"
            style={{ left: n.x, top: n.y, transform: 'translateZ(18px)' }}
          >
            {n.label}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

export const LandingPage: React.FC = () => {
  const { setActiveView, setActiveProblem, openAuth, authenticatedUser, isDarkMode, toggleDarkMode, solvedProblemIds } = usePlatformStore();
  const narrow = useIsNarrow();
  const reduceMotion = useReducedMotion();
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'algorithm' | 'system_design'>('all');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const startProblem = (problemId: string) => {
    const p = PROBLEMS.find((x) => x.id === problemId);
    setActiveProblem(problemId);
    setActiveView(p?.category === 'system_design' ? 'system_design_workspace' : 'algo_workspace');
  };

  /* ---------- scroll choreography ---------- */
  const sceneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sceneRef, offset: ['start start', 'end end'] });
  // With reduced motion, jump straight to the exploded view and keep everything still.
  const fixed = useMotionValue(1);
  // Pass progress through a plain function so Motion drives every value from
  // JavaScript. Fed straight from useScroll, Motion hands opacity to a native
  // ViewTimeline whose range ignores this section's offsets.
  const live = useTransform(scrollYProgress, (v: number) => v);
  const p = reduceMotion ? fixed : live;

  const keys = [0, 0.2, TURN_START, TURN_END, 1];
  const rotateX = useTransform(p, keys, [18, 12, 10, EXPLODED_RX, EXPLODED_RX]);
  const rotateY = useTransform(p, keys, [-30, -38, -22, 0, 0]);
  const rotateZ = useTransform(p, keys, [6, 9, 4, -32, -32]);
  const gap = narrow ? 70 : 118;
  const layers = [
    useLayerMotion(p, 0, gap),
    useLayerMotion(p, 1, gap),
    useLayerMotion(p, 2, gap),
    useLayerMotion(p, 3, gap),
    useLayerMotion(p, 4, gap),
    useLayerMotion(p, 5, gap),
  ];
  // Move the model down while it turns, so the finished stack (frame at the
  // bottom, five layers above) ends up centred.
  const stackShift = useTransform(p, [TURN_START, TURN_END], [0, SIN_RX * 2.5 * gap]);
  const modelScale = useTransform(
    p,
    [0, TURN_START, TURN_END, 1],
    narrow ? [0.46, 0.46, 0.42, 0.42] : [0.94, 0.9, 0.66, 0.66]
  );
  const modelX = useTransform(p, [0, TURN_START, TURN_END, 1], narrow ? ['0vw', '0vw', '0vw', '0vw'] : ['20vw', '22vw', '0vw', '0vw']);
  const modelY = useTransform(p, [0, TURN_START, TURN_END, 1], narrow ? ['26dvh', '26dvh', '4dvh', '4dvh'] : ['0dvh', '0dvh', '2dvh', '2dvh']);

  // On narrow screens the model sits under the text, so dim it while chapter 2 is read.
  const modelOpacity = useTransform(p, [0.18, 0.23, 0.41, 0.46], narrow ? [1, 0.12, 0.12, 1] : [1, 1, 1, 1]);
  const heroOpacity = useTransform(p, [0, 0.1, 0.17], [1, 1, 0]);
  const heroY = useTransform(p, [0, 0.17], [0, -48]);
  const heroPointer = useTransform(heroOpacity, (o) => (o > 0.3 ? 'auto' : 'none'));
  const guideOpacity = useTransform(p, [0.2, 0.26, 0.4, 0.46], [0, 1, 1, 0]);
  const guideY = useTransform(p, [0.2, 0.26, 0.4, 0.46], [32, 0, 0, -32]);
  const guidePointer = useTransform(guideOpacity, (o) => (o > 0.3 ? 'auto' : 'none'));
  const insideOpacity = useTransform(p, [TURN_END, PEEL_START + 0.02], [0, 1]);

  const filtered = PROBLEMS.filter((x) => catalogFilter === 'all' || x.category === catalogFilter);

  return (
    <div
      data-theme="console"
      data-mode={isDarkMode ? 'dark' : 'light'}
      className="theme-console relative min-h-dvh overflow-x-clip bg-paper antialiased"
    >
      {/* ---------------- Nav: wordmark, two destinations, one action ---------------- */}
      <header
        className={`sticky top-0 z-[300] border-b bg-paper transition-colors duration-200 ${
          scrolled ? 'border-rule' : 'border-transparent'
        }`}
      >
        <div className="c-container flex h-16 items-center gap-6">
          <a href="#top" aria-label="Englo, back to top" className="wordmark text-[18px] text-ink no-underline">
            Englo
          </a>
          <nav aria-label="Primary" className="ml-auto hidden items-center gap-8 text-[15px] md:flex">
            <button id="landing-nav-ledger" type="button" onClick={() => setActiveView('dashboard')} className="c-quiet">
              Problems
            </button>
            <button id="landing-nav-learn" type="button" onClick={() => setActiveView('learn')} className="c-quiet">
              Learn
            </button>
          </nav>
          <div className="ml-auto flex items-center gap-4 md:ml-6">
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              className="c-btn c-btn--sm px-0 w-9"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {authenticatedUser ? (
              <button type="button" onClick={() => setActiveView('dashboard')} className="c-quiet text-[15px]">
                {authenticatedUser.name || authenticatedUser.handle}
              </button>
            ) : (
              <button type="button" onClick={() => openAuth('login')} className="c-quiet text-[15px]">
                Sign in
              </button>
            )}
            <button id="landing-start-free-btn" type="button" onClick={() => startProblem('algo-1')} className="c-btn c-btn--sm">
              Try Two Sum
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- Scroll-driven scene ---------------- */}
      <section ref={sceneRef} id="top" className="relative" style={{ height: reduceMotion ? 'auto' : `${SCENE_VH}dvh` }}>
        {/* Anchors for in-page links, placed where each chapter is fully shown. */}
        {!reduceMotion && (
          <>
            <span id="how-it-works" className="absolute left-0" style={{ top: `${(SCENE_VH - 100) * 0.33}dvh` }} />
            <span id="advantage" className="absolute left-0" style={{ top: `${(SCENE_VH - 100) * (PEEL_DONE + 0.02)}dvh` }} />
          </>
        )}

        <div
          className={`${reduceMotion ? 'relative' : 'sticky'} min-h-[600px] overflow-hidden`}
          style={{ top: 'var(--nav-h)', height: 'calc(100dvh - var(--nav-h))' }}
        >
          {/* The 3D IDE */}
          <motion.div
            className="absolute left-1/2 top-1/2"
            style={{
              x: modelX,
              y: modelY,
              translateX: '-50%',
              translateY: '-50%',
              scale: modelScale,
              opacity: modelOpacity,
              width: IDE_WIDTH,
              height: IDE_HEIGHT,
            }}
            aria-hidden
          >
            <motion.div className="h-full w-full" style={{ y: stackShift }}>
              <SplineIDE rotateX={rotateX} rotateY={rotateY} rotateZ={rotateZ} layers={layers} progress={p} />
            </motion.div>
          </motion.div>

          <div className="c-container relative h-full">
            {/* Chapter 1: hero */}
            {!reduceMotion && (
              <motion.div
                className={`absolute inset-x-[var(--gutter)] ${narrow ? 'top-[8dvh]' : 'top-1/2 -translate-y-1/2'} max-w-[34rem]`}
                style={{ opacity: heroOpacity, y: heroY, pointerEvents: heroPointer as any }}
              >
                <HeroCopy narrow={narrow} onStart={() => startProblem('algo-1')} onBrowse={() => setActiveView('dashboard')} />
              </motion.div>
            )}

            {/* Chapter 2: the idea */}
            {!reduceMotion && (
              <motion.div
                className={`absolute inset-x-[var(--gutter)] ${narrow ? 'top-[10dvh]' : 'top-1/2 -translate-y-1/2'} max-w-[30rem]`}
                style={{ opacity: guideOpacity, y: guideY, pointerEvents: guidePointer as any }}
              >
                <GuideCopy />
              </motion.div>
            )}

            {/* Chapter 3: the exploded IDE */}
            <motion.div className="absolute left-[var(--gutter)] top-10" style={{ opacity: insideOpacity }}>
              <h2 className="text-title">Inside the workspace</h2>
            </motion.div>

            {!narrow &&
              CALLOUTS.map((c) => (
                <Callout key={c.title} c={c} progress={p} layer={layers[c.layer]} shift={stackShift} scale={modelScale} />
              ))}
          </div>
        </div>
      </section>

      {/* Reduced motion: chapters as plain blocks */}
      {reduceMotion && (
        <section className="c-container space-y-20 py-20">
          <HeroCopy narrow={narrow} onStart={() => startProblem('algo-1')} onBrowse={() => setActiveView('dashboard')} />
          <div id="how-it-works">
            <GuideCopy />
          </div>
        </section>
      )}

      {/* Callouts as a list on narrow screens (and with reduced motion) */}
      {(narrow || reduceMotion) && (
        <section id={reduceMotion ? 'advantage' : undefined} className="c-container pb-8 pt-4">
          <ol className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {CALLOUTS.map((c) => (
              <li key={c.title} className="border-t border-rule pt-4">
                <div className="text-[16px] font-medium text-ink">{c.title}</div>
                <p className="mt-1 text-[15px] leading-[1.55] text-muted">{c.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---------------- System design: a split ---------------- */}
      <section id="architecture" className="py-36 max-md:py-24">
        <div className="c-container grid items-center gap-16 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <h2>Design systems on a canvas.</h2>
            <p className="lead mt-6">Connect gateways, servers, caches and databases, then run the problem’s scenarios.</p>
            <button type="button" onClick={() => startProblem('sys-1')} className="c-btn mt-10 whitespace-nowrap">
              Open the URL shortener design
            </button>
          </div>
          <ArchitecturePlate />
        </div>
      </section>

      {/* ---------------- Problems: the index ---------------- */}
      <section id="problem-catalog" className="border-t border-rule py-32 max-md:py-20">
        <div className="c-container">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <h2>{PROBLEMS.length} problems to start with.</h2>
              <p className="lead mt-5">Classic algorithm questions and system design rounds, from Two Sum to a payment ledger.</p>
            </div>
            <div role="tablist" aria-label="Filter problems" className="c-seg">
              {(
                [
                  ['all', 'All'],
                  ['algorithm', 'Algorithms'],
                  ['system_design', 'System design'],
                ] as const
              ).map(([key, label]) => (
                <button key={key} type="button" role="tab" aria-selected={catalogFilter === key} onClick={() => setCatalogFilter(key)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-14 border-t border-rule">
            {filtered.map((prob, i) => (
              <li key={prob.id}>
                <button
                  type="button"
                  onClick={() => startProblem(prob.id)}
                  className="grid min-h-[64px] w-full grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-rule py-3 text-left transition-colors hover:bg-paper-2 md:grid-cols-[3.5rem_minmax(0,1fr)_11rem_6rem]"
                >
                  <span className="measured text-[14px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex min-w-0 items-center gap-3 text-[16px] text-ink md:text-[17px]">
                    <span className="min-w-0">{prob.title}</span>
                    {solvedProblemIds.includes(prob.id) && <SolvedBadge size="sm" />}
                  </span>
                  <span className="hidden text-[15px] text-muted md:block">
                    {prob.category === 'algorithm' ? 'Algorithm' : 'System design'}
                  </span>
                  <span className="text-[15px] text-muted">
                    {prob.difficulty}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <details className="group mt-16 max-w-[45rem] border-t border-rule pt-6">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between text-[16px] text-ink-2 hover:text-ink">
              How answers are checked, and the limits
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-4 space-y-3 text-[15px] leading-[1.65] text-muted">
              <p>
                When the server has Google Cloud credentials, Gemini 2.5 Flash on Vertex AI reads your steps and grades
                them. Without them, a local checker scores your answer against the patterns it expects for that problem.
              </p>
              <p>
                Either way you get feedback on your reasoning, not a formal proof that the algorithm is correct. Your
                progress is saved in this browser.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* ---------------- Close: the hero's action again, on a band ---------------- */}
      <section className="border-y border-rule bg-paper-2 py-28 max-md:py-20">
        <div className="c-container">
          <h2 className="display-s">Start with one problem.</h2>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <button type="button" onClick={() => startProblem('algo-1')} className="c-btn c-btn--primary">
              Start with Two Sum
            </button>
            <button type="button" onClick={() => openAuth('register')} className="c-quiet text-[15px]">
              Create an account
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Footer: a colophon ---------------- */}
      <footer>
        <div className="c-container flex flex-wrap items-center justify-between gap-6 py-10 text-[15px] text-muted">
          <span className="text-ink">Englo</span>
          <div className="flex gap-8">
            <button type="button" onClick={() => setActiveView('dashboard')} className="c-quiet">
              Problems
            </button>
            <button type="button" onClick={() => setActiveView('learn')} className="c-quiet">
              Learn
            </button>
          </div>
          <span>© 2026 Englo Studio</span>
        </div>
      </footer>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const HeroCopy: React.FC<{ narrow: boolean; onStart: () => void; onBrowse: () => void }> = ({ narrow, onStart, onBrowse }) => (
  <div>
    <h1>
      Solve it in
      <br />
      plain English.
    </h1>
    <p className="lead mt-6">Write your approach as pseudocode and get feedback on its logic.</p>
    <div className={`mt-10 flex ${narrow ? 'flex-col items-start' : 'items-center'} gap-6`}>
      <button type="button" onClick={onStart} className="c-btn c-btn--primary">
        Start with Two Sum
      </button>
      <button id="hero-btn-explore-ledger" type="button" onClick={onBrowse} className="c-link text-[15px]">
        Browse all {PROBLEMS.length} problems
      </button>
    </div>
  </div>
);

const GuideCopy: React.FC = () => (
  <div>
    <h2 className="display-s">Practice the thinking, not the typing.</h2>
    <p className="lead mt-6">Interviews test whether you find the right idea and can explain it.</p>
  </div>
);
