import { GitFork, Database, Search, Brain, Code, Network, Zap } from 'lucide-react';
import QueryFlowDemo from '../components/query-flow/QueryFlowDemo';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import { RevealOnScroll, TiltCard } from '../lib/motion';

const ACCENT = '#7c3aed';
const ACCENT2 = '#a78bfa';

const problems = [
    {
        Icon: Database,
        color: '#7c3aed',
        title: 'Data Silos',
        desc: 'Critical business data is scattered across Postgres, Snowflake, and Databricks. Joining these manually is a nightmare.',
    },
    {
        Icon: Code,
        color: '#8b5cf6',
        title: 'SQL Bottleneck',
        desc: 'Business users wait days for data engineers to write simple queries. This slows down decision-making significantly.',
    },
    {
        Icon: Brain,
        color: '#3b82f6',
        title: 'Context Gap',
        desc: 'Generic AI chatbots hallucinate table names. QueryFlow uses a semantic metadata layer to ensure 100% accurate SQL generation.',
    },
];

const nodes = [
    {
        Icon: Search,
        color: '#7c3aed',
        n: '01',
        title: 'Metadata Scout',
        desc: 'Before generating SQL, the agent scans the Data Catalog to find the exact tables and columns needed, avoiding hallucinations.',
    },
    {
        Icon: Code,
        color: '#8b5cf6',
        n: '02',
        title: 'SQL Generator',
        desc: 'Uses a fine-tuned LLM to write optimized SQL, handling complex JOINs across different database dialects (Postgres vs Snowflake).',
    },
    {
        Icon: Network,
        color: '#3b82f6',
        n: '03',
        title: 'Federated Execution',
        desc: 'Executes the query securely via a Trino engine, aggregating results from multiple sources into a single view.',
    },
];

const QueryFlowPage = () => {
    return (
        <SubPageShell statusLabel="System Online" accentColor={ACCENT}>
            <SubPageHero
                badgeLabel="Interactive Simulation"
                BadgeIcon={Database}
                titleLead="QueryFlow"
                titleAccent="Enterprise Data Agent."
                accentColor={ACCENT}
                accentColor2={ACCENT2}
                index="04"
                description={
                    <>
                        An intelligent data agent that bridges the gap between natural language and
                        enterprise data warehouses. It autonomously scouts metadata, generates SQL, and
                        executes federated queries across{' '}
                        <span className="text-white font-normal">Snowflake</span> and{' '}
                        <span className="text-white font-normal">Postgres</span>.
                    </>
                }
                primaryCta={{ label: 'Live simulation', href: '#demo', icon: Zap }}
                secondaryCta={{ label: 'Architecture', href: '#', icon: GitFork }}
            />

            {/* Problem cards */}
            <section className="container mx-auto px-6 mb-32">
                <RevealOnScroll staggerChildren={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {problems.map((p) => (
                        <div key={p.title} data-reveal-child className="h-full">
                            <TiltCard
                                max={5}
                                lift={4}
                                className="group relative h-full rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-7 overflow-hidden"
                            >
                                <div
                                    className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500"
                                    style={{ backgroundColor: p.color }}
                                    aria-hidden="true"
                                />
                                <p.Icon className="w-8 h-8 mb-6 opacity-90" style={{ color: p.color }} />
                                <h3 className="text-lg font-medium text-white mb-3 tracking-[-0.01em]">{p.title}</h3>
                                <p className="text-sm text-slate-400 font-light leading-relaxed">{p.desc}</p>
                            </TiltCard>
                        </div>
                    ))}
                </RevealOnScroll>
            </section>

            {/* Architecture */}
            <section className="container mx-auto px-6 mb-32">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    <RevealOnScroll staggerChildren={0.08}>
                        <div data-reveal-child className="flex items-center gap-3 mb-6">
                            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ACCENT }} />
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">Architecture</span>
                        </div>
                        <h2 data-reveal-child className="text-3xl md:text-5xl font-medium text-white tracking-[-0.03em] mb-6 leading-[1.05]">
                            Powered by <span style={{ color: ACCENT }}>Semantic RAG</span>
                        </h2>
                        <p data-reveal-child className="text-base md:text-lg text-slate-400 font-light leading-relaxed mb-10">
                            QueryFlow isn't just a text-to-SQL tool. It's a full-stack data agent that understands your data lineage, security policies, and business logic.
                        </p>
                        <div className="space-y-5">
                            {nodes.map((n) => (
                                <div
                                    key={n.n}
                                    data-reveal-child
                                    className="group flex gap-5 p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/20 transition-colors"
                                >
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                                        style={{ backgroundColor: `${n.color}15`, borderColor: `${n.color}33` }}
                                    >
                                        <n.Icon className="w-5 h-5" style={{ color: n.color }} />
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="font-mono text-[10px] text-white/30">{n.n}</span>
                                            <h4 className="text-white font-medium tracking-[-0.01em]">{n.title}</h4>
                                        </div>
                                        <p className="text-sm text-slate-400 font-light leading-relaxed">{n.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealOnScroll>

                    {/* Code block — hidden on mobile to avoid horizontal scroll */}
                    <div className="hidden lg:block">
                        <RevealOnScroll staggerChildren={0.1}>
                            <div data-reveal-child className="relative">
                                <div
                                    className="absolute inset-0 rounded-2xl blur-[100px] opacity-30"
                                    style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})` }}
                                    aria-hidden="true"
                                />
                                <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1c] p-6 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                                    <div className="flex gap-2 mb-5 pb-4 border-b border-white/5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                                        <span className="ml-auto text-slate-500 text-[10px]">agent_core.py</span>
                                    </div>
                                    <pre className="whitespace-pre-wrap leading-relaxed">
{`# Retrieve Context
schema = catalog.search(query.entities)

# Generate SQL
sql = llm.generate(
    prompt=query.text,
    context=schema,
    dialect="trino"
)

# Execute Safely
if policy_check(user, sql):
    df = db.execute(sql)
    return insight_engine.analyze(df)
else:
    return "Access Denied"`}
                                    </pre>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* Demo */}
            <section id="demo" className="container mx-auto px-6">
                <RevealOnScroll staggerChildren={0.1} className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 pb-12 border-b border-white/5">
                    <div
                        data-reveal-child
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border"
                        style={{ backgroundColor: `${ACCENT}15`, borderColor: `${ACCENT}33` }}
                    >
                        <Brain className="w-7 h-7" style={{ color: ACCENT }} />
                    </div>
                    <div data-reveal-child>
                        <h2 className="text-3xl md:text-4xl font-medium text-white tracking-[-0.02em] mb-2">Interactive demo</h2>
                        <p className="text-slate-400 font-light leading-relaxed max-w-2xl">
                            Ask questions in plain English. Watch the agent traverse the data lineage, generate SQL, and visualize the results instantly.
                        </p>
                    </div>
                </RevealOnScroll>
                <QueryFlowDemo />
            </section>

            <ProjectNavigation currentId="query-flow" />
        </SubPageShell>
    );
};

export default QueryFlowPage;
