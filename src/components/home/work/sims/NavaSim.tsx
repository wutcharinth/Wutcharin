import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import worldAtlas from 'world-atlas/countries-110m.json';
import { useTheme } from '../../../../lib/theme';
import { DARK, LIGHT, type SimProps } from './kit';
import { HudButton, HudLabel } from './frame';

/**
 * NAVA Airlines, "Asia-Pacific Route Globe": a realistic monochrome 3D Earth
 * globe mirroring the live NAVA Airlines website. Built directly on Three.js
 * with ACESFilmicToneMapping, real world continents from world-atlas TopoJSON
 * painted to Albedo + Roughness maps (glossy oceans vs. matte dot-textured
 * landmasses, Thailand highlighted), dual Fresnel atmospheric rim shaders,
 * all 13 real NAVA routes from BKK, 3D TubeGeometry great-circle arcs,
 * animated jets, drag-to-rotate, and 3D projected city pins.
 */

type Dest = {
    code: string;
    city: string;
    lat: number;
    lng: number;
    aircraft: 'A321LR' | 'A320neo';
    distanceKm: number;
    blockMins: number;
    baseFareTHB: number;
};

const GLOBE_R = 1.88;
const BKK = { code: 'BKK', city: 'Bangkok', lat: 13.69, lng: 100.75 };

const DESTINATIONS: Dest[] = [
    { code: 'FUK', city: 'Fukuoka', lat: 33.59, lng: 130.45, aircraft: 'A321LR', distanceKm: 3720, blockMins: 325, baseFareTHB: 6490 },
    { code: 'PVG', city: 'Shanghai', lat: 31.14, lng: 121.81, aircraft: 'A321LR', distanceKm: 2890, blockMins: 260, baseFareTHB: 5190 },
    { code: 'ICN', city: 'Seoul', lat: 37.46, lng: 126.44, aircraft: 'A321LR', distanceKm: 3680, blockMins: 325, baseFareTHB: 6290 },
    { code: 'KIX', city: 'Osaka', lat: 34.43, lng: 135.24, aircraft: 'A321LR', distanceKm: 4160, blockMins: 345, baseFareTHB: 6890 },
    { code: 'SIN', city: 'Singapore', lat: 1.36, lng: 103.99, aircraft: 'A320neo', distanceKm: 1430, blockMins: 145, baseFareTHB: 2690 },
    { code: 'PER', city: 'Perth', lat: -31.94, lng: 115.97, aircraft: 'A321LR', distanceKm: 5330, blockMins: 415, baseFareTHB: 8490 },
    { code: 'BLR', city: 'Bengaluru', lat: 13.2, lng: 77.71, aircraft: 'A321LR', distanceKm: 2490, blockMins: 225, baseFareTHB: 4590 },
    { code: 'HKG', city: 'Hong Kong', lat: 22.31, lng: 113.91, aircraft: 'A320neo', distanceKm: 1710, blockMins: 170, baseFareTHB: 3590 },
    { code: 'TPE', city: 'Taipei', lat: 25.08, lng: 121.23, aircraft: 'A320neo', distanceKm: 2530, blockMins: 225, baseFareTHB: 4190 },
    { code: 'TFU', city: 'Chengdu', lat: 30.31, lng: 104.44, aircraft: 'A320neo', distanceKm: 1920, blockMins: 195, baseFareTHB: 3890 },
    { code: 'SGN', city: 'Ho Chi Minh City', lat: 10.82, lng: 106.65, aircraft: 'A320neo', distanceKm: 745, blockMins: 95, baseFareTHB: 2190 },
    { code: 'CNX', city: 'Chiang Mai', lat: 18.77, lng: 98.96, aircraft: 'A320neo', distanceKm: 595, blockMins: 75, baseFareTHB: 1290 },
    { code: 'HKT', city: 'Phuket', lat: 8.11, lng: 98.31, aircraft: 'A320neo', distanceKm: 685, blockMins: 85, baseFareTHB: 1390 },
];

const QUICK_CODES = ['FUK', 'PVG', 'ICN', 'SIN', 'BLR', 'PER'];
const COMPACT_PINS = new Set(['FUK', 'SIN', 'PER', 'BLR']);

function formatBlock(mins: number) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${String(m).padStart(2, '0')}m`;
}

/** Standard equirectangular sphere mapping matching Three.js SphereGeometry UVs. */
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lng + 180) * Math.PI) / 180;
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
    );
}

/** Globe rotation that centers (lat, lng) facing the +Z camera. */
function focusRotation(lat: number, lng: number) {
    return {
        rotY: -((lng + 90) * Math.PI) / 180,
        rotX: (lat * Math.PI) / 180,
    };
}

// ---------- Typed TopoJSON decoder for world-atlas/countries-110m.json ----------
type TopoGeometry =
    | { type: 'Polygon'; id?: string | number; arcs: number[][] }
    | { type: 'MultiPolygon'; id?: string | number; arcs: number[][][] };

type TopoAtlas = {
    transform: { scale: [number, number]; translate: [number, number] };
    arcs: number[][][];
    objects: { countries: { geometries: TopoGeometry[] } };
};

const ATLAS = worldAtlas as unknown as TopoAtlas;

function decodeArc(arcIndex: number): Array<[number, number]> {
    const reversed = arcIndex < 0;
    const raw = ATLAS.arcs[reversed ? ~arcIndex : arcIndex];
    const [sx, sy] = ATLAS.transform.scale;
    const [tx, ty] = ATLAS.transform.translate;
    const pts: Array<[number, number]> = [];
    let x = 0;
    let y = 0;
    for (let i = 0; i < raw.length; i++) {
        x += raw[i][0];
        y += raw[i][1];
        pts.push([x * sx + tx, y * sy + ty]);
    }
    return reversed ? pts.reverse() : pts;
}

function decodeRing(indices: number[]): Array<[number, number]> {
    const ring: Array<[number, number]> = [];
    for (let i = 0; i < indices.length; i++) {
        const seg = decodeArc(indices[i]);
        for (let j = i === 0 ? 0 : 1; j < seg.length; j++) ring.push(seg[j]);
    }
    return ring;
}

/** Paint realistic equirectangular Albedo + Roughness Earth maps per theme. */
function buildEarthTextures(light: boolean) {
    const W = 1024;
    const H = 512;
    const albedo = document.createElement('canvas');
    albedo.width = W;
    albedo.height = H;
    const ctx = albedo.getContext('2d');

    const rough = document.createElement('canvas');
    rough.width = W;
    rough.height = H;
    const rctx = rough.getContext('2d');

    if (ctx && rctx) {
        // Ocean base gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        if (light) {
            grad.addColorStop(0, '#e6e6e8');
            grad.addColorStop(0.5, '#f2f2f4');
            grad.addColorStop(1, '#e6e6e8');
        } else {
            grad.addColorStop(0, '#0d0d11');
            grad.addColorStop(0.5, '#07070a');
            grad.addColorStop(1, '#0d0d11');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Glossier ocean vs matte land for crisp specular curve light
        rctx.fillStyle = light ? '#9a9a9a' : '#5c5c5c';
        rctx.fillRect(0, 0, W, H);

        // Subtle 15-degree graticule grid
        ctx.strokeStyle = light ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 0.6;
        for (let lng = -180; lng <= 180; lng += 15) {
            const x = ((lng + 180) / 360) * W;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        for (let lat = -75; lat <= 75; lat += 15) {
            const y = ((90 - lat) / 180) * H;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }

        // Tactile micro-dot continental landmass pattern
        const patCanvas = document.createElement('canvas');
        patCanvas.width = 4;
        patCanvas.height = 4;
        const pctx = patCanvas.getContext('2d');
        if (pctx) {
            pctx.fillStyle = light ? '#cfd0d6' : '#1d1e24';
            pctx.fillRect(0, 0, 4, 4);
            pctx.fillStyle = light ? 'rgba(0, 0, 0, 0.09)' : 'rgba(255, 255, 255, 0.16)';
            pctx.fillRect(1, 1, 1, 1);
        }
        const landPattern = ctx.createPattern(patCanvas, 'repeat') ?? (light ? '#cfd0d6' : '#1d1e24');

        const traceRing = (target: CanvasRenderingContext2D, ring: Array<[number, number]>) => {
            for (let i = 0; i < ring.length; i++) {
                const [lng, lat] = ring[i];
                const x = ((lng + 180) / 360) * W;
                const y = ((90 - lat) / 180) * H;
                if (i === 0) target.moveTo(x, y);
                else target.lineTo(x, y);
            }
            target.closePath();
        };

        const traceGeom = (target: CanvasRenderingContext2D, geom: TopoGeometry) => {
            target.beginPath();
            if (geom.type === 'Polygon') {
                for (const ringIdx of geom.arcs) traceRing(target, decodeRing(ringIdx));
            } else if (geom.type === 'MultiPolygon') {
                for (const poly of geom.arcs) {
                    for (const ringIdx of poly) traceRing(target, decodeRing(ringIdx));
                }
            }
        };

        for (const geom of ATLAS.objects.countries.geometries) {
            const isThailand = String(geom.id) === '764';
            traceGeom(ctx, geom);
            ctx.fillStyle = isThailand ? (light ? '#262626' : '#40424c') : landPattern;
            ctx.fill();
            ctx.strokeStyle = isThailand
                ? light
                    ? 'rgba(0, 0, 0, 0.95)'
                    : 'rgba(255, 255, 255, 0.98)'
                : light
                  ? 'rgba(0, 0, 0, 0.28)'
                  : 'rgba(255, 255, 255, 0.34)';
            ctx.lineWidth = isThailand ? 1.5 : 0.7;
            ctx.stroke();

            traceGeom(rctx, geom);
            rctx.fillStyle = '#ececec';
            rctx.fill();
        }
    }

    const albedoTex = new THREE.CanvasTexture(albedo);
    albedoTex.colorSpace = THREE.SRGBColorSpace;
    albedoTex.anisotropy = 4;

    const roughTex = new THREE.CanvasTexture(rough);
    roughTex.anisotropy = 2;

    return { albedoTex, roughTex };
}

const FRESNEL_VERT = `
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
}
`;

const OUTER_ATMO_FRAG = `
uniform vec3 uColor;
uniform float uStrength;
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.6);
    gl_FragColor = vec4(uColor, fresnel * uStrength);
}
`;

const INNER_RIM_FRAG = `
uniform vec3 uColor;
uniform float uStrength;
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
    float rim = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
    gl_FragColor = vec4(uColor, rim * uStrength);
}
`;

export default function NavaSim({ running, compact }: SimProps) {
    const light = useTheme() === 'light';
    const [selectedCode, setSelectedCode] = useState<string>('FUK');
    const [hoveredCode, setHoveredCode] = useState<string | null>(null);

    const mountRef = useRef<HTMLDivElement>(null);
    const pinEls = useRef<Record<string, HTMLElement | null>>({});
    const selectedRef = useRef(selectedCode);
    const hoveredRef = useRef<string | null>(hoveredCode);
    const runningRef = useRef(running);
    const dragRot = useRef(focusRotation(22, 114));
    const userDragged = useRef(false);

    useEffect(() => {
        selectedRef.current = selectedCode;
        const dest = DESTINATIONS.find((d) => d.code === selectedCode);
        if (!dest) return;
        userDragged.current = false;
        const midLat = BKK.lat * 0.55 + dest.lat * 0.45;
        const midLng = BKK.lng * 0.52 + dest.lng * 0.48;
        dragRot.current = focusRotation(midLat, midLng);
    }, [selectedCode]);

    useEffect(() => {
        hoveredRef.current = hoveredCode;
    }, [hoveredCode]);

    useEffect(() => {
        runningRef.current = running;
    }, [running]);

    const activeDest = useMemo(
        () => DESTINATIONS.find((d) => d.code === (hoveredCode ?? selectedCode)) ?? DESTINATIONS[0],
        [hoveredCode, selectedCode],
    );

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const palette = light ? LIGHT : DARK;
        const inkColor = new THREE.Color(palette.ink);
        const softColor = new THREE.Color(palette.soft);
        const midColor = new THREE.Color(palette.mid);

        const W = container.clientWidth || 640;
        const H = container.clientHeight || 520;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
        camera.position.set(0, 0.08, compact ? 6.85 : 6.15);
        camera.lookAt(0, 0, 0);

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        } catch {
            return;
        }
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 1.75));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = light ? 1.05 : 1.15;
        renderer.setClearColor(0x000000, 0);
        container.innerHTML = '';
        container.appendChild(renderer.domElement);

        const globeGroup = new THREE.Group();
        globeGroup.rotation.y = dragRot.current.rotY;
        globeGroup.rotation.x = dragRot.current.rotX;
        scene.add(globeGroup);

        // Earth sphere with glossy oceans & matte dot-textured landmasses
        const { albedoTex, roughTex } = buildEarthTextures(light);
        const earthGeo = new THREE.SphereGeometry(GLOBE_R, 72, 72);
        const earthMat = new THREE.MeshStandardMaterial({
            map: albedoTex,
            roughnessMap: roughTex,
            roughness: 1,
            metalness: 0.14,
        });
        const earthMesh = new THREE.Mesh(earthGeo, earthMat);
        globeGroup.add(earthMesh);

        // Dual Fresnel atmospheric rim shaders
        const outerGeo = new THREE.SphereGeometry(GLOBE_R * 1.065, 56, 56);
        const outerMat = new THREE.ShaderMaterial({
            vertexShader: FRESNEL_VERT,
            fragmentShader: OUTER_ATMO_FRAG,
            uniforms: {
                uColor: { value: new THREE.Color(light ? '#171717' : '#ffffff') },
                uStrength: { value: light ? 0.16 : 0.34 },
            },
            blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false,
        });
        globeGroup.add(new THREE.Mesh(outerGeo, outerMat));

        const innerGeo = new THREE.SphereGeometry(GLOBE_R * 1.004, 56, 56);
        const innerMat = new THREE.ShaderMaterial({
            vertexShader: FRESNEL_VERT,
            fragmentShader: INNER_RIM_FRAG,
            uniforms: {
                uColor: { value: new THREE.Color(light ? '#262626' : '#f5f5f5') },
                uStrength: { value: light ? 0.16 : 0.3 },
            },
            blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
        });
        globeGroup.add(new THREE.Mesh(innerGeo, innerMat));

        // Studio lighting for curved globe relief
        scene.add(new THREE.AmbientLight('#ffffff', light ? 1.25 : 0.85));
        const keyLight = new THREE.DirectionalLight('#ffffff', light ? 1.3 : 2.3);
        keyLight.position.set(4.5, 3.2, 5.4);
        scene.add(keyLight);
        const rimLight = new THREE.DirectionalLight('#e5e5e5', light ? 0.45 : 0.75);
        rimLight.position.set(-4.5, 1.2, 2.5);
        scene.add(rimLight);
        const underLight = new THREE.DirectionalLight('#d4d4d4', 0.35);
        underLight.position.set(-3.5, -3, -3);
        scene.add(underLight);

        // BKK Home Hub beacon + pulsing concentric ring
        const bkkPos = latLngToVec3(BKK.lat, BKK.lng, GLOBE_R + 0.012);
        const hubGeo = new THREE.SphereGeometry(0.04, 18, 18);
        const hubMat = new THREE.MeshBasicMaterial({ color: inkColor });
        const hubMesh = new THREE.Mesh(hubGeo, hubMat);
        hubMesh.position.copy(bkkPos);
        globeGroup.add(hubMesh);

        const ringGeo = new THREE.RingGeometry(0.046, 0.068, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: inkColor, side: THREE.DoubleSide, transparent: true, opacity: 0.85 });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(bkkPos).multiplyScalar(1.004);
        ringMesh.lookAt(bkkPos.clone().multiplyScalar(2));
        globeGroup.add(ringMesh);

        // Shared geometries for destination nodes & animated jets
        const nodeGeo = new THREE.SphereGeometry(0.023, 14, 14);
        const jetGeo = new THREE.ConeGeometry(0.02, 0.064, 5);
        jetGeo.rotateX(Math.PI / 2);

        const corridors = DESTINATIONS.map((dest, idx) => {
            const end = latLngToVec3(dest.lat, dest.lng, GLOBE_R + 0.012);
            const mid = bkkPos.clone().add(end).multiplyScalar(0.5);
            const dist = bkkPos.distanceTo(end);
            mid.normalize().multiplyScalar(GLOBE_R + 0.14 + dist * 0.22);
            const curve = new THREE.QuadraticBezierCurve3(bkkPos, mid, end);
            const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.0055, 7, false);
            const tubeMat = new THREE.MeshBasicMaterial({ color: softColor, transparent: true, opacity: 0.28 });
            const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
            globeGroup.add(tubeMesh);

            const nodeMat = new THREE.MeshBasicMaterial({ color: midColor });
            const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
            nodeMesh.position.copy(end);
            globeGroup.add(nodeMesh);

            const jetMat = new THREE.MeshBasicMaterial({ color: inkColor });
            const jetMesh = new THREE.Mesh(jetGeo, jetMat);
            globeGroup.add(jetMesh);

            return {
                dest,
                curve,
                tubeGeo,
                tubeMat,
                nodeMat,
                nodeMesh,
                jetMat,
                jetMesh,
                worldPos: end,
                phase: (idx * 0.17) % 1,
                speed: 0.095 + (idx % 4) * 0.022,
            };
        });

        // Pointer drag-to-rotate directly on the globe stage
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        const onDown = (e: PointerEvent) => {
            if ((e.target as HTMLElement).closest('button')) return;
            isDragging = true;
            userDragged.current = true;
            lastX = e.clientX;
            lastY = e.clientY;
        };
        const onMove = (e: PointerEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;
            dragRot.current = {
                rotY: dragRot.current.rotY + dx * 0.006,
                rotX: Math.max(-0.7, Math.min(0.8, dragRot.current.rotX + dy * 0.0048)),
            };
        };
        const onUp = () => {
            isDragging = false;
        };

        const stageEl = container.parentElement;
        stageEl?.addEventListener('pointerdown', onDown);
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerup', onUp, { passive: true });

        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const nw = entry.contentRect.width;
                const nh = entry.contentRect.height;
                if (nw > 0 && nh > 0) {
                    camera.aspect = nw / nh;
                    camera.updateProjectionMatrix();
                    renderer.setSize(nw, nh);
                }
            }
        });
        ro.observe(container);

        const clock = new THREE.Clock();
        const pt = new THREE.Vector3();
        const ahead = new THREE.Vector3();
        const worldVec = new THREE.Vector3();
        const toCam = new THREE.Vector3();
        const projVec = new THREE.Vector3();

        let raf = 0;
        let renderedInitial = false;

        const projectPin = (code: string, pos: THREE.Vector3, offsetY: string, vw: number, vh: number) => {
            const el = pinEls.current[code];
            if (!el) return;
            worldVec.copy(pos).applyMatrix4(globeGroup.matrixWorld);
            toCam.copy(camera.position).sub(worldVec).normalize();
            const dot = worldVec.clone().normalize().dot(toCam);
            projVec.copy(worldVec).project(camera);
            const visible = dot > 0.22 && projVec.z < 1;
            if (!visible) {
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
                return;
            }
            const x = (projVec.x * 0.5 + 0.5) * vw;
            const y = (-projVec.y * 0.5 + 0.5) * vh;
            el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, ${offsetY})`;
            el.style.opacity = '1';
            if (code !== 'BKK') el.style.pointerEvents = 'auto';
        };

        const renderFrame = () => {
            const t = clock.getElapsedTime();
            const sway = userDragged.current ? 0 : Math.sin(t * 0.35) * 0.045;
            globeGroup.rotation.y += (dragRot.current.rotY + sway - globeGroup.rotation.y) * 0.075;
            globeGroup.rotation.x += (dragRot.current.rotX - globeGroup.rotation.x) * 0.075;

            const cycle = (t * 0.85) % 1;
            ringMesh.scale.setScalar(1 + cycle * 2.1);
            ringMat.opacity = (1 - cycle) * 0.8;

            globeGroup.updateMatrixWorld();
            const activeCode = hoveredRef.current ?? selectedRef.current;

            for (const c of corridors) {
                const isActive = c.dest.code === activeCode;
                c.tubeMat.color.copy(isActive ? inkColor : softColor);
                c.tubeMat.opacity = isActive ? 0.96 : 0.26;
                c.nodeMat.color.copy(isActive ? inkColor : midColor);
                c.nodeMesh.scale.setScalar(isActive ? 1.55 : 0.92);

                const prog = (c.phase + t * c.speed) % 1;
                c.curve.getPoint(prog, pt);
                c.curve.getPoint(Math.min(1, prog + 0.018), ahead);
                c.jetMesh.position.copy(pt);
                ahead.applyMatrix4(globeGroup.matrixWorld);
                c.jetMesh.lookAt(ahead);
                c.jetMesh.scale.setScalar(isActive ? 1.35 : 0.72);
            }

            renderer.render(scene, camera);

            const vw = renderer.domElement.clientWidth || W;
            const vh = renderer.domElement.clientHeight || H;
            projectPin('BKK', bkkPos, '-145%', vw, vh);
            for (const c of corridors) {
                projectPin(c.dest.code, c.worldPos, '-140%', vw, vh);
            }
        };

        const loop = () => {
            raf = requestAnimationFrame(loop);
            if (!runningRef.current && renderedInitial) return;
            renderedInitial = true;
            renderFrame();
        };
        loop();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            stageEl?.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            earthGeo.dispose();
            earthMat.dispose();
            outerGeo.dispose();
            outerMat.dispose();
            innerGeo.dispose();
            innerMat.dispose();
            hubGeo.dispose();
            hubMat.dispose();
            ringGeo.dispose();
            ringMat.dispose();
            nodeGeo.dispose();
            jetGeo.dispose();
            albedoTex.dispose();
            roughTex.dispose();
            corridors.forEach((c) => {
                c.tubeGeo.dispose();
                c.tubeMat.dispose();
                c.nodeMat.dispose();
                c.jetMat.dispose();
            });
            renderer.dispose();
            container.innerHTML = '';
        };
    }, [light, compact]);

    return (
        <div
            data-cursor="play"
            className="frame-ticks relative h-full w-full select-none overflow-hidden rounded-lg border border-hairline bg-bg transition-colors duration-300 hover:border-hairline-strong cursor-grab active:cursor-grabbing"
        >
            {/* Three.js realistic Earth globe mount */}
            <div ref={mountRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

            {/* Camera-facing 3D projected city pins */}
            <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                <div
                    ref={(el) => {
                        pinEls.current.BKK = el;
                    }}
                    style={{ opacity: 0 }}
                    className="absolute left-0 top-0 z-20 flex items-center gap-1.5 rounded-full border border-signal/70 bg-veil px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-text-strong backdrop-blur-sm"
                >
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                    BKK
                </div>

                {DESTINATIONS.map((d) => {
                    const isFocused = d.code === selectedCode || d.code === hoveredCode;
                    if (compact && !isFocused && !COMPACT_PINS.has(d.code)) return null;
                    return (
                        <button
                            key={d.code}
                            ref={(el) => {
                                pinEls.current[d.code] = el;
                            }}
                            type="button"
                            onClick={() => setSelectedCode(d.code)}
                            onMouseEnter={() => setHoveredCode(d.code)}
                            onMouseLeave={() => setHoveredCode(null)}
                            data-cursor=""
                            style={{ opacity: 0 }}
                            className={`absolute left-0 top-0 flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-[0.16em] backdrop-blur-sm transition-colors ${
                                isFocused
                                    ? 'z-30 border-signal/80 bg-text-strong px-2.5 py-0.5 text-[10px] font-semibold text-bg'
                                    : 'z-10 border-hairline bg-veil px-2 py-0.5 text-[9px] text-text-mute hover:border-hairline-strong hover:text-text-strong'
                            }`}
                        >
                            <span>{d.code}</span>
                            {isFocused && !compact && (
                                <span className="font-sans text-[10px] font-normal normal-case tracking-normal opacity-80">
                                    {d.city}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Stage label */}
            <span className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">
                <span className="h-1 w-1 animate-pulse rounded-full bg-signal" aria-hidden="true" />
                Simulation · Asia-Pacific route globe
            </span>

            {/* Active corridor telemetry + quick corridor controls */}
            <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3.5">
                <div className="flex justify-end">
                    <div className="rounded-lg border border-hairline bg-veil px-3.5 py-2.5 text-right backdrop-blur-md">
                        <HudLabel>
                            BKK → {activeDest.code} · {activeDest.aircraft}
                        </HudLabel>
                        <p className="mt-1 font-display text-sm font-medium text-text-strong">
                            Bangkok → {activeDest.city}
                        </p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-mute tabular-nums">
                            {activeDest.distanceKm.toLocaleString()} km · {formatBlock(activeDest.blockMins)} ·{' '}
                            <span className="text-text-strong">THB {activeDest.baseFareTHB.toLocaleString()}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                        {QUICK_CODES.slice(0, compact ? 4 : 6).map((code) => (
                            <HudButton key={code} primary={selectedCode === code} onClick={() => setSelectedCode(code)}>
                                {code}
                            </HudButton>
                        ))}
                    </div>
                    {!compact && (
                        <span className="rounded-full border border-hairline bg-veil px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-text-mute backdrop-blur-sm">
                            Drag to rotate · Click pin
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
