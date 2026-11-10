import { useEffect, useRef, useState } from 'react';
import { useActiveChapter } from './useActiveChapter';
import type { ChapterId } from './chapters';

/**
 * The room's air. A fixed layer between the particle field and the page:
 *   aurora  a soft violet glow that travels to where each chapter's subject
 *           sits (behind the portrait, behind the numeral, under the address)
 *   lamp    a faint light that follows the cursor on pointer devices
 *   grain   a fine film grain that gives the flat midnight a surface and
 *           hides gradient banding
 * Everything here is transform and opacity only, so it costs one composited
 * layer each and never repaints on scroll. The glows are painted small and
 * scaled up by the compositor (a soft gradient loses nothing), which keeps
 * their textures small on large, dense displays.
 */

/** Aurora keyframe per chapter: x (vw), y (vh), scale, opacity. */
const AURORA: Record<ChapterId, [number, number, number, number]> = {
    top: [72, 46, 1, 1],
    proof: [74, 50, 0.9, 0.85],
    principle: [70, 56, 1.05, 0.75],
    work: [62, 60, 1.2, 0.5],
    path: [44, 46, 1.1, 0.6],
    contact: [50, 66, 1.35, 1],
};

export default function Atmosphere() {
    const active = useActiveChapter();
    const lampRef = useRef<HTMLDivElement>(null);
    const [lamp] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    useEffect(() => {
        const el = lampRef.current;
        if (!lamp || !el) return;
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
            el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
            raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
        };
        const onMove = (e: PointerEvent) => {
            tx = e.clientX;
            ty = e.clientY;
            if (!seen) {
                seen = true;
                x = tx;
                y = ty;
                el.style.opacity = '1';
            }
            if (!raf) raf = requestAnimationFrame(tick);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => {
            window.removeEventListener('pointermove', onMove);
            cancelAnimationFrame(raf);
        };
    }, [lamp]);

    const [x, y, scale, opacity] = AURORA[active];

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div
                className="absolute left-0 top-0 h-[30vmax] w-[30vmax] transition-[transform,opacity] duration-[1800ms] [transition-timing-function:var(--ease-out-expo)] will-change-transform"
                style={{
                    transform: `translate3d(calc(${x}vw - 50%), calc(${y}vh - 50%), 0) scale(${scale * 3})`,
                    opacity,
                    background:
                        'radial-gradient(closest-side, color-mix(in srgb, var(--color-signal-deep) 26%, transparent) 0%, color-mix(in srgb, var(--color-signal-deep) 13%, transparent) 34%, color-mix(in srgb, var(--color-signal-deep) 4%, transparent) 66%, transparent 100%)',
                }}
            />
            {/* A cooler counterweight on the opposite side keeps the frame from tipping. */}
            <div
                className="absolute left-0 top-0 h-[24vmax] w-[24vmax] transition-transform duration-[2400ms] [transition-timing-function:var(--ease-out-expo)] will-change-transform"
                style={{
                    transform: `translate3d(calc(${100 - x}vw - 50%), calc(${118 - y}vh - 50%), 0) scale(3)`,
                    background:
                        'radial-gradient(closest-side, color-mix(in srgb, var(--color-signal-glow) 20%, transparent) 0%, color-mix(in srgb, var(--color-signal-glow) 7%, transparent) 55%, transparent 100%)',
                }}
            />
            {lamp && (
                <div
                    ref={lampRef}
                    className="absolute left-0 top-0 h-[34rem] w-[34rem] opacity-0 transition-opacity duration-700"
                    style={{
                        background:
                            'radial-gradient(closest-side, color-mix(in srgb, var(--color-signal) 10%, transparent) 0%, color-mix(in srgb, var(--color-signal) 4%, transparent) 50%, transparent 100%)',
                    }}
                />
            )}
            <div className="bg-noise absolute inset-0 opacity-[0.07]" />
        </div>
    );
}
