import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const KEY = 'wt-booted';

/**
 * First-visit boot: a sub-second console readout that tracks real readiness
 * (display fonts), then lifts. Never shown twice in a session, never under
 * reduced motion, and capped so it cannot hold the page hostage.
 */
export default function BootLoader() {
    const [show, setShow] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            if (sessionStorage.getItem(KEY)) return false;
        } catch {
            /* storage blocked: still fine to show once */
        }
        return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
    const [pct, setPct] = useState(0);

    useEffect(() => {
        if (!show) return;
        try {
            sessionStorage.setItem(KEY, '1');
        } catch {
            /* ignore */
        }
        const start = performance.now();
        let raf = 0;
        let ready = false;
        void document.fonts?.ready.then(() => {
            ready = true;
        });
        const tick = (t: number) => {
            const elapsed = t - start;
            // Ease toward 90% while waiting; snap home once fonts are ready.
            const target = ready && elapsed > 450 ? 100 : Math.min(90, (elapsed / 700) * 90);
            setPct((p) => Math.round(p + (target - p) * 0.25));
            if ((ready && elapsed > 520) || elapsed > 1100) {
                setPct(100);
                window.setTimeout(() => setShow(false), 140);
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [show]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="boot"
                    aria-hidden="true"
                    className="fixed inset-0 z-[9500] flex items-end bg-bg px-6 pb-10 md:px-10"
                    exit={{ clipPath: 'inset(0 0 100% 0)' }}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                >
                    <div className="mx-auto flex w-full max-w-6xl items-end justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute">
                        <span>
                            Resolving signal<span className="animate-pulse">…</span>
                        </span>
                        <span className="font-display text-6xl font-semibold tracking-[-0.04em] text-text-strong tabular-nums md:text-8xl">
                            {String(pct).padStart(3, '0')}
                        </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-signal" style={{ transform: `scaleX(${pct / 100})`, transformOrigin: 'left' }} />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
