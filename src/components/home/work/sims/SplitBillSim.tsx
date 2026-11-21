import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import { arc, ease, useCanvasTexture, usePalette, useSurfaceMaps, type SimProps } from './kit';
import { HudButton, HudLabel, SimFrame } from './frame';

/**
 * SplitBill AI, "Scan it, split it": a receipt from a Bangkok dinner is
 * scanned line by line; each dish lifts off as a tile and lands on the plate
 * of whoever ordered it, shared dishes split four ways. Move a dish to
 * another plate and every total, service charge and VAT included, follows.
 */

type Item = { id: string; name: string; price: number; owner: number | 'all' };
const PEOPLE = ['Ploy', 'Ton', 'Mint', 'You'];
const ITEMS: Item[] = [
    { id: 'khaosoi', name: 'Khao soi gai', price: 120, owner: 0 },
    { id: 'krapao', name: 'Pad kra pao moo', price: 90, owner: 1 },
    { id: 'tomyum', name: 'Tom yum goong', price: 240, owner: 'all' },
    { id: 'somtam', name: 'Som tam thai', price: 80, owner: 2 },
    { id: 'mango', name: 'Mango sticky rice', price: 110, owner: 3 },
    { id: 'tea', name: 'Thai iced tea x2', price: 110, owner: 0 },
    { id: 'singha', name: 'Singha x3', price: 270, owner: 'all' },
    { id: 'rice', name: 'Steamed rice x4', price: 60, owner: 'all' },
];
const SERVICE = 0.1;
const VAT = 0.07;
const gross = (sub: number) => sub * (1 + SERVICE) * (1 + VAT);
const thb = (n: number) => `฿${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

// Receipt geometry (world units) and where each line sits on it.
const R_W = 2.1;
const R_H = 3.7;
const R_POS = new THREE.Vector3(0, 2.15, -1.4);
const ROW0 = 0.27; // first item row, as a fraction from the top
const ROW_STEP = 0.062;
const rowFrac = (i: number) => ROW0 + i * ROW_STEP;
const rowWorld = (i: number) => new THREE.Vector3(0.15, R_POS.y + R_H / 2 - rowFrac(i) * R_H, R_POS.z + 0.08);

const SCAN_START = 0.5;
const SCAN_DUR = 3.2;
const passAt = (i: number) => SCAN_START + ((rowFrac(i) - 0.05) / 0.9) * SCAN_DUR;
const FLY = 0.85;

const PLATE_Z = 1.45;
const plateAt = (k: number) => new THREE.Vector3(-2.55 + k * 1.7, 0.05, PLATE_Z);

function Receipt() {
    const p = usePalette();
    const tex = useCanvasTexture(
        512,
        902,
        (c) => {
            c.fillStyle = p.paper;
            c.fillRect(0, 0, 512, 902);
            c.fillStyle = p.print;
            c.textBaseline = 'middle';
            c.font = '600 30px ui-monospace, Menlo, monospace';
            c.textAlign = 'center';
            c.fillText('RIM KLONG KITCHEN', 256, 58);
            c.font = '20px ui-monospace, Menlo, monospace';
            c.fillText('Table 7 · 4 guests · 20:41', 256, 98);
            c.fillText('- - - - - - - - - - - - - - - - - - -', 256, 150);
            c.font = '22px ui-monospace, Menlo, monospace';
            ITEMS.forEach((it, i) => {
                const y = rowFrac(i) * 902;
                c.textAlign = 'left';
                c.fillText(it.name, 40, y);
                c.textAlign = 'right';
                c.fillText(it.price.toFixed(2), 472, y);
            });
            const sub = ITEMS.reduce((s, it) => s + it.price, 0);
            const yEnd = rowFrac(ITEMS.length) * 902 + 10;
            c.textAlign = 'center';
            c.fillText('- - - - - - - - - - - - - - - - - - -', 256, yEnd);
            const lines: Array<[string, number]> = [
                ['Subtotal', sub],
                ['Service 10%', sub * SERVICE],
                ['VAT 7%', sub * (1 + SERVICE) * VAT],
            ];
            lines.forEach(([k, v], j) => {
                c.textAlign = 'left';
                c.fillText(k, 40, yEnd + 36 + j * 30);
                c.textAlign = 'right';
                c.fillText(v.toFixed(2), 472, yEnd + 36 + j * 30);
            });
            c.textAlign = 'center';
            c.fillText('- - - - - - - - - - - - - - - - - - -', 256, yEnd + 124);
            c.font = '600 28px ui-monospace, Menlo, monospace';
            c.textAlign = 'left';
            c.fillText('TOTAL', 40, yEnd + 154);
            c.textAlign = 'right';
            c.fillText(`THB ${gross(sub).toFixed(2)}`, 472, yEnd + 154);
            c.font = '16px ui-monospace, Menlo, monospace';
            c.textAlign = 'center';
            c.globalAlpha = 0.55;
            c.fillText('THANK YOU · BANGKOK', 256, 884);
            c.globalAlpha = 1;
        },
        [p.paper, p.print],
    );
    return (
        <group position={R_POS} rotation={[-0.1, 0, 0]}>
            {/* Grounded receipt stand base */}
            <mesh position={[0, -R_H / 2 - 0.12, -0.06]} castShadow receiveShadow>
                <boxGeometry args={[1.4, 0.06, 0.34]} />
                <meshStandardMaterial color={p.fill} roughness={0.45} metalness={0.4} />
                <Edges color={p.mid} />
            </mesh>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[R_W, R_H, 0.028]} />
                <meshStandardMaterial color={p.paper} roughness={0.86} metalness={0.02} />
                <Edges color={p.ink} transparent opacity={0.55} />
            </mesh>
            <mesh position={[0, 0, 0.015]} receiveShadow>
                <planeGeometry args={[R_W - 0.04, R_H - 0.04]} />
                <meshStandardMaterial map={tex} roughness={0.9} metalness={0.02} />
            </mesh>
            {/* Camera OCR viewfinder brackets framing the receipt */}
            {[
                [-1, 1],
                [1, 1],
                [-1, -1],
                [1, -1],
            ].map(([sx, sy]) => (
                <group key={`${sx}-${sy}`} position={[sx * (R_W / 2 + 0.14), sy * (R_H / 2 + 0.12), 0.04]}>
                    <mesh position={[-sx * 0.08, 0, 0]}>
                        <boxGeometry args={[0.18, 0.018, 0.01]} />
                        <meshBasicMaterial color={p.ink} transparent opacity={0.65} />
                    </mesh>
                    <mesh position={[0, -sy * 0.08, 0]}>
                        <boxGeometry args={[0.018, 0.18, 0.01]} />
                        <meshBasicMaterial color={p.ink} transparent opacity={0.65} />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

function Beam({ elapsed }: { elapsed: () => number }) {
    const p = usePalette();
    const ref = useRef<THREE.Group>(null);
    const mat = useRef<THREE.MeshBasicMaterial>(null);
    const apron = useRef<THREE.MeshBasicMaterial>(null);
    useFrame(() => {
        const u = (elapsed() - SCAN_START) / SCAN_DUR;
        const on = u > 0 && u < 1;
        if (ref.current) {
            ref.current.visible = on;
            ref.current.position.y = R_POS.y + R_H / 2 - (0.05 + 0.9 * Math.min(1, Math.max(0, u))) * R_H;
        }
        if (mat.current) mat.current.opacity = on ? 0.92 : 0;
        if (apron.current) apron.current.opacity = on ? 0.16 : 0;
    });
    return (
        <group ref={ref} position={[0, R_POS.y, R_POS.z + 0.06]} rotation={[-0.1, 0, 0]}>
            <mesh>
                <boxGeometry args={[R_W + 0.56, 0.026, 0.024]} />
                <meshBasicMaterial ref={mat} color={p.ink} transparent opacity={0} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0.16, -0.01]}>
                <planeGeometry args={[R_W + 0.42, 0.32]} />
                <meshBasicMaterial ref={apron} color={p.ink} transparent opacity={0} depthWrite={false} />
            </mesh>
        </group>
    );
}

function ItemTile({
    item,
    index,
    owner,
    slot,
    elapsed,
    picked,
    onPick,
    onDrop,
}: {
    item: Item;
    index: number;
    owner: number;
    slot: number;
    elapsed: () => number;
    picked: boolean;
    onPick: () => void;
    onDrop: (x: number) => void;
}) {
    const p = usePalette();
    const ref = useRef<THREE.Group>(null);
    const drag = useRef<{ x: number; z: number; moved: boolean } | null>(null);
    const [hover, setHover] = useState(false);
    const label = useCanvasTexture(
        256,
        96,
        (c) => {
            c.fillStyle = p.paper;
            c.fillRect(0, 0, 256, 96);
            c.fillStyle = p.print;
            c.font = '600 24px ui-sans-serif, system-ui, sans-serif';
            c.textBaseline = 'middle';
            c.fillText(item.name, 14, 34);
            c.font = '20px ui-monospace, Menlo, monospace';
            c.fillText(thb(item.price), 14, 70);
        },
        [p.paper, p.print, item.name],
    );
    const v = useMemo(() => ({ pos: new THREE.Vector3(), rest: new THREE.Vector3() }), []);

    useFrame(() => {
        const g = ref.current;
        if (!g) return;
        const t = elapsed() - passAt(index);
        v.rest.copy(plateAt(owner)).add(new THREE.Vector3(((slot % 2) - 0.5) * 0.08, 0.095 + slot * 0.075, ((slot * 13) % 5) * 0.02 - 0.04));
        if (t <= 0) {
            g.visible = false;
            return;
        }
        g.visible = true;
        if (drag.current) {
            g.position.lerp(new THREE.Vector3(drag.current.x, 0.75, drag.current.z), 0.35);
            g.rotation.set(0, 0, 0);
            return;
        }
        if (t < FLY) {
            arc(v.pos, rowWorld(index), v.rest, 1.0, t / FLY);
            g.position.copy(v.pos);
            g.rotation.set((1 - ease(t / FLY)) * 1.4, 0, 0);
        } else {
            g.position.lerp(v.rest, 0.16);
            g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0, 0.16);
            g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, ((slot * 7) % 5) * 0.05 - 0.1, 0.16);
        }
        const lift = picked || hover ? 0.12 : 0;
        g.position.y += lift * 0.2;
    });

    const onDown = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        (e.target as Element).setPointerCapture?.(e.pointerId);
        drag.current = { x: e.point.x, z: e.point.z, moved: false };
    };
    const onMove = (e: ThreeEvent<PointerEvent>) => {
        const d = drag.current;
        if (!d) return;
        const hit = new THREE.Vector3();
        e.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.75), hit);
        if (hit) {
            if (Math.hypot(hit.x - d.x, hit.z - d.z) > 0.15) d.moved = true;
            d.x = hit.x;
            d.z = hit.z;
        }
    };
    const onUp = (e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        if (d.moved) onDrop(d.x);
        else onPick();
    };

    return (
        <group
            ref={ref}
            visible={false}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHover(true);
                document.body.style.cursor = 'grab';
            }}
            onPointerOut={() => {
                setHover(false);
                document.body.style.cursor = '';
            }}
        >
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.96, 0.052, 0.36]} />
                <meshStandardMaterial color={p.paper} roughness={0.65} metalness={0.05} />
                <Edges color={p.ink} transparent opacity={picked || hover ? 1 : 0.48} />
            </mesh>
            <mesh position={[0, 0.027, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[0.92, 0.345]} />
                <meshStandardMaterial map={label} roughness={0.78} metalness={0.02} />
            </mesh>
        </group>
    );
}

/** A shared dish: four slivers, one to each plate. */
function SharedSlivers({ index, elapsed, base }: { index: number; elapsed: () => number; base: number[] }) {
    const p = usePalette();
    const refs = useRef<Array<THREE.Mesh | null>>([]);
    const v = useMemo(() => ({ pos: new THREE.Vector3(), rest: new THREE.Vector3() }), []);
    useFrame(() => {
        const t = elapsed() - passAt(index);
        refs.current.forEach((m, k) => {
            if (!m) return;
            m.visible = t > 0;
            if (t <= 0) return;
            v.rest.copy(plateAt(k)).add(new THREE.Vector3(0.42, 0.07 + base[k] * 0.045, -0.3 + base[k] * 0.02));
            const u = (t - k * 0.06) / FLY;
            if (u < 1) {
                arc(v.pos, rowWorld(index), v.rest, 1.2, Math.max(0, u));
                m.position.copy(v.pos);
            } else m.position.lerp(v.rest, 0.2);
        });
    });
    return (
        <>
            {PEOPLE.map((_, k) => (
                <mesh key={k} ref={(m) => (refs.current[k] = m)} visible={false} castShadow receiveShadow>
                    <boxGeometry args={[0.3, 0.036, 0.2]} />
                    <meshStandardMaterial color={p.mid} roughness={0.35} metalness={0.25} />
                    <Edges color={p.ink} transparent opacity={0.55} />
                </mesh>
            ))}
        </>
    );
}

function Plates({ totals, picked, onPlate }: { totals: number[]; picked: boolean; onPlate: (k: number) => void }) {
    const p = usePalette();
    return (
        <>
            {PEOPLE.map((name, k) => (
                <group key={name} position={plateAt(k)}>
                    {/* Outer glazed stoneware dinner plate rim */}
                    <mesh
                        castShadow
                        receiveShadow
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlate(k);
                        }}
                        onPointerOver={() => picked && (document.body.style.cursor = 'pointer')}
                        onPointerOut={() => (document.body.style.cursor = '')}
                    >
                        <cylinderGeometry args={[0.74, 0.64, 0.06, 48]} />
                        <meshStandardMaterial color={p.fill} roughness={0.26} metalness={0.1} />
                        <Edges color={p.ink} transparent opacity={picked ? 0.92 : 0.42} threshold={30} />
                    </mesh>
                    {/* Inner recessed ceramic well catching crisp specular highlights */}
                    <mesh position={[0, 0.032, 0]} receiveShadow>
                        <cylinderGeometry args={[0.56, 0.54, 0.012, 40]} />
                        <meshStandardMaterial color={p.light ? '#f2f2f0' : '#1c1c20'} roughness={0.22} metalness={0.08} />
                        <Edges color={p.mid} transparent opacity={0.35} threshold={30} />
                    </mesh>
                    {/* Minimalist chopsticks + frosted water tumbler setting */}
                    <group position={[0.78, 0.015, 0.04]}>
                        <mesh position={[0, 0, -0.03]} castShadow>
                            <boxGeometry args={[0.022, 0.018, 0.78]} />
                            <meshStandardMaterial color={p.mid} roughness={0.55} />
                        </mesh>
                        <mesh position={[0.045, 0, -0.02]} castShadow>
                            <boxGeometry args={[0.022, 0.018, 0.78]} />
                            <meshStandardMaterial color={p.mid} roughness={0.55} />
                        </mesh>
                        <mesh position={[0.02, -0.008, 0.2]} castShadow>
                            <boxGeometry args={[0.12, 0.022, 0.045]} />
                            <meshStandardMaterial color={p.soft} roughness={0.3} metalness={0.2} />
                        </mesh>
                    </group>
                    <mesh position={[0.64, 0.16, -0.62]} castShadow receiveShadow>
                        <cylinderGeometry args={[0.14, 0.11, 0.34, 24]} />
                        <meshStandardMaterial color={p.soft} roughness={0.18} metalness={0.12} transparent opacity={0.5} />
                        <Edges color={p.ink} transparent opacity={0.35} threshold={35} />
                    </mesh>
                    <Html position={[0, 0.02, 1.02]} center pointerEvents="none" zIndexRange={[10, 0]}>
                        <div className="whitespace-nowrap text-center">
                            <p className="text-xs font-medium text-text-strong">{name}</p>
                            <p className="font-mono text-[10px] tabular-nums text-text-mute">{thb(totals[k])}</p>
                        </div>
                    </Html>
                </group>
            ))}
        </>
    );
}

function Table() {
    const p = usePalette();
    const stone = useSurfaceMaps('stone', p.light, [3, 2]);
    return (
        <group>
            {/* Honed architectural stone dining slab receiving soft cast shadows */}
            <mesh position={[0, -0.08, 0.2]} receiveShadow castShadow>
                <boxGeometry args={[9.0, 0.16, 5.2]} />
                <meshStandardMaterial map={stone.map} roughnessMap={stone.roughnessMap} roughness={0.82} metalness={0.08} />
                <Edges color={p.mid} transparent opacity={0.4} />
            </mesh>
            {/* Subtle recessed table apron */}
            <mesh position={[0, -0.24, 0.2]} receiveShadow>
                <boxGeometry args={[8.4, 0.16, 4.6]} />
                <meshStandardMaterial color={p.fill} roughness={0.7} metalness={0.2} />
            </mesh>
        </group>
    );
}

function Scene({
    run,
    owners,
    picked,
    totals,
    onPick,
    onAssign,
    onTick,
}: {
    run: number;
    owners: Record<string, number>;
    picked: string | null;
    totals: number[];
    onPick: (id: string | null) => void;
    onAssign: (id: string, k: number) => void;
    onTick: (t: number) => void;
}) {
    const start = useRef<number | null>(null);
    const clock = useRef(0);
    const last = useRef(-1);
    useEffect(() => {
        start.current = null;
    }, [run]);
    useFrame((state) => {
        if (start.current === null) start.current = state.clock.elapsedTime;
        clock.current = state.clock.elapsedTime - start.current;
        const tick = Math.floor(clock.current * 8);
        if (tick !== last.current) {
            last.current = tick;
            onTick(clock.current);
        }
    });
    const elapsed = () => clock.current;

    // Stack order on each plate: personal dishes in receipt order.
    const slots: Record<string, number> = {};
    const count = [0, 0, 0, 0];
    ITEMS.forEach((it) => {
        if (it.owner === 'all') return;
        const k = owners[it.id];
        slots[it.id] = count[k]++;
    });
    const sharedBase = ITEMS.filter((it) => it.owner === 'all').map((_, j) => PEOPLE.map(() => j));

    return (
        <group onPointerMissed={() => onPick(null)}>
            <Table />
            <Receipt />
            <Beam elapsed={elapsed} />
            <Plates totals={totals} picked={picked !== null} onPlate={(k) => picked && onAssign(picked, k)} />
            {ITEMS.map((it, i) =>
                it.owner === 'all' ? (
                    <SharedSlivers key={`${run}-${it.id}`} index={i} elapsed={elapsed} base={sharedBase[ITEMS.filter((x) => x.owner === 'all').indexOf(it)]} />
                ) : (
                    <ItemTile
                        key={`${run}-${it.id}`}
                        item={it}
                        index={i}
                        owner={owners[it.id]}
                        slot={slots[it.id]}
                        elapsed={elapsed}
                        picked={picked === it.id}
                        onPick={() => onPick(picked === it.id ? null : it.id)}
                        onDrop={(x) => {
                            const k = PEOPLE.map((_, j) => Math.abs(plateAt(j).x - x)).reduce((best, d, j, all) => (d < all[best] ? j : best), 0);
                            onAssign(it.id, k);
                        }}
                    />
                ),
            )}
        </group>
    );
}

const initialOwners = () => Object.fromEntries(ITEMS.filter((it) => it.owner !== 'all').map((it) => [it.id, it.owner as number]));

export default function SplitBillSim({ running, compact }: SimProps) {
    const [run, setRun] = useState(0);
    const [t, setT] = useState(0);
    const [owners, setOwners] = useState<Record<string, number>>(initialOwners);
    const [picked, setPicked] = useState<string | null>(null);

    // Totals count only what has been scanned so far.
    const totals = PEOPLE.map((_, k) => {
        let sub = 0;
        ITEMS.forEach((it, i) => {
            if (t < passAt(i) + FLY) return;
            if (it.owner === 'all') sub += it.price / PEOPLE.length;
            else if (owners[it.id] === k) sub += it.price;
        });
        return gross(sub);
    });
    const scanned = ITEMS.filter((_, i) => t >= passAt(i)).length;
    const done = t > passAt(ITEMS.length - 1) + FLY;
    const bill = gross(ITEMS.reduce((s, it) => s + it.price, 0));
    const pickedItem = ITEMS.find((it) => it.id === picked);

    const assign = (id: string, k: number) => {
        setOwners((o) => ({ ...o, [id]: k }));
        setPicked(null);
    };

    const hud = (
        <>
            <div className="absolute left-3 top-9">
                <HudButton
                    onClick={() => {
                        setRun((r) => r + 1);
                        setT(0);
                        setOwners(initialOwners());
                        setPicked(null);
                    }}
                >
                    Scan again
                </HudButton>
            </div>
            {compact && (
                <div className="absolute right-3 top-3 rounded-md border border-hairline bg-veil px-2.5 py-1.5 text-right">
                    <HudLabel>{done ? 'Bill' : `${scanned}/${ITEMS.length} lines`}</HudLabel>
                    <p className="font-mono text-xs tabular-nums text-text-strong">{thb(bill)}</p>
                </div>
            )}
            <div className={`absolute right-3 top-3 w-44 rounded-md border border-hairline bg-veil p-3 ${compact ? 'hidden' : ''}`}>
                <HudLabel>{done ? 'Split' : `Reading · ${scanned}/${ITEMS.length} lines`}</HudLabel>
                <ul className="mt-2 space-y-1">
                    {PEOPLE.map((name, k) => (
                        <li key={name} className="flex items-baseline justify-between text-xs">
                            <span className="text-text">{name}</span>
                            <span className="font-mono tabular-nums text-text-strong">{thb(totals[k])}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-2 flex items-baseline justify-between border-t border-hairline pt-2 text-xs">
                    <span className="text-text-mute">Bill</span>
                    <span className="font-mono tabular-nums text-text-strong">{thb(bill)}</span>
                </div>
                <p className="mt-1 text-[10px] leading-snug text-text-mute">Service 10% and VAT 7% shared in proportion. Shared dishes split four ways.</p>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
                {pickedItem ? (
                    <>
                        <HudLabel className="text-text-strong">Move {pickedItem.name} to</HudLabel>
                        {PEOPLE.map((name, k) => (
                            <HudButton key={name} onClick={() => assign(pickedItem.id, k)} primary={owners[pickedItem.id] === k}>
                                {name}
                            </HudButton>
                        ))}
                    </>
                ) : (
                    <p className="text-xs text-text-mute">
                        {done ? (compact ? 'Tap a dish, then choose who had it.' : 'Drag a dish to another plate, or click it to choose.') : 'Gemini reads each line of the receipt.'}
                    </p>
                )}
            </div>
        </>
    );

    return (
        <SimFrame running={running} compact={compact} label="Simulation · sample receipt" pose={{ position: [0, 5.4, 9.6], target: [0, 1.25, -0.1], fov: compact ? 52 : 42 }} hud={hud}>
            <Scene run={run} owners={owners} picked={picked} totals={totals} onPick={setPicked} onAssign={assign} onTick={setT} />
        </SimFrame>
    );
}
