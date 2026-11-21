import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ease, useBeamTexture, useCanvasTexture, usePalette, useSurfaceMaps, type SimProps } from './kit';
import { HudButton, HudLabel, SimFrame } from './frame';

/**
 * Klikr, "The live room": a hall of a few hundred phones, one question on
 * the screen. Answer before the countdown ends, then watch every phone's
 * vote fly to the front and build the chart, the right answer light up and
 * the leaderboard settle, all in real time.
 */

type Q = { q: string; options: [string, string, string, string]; correct: number; weights: [number, number, number, number] };
const QUESTIONS: Q[] = [
    {
        q: "How many hours of finance work does Wutcharin's team automate each year?",
        options: ['1,500', '5,000', '15,000+', '150,000'],
        correct: 2,
        weights: [0.07, 0.16, 0.64, 0.13],
    },
    {
        q: 'What does the Thai word ปิดงวด (Pidngod) mean?',
        options: ['Close the period', 'Split the bill', 'Book a table', 'Open a tab'],
        correct: 0,
        weights: [0.58, 0.18, 0.12, 0.12],
    },
    {
        q: 'In Klikr, when does the leaderboard update?',
        options: ['At the end of the event', 'Once a day', 'The moment answers land', 'When the host refreshes'],
        correct: 2,
        weights: [0.14, 0.06, 0.7, 0.1],
    },
];
const LETTERS = ['A', 'B', 'C', 'D'];
const ASK_SECONDS = 10;
const VOTE_SECONDS = 2.4; // spread of the crowd's answers
const FLY = 0.9;
const NAMES = ['Ploy', 'Ton', 'Mint', 'Bank', 'Fah', 'Nut', 'Beam', 'Pim', 'Aom', 'Golf', 'May', 'Oat'];
const INITIALS = 'ABCDJKLMNPRSTW';
/** A player's display name: a nickname and an initial, stable per seat. */
const playerName = (i: number) => `${NAMES[i % NAMES.length]} ${INITIALS[Math.floor(i / NAMES.length) % INITIALS.length]}.`;

function prng(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** Seats in curved, rising rows, facing the screen. */
function makeHall(rows: number) {
    const seats: THREE.Vector3[] = [];
    for (let r = 0; r < rows; r++) {
        const radius = 4.0 + r * 0.52;
        const span = 1.25;
        const n = Math.floor((radius * span * 2) / 0.3);
        for (let k = 0; k < n; k++) {
            const a = -span + (k + 0.5) * ((span * 2) / n);
            seats.push(new THREE.Vector3(Math.sin(a) * radius, 0.35 + r * 0.24, -2.9 + Math.cos(a) * radius));
        }
    }
    return seats;
}

/** Every audience member's answer and timing for each question, fixed by seed. */
function makeCrowd(n: number) {
    const rand = prng(20261115);
    return QUESTIONS.map((q) =>
        Array.from({ length: n }, () => {
            const x = rand();
            let acc = 0;
            let pick = 3;
            for (let i = 0; i < 4; i++) {
                acc += q.weights[i];
                if (x < acc) {
                    pick = i;
                    break;
                }
            }
            return { pick, at: rand() * VOTE_SECONDS, speed: rand() };
        }),
    );
}

const COL_X = [-2.4, -0.8, 0.8, 2.4];
const COL_Z = -1.7;
const COL_MAX = 2.6;

function Hall({ seats, votes, voteStart, phase, correct }: { seats: THREE.Vector3[]; votes: Array<{ pick: number; at: number }>; voteStart: number | null; phase: Phase; correct: number }) {
    const p = usePalette();
    const phones = useRef<THREE.InstancedMesh>(null);
    const flyers = useRef<THREE.InstancedMesh>(null);
    const cols = useRef<Array<THREE.Mesh | null>>([]);
    const colMats = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
    const heads = useRef<THREE.InstancedMesh>(null);
    const tmp = useMemo(() => ({ m: new THREE.Object3D(), c: new THREE.Color(), dim: new THREE.Color(p.faint).lerp(new THREE.Color(p.mid), 0.45), lit: new THREE.Color(p.ink), a: new THREE.Vector3(), b: new THREE.Vector3() }), [p.faint, p.mid, p.ink]);
    const heights = useRef([0, 0, 0, 0]);

    // Place the phones once.
    useEffect(() => {
        const mesh = phones.current;
        if (!mesh) return;
        seats.forEach((s, i) => {
            tmp.m.position.copy(s);
            tmp.m.lookAt(0, 1.6, -3.2);
            tmp.m.updateMatrix();
            mesh.setMatrixAt(i, tmp.m.matrix);
            mesh.setColorAt(i, tmp.dim);
        });
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        mesh.computeBoundingSphere();
        // A head behind each phone, so the hall reads as people.
        const h = heads.current;
        if (h) {
            seats.forEach((s, i) => {
                tmp.m.position.set(s.x * 1.04, s.y + 0.32, s.z + 0.16 + (s.z + 2.9) * 0.04);
                tmp.m.rotation.set(0, 0, 0);
                tmp.m.scale.setScalar(1);
                tmp.m.updateMatrix();
                h.setMatrixAt(i, tmp.m.matrix);
            });
            h.instanceMatrix.needsUpdate = true;
            h.computeBoundingSphere();
        }
    }, [seats, tmp]);

    useFrame((state, dt) => {
        const now = state.clock.elapsedTime;
        const t = voteStart === null ? -1 : now - voteStart;
        const arrived = [0, 0, 0, 0];
        const mesh = phones.current;
        const fly = flyers.current;
        votes.forEach((v, i) => {
            const since = t - v.at;
            // The phone lights as its owner taps an answer.
            if (mesh) {
                const glow = since > 0 && since < 0.6 ? 1 - since / 0.6 : 0;
                tmp.c.copy(tmp.dim).lerp(tmp.lit, phase === 'ask' ? 0.2 + 0.25 * Math.max(0, Math.sin(now * 1.5 + i * 1.7)) : glow);
                mesh.setColorAt(i, tmp.c);
            }
            if (fly) {
                if (since > 0 && since < FLY) {
                    tmp.a.copy(seats[i]);
                    tmp.b.set(COL_X[v.pick] + ((i % 5) - 2) * 0.12, heights.current[v.pick] + 0.1, COL_Z + ((i % 3) - 1) * 0.12);
                    const u = ease(since / FLY);
                    tmp.m.position.lerpVectors(tmp.a, tmp.b, u);
                    tmp.m.position.y += Math.sin(Math.PI * u) * 1.4;
                    tmp.m.scale.setScalar(1);
                } else tmp.m.scale.setScalar(0);
                tmp.m.rotation.set(0, 0, 0);
                tmp.m.updateMatrix();
                fly.setMatrixAt(i, tmp.m.matrix);
            }
            if (since >= FLY) arrived[v.pick]++;
        });
        if (mesh?.instanceColor) mesh.instanceColor.needsUpdate = true;
        if (fly) fly.instanceMatrix.needsUpdate = true;
        // Columns grow with the votes that have landed.
        arrived.forEach((n, k) => {
            const goal = (n / votes.length) * COL_MAX * 1.6;
            heights.current[k] = THREE.MathUtils.damp(heights.current[k], goal, 6, dt);
            const c = cols.current[k];
            if (c) {
                c.scale.y = Math.max(0.001, heights.current[k]);
                c.position.y = heights.current[k] / 2;
            }
            const m = colMats.current[k];
            if (m) m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, phase === 'reveal' ? (k === correct ? 0.9 : 0) : 0, 5, dt);
        });
    });

    return (
        <>
            <instancedMesh ref={phones} args={[undefined, undefined, seats.length]} frustumCulled={false}>
                <boxGeometry args={[0.13, 0.22, 0.02]} />
                <meshBasicMaterial toneMapped={false} />
            </instancedMesh>
            <instancedMesh ref={heads} args={[undefined, undefined, seats.length]} frustumCulled={false}>
                <sphereGeometry args={[0.1, 10, 10]} />
                <meshStandardMaterial color={p.faint} roughness={0.52} metalness={0.22} />
            </instancedMesh>
            <instancedMesh ref={flyers} args={[undefined, undefined, seats.length]} frustumCulled={false}>
                <boxGeometry args={[0.06, 0.06, 0.06]} />
                <meshBasicMaterial color={p.ink} toneMapped={false} />
            </instancedMesh>
            {COL_X.map((x, k) => (
                <group key={k}>
                    {/* Brushed metallic result monolith with cast shadow */}
                    <mesh ref={(m) => (cols.current[k] = m)} position={[x, 0, COL_Z]} castShadow receiveShadow>
                        <boxGeometry args={[1.02, 1, 0.62]} />
                        <meshStandardMaterial
                            ref={(m) => (colMats.current[k] = m)}
                            color={p.soft}
                            roughness={0.28}
                            metalness={0.35}
                            emissive={p.ink}
                            emissiveIntensity={0}
                        />
                        <Edges color={p.ink} />
                    </mesh>
                    {/* Grounded architectural plinth with subtle ring indicator */}
                    <mesh position={[x, 0.02, COL_Z]} receiveShadow castShadow>
                        <boxGeometry args={[1.14, 0.04, 0.74]} />
                        <meshStandardMaterial color={p.fill} roughness={0.4} metalness={0.4} />
                        <Edges color={phase === 'reveal' && k === correct ? p.ink : p.mid} />
                    </mesh>
                    <Html position={[x, 0.04, COL_Z + 0.66]} center pointerEvents="none" zIndexRange={[10, 0]}>
                        <span className={`font-mono text-[11px] font-semibold ${phase === 'reveal' && k === correct ? 'text-text-strong' : 'text-text-mute'}`}>{LETTERS[k]}</span>
                    </Html>
                </group>
            ))}
        </>
    );
}

function Room({ rows }: { rows: number }) {
    const p = usePalette();
    const hallFloor = useSurfaceMaps('hall', p.light, [4, 3]);
    const beamTex = useBeamTexture();
    const risers = useMemo(() => {
        const span = 1.32;
        const startPhi = -Math.PI / 2 - span;
        const endPhi = -Math.PI / 2 + span;
        return Array.from({ length: rows }, (_, r) => {
            const inner = 3.74 + r * 0.52;
            const outer = inner + 0.52;
            const h = 0.18 + r * 0.24;
            const shape = new THREE.Shape();
            shape.absarc(0, 0, outer, startPhi, endPhi, false);
            shape.absarc(0, 0, inner, endPhi, startPhi, true);
            shape.closePath();
            return new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false, curveSegments: 48 });
        });
    }, [rows]);

    useEffect(() => () => risers.forEach((g) => g.dispose()), [risers]);

    const screenTex = useCanvasTexture(
        512,
        216,
        (c) => {
            c.fillStyle = p.light ? '#101014' : '#0b0b0f';
            c.fillRect(0, 0, 512, 216);
            // Subtle LED scanlines
            c.fillStyle = 'rgba(255,255,255,0.035)';
            for (let y = 0; y < 216; y += 4) c.fillRect(0, y, 512, 1);
            // Crisp top telemetry strip
            c.fillStyle = 'rgba(255,255,255,0.5)';
            c.font = '600 13px ui-monospace, Menlo, monospace';
            c.textAlign = 'left';
            c.fillText('● LIVE SESSION', 28, 34);
            c.textAlign = 'right';
            c.fillText('CODE 4821', 484, 34);
            // Center brand mark
            c.fillStyle = '#fafafa';
            c.textAlign = 'center';
            c.font = '600 54px ui-sans-serif, system-ui, sans-serif';
            c.fillText('klikr', 256, 118);
            c.fillStyle = 'rgba(255,255,255,0.58)';
            c.font = '500 14px ui-monospace, Menlo, monospace';
            c.fillText('JOIN AT KLIKRAPP.COM · REAL-TIME SCORING', 256, 162);
            // Bottom accent rule
            c.fillStyle = 'rgba(255,255,255,0.22)';
            c.fillRect(140, 184, 232, 2);
        },
        [p.light],
    );

    return (
        <group>
            {/* Acoustic auditorium base floor */}
            <mesh position={[0, -0.06, 0.8]} receiveShadow>
                <boxGeometry args={[14.5, 0.12, 10.8]} />
                <meshStandardMaterial map={hallFloor.map} roughnessMap={hallFloor.roughnessMap} roughness={0.85} metalness={0.08} />
                <Edges color={p.faint} />
            </mesh>

            {/* Stepped curved amphitheatre seating risers matching the audience rows */}
            <group position={[0, 0, -2.9]}>
                {risers.map((geo, r) => (
                    <mesh key={r} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
                        <meshStandardMaterial color={p.fill} roughness={0.78} metalness={0.12} />
                        <Edges color={p.faint} threshold={25} />
                    </mesh>
                ))}
            </group>

            {/* Raised stage apron at front of hall */}
            <mesh position={[0, 0.05, -2.3]} receiveShadow castShadow>
                <boxGeometry args={[7.4, 0.1, 2.4]} />
                <meshStandardMaterial color={p.fill} roughness={0.48} metalness={0.28} />
                <Edges color={p.mid} transparent opacity={0.55} />
            </mesh>

            {/* Cinema LED stage screen with bezel + overhead truss rig */}
            <group position={[0, 2.38, -3.28]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[6.48, 2.78, 0.1]} />
                    <meshStandardMaterial color={p.fill} roughness={0.32} metalness={0.5} />
                    <Edges color={p.ink} transparent opacity={0.8} />
                </mesh>
                <mesh position={[0, 0, 0.056]}>
                    <planeGeometry args={[6.24, 2.56]} />
                    <meshBasicMaterial map={screenTex} toneMapped={false} />
                </mesh>
            </group>

            {/* Overhead stage lighting truss + soft gradient volumetric beams */}
            <mesh position={[0, 4.18, -1.82]} castShadow>
                <boxGeometry args={[7.2, 0.08, 0.08]} />
                <meshStandardMaterial color={p.mid} roughness={0.35} metalness={0.6} />
            </mesh>
            {[-2.4, -0.8, 0.8, 2.4].map((lx) => (
                <group key={lx} position={[lx, 4.08, -1.82]}>
                    <mesh>
                        <cylinderGeometry args={[0.06, 0.09, 0.14, 12]} />
                        <meshStandardMaterial color={p.fill} roughness={0.3} metalness={0.6} />
                    </mesh>
                    <mesh position={[0, -1.85, 0.12]} rotation={[0.06, 0, 0]}>
                        <coneGeometry args={[0.78, 3.7, 24, 1, true]} />
                        <meshBasicMaterial
                            color={p.ink}
                            alphaMap={beamTex}
                            transparent
                            opacity={p.light ? 0.05 : 0.11}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                            toneMapped={false}
                        />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

type Phase = 'ask' | 'vote' | 'reveal';

/** Records the canvas time a vote began. */
function VoteClock({ phase, onStart }: { phase: Phase; onStart: (t: number | null) => void }) {
    const prev = useRef<Phase>(phase);
    const pending = useRef(phase === 'vote');
    useEffect(() => {
        if (phase === 'vote' && prev.current !== 'vote') pending.current = true;
        if (phase === 'ask') onStart(null);
        prev.current = phase;
    }, [phase, onStart]);
    useFrame((state) => {
        if (pending.current) {
            pending.current = false;
            onStart(state.clock.elapsedTime);
        }
    });
    return null;
}

export default function KlikrSim({ running, compact }: SimProps) {
    const seats = useMemo(() => makeHall(compact ? 6 : 8), [compact]);
    const crowd = useMemo(() => makeCrowd(seats.length), [seats.length]);
    const [qi, setQi] = useState(0);
    const [phase, setPhase] = useState<Phase>('ask');
    const [left, setLeft] = useState(ASK_SECONDS);
    const [answer, setAnswer] = useState<number | null>(null);
    const [scores, setScores] = useState<number[]>([]); // the visitor's points per question
    const [voteStart, setVoteStart] = useState<number | null>(null);
    const askedAt = useRef(0);
    const q = QUESTIONS[qi];

    // The countdown runs only while the simulation is on screen.
    useEffect(() => {
        if (!running || phase !== 'ask') return;
        askedAt.current = performance.now() - (ASK_SECONDS - left) * 1000;
        const id = window.setInterval(() => {
            const remaining = Math.max(0, ASK_SECONDS - (performance.now() - askedAt.current) / 1000);
            setLeft(remaining);
            if (remaining <= 0) setPhase('vote');
        }, 100);
        return () => window.clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [running, phase, qi]);

    useEffect(() => {
        if (phase !== 'vote') return;
        const id = window.setTimeout(() => setPhase('reveal'), (VOTE_SECONDS + FLY + 0.4) * 1000);
        return () => window.clearTimeout(id);
    }, [phase]);

    const choose = (k: number) => {
        if (phase !== 'ask' || answer !== null) return;
        setAnswer(k);
        const pts = k === q.correct ? Math.round(1000 - 500 * ((ASK_SECONDS - left) / ASK_SECONDS)) : 0;
        setScores((s) => {
            const next = [...s];
            next[qi] = pts;
            return next;
        });
        setPhase('vote');
    };

    const next = () => {
        if (qi === QUESTIONS.length - 1) {
            setQi(0);
            setScores([]);
        } else setQi(qi + 1);
        setAnswer(null);
        setLeft(ASK_SECONDS);
        setPhase('ask');
    };

    // Leaderboard: the hall's running totals against the visitor's.
    const board = useMemo(() => {
        const totals = crowd[0].map((_, i) =>
            crowd.slice(0, qi + 1).reduce((sum, qq, j) => sum + (qq[i].pick === QUESTIONS[j].correct ? Math.round(1000 - 500 * (qq[i].at / VOTE_SECONDS) * 0.9) : 0), 0),
        );
        return totals.map((score, i) => ({ name: playerName(i), score })).sort((a, b) => b.score - a.score);
    }, [crowd, qi]);
    const mine = scores.slice(0, qi + 1).reduce((s, x) => s + (x ?? 0), 0);
    const rank = 1 + board.filter((b) => b.score > mine).length;

    const votes = crowd[qi];
    const counts = [0, 1, 2, 3].map((k) => votes.filter((v) => v.pick === k).length);

    const hud = (
        <>
            <div className={`absolute left-3 right-3 top-9 rounded-md border border-hairline bg-veil p-3 ${compact ? '' : 'max-w-[26rem]'}`}>
                <div className="flex items-center justify-between">
                    <HudLabel>
                        Question {qi + 1} of {QUESTIONS.length}
                    </HudLabel>
                    <HudLabel className="tabular-nums text-text-strong">
                        {phase === 'ask' ? `${Math.ceil(left)}s` : phase === 'vote' ? `${seats.length} answering` : 'Results'}
                    </HudLabel>
                </div>
                <p className="mt-1.5 text-sm font-medium leading-snug text-text-strong">{q.q}</p>
                <div className="mt-2 h-[2px] w-full bg-hairline">
                    <div className="h-full bg-signal transition-[width] duration-100" style={{ width: `${(left / ASK_SECONDS) * 100}%` }} />
                </div>
            </div>

            <div className={`pointer-events-auto absolute bottom-3 grid gap-1.5 ${compact ? 'inset-x-3 grid-cols-2' : 'left-3 w-[26rem] grid-cols-2'}`}>
                {q.options.map((o, k) => {
                    const isAnswer = answer === k;
                    const reveal = phase === 'reveal';
                    const pct = Math.round((counts[k] / votes.length) * 100);
                    return (
                        <button
                            key={o}
                            type="button"
                            onClick={() => choose(k)}
                            disabled={phase !== 'ask'}
                            className={`flex items-center gap-2 rounded-md border px-2.5 py-2 text-left text-xs transition-colors ${
                                reveal && k === q.correct
                                    ? 'border-text-strong bg-text-strong text-bg'
                                    : isAnswer
                                      ? 'border-text-strong text-text-strong'
                                      : 'border-hairline-strong bg-veil text-text hover:border-signal disabled:hover:border-hairline-strong'
                            }`}
                        >
                            <span className="font-mono text-[10px] font-semibold">{LETTERS[k]}</span>
                            <span className="flex-1 leading-tight">{o}</span>
                            {reveal && <span className="font-mono text-[10px] tabular-nums">{pct}%</span>}
                        </button>
                    );
                })}
            </div>

            {phase === 'reveal' && (
                <div className={`pointer-events-auto absolute rounded-md border border-hairline-strong bg-veil p-3 ${compact ? 'inset-x-3 top-[38%]' : 'bottom-3 right-3 w-52'}`}>
                    <p className="text-sm font-medium text-text-strong">
                        {answer === null ? 'Time is up' : answer === q.correct ? `Correct · +${scores[qi]}` : 'Not this time'}
                    </p>
                    <ol className="mt-2 space-y-0.5 font-mono text-[10px] tabular-nums">
                        {board.slice(0, 3).map((b, i) => (
                            <li key={b.name} className="flex justify-between text-text-mute">
                                <span>
                                    {i + 1}. {b.name}
                                </span>
                                <span>{b.score}</span>
                            </li>
                        ))}
                        <li className="flex justify-between border-t border-hairline pt-1 text-text-strong">
                            <span>
                                {rank}. You
                            </span>
                            <span>{mine}</span>
                        </li>
                    </ol>
                    <HudLabel className="mt-1">
                        of {seats.length + 1} players · live
                    </HudLabel>
                    <HudButton primary className="mt-2 w-full" onClick={next}>
                        {qi === QUESTIONS.length - 1 ? 'Play again' : 'Next question'}
                    </HudButton>
                </div>
            )}
        </>
    );

    return (
        <SimFrame
            running={running}
            compact={compact}
            label="Simulation · live quiz"
            pose={compact ? { position: [0, 7.2, 9.6], target: [0, 1.0, -0.6], fov: 52 } : { position: [3.4, 6.2, 9.8], target: [0.2, 1.2, -1.0], fov: 42 }}
            hud={hud}
        >
            <VoteClock phase={phase} onStart={setVoteStart} />
            <Room rows={compact ? 6 : 8} />
            <Hall key={qi} seats={seats} votes={votes} voteStart={phase === 'ask' ? null : voteStart} phase={phase} correct={q.correct} />
        </SimFrame>
    );
}
