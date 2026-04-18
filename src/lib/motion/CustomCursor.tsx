import { useEffect, useRef, useState } from 'react';
import { gsap } from './gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Enhanced cursor:
 *   • A small hot-dot that tracks the mouse 1:1
 *   • A larger ring that lags behind with a smooth follower easing
 *   • Grows and darkens when hovering anything with [data-cursor], .cursor-hover,
 *     a, button, or [role="button"]
 * Automatically hides on touch devices and respects prefers-reduced-motion.
 */
export default function CustomCursor() {
    const ringRef = useRef<HTMLDivElement | null>(null);
    const dotRef = useRef<HTMLDivElement | null>(null);
    const labelRef = useRef<HTMLDivElement | null>(null);
    const [enabled, setEnabled] = useState(false);
    const [label, setLabel] = useState('');
    const prefersReduced = usePrefersReducedMotion();

    useEffect(() => {
        if (prefersReduced) return;
        const isTouch = window.matchMedia('(hover: none)').matches;
        if (isTouch) return;
        setEnabled(true);
        document.body.classList.add('cursor-enhanced');
        return () => {
            document.body.classList.remove('cursor-enhanced');
        };
    }, [prefersReduced]);

    useEffect(() => {
        if (!enabled) return;
        const ring = ringRef.current;
        const dot = dotRef.current;
        if (!ring || !dot) return;

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const ringPos = { x: pos.x, y: pos.y };

        const xSet = gsap.quickSetter(ring, 'x', 'px');
        const ySet = gsap.quickSetter(ring, 'y', 'px');
        const xDot = gsap.quickSetter(dot, 'x', 'px');
        const yDot = gsap.quickSetter(dot, 'y', 'px');

        const onMove = (e: MouseEvent) => {
            pos.x = e.clientX;
            pos.y = e.clientY;
            xDot(pos.x);
            yDot(pos.y);
        };

        const tick = () => {
            ringPos.x += (pos.x - ringPos.x) * 0.18;
            ringPos.y += (pos.y - ringPos.y) * 0.18;
            xSet(ringPos.x);
            ySet(ringPos.y);
        };
        gsap.ticker.add(tick);

        const enterHover = (target: HTMLElement) => {
            const customLabel = target.dataset.cursor || '';
            setLabel(customLabel);
            gsap.to(ring, { scale: 2.2, borderColor: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(255,255,255,0.08)', duration: 0.35, ease: 'power3.out' });
            gsap.to(dot, { scale: 0, duration: 0.2 });
        };
        const leaveHover = () => {
            setLabel('');
            gsap.to(ring, { scale: 1, borderColor: 'rgba(255,255,255,0.5)', backgroundColor: 'transparent', duration: 0.35, ease: 'power3.out' });
            gsap.to(dot, { scale: 1, duration: 0.2 });
        };

        const onOver = (e: MouseEvent) => {
            const el = e.target as HTMLElement | null;
            if (!el) return;
            const hover = el.closest<HTMLElement>('[data-cursor], .cursor-hover, a, button, [role="button"]');
            if (hover) enterHover(hover);
        };
        const onOut = (e: MouseEvent) => {
            const el = e.target as HTMLElement | null;
            const related = e.relatedTarget as HTMLElement | null;
            if (!el) return;
            const hover = el.closest<HTMLElement>('[data-cursor], .cursor-hover, a, button, [role="button"]');
            if (hover && (!related || !related.closest('[data-cursor], .cursor-hover, a, button, [role="button"]'))) {
                leaveHover();
            }
        };
        const onLeaveWindow = () => {
            gsap.to([ring, dot], { opacity: 0, duration: 0.2 });
        };
        const onEnterWindow = () => {
            gsap.to([ring, dot], { opacity: 1, duration: 0.2 });
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseover', onOver);
        document.addEventListener('mouseout', onOut);
        document.documentElement.addEventListener('mouseleave', onLeaveWindow);
        document.documentElement.addEventListener('mouseenter', onEnterWindow);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onOver);
            document.removeEventListener('mouseout', onOut);
            document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
            document.documentElement.removeEventListener('mouseenter', onEnterWindow);
        };
    }, [enabled]);

    useEffect(() => {
        if (!labelRef.current) return;
        gsap.to(labelRef.current, { opacity: label ? 1 : 0, duration: 0.25 });
    }, [label]);

    if (!enabled) return null;

    return (
        <>
            <div
                ref={ringRef}
                className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 mix-blend-difference"
                style={{ willChange: 'transform' }}
                aria-hidden="true"
            >
                <div
                    ref={labelRef}
                    className="absolute inset-0 flex items-center justify-center text-[9px] font-mono uppercase tracking-widest text-white opacity-0"
                >
                    {label}
                </div>
            </div>
            <div
                ref={dotRef}
                className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
                style={{ willChange: 'transform' }}
                aria-hidden="true"
            />
        </>
    );
}
