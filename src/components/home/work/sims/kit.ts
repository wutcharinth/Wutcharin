import { createContext, useContext, useEffect, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Shared helpers for the Work chapter's product simulations: a black and
 * white palette that follows the site theme, motion helpers, and procedural
 * PBR Albedo + Roughness textures for tactile monochrome surfaces.
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
    /** Matching stage background hex for seamless studio fog. */
    bg: string;
    /** Whether the current palette is light ("Daylight Console"). */
    light: boolean;
};

export const DARK: Palette = {
    ink: '#f5f5f5',
    soft: '#bdbdbd',
    mid: '#737373',
    faint: '#2a2a2a',
    fill: '#141416',
    paper: '#ecece9',
    print: '#141416',
    bg: '#050505',
    light: false,
};

export const LIGHT: Palette = {
    ink: '#0a0a0a',
    soft: '#3f3f3f',
    mid: '#8a8a8a',
    faint: '#d0d0d0',
    fill: '#ffffff',
    paper: '#ffffff',
    print: '#141416',
    bg: '#f5f5f5',
    light: true,
};

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

/** A CanvasTexture drawn once per dependency set, properly disposed on change/unmount. */
export function useCanvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, deps: unknown[]) {
    const tex = useMemo(() => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        if (ctx) draw(ctx);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        return t;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    useEffect(() => () => tex.dispose(), [tex]);
    return tex;
}

/**
 * Procedural monochrome PBR surface (Albedo + Roughness) for architectural
 * floors, workbenches, and stone tabletops. Lightweight 512x512 repeating tile.
 */
export function useSurfaceMaps(
    kind: 'drafting' | 'stone' | 'terrazzo' | 'hall',
    light: boolean,
    repeat: [number, number] = [1, 1],
) {
    const [rx, ry] = repeat;
    const maps = useMemo(() => {
        const S = 512;
        const ac = document.createElement('canvas');
        ac.width = ac.height = S;
        const a = ac.getContext('2d');

        const rc = document.createElement('canvas');
        rc.width = rc.height = S;
        const r = rc.getContext('2d');

        if (a && r) {
            // Base fill — calibrated so soft PCF shadows read crisply in both dark & light themes
            a.fillStyle = light
                ? kind === 'stone'
                    ? '#e6e6e3'
                    : '#eaeae7'
                : kind === 'stone'
                  ? '#17171b'
                  : kind === 'terrazzo'
                    ? '#141418'
                    : '#111115';
            a.fillRect(0, 0, S, S);
            r.fillStyle = kind === 'terrazzo' ? '#7a7a7a' : kind === 'stone' ? '#929292' : '#a8a8a8';
            r.fillRect(0, 0, S, S);

            // Deterministic pseudo-random grain
            let seed = kind.charCodeAt(0) * 9973 + (light ? 13 : 37);
            const rand = () => {
                seed = (seed * 1664525 + 1013904223) >>> 0;
                return seed / 4294967296;
            };

            if (kind === 'drafting') {
                // Fine precision dot-grid + subtle architectural crosshairs
                a.strokeStyle = light ? 'rgba(0,0,0,0.065)' : 'rgba(255,255,255,0.055)';
                a.lineWidth = 1;
                for (let g = 0; g <= S; g += 64) {
                    a.beginPath();
                    a.moveTo(g, 0);
                    a.lineTo(g, S);
                    a.stroke();
                    a.beginPath();
                    a.moveTo(0, g);
                    a.lineTo(S, g);
                    a.stroke();
                }
                a.fillStyle = light ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.18)';
                for (let x = 0; x < S; x += 32) {
                    for (let y = 0; y < S; y += 32) {
                        a.fillRect(x - 0.5, y - 0.5, 1.5, 1.5);
                    }
                }
            } else if (kind === 'stone') {
                // Soft architectural dark-stone / honed concrete veins
                for (let i = 0; i < 900; i++) {
                    const x = rand() * S;
                    const y = rand() * S;
                    const rad = 1 + rand() * 8;
                    a.fillStyle = light
                        ? `rgba(0,0,0,${0.014 + rand() * 0.028})`
                        : `rgba(255,255,255,${0.014 + rand() * 0.032})`;
                    a.beginPath();
                    a.arc(x, y, rad, 0, Math.PI * 2);
                    a.fill();
                    r.fillStyle = `rgba(220,220,220,${0.06 + rand() * 0.14})`;
                    r.fillRect(x, y, rad * 1.4, rad * 0.8);
                }
            } else if (kind === 'terrazzo') {
                // Architectural plank / terrazzo sheen catching stage & candle reflections
                a.strokeStyle = light ? 'rgba(0,0,0,0.065)' : 'rgba(255,255,255,0.05)';
                a.lineWidth = 1;
                for (let y = 0; y < S; y += 64) {
                    a.beginPath();
                    a.moveTo(0, y);
                    a.lineTo(S, y);
                    a.stroke();
                }
                for (let i = 0; i < 450; i++) {
                    const x = rand() * S;
                    const y = rand() * S;
                    const sz = 1.5 + rand() * 3.5;
                    a.fillStyle = light
                        ? `rgba(0,0,0,${0.03 + rand() * 0.05})`
                        : `rgba(255,255,255,${0.025 + rand() * 0.055})`;
                    a.fillRect(x, y, sz, sz * 0.7);
                    r.fillStyle = `rgba(60,60,60,${0.12 + rand() * 0.2})`;
                    r.fillRect(x, y, sz * 2, sz * 2);
                }
            } else {
                // Acoustic hall floor with subtle radial sheen
                for (let i = 0; i < 500; i++) {
                    const x = rand() * S;
                    const y = rand() * S;
                    a.fillStyle = light ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)';
                    a.fillRect(x, y, 2, 2);
                }
            }
        }

        const map = new THREE.CanvasTexture(ac);
        map.colorSpace = THREE.SRGBColorSpace;
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.repeat.set(rx, ry);
        map.anisotropy = 4;

        const roughnessMap = new THREE.CanvasTexture(rc);
        roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
        roughnessMap.repeat.set(rx, ry);
        roughnessMap.anisotropy = 2;

        return { map, roughnessMap };
    }, [kind, light, rx, ry]);

    useEffect(() => {
        return () => {
            maps.map.dispose();
            maps.roughnessMap.dispose();
        };
    }, [maps]);

    return maps;
}

/** Smooth top-to-bottom alpha falloff texture for volumetric studio spotlight cones. */
export function useBeamTexture() {
    return useCanvasTexture(
        32,
        256,
        (c) => {
            const g = c.createLinearGradient(0, 0, 0, 256);
            g.addColorStop(0, 'rgba(255,255,255,0.95)');
            g.addColorStop(0.28, 'rgba(255,255,255,0.45)');
            g.addColorStop(0.75, 'rgba(255,255,255,0.12)');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            c.fillStyle = g;
            c.fillRect(0, 0, 32, 256);
        },
        [],
    );
}
