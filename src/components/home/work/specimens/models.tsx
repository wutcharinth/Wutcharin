import { useMemo, useRef, type ReactNode, type Ref } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Line } from '@react-three/drei';
import * as THREE from 'three';
import { ease, usePalette } from '../sims/kit';

/**
 * The project index's 3D specimens: one small model per project, acting out
 * what the project does, in the same black and white language as the Work
 * chapter's simulations (solids in the fill tone, ink outlines, light for
 * what just happened). Each fits roughly x -1.7..1.7, y 0..1.8.
 */

type Tone = 'fill' | 'paper' | 'mid' | 'ink';

function Block({
    size,
    position,
    rotation,
    tone = 'fill',
    edge = 0.75,
    glow = false,
    ref,
    children,
}: {
    size: [number, number, number];
    position?: [number, number, number];
    rotation?: [number, number, number];
    tone?: Tone;
    edge?: number;
    glow?: boolean;
    ref?: Ref<THREE.Mesh>;
    children?: ReactNode;
}) {
    const p = usePalette();
    const color = tone === 'paper' ? p.paper : tone === 'mid' ? p.mid : tone === 'ink' ? p.ink : p.fill;
    return (
        <mesh ref={ref} position={position} rotation={rotation}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} emissive={p.ink} emissiveIntensity={glow ? 0.6 : 0} />
            {edge > 0 && <Edges color={p.ink} transparent opacity={edge} />}
            {children}
        </mesh>
    );
}

/** A lit point: what moves, or what just happened. */
function Spark({ ref, r = 0.06, position }: { ref?: Ref<THREE.Mesh>; r?: number; position?: [number, number, number] }) {
    const p = usePalette();
    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[r, 16, 16]} />
            <meshBasicMaterial color={p.ink} toneMapped={false} />
        </mesh>
    );
}

const loop = (t: number, period: number) => (t % period) / period;
const glowOf = (m: THREE.Mesh | null) => (m?.material as THREE.MeshStandardMaterial | undefined) ?? null;

/** RiskGuard: transactions ride through a check ring; the risky ones lift out. */
export function RiskGuard() {
    const p = usePalette();
    const refs = useRef<Array<THREE.Mesh | null>>([]);
    const N = 8;
    useFrame(({ clock }) => {
        refs.current.forEach((m, i) => {
            if (!m) return;
            const u = loop(clock.elapsedTime * 0.28 + i / N, 1);
            const x = -1.7 + u * 3.4;
            const risky = i % 3 === 1;
            const lift = risky ? ease((x + 0.05) / 0.7) : 0;
            m.position.set(x, 0.16 + lift * 0.95, -lift * 0.25);
            m.rotation.y = lift * 0.8;
            const mat = glowOf(m);
            if (mat) mat.emissiveIntensity = risky && x > 0 ? 0.8 : 0;
        });
    });
    return (
        <group>
            <Block size={[3.6, 0.06, 0.6]} position={[0, 0.03, 0]} edge={0.4} />
            <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 2, 0]}>
                <torusGeometry args={[0.52, 0.025, 12, 48]} />
                <meshBasicMaterial color={p.ink} toneMapped={false} />
            </mesh>
            {Array.from({ length: N }, (_, i) => (
                <Block key={i} ref={(m) => { refs.current[i] = m; }} size={[0.22, 0.2, 0.22]} tone={i % 3 === 1 ? 'paper' : 'fill'} />
            ))}
        </group>
    );
}

/** ProjectFlow: a card crosses the board; one in progress pulses (scope creep). */
export function ProjectFlow() {
    const mover = useRef<THREE.Mesh>(null);
    const creep = useRef<THREE.Mesh>(null);
    const cols = [-1.15, 0, 1.15];
    const stacks = [3, 2, 2];
    const a = useMemo(() => new THREE.Vector3(), []);
    useFrame(({ clock }) => {
        const u = loop(clock.elapsedTime, 4.8) * 3; // 0..3: wait, hop, hop
        const from = Math.min(2, Math.floor(u));
        const k = ease((u - from - 0.45) / 0.55);
        const x = from >= 2 ? cols[2] : THREE.MathUtils.lerp(cols[from], cols[from + 1], k);
        a.set(x, 0.12 + 4 * 0.035 + Math.sin(Math.PI * (from >= 2 ? 0 : k)) * 0.55, 0.15);
        mover.current?.position.copy(a);
        const mat = glowOf(creep.current);
        if (mat) mat.emissiveIntensity = 0.35 + 0.35 * Math.sin(clock.elapsedTime * 4);
    });
    return (
        <group>
            {cols.map((x, c) => (
                <group key={c} position={[x, 0, 0]}>
                    <Block size={[0.95, 0.04, 1.3]} position={[0, 0.02, 0]} edge={0.5} />
                    {Array.from({ length: stacks[c] }, (_, k) => (
                        <Block
                            key={k}
                            ref={c === 1 && k === 1 ? creep : undefined}
                            size={[0.72, 0.03, 0.26]}
                            position={[0, 0.06 + k * 0.035, -0.4 + k * 0.32]}
                            tone="paper"
                            edge={0.6}
                        />
                    ))}
                </group>
            ))}
            <Block ref={mover} size={[0.72, 0.03, 0.26]} tone="paper" edge={1} glow />
        </group>
    );
}

/** ReviewFlow: reviews fall, are read, and are routed to one of three teams. */
export function ReviewFlow() {
    const p = usePalette();
    const refs = useRef<Array<THREE.Mesh | null>>([]);
    const bins = [-1.2, 0, 1.2];
    const v = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), o: new THREE.Vector3() }), []);
    useFrame(({ clock }) => {
        refs.current.forEach((m, i) => {
            if (!m) return;
            const u = loop(clock.elapsedTime * 0.32 + i / 6, 1);
            const bin = bins[i % 3];
            if (u < 0.45) {
                m.position.set(0, 1.75 - ease(u / 0.45) * 1.0, 0);
                m.rotation.set(0.4, u * 4, 0);
            } else {
                v.a.set(0, 0.75, 0);
                v.b.set(bin, 0.16 + (i % 2) * 0.05, 0.1);
                const k = ease((u - 0.45) / 0.4);
                v.o.lerpVectors(v.a, v.b, k);
                v.o.y += Math.sin(Math.PI * k) * 0.35;
                m.position.copy(v.o);
                m.rotation.set(0.4 * (1 - k), 0, 0);
            }
            m.visible = u < 0.95;
        });
    });
    return (
        <group>
            <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.3, 0.02, 10, 40]} />
                <meshBasicMaterial color={p.ink} toneMapped={false} />
            </mesh>
            {bins.map((x) => (
                <Block key={x} size={[0.8, 0.14, 0.7]} position={[x, 0.07, 0.1]} edge={0.6} />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
                <Block key={i} ref={(m) => { refs.current[i] = m; }} size={[0.42, 0.025, 0.28]} tone={i % 2 ? 'mid' : 'paper'} edge={0.6} />
            ))}
        </group>
    );
}

/** QueryFlow: a question enters the database; a table assembles, traced to its source. */
export function QueryFlow() {
    const p = usePalette();
    const q = useRef<THREE.Mesh>(null);
    const cells = useRef<Array<THREE.Mesh | null>>([]);
    useFrame(({ clock }) => {
        const u = loop(clock.elapsedTime, 4.6);
        if (q.current) {
            const k = ease(u / 0.3);
            q.current.position.set(THREE.MathUtils.lerp(-1.9, -1.1, k), THREE.MathUtils.lerp(1.55, 0.95, k), 0);
            q.current.visible = u < 0.32;
        }
        cells.current.forEach((m, i) => {
            if (!m) return;
            const s = ease((u - 0.35 - i * 0.035) / 0.12) * (u < 0.92 ? 1 : 1 - ease((u - 0.92) / 0.08));
            m.scale.setScalar(Math.max(0.001, s));
        });
    });
    return (
        <group>
            {[0.15, 0.48, 0.81].map((y) => (
                <mesh key={y} position={[-1.1, y, 0]}>
                    <cylinderGeometry args={[0.45, 0.45, 0.24, 40]} />
                    <meshStandardMaterial color={p.fill} />
                    <Edges color={p.ink} threshold={30} transparent opacity={0.8} />
                </mesh>
            ))}
            <Spark ref={q} r={0.08} />
            <Line points={[[-0.6, 0.6, 0], [0.25, 0.9, 0]]} color={p.ink} lineWidth={1} dashed dashSize={0.06} gapSize={0.05} />
            <Line points={[[-0.6, 0.3, 0], [0.25, 0.4, 0]]} color={p.ink} lineWidth={1} dashed dashSize={0.06} gapSize={0.05} />
            {Array.from({ length: 12 }, (_, i) => (
                <Block
                    key={i}
                    ref={(m) => { cells.current[i] = m; }}
                    size={[0.36, 0.2, 0.04]}
                    position={[0.45 + (i % 3) * 0.4, 1.25 - Math.floor(i / 3) * 0.24, 0]}
                    tone={i < 3 ? 'paper' : 'fill'}
                    edge={0.8}
                />
            ))}
        </group>
    );
}

/** Collections: the dispute runs its three steps; the overcharge comes back. */
export function Collections() {
    const rings = useRef<Array<THREE.Mesh | null>>([]);
    const coins = useRef<Array<THREE.Mesh | null>>([]);
    const p = usePalette();
    useFrame(({ clock }) => {
        const u = loop(clock.elapsedTime, 5);
        rings.current.forEach((m, k) => {
            const mat = m?.material as THREE.MeshBasicMaterial | undefined;
            if (mat) mat.opacity = u > 0.12 + k * 0.17 ? 0.9 : 0.15;
        });
        coins.current.forEach((m, i) => {
            if (!m) return;
            const k = ease((u - 0.68 - i * 0.04) / 0.16);
            m.position.set(THREE.MathUtils.lerp(1.25, -0.1, k), 0.08 + i * 0.07 + Math.sin(Math.PI * k) * 0.6, THREE.MathUtils.lerp(0, 0.1, k));
        });
    });
    return (
        <group>
            <Block size={[1.2, 0.04, 0.76]} position={[-0.1, 0.3, 0]} rotation={[0, 0, 0.12]} tone="paper" edge={1}>
                <Block size={[0.22, 0.02, 0.16]} position={[-0.35, 0.03, -0.12]} tone="mid" edge={0} />
            </Block>
            {[0.75, 0.95, 1.15].map((r, k) => (
                <mesh key={r} ref={(m) => { rings.current[k] = m; }} position={[-0.1, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[r, r + 0.025, 64]} />
                    <meshBasicMaterial color={p.ink} transparent opacity={0.15} toneMapped={false} />
                </mesh>
            ))}
            {Array.from({ length: 5 }, (_, i) => (
                <mesh key={i} ref={(m) => { coins.current[i] = m; }}>
                    <cylinderGeometry args={[0.16, 0.16, 0.06, 24]} />
                    <meshStandardMaterial color={p.soft} />
                    <Edges color={p.ink} threshold={30} />
                </mesh>
            ))}
        </group>
    );
}

/** SlipVerify: slips pass the reader; a reused one is struck out and set aside. */
export function SlipVerify() {
    const slips = useRef<Array<THREE.Group | null>>([]);
    const N = 5;
    useFrame(({ clock }) => {
        slips.current.forEach((g, i) => {
            if (!g) return;
            const u = loop(clock.elapsedTime * 0.25 + i / N, 1);
            const x = -1.8 + u * 3.6;
            const bad = i === 2;
            const off = bad ? ease((x - 0.1) / 0.6) : 0;
            g.position.set(x, 0.1 + off * 0.1, off * 0.85);
            g.rotation.y = off * 0.4;
            const strike = g.children[1];
            if (strike) strike.visible = bad && x > 0.15;
        });
    });
    return (
        <group>
            <Block size={[0.06, 0.06, 1.0]} position={[0, 0.55, 0]} tone="ink" edge={0} />
            <Block size={[0.04, 0.5, 0.04]} position={[0, 0.3, -0.5]} edge={0.6} />
            <Block size={[0.04, 0.5, 0.04]} position={[0, 0.3, 0.5]} edge={0.6} />
            {Array.from({ length: N }, (_, i) => (
                <group key={i} ref={(g) => { slips.current[i] = g; }}>
                    <Block size={[0.42, 0.02, 0.62]} tone="paper" edge={0.7}>
                        <Block size={[0.12, 0.01, 0.12]} position={[0.1, 0.015, -0.18]} tone="mid" edge={0} />
                    </Block>
                    <group position={[0, 0.06, 0]}>
                        <Block size={[0.6, 0.03, 0.05]} rotation={[0, 0.8, 0]} tone="ink" edge={0} />
                        <Block size={[0.6, 0.03, 0.05]} rotation={[0, -0.8, 0]} tone="ink" edge={0} />
                    </group>
                </group>
            ))}
        </group>
    );
}

/** Karpathy LLM guide: a token rises through the layers; the next token appears. */
export function Karpathy() {
    const p = usePalette();
    const spark = useRef<THREE.Mesh>(null);
    const next = useRef<THREE.Mesh>(null);
    const xs = [-1.1, -0.55, 0, 0.55, 1.1];
    useFrame(({ clock }) => {
        const u = loop(clock.elapsedTime, 3.2);
        const col = Math.floor(clock.elapsedTime / 3.2) % xs.length;
        if (spark.current) spark.current.position.set(xs[col] + ease(u) * (1.1 - xs[col]) * (u > 0.6 ? 1 : 0), 0.2 + ease(u / 0.8) * 1.35, 0);
        if (next.current) next.current.scale.setScalar(Math.max(0.001, ease((u - 0.8) / 0.15)));
    });
    return (
        <group>
            {xs.map((x) => (
                <Block key={x} size={[0.3, 0.3, 0.3]} position={[x, 0.15, 0]} tone="paper" edge={0.7} />
            ))}
            {[0.5, 0.8, 1.1, 1.4].map((y) => (
                <mesh key={y} position={[0, y, 0]}>
                    <boxGeometry args={[2.9, 0.02, 0.8]} />
                    <meshStandardMaterial color={p.fill} transparent opacity={0.35} />
                    <Edges color={p.ink} transparent opacity={0.45} />
                </mesh>
            ))}
            <Spark ref={spark} r={0.07} />
            <Block ref={next} size={[0.3, 0.3, 0.3]} position={[1.1, 1.72, 0]} tone="ink" edge={0} />
        </group>
    );
}

/** The Human Edge: a field of identical machines; one human, standing out. */
export function HumanEdge() {
    const p = usePalette();
    const refs = useRef<Array<THREE.Mesh | null>>([]);
    const cells = useMemo(() => {
        const out: Array<[number, number]> = [];
        for (let i = -3; i <= 3; i++) for (let j = -2; j <= 2; j++) if (i || j) out.push([i * 0.4, j * 0.4]);
        return out;
    }, []);
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        refs.current.forEach((m, i) => {
            if (!m) return;
            const [x, z] = cells[i];
            const d = Math.hypot(x, z);
            const push = 1 + 0.12 * Math.max(0, Math.sin(t * 1.6 - d * 2.2));
            m.position.set(x * push, 0.1, z * push);
            m.rotation.y = t * 0.8; // every machine turns in lockstep
        });
    });
    return (
        <group>
            {cells.map((_, i) => (
                <Block key={i} ref={(m) => { refs.current[i] = m; }} size={[0.18, 0.18, 0.18]} edge={0.5} />
            ))}
            <mesh position={[0, 0.42, 0]}>
                <capsuleGeometry args={[0.13, 0.42, 6, 16]} />
                <meshStandardMaterial color={p.paper} emissive={p.ink} emissiveIntensity={0.35} />
            </mesh>
            <mesh position={[0, 0.88, 0]}>
                <sphereGeometry args={[0.12, 20, 20]} />
                <meshStandardMaterial color={p.paper} emissive={p.ink} emissiveIntensity={0.35} />
            </mesh>
        </group>
    );
}

/** Agentic AI (CS230): reason, act, observe, around and around. */
export function AgenticLoop() {
    const p = usePalette();
    const token = useRef<THREE.Mesh>(null);
    const nodes = useRef<Array<THREE.Mesh | null>>([]);
    const R = 0.95;
    useFrame(({ clock }) => {
        const a = clock.elapsedTime * 1.3;
        token.current?.position.set(Math.cos(a) * R, 0.75, Math.sin(a) * R * 0.55);
        nodes.current.forEach((m, k) => {
            if (!m) return;
            const na = (k / 3) * Math.PI * 2;
            const near = Math.cos(a - na);
            m.scale.setScalar(1 + Math.max(0, near - 0.8) * 2.5);
        });
    });
    return (
        <group>
            <mesh position={[0, 0.75, 0]} scale={[1, 1, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[R, 0.015, 8, 80]} />
                <meshBasicMaterial color={p.ink} toneMapped={false} />
            </mesh>
            {[0, 1, 2].map((k) => {
                const na = (k / 3) * Math.PI * 2;
                return (
                    <mesh key={k} ref={(m) => { nodes.current[k] = m; }} position={[Math.cos(na) * R, 0.75, Math.sin(na) * R * 0.55]}>
                        <sphereGeometry args={[0.16, 24, 24]} />
                        <meshStandardMaterial color={p.fill} />
                        <Edges color={p.ink} threshold={20} />
                    </mesh>
                );
            })}
            <Spark ref={token} r={0.08} />
            <Block size={[0.4, 0.4, 0.4]} position={[0, 0.2, 0]} edge={0.6} />
        </group>
    );
}

/** AI Evolution: bars that grow by multiples, year on year. */
export function AIEvolution() {
    const refs = useRef<Array<THREE.Mesh | null>>([]);
    const H = [0.06, 0.1, 0.18, 0.32, 0.56, 0.98, 1.7];
    useFrame(({ clock }) => {
        const u = loop(clock.elapsedTime, 5.5);
        refs.current.forEach((m, i) => {
            if (!m) return;
            const k = ease((u - i * 0.07) / 0.18) * (u < 0.94 ? 1 : 1 - ease((u - 0.94) / 0.06));
            const h = Math.max(0.002, H[i] * k);
            m.scale.y = h;
            m.position.y = h / 2;
        });
    });
    return (
        <group>
            {H.map((_, i) => (
                <Block key={i} ref={(m) => { refs.current[i] = m; }} size={[0.3, 1, 0.3]} position={[-1.5 + i * 0.5, 0.5, 0]} tone={i === H.length - 1 ? 'paper' : 'fill'} edge={0.8} />
            ))}
        </group>
    );
}

/** Future of Work: a wave passes through the workforce; some roles change, new ones rise. */
export function FutureOfWork() {
    const people = useRef<Array<THREE.Mesh | null>>([]);
    const changed = useRef<Array<THREE.Mesh | null>>([]);
    const grid = useMemo(() => {
        const out: Array<{ x: number; z: number; kind: 0 | 1 | 2 }> = [];
        for (let i = 0; i < 8; i++)
            for (let j = 0; j < 4; j++) out.push({ x: -1.4 + i * 0.4, z: -0.6 + j * 0.4, kind: (i * 7 + j * 3) % 9 === 0 ? 2 : (i * 5 + j) % 4 === 0 ? 1 : 0 });
        return out;
    }, []);
    useFrame(({ clock }) => {
        const wave = -1.9 + loop(clock.elapsedTime, 5) * 4.2;
        grid.forEach((g, i) => {
            const passed = ease((wave - g.x) / 0.4);
            const pm = people.current[i];
            const cm = changed.current[i];
            if (g.kind === 0) return;
            // kind 1: a role that changes shape; kind 2: a new role rising from the floor.
            if (pm) pm.scale.setScalar(Math.max(0.001, g.kind === 1 ? 1 - passed : 0.001));
            if (cm) cm.scale.setScalar(Math.max(0.001, passed));
        });
    });
    const p = usePalette();
    return (
        <group>
            {grid.map((g, i) => (
                <group key={i} position={[g.x, 0, g.z]}>
                    <mesh ref={(m) => { people.current[i] = m; }} position={[0, 0.2, 0]} scale={g.kind === 2 ? 0.001 : 1}>
                        <capsuleGeometry args={[0.07, 0.18, 4, 10]} />
                        <meshStandardMaterial color={p.mid} />
                    </mesh>
                    {g.kind !== 0 && (
                        <mesh ref={(m) => { changed.current[i] = m; }} position={[0, 0.16, 0]} scale={0.001}>
                            <boxGeometry args={[0.2, 0.32, 0.2]} />
                            <meshStandardMaterial color={g.kind === 2 ? p.paper : p.fill} emissive={p.ink} emissiveIntensity={g.kind === 2 ? 0.4 : 0} />
                            <Edges color={p.ink} />
                        </mesh>
                    )}
                </group>
            ))}
        </group>
    );
}

/** FlowAIOS: six channels feed one inbox; three agents work it. */
export function FlowAIOS() {
    const p = usePalette();
    const dots = useRef<Array<THREE.Mesh | null>>([]);
    const agents = useRef<Array<THREE.Mesh | null>>([]);
    const tiles = useMemo(() => Array.from({ length: 6 }, (_, k) => (k / 6) * Math.PI * 2), []);
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        dots.current.forEach((m, k) => {
            if (!m) return;
            const u = loop(t * 0.6 + k / 6, 1);
            const a = tiles[k];
            const r = 1.45 * (1 - ease(u));
            m.position.set(Math.cos(a) * r, 0.3 + Math.sin(Math.PI * u) * 0.3, Math.sin(a) * r * 0.6);
        });
        agents.current.forEach((m, k) => {
            const a = t * 0.9 + (k / 3) * Math.PI * 2;
            m?.position.set(Math.cos(a) * 0.7, 0.85, Math.sin(a) * 0.42);
        });
    });
    return (
        <group>
            {tiles.map((a, k) => (
                <Block key={k} size={[0.26, 0.18, 0.06]} position={[Math.cos(a) * 1.5, 0.3, Math.sin(a) * 0.9]} rotation={[0, -a + Math.PI / 2, 0]} tone="paper" edge={0.7} />
            ))}
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.36, 0.36, 0.4, 40]} />
                <meshStandardMaterial color={p.fill} />
                <Edges color={p.ink} threshold={30} />
            </mesh>
            {tiles.map((_, k) => (
                <Spark key={k} ref={(m) => { dots.current[k] = m; }} r={0.045} />
            ))}
            {[0, 1, 2].map((k) => (
                <mesh key={k} ref={(m) => { agents.current[k] = m; }}>
                    <sphereGeometry args={[0.13, 20, 20]} />
                    <meshStandardMaterial color={p.paper} emissive={p.ink} emissiveIntensity={0.4} />
                </mesh>
            ))}
        </group>
    );
}

/** AI Resume Builder: lines write themselves onto the page; the AI suggests the next. */
export function ResumeBuilder() {
    const p = usePalette();
    const lines = useRef<Array<THREE.Mesh | null>>([]);
    const caret = useRef<THREE.Mesh>(null);
    const ai = useRef<THREE.Mesh>(null);
    const W = [0.9, 0.7, 0.8, 0.55, 0.85, 0.6, 0.75];
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        const u = loop(t, 6) * (W.length + 1);
        lines.current.forEach((m, i) => {
            if (!m) return;
            const k = Math.min(1, Math.max(0, u - i));
            m.scale.x = Math.max(0.001, k);
            m.position.x = -0.5 + (W[i] * k) / 2;
        });
        const cur = Math.min(W.length - 1, Math.floor(u));
        if (caret.current) {
            caret.current.position.set(-0.5 + W[cur] * Math.min(1, u - cur) + 0.04, 1.42 - cur * 0.17, 0.02);
            caret.current.visible = Math.sin(t * 8) > 0;
        }
        if (ai.current) {
            ai.current.position.set(0.95, 1.0 + Math.sin(t * 2) * 0.08, 0.3);
            ai.current.rotation.y = t;
        }
    });
    return (
        <group rotation={[0, 0.25, 0]}>
            <Block size={[1.3, 1.7, 0.03]} position={[-0.05, 0.9, 0]} tone="paper" edge={0.8} />
            <Block size={[0.5, 0.08, 0.01]} position={[-0.25, 1.6, 0.02]} tone="ink" edge={0} />
            {W.map((w, i) => (
                <Block key={i} ref={(m) => { lines.current[i] = m; }} size={[w, 0.05, 0.01]} position={[-0.5, 1.42 - i * 0.17, 0.02]} tone="mid" edge={0} />
            ))}
            <Block ref={caret} size={[0.03, 0.09, 0.01]} tone="ink" edge={0} />
            <mesh ref={ai}>
                <octahedronGeometry args={[0.16]} />
                <meshStandardMaterial color={p.paper} emissive={p.ink} emissiveIntensity={0.5} />
                <Edges color={p.ink} />
            </mesh>
        </group>
    );
}

/** Gemini OCR: a beam reads the document; its fields land in a clean table. */
export function GeminiOCR() {
    const beam = useRef<THREE.Mesh>(null);
    const fields = useRef<Array<THREE.Mesh | null>>([]);
    const v = useMemo(() => ({ a: new THREE.Vector3(), b: new THREE.Vector3(), o: new THREE.Vector3() }), []);
    useFrame(({ clock }) => {
        const u = loop(clock.elapsedTime, 5);
        if (beam.current) beam.current.position.set(-0.9, 1.55 - Math.min(1, u / 0.6) * 1.3, 0.05);
        fields.current.forEach((m, i) => {
            if (!m) return;
            const row = i;
            const k = ease((u - 0.08 - row * 0.08) / 0.2) * (u < 0.94 ? 1 : 1 - ease((u - 0.94) / 0.06));
            v.a.set(-0.9, 1.35 - row * 0.17, 0.05);
            v.b.set(0.75, 1.35 - row * 0.2, 0);
            v.o.lerpVectors(v.a, v.b, k);
            v.o.z += Math.sin(Math.PI * k) * 0.4;
            m.position.copy(v.o);
            m.scale.setScalar(0.4 + 0.6 * k);
        });
    });
    return (
        <group>
            <Block size={[1.1, 1.5, 0.03]} position={[-0.9, 0.85, 0]} rotation={[0, 0.3, 0]} tone="paper" edge={0.8} />
            <Block ref={beam} size={[1.3, 0.025, 0.02]} tone="ink" edge={0} />
            <Block size={[1.0, 1.2, 0.02]} position={[0.75, 0.88, -0.05]} edge={0.6} />
            {Array.from({ length: 6 }, (_, i) => (
                <Block key={i} ref={(m) => { fields.current[i] = m; }} size={[0.8, 0.12, 0.03]} tone={i === 0 ? 'paper' : 'mid'} edge={0.5} />
            ))}
        </group>
    );
}
