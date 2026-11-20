import { Suspense, type ComponentType, type ReactNode } from 'react';
import type { SimProps } from './kit';
import { SIM_COMPONENTS } from './loaders';

/**
 * The product simulations for the Work chapter. Each one is its own lazy
 * chunk (three.js and the scene code load only when a simulation is on
 * screen), so this module is safe to import from the main bundle.
 */

export default function SimStage({ id, running, compact, fallback }: SimProps & { id: string; fallback: ReactNode }) {
    const Sim = (SIM_COMPONENTS as Record<string, ComponentType<SimProps> | undefined>)[id];
    if (!Sim) return <>{fallback}</>;
    return (
        <Suspense fallback={fallback}>
            <Sim running={running} compact={compact} />
        </Suspense>
    );
}
