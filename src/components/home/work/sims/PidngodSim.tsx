import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Html, Line, type EdgesRef } from '@react-three/drei';
import * as THREE from 'three';
import { analyze, baht, type Analysis, type Severity } from '../../../pidngod/engine';
import { ACCOUNT_NAME, TAX_MONTH, baseCtx, initialDocs, initialRules, type DemoDoc } from '../../../pidngod/data';
import { arc, ease, useCanvasTexture, usePalette, useSurfaceMaps, type SimProps } from './kit';
import { HudButton, HudLabel, SimFrame } from './frame';

/**
 * Pidngod, "The close": the product's 18 sample documents leave the inbox
 * one by one, pass the check gate, and land where the real engine sends
 * them. Clean documents stack on their account code, a duplicate is held
 * beside its twin, and the ones that need judgment wait for you.
 */

type Kind = 'auto' | 'dup' | 'review';
type Item = { doc: DemoDoc; a: Analysis; kind: Kind; code: string; order: number };

const DOCS = initialDocs();
const CTX = baseCtx(initialRules());
const ITEMS: Item[] = DOCS.map((doc, order) => {
    const a = analyze(CTX, doc, DOCS, TAX_MONTH);
    const kind: Kind = a.dupOf ? 'dup' : a.review ? 'review' : 'auto';
    return { doc, a, kind, code: a.code ?? CTX.miscCode, order };
});
const CODES = [...new Set(ITEMS.filter((i) => i.kind !== 'dup').map((i) => i.code))].sort();
const REVIEW = ITEMS.filter((i) => i.kind === 'review');

const STEP = 0.48; // seconds between documents leaving the inbox
const TO_GATE = 0.55;
const TO_DEST = 0.85;
const landAt = (order: number) => order * STEP + TO_GATE + TO_DEST;
const RUN_END = landAt(ITEMS.length - 1) + 0.2;

const INBOX = new THREE.Vector3(-4.3, 0, -0.9);
const GATE_X = -2.5;
const GATE_Z = -0.9;
const COLS = 4;
const pileAt = (code: string) => {
    const k = CODES.indexOf(code);
    return new THREE.Vector3(-0.9 + (k % COLS) * 1.25, 0, -2.0 + Math.floor(k / COLS) * 1.3);
};
// Exceptions wait in a block under the inbox, facing the visitor.
const reviewAt = (j: number) => new THREE.Vector3(-4.75 + (j % 3) * 0.82, 0.7 + Math.floor(j / 3) * 0.02, 0.75 + Math.floor(j / 3) * 1.05);

const SEV_MARK: Record<Severity, string> = { ok: '✓', info: 'i', warn: '!', block: '×' };

function DocCard({
    item,
    face,
    elapsed,
    approvedIndex,
    selected,
    onSelect,
}: {
    item: Item;
    face: THREE.CanvasTexture;
    elapsed: () => number;
    approvedIndex: number | null;
    selected: boolean;
    onSelect: () => void;
}) {
    const p = usePalette();
    const ref = useRef<THREE.Group>(null);
    const edges = useRef<EdgesRef>(null);
    const [hover, setHover] = useState(false);
    const v = useMemo(() => ({ pos: new THREE.Vector3(), a: new THREE.Vector3(), b: new THREE.Vector3(), gate: new THREE.Vector3(GATE_X, 0.45, GATE_Z) }), []);

    // Where this document rests once it has landed.
    const rest = useMemo(() => {
        const sameBefore = (code: string, upTo: number) => ITEMS.filter((o) => o.kind === 'auto' && o.code === code && o.order < upTo).length;
        if (item.kind === 'dup') {
            const twin = ITEMS.find((o) => o.doc.id === item.a.dupOf);
            const base = pileAt(twin?.code ?? item.code);
            return { pos: base.clone().add(new THREE.Vector3(0.5, 0.32, 0.5)), tilt: 0.5, spin: 0.35 };
        }
        if (item.kind === 'review' && approvedIndex === null) {
            return { pos: reviewAt(REVIEW.indexOf(item)), tilt: 0.95, spin: 0 };
        }
        const h = item.kind === 'auto' ? sameBefore(item.code, item.order) : ITEMS.filter((o) => o.kind === 'auto' && o.code === item.code).length + (approvedIndex ?? 0);
        return { pos: pileAt(item.code).add(new THREE.Vector3(0, 0.05 + h * 0.045, 0)), tilt: 0, spin: ((item.order * 37) % 9) * 0.02 - 0.08 };
    }, [item, approvedIndex]);

    useFrame((state) => {
        const g = ref.current;
        if (!g) return;
        const t = elapsed() - item.order * STEP;
        if (t <= 0) {
            // Still in the inbox pile.
            g.position.set(INBOX.x, 0.05 + (ITEMS.length - item.order) * 0.045, INBOX.z);
            g.rotation.set(0, 0.1, 0);
        } else if (t < TO_GATE) {
            v.a.set(INBOX.x, 0.05 + (ITEMS.length - item.order) * 0.045, INBOX.z);
            arc(v.pos, v.a, v.gate, 0.5, t / TO_GATE);
            g.position.copy(v.pos);
            g.rotation.set(1.2 * ease(t / TO_GATE), 0, 0);
        } else {
            const u = Math.min(1, (t - TO_GATE) / TO_DEST);
            v.b.copy(rest.pos);
            if (u < 1) {
                arc(v.pos, v.gate, v.b, 1.1, u);
                g.position.copy(v.pos);
                g.rotation.set(THREE.MathUtils.lerp(1.2, rest.tilt, ease(u)), rest.spin * ease(u), 0);
            } else {
                // Settled: ease toward the rest pose (it moves when approved).
                g.position.lerp(v.b, 0.12);
                g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, rest.tilt, 0.12);
                g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, rest.spin, 0.12);
                if (item.kind === 'review' && approvedIndex === null) g.position.y += Math.sin(state.clock.elapsedTime * 2 + item.order) * 0.003;
            }
        }
        const waiting = item.kind === 'review' && approvedIndex === null && t > TO_GATE + TO_DEST;
        const m = edges.current?.material;
        if (m) m.opacity = selected || hover ? 1 : waiting ? 0.55 + 0.45 * Math.sin(state.clock.elapsedTime * 4) : 0.35;
    });

    return (
        <group
            ref={ref}
            onClick={(e) => {
                e.stopPropagation();
                onSelect();
            }}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHover(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                setHover(false);
                document.body.style.cursor = '';
            }}
        >
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.64, 0.022, 0.88]} />
                <meshStandardMaterial color={p.paper} roughness={0.85} metalness={0.04} />
                <Edges ref={edges} color={p.ink} transparent opacity={0.35} />
            </mesh>
            <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[0.6, 0.84]} />
                <meshStandardMaterial map={face} roughness={0.88} metalness={0.02} />
            </mesh>
        </group>
    );
}

function Gate({ elapsed }: { elapsed: () => number }) {
    const p = usePalette();
    const beam = useRef<THREE.MeshBasicMaterial>(null);
    const floorGlow = useRef<THREE.MeshBasicMaterial>(null);
    const scanLine = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        // The optical scan plane & floor pool flare as each document passes through.
        const t = elapsed();
        let flare = 0;
        for (let i = 0; i < ITEMS.length; i++) {
            const d = t - i * STEP - TO_GATE;
            if (d > -0.12 && d < 0.25) flare = Math.max(flare, 1 - Math.abs(d - 0.05) / 0.2);
        }
        const f = Math.max(0, flare);
        if (beam.current) beam.current.opacity = 0.07 + 0.45 * f;
        if (floorGlow.current) floorGlow.current.opacity = 0.06 + 0.36 * f;
        if (scanLine.current) {
            scanLine.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 5.2) * 0.62;
        }
    });
    return (
        <group position={[GATE_X, 0, GATE_Z]}>
            {/* Anodized twin scanner columns with grounded plinths */}
            {[-0.98, 0.98].map((z) => (
                <group key={z} position={[0, 0, z]}>
                    <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
                        <boxGeometry args={[0.26, 0.08, 0.22]} />
                        <meshStandardMaterial color={p.fill} roughness={0.38} metalness={0.45} />
                        <Edges color={p.mid} />
                    </mesh>
                    <mesh position={[0, 0.88, 0]} castShadow receiveShadow>
                        <boxGeometry args={[0.11, 1.68, 0.11]} />
                        <meshStandardMaterial color={p.fill} roughness={0.32} metalness={0.5} />
                        <Edges color={p.ink} transparent opacity={0.75} />
                    </mesh>
                </group>
            ))}
            {/* Overhead optical bridge + luminous sensor strip */}
            <mesh position={[0, 1.72, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.18, 0.11, 2.12]} />
                <meshStandardMaterial color={p.fill} roughness={0.3} metalness={0.55} />
                <Edges color={p.ink} />
            </mesh>
            <mesh position={[0, 1.655, 0]}>
                <boxGeometry args={[0.04, 0.02, 1.84]} />
                <meshBasicMaterial color={p.ink} toneMapped={false} />
            </mesh>
            {/* Volumetric scan sheet + animated laser sweep line */}
            <mesh position={[0, 0.84, 0]}>
                <boxGeometry args={[0.014, 1.56, 1.84]} />
                <meshBasicMaterial ref={beam} color={p.ink} transparent opacity={0.08} depthWrite={false} />
            </mesh>
            <mesh ref={scanLine} position={[0, 0.8, 0]}>
                <boxGeometry args={[0.025, 0.018, 1.86]} />
                <meshBasicMaterial color={p.ink} transparent opacity={0.85} toneMapped={false} />
            </mesh>
            {/* Soft volumetric floor light pool beneath the scanner arch */}
            <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.85, 2.1]} />
                <meshBasicMaterial ref={floorGlow} color={p.ink} transparent opacity={0.08} depthWrite={false} />
            </mesh>
            <Html position={[0, 2.02, 0]} center pointerEvents="none" zIndexRange={[10, 0]}>
                <span className="whitespace-nowrap rounded-full border border-hairline bg-veil px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-text-mute backdrop-blur-sm">
                    Check gate
                </span>
            </Html>
        </group>
    );
}

function Floor() {
    const p = usePalette();
    const surface = useSurfaceMaps('drafting', p.light, [5, 4]);
    return (
        <group>
            {/* Sculpted matte architectural drafting workbench receiving cast shadows */}
            <mesh position={[-0.6, -0.06, -0.15]} receiveShadow>
                <boxGeometry args={[15.6, 0.12, 11.4]} />
                <meshStandardMaterial map={surface.map} roughnessMap={surface.roughnessMap} roughness={0.92} metalness={0.08} />
                <Edges color={p.faint} />
            </mesh>

            {/* Recessed architectural Inbox tray */}
            <group position={[INBOX.x, 0, INBOX.z]}>
                <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1.12, 0.05, 1.32]} />
                    <meshStandardMaterial color={p.fill} roughness={0.45} metalness={0.35} />
                    <Edges color={p.ink} transparent opacity={0.55} />
                </mesh>
                <mesh position={[0, 0.052, 0]} receiveShadow>
                    <boxGeometry args={[0.92, 0.006, 1.12]} />
                    <meshStandardMaterial color={p.faint} roughness={0.9} />
                </mesh>
            </group>
            <Html position={[INBOX.x, 0.04, INBOX.z + 0.98]} center pointerEvents="none" zIndexRange={[10, 0]}>
                <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] text-text-mute">Inbox · LINE, email, Drive</span>
            </Html>

            {/* Subtle review mat marking the human-judgment zone */}
            <mesh position={[-3.95, 0.006, 1.25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[2.75, 2.25]} />
                <meshStandardMaterial color={p.fill} roughness={0.95} transparent opacity={0.55} />
                <Edges color={p.mid} transparent opacity={0.4} />
            </mesh>

            {/* Account-code ledger bays */}
            {CODES.map((code) => {
                const at = pileAt(code);
                return (
                    <group key={code} position={at}>
                        <mesh position={[0, 0.015, 0]} receiveShadow castShadow>
                            <boxGeometry args={[0.88, 0.03, 1.1]} />
                            <meshStandardMaterial color={p.fill} roughness={0.55} metalness={0.25} />
                            <Edges color={p.mid} transparent opacity={0.48} />
                        </mesh>
                        <Html position={[0, 0.02, 0.7]} center pointerEvents="none" zIndexRange={[10, 0]}>
                            <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.14em] text-text-mute">{code}</span>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
}

function DupLinks({ elapsed }: { elapsed: () => number }) {
    const p = usePalette();
    const [shown, setShown] = useState<string[]>([]);
    useFrame(() => {
        const t = elapsed();
        const now = ITEMS.filter((i) => i.kind === 'dup' && t > landAt(i.order)).map((i) => i.doc.id);
        if (now.length !== shown.length) setShown(now);
    });
    return (
        <>
            {ITEMS.filter((i) => i.kind === 'dup' && shown.includes(i.doc.id)).map((i) => {
                const twin = ITEMS.find((o) => o.doc.id === i.a.dupOf);
                const a = pileAt(twin?.code ?? i.code).add(new THREE.Vector3(0, 0.1, 0));
                const b = a.clone().add(new THREE.Vector3(0.5, 0.24, 0.5));
                return (
                    <group key={i.doc.id}>
                        <Line points={[a, b]} color={p.ink} lineWidth={1} dashed dashSize={0.06} gapSize={0.05} />
                        <Html position={b.clone().add(new THREE.Vector3(0.1, 0.3, 0.2))} center pointerEvents="none" zIndexRange={[10, 0]}>
                            <span className="whitespace-nowrap rounded-full border border-hairline-strong bg-veil px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-text-strong">
                                Duplicate · held
                            </span>
                        </Html>
                    </group>
                );
            })}
        </>
    );
}

function Scene({
    run,
    approved,
    selected,
    onSelect,
    onTick,
}: {
    run: number;
    approved: string[];
    selected: string | null;
    onSelect: (id: string) => void;
    onTick: (t: number) => void;
}) {
    const p = usePalette();
    const face = useCanvasTexture(
        256,
        352,
        (c) => {
            c.fillStyle = p.paper;
            c.fillRect(0, 0, 256, 352);
            // Subtle inner margin border
            c.strokeStyle = p.print;
            c.globalAlpha = 0.14;
            c.lineWidth = 2;
            c.strokeRect(14, 14, 228, 324);
            c.globalAlpha = 1;
            // Header bar & tax invoice mark
            c.fillStyle = p.print;
            c.fillRect(24, 28, 92, 14);
            c.globalAlpha = 0.45;
            c.fillRect(24, 50, 62, 6);
            // Mini QR / e-Tax stamp top-right
            c.globalAlpha = 0.8;
            c.strokeStyle = p.print;
            c.lineWidth = 2;
            c.strokeRect(190, 26, 38, 38);
            c.fillRect(196, 32, 10, 10);
            c.fillRect(212, 32, 10, 10);
            c.fillRect(196, 48, 10, 10);
            c.fillRect(212, 48, 6, 6);
            // Divider rule
            c.globalAlpha = 0.25;
            c.fillRect(24, 78, 208, 2);
            // Itemized table rows with right-aligned amounts
            for (let y = 96; y < 248; y += 22) {
                c.globalAlpha = 0.5;
                c.fillRect(24, y, 96 + ((y * 11) % 44), 5);
                c.globalAlpha = 0.35;
                c.fillRect(184, y, 48, 5);
            }
            // VAT + Total footer block
            c.globalAlpha = 0.22;
            c.fillRect(24, 268, 208, 2);
            c.globalAlpha = 0.55;
            c.fillRect(130, 282, 40, 6);
            c.fillRect(182, 282, 50, 6);
            c.globalAlpha = 0.95;
            c.fillRect(130, 304, 102, 12);
        },
        [p.paper, p.print],
    );
    const start = useRef<number | null>(null);
    const clock = useRef(0);
    const last = useRef(-1);
    useEffect(() => {
        start.current = null;
    }, [run]);
    useFrame((state) => {
        if (start.current === null) start.current = state.clock.elapsedTime + 0.4;
        clock.current = Math.max(0, state.clock.elapsedTime - start.current);
        // Tell the controls roughly ten times a second, not every frame.
        const tick = Math.floor(clock.current * 10);
        if (tick !== last.current) {
            last.current = tick;
            onTick(clock.current);
        }
    });
    const elapsed = () => clock.current;
    return (
        <>
            <Floor />
            <Gate elapsed={elapsed} />
            <DupLinks elapsed={elapsed} />
            {ITEMS.map((item) => (
                <DocCard
                    key={`${run}-${item.doc.id}`}
                    item={item}
                    face={face}
                    elapsed={elapsed}
                    approvedIndex={approved.includes(item.doc.id) ? approved.indexOf(item.doc.id) : null}
                    selected={selected === item.doc.id}
                    onSelect={() => onSelect(item.doc.id)}
                />
            ))}
        </>
    );
}

export default function PidngodSim({ running, compact }: SimProps) {
    const [run, setRun] = useState(0);
    const [t, setT] = useState(0);
    const [approved, setApproved] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);

    const landed = ITEMS.filter((i) => t > landAt(i.order));
    const done = t > RUN_END;
    const waiting = REVIEW.filter((i) => !approved.includes(i.doc.id));
    // Once the run finishes, put the first open exception in front of the visitor.
    const focus = selected ?? (done ? (waiting[0]?.doc.id ?? null) : null);
    const item = ITEMS.find((i) => i.doc.id === focus) ?? null;

    const restart = () => {
        setRun((r) => r + 1);
        setT(0);
        setApproved([]);
        setSelected(null);
    };

    const hud = (
        <>
            <div className="absolute right-3 top-3 grid grid-cols-2 gap-x-4 gap-y-1 rounded-md border border-hairline bg-veil px-3 py-2 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-text-mute sm:grid-cols-4">
                <span>
                    <b className="text-text-strong tabular-nums">{landed.length}</b>/{ITEMS.length} in
                </span>
                <span>
                    <b className="text-text-strong tabular-nums">{landed.filter((i) => i.kind === 'auto').length + approved.length}</b> posted
                </span>
                <span>
                    <b className="text-text-strong tabular-nums">{landed.filter((i) => i.kind === 'dup').length}</b> dup
                </span>
                <span>
                    <b className="text-text-strong tabular-nums">{done ? waiting.length : landed.filter((i) => i.kind === 'review').length}</b> for you
                </span>
            </div>

            {item ? (
                <div className="pointer-events-auto absolute inset-x-3 bottom-3 rounded-md border border-hairline-strong bg-veil p-3 sm:left-auto sm:w-[19rem]">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-text-strong">{item.doc.vendorEn}</p>
                            <p className="truncate text-xs text-text-mute">{item.doc.descEn}</p>
                        </div>
                        <p className="shrink-0 font-mono text-xs tabular-nums text-text-strong">฿{baht(item.doc.base + item.doc.vat)}</p>
                    </div>
                    <ul className="mt-2 space-y-1">
                        {item.kind === 'review' && !item.a.blocks && !item.a.warns && (
                            <li className="flex gap-2 text-[11px] leading-snug text-text">
                                <span className="w-3 shrink-0 text-center font-mono text-text-strong">?</span>
                                The engine is {item.a.conf}% sure of the account code, below the 85% it needs to post on its own.
                            </li>
                        )}
                        {item.a.findings
                            .filter((f) => f.sev !== 'ok')
                            .slice(0, compact ? 1 : 2)
                            .concat(item.a.findings.filter((f) => f.sev !== 'ok').length || item.kind === 'review' ? [] : item.a.findings.slice(0, 1))
                            .map((f, k) => (
                                <li key={k} className="flex gap-2 text-[11px] leading-snug text-text">
                                    <span className="w-3 shrink-0 text-center font-mono text-text-strong">{SEV_MARK[f.sev]}</span>
                                    {f.text.en}
                                </li>
                            ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {item.kind === 'review' && !approved.includes(item.doc.id) ? (
                            <>
                                <HudButton
                                    primary
                                    onClick={() => {
                                        setApproved((a) => [...a, item.doc.id]);
                                        setSelected(null);
                                    }}
                                >
                                    Approve → {item.code}
                                </HudButton>
                                <HudButton onClick={() => setSelected(waiting.find((w) => w.doc.id !== item.doc.id)?.doc.id ?? null)}>Next</HudButton>
                                <HudLabel className="w-full normal-case tracking-[0.08em]">Suggested: {ACCOUNT_NAME[item.code]?.en ?? item.code}</HudLabel>
                            </>
                        ) : (
                            <>
                                <HudLabel>
                                    {item.kind === 'dup' ? 'Held: not posted twice' : `Posted to ${item.code} · ${ACCOUNT_NAME[item.code]?.en ?? ''}`}
                                </HudLabel>
                                <HudButton onClick={() => setSelected(null)}>Close</HudButton>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <p className="absolute bottom-3 left-3 max-w-[16rem] text-xs leading-snug text-text-mute">
                    {done ? 'All exceptions handled. The month is ready to export to PEAK.' : 'The real Pidngod engine is checking 18 sample documents. Click any one.'}
                </p>
            )}

            <div className="absolute left-3 top-9">
                <HudButton onClick={restart}>{done ? 'Run the close again' : 'Restart'}</HudButton>
            </div>
        </>
    );

    return (
        <SimFrame running={running} compact={compact} label="Simulation · real check engine" pose={{ position: [-3.6, 8.0, 9.2], target: [-0.9, -0.3, -0.2], fov: compact ? 52 : 40 }} hud={hud}>
            <Scene run={run} approved={approved} selected={focus} onSelect={setSelected} onTick={setT} />
        </SimFrame>
    );
}

