import { lazy, type ComponentType } from 'react';
import type { SimProps } from './kit';
import { SIM_IDS } from './ids';

/**
 * Lazy simulation module loaders and idempotent preloader. Kept separate from
 * SimStage so Vite Fast Refresh only sees component exports in index.tsx.
 */

export const SIM_LOADERS: Record<(typeof SIM_IDS)[number], () => Promise<{ default: ComponentType<SimProps> }>> = {
    pidngod: () => import('./PidngodSim'),
    'splitbill-ai': () => import('./SplitBillSim'),
    jongtoh: () => import('./JongtohSim'),
    klikr: () => import('./KlikrSim'),
};

export const SIM_COMPONENTS: Record<(typeof SIM_IDS)[number], ComponentType<SimProps>> = {
    pidngod: lazy(SIM_LOADERS.pidngod),
    'splitbill-ai': lazy(SIM_LOADERS['splitbill-ai']),
    jongtoh: lazy(SIM_LOADERS.jongtoh),
    klikr: lazy(SIM_LOADERS.klikr),
};

let preloaded = false;

/** Warm all 4 simulation chunks once the visitor approaches Chapter 03. */
export function preloadSims() {
    if (preloaded) return;
    preloaded = true;
    Object.values(SIM_LOADERS).forEach((load) => {
        void load();
    });
}
