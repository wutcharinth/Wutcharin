import { useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, TrackballControls } from '@react-three/drei';
import * as THREE from 'three';

function Word({ children, ...props }: any) {
    const fontProps = { fontSize: 2.5, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false };
    const [hovered, setHovered] = useState(false);
    const over = (e: any) => (e.stopPropagation(), setHovered(true));
    const out = () => setHovered(false);

    useEffect(() => {
        if (hovered) document.body.style.cursor = 'pointer';
        return () => { document.body.style.cursor = 'auto'; };
    }, [hovered]);

    useFrame(({ camera }) => {
        // Make text always face the camera
        if (props.ref?.current) {
            props.ref.current.quaternion.copy(camera.quaternion);
        }
    });

    return (
        <Text
            {...props}
            {...fontProps}
            onPointerOver={over}
            onPointerOut={out}
            onClick={() => console.log('clicked:', children)}
        >
            {children}
            <meshBasicMaterial color={hovered ? '#06b6d4' : '#ffffff'} transparent opacity={hovered ? 1 : 0.7} />
        </Text>
    );
}

function Cloud({ count = 4, radius = 20 }) {
    // Create a spherical distribution of words
    const words = useMemo(() => {
        const temp = [];
        const spherical = new THREE.Spherical();
        const phiSpan = Math.PI / (count + 1);
        const thetaSpan = (Math.PI * 2) / count;

        const skills = [
            "Python", "SQL", "React", "Tableau", "PowerBI", "AI", "ML", "Automation",
            "Data Strategy", "Leadership", "Finance", "Analytics", "Cloud", "n8n",
            "TypeScript", "Node.js", "Vite", "Tailwind", "Framer", "Three.js"
        ];

        for (let i = 1; i < count + 1; i++)
            for (let j = 0; j < count; j++)
                temp.push([new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)), skills[(i * j) % skills.length]]);
        return temp;
    }, [count, radius]);

    return words.map(([pos, word], index) => <Word key={index} position={pos} children={word} />);
}

export default function SkillsCloud() {
    return (
        <group rotation={[10, 10, 10]}>
            <Cloud count={8} radius={20} />
            <TrackballControls noZoom />
        </group>
    );
}
