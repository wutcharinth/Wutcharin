import { useSyncExternalStore } from 'react';

/**
 * Coordinates first-visit BootLoader dismissal with Arrival's typography
 * entrance so the wordmark rises right as the curtain lifts (never hidden
 * behind it, and with zero dead delay on repeat visits or reduced motion).
 */

export const BOOT_KEY = 'wt-booted';

function initialBooted(): boolean {
    if (typeof window === 'undefined') return true;
    try {
        if (sessionStorage.getItem(BOOT_KEY)) return true;
    } catch {
        /* storage blocked: treat as first visit */
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let booted = initialBooted();
const listeners = new Set<() => void>();

export function isBooted(): boolean {
    return booted;
}

export function markBooted() {
    if (booted) return;
    booted = true;
    listeners.forEach((fn) => fn());
}

export function useBootReady(): boolean {
    return useSyncExternalStore(
        (fn) => {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },
        () => booted,
        () => true,
    );
}
