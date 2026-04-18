import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Wraps routes in a fade + slight y-translate transition keyed by pathname.
 * Also renders an overlay "curtain" that sweeps on route change.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
    const location = useLocation();
    const prefersReduced = usePrefersReducedMotion();

    if (prefersReduced) {
        return <div key={location.pathname}>{children}</div>;
    }

    return (
        <>
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
            <Curtain pathname={location.pathname} />
        </>
    );
}

/**
 * A full-screen overlay that sweeps in then out on route change.
 * Pure visual garnish — sits above content but below the cursor.
 */
function Curtain({ pathname }: { pathname: string }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                className="pointer-events-none fixed inset-0 z-[9000] origin-bottom bg-gradient-to-t from-violet-600 via-slate-950 to-slate-950"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                aria-hidden="true"
            />
        </AnimatePresence>
    );
}
