import React, { Suspense, useEffect, useRef, useState } from 'react';
import { motion, MotionValue, useMotionValueEvent } from 'motion/react';
import type { Application, SPEObject } from '@splinetool/runtime';
import { IDEModel3D, IDE_LAYERS, IDE_WIDTH, LayerMotion } from './IDEModel3D';

/**
 * The landing page's 3D IDE.
 *
 * If a Spline scene is configured (VITE_SPLINE_IDE_SCENE, the `.splinecode`
 * URL from Spline's Export -> Code panel), the scene is loaded with
 * @splinetool/react-spline and driven by the same scroll values as the
 * built-in model. Until it has loaded, or if it fails, or if no scene is
 * configured, the hand-built CSS 3D model is shown instead.
 *
 * Scene contract (names are case-sensitive):
 *   - a group named "IDE" holding the whole model; its rotation is set from scroll
 *   - six children named "Layer-0" .. "Layer-5" (frame, problem, editor,
 *     analysis, tests, review), stacked along the group's local Z axis;
 *     as each one lifts off, it is moved along Z from its authored position
 *   - optional Number variable "progress" (0..100), set on every scroll frame
 */

const SCENE_URL: string | undefined = (import.meta as any).env?.VITE_SPLINE_IDE_SCENE || undefined;
/** Spline scene units per CSS pixel of lift. Tune for your scene's scale. */
const SPLINE_UNITS_PER_PX = Number((import.meta as any).env?.VITE_SPLINE_IDE_SCALE) || 1;

const Spline = React.lazy(() => import('@splinetool/react-spline'));

interface SplineIDEProps {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  rotateZ: MotionValue<number>;
  layers: LayerMotion[];
  progress: MotionValue<number>;
}

const deg = (d: number) => (d * Math.PI) / 180;

export const SplineIDE: React.FC<SplineIDEProps> = ({ rotateX, rotateY, rotateZ, layers, progress }) => {
  const appRef = useRef<Application | null>(null);
  const groupRef = useRef<SPEObject | null>(null);
  const layersRef = useRef<{ obj: SPEObject; baseZ: number; index: number }[]>([]);
  const [splineReady, setSplineReady] = useState(false);
  const [splineFailed, setSplineFailed] = useState(false);

  const sync = () => {
    const app = appRef.current;
    if (!app) return;
    const g = groupRef.current;
    if (g) {
      g.rotation.x = deg(rotateX.get());
      g.rotation.y = deg(rotateY.get());
      g.rotation.z = deg(-rotateZ.get());
    }
    for (const l of layersRef.current) l.obj.position.z = l.baseZ + layers[l.index].z.get() * SPLINE_UNITS_PER_PX;
    try {
      app.setVariable('progress', Math.round(progress.get() * 1000) / 10);
    } catch {
      /* the scene has no "progress" variable: fine */
    }
  };

  useMotionValueEvent(progress, 'change', sync);

  useEffect(() => () => {
    appRef.current?.dispose();
    appRef.current = null;
  }, []);

  const handleLoad = (app: Application) => {
    appRef.current = app;
    groupRef.current = app.findObjectByName('IDE') ?? null;
    layersRef.current = IDE_LAYERS.flatMap((_, index) => {
      const obj = app.findObjectByName(`Layer-${index}`);
      return obj ? [{ obj, baseZ: obj.position.z, index }] : [];
    });
    sync();
    setSplineReady(true);
  };

  const showSpline = SCENE_URL && !splineFailed;

  return (
    <div className="relative" style={{ width: IDE_WIDTH, height: 450, perspective: 1800 }}>
      {showSpline && (
        <ErrorBoundary onError={() => setSplineFailed(true)}>
          <Suspense fallback={null}>
            <motion.div
              className="absolute -inset-[30%]"
              style={{ opacity: splineReady ? 1 : 0, transition: 'opacity 600ms ease' }}
            >
              <Spline scene={SCENE_URL!} onLoad={handleLoad} style={{ width: '100%', height: '100%' }} />
            </motion.div>
          </Suspense>
        </ErrorBoundary>
      )}

      {!splineReady && (
        <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
          <IDEModel3D rotateX={rotateX} rotateY={rotateY} rotateZ={rotateZ} layers={layers} />
        </motion.div>
      )}

      {splineReady && (
        <a
          href="https://spline.design"
          target="_blank"
          rel="noopener"
          className="absolute -bottom-10 right-0 text-[11px] text-muted hover:text-ink"
        >
          Made with Spline
        </a>
      )}
    </div>
  );
};

type BoundaryProps = { onError: () => void; children: React.ReactNode };

class ErrorBoundary extends React.Component<BoundaryProps, { failed: boolean }> {
  declare readonly props: Readonly<BoundaryProps>;
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
