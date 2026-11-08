import { useEffect, useRef, type RefObject } from 'react';

/**
 * Run `frame` every animation frame, but only while `ref` is on screen.
 * Used to keep DOM overlays registered with the live camera (parallax,
 * depth) at zero cost when the chapter is elsewhere.
 */
export function useOverlayLoop(ref: RefObject<HTMLElement | null>, frame: () => void) {
    const frameRef = useRef(frame);
    useEffect(() => {
        frameRef.current = frame;
    });

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let raf = 0;
        let running = false;
        const loop = () => {
            frameRef.current();
            raf = requestAnimationFrame(loop);
        };
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !running) {
                running = true;
                loop();
            } else if (!entry.isIntersecting && running) {
                running = false;
                cancelAnimationFrame(raf);
            }
        });
        obs.observe(el);
        // Place once immediately so first paint is already registered.
        frameRef.current();
        return () => {
            obs.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [ref]);
}
