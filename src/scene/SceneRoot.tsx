import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { sceneBus } from './sceneBus';
import { detectTier } from './tier';
import ParticleField from './ParticleField';
import CameraRig from './CameraRig';

/**
 * The persistent world. Mounted once as a sibling of the routes — navigation
 * morphs the field, it never unmounts. mode 'hidden' parks the frameloop so
 * tool-heavy pages pay zero GPU cost while the context stays alive.
 *
 * Phase 3 route map: full scene on the home route, hidden everywhere else.
 * Phase 6 moves this into per-route scene configs.
 */
export default function SceneRoot() {
    const tier = useMemo(() => detectTier(), []);
    const { pathname } = useLocation();
    const [degraded, setDegraded] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (pathname === '/') {
            sceneBus.apply({ formation: 'noise', accent: '#a78bfa', mode: 'full', chaos: 1 });
        } else {
            sceneBus.apply({ mode: 'hidden' });
        }
    }, [pathname]);

    useEffect(() => {
        if (!tier) return;

        const onPointer = (e: PointerEvent) => {
            sceneBus.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            sceneBus.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
        };

        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            sceneBus.setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        };

        window.addEventListener('pointermove', onPointer, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // Fade the world in only after the first frames have settled.
        const reveal = window.setTimeout(() => setVisible(true), 250);

        return () => {
            window.removeEventListener('pointermove', onPointer);
            window.removeEventListener('scroll', onScroll);
            window.clearTimeout(reveal);
        };
    }, [tier]);

    const mode = useSyncExternalStore(sceneBus.subscribe, () => sceneBus.targets.mode);

    if (!tier) return null;

    const hidden = mode === 'hidden';
    const dprMax = degraded ? 1 : tier.dprMax;

    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
            style={{
                opacity: visible && !hidden ? 1 : 0,
                visibility: hidden ? 'hidden' : 'visible',
            }}
        >
            <Canvas
                frameloop={hidden ? 'never' : 'always'}
                dpr={[1, dprMax]}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                camera={{ fov: 50, near: 0.1, far: 60, position: [0, 0, 14] }}
            >
                <PerformanceMonitor onDecline={() => setDegraded(true)}>
                    <ParticleField texSize={tier.texSize} />
                    <CameraRig />
                </PerformanceMonitor>
            </Canvas>
        </div>
    );
}
