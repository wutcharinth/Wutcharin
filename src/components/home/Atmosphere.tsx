import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useActiveChapter } from './useActiveChapter';
import type { ChapterId } from './chapters';

/**
 * The surface: sparkled graphite. A fixed layer between the particle field
 * and the page:
 *   sheen   a long, soft sweep of light across the graphite that travels to
 *           where each chapter's subject sits (the portrait, the numeral,
 *           the address)
 *   glitter a fine grain that is faint everywhere and catches the light
 *           where the sheen and the lamp fall on it
 *   lamp    a small light that follows the cursor on pointer devices, so
 *           the grain glints as you move
 * The lit glitter is the grain multiplied by a light map (black, plus the
 * sheen and the lamp in white), screened onto the page. Everything here moves
 * by transform and opacity only, so each layer is composited once and never
 * repaints on scroll. The light shapes are painted small and scaled up by the
 * compositor (a soft gradient loses nothing).
 */

/** Sheen keyframe per chapter: x (vw), y (vh), scale, opacity. */
const SHEEN: Record<ChapterId, [number, number, number, number]> = {
    top: [70, 40, 1, 1],
    proof: [74, 46, 0.9, 0.9],
    principle: [70, 52, 1.05, 0.8],
    work: [62, 58, 1.2, 0.55],
    path: [46, 44, 1.1, 0.65],
    contact: [52, 62, 1.3, 1],
};

/** The sweep runs from upper left to lower right, like the light in a room. */
const ANGLE = -50;
const MOVE = 'transition-[transform,opacity] duration-[1800ms] [transition-timing-function:var(--ease-out-expo)] will-change-transform';

const sheenStyle = (x: number, y: number, scale: number) =>
    `translate3d(calc(${x}vw - 50%), calc(${y}vh - 50%), 0) rotate(${ANGLE}deg) scale(${scale * 2.4})`;

/** A soft ellipse of light; `strength` is its centre alpha (0 to 1). */
const light = (strength: number) =>
    `radial-gradient(closest-side, rgb(255 255 255 / ${strength}) 0%, rgb(255 255 255 / ${strength * 0.45}) 45%, rgb(255 255 255 / ${strength * 0.12}) 75%, transparent 100%)`;

export default function Atmosphere() {
    const active = useActiveChapter();
    const lampRef = useRef<HTMLDivElement>(null);
    const lampLightRef = useRef<HTMLDivElement>(null);
    const [lamp] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    useEffect(() => {
        const el = lampRef.current;
        const lit = lampLightRef.current;
        if (!lamp || !el || !lit) return;
        let raf = 0;
        let tx = 0;
        let ty = 0;
        let x = 0;
        let y = 0;
        let seen = false;
        // Ease toward the pointer, and stop the loop once it has arrived.
        const tick = () => {
            x += (tx - x) * 0.12;
            y += (ty - y) * 0.12;
            el.style.transform = lit.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
            raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
        };
        const onMove = (e: PointerEvent) => {
            tx = e.clientX;
            ty = e.clientY;
            if (!seen) {
                seen = true;
                x = tx;
                y = ty;
                el.style.opacity = lit.style.opacity = '1';
            }
            if (!raf) raf = requestAnimationFrame(tick);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => {
            window.removeEventListener('pointermove', onMove);
            cancelAnimationFrame(raf);
        };
    }, [lamp]);

    const [x, y, scale, opacity] = SHEEN[active];
    const sheen = sheenStyle(x, y, scale);
    // A weaker counter-light on the opposite side keeps the frame from tipping.
    const counter = sheenStyle(100 - x, 118 - y, 0.8);

    // The glitter is rendered at body level, between the scene canvas (z-0)
    // and the content layer (z-10), so its blend reaches the particles and
    // the page floor. Inside the app's content layer it could only blend with
    // itself. The group is opaque (a black floor plus lit grain) and is
    // screened onto the dark surface, or inverted and multiplied onto the
    // light one (`.glitter-surface` in index.css).
    const glitter = (
        <div aria-hidden="true" className="glitter-surface pointer-events-none fixed inset-0 z-[1] isolate overflow-hidden">
            {/* A light map's floor, not a surface: true black adds nothing when screened. */}
            <div className="absolute inset-0 bg-black" />
            {/* Faint everywhere: graphite is never flat. */}
            <div className="glitter absolute inset-0 opacity-[0.16]" />
            {/* Bright where light falls: the grain times a light map. */}
            <div className="absolute inset-0 isolate mix-blend-screen">
                <div className="absolute inset-0 bg-black" />
                <div className={`absolute left-0 top-0 h-[34vmax] w-[14vmax] ${MOVE}`} style={{ transform: sheen, opacity, background: light(0.62) }} />
                <div className={`absolute left-0 top-0 h-[30vmax] w-[12vmax] ${MOVE}`} style={{ transform: counter, background: light(0.3) }} />
                {lamp && (
                    <div
                        ref={lampLightRef}
                        className="absolute left-0 top-0 h-[22rem] w-[22rem] opacity-0 transition-opacity duration-700"
                        style={{ background: light(0.9) }}
                    />
                )}
                <div className="glitter absolute inset-0 mix-blend-multiply" />
            </div>
        </div>
    );

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            {/* The light on the graphite itself. */}
            <div className={`absolute left-0 top-0 h-[34vmax] w-[14vmax] ${MOVE}`} style={{ transform: sheen, opacity, background: light(0.085) }} />
            <div className={`absolute left-0 top-0 h-[30vmax] w-[12vmax] ${MOVE}`} style={{ transform: counter, background: light(0.035) }} />
            {lamp && (
                <div
                    ref={lampRef}
                    className="absolute left-0 top-0 h-[34rem] w-[34rem] opacity-0 transition-opacity duration-700"
                    style={{ background: light(0.04) }}
                />
            )}
            {typeof document !== 'undefined' && createPortal(glitter, document.body)}
        </div>
    );
}
