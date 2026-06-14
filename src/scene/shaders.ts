/**
 * Particle shaders as template strings — keeps the build free of GLSL
 * plugins. One draw call: positions come from two formation textures mixed
 * by a staggered morph, plus curl noise scaled by chaos.
 */

const SIMPLEX = /* glsl */ `
// Simplex 3D noise — Ashima Arts / Stefan Gustavson (MIT).
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

vec3 curl(vec3 p) {
    const float e = 0.1;
    float nx1 = snoise(p + vec3(0.0, e, 0.0));
    float nx2 = snoise(p - vec3(0.0, e, 0.0));
    float ny1 = snoise(p + vec3(0.0, 0.0, e));
    float ny2 = snoise(p - vec3(0.0, 0.0, e));
    float nz1 = snoise(p + vec3(e, 0.0, 0.0));
    float nz2 = snoise(p - vec3(e, 0.0, 0.0));
    return normalize(vec3(nx1 - nx2, ny1 - ny2, nz1 - nz2) + 0.0001);
}
`;

export const particleVertex = /* glsl */ `
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uMorph;
uniform float uChaos;
uniform float uTime;
uniform float uSize;
uniform float uDensity;
uniform vec3 uPointerWorld;
uniform float uRepel;

attribute vec2 aSeed;

varying float vRand;
varying float vFade;

${SIMPLEX}

void main() {
    vec4 a = texture2D(uTexA, aSeed);
    vec4 b = texture2D(uTexB, aSeed);
    vRand = b.w;

    // Ambient mode thins the field: culled particles collapse to size 0.
    float keep = step(vRand, uDensity);

    // Staggered morph — each particle departs on its own offset so formation
    // changes cascade instead of snapping.
    float stag = fract(aSeed.x * 7.13 + aSeed.y * 3.71 + vRand);
    float m = clamp(uMorph * 1.65 - stag * 0.65, 0.0, 1.0);
    m = m * m * (3.0 - 2.0 * m);
    vec3 pos = mix(a.xyz, b.xyz, m);

    // Culled particles skip every expensive per-vertex op (noise + repulsion).
    if (keep > 0.5) {
        // Chaos drift — three simplex samples (cheaper than a full curl).
        float amp = uChaos * 2.2;
        if (amp > 0.001) {
            float t = uTime * 0.05;
            vec3 q = pos * 0.16;
            vec3 drift = vec3(
                snoise(q + vec3(0.0, 0.0, t)),
                snoise(q + vec3(31.4, 0.0, t)),
                snoise(q + vec3(0.0, 62.8, t))
            );
            pos += drift * amp * (0.5 + 0.8 * vRand);
        }

        // Pointer repulsion — the field notices attention.
        vec3 away = pos - uPointerWorld;
        float force = exp(-dot(away, away) * 0.14) * uRepel;
        pos += normalize(away + 0.0001) * force;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float depth = -mvPosition.z;
    vFade = smoothstep(34.0, 10.0, depth);

    gl_Position = projectionMatrix * mvPosition;
    // Small, crisp sprites — additive overdraw was the lag. Hard-capped so a
    // near particle can never blow up into a screen-filling blob.
    float size = keep * uSize * (0.7 + 0.7 * vRand) * (42.0 / max(depth, 0.001));
    gl_PointSize = clamp(size, 0.0, 6.0);
}
`;

export const particleFragment = /* glsl */ `
precision highp float;

uniform vec3 uColorBase;
uniform vec3 uAccent;
uniform float uOpacity;
uniform float uGlow;

varying float vRand;
varying float vFade;

void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.06, d);
    if (disc < 0.01) discard;

    // Brightest particles take the accent; the rest stay near-base. Additive
    // blending over the void floor gives the glow without post-processing.
    // Core add kept small so dense clusters don't accumulate to a white-out.
    vec3 col = mix(uColorBase, uAccent, smoothstep(0.55, 0.95, vRand));
    float core = smoothstep(0.18, 0.0, d) * 0.42;
    col += core;

    // uGlow scales emitted brightness (additive) — the live brightness knob.
    gl_FragColor = vec4(col * uGlow, disc * uOpacity * (0.3 + 0.6 * vFade) * (0.4 + 0.5 * vRand));
}
`;
