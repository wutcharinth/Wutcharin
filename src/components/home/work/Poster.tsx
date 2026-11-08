import { useMemo, type ReactElement } from 'react';
import type { Project } from '../../../data/projects';

/**
 * A generated "reel frame" for a project: no screenshots needed. The motif
 * follows the project's tier (insight = signal waves, agent = node graph,
 * lab = modular grid), seeded by id so every poster is unique but stable.
 * Accent appears only inside the frame (the Identity Lane rule).
 */

function prng(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function seedOf(s: string) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
}

function Motif({ project }: { project: Project }) {
    const els = useMemo(() => {
        const r = prng(seedOf(project.id));
        const c = project.accent;
        const out: ReactElement[] = [];
        if (project.tier === 'insight') {
            for (let k = 0; k < 7; k++) {
                const amp = 18 + r() * 40;
                const freq = 1.5 + r() * 3;
                const ph = r() * Math.PI * 2;
                const yb = 60 + k * 26;
                let d = '';
                for (let x = 0; x <= 640; x += 8) {
                    const y = yb + Math.sin((x / 640) * Math.PI * freq + ph) * amp * (0.4 + (x / 640) * 0.6);
                    d += `${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`;
                }
                out.push(<path key={k} d={d} fill="none" stroke={c} strokeOpacity={0.15 + k * 0.1} strokeWidth={k === 4 ? 2 : 1} />);
            }
        } else if (project.tier === 'agent') {
            const nodes = Array.from({ length: 16 }, () => [40 + r() * 560, 40 + r() * 280] as const);
            nodes.forEach(([x, y], i) => {
                const j = Math.floor(r() * nodes.length);
                const k = Math.floor(r() * nodes.length);
                out.push(<line key={`a${i}`} x1={x} y1={y} x2={nodes[j][0]} y2={nodes[j][1]} stroke={c} strokeOpacity={0.25} />);
                out.push(<line key={`b${i}`} x1={x} y1={y} x2={nodes[k][0]} y2={nodes[k][1]} stroke={c} strokeOpacity={0.12} />);
            });
            nodes.forEach(([x, y], i) =>
                out.push(<circle key={`n${i}`} cx={x} cy={y} r={i % 5 === 0 ? 6 : 2.5} fill={i % 5 === 0 ? c : 'currentColor'} fillOpacity={i % 5 === 0 ? 0.9 : 0.5} />),
            );
        } else {
            for (let gx = 0; gx < 12; gx++) {
                for (let gy = 0; gy < 6; gy++) {
                    const v = r();
                    if (v < 0.45) continue;
                    out.push(
                        <rect
                            key={`${gx}-${gy}`}
                            x={36 + gx * 48}
                            y={36 + gy * 48}
                            width={v > 0.9 ? 88 : 36}
                            height={36}
                            rx={4}
                            fill={v > 0.85 ? c : 'none'}
                            fillOpacity={0.55}
                            stroke={c}
                            strokeOpacity={0.3}
                        />,
                    );
                }
            }
        }
        return out;
    }, [project]);
    return <>{els}</>;
}

export default function Poster({ project, index, compact = false }: { project: Project; index: number; compact?: boolean }) {
    const Icon = project.icon;
    const real = Boolean(project.poster) && !compact;
    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-hairline bg-void text-text-strong">
            {real ? (
                <>
                    {/* The real thing: a screenshot of the live project. */}
                    <img
                        src={project.poster}
                        alt={`Screenshot of ${project.title}`}
                        width={1600}
                        height={900}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(1,1,9,0.85)_100%)]" />
                </>
            ) : (
                <>
                    <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{ background: `radial-gradient(60% 70% at 70% 40%, ${project.accent}33, transparent 70%)` }}
                    />
                    <svg aria-hidden="true" viewBox="0 0 640 360" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <pattern id={`dots-${project.id}`} width="16" height="16" patternUnits="userSpaceOnUse">
                                <circle cx="1" cy="1" r="1" fill="currentColor" fillOpacity="0.08" />
                            </pattern>
                        </defs>
                        <rect width="640" height="360" fill={`url(#dots-${project.id})`} />
                        <Motif project={project} />
                    </svg>
                    <Icon
                        aria-hidden="true"
                        strokeWidth={1}
                        className={`absolute ${compact ? 'right-4 top-4 h-10 w-10' : 'right-[8%] top-[14%] h-[28%] w-[28%]'}`}
                        style={{ color: project.accent, opacity: 0.85 }}
                    />
                </>
            )}
            {/* Letterbox scan: the frame reads as a running reel, not a card. */}
            <div aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_3px,rgba(255,255,255,0.025)_3px,rgba(255,255,255,0.025)_4px)]" />
            {!compact && (
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-[5%] font-mono text-[10px] uppercase tracking-[0.28em]">
                    <span className={real ? 'text-white/80' : 'text-text-strong/70'}>
                        Fig. {String(index + 1).padStart(2, '0')} · {project.badge ?? project.role}
                    </span>
                    <span className={`hidden sm:inline ${real ? 'text-white/50' : 'text-text-strong/40'}`}>{project.tags.slice(0, 2).join(' / ')}</span>
                </div>
            )}
        </div>
    );
}
