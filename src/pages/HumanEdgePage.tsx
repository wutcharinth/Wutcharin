import { useState } from 'react';
import {
    Brain,
    Zap,
    Heart,
    RefreshCw,
    Trash2,
    Sparkles,
    Palette,
    ShieldAlert,
    Globe,
    CheckCircle2,
    ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import { AnimatedMetricBar, SectionHeader } from '../components/shared/ShowcaseBlocks';
import SEO from '../components/SEO';

const ACCENT = '#06b6d4';
const EASE = [0.16, 1, 0.3, 1] as const;

const SECTIONS = [
    { id: 'atrophy', label: 'Gym Model' },
    { id: 'perspectives', label: 'Taste & Truth' },
    { id: 'innovation', label: '1% Rule' },
    { id: 'ecosystem', label: 'Ecosystem' },
    { id: 'checklist', label: 'Checklist' },
];

// Deterministic human-perspective cloud (no Math.random inside render)
const DOTS_DATA = Array.from({ length: 420 }, (_, i) => {
    const s1 = Math.sin(i * 12.9898) * 43758.5453;
    const s2 = Math.sin(i * 78.233) * 19341.123;
    const s3 = Math.sin(i * 39.425) * 28411.771;
    const r1 = s1 - Math.floor(s1);
    const r2 = s2 - Math.floor(s2);
    const r3 = s3 - Math.floor(s3);
    return {
        id: i,
        hue: Math.round(r1 * 360),
        x: (r2 - 0.5) * 22,
        y: (r3 - 0.5) * 22,
        opacity: 0.45 + r1 * 0.5,
    };
});

/** 1. Mental Fitness Simulator ("Driving a car to the gym") */
function MentalFitnessSim() {
    const [aiReliance, setAiReliance] = useState(50);
    const outputSpeed = Math.min(100, Math.round(20 + aiReliance * 0.8));
    const mentalGrowth = Math.max(0, Math.round(100 - aiReliance * 1.2));
    const longTermCapability = Math.round(mentalGrowth * 0.7 + outputSpeed * 0.1);

    return (
        <div className="frame-ticks mt-10 rounded-lg border border-hairline bg-panel/60 p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">
                    <Brain className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
                    Interactive Model · The Gym Analogy
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-strong">
                    AI Assistance: {aiReliance}%
                </span>
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-12">
                <div className="space-y-5 lg:col-span-5">
                    <p className="text-base font-light leading-relaxed text-text">
                        Po-Shen Loh argues that using AI to skip hard thinking is like{' '}
                        <span className="font-medium text-text-strong">driving a car to the gym</span>: you arrive faster while the cognitive
                        muscle you came to build quietly atrophies.
                    </p>
                    <div className="rounded-md border border-hairline bg-bg/80 p-5">
                        <div className="mb-3 flex justify-between font-mono text-[11px] uppercase tracking-[0.18em]">
                            <span className="text-text-mute">AI Reliance</span>
                            <span className="tabular-nums text-text-strong">{aiReliance}%</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={aiReliance}
                            onChange={(e) => setAiReliance(Number(e.target.value))}
                            aria-label="AI assistance level"
                            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-hairline-strong accent-cyan-500"
                        />
                        <div className="mt-2.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-text-mute">
                            <span>Thinking alone</span>
                            <span>Full offload</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
                    <div className="rounded-md border border-hairline bg-bg/70 p-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">Short-term speed</p>
                        <p className="mt-3 font-display text-4xl font-semibold tabular-nums text-emerald-400">{outputSpeed}%</p>
                        <div className="mt-4">
                            <AnimatedMetricBar label="Delivery pace" value={`${outputSpeed}%`} pct={outputSpeed} accentColor="#10b981" />
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-md border border-hairline bg-bg/70 p-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">Mental fitness</p>
                        <p
                            className={`mt-3 font-display text-4xl font-semibold tabular-nums ${
                                mentalGrowth < 30 ? 'text-rose-400' : 'text-text-strong'
                            }`}
                        >
                            {mentalGrowth}%
                        </p>
                        <div className="mt-4">
                            <AnimatedMetricBar
                                label="Reasoning gain"
                                value={`${mentalGrowth}%`}
                                pct={mentalGrowth}
                                accentColor={mentalGrowth < 30 ? '#f43f5e' : ACCENT}
                            />
                        </div>
                        {mentalGrowth < 30 && (
                            <span className="mt-2 inline-block rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-rose-400">
                                Atrophy warning
                            </span>
                        )}
                    </div>

                    <div className="rounded-md border border-hairline bg-bg/70 p-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">Long-term value</p>
                        <p className="mt-3 font-display text-4xl font-semibold tabular-nums" style={{ color: ACCENT }}>
                            {longTermCapability}%
                        </p>
                        <div className="mt-4">
                            <AnimatedMetricBar label="Career edge" value={`${longTermCapability}%`} pct={longTermCapability} accentColor={ACCENT} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** 2. Perspectives Visualizer: 3-Model Bottleneck vs 7.5B Human Cloud */
function PerspectivesViz() {
    const [view, setView] = useState<'ai' | 'human'>('ai');

    return (
        <div className="frame-ticks mt-10 rounded-lg border border-hairline bg-panel/60 p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-5">
                    <div className="inline-flex w-full rounded-full border border-hairline bg-bg p-1">
                        {(['ai', 'human'] as const).map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setView(mode)}
                                data-cursor="step"
                                className={`relative flex-1 rounded-full py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                    view === mode ? 'text-bg' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {view === mode && (
                                    <motion.span
                                        layoutId="human-perspective-pill"
                                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        className="absolute inset-0 -z-10 rounded-full bg-text-strong"
                                    />
                                )}
                                {mode === 'ai' ? 'AI Bottleneck' : 'Human Cloud'}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="rounded-md border border-hairline bg-bg/70 p-6"
                        >
                            <h3 className="flex items-center gap-2 text-lg font-medium text-text-strong">
                                {view === 'ai' ? (
                                    <Zap className="h-4 w-4 text-amber-400" aria-hidden="true" />
                                ) : (
                                    <Globe className="h-4 w-4" style={{ color: ACCENT }} aria-hidden="true" />
                                )}
                                {view === 'ai' ? 'The 3-Model Bottleneck' : '7.5 Billion Starting Points'}
                            </h3>
                            <p className="mt-3 text-sm font-light leading-relaxed text-text-mute">
                                {view === 'ai'
                                    ? 'When billions of people ask the same three foundation models how to think, write, and decide, shared biases homogenize culture and shrink the menu of human taste.'
                                    : 'Messy, independent human minds look inefficient on paper, yet that diversity forms a resilient distributed network of taste, empathy, and truth no single model can clone.'}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-md border border-hairline bg-bg p-6 lg:col-span-7">
                    {view === 'ai' ? (
                        <motion.div
                            key="ai-grid"
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="text-center"
                        >
                            <div className="mb-8 flex flex-wrap justify-center gap-5">
                                {['Model A', 'Model B', 'Model C'].map((label, idx) => (
                                    <div
                                        key={label}
                                        className="flex h-24 w-24 flex-col items-center justify-center rounded-full border border-hairline-strong bg-panel font-mono text-xs text-text-strong"
                                    >
                                        <span className="text-[10px] text-text-mute">0{idx + 1}</span>
                                        <span className="mt-1">{label}</span>
                                    </div>
                                ))}
                            </div>
                            <span className="inline-block rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-rose-400">
                                Global menu of thought: &lt; 10 dominant voices
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="human-cloud"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.45 }}
                            className="relative flex h-full w-full items-center justify-center"
                        >
                            <div className="flex flex-wrap items-center justify-center gap-1.5 p-2">
                                {DOTS_DATA.map((dot) => (
                                    <span
                                        key={dot.id}
                                        className="h-1.5 w-1.5 rounded-full transition-transform duration-300 hover:scale-[3]"
                                        style={{
                                            backgroundColor: `hsl(${dot.hue}, 78%, 62%)`,
                                            opacity: dot.opacity,
                                            transform: `translate(${dot.x * 0.25}px, ${dot.y * 0.25}px)`,
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="pointer-events-none absolute bottom-3 rounded-full border border-hairline-strong bg-bg/90 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-strong backdrop-blur-sm">
                                7.5B Distributed Perspectives
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

/** 3. The 1% Rule: Generate & Destroy Simulator */
function InnovationGame() {
    const [ideas, setIdeas] = useState<Array<{ id: number; type: 'bad' | 'good'; status: 'new' | 'destroyed' | 'diamond' }>>([]);
    const [generated, setGenerated] = useState(0);

    const generateIdeas = () => {
        const seed = Date.now();
        const batch = Array.from({ length: 20 }, (_, i) => ({
            id: seed + i,
            type: (Math.random() > 0.88 ? 'good' : 'bad') as 'good' | 'bad',
            status: 'new' as const,
        }));
        setIdeas((prev) => [...prev.slice(-80), ...batch]);
        setGenerated((g) => g + 20);
    };

    const destroyIdeas = () => {
        setIdeas((prev) =>
            prev.map((idea) =>
                idea.status !== 'new' ? idea : { ...idea, status: idea.type === 'good' ? 'diamond' : 'destroyed' },
            ),
        );
    };

    const hasNew = ideas.some((i) => i.status === 'new');
    const diamonds = ideas.filter((i) => i.status === 'diamond').length;

    return (
        <div className="frame-ticks mt-10 rounded-lg border border-hairline bg-panel/60 p-6 md:p-8">
            <div className="flex flex-col justify-between gap-6 border-b border-hairline pb-6 md:flex-row md:items-center">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">Interactive Simulator · Generate &amp; Destroy</p>
                    <p className="mt-2 max-w-xl text-sm font-light leading-relaxed text-text">
                        Most builders fall in love with their first idea. Assume 90% are flawed: generate rapidly, stress-test ruthlessly, keep what
                        survives.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <button
                        type="button"
                        onClick={generateIdeas}
                        data-cursor="play"
                        className="inline-flex items-center gap-2 rounded-full bg-text-strong px-5 py-2.5 text-xs font-medium text-bg transition-colors hover:bg-signal"
                    >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        Generate 20 ideas
                    </button>
                    <button
                        type="button"
                        onClick={destroyIdeas}
                        disabled={!hasNew}
                        data-cursor="step"
                        className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-2.5 text-xs font-medium text-text-strong transition-colors hover:bg-panel disabled:opacity-40"
                    >
                        <Trash2 className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
                        Stress-test &amp; filter
                    </button>
                </div>
            </div>

            <div className="mt-6 flex min-h-[180px] flex-wrap content-start gap-2 rounded-md border border-hairline bg-bg/80 p-5">
                {ideas.length === 0 ? (
                    <div className="flex w-full flex-col items-center justify-center py-10 text-center text-text-mute">
                        <RefreshCw className="mb-3 h-7 w-7 opacity-40" aria-hidden="true" />
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em]">Click Generate 20 ideas to start</p>
                    </div>
                ) : (
                    ideas.map((idea) => (
                        <motion.span
                            key={idea.id}
                            layout
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{
                                scale: idea.status === 'diamond' ? 1.15 : idea.status === 'destroyed' ? 0.72 : 1,
                                opacity: idea.status === 'destroyed' ? 0.25 : 1,
                            }}
                            transition={{ duration: 0.35 }}
                            className={`flex h-9 w-9 items-center justify-center rounded-md border font-mono text-xs ${
                                idea.status === 'diamond'
                                    ? 'border-cyan-400 bg-cyan-500/20 font-semibold text-text-strong'
                                    : idea.status === 'destroyed'
                                      ? 'border-dashed border-hairline text-text-mute'
                                      : 'border-hairline-strong bg-panel text-text-mute'
                            }`}
                        >
                            {idea.status === 'diamond' ? '◆' : idea.status === 'destroyed' ? '×' : '?'}
                        </motion.span>
                    ))
                )}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mute">
                <span>
                    Generated: <b className="tabular-nums text-text-strong">{generated}</b>
                </span>
                <span>
                    Surviving diamonds:{' '}
                    <b className="tabular-nums text-lg" style={{ color: ACCENT }}>
                        {diamonds}
                    </b>
                </span>
            </div>
        </div>
    );
}

/** 4. Circular Win-Win Ecosystem Explorer */
const ECO_NODES = [
    {
        id: 'math',
        title: 'High School Math Stars',
        role: 'The Talent',
        benefit: 'Develop real-world empathy, stage presence, and leadership skills schools rarely teach.',
    },
    {
        id: 'actors',
        title: 'Professional Actors',
        role: 'The Coaches',
        benefit: 'Earn dependable creative income coaching charisma, storytelling, and audience connection.',
    },
    {
        id: 'students',
        title: 'Middle Schoolers',
        role: 'The Learners',
        benefit: 'Experience live, high-energy mathematical problem solving that builds genuine curiosity.',
    },
] as const;

function EcosystemViz() {
    const [active, setActive] = useState(0);

    return (
        <div className="frame-ticks mt-10 rounded-lg border border-hairline bg-panel/60 p-6 md:p-8">
            <div className="grid items-center gap-8 lg:grid-cols-12">
                <div className="space-y-3 lg:col-span-5">
                    {ECO_NODES.map((n, idx) => (
                        <button
                            key={n.id}
                            type="button"
                            onClick={() => setActive(idx)}
                            onMouseEnter={() => setActive(idx)}
                            data-cursor="step"
                            className={`flex w-full items-center justify-between rounded-md border p-4 text-left transition-colors ${
                                active === idx ? 'border-hairline-strong bg-bg' : 'border-hairline bg-bg/40 hover:border-hairline-strong'
                            }`}
                        >
                            <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: active === idx ? ACCENT : undefined }}>
                                    0{idx + 1} · {n.role}
                                </p>
                                <p className="mt-1 text-base font-medium text-text-strong">{n.title}</p>
                            </div>
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: active === idx ? ACCENT : 'var(--color-hairline-strong)' }}
                                aria-hidden="true"
                            />
                        </button>
                    ))}
                </div>

                <div className="rounded-md border border-hairline bg-bg/80 p-6 md:p-8 lg:col-span-7">
                    <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-text-mute">Circular value gained</p>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="mt-4"
                        >
                            <h3 className="text-2xl font-medium text-text-strong">{ECO_NODES[active].title}</h3>
                            <p className="mt-3 text-base font-light leading-relaxed text-text-mute">{ECO_NODES[active].benefit}</p>
                        </motion.div>
                    </AnimatePresence>
                    <p className="mt-6 border-t border-hairline pt-4 text-xs font-light text-text-mute">
                        Social entrepreneurship compounds when every participant gains something AI cannot automate: trust, craft, and delight.
                    </p>
                </div>
            </div>
        </div>
    );
}

const CHECKLIST = [
    'Outsourcing hard thinking destroys cognitive fitness even while boosting short-term speed.',
    'Logic and Olympiad math are no longer exclusively human; frontier models already solve IMO problems.',
    'The Theft of Taste: frictionless AI defaults quietly flatten personal style and voice.',
    'The Theft of Truth: routing billions of people through three models centralizes blind spots.',
    'Status anxiety grows when success is framed as outperforming others instead of serving them.',
    'The durable edge is simulating the world through another person’s eyes: empathy as applied logic.',
    'Resilient teams combine technical sharpness with genuine care for the people they build for.',
];

const HumanEdgePage = () => {
    return (
        <SubPageShell statusLabel="Lecture Synthesis" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="The Human Edge: Thoughtfulness & Mental Fitness in the AI Era"
                description="Interactive visual synthesis of Prof. Po-Shen Loh's lecture on cognitive fitness, the theft of taste and truth, Generate & Destroy, and empathy in the AI era."
                url="https://wutcharin.com/human-edge"
            />
            <SubPageHero
                badgeLabel="Philosophy · Po-Shen Loh"
                BadgeIcon={Heart}
                titleLead="The Human"
                titleAccent="Edge."
                accentColor={ACCENT}
                description={
                    <>
                        When AI solves Olympiad math and drafts fluent prose on demand, what stays irreplaceable?{' '}
                        <span className="font-normal text-text-strong">Mental fitness, personal taste, and genuine thoughtfulness.</span>
                    </>
                }
                primaryCta={{ label: 'Explore models', href: '#atrophy', icon: Brain }}
                secondaryCta={{
                    label: 'Watch lecture',
                    href: 'https://www.youtube.com/watch?v=xWYb7tImErI',
                    icon: ExternalLink,
                    external: true,
                }}
            />

            {/* 01 · The Trap of Convenience */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="atrophy"
                    index="01"
                    eyebrow="Cognitive fitness"
                    title="The trap of"
                    accent="convenience."
                    accentColor={ACCENT}
                    lead="The immediate risk of AI is not science fiction; it is quiet atrophy. Move the slider to see how full offloading trades long-term judgment for short-term speed."
                />
                <MentalFitnessSim />
            </section>

            {/* 02 · The Two Thefts: Taste & Truth */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="perspectives"
                    index="02"
                    eyebrow="Taste & truth"
                    title="Two silent thefts:"
                    accent="homogenized culture."
                    accentColor={ACCENT}
                    lead="Beyond mental fitness, over-delegating creative voice and fact verification compresses 7.5 billion perspectives into a narrow set of default model weights."
                />

                <div className="mt-10 grid gap-5 md:grid-cols-2">
                    <div className="rounded-lg border border-hairline bg-panel/50 p-6 md:p-7">
                        <div className="mb-3 flex items-center gap-2.5 text-text-strong">
                            <Palette className="h-4 w-4 text-rose-400" aria-hidden="true" />
                            <h3 className="text-lg font-medium">Theft 01: Taste</h3>
                        </div>
                        <p className="text-sm font-light leading-relaxed text-text-mute">
                            When an algorithm picks every turn of phrase and design choice, individual quirk disappears into frictionless, average
                            output.
                        </p>
                    </div>
                    <div className="rounded-lg border border-hairline bg-panel/50 p-6 md:p-7">
                        <div className="mb-3 flex items-center gap-2.5 text-text-strong">
                            <ShieldAlert className="h-4 w-4 text-amber-400" aria-hidden="true" />
                            <h3 className="text-lg font-medium">Theft 02: Truth</h3>
                        </div>
                        <p className="text-sm font-light leading-relaxed text-text-mute">
                            Plausible, emotionally persuasive synthesis makes critical verification harder right when discernment matters most.
                        </p>
                    </div>
                </div>

                <PerspectivesViz />
            </section>

            {/* 03 · Generate & Destroy */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="innovation"
                    index="03"
                    eyebrow="Innovation method"
                    title="Generate fast,"
                    accent="destroy ruthlessly."
                    accentColor={ACCENT}
                    lead="Loh assumes his first idea is flawed. High-velocity generation paired with honest self-critique uncovers the rare ideas that hold up under real pressure."
                />
                <InnovationGame />
            </section>

            {/* 04 · Thoughtfulness & Win-Win Ecosystem */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="ecosystem"
                    index="04"
                    eyebrow="Thoughtfulness as strategy"
                    title="The win-win"
                    accent="ecosystem."
                    accentColor={ACCENT}
                    lead="In a world where machines out-compute any individual, durable careers shift from proving superiority to designing systems where everyone wins."
                />

                <blockquote className="mt-10 rounded-lg border border-hairline bg-panel/40 p-6 font-serif text-xl italic leading-relaxed text-text-strong md:p-8 md:text-2xl">
                    &ldquo;If your philosophy in life is &lsquo;how do I outdo everyone else,&rsquo; you will never be satisfied. If it is &lsquo;it
                    is addictive to make other people genuinely better off,&rsquo; that compounds into durable success.&rdquo;
                </blockquote>

                <EcosystemViz />
            </section>

            {/* 05 · Key Insights Checklist */}
            <section id="checklist" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <SectionHeader
                    index="05"
                    eyebrow="Summary"
                    title="Seven takeaways"
                    accent="to keep."
                    accentColor={ACCENT}
                />
                <div className="frame-ticks mt-10 rounded-lg border border-hairline bg-panel/60 p-6 md:p-10">
                    <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2">
                        {CHECKLIST.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm font-light leading-relaxed text-text">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT }} aria-hidden="true" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-hairline pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">
                        <span>Adapted from Po-Shen Loh</span>
                        <a
                            href="https://poshenloh.com/"
                            target="_blank"
                            rel="noreferrer"
                            data-cursor="open"
                            className="inline-flex items-center gap-1.5 text-text-strong hover:text-signal"
                        >
                            poshenloh.com <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </section>

            <ProjectNavigation currentId="human-edge" />
        </SubPageShell>
    );
};

export default HumanEdgePage;
