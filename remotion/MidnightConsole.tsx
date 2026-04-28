import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

/**
 * MidnightConsole — ambient neural-network composition.
 * Replaces the runtime canvas in CinematicReel with a deterministic, seamlessly
 * looping pre-rendered video.
 *
 * Design constraints (from DESIGN.md "The Midnight Console"):
 *   - Surface: #020617, never #000.
 *   - Single signal: violet #a78bfa with deeper #7c3aed for connections.
 *   - Flat-by-default; no gradient text, no rainbow.
 *   - Ambient violet glow as state, not as decoration.
 */

const NODE_COUNT = 90;

// Deterministic seedable hash, wrapped to [0, 1).
const seed = (n: number) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
};

type Node = {
    baseX: number;
    baseY: number;
    ax: number;
    ay: number;
    px: number;
    py: number;
    fx: number;
    fy: number;
    radius: number;
};

const buildNodes = (width: number, height: number): Node[] =>
    Array.from({ length: NODE_COUNT }, (_, i) => ({
        baseX: seed(i * 2 + 1) * width,
        baseY: seed(i * 2 + 2) * height,
        ax: 24 + seed(i * 3 + 4) * 56,
        ay: 24 + seed(i * 3 + 5) * 56,
        px: seed(i * 4 + 7) * Math.PI * 2,
        py: seed(i * 4 + 8) * Math.PI * 2,
        // Integer frequencies guarantee a perfect seam at frame == durationInFrames.
        fx: 1 + Math.floor(seed(i * 5 + 9) * 2),
        fy: 1 + Math.floor(seed(i * 5 + 10) * 2),
        radius: 1.2 + seed(i * 6 + 11) * 1.2,
    }));

const MAX_LINK_DIST = 150;

export const MidnightConsole = () => {
    const frame = useCurrentFrame();
    const { width, height, durationInFrames } = useVideoConfig();

    // Cycle parameter: 0 → 2π over the full duration.
    const t = (frame / durationInFrames) * Math.PI * 2;

    const nodes = buildNodes(width, height);
    const positions = nodes.map((n) => ({
        x: n.baseX + Math.cos(t * n.fx + n.px) * n.ax,
        y: n.baseY + Math.sin(t * n.fy + n.py) * n.ay,
        r: n.radius,
    }));

    // Soft fade-in over the first 30 frames so a paused first frame never reveals
    // a hard pop on autoplay; matches the existing aurora's quiet entrance.
    const intro = interpolate(frame, [0, 30], [0, 1], {
        easing: Easing.bezier(0.16, 1, 0.3, 1),
        extrapolateRight: 'clamp',
    });

    const lines: JSX.Element[] = [];
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const dx = positions[i].x - positions[j].x;
            const dy = positions[i].y - positions[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 > MAX_LINK_DIST * MAX_LINK_DIST) continue;
            const d = Math.sqrt(d2);
            const alpha = (1 - d / MAX_LINK_DIST) * 0.22 * intro;
            lines.push(
                <line
                    key={`${i}-${j}`}
                    x1={positions[i].x}
                    y1={positions[i].y}
                    x2={positions[j].x}
                    y2={positions[j].y}
                    stroke={`rgba(139, 92, 246, ${alpha.toFixed(3)})`}
                    strokeWidth={0.9}
                />
            );
        }
    }

    // Aurora wash — slow rotation, identical at frame 0 and frame durationInFrames.
    const auroraAngle = (frame / durationInFrames) * 360;

    return (
        <AbsoluteFill style={{ backgroundColor: '#020617' }}>
            {/* Aurora orbs — color, not elevation. */}
            <AbsoluteFill style={{ pointerEvents: 'none', opacity: 0.6 }}>
                <div
                    style={{
                        position: 'absolute',
                        left: '12%',
                        top: '18%',
                        width: '38%',
                        height: '64%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.55) 0%, rgba(124, 58, 237, 0) 70%)',
                        filter: 'blur(60px)',
                        transform: `rotate(${auroraAngle}deg)`,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        right: '8%',
                        top: '28%',
                        width: '30%',
                        height: '54%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(232, 121, 249, 0.28) 0%, rgba(232, 121, 249, 0) 70%)',
                        filter: 'blur(80px)',
                        transform: `rotate(${-auroraAngle}deg)`,
                    }}
                />
            </AbsoluteFill>

            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                style={{ position: 'absolute', inset: 0, opacity: intro }}
            >
                {lines}
                {positions.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={p.r}
                        fill="rgba(167, 139, 250, 0.8)"
                    />
                ))}
            </svg>

            {/* Radial vignette — keeps the edges quiet so the section blends into
                surrounding sections at the same Midnight Deep surface. */}
            <AbsoluteFill
                style={{
                    background:
                        'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(2, 6, 23, 0.95) 100%)',
                }}
            />
        </AbsoluteFill>
    );
};
