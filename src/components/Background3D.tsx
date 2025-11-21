import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function Stars(props: any) {
    const ref = useRef<any>(null);
    const sphere = useMemo(() => random.inSphere(new Float32Array(6000), { radius: 1.2 }), []);

    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 15;
            ref.current.rotation.y -= delta / 20;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#06b6d4"
                    size={0.003}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
}

export default function Background3D() {
    return (
        <div className="fixed inset-0 -z-10 bg-dark">
            <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-dark z-0 pointer-events-none" />
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars />
            </Canvas>
        </div>
    );
}
