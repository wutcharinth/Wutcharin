import { useEffect, useState } from 'react';
import { CHAPTERS, type ChapterId } from './chapters';

/**
 * The chapter that owns the middle of the viewport: the last chapter whose
 * top is above the midline. Computed from scroll position (rAF-throttled)
 * rather than intersection events, so jumps and deep links that skip whole
 * sections still land on the right chapter. Sections between chapters
 * (the project index) belong to the chapter before them.
 */
export function useActiveChapter(): ChapterId {
    const [active, setActive] = useState<ChapterId>('top');
    useEffect(() => {
        let raf = 0;
        const measure = () => {
            raf = 0;
            const mid = window.innerHeight / 2;
            let current: ChapterId = 'top';
            for (const c of CHAPTERS) {
                const el = document.getElementById(c.id);
                if (el && el.getBoundingClientRect().top <= mid) current = c.id;
            }
            setActive(current);
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(measure);
        };
        measure();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);
    return active;
}
