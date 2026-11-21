import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { arc, useBeamTexture, useCanvasTexture, usePalette, useSurfaceMaps, type SimProps } from './kit';
import { HudButton, HudLabel, SimFrame } from './frame';

/**
 * Jongtoh, "Friday night at the venue": a small bar and restaurant at
 * night with an AI host at the door. Send it a guest's LINE message, in
 * English or Thai, and the venue answers: a table is booked, the stage
 * lights up, the menu is sent, or a person at the bar takes over.
 * The replies are scripted for the simulation.
 */

type Lang = 'en' | 'th';
type Topic = 'book' | 'music' | 'vegan' | 'human';
type Say = Record<Lang, string>;
const SCRIPT: Array<{ id: Topic; q: Say; a: Say }> = [
    {
        id: 'book',
        q: { en: 'Table for 4 at 8pm tonight?', th: 'จองโต๊ะ 4 ที่ สองทุ่มคืนนี้ได้ไหมคะ' },
        a: { en: 'Yes. Table 6 by the window is free at 20:00. Booked for 4, see you tonight.', th: 'ได้ค่ะ โต๊ะ 6 ริมหน้าต่างว่างตอน 20:00 จองให้ 4 ท่านเรียบร้อย แล้วพบกันคืนนี้นะคะ' },
    },
    {
        id: 'music',
        q: { en: 'Is there live music tonight?', th: 'คืนนี้มีดนตรีสดไหมคะ' },
        a: { en: 'Yes, an acoustic set on the main stage from 21:00.', th: 'มีค่ะ อะคูสติกที่เวทีหลัก เริ่ม 21:00 ค่ะ' },
    },
    {
        id: 'vegan',
        q: { en: 'Do you have vegan dishes?', th: 'มีเมนูวีแกนไหมคะ' },
        a: { en: 'Six, marked with a leaf on the menu. I have sent it to you.', th: 'มี 6 เมนูค่ะ มีสัญลักษณ์ใบไม้ในเมนู ส่งเมนูให้แล้วนะคะ' },
    },
    {
        id: 'human',
        q: { en: 'Can I talk to a person?', th: 'ขอคุยกับพนักงานได้ไหมคะ' },
        a: { en: 'Of course. Ploy at the bar has your chat and will reply here in a few minutes.', th: 'ได้เลยค่ะ ส่งต่อให้คุณพลอยที่บาร์แล้ว จะตอบในแชทนี้ภายในไม่กี่นาทีค่ะ' },
    },
];

type Msg = { from: 'guest' | 'host'; text: string };

// Table numbers are index + 1; T6 is the one by the window.
const TABLES: Array<[number, number]> = [
    [-3.1, -0.3],
    [-1.6, -0.3],
    [-0.1, -0.3],
    [-2.4, 1.4],
    [-0.9, 1.4],
    [3.3, 0.3],
    [0.7, 1.6],
    [2.2, 2.2],
];
const BOOKED = 5;
const SEATED = [0, 2, 3, 6];
const HOST = new THREE.Vector3(3.3, 0, 3.0);
const STAFF = new THREE.Vector3(-2.6, 0, -2.95);
const STAGE = new THREE.Vector3(2.4, 0, -1.9);
const MENU = new THREE.Vector3(0.0, 1.35, -3.2);

function Shell() {
    const p = usePalette();
    const floor = useSurfaceMaps('terrazzo', p.light, [4, 3]);
    const bottles = [-3.9, -3.55, -3.2, -2.85, -2.5, -2.15, -1.8, -1.45];
    return (
        <group>
            {/* Architectural venue floor catching soft specular & candle reflections */}
            <mesh position={[0, -0.06, 0]} receiveShadow>
                <boxGeometry args={[9.6, 0.12, 7.4]} />
                <meshStandardMaterial map={floor.map} roughnessMap={floor.roughnessMap} roughness={0.68} metalness={0.1} />
                <Edges color={p.faint} />
            </mesh>
            {/* Back and left architectural walls */}
            <mesh position={[0, 0.65, -3.65]} castShadow receiveShadow>
                <boxGeometry args={[9.6, 1.3, 0.12]} />
                <meshStandardMaterial color={p.fill} roughness={0.85} metalness={0.05} />
                <Edges color={p.mid} transparent opacity={0.55} />
            </mesh>
            <mesh position={[-4.75, 0.65, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.12, 1.3, 7.4]} />
                <meshStandardMaterial color={p.fill} roughness={0.85} metalness={0.05} />
                <Edges color={p.mid} transparent opacity={0.55} />
            </mesh>
            {/* Tall right-side street windows */}
            {[-1.4, 0.6].map((z) => (
                <mesh key={z} position={[4.78, 0.95, z]}>
                    <boxGeometry args={[0.04, 1.15, 1.45]} />
                    <meshStandardMaterial color={p.soft} roughness={0.12} metalness={0.1} transparent opacity={0.18} />
                    <Edges color={p.soft} />
                </mesh>
            ))}

            {/* Backlit bar shelving + silhouette bottles */}
            <group position={[-2.65, 0, -3.52]}>
                <mesh position={[0, 0.72, 0.08]} castShadow>
                    <boxGeometry args={[3.1, 0.04, 0.2]} />
                    <meshStandardMaterial color={p.fill} roughness={0.35} metalness={0.3} />
                    <Edges color={p.mid} />
                </mesh>
                <mesh position={[0, 0.75, 0.02]}>
                    <boxGeometry args={[2.95, 0.02, 0.02]} />
                    <meshBasicMaterial color={p.ink} transparent opacity={0.6} toneMapped={false} />
                </mesh>
                {bottles.map((x, idx) => (
                    <mesh key={x} position={[x + 2.65, 0.89 + (idx % 3) * 0.02, 0.09]} castShadow>
                        <cylinderGeometry args={[0.032, 0.042, 0.28 + (idx % 3) * 0.04, 10]} />
                        <meshStandardMaterial color={p.soft} roughness={0.2} metalness={0.25} transparent opacity={0.78} />
                    </mesh>
                ))}
            </group>

            {/* The bar counter with glossy top slab, pendant shades & stools */}
            <group position={[-2.6, 0, -2.45]}>
                <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
                    <boxGeometry args={[3.2, 0.88, 0.56]} />
                    <meshStandardMaterial color={p.fill} roughness={0.6} metalness={0.18} />
                    <Edges color={p.ink} transparent opacity={0.5} />
                </mesh>
                <mesh position={[0, 0.9, 0.04]} castShadow receiveShadow>
                    <boxGeometry args={[3.32, 0.06, 0.68]} />
                    <meshStandardMaterial color={p.light ? '#e4e4e2' : '#202026'} roughness={0.25} metalness={0.15} />
                    <Edges color={p.ink} transparent opacity={0.7} />
                </mesh>
                {/* Three minimalist pendant lamps over the bar */}
                {[-1.0, 0, 1.0].map((lx) => (
                    <group key={lx} position={[lx, 1.72, 0]}>
                        <mesh position={[0, 0.25, 0]}>
                            <cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />
                            <meshBasicMaterial color={p.mid} />
                        </mesh>
                        <mesh castShadow>
                            <coneGeometry args={[0.14, 0.12, 16, 1, true]} />
                            <meshStandardMaterial color={p.fill} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
                            <Edges color={p.soft} />
                        </mesh>
                        <mesh position={[0, -0.04, 0]}>
                            <sphereGeometry args={[0.035, 10, 10]} />
                            <meshBasicMaterial color={p.ink} toneMapped={false} />
                        </mesh>
                    </group>
                ))}
            </group>
            {[-3.8, -3.0, -2.2, -1.4].map((x) => (
                <group key={x} position={[x, 0, -1.82]}>
                    <mesh position={[0, 0.31, 0]} castShadow>
                        <cylinderGeometry args={[0.03, 0.04, 0.62, 10]} />
                        <meshStandardMaterial color={p.mid} roughness={0.35} metalness={0.5} />
                    </mesh>
                    <mesh position={[0, 0.63, 0]} castShadow receiveShadow>
                        <cylinderGeometry args={[0.16, 0.14, 0.06, 18]} />
                        <meshStandardMaterial color={p.fill} roughness={0.45} metalness={0.2} />
                        <Edges color={p.soft} threshold={30} />
                    </mesh>
                </group>
            ))}
            <Html position={[-2.6, 0.44, -2.04]} center pointerEvents="none" zIndexRange={[10, 0]}>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-text-mute">Bar</span>
            </Html>
        </group>
    );
}

function Tables({ booked }: { booked: boolean }) {
    const p = usePalette();
    const ring = useRef<THREE.MeshBasicMaterial>(null);
    const candles = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
    const pools = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (ring.current) ring.current.opacity = booked ? 0.55 + 0.35 * Math.sin(t * 3) : 0;
        candles.current.forEach((m, i) => {
            const flicker = 0.65 + 0.35 * Math.sin(t * 6.5 + i * 2.1) * Math.sin(t * 3.1 + i);
            if (m) m.opacity = flicker;
            const pl = pools.current[i];
            if (pl) pl.opacity = (p.light ? 0.08 : 0.16) * flicker;
        });
    });
    return (
        <>
            {TABLES.map(([x, z], i) => (
                <group key={i} position={[x, 0, z]}>
                    {/* Grounded cast-iron pedestal foot + column + glazed tabletop */}
                    <mesh position={[0, 0.02, 0]} receiveShadow>
                        <cylinderGeometry args={[0.2, 0.24, 0.04, 20]} />
                        <meshStandardMaterial color={p.fill} roughness={0.4} metalness={0.5} />
                    </mesh>
                    <mesh position={[0, 0.29, 0]} castShadow>
                        <cylinderGeometry args={[0.036, 0.05, 0.54, 12]} />
                        <meshStandardMaterial color={p.mid} roughness={0.35} metalness={0.55} />
                    </mesh>
                    <mesh position={[0, 0.56, 0]} castShadow receiveShadow>
                        <cylinderGeometry args={[0.44, 0.42, 0.05, 36]} />
                        <meshStandardMaterial
                            color={i === BOOKED && booked ? p.soft : p.fill}
                            roughness={0.28}
                            metalness={0.14}
                        />
                        <Edges color={p.ink} transparent opacity={i === BOOKED && booked ? 1 : 0.52} threshold={30} />
                    </mesh>
                    {/* Soft candle glow pool on the tabletop */}
                    <mesh position={[0, 0.59, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.32, 24]} />
                        <meshBasicMaterial ref={(m) => (pools.current[i] = m)} color={p.ink} transparent opacity={0.14} depthWrite={false} />
                    </mesh>

                    {/* Architectural bistro chairs (seat + slim backrest) */}
                    {[0, 1, 2, 3].map((k) => {
                        const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
                        return (
                            <group key={k} position={[Math.cos(a) * 0.64, 0, Math.sin(a) * 0.64]} rotation={[0, -a + Math.PI / 2, 0]}>
                                <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
                                    <cylinderGeometry args={[0.14, 0.13, 0.04, 16]} />
                                    <meshStandardMaterial color={p.fill} roughness={0.5} metalness={0.15} />
                                    <Edges color={p.mid} threshold={30} />
                                </mesh>
                                <mesh position={[0, 0.14, 0]} castShadow>
                                    <cylinderGeometry args={[0.02, 0.03, 0.28, 8]} />
                                    <meshStandardMaterial color={p.mid} roughness={0.4} metalness={0.45} />
                                </mesh>
                                {/* Chair backrest */}
                                <mesh position={[0, 0.44, 0.12]} castShadow>
                                    <boxGeometry args={[0.24, 0.24, 0.032]} />
                                    <meshStandardMaterial color={p.fill} roughness={0.45} metalness={0.2} />
                                    <Edges color={p.mid} />
                                </mesh>
                                {SEATED.includes(i) && k % 2 === 0 && (
                                    <mesh position={[0, 0.54, -0.02]} castShadow>
                                        <capsuleGeometry args={[0.095, 0.22, 6, 12]} />
                                        <meshStandardMaterial color={p.mid} roughness={0.5} metalness={0.1} />
                                    </mesh>
                                )}
                            </group>
                        );
                    })}

                    {/* Table candle + subtle holder */}
                    <mesh position={[0, 0.61, 0]}>
                        <cylinderGeometry args={[0.03, 0.032, 0.05, 10]} />
                        <meshStandardMaterial color={p.soft} roughness={0.3} />
                    </mesh>
                    <mesh position={[0, 0.655, 0]}>
                        <sphereGeometry args={[0.032, 10, 10]} />
                        <meshBasicMaterial ref={(m) => (candles.current[i] = m)} color={p.ink} transparent toneMapped={false} />
                    </mesh>
                    {i === BOOKED && (
                        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[0.92, 1.0, 48]} />
                            <meshBasicMaterial ref={ring} color={p.ink} transparent opacity={0} toneMapped={false} />
                        </mesh>
                    )}
                    <Html position={[0, 0.02, 0.98]} center pointerEvents="none" zIndexRange={[10, 0]}>
                        <span className={`font-mono text-[9px] tracking-[0.16em] ${i === BOOKED && booked ? 'text-text-strong' : 'text-text-mute'}`}>T{i + 1}</span>
                    </Html>
                    {i === BOOKED && booked && (
                        <Html position={[0, 1.18, 0]} center pointerEvents="none" zIndexRange={[10, 0]}>
                            <span className="whitespace-nowrap rounded-full bg-text-strong px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-bg">
                                Booked · 20:00 · 4
                            </span>
                        </Html>
                    )}
                </group>
            ))}
        </>
    );
}

function Stage({ live }: { live: boolean }) {
    const p = usePalette();
    const beamTex = useBeamTexture();
    const cone = useRef<THREE.MeshBasicMaterial>(null);
    const floor = useRef<THREE.MeshBasicMaterial>(null);
    useFrame((state, dt) => {
        const goal = live ? 1 : 0;
        if (cone.current) cone.current.opacity = THREE.MathUtils.damp(cone.current.opacity, goal * (0.28 + 0.05 * Math.sin(state.clock.elapsedTime * 2)), 4, dt);
        if (floor.current) floor.current.opacity = THREE.MathUtils.damp(floor.current.opacity, goal * 0.42, 4, dt);
    });
    return (
        <group position={STAGE}>
            {/* Two-tier acoustic stage plinth */}
            <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.9, 0.24, 1.75]} />
                <meshStandardMaterial color={p.fill} roughness={0.55} metalness={0.2} />
                <Edges color={p.ink} transparent opacity={0.7} />
            </mesh>
            {/* Stage front edge light bar */}
            <mesh position={[0, 0.245, 0.86]}>
                <boxGeometry args={[2.6, 0.015, 0.02]} />
                <meshBasicMaterial color={p.ink} transparent opacity={live ? 0.9 : 0.25} toneMapped={false} />
            </mesh>
            {/* Mic stand + stool */}
            <mesh position={[0, 0.66, 0.1]} castShadow>
                <cylinderGeometry args={[0.014, 0.014, 0.86, 8]} />
                <meshStandardMaterial color={p.soft} roughness={0.3} metalness={0.6} />
            </mesh>
            <mesh position={[0, 0.25, 0.1]}>
                <cylinderGeometry args={[0.14, 0.15, 0.02, 16]} />
                <meshStandardMaterial color={p.mid} roughness={0.4} metalness={0.5} />
            </mesh>
            {/* Dual stage speakers with driver detail */}
            {[-1.18, 1.18].map((x) => (
                <group key={x} position={[x, 0.56, -0.48]}>
                    <mesh castShadow receiveShadow>
                        <boxGeometry args={[0.38, 0.64, 0.34]} />
                        <meshStandardMaterial color={p.fill} roughness={0.55} metalness={0.25} />
                        <Edges color={p.mid} />
                    </mesh>
                    <mesh position={[0, -0.08, 0.175]} rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.11, 0.11, 0.01, 18]} />
                        <meshStandardMaterial color={p.mid} roughness={0.4} metalness={0.3} />
                    </mesh>
                </group>
            ))}
            {/* Volumetric spotlight cone + floor pool */}
            <mesh position={[0, 1.75, 0.1]}>
                <coneGeometry args={[0.98, 3.0, 32, 1, true]} />
                <meshBasicMaterial ref={cone} color={p.ink} alphaMap={beamTex} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0.25, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.98, 40]} />
                <meshBasicMaterial ref={floor} color={p.ink} transparent opacity={0} depthWrite={false} toneMapped={false} />
            </mesh>
            <Html position={[0, 0.02, 1.12]} center pointerEvents="none" zIndexRange={[10, 0]}>
                <span className={`whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.22em] ${live ? 'text-text-strong' : 'text-text-mute'}`}>
                    {live ? 'Stage · acoustic 21:00' : 'Stage'}
                </span>
            </Html>
        </group>
    );
}

function MenuBoard({ sent }: { sent: boolean }) {
    const p = usePalette();
    const tex = useCanvasTexture(
        256,
        170,
        (c) => {
            c.fillStyle = p.paper;
            c.fillRect(0, 0, 256, 170);
            c.fillStyle = p.print;
            c.font = '600 22px ui-sans-serif, system-ui, sans-serif';
            c.fillText('MENU', 16, 32);
            c.font = '14px ui-monospace, Menlo, monospace';
            for (let r = 0; r < 6; r++) {
                c.globalAlpha = 0.7;
                c.fillRect(16, 52 + r * 18, 120 + ((r * 37) % 60), 4);
                c.globalAlpha = 1;
                if (r % 2 === 0) {
                    c.beginPath();
                    c.ellipse(216, 54 + r * 18, 7, 4, -0.6, 0, Math.PI * 2);
                    c.fill();
                }
            }
        },
        [p.paper, p.print],
    );
    return (
        <group position={MENU}>
            <mesh castShadow>
                <boxGeometry args={[1.38, 0.94, 0.05]} />
                <meshStandardMaterial color={p.fill} roughness={0.4} metalness={0.35} />
                <Edges color={p.ink} transparent opacity={sent ? 1 : 0.4} />
            </mesh>
            <mesh position={[0, 0, 0.028]}>
                <planeGeometry args={[1.3, 0.86]} />
                <meshStandardMaterial map={tex} roughness={0.85} transparent opacity={sent ? 1 : 0.65} />
            </mesh>
            {sent && (
                <Html position={[0, 0.68, 0]} center pointerEvents="none" zIndexRange={[10, 0]}>
                    <span className="whitespace-nowrap rounded-full bg-text-strong px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-bg">
                        6 vegan · sent
                    </span>
                </Html>
            )}
        </group>
    );
}

function People({ handoff, pulseAt }: { handoff: boolean; pulseAt: number | null }) {
    const p = usePalette();
    const host = useRef<THREE.MeshBasicMaterial>(null);
    const halo = useRef<THREE.Mesh>(null);
    const ringA = useRef<THREE.Mesh>(null);
    const staff = useRef<THREE.MeshStandardMaterial>(null);
    const bubble = useRef<THREE.Mesh>(null);
    const v = useMemo(() => ({ a: new THREE.Vector3(4.6, 1.6, 5.2), b: HOST.clone().add(new THREE.Vector3(0, 1.0, 0)), pos: new THREE.Vector3() }), []);
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        const since = pulseAt === null ? 99 : t - pulseAt;
        if (bubble.current) {
            bubble.current.visible = since < 0.8;
            if (since < 0.8) bubble.current.position.copy(arc(v.pos, v.a, v.b, 0.6, since / 0.8));
        }
        const thinking = since > 0.7 && since < 1.9;
        if (host.current) host.current.opacity = 0.78 + (thinking ? 0.22 * Math.sin(t * 14) : 0.1 * Math.sin(t * 2));
        if (halo.current) halo.current.scale.setScalar(1 + (thinking ? 0.35 * (0.5 + 0.5 * Math.sin(t * 10)) : 0.08 * Math.sin(t * 2)));
        if (ringA.current) {
            ringA.current.rotation.z = t * (thinking ? 2.4 : 0.7);
            ringA.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.6) * 0.25;
        }
        if (staff.current) staff.current.emissiveIntensity = handoff ? 0.6 + 0.4 * Math.sin(t * 4) : 0;
    });
    return (
        <>
            {/* The AI host monolith at the door with orbiting telemetry ring */}
            <group position={HOST}>
                <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[0.18, 0.25, 0.84, 28]} />
                    <meshStandardMaterial color={p.fill} roughness={0.32} metalness={0.48} />
                    <Edges color={p.ink} threshold={30} />
                </mesh>
                <mesh position={[0, 1.04, 0]}>
                    <sphereGeometry args={[0.16, 24, 24]} />
                    <meshBasicMaterial ref={host} color={p.ink} transparent toneMapped={false} />
                </mesh>
                <mesh ref={ringA} position={[0, 1.04, 0]}>
                    <torusGeometry args={[0.25, 0.008, 8, 40]} />
                    <meshBasicMaterial color={p.ink} transparent opacity={0.55} toneMapped={false} />
                </mesh>
                <mesh ref={halo} position={[0, 1.04, 0]}>
                    <sphereGeometry args={[0.28, 24, 24]} />
                    <meshBasicMaterial color={p.ink} transparent opacity={0.12} depthWrite={false} />
                </mesh>
                <Html position={[0, 1.5, 0]} center pointerEvents="none" zIndexRange={[10, 0]}>
                    <span className="whitespace-nowrap rounded-full border border-hairline bg-veil px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-text-strong backdrop-blur-sm">
                        AI host
                    </span>
                </Html>
            </group>
            <mesh ref={bubble} visible={false}>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshBasicMaterial color={p.ink} toneMapped={false} />
            </mesh>
            {/* Ploy, behind the bar. */}
            <group position={STAFF}>
                <mesh position={[0, 0.75, 0]} castShadow>
                    <capsuleGeometry args={[0.16, 0.6, 6, 14]} />
                    <meshStandardMaterial ref={staff} color={p.soft} roughness={0.45} metalness={0.15} emissive={p.ink} emissiveIntensity={0} />
                </mesh>
                {handoff && (
                    <Html position={[0, 1.55, 0]} center pointerEvents="none" zIndexRange={[10, 0]}>
                        <span className="whitespace-nowrap rounded-full bg-text-strong px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-bg">Ploy · has the chat</span>
                    </Html>
                )}
            </group>
            {handoff && (
                <Line
                    points={[HOST.clone().add(new THREE.Vector3(0, 1.0, 0)), new THREE.Vector3(0.6, 2.2, -0.5), STAFF.clone().add(new THREE.Vector3(0, 1.2, 0))]}
                    color={p.ink}
                    lineWidth={1}
                    dashed
                    dashSize={0.12}
                    gapSize={0.08}
                />
            )}
        </>
    );
}

export default function JongtohSim({ running, compact }: SimProps) {
    const [lang, setLang] = useState<Lang>('en');
    const [msgs, setMsgs] = useState<Msg[]>([]);
    const [done, setDone] = useState<Topic[]>([]);
    const [typing, setTyping] = useState(false);
    const [pulseAt, setPulseAt] = useState<number | null>(null);
    const clockRef = useRef<() => number>(() => 0);
    const timers = useRef<number[]>([]);
    const log = useRef<HTMLDivElement>(null);

    const send = (id: Topic) => {
        const s = SCRIPT.find((x) => x.id === id);
        if (!s || typing) return;
        setMsgs((m) => [...m, { from: 'guest', text: s.q[lang] }]);
        setPulseAt(clockRef.current());
        setTyping(true);
        timers.current.push(
            window.setTimeout(() => {
                setTyping(false);
                setMsgs((m) => [...m, { from: 'host', text: s.a[lang] }]);
                setDone((d) => [...d, id]);
            }, 1700),
        );
    };

    // Open with one exchange so the venue is already doing something.
    useEffect(() => {
        if (!running || msgs.length) return;
        const id = window.setTimeout(() => send('book'), 1200);
        return () => window.clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [running]);
    useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
    useEffect(() => {
        log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' });
    }, [msgs, typing]);

    const reset = () => {
        timers.current.forEach((t) => window.clearTimeout(t));
        setMsgs([]);
        setDone([]);
        setTyping(false);
        setPulseAt(null);
    };

    const left = SCRIPT.filter((s) => !done.includes(s.id));
    const hud = (
        <div
            className={`pointer-events-auto absolute flex flex-col overflow-hidden rounded-md border border-hairline-strong bg-veil ${
                compact ? 'inset-x-3 bottom-3 max-h-[50%]' : 'bottom-3 right-3 top-3 w-[15rem]'
            }`}
        >
            <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
                <div>
                    <p className="text-xs font-medium text-text-strong">Jongtoh</p>
                    <HudLabel>LINE OA · AI host</HudLabel>
                </div>
                <div className="flex overflow-hidden rounded-full border border-hairline-strong text-[10px]" role="group" aria-label="Language">
                    {(['en', 'th'] as const).map((l) => (
                        <button
                            key={l}
                            type="button"
                            aria-pressed={lang === l}
                            onClick={() => setLang(l)}
                            className={`px-2 py-0.5 ${lang === l ? 'bg-text-strong text-bg' : 'text-text-mute hover:text-text-strong'}`}
                        >
                            {l === 'en' ? 'EN' : 'ไทย'}
                        </button>
                    ))}
                </div>
            </div>
            <div ref={log} className="flex-1 space-y-2 overflow-y-auto px-3 py-3" aria-live="polite">
                {msgs.length === 0 && <p className="text-[11px] text-text-mute">A guest is typing on LINE…</p>}
                {msgs.map((m, i) => (
                    <div key={i} className={`flex ${m.from === 'guest' ? 'justify-end' : 'justify-start'}`}>
                        <p
                            className={`max-w-[85%] rounded-2xl px-3 py-1.5 text-[11px] leading-snug ${
                                m.from === 'guest' ? 'rounded-br-sm bg-text-strong text-bg' : 'rounded-bl-sm border border-hairline-strong text-text-strong'
                            }`}
                        >
                            {m.text}
                        </p>
                    </div>
                ))}
                {typing && (
                    <div className="flex">
                        <span className="flex gap-1 rounded-2xl rounded-bl-sm border border-hairline-strong px-3 py-2" aria-label="The host is typing">
                            {[0, 1, 2].map((k) => (
                                <span key={k} className="h-1 w-1 animate-bounce rounded-full bg-text-strong" style={{ animationDelay: `${k * 120}ms` }} />
                            ))}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap gap-1.5 border-t border-hairline p-2">
                {left.length ? (
                    left.map((s) => (
                        <HudButton key={s.id} onClick={() => send(s.id)} disabled={typing} className="text-[11px]">
                            {s.q[lang]}
                        </HudButton>
                    ))
                ) : (
                    <HudButton onClick={reset}>Start the night over</HudButton>
                )}
            </div>
        </div>
    );

    return (
        <SimFrame
            running={running}
            compact={compact}
            label="Simulation · scripted replies"
            pose={compact ? { position: [0.4, 10.5, 7.5], target: [0.2, 0, -0.6], fov: 50 } : { position: [-0.6, 7.8, 8.6], target: [0.4, 0, 0.2], fov: 44 }}
            hud={hud}
        >
            <Clock onClock={(f) => (clockRef.current = f)} />
            {/* On wide frames the chat panel takes the right third, so the venue sits left of it. */}
            <group position={compact ? [0, 0, 0] : [-1.9, 0, 0.1]} scale={compact ? 1 : 0.8}>
                <Shell />
                <Tables booked={done.includes('book')} />
                <Stage live={done.includes('music')} />
                <MenuBoard sent={done.includes('vegan')} />
                <People handoff={done.includes('human')} pulseAt={pulseAt} />
            </group>
        </SimFrame>
    );
}

/** Hands the canvas clock to the controls, so a sent message can be timed in the scene. */
function Clock({ onClock }: { onClock: (f: () => number) => void }) {
    const t = useRef(0);
    useEffect(() => onClock(() => t.current), [onClock]);
    useFrame((state) => {
        t.current = state.clock.elapsedTime;
    });
    return null;
}
