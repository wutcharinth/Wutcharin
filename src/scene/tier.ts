/**
 * Quality tiers for the particle scene. Detected once at mount; the URL
 * override (?tier=high|mid|low|off) exists for QA and art direction review.
 *
 * off: no canvas at all — the DOM fallback (aurora + gradient) is the design.
 */

export type TierId = 'high' | 'mid' | 'low' | 'off';

export interface Tier {
    id: TierId;
    /** Formation texture side — particle count is texSize². */
    texSize: number;
    dprMax: number;
}

const TIERS: Record<Exclude<TierId, 'off'>, Tier> = {
    high: { id: 'high', texSize: 160, dprMax: 1.5 },
    mid: { id: 'mid', texSize: 112, dprMax: 1.15 },
    low: { id: 'low', texSize: 64, dprMax: 1 },
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

export function detectTier(): Tier | null {
    if (typeof window === 'undefined') return null;

    const override = new URLSearchParams(window.location.search).get('tier');
    if (override === 'off') return null;
    if (override && override in TIERS) return TIERS[override as keyof typeof TIERS];

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
    if (!webgl2Available()) return null;

    const cores = navigator.hardwareConcurrency ?? 8;
    // deviceMemory is Chrome-only; undefined (Safari/Firefox) must not downtier.
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const coarse = window.matchMedia('(pointer: coarse)').matches;

    if (coarse || cores <= 4) return TIERS.low;
    if (memory !== undefined && memory < 8) return TIERS.mid;
    return TIERS.high;
}
