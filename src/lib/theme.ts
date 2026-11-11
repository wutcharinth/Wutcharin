import { useSyncExternalStore } from 'react';
import { sceneBus } from '../scene/sceneBus';

/**
 * Theme store. Drives the `light` class on <html> (CSS variables flip there)
 * and a small subscriber set so React + the WebGL scene react to changes.
 * Default is dark — the brand. Choice persists to localStorage.
 */

export type Theme = 'dark' | 'light';

const KEY = 'wt-theme';
const listeners = new Set<() => void>();

/**
 * Style previews: ?style=<name> re-points the brand tokens (index.css,
 * "Style previews"). Preview only: it is read from the URL, never stored,
 * and with no parameter the site is the original Midnight Console.
 */
export const STYLES = ['ember', 'paper', 'phosphor', 'ultramarine', 'stopmotion'] as const;
export type StyleId = (typeof STYLES)[number] | null;

function readStyle(): StyleId {
    if (typeof window === 'undefined') return null;
    const s = new URLSearchParams(window.location.search).get('style');
    return (STYLES as readonly string[]).includes(s ?? '') ? (s as StyleId) : null;
}
export const style: StyleId = readStyle();

function read(): Theme {
    if (typeof window === 'undefined') return 'dark';
    // Paper & Ink is a light-first style.
    if (style === 'paper' || style === 'stopmotion') return 'light';
    return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark';
}

let current: Theme = read();

/** The Midnight Console's violet: scenes ask for it by this value. */
const MIDNIGHT_SIGNAL = '#a78bfa';

function apply(theme: Theme) {
    const html = document.documentElement;
    html.classList.toggle('light', theme === 'light');
    if (style) {
        html.dataset.style = style;
        // The particle field takes hex colours, so hand it the style's signal.
        const hex = getComputedStyle(html).getPropertyValue('--color-signal').trim();
        if (/^#[0-9a-f]{6}$/i.test(hex)) {
            sceneBus.setBrand(MIDNIGHT_SIGNAL, hex);
            sceneBus.lightAccent = hex;
        }
    }
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
    if (typeof window !== 'undefined' && !style) localStorage.setItem(KEY, theme);
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
