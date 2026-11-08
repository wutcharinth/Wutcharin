import { useEffect, useMemo, type RefObject } from 'react';
import { ScrollTrigger, usePrefersReducedMotion } from '../../lib/motion';
import { sceneBus, type SceneTargets } from '../../scene/sceneBus';
import { detectTier } from '../../scene/tier';

/**
 * Re-organize the field whenever a chapter takes the middle of the screen,
 * from either direction. The scene factory runs at trigger time so layout
 * (aspect, dolly) is read fresh.
 */
export function useChapterScene(ref: RefObject<HTMLElement | null>, scene: () => Partial<SceneTargets>) {
    const reduced = usePrefersReducedMotion();
    const sceneOff = useMemo(() => detectTier() === null, []);

    useEffect(() => {
        const el = ref.current;
        if (!el || reduced || sceneOff) return;
        const apply = () => sceneBus.apply(scene());
        const st = ScrollTrigger.create({
            trigger: el,
            start: 'top 55%',
            end: 'bottom 45%',
            onEnter: apply,
            onEnterBack: apply,
        });
        return () => st.kill();
        // The factory is a stable module-level preset per chapter.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reduced, sceneOff]);

    return { sceneOff, reduced };
}
