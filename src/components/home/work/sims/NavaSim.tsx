import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { arc, usePalette, type SimProps } from './kit';
import { HudButton, HudLabel, SimFrame } from './frame';

/**
 * NAVA Airlines, "BKK SAT-1 route network": an architectural monochrome flight
 * operations board anchored at Bangkok Suvarnabhumi. Select any destination
 * corridor (A320neo or A321LR) to inspect its arc, aircraft assignment, block
 * time and smart-hybrid fare tier. Scripted route telemetry for the simulation.
 */

type Route = {
    code: string;
    city: string;
    aircraft: 'A321LR' | 'A320neo';
    block: string;
    fare: string;
    pos: [number, number];
};

const HUB: [number, number] = [-0.6, 0.45];

const ROUTES: Route[] = [
    { code: 'FUK', city: 'Fukuoka', aircraft: 'A321LR', block: '5h 15m', fare: 'THB 4,890', pos: [2.75, -1.65] },
    { code: 'PVG', city: 'Shanghai', aircraft: 'A321LR', block: '4h 10m', fare: 'THB 3,950', pos: [2.05, -2.15] },
    { code: 'ICN', city: 'Seoul', aircraft: 'A321LR', block: '5h 25m', fare: 'THB 5,190', pos: [3.25, -2.35] },
    { code: 'SIN', city: 'Singapore', aircraft: 'A320neo', block: '2h 25m', fare: 'THB 2,190', pos: [-0.2, 2.35] },
    { code: 'SYD', city: 'Sydney', aircraft: 'A321LR', block: '8h 55m', fare: 'THB 8,490', pos: [3.45, 2.15] },
    { code: 'DEL', city: 'Delhi', aircraft: 'A320neo', block: '4h 20m', fare: 'THB 3,690', pos: [-3.35, -1.45] },
];

const CURVES: THREE.Vector3[][] = ROUTES.map((r) => {
    const a = new THREE.Vector3(HUB[0], 0.06, HUB[1]);
    const b = new THREE.Vector3(r.pos[0], 0.06, r.pos[1]);
    const lift = 0.75 + a.distanceTo(b) * 0.28;
    return Array.from({ length: 37 }, (_, k) => arc(new THREE.Vector3(), a, b, lift, k / 36));
});

function Board() {
    const p = usePalette();
    const rings = useMemo(() => [1.3, 2.6, 3.9], []);
    return (
        <group>
            {/* Operations slab */}
            <mesh position={[0, -0.05, 0]}>
                <boxGeometry args={[9.2, 0.1, 6.6]} />
                <meshStandardMaterial color={p.fill} />
                <Edges color={p.faint} />
            </mesh>
            {/* Subtle range rings centered on BKK SAT-1 */}
            {rings.map((r) => (
                <mesh key={r} position={[HUB[0], 0.008, HUB[1]]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[r - 0.015, r, 72]} />
                    <meshBasicMaterial color={p.mid} transparent opacity={0.35} />
                </mesh>
            ))}
            {/* Crosshair axes through BKK */}
            <Line
                points={[
                    [HUB[0] - 3.6, 0.01, HUB[1]],
                    [HUB[0] + 4.4, 0.01, HUB[1]],
                ]}
                color={p.faint}
                lineWidth={1}
                transparent
                opacity={0.45}
            />
            <Line
                points={[
                    [HUB[0], 0.01, HUB[1] - 2.9],
                    [HUB[0], 0.01, HUB[1] + 2.4],
                ]}
                color={p.faint}
                lineWidth={1}
                transparent
                opacity={0.45}
            />
        </group>
    );
}

function HubTower() {
    const p = usePalette();
    const beacon = useRef<THREE.MeshBasicMaterial>(null);
    useFrame((state) => {
        if (beacon.current) {
            beacon.current.opacity = 0.55 + 0.45 * Math.sin(state.clock.elapsedTime * 3.2);
        }
    });
    return (
        <group position={[HUB[0], 0, HUB[1]]}>
            {/* SAT-1 concourse plinth */}
            <mesh position={[0, 0.12, 0]}>
                <boxGeometry args={[0.9, 0.24, 0.34]} />
                <meshStandardMaterial color={p.fill} />
                <Edges color={p.ink} />
            </mesh>
            <mesh position={[0, 0.36, 0]}>
                <cylinderGeometry args={[0.07, 0.1, 0.24, 16]} />
                <meshStandardMaterial color={p.fill} />
                <Edges color={p.ink} threshold={25} />
            </mesh>
            <mesh position={[0, 0.54, 0]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial ref={beacon} color={p.ink} transparent />
            </mesh>
            <Html position={[0, 0.82, 0]} center pointerEvents="none" zIndexRange={[10, 0]}>
                <span className="whitespace-nowrap rounded-full border border-hairline-strong bg-veil px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-text-strong">
                    BKK · SAT-1
                </span>
            </Html>
        </group>
    );
}

function Corridors({ selected, onPick }: { selected: number | null; onPick: (i: number) => void }) {
    const p = usePalette();
    const craftRefs = useRef<Array<THREE.Group | null>>([]);
    const progress = useRef(ROUTES.map((_, i) => i / ROUTES.length));

    useFrame((_, dt) => {
        ROUTES.forEach((_, i) => {
            const active = selected === null || selected === i;
            const speed = selected === i ? 0.34 : 0.18;
            progress.current[i] = (progress.current[i] + dt * speed) % 1;
            const grp = craftRefs.current[i];
            if (!grp) return;
            const pts = CURVES[i];
            const f = progress.current[i] * (pts.length - 1);
            const idx = Math.min(pts.length - 2, Math.floor(f));
            const frac = f - idx;
            const cur = pts[idx].clone().lerp(pts[idx + 1], frac);
            grp.position.copy(cur);
            grp.lookAt(pts[idx + 1]);
            grp.scale.setScalar(active ? (selected === i ? 1.35 : 0.9) : 0.45);
        });
    });

    return (
        <group>
            {ROUTES.map((r, i) => {
                const isSelected = selected === i;
                const dimmed = selected !== null && !isSelected;
                return (
                    <group key={r.code}>
                        <Line
                            points={CURVES[i]}
                            color={isSelected ? p.ink : p.soft}
                            lineWidth={isSelected ? 2 : 1}
                            transparent
                            opacity={dimmed ? 0.16 : isSelected ? 0.95 : 0.48}
                        />

                        {/* Animated aircraft marker gliding along the corridor */}
                        <group
                            ref={(el) => {
                                craftRefs.current[i] = el;
                            }}
                        >
                            <mesh rotation={[Math.PI / 2, 0, 0]}>
                                <coneGeometry args={[0.075, 0.24, 4]} />
                                <meshBasicMaterial color={isSelected ? p.ink : p.soft} transparent opacity={dimmed ? 0.25 : 1} />
                            </mesh>
                        </group>

                        {/* Destination pad */}
                        <group position={[r.pos[0], 0, r.pos[1]]}>
                            <mesh
                                position={[0, 0.04, 0]}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onPick(i);
                                }}
                            >
                                <cylinderGeometry args={[0.16, 0.18, 0.08, 20]} />
                                <meshStandardMaterial color={isSelected ? p.paper : p.fill} />
                                <Edges color={isSelected ? p.ink : p.mid} threshold={25} />
                            </mesh>
                            <Html position={[0, 0.34, 0]} center pointerEvents="none" zIndexRange={[10, 0]}>
                                <span
                                    className={`whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] transition-opacity ${
                                        dimmed ? 'text-text-mute opacity-30' : isSelected ? 'text-text-strong opacity-100' : 'text-text-mute opacity-85'
                                    }`}
                                >
                                    {r.code}
                                </span>
                            </Html>
                        </group>
                    </group>
                );
            })}
        </group>
    );
}

export default function NavaSim({ running, compact }: SimProps) {
    const [selected, setSelected] = useState<number | null>(0);
    const [auto, setAuto] = useState(true);

    // Cycle corridors gently until the visitor chooses one manually.
    useEffect(() => {
        if (!running || !auto) return;
        const id = window.setInterval(() => {
            setSelected((cur) => (cur === null ? 0 : (cur + 1) % ROUTES.length));
        }, 3600);
        return () => window.clearInterval(id);
    }, [running, auto]);

    const pick = (i: number | null) => {
        setAuto(false);
        setSelected(i);
    };

    const route = selected !== null ? ROUTES[selected] : null;

    const hud = (
        <div className="flex h-full flex-col justify-between p-3.5">
            <div className="flex justify-end">
                <div className="rounded-lg border border-hairline bg-veil px-3 py-2 text-right backdrop-blur-sm">
                    <HudLabel>{route ? `BKK → ${route.code} · ${route.aircraft}` : 'BKK SAT-1 · 6 Corridors'}</HudLabel>
                    <p className="mt-1 font-display text-sm font-medium text-text-strong">
                        {route ? `${route.city} · ${route.block}` : 'A320neo & A321LR Fleet'}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-mute">
                        {route ? `Hybrid fare from ${route.fare}` : '17 live routes · PromptPay checkout'}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                    {ROUTES.slice(0, compact ? 4 : 6).map((r, i) => (
                        <HudButton key={r.code} primary={selected === i} onClick={() => pick(i)}>
                            {r.code}
                        </HudButton>
                    ))}
                    <HudButton primary={selected === null} onClick={() => pick(null)}>
                        All
                    </HudButton>
                </div>
            </div>
        </div>
    );

    return (
        <SimFrame
            running={running}
            compact={compact}
            pose={{ position: [0.3, 6.2, 7.6], target: [0.1, 0.2, 0.1], fov: 35 }}
            label="Simulation · BKK SAT-1 route network"
            hud={hud}
        >
            <Board />
            <HubTower />
            <Corridors selected={selected} onPick={(i) => pick(i)} />
        </SimFrame>
    );
}
