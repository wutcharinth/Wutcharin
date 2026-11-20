import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BOOT_KEY, isBooted, markBooted } from './bootBus';

/**
 * First-visit boot: a sub-second console readout that tracks real readiness
 * (display fonts), then lifts while signalling Arrival to begin its reveal.
 * Never shown twice in a session, never under reduced motion, and capped so
 * it cannot hold the page hostage.
 */
export default function BootLoader() {
    const [show, setShow] = useState(() => !isBooted());
    const [pct, setPct] = useState(0);

    useEffect(() => {
        if (!show) {
            markBooted();
            return;
        }
        try {
            sessionStorage.setItem(BOOT_KEY, '1');
        } catch {
            /* ignore */
        }
        const start = performance.now();
        let raf = 0;
        let finishTimer = 0;
        let ready = false;
        void document.fonts?.ready.then(() => {
            ready = true;
        });
        const tick = (t: number) => {
            const elapsed = t - start;
            // Ease toward 90% while waiting; snap home once fonts are ready.
            const target = ready && elapsed > 420 ? 100 : Math.min(90, (elapsed / 650) * 90);
            setPct((p) => Math.round(p + (target - p) * 0.25));
            if ((ready && elapsed > 480) || elapsed > 1050) {
                setPct(100);
                finishTimer = window.setTimeout(() => {
                    setShow(false);
                    // Fire hero choreography slightly into the curtain lift so
                    // typography enters in one unbroken visual motion.
                    window.setTimeout(markBooted, 160);
                }, 120);
                return;
            }
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(raf);
            window.clearTimeout(finishTimer);
        };
    }, [show]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="boot"
                    aria-hidden="true"
                    className="fixed inset-0 z-[9500] flex flex-col justify-between bg-bg px-6 py-8 md:px-10 md:py-10"
                    exit={{ clipPath: 'inset(0 0 100% 0)' }}
                    transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
                >
                    <div className="mx-auto flex w-full max-w-6xl items-center justify-between font-mono text-[11px] uppercase tracking-[0.28em] text-text-mute">
                        <span className="font-display text-lg font-semibold tracking-tight text-text-strong">
                            WT<span className="text-signal">.</span>
                        </span>
                        <span>Black Console</span>
                    </div>

                    <div className="mx-auto flex w-full max-w-6xl items-end justify-between font-mono text-[11px] uppercase tracking-[0.28em] text-text-mute">
                        <span>
                            Resolving signal<span className="animate-pulse">…</span>
                        </span>
                        <span className="font-display text-6xl font-semibold tracking-[-0.04em] text-text-strong tabular-nums md:text-8xl">
                            {String(pct).padStart(3, '0')}
                        </span>
                    </div>
                    <div
                        className="absolute inset-x-0 bottom-0 h-px bg-signal"
                        style={{ transform: `scaleX(${pct / 100})`, transformOrigin: 'left' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
