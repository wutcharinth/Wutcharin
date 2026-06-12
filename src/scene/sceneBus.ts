import type { FormationId } from './formations';

/**
 * Frame-rate-safe scene state. Routes and scroll handlers write targets here;
 * the R3F frame loop reads and lerps toward them directly — zero React
 * re-renders per frame. React only subscribes to coarse state (mode) via
 * useSyncExternalStore.
 */

export type SceneMode = 'full' | 'ambient' | 'hidden';

export interface SceneTargets {
    formation: FormationId;
    /** Hex accent the field tints toward. */
    accent: string;
    mode: SceneMode;
    /** 0 = fully resolved pattern, 1 = pure noise. */
    chaos: number;
    /** Page scroll progress 0..1 — drives the camera dolly. */
    progress: number;
}

const DEFAULTS: SceneTargets = {
    formation: 'noise',
    accent: '#a78bfa',
    mode: 'hidden',
    chaos: 1,
    progress: 0,
};

class SceneBus {
    targets: SceneTargets = { ...DEFAULTS };
    /** Bumped whenever the target formation changes — the field watches this. */
    revision = 0;
    /** Pointer in NDC (-1..1), written by the canvas host, read per frame. */
    pointer = { x: 0, y: 0 };

    private listeners = new Set<() => void>();

    subscribe = (fn: () => void) => {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    };

    /** Apply new targets (route mounts, scroll chapters, hover reactions). */
    apply(partial: Partial<SceneTargets>) {
        const prev = this.targets;
        const next = { ...prev, ...partial };
        if (partial.formation && partial.formation !== prev.formation) {
            this.revision++;
        }
        this.targets = next;
        if (next.mode !== prev.mode) {
            this.listeners.forEach((fn) => fn());
        }
    }

    /** High-frequency writers skip object churn and notifications. */
    setProgress(p: number) {
        this.targets.progress = p;
    }
}

export const sceneBus = new SceneBus();
