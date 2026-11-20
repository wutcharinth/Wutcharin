import { useEffect, useRef, useState } from 'react';
import { gsap } from './gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Enhanced contextual cursor:
 *   • A crisp 1:1 tracking dot + smooth-lagging precision ring at rest
 *   • Reads semantic `[data-cursor]` verbs (`view`, `open`, `copy`, `play`,
 *     `explore`, `toggle`) and morphs into a high-contrast monochrome pill
 *   • Expands softly on generic links/buttons and compresses on pointerdown
 * Automatically hides on touch devices and respects prefers-reduced-motion.
 */

const CURSOR_LABELS: Record<string, string> = {
    view: 'VIEW',
    open: 'OPEN ↗',
    copy: 'COPY',
    play: 'TRY LIVE',
    explore: 'EXPLORE',
    toggle: 'THEME',
    step: 'STEP',
};

const INTERACTIVE = '[data-cursor], .cursor-hover, a, button, [role="button"]';

export default function CustomCursor() {
    const ringRef = useRef<HTMLDivElement | null>(null);
    const dotRef = useRef<HTMLDivElement | null>(null);
    const pillRef = useRef<HTMLDivElement | null>(null);
    const labelRef = useRef<HTMLSpanElement | null>(null);
    const prefersReduced = usePrefersReducedMotion();
    const [canHover] = useState(() => typeof window !== 'undefined' && !window.matchMedia('(hover: none)').matches);
    // Derived, not latched: if reduced motion turns on after mount (or the
    // preference resolves late), the custom cursor goes away again.
    const enabled = canHover && !prefersReduced;

    useEffect(() => {
        if (!enabled) return;
        document.body.classList.add('cursor-enhanced');
        return () => {
            document.body.classList.remove('cursor-enhanced');
        };
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;
        const ring = ringRef.current;
        const dot = dotRef.current;
        const pill = pillRef.current;
        const label = labelRef.current;
        if (!ring || !dot || !pill || !label) return;

        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const ringPos = { x: pos.x, y: pos.y };
        let visible = false;
        let activeVerb: string | null = null;
        let isHovering = false;

        const xSet = gsap.quickSetter(ring, 'x', 'px');
        const ySet = gsap.quickSetter(ring, 'y', 'px');
        const xPill = gsap.quickSetter(pill, 'x', 'px');
        const yPill = gsap.quickSetter(pill, 'y', 'px');
        const xDot = gsap.quickSetter(dot, 'x', 'px');
        const yDot = gsap.quickSetter(dot, 'y', 'px');

        const onMove = (e: MouseEvent) => {
            pos.x = e.clientX;
            pos.y = e.clientY;
            if (!visible) {
                visible = true;
                ringPos.x = pos.x;
                ringPos.y = pos.y;
                gsap.to([ring, dot], { opacity: 1, duration: 0.25 });
            }
            xDot(pos.x);
            yDot(pos.y);
        };

        const tick = () => {
            ringPos.x += (pos.x - ringPos.x) * 0.2;
            ringPos.y += (pos.y - ringPos.y) * 0.2;
            xSet(ringPos.x);
            ySet(ringPos.y);
            xPill(ringPos.x);
            yPill(ringPos.y);
        };
        gsap.ticker.add(tick);

        const setCursorState = (verb: string | null, hover: boolean) => {
            if (verb === activeVerb && hover === isHovering) return;
            activeVerb = verb;
            isHovering = hover;

            if (verb) {
                label.textContent = verb;
                gsap.to(pill, { opacity: 1, scale: 1, duration: 0.28, ease: 'power3.out' });
                gsap.to(ring, { opacity: 0, scale: 0.7, duration: 0.2, ease: 'power2.out' });
                gsap.to(dot, { scale: 0, duration: 0.16 });
            } else if (hover) {
                gsap.to(pill, { opacity: 0, scale: 0.85, duration: 0.2, ease: 'power2.out' });
                gsap.to(ring, {
                    opacity: visible ? 1 : 0,
                    scale: 1.9,
                    borderColor: 'rgba(255,255,255,0.9)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    duration: 0.3,
                    ease: 'power3.out',
                });
                gsap.to(dot, { scale: 0, duration: 0.18 });
            } else {
                gsap.to(pill, { opacity: 0, scale: 0.85, duration: 0.2, ease: 'power2.out' });
                gsap.to(ring, {
                    opacity: visible ? 1 : 0,
                    scale: 1,
                    borderColor: 'rgba(255,255,255,0.45)',
                    backgroundColor: 'transparent',
                    duration: 0.3,
                    ease: 'power3.out',
                });
                gsap.to(dot, { scale: 1, duration: 0.18 });
            }
        };

        const resolveTarget = (target: EventTarget | null) => {
            const el = target as HTMLElement | null;
            if (!el) return { verb: null, hover: false };
            // Walk closest explicit data-cursor first; empty string explicitly suppresses verb.
            const tagged = el.closest<HTMLElement>('[data-cursor]');
            const raw = tagged?.dataset.cursor?.toLowerCase();
            if (raw && CURSOR_LABELS[raw]) return { verb: CURSOR_LABELS[raw], hover: true };
            const interactive = el.closest<HTMLElement>(INTERACTIVE);
            return { verb: null, hover: Boolean(interactive) };
        };

        const onOver = (e: MouseEvent) => {
            const { verb, hover } = resolveTarget(e.target);
            setCursorState(verb, hover);
        };
        const onOut = (e: MouseEvent) => {
            const { verb, hover } = resolveTarget(e.relatedTarget);
            setCursorState(verb, hover);
        };
        const onDown = () => {
            if (activeVerb) {
                gsap.to(pill, { scale: 0.9, duration: 0.12, ease: 'power2.out' });
            } else {
                gsap.to(ring, { scale: isHovering ? 1.55 : 0.82, duration: 0.12, ease: 'power2.out' });
            }
        };
        const onUp = () => {
            if (activeVerb) {
                gsap.to(pill, { scale: 1, duration: 0.22, ease: 'power3.out' });
            } else {
                gsap.to(ring, { scale: isHovering ? 1.9 : 1, duration: 0.22, ease: 'power3.out' });
            }
        };
        const onLeaveWindow = () => {
            gsap.to([ring, dot, pill], { opacity: 0, duration: 0.2 });
        };
        const onEnterWindow = () => {
            if (!visible) return;
            if (activeVerb) gsap.to(pill, { opacity: 1, duration: 0.2 });
            else gsap.to([ring, dot], { opacity: 1, duration: 0.2 });
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('mouseover', onOver);
        document.addEventListener('mouseout', onOut);
        window.addEventListener('pointerdown', onDown, { passive: true });
        window.addEventListener('pointerup', onUp, { passive: true });
        document.documentElement.addEventListener('mouseleave', onLeaveWindow);
        document.documentElement.addEventListener('mouseenter', onEnterWindow);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseover', onOver);
            document.removeEventListener('mouseout', onOut);
            window.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointerup', onUp);
            document.documentElement.removeEventListener('mouseleave', onLeaveWindow);
            document.documentElement.removeEventListener('mouseenter', onEnterWindow);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <>
            <div
                ref={ringRef}
                className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45 opacity-0 mix-blend-difference"
                style={{ willChange: 'transform, opacity' }}
                aria-hidden="true"
            />
            <div
                ref={dotRef}
                className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 mix-blend-difference"
                style={{ willChange: 'transform, opacity' }}
                aria-hidden="true"
            />
            <div
                ref={pillRef}
                className="pointer-events-none fixed left-0 top-0 z-[9999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-hairline-strong bg-text-strong px-3 py-1.5 text-bg opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.32)]"
                style={{ willChange: 'transform, opacity', transform: 'translate(-50%, -50%) scale(0.85)' }}
                aria-hidden="true"
            >
                <span ref={labelRef} className="whitespace-nowrap font-mono text-[9px] font-medium uppercase leading-none tracking-[0.24em]" />
            </div>
        </>
    );
}
