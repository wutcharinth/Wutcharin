import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { SplitText, RevealOnScroll } from '../lib/motion';

type Metric = {
    label: string;
    value: number;
    max: number;
    unit: string;
    color: string;
    detail: string;
    breakdown: { name: string; pct: number }[];
};

const metrics: Metric[] = [
    {
        label: 'Years of experience',
        value: 20,
        max: 25,
        unit: 'yrs',
        color: '#a78bfa',
        detail: 'Nearly two decades across aviation, travel tech, and media — 10+ years leading people.',
        breakdown: [
            { name: 'Aviation', pct: 30 },
            { name: 'Travel Tech', pct: 50 },
            { name: 'Media', pct: 10 },
            { name: 'Other', pct: 10 },
        ],
    },
    {
        label: 'Data professionals led',
        value: 50,
        max: 60,
        unit: 'people',
        color: '#22d3ee',
        detail: 'Managed business analysts, data analytics specialists, and PMOs across multiple business units.',
        breakdown: [
            { name: 'Business Analysts', pct: 38 },
            { name: 'Data Analytics', pct: 30 },
            { name: 'Specialists', pct: 20 },
            { name: 'PMOs', pct: 12 },
        ],
    },
    {
        label: 'AI agents shipped',
        value: 20,
        max: 25,
        unit: 'agents',
        color: '#e879f9',
        detail: 'Autonomous workflows across audit, finance, sales, and operations.',
        breakdown: [
            { name: 'Audit / Risk', pct: 30 },
            { name: 'Finance', pct: 30 },
            { name: 'Ops', pct: 25 },
            { name: 'Sales', pct: 15 },
        ],
    },
    {
        label: 'Hours saved annually',
        value: 12000,
        max: 15000,
        unit: 'hrs',
        color: '#fb923c',
        detail: 'Measured, compounding time savings from deployed automation + ML models.',
        breakdown: [
            { name: 'Collections ML', pct: 40 },
            { name: 'RPA', pct: 28 },
            { name: 'AI Agents', pct: 22 },
            { name: 'Dashboards', pct: 10 },
        ],
    },
    {
        label: 'Claude Skills authored',
        value: 20,
        max: 25,
        unit: 'skills',
        color: '#34d399',
        detail: 'Reusable skills adopted across the team — compressing the full SOP lifecycle from research to release.',
        breakdown: [
            { name: 'Research & refine', pct: 20 },
            { name: 'Plan & break down', pct: 20 },
            { name: 'Deep-dive analysis', pct: 25 },
            { name: 'Corporate data access', pct: 20 },
            { name: 'DevOps lift', pct: 15 },
        ],
    },
];

function formatValue(n: number, unit: string) {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k ${unit}`;
    return `${n} ${unit}`;
}

function AnimatedBar({
    metric,
    index,
    active,
    onHover,
    onLeave,
    someActive,
}: {
    metric: Metric;
    index: number;
    active: boolean;
    onHover: () => void;
    onLeave: () => void;
    someActive: boolean;
}) {
    const rowRef = useRef<HTMLDivElement>(null);
    const inView = useInView(rowRef, { once: true, margin: '-80px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const start = performance.now();
        const duration = 1500 + index * 120;
        let raf = 0;
        const tick = (t: number) => {
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setCount(Math.round(metric.value * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, metric.value, index]);

    const pct = (metric.value / metric.max) * 100;
    const dim = someActive && !active;

    return (
        <div
            ref={rowRef}
            className={`group relative transition-opacity duration-300 ${dim ? 'opacity-30' : 'opacity-100'}`}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            <div className="flex items-baseline justify-between mb-2 gap-4">
                <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] text-white/30 tracking-widest">0{index + 1}</span>
                    <span className="text-sm md:text-base text-white/80 font-light tracking-wide">
                        {metric.label}
                    </span>
                </div>
                <div className="flex items-baseline gap-2 tabular-nums">
                    <span className="text-2xl md:text-3xl font-medium text-white tracking-tight">
                        {count >= 1000 ? `${(count / 1000).toFixed(0)}k+` : `${count}+`}
                    </span>
                    <span className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-widest">
                        {metric.unit}
                    </span>
                </div>
            </div>

            {/* Track */}
            <div className="relative h-[3px] w-full bg-white/[0.06] rounded-full overflow-visible">
                {/* Tick marks */}
                <div className="absolute inset-0 flex justify-between opacity-30" aria-hidden="true">
                    {Array.from({ length: 11 }).map((_, i) => (
                        <span key={i} className="h-full w-px bg-white/20" />
                    ))}
                </div>
                {/* Animated fill */}
                <motion.div
                    initial={{ width: '0%' }}
                    animate={inView ? { width: `${pct}%` } : { width: '0%' }}
                    transition={{ duration: 1.4 + index * 0.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 * index }}
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${metric.color}90, ${metric.color})`,
                        boxShadow: active ? `0 0 24px ${metric.color}80, 0 0 2px ${metric.color}` : `0 0 8px ${metric.color}30`,
                    }}
                />
                {/* Leading dot */}
                <motion.div
                    initial={{ left: '0%', scale: 0 }}
                    animate={inView ? { left: `${pct}%`, scale: 1 } : {}}
                    transition={{ duration: 1.4 + index * 0.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 * index }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full ring-4"
                    style={{
                        backgroundColor: metric.color,
                        // @ts-expect-error — custom CSS variable
                        '--tw-ring-color': `${metric.color}30`,
                    }}
                />
            </div>

            {/* Expanded breakdown on hover */}
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4">
                            <p className="text-xs md:text-sm text-white/50 font-light leading-relaxed mb-3 max-w-2xl">
                                {metric.detail}
                            </p>
                            {/* Stacked breakdown bar */}
                            <div className="flex items-center gap-0.5 h-1.5 w-full rounded-full overflow-hidden mb-2">
                                {metric.breakdown.map((b, i) => (
                                    <motion.span
                                        key={b.name}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${b.pct}%` }}
                                        transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full"
                                        style={{ backgroundColor: metric.color, opacity: 0.3 + 0.7 * ((metric.breakdown.length - i) / metric.breakdown.length) }}
                                    />
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-widest text-white/50">
                                {metric.breakdown.map((b) => (
                                    <span key={b.name} className="inline-flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: metric.color, opacity: 0.7 }} />
                                        {b.name} · {b.pct}%
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Unused var quiet */}
            <span className="hidden">{formatValue(count, metric.unit)}</span>
        </div>
    );
}

export default function ExecutiveProfile() {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);

    return (
        <section id="about" className="relative py-32 px-4 overflow-hidden">
            <div className="pointer-events-none absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-violet-600/8 blur-[140px]" aria-hidden="true" />

            <div className="relative max-w-5xl mx-auto">
                {/* Section label */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02]"
                >
                    <span className="h-1 w-1 rounded-full bg-violet-400" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">01 · Profile</span>
                </motion.div>

                <SplitText
                    as="h2"
                    mode="words"
                    stagger={0.05}
                    className="text-4xl md:text-6xl font-medium tracking-[-0.03em] text-white leading-[0.95] max-w-3xl mb-8"
                >
                    Executive leader at the intersection of strategy and code.
                </SplitText>

                <RevealOnScroll staggerChildren={0.1} duration={0.8}>
                    <p data-reveal-child className="max-w-2xl text-base md:text-lg text-white/50 font-light leading-relaxed mb-6">
                        Twenty years translating complex data into C-suite strategy — a hands-on builder scaling AI, automation, and analytics functions across hyper-growth tech (Agoda) and aviation.
                    </p>
                    <p data-reveal-child className="max-w-2xl text-base md:text-lg text-white/50 font-light leading-relaxed mb-24">
                        Not just agents — the <span className="text-white/70">systems around them</span>: orchestration, memory, tool surfaces, guardrails, and evaluation that make multi-step agentic workflows reliable in production, not just in the demo.
                    </p>
                </RevealOnScroll>

                {/* Impact infographic */}
                <div
                    className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-transparent backdrop-blur-sm p-6 md:p-10"
                    onMouseLeave={() => setActiveIdx(null)}
                >
                    <div className="flex items-baseline justify-between mb-8 flex-wrap gap-4">
                        <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-white/40">
                            Measured Impact
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-white/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-white/30 animate-pulse" />
                            Hover a row to explore
                        </div>
                    </div>

                    <div className="space-y-7 md:space-y-8">
                        {metrics.map((m, i) => (
                            <AnimatedBar
                                key={m.label}
                                metric={m}
                                index={i}
                                active={activeIdx === i}
                                someActive={activeIdx !== null}
                                onHover={() => setActiveIdx(i)}
                                onLeave={() => { /* handled by container */ }}
                            />
                        ))}
                    </div>
                </div>

                {/* Quote */}
                <RevealOnScroll staggerChildren={0.08} className="mt-24 max-w-3xl">
                    <div data-reveal-child className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet-300/70 mb-4">
                        — Operating principle
                    </div>
                    <p data-reveal-child className="text-2xl md:text-4xl font-light text-white/90 tracking-[-0.01em] leading-[1.2]">
                        "Exceptions deserve people.<br />Patterns deserve code."
                    </p>
                </RevealOnScroll>
            </div>
        </section>
    );
}
