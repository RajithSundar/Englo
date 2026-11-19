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
import { ArrowRight, ChevronDown, Moon, Network, Sun } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { PROBLEMS } from '../../data/problems';
import { SplineIDE } from './SplineIDE';
import { IDE_HEIGHT, IDE_WIDTH, LayerMotion } from './IDEModel3D';

/* ------------------------------------------------------------------ */
/* Look: pure black ground, pale ink, one neon-blue accent.           */
/* ------------------------------------------------------------------ */

const SANS = "'Host Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif";
const MONO = "'Atkinson Hyperlegible Mono', 'JetBrains Mono', ui-monospace, monospace";

/** Callouts for the exploded IDE, one per plane, in plane order (back to front). */
const CALLOUTS: { layer: number; side: 'left' | 'right'; title: string; body: string }[] = [
  {
    layer: 0,
    side: 'left',
    title: 'One workspace',
    body: 'The problem, your answer, the review and the tests sit side by side, so you never leave the page to check your work.',
  },
  {
    layer: 1,
    side: 'right',
    title: 'Problem statement',
    body: 'Each problem gives the task, worked examples, constraints and hints.',
  },
  {
    layer: 2,
    side: 'left',
    title: 'Plain-English editor',
    body: 'Write prose, bullet points, numbered steps or pseudocode. There is no syntax to get wrong.',
  },
  {
    layer: 3,
    side: 'right',
    title: 'Technique and complexity',
    body: 'The review names the technique your steps use and what they cost in time and space.',
  },
  {
    layer: 4,
    side: 'left',
    title: 'Test cases',
    body: "Your steps are checked against the problem's test cases, each marked pass or fail with a reason.",
  },
  {
    layer: 5,
    side: 'right',
    title: 'Logic review',
    body: 'Scores correctness, determinism, efficiency and brevity, and says in plain words what to fix.',
  },
];

/** Exploded-view camera angle (degrees). Used to place callouts beside their plane. */
const EXPLODED_RX = 56;
const SIN_RX = Math.sin((EXPLODED_RX * Math.PI) / 180);
const SCENE_VH = 600; // height of the scroll-driven section, in vh

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
      className="pointer-events-none absolute w-[260px] -translate-y-1/2"
      style={{ top, opacity, ...(left ? { right: 'calc(50% + 250px)' } : { left: 'calc(50% + 250px)' }) }}
    >
      <div className={left ? 'text-left' : 'text-left'}>
        <div className="text-[15px] font-medium text-ink">{c.title}</div>
        <p className="mt-1.5 text-[13px] leading-[1.55] text-muted">{c.body}</p>
      </div>
      {/* Leader line toward the model */}
      <motion.span
        aria-hidden
        className="absolute top-[11px] h-px w-[150px] bg-gradient-to-r from-accent/0 via-accent/70 to-accent"
        style={{
          scaleX: lineScale,
          transformOrigin: left ? 'left' : 'right',
          ...(left
            ? { left: '100%', marginLeft: 12 }
            : { right: '100%', marginRight: 12, rotate: 180 }),
        }}
      />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */

const SECTIONS = [
  { id: 'top', label: 'Start' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'advantage', label: 'Inside the editor' },
  { id: 'architecture', label: 'System design' },
  { id: 'problem-catalog', label: 'Problems' },
];

const DotNav: React.FC = () => {
  const [active, setActive] = useState('top');
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = window.scrollY + window.innerHeight * 0.4;
        let current = 'top';
        for (const s of SECTIONS) {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top + window.scrollY <= mid) current = s.id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <nav aria-label="Sections" className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3.5 lg:flex">
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={s.label}
          aria-current={active === s.id ? 'true' : undefined}
          className="group relative flex h-3 w-3 items-center justify-center"
        >
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === s.id
                ? 'h-2.5 w-2.5 border border-accent shadow-glow-1'
                : 'h-1 w-1 bg-muted group-hover:bg-ink'
            }`}
          />
          <span className="pointer-events-none absolute right-5 whitespace-nowrap text-[12px] text-muted opacity-0 transition-opacity group-hover:opacity-100">
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  );
};

/* ------------------------------------------------------------------ */

const ArchitecturePlate: React.FC = () => {
  const nodes = [
    { label: 'Clients', x: 40, y: 40 },
    { label: 'API gateway', x: 220, y: 40 },
    { label: 'App servers', x: 220, y: 170 },
    { label: 'Redis cache', x: 40, y: 170 },
    { label: 'SQL database', x: 220, y: 300 },
  ];
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-[460px] max-sm:scale-[0.78]" style={{ perspective: 1400 }}>
      <div
        className="absolute left-1/2 top-1/2 h-[380px] w-[380px] rounded-2xl border border-rule bg-ink/[0.02]"
        style={{ transform: 'translate(-50%, -50%) rotateX(56deg) rotateZ(-34deg)', transformStyle: 'preserve-3d' }}
      >
        <svg className="absolute inset-0" width="380" height="380" aria-hidden>
          {[
            [100, 58, 280, 58],
            [280, 58, 280, 188],
            [280, 188, 100, 188],
            [280, 188, 280, 318],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00C8FF" strokeOpacity="0.6" strokeWidth="1.5" />
          ))}
        </svg>
        {nodes.map((n, i) => (
          <div
            key={n.label}
            className={`absolute flex h-9 w-[120px] items-center justify-center rounded-lg border bg-paper-2 text-[12px] ${
              i === 2
                ? 'border-accent text-ink shadow-glow-1'
                : 'border-rule text-ink-2'
            }`}
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
  const { setActiveView, setActiveProblem, openAuth, authenticatedUser, isDarkMode, toggleDarkMode } = usePlatformStore();
  const narrow = useIsNarrow();
  const reduceMotion = useReducedMotion();
  const [catalogFilter, setCatalogFilter] = useState<'all' | 'algorithm' | 'system_design'>('all');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
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
    narrow ? [0.46, 0.46, 0.42, 0.42] : [1, 0.94, 0.68, 0.68]
  );
  const modelX = useTransform(p, [0, TURN_START, TURN_END, 1], narrow ? ['0vw', '0vw', '0vw', '0vw'] : ['20vw', '22vw', '0vw', '0vw']);
  const modelY = useTransform(p, [0, TURN_START, TURN_END, 1], narrow ? ['27vh', '27vh', '4vh', '4vh'] : ['0vh', '0vh', '2vh', '2vh']);

  // On narrow screens the model sits under the text, so dim it while chapter 2 is read.
  const modelOpacity = useTransform(p, [0.18, 0.23, 0.41, 0.46], narrow ? [1, 0.12, 0.12, 1] : [1, 1, 1, 1]);
  const heroOpacity = useTransform(p, [0, 0.1, 0.17], [1, 1, 0]);
  const heroY = useTransform(p, [0, 0.17], [0, -60]);
  const heroPointer = useTransform(heroOpacity, (o) => (o > 0.3 ? 'auto' : 'none'));
  const guideOpacity = useTransform(p, [0.2, 0.26, 0.4, 0.46], [0, 1, 1, 0]);
  const guideY = useTransform(p, [0.2, 0.26, 0.4, 0.46], [40, 0, 0, -40]);
  const guidePointer = useTransform(guideOpacity, (o) => (o > 0.3 ? 'auto' : 'none'));
  const insideOpacity = useTransform(p, [TURN_END, PEEL_START + 0.02], [0, 1]);
  const cueOpacity = useTransform(p, [0, 0.05], [1, 0]);

  const filtered = PROBLEMS.filter((x) => catalogFilter === 'all' || x.category === catalogFilter);

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-paper text-ink antialiased"
      style={{ fontFamily: SANS }}
    >
      {/* ---------------- Top bar ---------------- */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled ? 'border-b border-rule bg-paper/70 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-6 px-5 md:px-10">
          <a href="#top" aria-label="Englo, back to top" className="text-[19px] font-medium tracking-[-0.01em]">
            Englo
          </a>
          <nav aria-label="Primary" className="ml-auto hidden items-center gap-8 text-[13.5px] text-ink-2 md:flex">
            <a href="#how-it-works" className="hover:text-ink">How it works</a>
            <a href="#advantage" className="hover:text-ink">Inside the editor</a>
            <a href="#architecture" className="hover:text-ink">System design</a>
            <button id="landing-nav-learn" onClick={() => setActiveView('learn')} className="hover:text-ink">
              Learn
            </button>
            <button id="landing-nav-ledger" onClick={() => setActiveView('dashboard')} className="hover:text-ink">
              Problems
            </button>
          </nav>
          <div className="ml-auto flex items-center gap-4 md:ml-8">
            <button
              onClick={toggleDarkMode}
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              className="btn-icon h-8 w-8"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {authenticatedUser ? (
              <button onClick={() => setActiveView('dashboard')} className="text-[13.5px] text-ink-2 hover:text-ink">
                {authenticatedUser.name || authenticatedUser.handle}
              </button>
            ) : (
              <button onClick={() => openAuth('login')} className="text-[13.5px] text-ink-2 hover:text-ink">
                Sign in
              </button>
            )}
            <button
              id="landing-start-free-btn"
              onClick={() => startProblem('algo-1')}
              className="rounded-full border border-rule-2 px-4 py-1.5 text-[13px] text-ink transition hover:border-accent hover:shadow-glow-1"
            >
              Try Two Sum
            </button>
          </div>
        </div>
      </header>

      <DotNav />

      {/* ---------------- Scroll-driven scene ---------------- */}
      <section ref={sceneRef} id="top" className="relative" style={{ height: reduceMotion ? 'auto' : `${SCENE_VH}vh` }}>
        {/* Anchors for in-page links, placed where each chapter is fully shown. */}
        {!reduceMotion && (
          <>
            <span id="how-it-works" className="absolute left-0" style={{ top: `${(SCENE_VH - 100) * 0.33}vh` }} />
            <span id="advantage" className="absolute left-0" style={{ top: `${(SCENE_VH - 100) * (PEEL_DONE + 0.02)}vh` }} />
          </>
        )}

        <div className={`${reduceMotion ? 'relative' : 'sticky top-0'} h-screen min-h-[640px] overflow-hidden`}>
          {/* Faint neon light falling into the black */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(48% 42% at 68% 46%, color-mix(in oklab, var(--accent) 7%, transparent) 0%, color-mix(in oklab, var(--accent) 3.5%, transparent) 35%, color-mix(in oklab, var(--accent) 1.2%, transparent) 65%, transparent 100%)',
            }}
          />

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
              <motion.div className="h-full w-full" animate={reduceMotion ? undefined : { y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
                <SplineIDE rotateX={rotateX} rotateY={rotateY} rotateZ={rotateZ} layers={layers} progress={p} />
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="relative mx-auto h-full max-w-[1320px] px-5 md:px-10">
            {/* Chapter 1: hero */}
            {!reduceMotion && (
              <motion.div
                className={`absolute left-5 right-5 md:left-10 ${narrow ? 'top-[11vh]' : 'top-1/2 -translate-y-1/2'} max-w-[560px]`}
                style={{ opacity: heroOpacity, y: heroY, pointerEvents: heroPointer as any }}
              >
                <HeroCopy narrow={narrow} onStart={() => startProblem('algo-1')} onBrowse={() => setActiveView('dashboard')} />
              </motion.div>
            )}

            {/* Chapter 2: the idea */}
            {!reduceMotion && (
              <motion.div
                className={`absolute left-5 right-5 md:left-10 ${narrow ? 'top-[14vh]' : 'top-1/2 -translate-y-1/2'} max-w-[440px]`}
                style={{ opacity: guideOpacity, y: guideY, pointerEvents: guidePointer as any }}
              >
                <GuideCopy onStart={() => startProblem('algo-1')} />
              </motion.div>
            )}

            {/* Chapter 3: the exploded IDE */}
            <motion.div className="absolute left-5 top-[96px] md:left-10" style={{ opacity: insideOpacity }}>
              <h2 className="text-[22px] font-medium leading-[1.15] tracking-[-0.01em] md:text-[26px]">
                Inside
                <br />
                the workspace
              </h2>
            </motion.div>

            {!narrow &&
              CALLOUTS.map((c) => (
                <Callout key={c.title} c={c} progress={p} layer={layers[c.layer]} shift={stackShift} scale={modelScale} />
              ))}
          </div>

          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-[12px] text-muted"
              style={{ opacity: cueOpacity }}
            >
              Scroll
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </motion.div>
          )}
        </div>
      </section>

      {/* Reduced motion: chapters as plain blocks */}
      {reduceMotion && (
        <section className="mx-auto max-w-[1320px] space-y-20 px-5 py-20 md:px-10">
          <HeroCopy narrow={narrow} onStart={() => startProblem('algo-1')} onBrowse={() => setActiveView('dashboard')} />
          <div id="how-it-works">
            <GuideCopy onStart={() => startProblem('algo-1')} />
          </div>
        </section>
      )}

      {/* Callouts as a list on narrow screens (and with reduced motion) */}
      {(narrow || reduceMotion) && (
        <section id={reduceMotion ? 'advantage' : undefined} className="mx-auto max-w-[1320px] px-5 pb-8 pt-4 md:px-10">
          <ol className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {CALLOUTS.map((c) => (
              <li key={c.title} className="border-l border-accent/60 pl-4">
                <div className="text-[15px] font-medium">{c.title}</div>
                <p className="mt-1 text-[14px] leading-[1.55] text-muted">{c.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---------------- System design ---------------- */}
      <section id="architecture" className="border-t border-rule">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-24 md:grid-cols-2 md:px-10 md:py-32">
          <ArchitecturePlate />
          <div className="max-w-[460px]">
            <Marker />
            <h2 className="text-[32px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[40px]">
              Design systems on a canvas.
            </h2>
            <p className="mt-5 text-[16px] leading-[1.6] text-muted">
              Drag clients, gateways, load balancers, servers, caches and databases onto a canvas, connect them, then run
              the problem's scenarios against your design.
            </p>
            <button
              onClick={() => startProblem('sys-1')}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-rule-2 px-5 py-2.5 text-[14px] transition hover:border-accent hover:shadow-glow-1"
            >
              <Network className="h-4 w-4 text-accent" />
              Open the URL shortener design
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Problems ---------------- */}
      <section id="problem-catalog" className="border-t border-rule">
        <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Marker />
              <h2 className="text-[32px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[40px]">
                {PROBLEMS.length} problems to start with.
              </h2>
              <p className="mt-4 max-w-[520px] text-[16px] leading-[1.6] text-muted">
                Classic algorithm questions and system design rounds, from Two Sum to a payment ledger.
              </p>
            </div>
            <div role="tablist" aria-label="Filter problems" className="flex rounded-full border border-rule p-1 text-[13px]">
              {(
                [
                  ['all', 'All'],
                  ['algorithm', 'Algorithms'],
                  ['system_design', 'System design'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={catalogFilter === key}
                  onClick={() => setCatalogFilter(key)}
                  className={`rounded-full px-4 py-1.5 transition ${
                    catalogFilter === key
                      ? 'bg-accent/15 text-ink shadow-[inset_0_0_0_1px_var(--accent)]'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-12 border-t border-rule">
            {filtered.map((prob, i) => (
              <li key={prob.id}>
                <button
                  onClick={() => startProblem(prob.id)}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-rule py-4 text-left transition hover:bg-ink/[0.03] md:grid-cols-[3rem_1fr_10rem_6rem_1.5rem]"
                >
                  <span className="text-[12px] text-muted" style={{ fontFamily: MONO }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] text-ink md:text-[16px]">{prob.title}</span>
                  <span className="hidden text-[13px] text-muted md:block">
                    {prob.category === 'algorithm' ? 'Algorithm' : 'System design'}
                  </span>
                  <span
                    className={`text-[13px] ${
                      prob.difficulty === 'Easy'
                        ? 'text-ok'
                        : prob.difficulty === 'Medium'
                          ? 'text-ink-2'
                          : 'text-bad'
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                  <ArrowRight className="hidden h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent md:block" />
                </button>
              </li>
            ))}
          </ul>

          <details className="group mt-16 max-w-[720px] border-t border-rule pt-6">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] text-ink-2 hover:text-ink">
              How answers are checked, and the limits
              <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
            </summary>
            <div className="mt-4 space-y-3 text-[14.5px] leading-[1.65] text-muted">
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

      {/* ---------------- Closing ---------------- */}
      <section className="border-t border-rule">
        <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-32">
          <h2 className="text-[36px] font-medium leading-[1.05] tracking-[-0.025em] md:text-[56px]">Start with one problem.</h2>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <PrimaryButton onClick={() => startProblem('algo-1')}>Start with Two Sum</PrimaryButton>
            <button onClick={() => openAuth('register')} className="text-[14px] text-ink-2 hover:text-ink">
              Create an account
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-5 py-8 text-[13px] text-muted md:px-10">
          <span>© 2026 Englo Studio</span>
          <div className="flex gap-6">
            <a href="#how-it-works" className="hover:text-ink">How it works</a>
            <a href="#architecture" className="hover:text-ink">System design</a>
            <a href="#problem-catalog" className="hover:text-ink">Problems</a>
            <button onClick={() => setActiveView('learn')} className="hover:text-ink">Learn</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const Marker: React.FC = () => (
  <span aria-hidden className="mb-6 block h-[3px] w-10 rounded-full bg-accent shadow-glow-1" />
);

const PrimaryButton: React.FC<{ onClick: () => void; id?: string; children: React.ReactNode }> = ({ onClick, id, children }) => (
  <button
    id={id}
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-[15px] font-medium text-accent-ink shadow-glow-2 transition hover:bg-accent-hi hover:shadow-glow-3 active:scale-[0.98]"
  >
    {children}
  </button>
);

const HeroCopy: React.FC<{ narrow: boolean; onStart: () => void; onBrowse: () => void }> = ({ narrow, onStart, onBrowse }) => (
  <div>
    <h1 className="text-[46px] font-medium leading-[1.02] tracking-[-0.035em] sm:text-[64px] lg:text-[84px]">
      Solve it in
      <br />
      plain English.
    </h1>
    <p className="mt-6 max-w-[420px] text-[16px] leading-[1.6] text-ink-2 md:text-[17px]">
      LeetCode-style problems for people who think in steps, not syntax. Write your approach as pseudocode and get
      feedback on the logic.
    </p>
    <div className={`mt-9 flex ${narrow ? 'flex-col items-start' : 'items-center'} gap-5`}>
      <PrimaryButton onClick={onStart}>
        Start with Two Sum
        <ArrowRight className="h-4 w-4" />
      </PrimaryButton>
      <button id="hero-btn-explore-ledger" onClick={onBrowse} className="text-[14.5px] text-ink-2 underline-offset-4 hover:text-ink hover:underline">
        Browse all {PROBLEMS.length} problems
      </button>
    </div>
  </div>
);

const GuideCopy: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div>
    <Marker />
    <h2 className="text-[30px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[38px]">
      Practice the thinking,
      <br />
      not the typing.
    </h2>
    <p className="mt-5 text-[15.5px] leading-[1.65] text-muted">
      Interviews test whether you can find the right idea and explain it. Englo lets you answer in structured steps:
      what you keep track of, how each step moves you forward, and when you stop.
    </p>
    <p className="mt-3 text-[15.5px] leading-[1.65] text-muted">
      Each answer is reviewed for correctness, edge cases and complexity, so you learn where your reasoning breaks
      before an interviewer finds it.
    </p>
    <button
      onClick={onStart}
      className="mt-7 inline-flex items-center gap-2 rounded-full border border-rule-2 px-5 py-2.5 text-[14px] transition hover:border-accent hover:shadow-glow-1"
    >
      Try it on Two Sum
    </button>
  </div>
);
