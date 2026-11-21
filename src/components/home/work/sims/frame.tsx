import { useMemo, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { useTheme } from '../../../../lib/theme';
import { DARK, LIGHT, PaletteContext, type SimProps } from './kit';

/**
 * The frame every product simulation sits in: the canvas, a camera rig, the
 * lights, and the DOM controls on top. Every simulation is driven by real
 * buttons in its controls, so it works by tap as well as by pointer.
 */

type CameraPose = { position: [number, number, number]; target: [number, number, number]; fov?: number };

/** The camera leans a little toward the pointer, and never further. */
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
    label,
    hud,
    children,
}: SimProps & { pose: CameraPose; sway?: number; label: string; hud: ReactNode; children: ReactNode }) {
    const light = useTheme() === 'light';
    const palette = light ? LIGHT : DARK;
    return (
        <PaletteContext.Provider value={palette}>
            <div
                data-cursor="play"
                className="frame-ticks relative h-full w-full overflow-hidden rounded-lg border border-hairline bg-bg transition-colors duration-300 hover:border-hairline-strong"
            >
                <Canvas
                    frameloop={running ? 'always' : 'never'}
                    dpr={[1, compact ? 1.5 : 1.75]}
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                    camera={{ fov: pose.fov ?? 36, position: pose.position, near: 0.1, far: 80 }}
                    style={{ touchAction: 'pan-y' }}
                    aria-hidden="true"
                >
                    {/* The context crosses into the canvas reconciler explicitly. */}
                    <PaletteContext.Provider value={palette}>
                        <Rig pose={pose} sway={sway ?? (compact ? 0.3 : 0.8)} />
                        <ambientLight intensity={light ? 1.4 : 0.7} />
                        <directionalLight position={[4, 9, 6]} intensity={light ? 1.2 : 1.6} />
                        <directionalLight position={[-6, 4, -4]} intensity={0.35} />
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
export function HudButton({ children, onClick, primary = false, disabled = false, className = '' }: { children: ReactNode; onClick: () => void; primary?: boolean; disabled?: boolean; className?: string }) {
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
