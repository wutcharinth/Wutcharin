import { useEffect, useState } from 'react';
import { CHAPTERS, type ChapterId } from './chapters';

/** Which chapter owns the middle of the viewport. */
export function useActiveChapter(): ChapterId {
    const [active, setActive] = useState<ChapterId>('top');
    useEffect(() => {
        const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter((e): e is HTMLElement => !!e);
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id as ChapterId);
                });
            },
            { rootMargin: '-49% 0px -49% 0px', threshold: 0 },
        );
        els.forEach((el) => obs.observe(el));
        return () => obs.disconnect();
    }, []);
    return active;
}
