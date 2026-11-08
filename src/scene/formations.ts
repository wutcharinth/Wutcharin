/**
 * Formation bakers — pure CPU functions that produce the particle target
 * positions for each named formation. Positions are packed into RGBA float
 * arrays (xyz = position, w = per-particle random) and uploaded once as
 * DataTextures; the vertex shader morphs between two of them.
 *
 * Deterministic by design: a seeded PRNG keeps every bake identical across
 * mounts, so scroll scrubbing and route restores never reshuffle the world.
 */

export type FormationId = 'noise' | 'wave' | 'lattice' | 'network' | 'helix' | 'terminus' | 'triage' | 'route';

export const FORMATIONS: FormationId[] = ['noise', 'wave', 'lattice', 'network', 'helix', 'terminus', 'triage', 'route'];

/**
 * Any formation the field can take: a procedural bake above, or a sampled
 * shape (portrait, a numeral, an address) registered at runtime in
 * `sampled.ts` under a `~` key.
 */
export type FormationKey = FormationId | `~${string}`;

export function isProcedural(key: FormationKey): key is FormationId {
    return (FORMATIONS as string[]).includes(key);
}

/**
 * Career waypoints for the 'route' formation, in world units. Exported so
 * the Flight Log chapter can pin DOM boarding passes to the same points.
 */
export const ROUTE_WAYPOINTS: ReadonlyArray<readonly [number, number]> = [
    [-7.4, 0.3],
    [-4.7, -0.5],
    [-1.9, 0.6],
    [1.3, -1.9],
    [4.3, 0.2],
    [7.3, 2.4],
];

/**
 * A point along the career route, u in [0, legs]. Shares the arc maths with
 * the 'route' bake so DOM overlays register exactly with the particles.
 */
export function routePoint(u: number): [number, number, number] {
    const legs = ROUTE_WAYPOINTS.length - 1;
    const c = Math.min(legs, Math.max(0, u));
    const leg = Math.min(legs - 1, Math.floor(c));
    const s = c - leg;
    const [ax, ay] = ROUTE_WAYPOINTS[leg];
    const [bx, by] = ROUTE_WAYPOINTS[leg + 1];
    const lift = routeLift(ax, ay, bx, by);
    return [ax + (bx - ax) * s, ay + (by - ay) * s + Math.sin(s * Math.PI) * lift, Math.sin(s * Math.PI) * 0.8];
}

function routeLift(ax: number, ay: number, bx: number, by: number) {
    return 0.6 + Math.hypot(bx - ax, by - ay) * 0.12;
}

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
            case 'triage': {
                // Exceptions deserve people, patterns deserve code: one dense
                // stream enters from the left and splits. Most of it settles
                // into a strict ordered lane; a few bright outliers peel away.
                const k = rand();
                if (t < 0.34) {
                    // Inflow: a tight band, slightly turbulent.
                    x = -9.5 + k * 9.5;
                    y = gauss(rand) * 0.45 + Math.sin(k * 9) * 0.12;
                    z = gauss(rand) * 0.5;
                } else if (t < 0.95) {
                    // Patterns lane: tidy rows, the shape of automation.
                    const row = Math.floor(rand() * 5);
                    const col = Math.floor(rand() * 46);
                    const ease = Math.min(1, col / 8);
                    x = 0.2 + col * 0.2;
                    y = ease * (1.5 + row * 0.32) + (1 - ease) * gauss(rand) * 0.3;
                    z = (row - 2) * 0.05;
                } else {
                    // Exceptions lane: a loose, luminous scatter heading down.
                    const s = rand();
                    x = 0.6 + s * 7.5 + gauss(rand) * 0.5;
                    y = -0.6 - s * 2.4 + gauss(rand) * 0.55;
                    z = gauss(rand) * 0.9;
                    const o = i * 4;
                    data[o] = x;
                    data[o + 1] = y;
                    data[o + 2] = z;
                    // Force the accent band in the fragment shader.
                    data[o + 3] = 0.9 + rand() * 0.1;
                    continue;
                }
                break;
            }
            case 'route': {
                // Flight log: great-circle style arcs between career waypoints,
                // with each airport a bright cluster.
                const legs = ROUTE_WAYPOINTS.length - 1;
                if (rand() < 0.22) {
                    const [wx, wy] = ROUTE_WAYPOINTS[Math.floor(rand() * ROUTE_WAYPOINTS.length)];
                    const ang = rand() * Math.PI * 2;
                    const rad = Math.abs(gauss(rand)) * 0.32;
                    x = wx + Math.cos(ang) * rad;
                    y = wy + Math.sin(ang) * rad;
                    z = gauss(rand) * 0.15;
                } else {
                    const leg = Math.floor(rand() * legs);
                    const [ax, ay] = ROUTE_WAYPOINTS[leg];
                    const [bx, by] = ROUTE_WAYPOINTS[leg + 1];
                    // Dashed: only keep particles on the "on" part of each dash.
                    let s = rand();
                    s = Math.floor(s * 22) / 22 + (rand() * 0.6) / 22;
                    const lift = routeLift(ax, ay, bx, by);
                    x = ax + (bx - ax) * s;
                    y = ay + (by - ay) * s + Math.sin(s * Math.PI) * lift;
                    z = Math.sin(s * Math.PI) * 0.8 + gauss(rand) * 0.04;
                }
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
