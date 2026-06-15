import { useSyncExternalStore } from 'react';

/**
 * Theme store. Drives the `light` class on <html> (CSS variables flip there)
 * and a small subscriber set so React + the WebGL scene react to changes.
 * Default is dark — the brand. Choice persists to localStorage.
 */

export type Theme = 'dark' | 'light';

const KEY = 'wt-theme';
const listeners = new Set<() => void>();

function read(): Theme {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark';
}

let current: Theme = read();

function apply(theme: Theme) {
    const html = document.documentElement;
    html.classList.toggle('light', theme === 'light');
}

/** Call once on boot, before first paint, to set the class without a flash. */
export function initTheme() {
    if (typeof window === 'undefined') return;
    apply(current);
    // Enable transitions only after the initial class is set.
    requestAnimationFrame(() => document.documentElement.classList.add('theme-ready'));
}

export function setTheme(theme: Theme) {
    current = theme;
    if (typeof window !== 'undefined') localStorage.setItem(KEY, theme);
    apply(theme);
    listeners.forEach((fn) => fn());
}

export function toggleTheme() {
    setTheme(current === 'dark' ? 'light' : 'dark');
}

export function useTheme(): Theme {
    return useSyncExternalStore(
        (fn) => {
            listeners.add(fn);
            return () => listeners.delete(fn);
        },
        () => current,
        () => 'dark',
    );
}
