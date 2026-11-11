import type { FormationKey } from './formations';

/**
 * Frame-rate-safe scene state. Routes and scroll handlers write targets here;
 * the R3F frame loop reads and lerps toward them directly — zero React
 * re-renders per frame. React only subscribes to coarse state (mode) via
 * useSyncExternalStore.
 */

export type SceneMode = 'full' | 'ambient' | 'hidden';

export interface SceneTargets {
    formation: FormationKey;
    /** Hex accent the field tints toward. */
    accent: string;
    mode: SceneMode;
    /** 0 = fully resolved pattern, 1 = pure noise. */
    chaos: number;
    /** Page scroll progress 0..1 — drives the camera dolly. */
    progress: number;
    /** Pointer repulsion strength multiplier (1 = default). */
    repel: number;
}

const DEFAULTS: SceneTargets = {
    formation: 'noise',
    accent: '#a78bfa',
    mode: 'hidden',
    chaos: 1,
    progress: 0,
    repel: 1,
};

class SceneBus {
    targets: SceneTargets = { ...DEFAULTS };
    /** Bumped whenever the target formation changes — the field watches this. */
    revision = 0;
    /** Pointer in NDC (-1..1), written by the canvas host, read per frame. */
    pointer = { x: 0, y: 0 };
    /**
     * World to viewport-% projector through the live camera, published by
     * CameraRig while the canvas is mounted. DOM overlays use it so labels
     * stay registered through parallax and depth.
     */
    project: ((x: number, y: number, z: number) => [number, number]) | null = null;

    private listeners = new Set<() => void>();

    subscribe = (fn: () => void) => {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    };

    /** Style previews: the default brand accent can be re-pointed to another hue. */
    private brand: { from: string; to: string } | null = null;
    /** Accent for the dark-on-light particle ink; null keeps the original. */
    lightAccent: string | null = null;
    setBrand(from: string, to: string) {
        this.brand = { from: from.toLowerCase(), to };
        if (this.targets.accent.toLowerCase() === this.brand.from) this.targets = { ...this.targets, accent: to };
    }

    /** Apply new targets (route mounts, scroll chapters, hover reactions). */
    apply(partial: Partial<SceneTargets>) {
        const prev = this.targets;
        if (this.brand && partial.accent && partial.accent.toLowerCase() === this.brand.from) partial = { ...partial, accent: this.brand.to };
        const next = { ...prev, ...partial };
        if (partial.formation && partial.formation !== prev.formation) {
            this.revision++;
        }
        this.targets = next;
        if (next.mode !== prev.mode) {
            this.listeners.forEach((fn) => fn());
        }
    }

    /**
     * A formation's source just became available (sampled shapes load
     * async). If the bus is already pointing at it, force a retarget.
     */
    invalidate(key: FormationKey) {
        if (this.targets.formation === key) this.revision++;
    }

    /** High-frequency writers skip object churn and notifications. */
    setProgress(p: number) {
        this.targets.progress = p;
    }
}

export const sceneBus = new SceneBus();
