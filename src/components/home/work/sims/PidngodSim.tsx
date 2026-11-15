import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Html, Line, type EdgesRef } from '@react-three/drei';
import * as THREE from 'three';
import { analyze, baht, type Analysis, type Severity } from '../../../pidngod/engine';
import { ACCOUNT_NAME, TAX_MONTH, baseCtx, initialDocs, initialRules, type DemoDoc } from '../../../pidngod/data';
import { arc, ease, useCanvasTexture, usePalette, type SimProps } from './kit';
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
    elapsed,
    approvedIndex,
    selected,
    onSelect,
}: {
    item: Item;
    elapsed: () => number;
    approvedIndex: number | null;
    selected: boolean;
    onSelect: () => void;
}) {
    const p = usePalette();
    const ref = useRef<THREE.Group>(null);
    const edges = useRef<EdgesRef>(null);
    const [hover, setHover] = useState(false);
    const face = useCanvasTexture(
        128,
        176,
        (c) => {
            c.fillStyle = p.paper;
            c.fillRect(0, 0, 128, 176);
            c.fillStyle = p.print;
            c.fillRect(12, 14, 46, 8);
            c.globalAlpha = 0.55;
            for (let y = 36; y < 140; y += 12) c.fillRect(12, y, 70 + ((y * 7) % 34), 3);
            c.globalAlpha = 1;
            c.fillRect(80, 150, 36, 6);
        },
        [p.paper, p.print],
    );
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
            <mesh castShadow>
                <boxGeometry args={[0.62, 0.02, 0.86]} />
                <meshStandardMaterial color={p.paper} roughness={0.9} />
                <Edges ref={edges} color={p.ink} transparent opacity={0.35} />
            </mesh>
            <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.58, 0.82]} />
                <meshBasicMaterial map={face} toneMapped={false} />
            </mesh>
        </group>
    );
}

function Gate({ elapsed }: { elapsed: () => number }) {
    const p = usePalette();
    const beam = useRef<THREE.MeshBasicMaterial>(null);
    useFrame(() => {
        // The scan plane flares as each document passes through it.
        const t = elapsed();
        let flare = 0;
        for (let i = 0; i < ITEMS.length; i++) {
            const d = t - i * STEP - TO_GATE;
            if (d > -0.12 && d < 0.25) flare = Math.max(flare, 1 - Math.abs(d - 0.05) / 0.2);
        }
        if (beam.current) beam.current.opacity = 0.06 + 0.5 * Math.max(0, flare);
    });
    return (
        <group position={[GATE_X, 0, GATE_Z]}>
            {[-0.95, 0.95].map((z) => (
                <mesh key={z} position={[0, 0.8, z]}>
                    <boxGeometry args={[0.08, 1.6, 0.08]} />
                    <meshStandardMaterial color={p.fill} />
                    <Edges color={p.ink} />
                </mesh>
            ))}
            <mesh position={[0, 1.64, 0]}>
                <boxGeometry args={[0.08, 0.08, 1.98]} />
                <meshStandardMaterial color={p.fill} />
                <Edges color={p.ink} />
            </mesh>
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[0.01, 1.52, 1.82]} />
                <meshBasicMaterial ref={beam} color={p.ink} transparent opacity={0.08} depthWrite={false} />
            </mesh>
            <Html position={[0, 1.95, 0]} center pointerEvents="none" zIndexRange={[10, 0]}>
                <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] text-text-mute">Check gate</span>
            </Html>
        </group>
    );
}

function Floor() {
    const p = usePalette();
    return (
        <group>
            <gridHelper args={[16, 32, p.faint, p.faint]} position={[0, -0.001, 0]} />
            <mesh position={[INBOX.x, 0.0, INBOX.z]}>
                <boxGeometry args={[1.0, 0.02, 1.2]} />
                <meshStandardMaterial color={p.fill} />
                <Edges color={p.mid} />
            </mesh>
            <Html position={[INBOX.x, 0, INBOX.z + 0.95]} center pointerEvents="none" zIndexRange={[10, 0]}>
                <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] text-text-mute">Inbox · LINE, email, Drive</span>
            </Html>
            {CODES.map((code) => {
                const at = pileAt(code);
                return (
                    <group key={code} position={at}>
                        <mesh>
                            <boxGeometry args={[0.8, 0.01, 1.02]} />
                            <meshStandardMaterial color={p.fill} />
                            <Edges color={p.faint} />
                        </mesh>
                        <Html position={[0, 0, 0.66]} center pointerEvents="none" zIndexRange={[10, 0]}>
                            <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.12em] text-text-mute">{code}</span>
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

