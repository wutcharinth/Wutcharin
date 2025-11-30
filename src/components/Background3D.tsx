import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Stars(props: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = useRef<any>(null);
    // Increased radius for more spread, fewer particles for cleaner look
    const sphere = useMemo(() => random.inSphere(new Float32Array(3000), { radius: 2.5 }), []);

    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 20;
            ref.current.rotation.y -= delta / 25;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.004} // Slightly larger but sharper
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={1} // Full opacity for sharpness
                    toneMapped={false}
                />
            </Points>
        </group>
    );
}

export default function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 bg-dark">
            {/* Darker gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/50 to-dark/90 z-0 pointer-events-none" />
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
            </Canvas>
        </div>
    );
}
