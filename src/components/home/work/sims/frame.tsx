import { useMemo, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { useTheme } from '../../../../lib/theme';
import { DARK, LIGHT, PaletteContext, type SimProps } from './kit';

/**
 * The cinema-grade studio frame every product simulation sits in: ACESFilmic
 * tone mapping, soft PCF shadows, seamless background depth fog, 3-point
 * studio lighting, camera rig, and DOM controls on top.
 */

type CameraPose = { position: [number, number, number]; target: [number, number, number]; fov?: number };

/** Keeps ACESFilmic exposure calibrated whenever the user switches dark/light themes. */
function Exposure({ light }: { light: boolean }) {
    useFrame((state) => {
        const target = light ? 1.04 : 1.18;
        if (state.gl.toneMappingExposure !== target) {
            state.gl.toneMappingExposure = target;
        }
    });
    return null;
}

/** The camera leans gently toward the pointer, and never further. */
function Rig({ pose, sway }: { pose: CameraPose; sway: number }) {
    const { camera } = useThree();
    const look = useMemo(() => new THREE.Vector3(...pose.target), [pose.target]);
    const goal = useMemo(() => new THREE.Vector3(), []);
    useFrame((state, dt) => {
        goal.set(pose.position[0] + state.pointer.x * sway, pose.position[1] + state.pointer.y * sway * 0.5, pose.position[2]);
        easing.damp3(camera.position, goal, 0.6, dt);
        camera.lookAt(look);
    });
    return null;
}

export function SimFrame({
    running,
    compact,
    pose,
    sway,
    fog = [17, 34],
    label,
    hud,
    children,
}: SimProps & {
    pose: CameraPose;
    sway?: number;
    fog?: [number, number] | false;
    label: string;
    hud: ReactNode;
    children: ReactNode;
}) {
    const light = useTheme() === 'light';
    const palette = light ? LIGHT : DARK;
    return (
        <PaletteContext.Provider value={palette}>
            <div
                data-cursor="play"
                className="frame-ticks relative h-full w-full overflow-hidden rounded-lg border border-hairline bg-bg transition-colors duration-300 hover:border-hairline-strong"
            >
                <Canvas
                    shadows
                    frameloop={running ? 'always' : 'never'}
                    dpr={[1, compact ? 1.5 : 1.75]}
                    gl={{
                        antialias: true,
                        alpha: true,
                        powerPreference: 'high-performance',
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: light ? 1.04 : 1.18,
                    }}
                    camera={{ fov: pose.fov ?? 36, position: pose.position, near: 0.1, far: 80 }}
                    style={{ touchAction: 'pan-y' }}
                    aria-hidden="true"
                >
                    {/* The context crosses into the canvas reconciler explicitly. */}
                    <PaletteContext.Provider value={palette}>
                        <Exposure light={light} />
                        {fog && <fog attach="fog" args={[palette.bg, fog[0], fog[1]]} />}
                        <Rig pose={pose} sway={sway ?? (compact ? 0.3 : 0.72)} />

                        {/* 3-point monochrome studio lighting with soft grounded key shadows */}
                        <hemisphereLight args={[light ? '#ffffff' : '#d8d8e0', light ? '#c8c8cc' : '#08080c', light ? 1.0 : 0.65]} />
                        <directionalLight
                            castShadow
                            position={[5.5, 11, 6.5]}
                            intensity={light ? 1.45 : 2.1}
                            color="#ffffff"
                            shadow-mapSize-width={1024}
                            shadow-mapSize-height={1024}
                            shadow-camera-near={1}
                            shadow-camera-far={30}
                            shadow-camera-left={-9}
                            shadow-camera-right={9}
                            shadow-camera-top={9}
                            shadow-camera-bottom={-9}
                            shadow-bias={-0.0004}
                            shadow-radius={3}
                        />
                        <directionalLight position={[-7, 5, -5]} intensity={light ? 0.45 : 0.75} color="#e5e5ee" />
                        <directionalLight position={[0, 3, -9]} intensity={light ? 0.25 : 0.45} color="#ffffff" />

                        {children}
                    </PaletteContext.Provider>
                </Canvas>
                {/* Above the in-scene labels (drei Html sits at z 0 to 10). */}
                <div className="pointer-events-none absolute inset-0 z-20">{hud}</div>
                <span className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-signal" aria-hidden="true" />
                    {label}
                </span>
            </div>
        </PaletteContext.Provider>
    );
}

/** HUD building blocks, in the site's own type. */
export function HudButton({
    children,
    onClick,
    primary = false,
    disabled = false,
    className = '',
}: {
    children: ReactNode;
    onClick: () => void;
    primary?: boolean;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            data-cursor=""
            className={`pointer-events-auto rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                primary ? 'bg-text-strong text-bg hover:bg-text' : 'border border-hairline-strong bg-veil text-text-strong hover:border-signal'
            } ${className}`}
        >
            {children}
        </button>
    );
}

export function HudLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <p className={`font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute ${className}`}>{children}</p>;
}
