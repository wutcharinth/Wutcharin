/**
 * Formation bakers — pure CPU functions that produce the particle target
 * positions for each named formation. Positions are packed into RGBA float
 * arrays (xyz = position, w = per-particle random) and uploaded once as
 * DataTextures; the vertex shader morphs between two of them.
 *
 * Deterministic by design: a seeded PRNG keeps every bake identical across
 * mounts, so scroll scrubbing and route restores never reshuffle the world.
 */

export type FormationId = 'noise' | 'wave' | 'lattice' | 'network' | 'helix' | 'terminus';

export const FORMATIONS: FormationId[] = ['noise', 'wave', 'lattice', 'network', 'helix', 'terminus'];

/** mulberry32 — tiny deterministic PRNG. */
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

/** Approximate gaussian from summed uniforms. */
function gauss(rand: () => number) {
    return (rand() + rand() + rand() + rand() - 2) / 2;
}

export function bakeFormation(id: FormationId, size: number): Float32Array {
    const count = size * size;
    const data = new Float32Array(count * 4);
    const rand = prng(0xc0ffee ^ (FORMATIONS.indexOf(id) * 7919));

    for (let i = 0; i < count; i++) {
        let x = 0;
        let y = 0;
        let z = 0;
        const t = i / count;

        switch (id) {
            case 'noise': {
                // Raw data: an undifferentiated gaussian cloud.
                x = gauss(rand) * 5.4;
                y = gauss(rand) * 3.6;
                z = gauss(rand) * 3.2;
                break;
            }
            case 'wave': {
                // First structure: a sine-displaced sheet.
                const gx = (i % size) / (size - 1);
                const gy = Math.floor(i / size) / (size - 1);
                x = (gx - 0.5) * 17;
                y = (gy - 0.5) * 9;
                z = Math.sin(gx * Math.PI * 3.2) * Math.cos(gy * Math.PI * 2.1) * 1.6 + Math.sin(gy * Math.PI * 4.4) * 0.5;
                break;
            }
            case 'lattice': {
                // Patterns deserve code: a strict cubic grid.
                const side = Math.ceil(Math.cbrt(count));
                const ix = i % side;
                const iy = Math.floor(i / side) % side;
                const iz = Math.floor(i / (side * side));
                const s = 8.4 / side;
                x = (ix - (side - 1) / 2) * s * 1.6;
                y = (iy - (side - 1) / 2) * s;
                z = (iz - (side - 1) / 2) * s;
                break;
            }
            case 'network': {
                // Clustered node-graph: hubs plus points strung along edges.
                const hubCount = 12;
                const hub = (n: number) => {
                    const r = prng(0xabcdef ^ (n * 104729));
                    return [
                        (r() - 0.5) * 13,
                        (r() - 0.5) * 7.5,
                        (r() - 0.5) * 5,
                    ] as const;
                };
                if (rand() < 0.62) {
                    const [hx, hy, hz] = hub(Math.floor(rand() * hubCount));
                    x = hx + gauss(rand) * 0.55;
                    y = hy + gauss(rand) * 0.55;
                    z = hz + gauss(rand) * 0.55;
                } else {
                    const [ax, ay, az] = hub(Math.floor(rand() * hubCount));
                    const [bx, by, bz] = hub(Math.floor(rand() * hubCount));
                    const k = rand();
                    x = ax + (bx - ax) * k + gauss(rand) * 0.07;
                    y = ay + (by - ay) * k + gauss(rand) * 0.07;
                    z = az + (bz - az) * k + gauss(rand) * 0.07;
                }
                break;
            }
            case 'helix': {
                // The timeline column: a double helix with sparse rungs.
                const turns = 2.6;
                const angle = t * Math.PI * 2 * turns;
                const strand = i % 2 === 0 ? 0 : Math.PI;
                const radius = 2.4;
                const py = (t - 0.5) * 11;
                if (rand() < 0.08) {
                    const k = rand();
                    x = Math.cos(angle) * radius * (1 - 2 * k);
                    z = Math.sin(angle) * radius * (1 - 2 * k);
                    y = py;
                } else {
                    x = Math.cos(angle + strand) * radius + gauss(rand) * 0.1;
                    z = Math.sin(angle + strand) * radius + gauss(rand) * 0.1;
                    y = py + gauss(rand) * 0.08;
                }
                break;
            }
            case 'terminus': {
                // Convergence: a fibonacci sphere, slightly breathing.
                const golden = Math.PI * (3 - Math.sqrt(5));
                const yy = 1 - (i / (count - 1)) * 2;
                const r = Math.sqrt(Math.max(0, 1 - yy * yy));
                const theta = golden * i;
                const radius = 4.3 + gauss(rand) * 0.12;
                x = Math.cos(theta) * r * radius;
                y = yy * radius * 0.92;
                z = Math.sin(theta) * r * radius;
                break;
            }
        }

        const o = i * 4;
        data[o] = x;
        data[o + 1] = y;
        data[o + 2] = z;
        data[o + 3] = rand();
    }

    return data;
}
