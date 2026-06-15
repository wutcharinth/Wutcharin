import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneBus } from './sceneBus';
import { bakeFormation, type FormationId } from './formations';
import { particleVertex, particleFragment } from './shaders';

const MODE_OPACITY = { full: 1.0, ambient: 0.4, hidden: 0 } as const;
const MODE_DENSITY = { full: 1, ambient: 0.18, hidden: 0.18 } as const;
const MODE_TIMESCALE = { full: 1, ambient: 0.45, hidden: 0 } as const;
const MORPH_SECONDS = 1.15;

// Field brightness multiplier (additive). Baked default plus a live override:
// append ?glow=1.8 to any URL to tune it in real time, then tell me the value
// to bake in. Clamped to a sane range.
const GLOW_DEFAULT = 2.5;
const GLOW = (() => {
    if (typeof window === 'undefined') return GLOW_DEFAULT;
    const raw = parseFloat(new URLSearchParams(window.location.search).get('glow') ?? '');
    return Number.isFinite(raw) ? Math.min(4, Math.max(0.2, raw)) : GLOW_DEFAULT;
})();

function makeTexture(id: FormationId, size: number) {
    const tex = new THREE.DataTexture(bakeFormation(id, size), size, size, THREE.RGBAFormat, THREE.FloatType);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    return tex;
}

export default function ParticleField({ texSize, light = false }: { texSize: number; light?: boolean }) {
    const { camera } = useThree();
    const material = useRef<THREE.ShaderMaterial>(null);

    // Formations bake lazily and stay cached for the canvas lifetime.
    const cache = useMemo(() => new Map<FormationId, THREE.DataTexture>(), []);
    const getTexture = (id: FormationId) => {
        let tex = cache.get(id);
        if (!tex) {
            tex = makeTexture(id, texSize);
            cache.set(id, tex);
        }
        return tex;
    };

    const { geometry, uniforms } = useMemo(() => {
        const count = texSize * texSize;
        const geometry = new THREE.BufferGeometry();
        // Positions live in the formation textures; the attribute only sets draw count.
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
        const seeds = new Float32Array(count * 2);
        for (let i = 0; i < texSize; i++) {
            for (let j = 0; j < texSize; j++) {
                const o = (i * texSize + j) * 2;
                seeds[o] = (j + 0.5) / texSize;
                seeds[o + 1] = (i + 0.5) / texSize;
            }
        }
        geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 2));
        geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30);

        const initial = getTexture(sceneBus.targets.formation);
        const uniforms = {
            uTexA: { value: initial },
            uTexB: { value: initial },
            uMorph: { value: 1 },
            uChaos: { value: sceneBus.targets.chaos },
            uTime: { value: 0 },
            uSize: { value: texSize >= 160 ? 0.9 : texSize >= 112 ? 1.15 : 1.7 },
            uDensity: { value: 1 },
            uPointerWorld: { value: new THREE.Vector3(0, 0, -50) },
            uRepel: { value: 0 },
            uColorBase: { value: new THREE.Color('#8e9bb8').multiplyScalar(0.55) },
            uAccent: { value: new THREE.Color(sceneBus.targets.accent) },
            uOpacity: { value: 0 },
            uGlow: { value: GLOW },
            uLight: { value: light ? 1 : 0 },
        };
        return { geometry, uniforms };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [texSize]);

    const local = useRef({
        revision: sceneBus.revision,
        chaosPulse: 0,
        accent: new THREE.Color(sceneBus.targets.accent),
        accentTarget: new THREE.Color(sceneBus.targets.accent),
        accentHex: sceneBus.targets.accent,
        pointer: new THREE.Vector3(0, 0, -50),
        ray: new THREE.Vector3(),
    });

    // Theme swap: additive glow on dark, normal-blended dark specks on light.
    useEffect(() => {
        const m = material.current;
        if (!m) return;
        m.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
        m.needsUpdate = true;
        uniforms.uLight.value = light ? 1 : 0;
    }, [light, uniforms]);

    useFrame((_, rawDelta) => {
        const u = uniforms;
        const t = sceneBus.targets;
        const l = local.current;
        const delta = Math.min(rawDelta, 1 / 20);

        // Formation retarget. If a morph is mid-flight, snap its target into
        // the base slot and let the chaos pulse mask the cut.
        if (l.revision !== sceneBus.revision) {
            l.revision = sceneBus.revision;
            if (u.uMorph.value < 1) {
                u.uTexA.value = u.uTexB.value;
                l.chaosPulse = Math.max(l.chaosPulse, 0.5);
            } else {
                u.uTexA.value = u.uTexB.value;
            }
            u.uTexB.value = getTexture(t.formation);
            u.uMorph.value = 0;
            l.chaosPulse = Math.max(l.chaosPulse, 0.3);
        }

        u.uMorph.value = Math.min(1, u.uMorph.value + delta / MORPH_SECONDS);
        l.chaosPulse = Math.max(0, l.chaosPulse - delta * 0.7);

        const chaosTarget = Math.min(1.2, t.chaos + l.chaosPulse);
        u.uChaos.value += (chaosTarget - u.uChaos.value) * Math.min(1, delta * 4);

        u.uTime.value += delta * MODE_TIMESCALE[t.mode];

        const opacityTarget = MODE_OPACITY[t.mode];
        u.uOpacity.value += (opacityTarget - u.uOpacity.value) * Math.min(1, delta * 3);

        const densityTarget = MODE_DENSITY[t.mode];
        u.uDensity.value += (densityTarget - u.uDensity.value) * Math.min(1, delta * 3);

        if (l.accentHex !== t.accent) {
            l.accentHex = t.accent;
            l.accentTarget.set(t.accent);
        }
        l.accent.lerp(l.accentTarget, Math.min(1, delta * 3.5));
        (u.uAccent.value as THREE.Color).copy(l.accent);

        // Project the pointer onto the z=0 plane for the repulsion field.
        l.ray.set(sceneBus.pointer.x, sceneBus.pointer.y, 0.5).unproject(camera).sub(camera.position).normalize();
        const reach = -camera.position.z / (l.ray.z || -1);
        if (reach > 0) {
            l.pointer.copy(camera.position).addScaledVector(l.ray, reach);
        }
        (u.uPointerWorld.value as THREE.Vector3).lerp(l.pointer, Math.min(1, delta * 6));
        const repelTarget = t.mode === 'full' ? 1.6 : 0;
        u.uRepel.value += (repelTarget - u.uRepel.value) * Math.min(1, delta * 3);
    });

    return (
        <points geometry={geometry} frustumCulled={false}>
            <shaderMaterial
                ref={material}
                vertexShader={particleVertex}
                fragmentShader={particleFragment}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={light ? THREE.NormalBlending : THREE.AdditiveBlending}
            />
        </points>
    );
}
