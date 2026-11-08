import { useCallback } from 'react';
import { useLenis } from '../../lib/scroll/ScrollProvider';

/** Scroll to a y offset or element through Lenis when it owns the page. */
export function useScrollTo() {
    const lenis = useLenis();
    return useCallback(
        (target: number | string | HTMLElement, opts: { immediate?: boolean } = {}) => {
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (lenis) {
                lenis.scrollTo(target, { immediate: opts.immediate || reduced, duration: 1.4 });
                return;
            }
            let y: number;
            if (typeof target === 'number') y = target;
            else {
                const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
                if (!el) return;
                y = el.getBoundingClientRect().top + window.scrollY;
            }
            window.scrollTo({ top: y, behavior: opts.immediate || reduced ? 'auto' : 'smooth' });
        },
        [lenis],
    );
}
