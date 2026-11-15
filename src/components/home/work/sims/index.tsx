import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import type { SimProps } from './kit';
import { SIM_IDS } from './ids';

/**
 * The product simulations for the Work chapter. Each one is its own lazy
 * chunk (three.js and the scene code load only when a simulation is on
 * screen), so this module is safe to import from the main bundle.
 */

const SIMS: Record<(typeof SIM_IDS)[number], ComponentType<SimProps>> = {
    pidngod: lazy(() => import('./PidngodSim')),
    'splitbill-ai': lazy(() => import('./SplitBillSim')),
    jongtoh: lazy(() => import('./JongtohSim')),
    klikr: lazy(() => import('./KlikrSim')),
};

export default function SimStage({ id, running, compact, fallback }: SimProps & { id: string; fallback: ReactNode }) {
    const Sim = (SIMS as Record<string, ComponentType<SimProps> | undefined>)[id];
    if (!Sim) return <>{fallback}</>;
    return (
        <Suspense fallback={fallback}>
            <Sim running={running} compact={compact} />
        </Suspense>
    );
}
