import type { SceneTargets } from '../../scene/sceneBus';
import { ensureImageFormation, ensureTextFormation, worldExtents } from '../../scene/sampled';

/**
 * Scene presets for the home chapters. Each returns bus targets and kicks
 * off the (idempotent, async) bake for any sampled shape it needs. Layout
 * is aspect-aware: the key carries a coarse aspect bucket so a resize
 * re-bakes into the new composition instead of stretching the old one.
 */

export const SIGNAL = '#a78bfa';

const bucket = (aspect: number) => (aspect >= 1 ? 'w' : 'n') + Math.round(aspect * 10);

/** 00: the field resolves into the portrait (right on desktop, top on mobile). */
export function portraitScene(): Partial<SceneTargets> {
    const { halfW, halfH, aspect } = worldExtents();
    const key = `~portrait:${bucket(aspect)}` as const;
    let place;
    if (aspect >= 1) {
        const cx = halfW * 0.48;
        const height = Math.min(halfH * 1.5, (halfW - cx) * 2 * 0.92);
        place = { cx, cy: -halfH * 0.06, height, depth: 1.4, dust: 0.05 };
    } else {
        const height = Math.min(halfH * 0.72, halfW * 1.7);
        place = { cx: 0, cy: halfH * 0.56, height, depth: 1.2, dust: 0.04 };
    }
    void ensureImageFormation(key, '/scene/portrait-density.png', place);
    return { formation: key, mode: 'full', chaos: 0.03, accent: SIGNAL, repel: 0.55 };
}

/** 01: a proof numeral set in particles (right on desktop, top on mobile). */
export function numeralScene(text: string): Partial<SceneTargets> {
    const { halfW, halfH, aspect } = worldExtents();
    const key = `~num:${text}:${bucket(aspect)}` as const;
    const wide = aspect >= 1;
    void ensureTextFormation(key, text, {
        cx: wide ? halfW * 0.52 : 0,
        cy: wide ? 0 : halfH * 0.5,
        height: wide ? halfH * 0.75 : halfH * 0.4,
        maxWidth: wide ? halfW * 0.82 : halfW * 1.8,
        dust: 0.06,
    });
    return { formation: key, mode: 'full', chaos: 0.02, accent: SIGNAL, repel: 0.8 };
}

/**
 * 05: the field converges into the address itself. On narrow screens the
 * full address would be too fine for the particle budget, so it resolves
 * into a single "@" instead.
 */
export function addressScene(text: string): Partial<SceneTargets> {
    const { halfW, halfH, aspect } = worldExtents();
    const wide = aspect >= 1;
    const key = `~addr:${bucket(aspect)}` as const;
    void ensureTextFormation(key, wide ? text : '@', {
        cx: 0,
        cy: wide ? -halfH * 0.27 : -halfH * 0.02,
        height: wide ? halfH * 0.3 : halfH * 0.42,
        maxWidth: wide ? halfW * 1.2 : halfW * 1.6,
        dust: wide ? 0.12 : 0.08,
    });
    return { formation: key, mode: 'full', chaos: 0.02, accent: SIGNAL, repel: 0.9 };
}
