
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// --- FLOCKING LOGIC ---
const FISH_COUNT = 80;
const SPEED = 2.5;

const FlockingFish = ({ mouse }: { mouse: React.MutableRefObject<THREE.Vector2> }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { viewport } = useThree();

    // Initialize state for each fish: position, velocity, color
    const [positions, velocities, colors] = useMemo(() => {
        const pos = new Float32Array(FISH_COUNT * 3);
        const vel = new Float32Array(FISH_COUNT * 3);
        const col = new Float32Array(FISH_COUNT * 3);

        // Koi colors: Red, White, slightly Orange-Red
        const colorPalette = [
            new THREE.Color('#ef4444'), // Red
            new THREE.Color('#ffffff'), // White
            new THREE.Color('#ff7e5f'), // Coral/Orange-ish
        ];

        for (let i = 0; i < FISH_COUNT; i++) {
            // Spread them out more
            pos[i * 3] = (Math.random() - 0.5) * 35;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;

            vel[i * 3] = (Math.random() - 0.5) * 0.1;
            vel[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
            vel[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

            const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            c.toArray(col, i * 3);
        }
        return [pos, vel, col];
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Mouse target in world space
        const mouseTarget = new THREE.Vector3(
            (mouse.current.x * viewport.width) / 2,
            (mouse.current.y * viewport.height) / 2,
            0
        );

        const dummy = new THREE.Object3D();

        for (let i = 0; i < FISH_COUNT; i++) {
            const idx = i * 3;
            const p = new THREE.Vector3(positions[idx], positions[idx + 1], positions[idx + 2]);
            const v = new THREE.Vector3(velocities[idx], velocities[idx + 1], velocities[idx + 2]);

            const toCenter = new THREE.Vector3(0, 0, 0).sub(p).multiplyScalar(0.002);

            // Attraction to mouse
            const toMouse = mouseTarget.clone().sub(p);
            const mouseDist = toMouse.length();
            if (mouseDist < 8) { // Increased radius
                v.add(toMouse.normalize().multiplyScalar(0.02)); // Stronger pull
            } else {
                v.add(toCenter);
            }

            // Wander
            v.x += (Math.random() - 0.5) * 0.015;
            v.y += (Math.random() - 0.5) * 0.015;
            v.z += (Math.random() - 0.5) * 0.015;

            v.clampLength(0.04, 0.12); // Slightly faster

            p.add(v.clone().multiplyScalar(SPEED));

            // Soft boundaries
            if (Math.abs(p.x) > 25) p.x *= -0.9;
            if (Math.abs(p.y) > 15) p.y *= -0.9;
            if (Math.abs(p.z) > 10) p.z *= -0.9;

            positions[idx] = p.x;
            positions[idx + 1] = p.y;
            positions[idx + 2] = p.z;
            velocities[idx] = v.x;
            velocities[idx + 1] = v.y;
            velocities[idx + 2] = v.z;

            dummy.position.copy(p);
            const lookAtTarget = p.clone().add(v);
            dummy.lookAt(lookAtTarget);

            // Dynamic scale
            const scale = 1.2 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.3;
            dummy.scale.set(scale, scale, scale);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
            meshRef.current.setColorAt(i, new THREE.Color(colors[idx], colors[idx + 1], colors[idx + 2]));
        }

        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, FISH_COUNT]}>
            <coneGeometry args={[0.2, 0.8, 8]} />
            <meshStandardMaterial
                roughness={0.4}
                metalness={0.6}
                color="#ffffff"
                emissive="#222222" // Add subtle glow
                emissiveIntensity={0.2}
            />
        </instancedMesh>
    );
};

// --- MAIN BACKGROUND COMPONENT ---
const FishBackground = () => {
    const mouse = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="absolute inset-0 bg-[#020617] -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050510] to-[#0a0a20] opacity-80 z-0"></div>

            <Canvas
                shadows
                camera={{ position: [0, 0, 15], fov: 45 }}
                className="z-10"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                dpr={[1, 2]}
            >
                <fog attach="fog" args={['#020617', 5, 40]} />
                <ambientLight intensity={0.8} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff5555" />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#5555ff" />

                <FlockingFish mouse={mouse} />

            </Canvas>
        </div>
    );
};

export default FishBackground;
