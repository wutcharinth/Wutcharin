import { useRef, type ComponentType } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../../../../lib/theme';
import { DARK, LIGHT, PaletteContext, usePalette } from '../sims/kit';
import * as M from './models';

/**
 * The 3D window of the project index's hover card. One canvas for the whole
 * index: hovering another row swaps the specimen inside it, and the frame
 * loop stops while no row is hovered.
 */

const MODELS: Record<string, ComponentType> = {
    'risk-guard': M.RiskGuard,
    'project-flow': M.ProjectFlow,
    'review-flow': M.ReviewFlow,
    'query-flow': M.QueryFlow,
    collections: M.Collections,
    'slip-verify': M.SlipVerify,
    'karpathy-deep-dive': M.Karpathy,
    'human-edge': M.HumanEdge,
    'agentic-ai': M.AgenticLoop,
    'ai-evolution': M.AIEvolution,
    'future-of-work': M.FutureOfWork,
    flowaios: M.FlowAIOS,
    'resume-builder': M.ResumeBuilder,
    'gemini-ocr': M.GeminiOCR,
};

/** A specimen arrives scaled up from nothing and sways gently on its stand. */
function Stand({ id }: { id: string }) {
    const g = useRef<THREE.Group>(null);
    const p = usePalette();
    useFrame((state, dt) => {
        const grp = g.current;
        if (!grp) return;
        grp.scale.setScalar(THREE.MathUtils.damp(grp.scale.x, 1, 9, dt));
        grp.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.28;
    });
    const Model = MODELS[id];
    return (
        <group ref={g} scale={0.6}>
            <mesh position={[0, -0.02, 0]} receiveShadow>
                <cylinderGeometry args={[1.95, 1.98, 0.03, 64]} />
                <meshStandardMaterial color={p.fill} roughness={0.65} metalness={0.25} />
            </mesh>
            <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.94, 1.98, 96]} />
                <meshBasicMaterial color={p.mid} transparent opacity={0.55} />
            </mesh>
            {Model && <Model />}
        </group>
    );
}

export default function SpecimenCanvas({ id, running }: { id: string; running: boolean }) {
    const light = useTheme() === 'light';
    const palette = light ? LIGHT : DARK;
    return (
        <Canvas
            frameloop={running ? 'always' : 'never'}
            dpr={[1, 2]}
            gl={{
                antialias: true,
                alpha: true,
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: light ? 1.04 : 1.16,
            }}
            camera={{ fov: 30, position: [0, 2.3, 5.2], near: 0.1, far: 40 }}
            onCreated={({ camera }) => camera.lookAt(0, 0.7, 0)}
            aria-hidden="true"
        >
            <PaletteContext.Provider value={palette}>
                <hemisphereLight args={[light ? '#ffffff' : '#dce2ec', light ? '#d8d8d8' : '#121216', light ? 1.15 : 0.72]} />
                <directionalLight position={[4, 7, 5]} intensity={light ? 1.35 : 2.0} />
                <directionalLight position={[-5, 4, -3]} intensity={light ? 0.5 : 0.9} color="#e2e8f0" />
                <directionalLight position={[0, 3, -6]} intensity={light ? 0.3 : 0.65} />
                <Stand key={id} id={id} />
            </PaletteContext.Provider>
        </Canvas>
    );
}
