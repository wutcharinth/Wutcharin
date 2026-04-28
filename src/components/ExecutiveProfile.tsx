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
        detail: 'Nearly two decades across aviation, travel tech, and media. Ten of those years leading people.',
        breakdown: [
            { name: 'Travel Tech', pct: 50 },
            { name: 'Aviation', pct: 30 },
            { name: 'Media', pct: 10 },
            { name: 'Other', pct: 10 },
        ],
    },
    {
        label: 'Data professionals led',
        value: 50,
        max: 60,
        unit: 'people',
        color: '#a78bfa',
        detail: 'Business analysts, data analytics specialists, and PMOs across multiple business units.',
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
        color: '#a78bfa',
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
        color: '#a78bfa',
        detail: 'Measured, compounding time savings from deployed automation and ML models.',
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
        color: '#a78bfa',
        detail: 'Reusable skills adopted across the team, compressing the SOP lifecycle from research to release.',
        breakdown: [
            { name: 'Research & refine', pct: 20 },
            { name: 'Plan & break down', pct: 20 },
            { name: 'Deep-dive analysis', pct: 25 },
            { name: 'Corporate data access', pct: 20 },
            { name: 'DevOps lift', pct: 15 },
        ],
    },
];

function formatBig(n: number) {
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k+`;
    return `${n}+`;
}

/**
 * Hero metric — the one row that gets full display weight.
 * Number is huge, breakdown is inline prose, no bar at rest.
 */
function HeroMetric({ metric }: { metric: Metric }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(metric.value);
            return;
        }
        const start = performance.now();
        const duration = 1800;
        let raf = 0;
        const tick = (t: number) => {
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            setCount(Math.round(metric.value * eased));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, metric.value]);

    return (
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-6 items-baseline">
            <div className="lg:col-span-7">
                <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-mono text-[10px] text-white/30 tracking-[0.28em] uppercase">01</span>
                    <span className="font-mono text-[10px] text-violet-300/70 tracking-[0.28em] uppercase">{metric.unit}</span>
                </div>
                <div className="font-medium tracking-[-0.05em] leading-[0.85] text-white tabular-nums text-[clamp(5rem,12vw,11rem)]">
                    {count >= 1000 ? `${(count / 1000).toFixed(0)}k+` : `${count}+`}
                </div>
                <p className="mt-4 max-w-md text-base md:text-lg text-white/60 font-light leading-relaxed">
                    {metric.label.toLowerCase()}.
                </p>
            </div>
            <div className="lg:col-span-5 lg:pt-12 space-y-3">
                <p className="text-sm md:text-base text-white/50 font-light leading-relaxed max-w-md">
                    {metric.detail}
                </p>
                <ul className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 space-y-1.5">
                    {metric.breakdown.map((b) => (
                        <li key={b.name} className="flex items-center justify-between gap-4 max-w-xs">
                            <span>{b.name}</span>
                            <span className="text-violet-300/70 tabular-nums">{b.pct}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

/**
 * Compact metric — secondary rows. Typographic-first, optional hover detail.
 * No always-on bar, no per-metric color.
 */
function CompactMetric({
    metric,
    index,
    active,
    onHover,
}: {
    metric: Metric;
    index: number;
    active: boolean;
    onHover: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(metric.value);
            return;
        }
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

    return (
        <div
            ref={ref}
            className="group relative py-5 border-t border-white/[0.06] hover:border-white/15 transition-colors cursor-default"
            onMouseEnter={onHover}
        >
            <div className="grid grid-cols-12 gap-4 items-baseline">
                <span className="col-span-1 font-mono text-[10px] text-white/25 tracking-[0.28em] tabular-nums">
                    0{index + 2}
                </span>
                <div className="col-span-7 sm:col-span-8">
                    <p className="text-base md:text-xl text-white/85 font-light tracking-tight leading-snug">
                        <span className="font-medium text-white tabular-nums">{formatBig(count)}</span>
                        <span className="text-white/50"> {metric.label.toLowerCase()}</span>
                    </p>
                </div>
                <span className="col-span-4 sm:col-span-3 text-right font-mono text-[10px] text-white/35 tracking-[0.28em] uppercase">
                    {metric.unit}
                </span>
            </div>

            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 pl-[8.33%] grid grid-cols-12 gap-4">
                            <p className="col-span-12 sm:col-span-8 text-sm text-white/55 font-light leading-relaxed max-w-xl">
                                {metric.detail}
                            </p>
                            <ul className="col-span-12 sm:col-span-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 space-y-1">
                                {metric.breakdown.slice(0, 4).map((b) => (
                                    <li key={b.name} className="flex items-center justify-between gap-3">
                                        <span>{b.name}</span>
                                        <span className="text-violet-300/70 tabular-nums">{b.pct}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ExecutiveProfile() {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const heroMetric = metrics[3];
    const secondaryMetrics = metrics.filter((_, i) => i !== 3);

    return (
        <section id="about" className="relative py-32 px-4 overflow-hidden">
            <div className="pointer-events-none absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-violet-600/[0.08] blur-[140px]" aria-hidden="true" />

            <div className="relative max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full border border-white/10"
                >
                    <span className="h-1 w-1 rounded-full bg-violet-400" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-white/50">01 · Profile</span>
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
                        Twenty years translating complex data into C-suite strategy: a hands-on builder scaling AI, automation, and analytics functions across hyper-growth tech (Agoda) and aviation.
                    </p>
                    <p data-reveal-child className="max-w-2xl text-base md:text-lg text-white/50 font-light leading-relaxed mb-24">
                        Not just agents, but the <span className="text-white/70">systems around them</span>: orchestration, memory, tool surfaces, guardrails, and evaluation that make multi-step agentic workflows reliable in production, not just in the demo.
                    </p>
                </RevealOnScroll>

                <div className="mb-12 flex items-baseline justify-between flex-wrap gap-4">
                    <h3 className="text-xs font-mono uppercase tracking-[0.28em] text-white/40">
                        Measured Impact
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.28em] text-white/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                        Hover a row for detail
                    </div>
                </div>

                <HeroMetric metric={heroMetric} />

                <div
                    className="mt-16 border-b border-white/[0.06]"
                    onMouseLeave={() => setActiveIdx(null)}
                >
                    {secondaryMetrics.map((m, i) => (
                        <CompactMetric
                            key={m.label}
                            metric={m}
                            index={i}
                            active={activeIdx === i}
                            onHover={() => setActiveIdx(i)}
                        />
                    ))}
                </div>

                <RevealOnScroll staggerChildren={0.08} className="mt-24 max-w-3xl">
                    <div data-reveal-child className="font-mono text-[10px] uppercase tracking-[0.28em] text-violet-300/70 mb-4">
                        Operating principle
                    </div>
                    <p data-reveal-child className="text-2xl md:text-4xl font-light text-white/90 tracking-[-0.01em] leading-[1.2]">
                        "Exceptions deserve people.<br />Patterns deserve code."
                    </p>
                </RevealOnScroll>
            </div>
        </section>
    );
}
