import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Route transition: the DOM crossfades while the persistent particle world
 * morphs to the next route's formation underneath (SceneRoot reacts to the
 * pathname the moment navigation starts). The world is the curtain — the old
 * violet sweep overlay is gone.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
    const location = useLocation();
    const prefersReduced = usePrefersReducedMotion();

    if (prefersReduced) {
        return <div key={location.pathname}>{children}</div>;
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18, transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] } }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
