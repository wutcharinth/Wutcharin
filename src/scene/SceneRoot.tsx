import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { sceneBus } from './sceneBus';
import { detectTier } from './tier';
import { ROUTE_SCENES, FALLBACK_SCENE } from './routeScenes';
import ParticleField from './ParticleField';
import CameraRig from './CameraRig';
import { useTheme } from '../lib/theme';

const SCRIM = {
    dark: 'linear-gradient(180deg, rgba(2,6,23,0.28) 0%, rgba(2,6,23,0.46) 55%, rgba(2,6,23,0.52) 100%)',
    light: 'linear-gradient(180deg, rgba(244,245,249,0.30) 0%, rgba(244,245,249,0.48) 55%, rgba(244,245,249,0.55) 100%)',
} as const;

/**
 * The persistent world. Mounted once as a sibling of the routes — navigation
 * morphs the field, it never unmounts. mode 'hidden' parks the frameloop so
 * tool-heavy pages pay zero GPU cost while the context stays alive.
 */
export default function SceneRoot() {
    const tier = useMemo(() => detectTier(), []);
    const { pathname } = useLocation();
    const [degraded, setDegraded] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        sceneBus.apply(ROUTE_SCENES[pathname] ?? FALLBACK_SCENE);
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
    const light = useTheme() === 'light';

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
                    <ParticleField texSize={tier.texSize} light={light} />
                    <CameraRig />
                </PerformanceMonitor>
            </Canvas>

            {/* Readability scrim — a graduated floor between the live field and
                the DOM text layer. Lighter at the top so the hero stays vivid,
                heavier lower down where reading copy sits. */}
            <div className="absolute inset-0" style={{ background: light ? SCRIM.light : SCRIM.dark }} />
        </div>
    );
}
