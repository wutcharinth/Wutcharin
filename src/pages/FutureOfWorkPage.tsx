import { useState } from 'react';
import {
    Bot,
    TrendingUp,
    TrendingDown,
    BookOpen,
    Brain,
    CreditCard,
    ClipboardList,
    Zap,
    Scale,
    UserCheck,
    Users,
    Briefcase,
    ExternalLink,
    type LucideIcon,
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
    { id: 'report', label: 'Scenarios' },
    { id: 'sectors', label: 'Sectors' },
    { id: 'sources', label: 'Sources' },
];

const affectedSectors: Array<{ name: string; icon: LucideIcon; risk: number; detail: string; tag: string }> = [
    {
        name: 'Clerical & Admin',
        icon: ClipboardList,
        risk: 90,
        tag: 'High exposure',
        detail: 'Data entry, scheduling, and routine secretarial work are highly exposed due to deterministic, repetitive patterns.',
    },
    {
        name: 'Credit Analysts',
        icon: CreditCard,
        risk: 78,
        tag: 'BLS -3.9%',
        detail: 'Transactional finance underwriting and routine credit risk modeling face structural headcount compression by 2033.',
    },
    {
        name: 'Legal & Paralegal',
        icon: Scale,
        risk: 70,
        tag: 'BLS +1.2%',
        detail: 'Document discovery, contract review, and precedent search compress dramatically under long-context legal models.',
    },
    {
        name: 'Mid-Level Coding',
        icon: Zap,
        risk: 60,
        tag: 'Role shift',
        detail: 'AI writes 30%+ of production code in leading engineering teams, shifting developers from syntax typing to review and architecture.',
    },
];

const growthSectors: Array<{ name: string; icon: LucideIcon; growth: number; detail: string; tag: string }> = [
    {
        name: 'AI & Prompt Systems',
        icon: Brain,
        growth: 400,
        tag: 'Hypergrowth',
        detail: 'Engineers who architect evals, tool-calling workflows, and grounded agentic pipelines across enterprise operations.',
    },
    {
        name: 'Human-Centric Roles',
        icon: UserCheck,
        growth: 50,
        tag: 'High empathy',
        detail: 'Care, coaching, therapy, executive judgment, and physical-world craft where human trust and presence remain irreplaceable.',
    },
    {
        name: 'Software Architects',
        icon: Zap,
        growth: 17.9,
        tag: 'BLS +17.9%',
        detail: 'As boilerplate generation approaches zero cost, system integration, reliability, and product judgment grow strongly through 2033.',
    },
    {
        name: 'Financial Advisors',
        icon: Users,
        growth: 17.1,
        tag: 'BLS +17.1%',
        detail: 'While automation handles portfolio rebalancing, demand for accountable strategic wealth guidance keeps expanding.',
    },
];

const companyLayoffs = [
    {
        name: 'Microsoft',
        layoffs: '15,387',
        year: '2025',
        context: 'Division streamlining following leadership statements that AI writes a substantial share of internal code.',
    },
    {
        name: 'Amazon',
        layoffs: '~14,625',
        year: '2025',
        context: 'Corporate and retail restructuring capturing operational efficiency gains from internal automation.',
    },
    {
        name: 'Salesforce',
        layoffs: '~700',
        year: '2024',
        context: 'Leadership cited agentic customer support workflows reducing incremental support headcount needs.',
    },
    {
        name: 'Klarna (Support)',
        layoffs: '700 FTE eq.',
        year: '2024',
        context: 'Publicly reported an in-house AI assistant handling the workload of hundreds of full-time support agents.',
    },
];

const sources = [
    {
        org: 'US Bureau of Labor Statistics (BLS)',
        note: '2023 to 2033 occupational growth and decline projections across finance, legal, and software roles.',
        href: 'https://www.bls.gov/opub/ted/2025/ai-impacts-in-bls-employment-projections.htm',
    },
    {
        org: 'McKinsey Global Institute (MGI)',
        note: 'US occupational transitions (12M by 2030), task-level automation scope (60%), and macro productivity shifts.',
        href: 'https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america',
    },
    {
        org: 'World Economic Forum (WEF 2025)',
        note: 'Global job displacement (92M), net role creation (170M), and core skill obsolescence rate (39% by 2030).',
        href: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/',
    },
    {
        org: 'Goldman Sachs / PwC Research',
        note: 'Global 300M task-exposure estimates, 30% US automatable work estimates, and enterprise restructuring benchmarks.',
        href: 'https://www.nu.edu/blog/ai-job-statistics/',
    },
];

function RadialGauge({ value, label, sublabel, accentColor }: { value: number; label: string; sublabel: string; accentColor: string }) {
    const r = 46;
    const c = 2 * Math.PI * r;
    const targetOffset = c - (value / 100) * c;

    return (
        <div className="frame-ticks flex h-full flex-col items-center justify-center rounded-lg border border-hairline bg-panel/60 p-6 text-center">
            <div className="relative h-32 w-32">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-hairline-strong)" strokeWidth="8" />
                    <motion.circle
                        cx="60"
                        cy="60"
                        r={r}
                        fill="none"
                        stroke={accentColor}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={c}
                        initial={{ strokeDashoffset: c }}
                        whileInView={{ strokeDashoffset: targetOffset }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, ease: EASE }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-3xl font-semibold tabular-nums text-text-strong">{value}%</span>
                </div>
            </div>
            <p className="mt-4 text-sm font-medium text-text-strong">{label}</p>
            <p className="mt-1 text-xs font-light text-text-mute">{sublabel}</p>
        </div>
    );
}

const FutureOfWorkPage = () => {
    const [activeTab, setActiveTab] = useState<'disruption' | 'transformation'>('disruption');

    return (
        <SubPageShell statusLabel="Live Data Insight" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="The Future of Work: Automation vs. Transformation"
                description="A data-driven synthesis of global AI job disruption, task automation rates, corporate restructuring, and emerging growth sectors through 2033."
                url="https://wutcharin.com/future-of-work"
            />
            <SubPageHero
                badgeLabel="Data Journalism"
                BadgeIcon={Briefcase}
                titleLead="The Future of"
                titleAccent="Work."
                accentColor={ACCENT}
                description={
                    <>
                        A data-driven view on global job disruption and the emerging roles of tomorrow:{' '}
                        <span className="font-normal text-text-strong">Automation vs. Transformation</span>.
                    </>
                }
                primaryCta={{ label: 'Explore scenarios', href: '#report', icon: BookOpen }}
            />

            {/* 01 · Interactive Scenario Switcher */}
            <section id="report" className="mx-auto mb-24 max-w-6xl scroll-mt-24 px-6 md:mb-32 md:px-10">
                <SectionHeader
                    index="01"
                    eyebrow="Two lenses"
                    title="Tasks automate first;"
                    accent="roles transform next."
                    accentColor={ACCENT}
                    lead="Toggle between near-term labor displacement and long-term skill transformation to inspect the underlying macro benchmarks."
                />

                {/* Animated shared-pill scenario toggle */}
                <div className="mt-10 inline-flex rounded-full border border-hairline bg-panel/60 p-1">
                    {(
                        [
                            { id: 'disruption', label: 'I. Disruption Scenario', Icon: TrendingDown },
                            { id: 'transformation', label: 'II. Transformation Imperative', Icon: TrendingUp },
                        ] as const
                    ).map(({ id, label, Icon }) => {
                        const on = activeTab === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setActiveTab(id)}
                                data-cursor="step"
                                className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
                                    on ? 'text-bg' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {on && (
                                    <motion.span
                                        layoutId="fow-scenario-pill"
                                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        className="absolute inset-0 -z-10 rounded-full bg-text-strong"
                                    />
                                )}
                                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                {label}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="mt-8 space-y-10"
                    >
                        {activeTab === 'disruption' ? (
                            <>
                                <div className="frame-ticks rounded-lg border border-hairline bg-panel/50 p-6 md:p-8">
                                    <p className="max-w-4xl text-base font-light leading-relaxed text-text md:text-lg">
                                        The immediate impact of AI is the <span className="font-medium text-text-strong">automation of tasks</span>,
                                        not whole job titles overnight. While up to <span className="font-medium text-text-strong">60% of roles</span>{' '}
                                        will have core tasks modified, high-volume routine knowledge work faces acute compression first.
                                    </p>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-lg border border-hairline bg-panel/60 p-6">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute">Global exposure</p>
                                        <p className="mt-4 font-display text-5xl font-semibold tabular-nums text-text-strong">
                                            300<span className="ml-1 text-xl font-normal text-text-mute">M</span>
                                        </p>
                                        <p className="mt-3 text-xs text-text-mute">Goldman Sachs global FTE estimate</p>
                                    </div>

                                    <div className="rounded-lg border border-hairline bg-panel/60 p-6">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute">US role shifts</p>
                                        <p className="mt-4 font-display text-5xl font-semibold tabular-nums text-text-strong">
                                            12<span className="ml-1 text-xl font-normal text-text-mute">M</span>
                                        </p>
                                        <p className="mt-3 text-xs text-text-mute">McKinsey / BLS transitions by 2030</p>
                                    </div>

                                    <div className="rounded-lg border border-hairline bg-panel/60 p-6 md:col-span-2">
                                        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute">
                                            Automation scope: task vs. full role
                                        </p>
                                        <AnimatedMetricBar label="Tasks modified by AI" value="60%" pct={60} accentColor={ACCENT} />
                                        <AnimatedMetricBar label="Full job displacement risk" value="30%" pct={30} accentColor="#f43f5e" />
                                        <p className="mt-4 text-xs font-light text-text-mute">
                                            PwC / National University synthesis: tasks absorb automation well before entire roles disappear.
                                        </p>
                                    </div>
                                </div>

                                {/* Restructuring ledger */}
                                <div className="rounded-lg border border-hairline bg-panel/40 p-6 md:p-8">
                                    <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.26em] text-text-mute">
                                        Documented efficiency restructuring
                                    </p>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        {companyLayoffs.map((c) => (
                                            <div key={c.name} className="rounded-md border border-hairline bg-bg/70 p-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-base font-medium text-text-strong">{c.name}</h3>
                                                    <span className="font-mono text-[10px] tabular-nums text-text-mute">{c.year}</span>
                                                </div>
                                                <p className="mt-2 font-display text-2xl font-semibold text-rose-400">{c.layoffs}</p>
                                                <p className="mt-2 text-xs font-light leading-relaxed text-text-mute">{c.context}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="frame-ticks rounded-lg border border-hairline bg-panel/50 p-6 md:p-8">
                                    <p className="max-w-4xl text-base font-light leading-relaxed text-text md:text-lg">
                                        AI simultaneously drives <span className="font-medium text-text-strong">net role creation</span> (170M new
                                        roles projected globally by WEF). Competitive advantage shifts toward people who orchestrate systems, audit
                                        outputs, and exercise high-trust human judgment.
                                    </p>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-lg border border-hairline bg-panel/60 p-6">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute">Global new roles</p>
                                        <p className="mt-4 font-display text-5xl font-semibold tabular-nums text-text-strong">
                                            170<span className="ml-1 text-xl font-normal text-text-mute">M</span>
                                        </p>
                                        <p className="mt-3 text-xs text-text-mute">WEF Future of Jobs 2025 projection</p>
                                    </div>

                                    <div className="rounded-lg border border-hairline bg-panel/60 p-6">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute">AI systems demand</p>
                                        <p className="mt-4 font-display text-5xl font-semibold tabular-nums" style={{ color: ACCENT }}>
                                            +400<span className="ml-0.5 text-xl font-normal">%</span>
                                        </p>
                                        <p className="mt-3 text-xs text-text-mute">YoY growth in applied AI workflow roles</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <RadialGauge
                                            value={39}
                                            label="Core skill sets transformed by 2030"
                                            sublabel="World Economic Forum Future of Jobs Report 2025"
                                            accentColor={ACCENT}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* 02 · Sector Matrix: Exposed vs. Growing side-by-side */}
            <section id="sectors" className="mx-auto mb-24 max-w-6xl scroll-mt-24 px-6 md:mb-32 md:px-10">
                <SectionHeader
                    index="02"
                    eyebrow="Sector divergence"
                    title="Vulnerable vs."
                    accent="expanding roles."
                    accentColor={ACCENT}
                    lead="Compare automation exposure against 10-year BLS occupational growth rates to see where leverage concentrates."
                />

                <div className="mt-12 grid gap-8 lg:grid-cols-2">
                    <div className="rounded-lg border border-hairline bg-panel/50 p-6 md:p-8">
                        <div className="mb-6 flex items-center justify-between border-b border-hairline pb-4">
                            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-strong">
                                <Bot className="h-3.5 w-3.5 text-rose-400" aria-hidden="true" />
                                High automation exposure
                            </span>
                            <span className="font-mono text-[10px] text-text-mute">Routine cognition</span>
                        </div>
                        <div className="space-y-6">
                            {affectedSectors.map((s) => (
                                <div key={s.name}>
                                    <div className="mb-1.5 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <s.icon className="h-4 w-4 text-rose-400" aria-hidden="true" />
                                            <span className="text-sm font-medium text-text-strong">{s.name}</span>
                                        </div>
                                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-mute">{s.tag}</span>
                                    </div>
                                    <AnimatedMetricBar label={s.detail} value={`${s.risk}%`} pct={s.risk} accentColor="#f43f5e" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg border border-hairline bg-panel/50 p-6 md:p-8">
                        <div className="mb-6 flex items-center justify-between border-b border-hairline pb-4">
                            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-strong">
                                <Brain className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
                                High-growth human leverage
                            </span>
                            <span className="font-mono text-[10px] text-text-mute">2033 outlook</span>
                        </div>
                        <div className="space-y-6">
                            {growthSectors.map((s) => (
                                <div key={s.name}>
                                    <div className="mb-1.5 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                            <s.icon className="h-4 w-4" style={{ color: ACCENT }} aria-hidden="true" />
                                            <span className="text-sm font-medium text-text-strong">{s.name}</span>
                                        </div>
                                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-mute">{s.tag}</span>
                                    </div>
                                    <AnimatedMetricBar
                                        label={s.detail}
                                        value={`+${s.growth}%`}
                                        pct={Math.min(100, s.growth)}
                                        accentColor={ACCENT}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 03 · Reference sources */}
            <section id="sources" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <SectionHeader
                    index="03"
                    eyebrow="Citations"
                    title="Primary research"
                    accent="sources."
                    accentColor={ACCENT}
                    lead="All figures synthesize public projections from BLS, McKinsey Global Institute, WEF, and Goldman Sachs. Estimates vary with policy and enterprise adoption pace."
                />
                <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
                    {sources.map((src) => (
                        <li key={src.org} className="py-4">
                            <a
                                href={src.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                data-cursor="open"
                                className="group flex flex-col justify-between gap-2 sm:flex-row sm:items-center"
                            >
                                <div>
                                    <p className="text-base font-medium text-text-strong transition-colors group-hover:text-signal">{src.org}</p>
                                    <p className="mt-1 text-sm font-light text-text-mute">{src.note}</p>
                                </div>
                                <ExternalLink
                                    className="h-4 w-4 shrink-0 text-text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-strong"
                                    aria-hidden="true"
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            <ProjectNavigation currentId="future-of-work" />
        </SubPageShell>
    );
};

export default FutureOfWorkPage;
