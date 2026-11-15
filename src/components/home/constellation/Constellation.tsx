import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../../lib/theme';
import { DARK, LIGHT, PaletteContext, usePalette } from '../work/sims/kit';
import { DOMAINS } from '../agents';

/**
 * Fig. 00, the hero: the team's agents as a slowly turning constellation.
 * Four domain hubs, the agents around each, threads between them, and light
 * travelling the threads like traffic. Pointing at a node (or tapping it)
 * names it; left alone, the constellation names one agent after another.
 * Black and white in both themes: light on the dark stage, ink on paper.
 */

type Node = {
    name: string;
    domain: string;
    pos: THREE.Vector3;
    hub: boolean;
    domainIndex: number;
};
type Edge = [number, number, 'spoke' | 'ring' | 'cross'];

function prng(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Hubs on a tetrahedron, agents on a shell around their hub; fixed by seed. */
function layout() {
    const rand = prng(20261115);
    const corners = [
        new THREE.Vector3(0.0, 1.0, 0.35),
        new THREE.Vector3(-1.05, -0.45, 0.55),
        new THREE.Vector3(1.05, -0.4, 0.45),
        new THREE.Vector3(0.05, -0.2, -1.1),
    ];
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const hubIndex: number[] = [];
    DOMAINS.forEach((d, di) => {
        const hub = corners[di % corners.length].clone().multiplyScalar(1.05);
        hubIndex.push(nodes.length);
        nodes.push({
            name: d.name,
            domain: d.name,
            pos: hub,
            hub: true,
            domainIndex: di,
        });
        const n = d.agents.length;
        d.agents.forEach((name, k) => {
            // Golden-spiral directions, pushed away from the centre of the whole.
            const y = 1 - (2 * (k + 0.5)) / n;
            const r = Math.sqrt(1 - y * y);
            const phi = k * 2.399963 + di;
            const dir = new THREE.Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r);
            dir.add(hub.clone().normalize().multiplyScalar(0.9)).normalize();
            const pos = hub.clone().add(dir.multiplyScalar(0.5 + rand() * 0.28));
            const i = nodes.length;
            nodes.push({ name, domain: d.name, pos, hub: false, domainIndex: di });
            edges.push([hubIndex[di], i, 'spoke']);
        });
    });
    // The hubs are all connected.
    for (let a = 0; a < hubIndex.length; a++) for (let b = a + 1; b < hubIndex.length; b++) edges.push([hubIndex[a], hubIndex[b], 'ring']);
    // A few agents talk across domains.
    const agents = nodes.map((n, i) => (n.hub ? -1 : i)).filter((i) => i >= 0);
    let guard = 0;
    let made = 0;
    while (made < 9 && guard++ < 400) {
        const a = agents[Math.floor(rand() * agents.length)];
        const b = agents[Math.floor(rand() * agents.length)];
        if (nodes[a].domainIndex === nodes[b].domainIndex) continue;
        if (nodes[a].pos.distanceTo(nodes[b].pos) > 2.1) continue;
        if (edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) continue;
        edges.push([a, b, 'cross']);
        made++;
    }
    return { nodes, edges };
}

const { nodes: NODES, edges: EDGES } = layout();
const NEIGHBOURS: number[][] = NODES.map((_, i) => EDGES.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a)));
const AGENTS = NODES.map((n, i) => (n.hub ? -1 : i)).filter((i) => i >= 0);
const PULSES = 28;

/** A soft round glow, drawn once. */
function useGlowTexture() {
    return useMemo(() => {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d');
        if (g) {
            const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(0.25, 'rgba(255,255,255,0.45)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            g.fillStyle = grad;
            g.fillRect(0, 0, 64, 64);
        }
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }, []);
}

function Network({ active, onHover, light, compact }: { active: number | null; onHover: (i: number | null) => void; light: boolean; compact: boolean }) {
    const p = usePalette();
    const group = useRef<THREE.Group>(null);
    const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
    const glowRefs = useRef<Array<THREE.Sprite | null>>([]);
    const pulses = useRef<THREE.InstancedMesh>(null);
    const label = useRef<HTMLDivElement>(null);
    const flash = useRef(new Float32Array(NODES.length));
    const glow = useGlowTexture();
    const blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;

    const lines = useMemo(() => {
        const geo = (kinds: Edge[2][]) => {
            const pts: number[] = [];
            EDGES.forEach(([a, b, k]) => {
                if (!kinds.includes(k)) return;
                pts.push(...NODES[a].pos.toArray(), ...NODES[b].pos.toArray());
            });
            return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        };
        return {
            spokes: geo(['spoke']),
            ring: geo(['ring']),
            cross: geo(['cross']),
        };
    }, []);
    const lit = useMemo(() => {
        if (active === null) return null;
        const pts: number[] = [];
        NEIGHBOURS[active].forEach((j) => pts.push(...NODES[active].pos.toArray(), ...NODES[j].pos.toArray()));
        return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    }, [active]);

    // Each pulse walks the network: along an edge, then on from where it lands.
    const walk = useMemo(() => {
        const rand = prng(7);
        return Array.from({ length: PULSES }, () => {
            const e = EDGES[Math.floor(rand() * EDGES.length)];
            return { from: e[0], to: e[1], t: rand(), speed: 0.35 + rand() * 0.5 };
        });
    }, []);
    const tmp = useMemo(() => ({ m: new THREE.Object3D(), v: new THREE.Vector3(), w: new THREE.Vector3() }), []);

    useFrame((state, dt) => {
        const g = group.current;
        if (g) {
            g.rotation.y += dt * 0.07;
            g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.18 - state.pointer.y * 0.22, 2.5, dt);
            g.position.x = THREE.MathUtils.damp(g.position.x, state.pointer.x * 0.12, 2.5, dt);
        }
        const f = flash.current;
        const pm = pulses.current;
        walk.forEach((w, i) => {
            const a = NODES[w.from].pos;
            const b = NODES[w.to].pos;
            w.t += (dt * w.speed) / Math.max(0.4, a.distanceTo(b));
            if (w.t >= 1) {
                f[w.to] = 1;
                const next = NEIGHBOURS[w.to];
                w.from = w.to;
                w.to = next[Math.floor(Math.random() * next.length)];
                w.t = 0;
            }
            if (pm) {
                tmp.v.lerpVectors(NODES[w.from].pos, NODES[w.to].pos, w.t);
                tmp.m.position.copy(tmp.v);
                tmp.m.scale.setScalar(1);
                tmp.m.updateMatrix();
                pm.setMatrixAt(i, tmp.m.matrix);
            }
        });
        if (pm) pm.instanceMatrix.needsUpdate = true;
        // A label sits above its node, or to its left when the node is near
        // the right edge, so it never runs off the stage.
        if (label.current && active !== null && g) {
            tmp.w.copy(NODES[active].pos);
            g.localToWorld(tmp.w).project(state.camera);
            label.current.style.transform = tmp.w.x > 0.25 ? 'translate(calc(-50% - 18px), 0)' : 'translate(0, -26px)';
        }
        NODES.forEach((n, i) => {
            f[i] = Math.max(0, f[i] - dt * 2.2);
            const on = i === active ? 1 : 0;
            const s = 1 + f[i] * 0.35 + on * 0.7;
            nodeRefs.current[i]?.scale.setScalar(s);
            const gl = glowRefs.current[i];
            if (gl) {
                const base = n.hub ? 0.45 : 0.22;
                gl.scale.setScalar((n.hub ? 0.46 : 0.24) * (1 + f[i] * 0.6 + on * 1.2));
                (gl.material as THREE.SpriteMaterial).opacity = Math.min(1, base + f[i] * 0.4 + on * 0.5) * (light ? 0.45 : 1);
            }
        });
    });

    return (
        <group ref={group} scale={0.8}>
            <lineSegments geometry={lines.spokes}>
                <lineBasicMaterial color={p.ink} transparent opacity={light ? 0.28 : 0.22} depthWrite={false} />
            </lineSegments>
            <lineSegments geometry={lines.ring}>
                <lineBasicMaterial color={p.ink} transparent opacity={light ? 0.4 : 0.32} depthWrite={false} />
            </lineSegments>
            <lineSegments geometry={lines.cross}>
                <lineBasicMaterial color={p.ink} transparent opacity={light ? 0.16 : 0.12} depthWrite={false} />
            </lineSegments>
            {lit && (
                <lineSegments geometry={lit}>
                    <lineBasicMaterial color={p.ink} transparent opacity={0.9} depthWrite={false} />
                </lineSegments>
            )}
            <instancedMesh ref={pulses} args={[undefined, undefined, PULSES]} frustumCulled={false}>
                <sphereGeometry args={[0.022, 8, 8]} />
                <meshBasicMaterial color={p.ink} toneMapped={false} />
            </instancedMesh>
            {NODES.map((n, i) => (
                <group key={i} position={n.pos}>
                    <mesh
                        ref={(m) => {
                            nodeRefs.current[i] = m;
                        }}
                    >
                        <sphereGeometry args={[n.hub ? 0.085 : 0.045, 20, 20]} />
                        <meshBasicMaterial color={n.hub ? p.ink : p.soft} toneMapped={false} />
                    </mesh>
                    <sprite
                        ref={(s) => {
                            glowRefs.current[i] = s;
                        }}
                    >
                        <spriteMaterial map={glow} color={p.ink} transparent depthWrite={false} blending={blending} />
                    </sprite>
                    {/* A larger, invisible target, so small nodes are easy to point at. */}
                    {!n.hub && (
                        <mesh
                            visible={false}
                            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                                e.stopPropagation();
                                onHover(i);
                                document.body.style.cursor = 'pointer';
                            }}
                            onPointerOut={() => {
                                onHover(null);
                                document.body.style.cursor = '';
                            }}
                            onClick={(e: ThreeEvent<MouseEvent>) => {
                                e.stopPropagation();
                                onHover(i);
                            }}
                        >
                            <sphereGeometry args={[0.16, 8, 8]} />
                        </mesh>
                    )}
                    {n.hub && !compact && (
                        <Html center position={[0, 0.2, 0]} pointerEvents="none" zIndexRange={[20, 0]}>
                            <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.24em] text-text-mute">{n.name}</span>
                        </Html>
                    )}
                </group>
            ))}
            {active !== null && !compact && (
                <Html position={NODES[active].pos} center pointerEvents="none" zIndexRange={[30, 0]}>
                    <div ref={label} className="whitespace-nowrap rounded-full border border-hairline-strong bg-veil px-3 py-1 text-center">
                        <span className="text-[11px] font-medium text-text-strong">{NODES[active].name}</span>
                        <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.18em] text-text-mute">{NODES[active].domain}</span>
                    </div>
                </Html>
            )}
        </group>
    );
}

export default function Constellation({ running }: { running: boolean }) {
    const light = useTheme() === 'light';
    // Phones name the agent in a caption line at the top, not beside the node.
    const [compact] = useState(() => window.matchMedia('(max-width: 767px)').matches);
    const [hovered, setHovered] = useState<number | null>(null);
    const [auto, setAuto] = useState(0);

    // Left alone, the constellation names one agent after another.
    useEffect(() => {
        if (!running || hovered !== null) return;
        const id = window.setInterval(() => setAuto((a) => (a + 1) % AGENTS.length), 2600);
        return () => window.clearInterval(id);
    }, [running, hovered]);

    const active = hovered ?? AGENTS[(auto * 7) % AGENTS.length];
    return (
        <div className="relative h-full w-full">
            <Canvas
                frameloop={running ? 'always' : 'never'}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                camera={{ fov: 38, position: [0, 0.1, 5.6], near: 0.1, far: 40 }}
                // Labels near the edge may overflow the canvas rather than be cut off.
                style={{ touchAction: 'pan-y', overflow: 'visible' }}
                onPointerMissed={() => setHovered(null)}
                aria-hidden="true"
            >
                <PaletteContext.Provider value={light ? LIGHT : DARK}>
                    <Network active={active} onHover={setHovered} light={light} compact={compact} />
                </PaletteContext.Provider>
            </Canvas>
            {compact && active !== null && (
                <p className="pointer-events-none absolute inset-x-0 top-0 text-center" aria-hidden="true">
                    <span className="text-[11px] font-medium text-text-strong">{NODES[active].name}</span>
                    <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.18em] text-text-mute">{NODES[active].domain}</span>
                </p>
            )}
        </div>
    );
}
