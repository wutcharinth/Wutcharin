import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import * as THREE from 'three';
import { useTheme } from '../../../lib/theme';
import { DARK, LIGHT, PaletteContext, usePalette } from '../work/sims/kit';
import { AGENT_COUNT, DOMAINS } from '../agents';

/**
 * Fig. 00, the hero: the team's agents as an interactive 3D constellation.
 * Four domain hubs, the agents around each, threads between them, and light
 * travelling the threads like traffic. Filter by domain, inspect any node,
 * and jump directly into live demos where available.
 */

type Node = {
    name: string;
    summary: string;
    link?: string;
    domain: string;
    domainId: string;
    pos: THREE.Vector3;
    hub: boolean;
    domainIndex: number;
    agentOrdinal: number;
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
    let ordinal = 0;

    DOMAINS.forEach((d, di) => {
        const hub = corners[di % corners.length].clone().multiplyScalar(1.05);
        hubIndex.push(nodes.length);
        nodes.push({
            name: d.name,
            summary: `${d.agents.length} agents running in production.`,
            domain: d.name,
            domainId: d.id,
            pos: hub,
            hub: true,
            domainIndex: di,
            agentOrdinal: 0,
        });
        const n = d.agents.length;
        d.agents.forEach((agent, k) => {
            // Golden-spiral directions, pushed away from the centre of the whole.
            const y = 1 - (2 * (k + 0.5)) / n;
            const r = Math.sqrt(1 - y * y);
            const phi = k * 2.399963 + di;
            const dir = new THREE.Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r);
            dir.add(hub.clone().normalize().multiplyScalar(0.9)).normalize();
            const pos = hub.clone().add(dir.multiplyScalar(0.5 + rand() * 0.28));
            const i = nodes.length;
            ordinal += 1;
            nodes.push({
                name: agent.name,
                summary: agent.summary,
                link: agent.link,
                domain: d.name,
                domainId: d.id,
                pos,
                hub: false,
                domainIndex: di,
                agentOrdinal: ordinal,
            });
            edges.push([hubIndex[di], i, 'spoke']);
        });
    });
    // The hubs are all connected.
    for (let a = 0; a < hubIndex.length; a++) {
        for (let b = a + 1; b < hubIndex.length; b++) edges.push([hubIndex[a], hubIndex[b], 'ring']);
    }
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

function Network({
    active,
    domainFilter,
    onHover,
    onSelect,
    onSelectDomain,
    light,
    compact,
}: {
    active: number | null;
    domainFilter: string | null;
    onHover: (i: number | null) => void;
    onSelect: (i: number) => void;
    onSelectDomain: (id: string | null) => void;
    light: boolean;
    compact: boolean;
}) {
    const p = usePalette();
    const group = useRef<THREE.Group>(null);
    const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
    const glowRefs = useRef<Array<THREE.Sprite | null>>([]);
    const pulses = useRef<THREE.InstancedMesh>(null);
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

    const domainLines = useMemo(() => {
        if (!domainFilter) return null;
        const pts: number[] = [];
        EDGES.forEach(([a, b, k]) => {
            if (k !== 'spoke') return;
            if (NODES[a].domainId === domainFilter && NODES[b].domainId === domainFilter) {
                pts.push(...NODES[a].pos.toArray(), ...NODES[b].pos.toArray());
            }
        });
        return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    }, [domainFilter]);

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
    const tmp = useMemo(() => ({ m: new THREE.Object3D(), v: new THREE.Vector3() }), []);

    useFrame((state, dt) => {
        const g = group.current;
        if (g) {
            g.rotation.y += dt * (domainFilter ? 0.04 : 0.065);
            g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.16 - state.pointer.y * 0.22, 2.5, dt);
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
                const visible = !domainFilter || NODES[w.from].domainId === domainFilter || NODES[w.to].domainId === domainFilter;
                tmp.m.scale.setScalar(visible ? 1 : 0.35);
                tmp.m.updateMatrix();
                pm.setMatrixAt(i, tmp.m.matrix);
            }
        });
        if (pm) pm.instanceMatrix.needsUpdate = true;

        NODES.forEach((n, i) => {
            f[i] = Math.max(0, f[i] - dt * 2.2);
            const on = i === active ? 1 : 0;
            const inDomain = !domainFilter || n.domainId === domainFilter;
            const s = (inDomain ? 1 : 0.55) + f[i] * 0.35 + on * 0.8;
            nodeRefs.current[i]?.scale.setScalar(s);
            const gl = glowRefs.current[i];
            if (gl) {
                const base = n.hub ? 0.45 : 0.22;
                gl.scale.setScalar((n.hub ? 0.46 : 0.24) * (1 + f[i] * 0.55 + on * 1.35) * (inDomain ? 1 : 0.45));
                const dim = inDomain ? 1 : 0.2;
                (gl.material as THREE.SpriteMaterial).opacity = Math.min(1, base + f[i] * 0.4 + on * 0.55) * (light ? 0.45 : 1) * dim;
            }
        });
    });

    const dimFactor = domainFilter ? 0.35 : 1;

    return (
        <group ref={group} scale={0.78} position={[0, compact ? 0.05 : 0.14, 0]}>
            <lineSegments geometry={lines.spokes}>
                <lineBasicMaterial color={p.ink} transparent opacity={(light ? 0.28 : 0.22) * dimFactor} depthWrite={false} />
            </lineSegments>
            <lineSegments geometry={lines.ring}>
                <lineBasicMaterial color={p.ink} transparent opacity={(light ? 0.4 : 0.32) * dimFactor} depthWrite={false} />
            </lineSegments>
            <lineSegments geometry={lines.cross}>
                <lineBasicMaterial color={p.ink} transparent opacity={(light ? 0.16 : 0.12) * dimFactor} depthWrite={false} />
            </lineSegments>
            {domainLines && (
                <lineSegments geometry={domainLines}>
                    <lineBasicMaterial color={p.ink} transparent opacity={light ? 0.65 : 0.55} depthWrite={false} />
                </lineSegments>
            )}
            {lit && (
                <lineSegments geometry={lit}>
                    <lineBasicMaterial color={p.ink} transparent opacity={0.92} depthWrite={false} />
                </lineSegments>
            )}
            <instancedMesh ref={pulses} args={[undefined, undefined, PULSES]} frustumCulled={false}>
                <sphereGeometry args={[0.022, 8, 8]} />
                <meshBasicMaterial color={p.ink} toneMapped={false} />
            </instancedMesh>
            {NODES.map((n, i) => {
                const inDomain = !domainFilter || n.domainId === domainFilter;
                return (
                    <group key={i} position={n.pos}>
                        <mesh
                            ref={(m) => {
                                nodeRefs.current[i] = m;
                            }}
                        >
                            <sphereGeometry args={[n.hub ? 0.085 : 0.045, 20, 20]} />
                            <meshBasicMaterial
                                color={n.hub || i === active ? p.ink : p.soft}
                                transparent={!inDomain}
                                opacity={inDomain ? 1 : 0.28}
                                toneMapped={false}
                            />
                        </mesh>
                        <sprite
                            ref={(s) => {
                                glowRefs.current[i] = s;
                            }}
                        >
                            <spriteMaterial map={glow} color={p.ink} transparent depthWrite={false} blending={blending} />
                        </sprite>
                        {/* Larger invisible hit target so nodes and hubs are effortless to point or tap. */}
                        <mesh
                            visible={false}
                            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                                e.stopPropagation();
                                if (!n.hub) onHover(i);
                                document.body.style.cursor = 'pointer';
                            }}
                            onPointerOut={() => {
                                if (!n.hub) onHover(null);
                                document.body.style.cursor = '';
                            }}
                            onClick={(e: ThreeEvent<MouseEvent>) => {
                                e.stopPropagation();
                                if (n.hub) {
                                    onSelectDomain(domainFilter === n.domainId ? null : n.domainId);
                                } else {
                                    onSelect(i);
                                }
                            }}
                        >
                            <sphereGeometry args={[n.hub ? 0.2 : 0.16, 8, 8]} />
                        </mesh>
                        {n.hub && !compact && (
                            <Html center position={[0, 0.21, 0]} pointerEvents="none" zIndexRange={[20, 0]}>
                                <span
                                    className={`whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.24em] transition-opacity duration-300 ${
                                        inDomain ? 'text-text-mute opacity-100' : 'text-text-mute opacity-25'
                                    }`}
                                >
                                    {n.name}
                                </span>
                            </Html>
                        )}
                    </group>
                );
            })}
        </group>
    );
}

export default function Constellation({ running }: { running: boolean }) {
    const light = useTheme() === 'light';
    const [compact] = useState(() => window.matchMedia('(max-width: 767px)').matches);
    const [domainFilter, setDomainFilter] = useState<string | null>(null);
    const [hovered, setHovered] = useState<number | null>(null);
    const [pinned, setPinned] = useState<number | null>(null);
    const [auto, setAuto] = useState(0);

    const eligible = useMemo(
        () => (domainFilter ? AGENTS.filter((i) => NODES[i].domainId === domainFilter) : AGENTS),
        [domainFilter],
    );

    // Cycle through eligible agents when idle.
    useEffect(() => {
        if (!running || hovered !== null || pinned !== null) return;
        const id = window.setInterval(() => setAuto((a) => a + 1), 3200);
        return () => window.clearInterval(id);
    }, [running, hovered, pinned]);

    const handleDomainChange = (id: string | null) => {
        setDomainFilter(id);
        setPinned(null);
        setHovered(null);
        setAuto(0);
    };

    const active =
        hovered ??
        pinned ??
        eligible[(auto * (domainFilter ? 1 : 7)) % Math.max(1, eligible.length)] ??
        AGENTS[0];
    const activeNode = NODES[active];

    return (
        <div className="relative h-full w-full" data-cursor="explore">
            <Canvas
                frameloop={running ? 'always' : 'never'}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                camera={{ fov: 38, position: [0, 0.08, 5.6], near: 0.1, far: 40 }}
                style={{ touchAction: 'pan-y', overflow: 'visible' }}
                onPointerMissed={() => setPinned(null)}
                aria-hidden="true"
            >
                <PaletteContext.Provider value={light ? LIGHT : DARK}>
                    <Network
                        active={active}
                        domainFilter={domainFilter}
                        onHover={setHovered}
                        onSelect={(i) => setPinned((cur) => (cur === i ? null : i))}
                        onSelectDomain={handleDomainChange}
                        light={light}
                        compact={compact}
                    />
                </PaletteContext.Provider>
            </Canvas>

            {/* Anchored Fig. 00 Telemetry HUD on desktop: domain filter + active agent readout. */}
            {!compact && activeNode && (
                <div className="pointer-events-none absolute inset-x-0 bottom-2 z-30 flex flex-col items-end gap-2.5 px-2">
                    <div className="pointer-events-auto w-full max-w-sm rounded-lg border border-hairline bg-veil px-4 py-3 backdrop-blur-sm transition-colors hover:border-hairline-strong">
                        <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute">
                            <span className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                                {activeNode.domain}
                            </span>
                            <span className="tabular-nums">
                                {String(activeNode.agentOrdinal).padStart(2, '0')} / {String(AGENT_COUNT).padStart(2, '0')}
                            </span>
                        </div>
                        <div className="mt-1.5 flex items-baseline justify-between gap-3">
                            <p className="font-display text-base font-medium tracking-[-0.01em] text-text-strong">
                                {activeNode.name}
                            </p>
                            {activeNode.link && (
                                <Link
                                    to={activeNode.link}
                                    data-cursor="open"
                                    className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-signal transition-opacity hover:opacity-75"
                                >
                                    Try demo
                                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                                </Link>
                            )}
                        </div>
                        <p className="mt-1 text-xs font-light leading-relaxed text-text-mute">{activeNode.summary}</p>
                    </div>

                    <div
                        className="pointer-events-auto flex flex-wrap justify-end gap-1.5"
                        role="radiogroup"
                        aria-label="Filter agent domains"
                    >
                        <button
                            type="button"
                            role="radio"
                            aria-checked={domainFilter === null}
                            onClick={() => handleDomainChange(null)}
                            data-cursor=""
                            className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                domainFilter === null
                                    ? 'border-signal/50 bg-signal/10 text-text-strong'
                                    : 'border-hairline bg-veil text-text-mute hover:border-hairline-strong hover:text-text-strong'
                            }`}
                        >
                            All {AGENT_COUNT}
                        </button>
                        {DOMAINS.map((d) => {
                            const on = domainFilter === d.id;
                            return (
                                <button
                                    key={d.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={on}
                                    onClick={() => handleDomainChange(on ? null : d.id)}
                                    data-cursor=""
                                    className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                        on
                                            ? 'border-signal/50 bg-signal/10 text-text-strong'
                                            : 'border-hairline bg-veil text-text-mute hover:border-hairline-strong hover:text-text-strong'
                                    }`}
                                >
                                    {d.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Mobile top caption: concise active agent name + domain. */}
            {compact && activeNode && (
                <p className="pointer-events-none absolute inset-x-0 top-1 text-center" aria-hidden="true">
                    <span className="text-[11px] font-medium text-text-strong">{activeNode.name}</span>
                    <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.18em] text-text-mute">{activeNode.domain}</span>
                </p>
            )}
        </div>
    );
}
