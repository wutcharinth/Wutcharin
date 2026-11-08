import { sceneBus } from './sceneBus';
import type { FormationKey } from './formations';

/**
 * Sampled formations: the field assembles into an image or a line of type.
 *
 * A density map (0..1 per pixel) is sampled into particle targets with a
 * seeded CDF walk, so the bake is deterministic. Providers register under a
 * `~`-prefixed key; the bake itself is deferred to the particle field (it
 * knows the texture size). Registering the key the bus is currently pointing
 * at bumps the revision so a formation requested before its source finished
 * loading lands as soon as it is ready.
 *
 * Deliberately free of three.js: chapters import this from the main bundle
 * while the WebGL engine stays in its own lazy chunk.
 */

export type Placement = {
    /** World-space centre of the shape. */
    cx: number;
    cy: number;
    /** World-space height the shape is fitted to. */
    height: number;
    /** Relief: bright pixels come forward by up to this many units. */
    depth?: number;
    /** Fraction of particles left as ambient dust around the shape. */
    dust?: number;
};

type DensityMap = { data: Float32Array; width: number; height: number };
type Provider = (count: number) => Float32Array;

const providers = new Map<string, Provider>();
const pending = new Map<string, Promise<void>>();

export function getSampledProvider(key: string): Provider | undefined {
    return providers.get(key);
}

function register(key: FormationKey, provider: Provider) {
    providers.set(key, provider);
    sceneBus.invalidate(key);
}

/** mulberry32: a tiny deterministic PRNG. */
function prng(seed: number) {
    let a = seed >>> 0;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function hash(s: string) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
}

function sampleDensity(map: DensityMap, place: Placement, count: number, seed: number): Float32Array {
    const { data, width, height } = map;
    const cdf = new Float32Array(data.length);
    let total = 0;
    for (let i = 0; i < data.length; i++) {
        total += data[i];
        cdf[i] = total;
    }
    const out = new Float32Array(count * 4);
    const rand = prng(seed);
    const scale = place.height / height;
    const dust = place.dust ?? 0.04;
    const depth = place.depth ?? 0.6;

    for (let i = 0; i < count; i++) {
        let x: number;
        let y: number;
        let z: number;
        if (total <= 0 || rand() < dust) {
            // Ambient dust: a loose halo so the shape sits inside a field,
            // not on an empty stage.
            const g = () => (rand() + rand() + rand() + rand() - 2) / 2;
            x = place.cx + g() * place.height * 0.9;
            y = place.cy + g() * place.height * 0.6;
            z = g() * 2.4;
        } else {
            const target = rand() * total;
            let lo = 0;
            let hi = cdf.length - 1;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                if (cdf[mid] < target) lo = mid + 1;
                else hi = mid;
            }
            const px = (lo % width) + rand();
            const py = Math.floor(lo / width) + rand();
            x = place.cx + (px - width / 2) * scale;
            y = place.cy + (height / 2 - py) * scale;
            z = (data[lo] - 0.5) * depth + (rand() - 0.5) * 0.12;
        }
        const o = i * 4;
        out[o] = x;
        out[o + 1] = y;
        out[o + 2] = z;
        out[o + 3] = rand();
    }
    return out;
}

function densityFromCanvas(ctx: CanvasRenderingContext2D, w: number, h: number, channel: 'alpha' | 'luma'): DensityMap {
    const px = ctx.getImageData(0, 0, w, h).data;
    const data = new Float32Array(w * h);
    for (let i = 0; i < data.length; i++) {
        data[i] = channel === 'alpha' ? px[i * 4 + 3] / 255 : px[i * 4] / 255;
    }
    return { data, width: w, height: h };
}

function once(key: string, job: () => Promise<void>) {
    if (providers.has(key)) return Promise.resolve();
    let p = pending.get(key);
    if (!p) {
        p = job().catch(() => {
            /* Source failed: the field simply stays on its previous formation. */
        });
        pending.set(key, p);
    }
    return p;
}

/** A grayscale density image (bright = dense), e.g. the portrait map. */
export function ensureImageFormation(key: FormationKey, src: string, place: Placement) {
    return once(key, async () => {
        const img = new Image();
        img.decoding = 'async';
        img.src = src;
        await img.decode();
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const map = densityFromCanvas(ctx, w, h, 'luma');
        register(key, (count) => sampleDensity(map, place, count, hash(key)));
    });
}

/** A line of display type, set in Clash Display, fitted to `place.height`. */
export function ensureTextFormation(key: FormationKey, text: string, place: Placement & { maxWidth?: number }) {
    return once(key, async () => {
        const font = '600 160px "Clash Display"';
        try {
            await document.fonts.load(font, text);
        } catch {
            /* Fall back to whatever face resolves; the shape still reads. */
        }
        const measure = document.createElement('canvas').getContext('2d');
        if (!measure) return;
        measure.font = font;
        const m = measure.measureText(text);
        const pad = 12;
        const w = Math.ceil(m.width) + pad * 2;
        const h = 200;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.font = font;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(text, pad, h / 2 + 8);
        const map = densityFromCanvas(ctx, w, h, 'alpha');
        // Wide strings shrink to fit maxWidth instead of overflowing the view.
        let height = place.height;
        if (place.maxWidth) {
            const worldW = (w / h) * height;
            if (worldW > place.maxWidth) height *= place.maxWidth / worldW;
        }
        register(key, (count) => sampleDensity(map, { ...place, height, depth: place.depth ?? 0.3 }, count, hash(key)));
    });
}

/**
 * A world point in viewport percent: through the live camera when the
 * field is running, else the static z=0 mapping.
 */
export function projectWorld(x: number, y: number, z = 0): [number, number] {
    if (sceneBus.project) return sceneBus.project(x, y, z);
    const { halfW, halfH } = worldExtents();
    return [50 + (x / (2 * halfW)) * 100, 50 - (y / (2 * halfH)) * 100];
}

/** Visible world extents on the z=0 plane, matching CameraRig (z = 14). */
export function worldExtents() {
    const z = 14;
    const halfH = z * Math.tan((50 / 2) * (Math.PI / 180));
    const aspect = window.innerWidth / Math.max(1, window.innerHeight);
    return { halfH, halfW: halfH * aspect, aspect };
}
