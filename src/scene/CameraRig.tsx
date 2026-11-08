import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sceneBus } from './sceneBus';

const BASE_Z = 14;

/**
 * Fixed-distance camera with a touch of pointer parallax. No scroll dolly:
 * chapters pin DOM labels to world coordinates (lanes, route stops), which
 * only registers if the z=0 plane keeps a constant screen scale.
 */
export default function CameraRig() {
    const target = useRef(new THREE.Vector3(0, 0, BASE_Z));
    const camera = useThree((s) => s.camera);

    useEffect(() => {
        const v = new THREE.Vector3();
        sceneBus.project = (x, y, z) => {
            v.set(x, y, z).project(camera);
            return [(v.x + 1) * 50, (1 - v.y) * 50];
        };
        return () => {
            sceneBus.project = null;
        };
    }, [camera]);

    useFrame(({ camera }, rawDelta) => {
        const delta = Math.min(rawDelta, 1 / 20);
        const { x, y } = sceneBus.pointer;

        target.current.set(
            x * 0.7,
            y * 0.45,
            BASE_Z,
        );
        camera.position.lerp(target.current, Math.min(1, delta * 2.2));
        camera.lookAt(0, 0, 0);
    });

    return null;
}
