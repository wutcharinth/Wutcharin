import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../motion/gsap';

/**
 * Routes that keep native scrolling. The resume builder is a tool with its
 * own scroll containers; Human Edge shipped without smooth scroll. Phase 6
 * folds this list into the per-route scene config.
 */
const NATIVE_SCROLL_ROUTES = new Set(['/resume-builder', '/human-edge']);

const ScrollContext = createContext<Lenis | null>(null);

/** The app-wide Lenis instance, or null (touch, reduced motion, native routes). */
// eslint-disable-next-line react-refresh/only-export-components
export const useLenis = () => useContext(ScrollContext);

/**
 * Single smooth-scroll engine for the whole app. Lenis rides GSAP's ticker
 * and feeds ScrollTrigger.update — one clock for every scroll-driven system.
 * Pages must not create their own Lenis instances.
 */
export default function ScrollProvider({ children }: { children: ReactNode }) {
    const { pathname } = useLocation();
    const native = NATIVE_SCROLL_ROUTES.has(pathname);
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        // Same opt-outs the per-page instances used: native scroll on touch
        // devices and under prefers-reduced-motion.
        const isTouch = window.matchMedia('(hover: none)').matches;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (native || isTouch || prefersReduced) return;

        const instance = new Lenis();
        instance.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => instance.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        setLenis(instance);

        return () => {
            gsap.ticker.remove(tick);
            instance.destroy();
            setLenis(null);
        };
    }, [native]);

    return <ScrollContext.Provider value={lenis}>{children}</ScrollContext.Provider>;
}
