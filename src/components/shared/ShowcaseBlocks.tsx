import { useEffect, useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Pause, Play, ChevronRight, type LucideIcon } from 'lucide-react';
import { usePrefersReducedMotion } from '../../lib/motion';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Editorial chapter opener for subpages: mono index eyebrow, hairline divider,
 * Clash Display headline with Instrument Serif italic accent, and optional lead copy.
 */
export function SectionHeader({
    id,
    index,
    eyebrow,
    title,
    accent,
    accentColor,
    lead,
    className = '',
}: {
    id?: string;
    index: string;
    eyebrow: string;
    title: string;
    accent?: string;
    accentColor: string;
    lead?: ReactNode;
    className?: string;
}) {
    return (
        <div id={id} className={`scroll-mt-28 border-t border-hairline pt-10 ${className}`}>
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-5">
                    <p className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
                        <span className="tabular-nums">{index}</span>
                        <span aria-hidden="true">·</span>
                        <span>{eyebrow}</span>
                    </p>
                    <motion.h2
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="mt-4 text-3xl leading-[1.02] tracking-[-0.02em] text-text-strong md:text-5xl"
                    >
                        {title}{' '}
                        {accent && (
                            <span className="font-serif font-normal italic" style={{ color: accentColor }}>
                                {accent}
                            </span>
                        )}
                    </motion.h2>
                </div>
                {lead && (
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                        className="flex items-end lg:col-span-7"
                    >
                        <div className="max-w-xl text-base font-light leading-relaxed text-text-mute md:text-lg">{lead}</div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export interface TensionItem {
    title: string;
    body: string;
    metric?: string;
    tag?: string;
    icon?: LucideIcon;
}

/**
 * Interactive architectural ledger replacing generic 3-up icon cards:
 * numbered rows with click/hover selection, animated accent indicator,
 * and token-driven Black/Daylight Console styling.
 */
export function TensionLedger({
    items,
    accentColor,
}: {
    items: TensionItem[];
    accentColor: string;
}) {
    const [active, setActive] = useState(0);

    return (
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
            <ol className="divide-y divide-hairline border-y border-hairline lg:col-span-7">
                {items.map((item, i) => {
                    const isOn = active === i;
                    const Icon = item.icon;
                    return (
                        <li key={item.title}>
                            <button
                                type="button"
                                onClick={() => setActive(i)}
                                onMouseEnter={() => setActive(i)}
                                data-cursor="step"
                                className="group relative grid w-full grid-cols-[2.75rem_minmax(0,1fr)_auto] items-start gap-x-4 py-6 text-left transition-colors"
                            >
                                {isOn && (
                                    <motion.span
                                        layoutId="tension-ledger-bar"
                                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        className="absolute inset-y-4 left-0 w-[2px] rounded-full"
                                        style={{ backgroundColor: accentColor }}
                                    />
                                )}
                                <span
                                    className="pl-3 pt-1 font-mono text-[11px] tabular-nums tracking-[0.2em] transition-colors"
                                    style={{ color: isOn ? accentColor : 'var(--color-text-mute)' }}
                                >
                                    0{i + 1}
                                </span>
                                <div className="min-w-0 pr-2">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        {Icon && (
                                            <Icon
                                                className="h-4 w-4 shrink-0 transition-colors"
                                                style={{ color: isOn ? accentColor : 'var(--color-text-mute)' }}
                                                aria-hidden="true"
                                            />
                                        )}
                                        <h3
                                            className={`text-lg font-medium tracking-[-0.01em] transition-colors md:text-xl ${
                                                isOn ? 'text-text-strong' : 'text-text group-hover:text-text-strong'
                                            }`}
                                        >
                                            {item.title}
                                        </h3>
                                    </div>
                                    <p className="mt-2 text-sm font-light leading-relaxed text-text-mute md:text-base">{item.body}</p>
                                </div>
                                {item.metric && (
                                    <span className="hidden shrink-0 rounded-full border border-hairline bg-panel px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-strong sm:inline-block">
                                        {item.metric}
                                    </span>
                                )}
                            </button>
                        </li>
                    );
                })}
            </ol>

            {/* Right kinetic focus telemetry plate synchronized with the selected row */}
            <div className="lg:col-span-5">
                <div className="frame-ticks relative flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-lg border border-hairline bg-panel/60 p-6 md:p-8">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">
                        <span className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
                            Failure mode 0{active + 1} / 0{items.length}
                        </span>
                        {items[active]?.tag && <span>{items[active].tag}</span>}
                    </div>

                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="my-8"
                    >
                        {items[active]?.metric && (
                            <p
                                className="font-display text-4xl font-semibold tracking-[-0.03em] md:text-5xl"
                                style={{ color: accentColor }}
                            >
                                {items[active].metric}
                            </p>
                        )}
                        <p className="mt-3 text-lg font-medium text-text-strong">{items[active]?.title}</p>
                        <p className="mt-2 text-sm font-light leading-relaxed text-text-mute">{items[active]?.body}</p>
                    </motion.div>

                    {/* Stepper dots */}
                    <div className="flex items-center justify-between border-t border-hairline pt-4">
                        <div className="flex items-center gap-2">
                            {items.map((item, i) => (
                                <button
                                    key={item.title}
                                    type="button"
                                    onClick={() => setActive(i)}
                                    aria-label={`Inspect point ${i + 1}`}
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: active === i ? 24 : 8,
                                        backgroundColor: active === i ? accentColor : 'var(--color-hairline-strong)',
                                    }}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setActive((prev) => (prev + 1) % items.length)}
                            data-cursor="step"
                            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute transition-colors hover:text-text-strong"
                        >
                            Next <ChevronRight className="h-3 w-3" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export interface FlowNodeSpec {
    id: string;
    step: string;
    title: string;
    role: string;
    detail: string;
    statePreview: string;
    /** 1-indexed [startLine, endLine] highlighted in the synced code console. */
    highlightLines?: [number, number];
    icon?: LucideIcon;
}

/**
 * Interactive SVG motion-graphic pipeline synchronized with a live state
 * & code console. Click any node, step manually, or let telemetry packets
 * cycle through the graph (with optional cyclic feedback edge).
 */
export function InteractiveFlowDiagram({
    nodes,
    accentColor,
    filename,
    code,
    cyclicLabel,
}: {
    nodes: FlowNodeSpec[];
    accentColor: string;
    filename: string;
    code: string;
    /** If provided, draws a cyclic return arc from the final node back to node 2 (or 1). */
    cyclicLabel?: string;
}) {
    const reduced = usePrefersReducedMotion();
    const [active, setActive] = useState(0);
    const [playing, setPlaying] = useState(!reduced);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!playing || reduced) return;
        const id = window.setInterval(() => {
            setActive((prev) => (prev + 1) % nodes.length);
        }, 3200);
        return () => window.clearInterval(id);
    }, [playing, reduced, nodes.length]);

    const current = nodes[active] ?? nodes[0];
    const codeLines = code.trimEnd().split('\n');

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            /* clipboard unavailable */
        }
    };

    // Normalized node X positions across an 800x190 SVG coordinate space
    const count = nodes.length;
    const nodeCoords = nodes.map((_, i) => {
        const pad = 92;
        const span = 800 - pad * 2;
        const x = count === 1 ? 400 : pad + (i / (count - 1)) * span;
        return { x, y: cyclicLabel ? 86 : 105 };
    });

    return (
        <div className="mt-12 space-y-6">
            {/* Motion-graphic SVG topology bar */}
            <div className="frame-ticks relative overflow-hidden rounded-lg border border-hairline bg-panel/60 p-5 md:p-7">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${playing && !reduced ? 'animate-pulse' : ''}`}
                            style={{ backgroundColor: accentColor }}
                            aria-hidden="true"
                        />
                        <span>Live Graph Topology · Click any node</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setPlaying((p) => !p)}
                            data-cursor="step"
                            className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute transition-colors hover:border-hairline-strong hover:text-text-strong"
                        >
                            {playing && !reduced ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                            {playing && !reduced ? 'Pause' : 'Play'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setPlaying(false);
                                setActive((prev) => (prev + 1) % nodes.length);
                            }}
                            data-cursor="step"
                            className="inline-flex items-center gap-1 rounded-full border border-hairline px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute transition-colors hover:border-hairline-strong hover:text-text-strong"
                        >
                            Step <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                {/* Desktop & tablet interactive SVG signal graph */}
                <div className="hidden sm:block">
                    <svg viewBox="0 0 800 190" className="h-auto w-full overflow-visible" role="img" aria-label="Interactive agent pipeline graph">
                        {/* Connecting forward edges with animated traveling telemetry packets */}
                        {nodeCoords.slice(0, -1).map((from, i) => {
                            const to = nodeCoords[i + 1];
                            const pathD = `M ${from.x + 68} ${from.y} L ${to.x - 68} ${to.y}`;
                            const isHot = active === i || active === i + 1;
                            return (
                                <g key={`edge-${i}`}>
                                    <path
                                        d={pathD}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeOpacity={isHot ? 0.35 : 0.14}
                                        strokeWidth="1.5"
                                    />
                                    {isHot && (
                                        <motion.path
                                            d={pathD}
                                            fill="none"
                                            stroke={accentColor}
                                            strokeWidth="2"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.65, ease: EASE }}
                                        />
                                    )}
                                    {!reduced && (
                                        <motion.circle
                                            r="3.2"
                                            fill={accentColor}
                                            initial={{ cx: from.x + 68, cy: from.y, opacity: 0 }}
                                            animate={{
                                                cx: [from.x + 68, to.x - 68],
                                                cy: [from.y, to.y],
                                                opacity: [0, 1, 1, 0],
                                            }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 1.8,
                                                delay: i * 0.45,
                                                ease: 'easeInOut',
                                            }}
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Optional cyclic feedback arc */}
                        {cyclicLabel && nodeCoords.length >= 2 && (
                            <g>
                                {(() => {
                                    const start = nodeCoords[nodeCoords.length - 1];
                                    const back = nodeCoords[Math.min(1, nodeCoords.length - 2)];
                                    const d = `M ${start.x} ${start.y + 30} C ${start.x} 166, ${back.x} 166, ${back.x} ${back.y + 30}`;
                                    return (
                                        <>
                                            <path
                                                d={d}
                                                fill="none"
                                                stroke={accentColor}
                                                strokeOpacity="0.4"
                                                strokeWidth="1.25"
                                                strokeDasharray="4 4"
                                            />
                                            <text
                                                x={(start.x + back.x) / 2}
                                                y="174"
                                                textAnchor="middle"
                                                fill="currentColor"
                                                fillOpacity="0.58"
                                                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                                            >
                                                ↺ {cyclicLabel}
                                            </text>
                                        </>
                                    );
                                })()}
                            </g>
                        )}

                        {/* Interactive clickable nodes */}
                        {nodes.map((node, i) => {
                            const { x, y } = nodeCoords[i];
                            const isOn = active === i;
                            return (
                                <g
                                    key={node.id}
                                    onClick={() => {
                                        setPlaying(false);
                                        setActive(i);
                                    }}
                                    className="cursor-pointer"
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Inspect stage ${node.step}: ${node.title}`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            setPlaying(false);
                                            setActive(i);
                                        }
                                    }}
                                >
                                    {isOn && !reduced && (
                                        <motion.rect
                                            x={x - 74}
                                            y={y - 34}
                                            width="148"
                                            height="68"
                                            rx="12"
                                            fill="none"
                                            stroke={accentColor}
                                            strokeOpacity="0.45"
                                            strokeWidth="1.5"
                                            initial={{ opacity: 0.2, scale: 0.96 }}
                                            animate={{ opacity: [0.25, 0.75, 0.25] }}
                                            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                                        />
                                    )}
                                    <rect
                                        x={x - 68}
                                        y={y - 28}
                                        width="136"
                                        height="56"
                                        rx="9"
                                        fill="var(--color-bg)"
                                        stroke={isOn ? accentColor : 'var(--color-hairline-strong)'}
                                        strokeWidth={isOn ? 1.5 : 1}
                                    />
                                    <text
                                        x={x}
                                        y={y - 7}
                                        textAnchor="middle"
                                        fill={isOn ? accentColor : 'var(--color-text-mute)'}
                                        className="font-mono text-[10px] tracking-[0.22em]"
                                    >
                                        {node.step}
                                    </text>
                                    <text
                                        x={x}
                                        y={y + 12}
                                        textAnchor="middle"
                                        fill="var(--color-text-strong)"
                                        className="font-sans text-[12px] font-medium"
                                    >
                                        {node.title.length > 20 ? `${node.title.slice(0, 19)}…` : node.title}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Compact mobile node pills */}
                <div className="flex flex-wrap gap-2 sm:hidden">
                    {nodes.map((node, i) => (
                        <button
                            key={node.id}
                            type="button"
                            onClick={() => {
                                setPlaying(false);
                                setActive(i);
                            }}
                            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                                active === i
                                    ? 'border-text-strong bg-text-strong text-bg'
                                    : 'border-hairline text-text-mute hover:border-hairline-strong'
                            }`}
                        >
                            {node.step} · {node.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Split Inspector: Left = active stage breakdown + live state payload, Right = synced Code Console */}
            <div className="grid gap-6 lg:grid-cols-12">
                <div className="flex flex-col justify-between rounded-lg border border-hairline bg-panel/50 p-6 lg:col-span-5">
                    <div>
                        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">
                            <span style={{ color: accentColor }}>
                                Stage {current.step} · {current.role}
                            </span>
                            <span className="tabular-nums">
                                {active + 1} / {nodes.length}
                            </span>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25, ease: EASE }}
                            >
                                <h3 className="mt-3 text-2xl font-medium tracking-[-0.015em] text-text-strong">{current.title}</h3>
                                <p className="mt-3 text-sm font-light leading-relaxed text-text-mute">{current.detail}</p>
                                <div className="mt-5 rounded-md border border-hairline bg-bg/80 p-3.5">
                                    <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-text-mute">
                                        Live state packet
                                    </p>
                                    <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-text-strong">
                                        {current.statePreview}
                                    </pre>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Quick node tabs */}
                    <div className="mt-6 flex flex-wrap gap-1.5 border-t border-hairline pt-4">
                        {nodes.map((node, i) => (
                            <button
                                key={node.id}
                                type="button"
                                onClick={() => {
                                    setPlaying(false);
                                    setActive(i);
                                }}
                                data-cursor="step"
                                className={`relative rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                                    active === i ? 'text-text-strong' : 'text-text-mute hover:text-text'
                                }`}
                            >
                                {active === i && (
                                    <motion.span
                                        layoutId={`flow-tab-${filename}`}
                                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        className="absolute inset-0 -z-10 rounded-full border border-hairline-strong bg-bg"
                                    />
                                )}
                                {node.step}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Synced Code Console */}
                <div className="overflow-hidden rounded-lg border border-hairline bg-panel/70 lg:col-span-7">
                    <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
                            <span>{filename}</span>
                        </div>
                        <button
                            type="button"
                            onClick={copyCode}
                            data-cursor="copy"
                            className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-mute transition-colors hover:border-hairline-strong hover:text-text-strong"
                        >
                            {copied ? <Check className="h-3 w-3" style={{ color: accentColor }} /> : <Copy className="h-3 w-3" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
                        {codeLines.map((line, idx) => {
                            const lineNo = idx + 1;
                            const [start, end] = current.highlightLines ?? [-1, -1];
                            const highlighted = lineNo >= start && lineNo <= end;
                            return (
                                <div
                                    key={idx}
                                    className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded px-2 py-0.5 transition-colors duration-300"
                                    style={{
                                        backgroundColor: highlighted ? `${accentColor}16` : 'transparent',
                                    }}
                                >
                                    <span className="select-none text-right text-[10px] tabular-nums text-text-mute/50">{lineNo}</span>
                                    <span className={`whitespace-pre ${highlighted ? 'text-text-strong' : 'text-text-mute'}`}>
                                        {line || ' '}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Corner-ticked console wrapper for every interactive sandbox/demo so all
 * showcases feel unified with Home's `.frame-ticks` 3D theatre stage.
 */
export function DemoStageFrame({
    label,
    accentColor,
    badges,
    children,
}: {
    label: string;
    accentColor: string;
    badges?: string[];
    children: ReactNode;
}) {
    return (
        <div
            data-cursor="play"
            className="frame-ticks relative mt-10 overflow-hidden rounded-lg border border-hairline bg-bg transition-colors hover:border-hairline-strong"
        >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-panel/60 px-4 py-3 md:px-6">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
                    {label}
                </span>
                {badges && badges.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {badges.map((b) => (
                            <span
                                key={b}
                                className="rounded-full border border-hairline px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-text-mute"
                            >
                                {b}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="p-2 sm:p-4 md:p-6">{children}</div>
        </div>
    );
}

/** Token-driven animated metric bar for sidebars and insight blocks. */
export function AnimatedMetricBar({
    label,
    value,
    pct,
    accentColor,
}: {
    label: string;
    value: string;
    pct: number;
    accentColor: string;
}) {
    return (
        <div className="mb-4 last:mb-0">
            <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-light text-text-mute">{label}</span>
                <span className="font-mono tabular-nums text-text-strong">{value}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: Math.max(0, Math.min(1, pct / 100)) }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="h-full origin-left rounded-full"
                    style={{ backgroundColor: accentColor }}
                />
            </div>
        </div>
    );
}
