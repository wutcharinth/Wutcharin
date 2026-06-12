import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneBus } from './sceneBus';

const BASE_Z = 14;

/**
 * Scroll-driven dolly with a touch of pointer parallax. Reads the bus per
 * frame — no React state involved.
 */
export default function CameraRig() {
    const target = useRef(new THREE.Vector3(0, 0, BASE_Z));

    useFrame(({ camera }, rawDelta) => {
        const delta = Math.min(rawDelta, 1 / 20);
        const { progress } = sceneBus.targets;
        const { x, y } = sceneBus.pointer;

        target.current.set(
            x * 0.7,
            y * 0.45,
            BASE_Z - progress * 2.6,
        );
        camera.position.lerp(target.current, Math.min(1, delta * 2.2));
        camera.lookAt(0, 0, 0);
    });

    return null;
}
