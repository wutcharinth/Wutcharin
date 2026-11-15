import { createContext, useContext, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Shared helpers for the Work chapter's product simulations: a black and
 * white palette that follows the site theme, and small motion helpers.
 * The frame and controls live in frame.tsx.
 */

export type Palette = {
    /** Strongest mark: outlines, lit objects. */
    ink: string;
    soft: string;
    mid: string;
    faint: string;
    /** Object fill: a step off the page so solids read as solids. */
    fill: string;
    /** Paper: documents, receipts, screens. */
    paper: string;
    /** Marks printed on paper. */
    print: string;
};

export const DARK: Palette = { ink: '#f5f5f5', soft: '#bdbdbd', mid: '#737373', faint: '#2a2a2a', fill: '#141414', paper: '#e8e8e8', print: '#1a1a1a' };
export const LIGHT: Palette = { ink: '#0a0a0a', soft: '#3f3f3f', mid: '#8a8a8a', faint: '#d0d0d0', fill: '#ffffff', paper: '#ffffff', print: '#1a1a1a' };

export const PaletteContext = createContext<Palette>(DARK);
export const usePalette = () => useContext(PaletteContext);

export type SimProps = {
    /** The frame loop runs only while the simulation is on screen. */
    running: boolean;
    /** Phone layout: fewer objects, larger touch targets. */
    compact: boolean;
};

/** Smoothstep-ish ease, clamped. */
export const ease = (t: number) => {
    const x = Math.min(1, Math.max(0, t));
    return x * x * (3 - 2 * x);
};

/** A point on a lifted arc from a to b at t (0..1). */
export function arc(out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, lift: number, t: number) {
    const e = ease(t);
    out.lerpVectors(a, b, e);
    out.y += Math.sin(Math.PI * e) * lift;
    return out;
}

/** A CanvasTexture drawn once per palette. */
export function useCanvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, deps: unknown[]) {
    return useMemo(() => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        if (ctx) draw(ctx);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        return tex;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

