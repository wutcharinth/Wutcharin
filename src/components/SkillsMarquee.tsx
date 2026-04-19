import { Marquee, SplitText, RevealOnScroll } from '../lib/motion';

const topRow = [
    'Strategic Transformation', 'Startups', 'Negotiation', 'Commercial Ops', 'Business Dev',
    'Strategic Planning', 'Analytics', 'Business Analysis', 'AI', 'Automation',
    'FinTech', 'Machine Learning', 'KPI Development', 'Financial Modeling',
    'Credit Risk Modeling', 'Business Intelligence',
];

const bottomRow = [
    'AI Agents', 'Agentic Systems', 'Orchestration', 'Guardrails & Evals', 'RAG', 'LLM Integration',
    'Claude Code', 'Claude Skills', 'Cursor', 'Antigravity',
    'n8n', 'Python', 'SQL', 'Prompt Engineering', 'Workflow Automation',
    'Data Strategy', 'PowerBI', 'Tableau', 'React', 'TypeScript',
    'Team Leadership', 'Google Cloud',
];

function Chip({ label, highlight = false }: { label: string; highlight?: boolean }) {
    return (
        <div
            className={`
                shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-light tracking-wide
                transition-all duration-200 hover:scale-105
                ${highlight
                    ? 'border border-violet-400/40 bg-violet-500/10 text-white backdrop-blur-sm hover:border-violet-400/70 hover:shadow-[0_0_12px_rgba(167,139,250,0.25)]'
                    : 'border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:border-white/30 hover:shadow-[0_0_10px_rgba(255,255,255,0.06)]'
                }
            `}
        >
            {label}
        </div>
    );
}

export default function SkillsMarquee() {
    return (
        <section className="relative overflow-hidden bg-[#020617] border-y border-white/5 py-24">
            {/* Background accents */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06),transparent_70%)]" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-0 bg-noise opacity-[0.04]" aria-hidden="true" />

            <RevealOnScroll staggerChildren={0.1} className="relative z-10 max-w-7xl mx-auto px-6 mb-14 flex items-end justify-between gap-6 flex-wrap">
                <div data-reveal-child>
                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5">
                        <span className="h-1 w-1 rounded-full bg-violet-400" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300">02 · Stack</span>
                    </div>
                    <SplitText
                        as="h2"
                        mode="words"
                        stagger={0.05}
                        className="text-4xl md:text-6xl font-medium tracking-[-0.03em] text-white leading-[0.95] block"
                    >
                        Technical Expertise
                    </SplitText>
                </div>
                <p data-reveal-child className="max-w-md text-sm md:text-base text-slate-400 font-light leading-relaxed">
                    A living toolkit shaped by two decades across strategy, analytics, and engineering — continuously refreshed as the frontier moves.
                </p>
            </RevealOnScroll>

            <RevealOnScroll className="relative z-10 space-y-5">
                <Marquee speed={55} direction="left" gap={12}>
                    {topRow.map((s) => (<Chip key={s} label={s} />))}
                </Marquee>
                <Marquee speed={65} direction="right" gap={12}>
                    {bottomRow.map((s, i) => (<Chip key={s} label={s} highlight={i % 4 === 0} />))}
                </Marquee>
            </RevealOnScroll>
        </section>
    );
}
