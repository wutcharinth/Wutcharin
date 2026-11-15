/**
 * Quality tiers for the particle scene. Detected once at mount; the URL
 * override (?tier=high|mid|touch|low|off) exists for QA and art direction review.
 *
 * off: no canvas at all — the DOM fallback (aurora + gradient) is the design.
 */

export type TierId = 'high' | 'mid' | 'touch' | 'low' | 'off';

export interface Tier {
    id: TierId;
    /** Formation texture side — particle count is texSize². */
    texSize: number;
    dprMax: number;
    /** Point size in drawing-buffer pixels (scaled by depth in the shader). */
    pointSize: number;
}

const TIERS: Record<Exclude<TierId, 'off'>, Tier> = {
    high: { id: 'high', texSize: 160, dprMax: 1.5, pointSize: 0.9 },
    mid: { id: 'mid', texSize: 112, dprMax: 1.15, pointSize: 1.15 },
    // Phones: a small screen at a high pixel ratio. More, finer points drawn
    // sharper, so a portrait keeps its features at phone size.
    touch: { id: 'touch', texSize: 160, dprMax: 2, pointSize: 0.85 },
    low: { id: 'low', texSize: 64, dprMax: 1, pointSize: 1.7 },
};

function webgl2Available(): boolean {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true });
        return !!gl;
    } catch {
        return false;
    }
}

/**
 * `?hero=reel` swaps the live particle field for the pre-rendered hero reel
 * (video/hero-reel). Opt-in while the reel is under review. Reduced-motion
 * visitors never get autoplaying video.
 */
export function heroReelRequested(): boolean {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return new URLSearchParams(window.location.search).get('hero') === 'reel';
}

/**
 * Whether the Work chapter's product simulations may run: WebGL 2 without a
 * major performance caveat, and no reduced-motion preference. Independent of
 * the particle tier, so the opt-in hero reel does not switch them off.
 */
export function simsAllowed(): boolean {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (new URLSearchParams(window.location.search).get('tier') === 'off') return false;
    return webgl2Available();
}

/**
 * The hero's main visual. Default: the agent constellation. `?hero=portrait`
 * brings back the particle portrait; `?hero=reel` plays the film.
 */
export type HeroVariant = 'agents' | 'portrait' | 'reel';
export function heroVariant(): HeroVariant {
    if (heroReelRequested()) return 'reel';
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('hero') === 'portrait') return 'portrait';
    return 'agents';
}

export function detectTier(): Tier | null {
    if (typeof window === 'undefined') return null;
    // One layer of motion at a time: the reel retires the particle field.
    if (heroReelRequested()) return null;

    const override = new URLSearchParams(window.location.search).get('tier');
    if (override === 'off') return null;
    if (override && override in TIERS) return TIERS[override as keyof typeof TIERS];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
    if (!webgl2Available()) return null;

    const cores = navigator.hardwareConcurrency ?? 8;
    // deviceMemory is Chrome-only; undefined (Safari/Firefox) must not downtier.
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    // Touch screens get their own tier; a reported core count of 2 or fewer
    // marks a device too slow for it. (iOS does not report its real count.)
    if (coarse) return cores <= 2 ? TIERS.low : TIERS.touch;
    if (cores <= 4) return TIERS.low;
    if (memory !== undefined && memory < 8) return TIERS.mid;
    return TIERS.high;
}
