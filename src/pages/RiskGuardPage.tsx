import { ShieldCheck, AlertTriangle, GitFork, Database, Zap, Lock, FileSearch } from 'lucide-react';
import RiskGuardDemo from '../components/risk-guard/RiskGuardDemo';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import { RevealOnScroll, TiltCard } from '../lib/motion';

const ACCENT = '#f43f5e';
const ACCENT2 = '#fb923c';

const problems = [
    {
        Icon: AlertTriangle,
        color: '#f43f5e',
        title: 'Conflict of Interest',
        desc: 'Hidden relationships between employees and vendors often go undetected manually. RiskGuard cross-references HR and Vendor data instantly.',
    },
    {
        Icon: Lock,
        color: '#f59e0b',
        title: 'Policy Violations',
        desc: 'Complex procurement policies are hard to enforce consistently. The agent checks every PO against the latest policy documents.',
    },
    {
        Icon: FileSearch,
        color: '#3b82f6',
        title: 'Audit Fatigue',
        desc: 'Sampling-based audits miss 95% of transactions. RiskGuard audits 100% of transactions in real-time, flagging only high-risk cases.',
    },
];

const nodes = [
    {
        Icon: Database,
        color: '#f43f5e',
        n: '01',
        title: 'Entity Resolution',
        desc: 'Connects to HR and Vendor databases to identify shared addresses, phone numbers, or bank accounts indicating a conflict of interest.',
    },
    {
        Icon: ShieldCheck,
        color: '#a855f7',
        n: '02',
        title: 'Policy Engine',
        desc: 'Uses OPA (Open Policy Agent) logic to validate budget limits, authorization levels, and spending categories.',
    },
    {
        Icon: GitFork,
        color: '#f59e0b',
        n: '03',
        title: 'Risk Scoring & Routing',
        desc: 'Calculates a composite risk score. Low risk → auto-approve. High risk → escalate to audit committee.',
    },
];

const RiskGuardPage = () => {
    return (
        <SubPageShell statusLabel="Agent Online" accentColor={ACCENT}>
            <SubPageHero
                badgeLabel="Interactive Simulation"
                BadgeIcon={ShieldCheck}
                titleLead="RiskGuard"
                titleAccent="AI Agent."
                accentColor={ACCENT}
                accentColor2={ACCENT2}
                index="03"
                description={
                    <>
                        An intelligent internal audit agent that autonomously validates purchase orders, detects conflicts of interest, and ensures compliance using{' '}
                        <span className="text-white font-normal">LangGraph</span>.
                    </>
                }
                primaryCta={{ label: 'Live simulation', href: '#demo', icon: Zap }}
                secondaryCta={{ label: 'Architecture', href: 'https://github.com/langchain-ai/langgraph', icon: GitFork, external: true }}
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

            {/* ChainGraph explanation */}
            <section className="container mx-auto px-6 mb-32">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    <RevealOnScroll staggerChildren={0.08}>
                        <div data-reveal-child className="flex items-center gap-3 mb-6">
                            <span className="h-1 w-1 rounded-full" style={{ backgroundColor: ACCENT }} />
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">Architecture</span>
                        </div>
                        <h2 data-reveal-child className="text-3xl md:text-5xl font-medium text-white tracking-[-0.03em] mb-6 leading-[1.05]">
                            Powered by <span style={{ color: ACCENT }}>ChainGraph</span>
                        </h2>
                        <p data-reveal-child className="text-base md:text-lg text-slate-400 font-light leading-relaxed mb-10">
                            RiskGuard uses a <span className="text-slate-200">Cyclic State Graph</span> to model the internal audit process — enabling complex reasoning, data fetching, and human-in-the-loop escalation.
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

                    <RevealOnScroll staggerChildren={0.1}>
                        <div data-reveal-child className="relative">
                            <div
                                className="absolute inset-0 rounded-2xl blur-[100px] opacity-30"
                                style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)` }}
                                aria-hidden="true"
                            />
                            <div className="relative rounded-2xl border border-white/10 bg-[#0a0f1c] p-6 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                                <div className="flex gap-2 mb-5 pb-4 border-b border-white/5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                                    <span className="ml-auto text-slate-500 text-[10px]">risk_graph.py</span>
                                </div>
                                <pre className="whitespace-pre-wrap leading-relaxed">
{`# Define the Risk Graph
workflow = StateGraph(AuditState)

# Add nodes
workflow.add_node("policy_check", policy_node)
workflow.add_node("entity_resolution", entity_node)
workflow.add_node("risk_scoring", scoring_node)

# Add edges
workflow.add_edge("policy_check", "entity_resolution")
workflow.add_edge("entity_resolution", "risk_scoring")

# Conditional routing
workflow.add_conditional_edges(
    "risk_scoring",
    router_function,
    { "approve": END, "escalate": "human_review" }
)

app = workflow.compile()`}
                                </pre>
                            </div>
                        </div>
                    </RevealOnScroll>
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
                        <ShieldCheck className="w-7 h-7" style={{ color: ACCENT }} />
                    </div>
                    <div data-reveal-child>
                        <h2 className="text-3xl md:text-4xl font-medium text-white tracking-[-0.02em] mb-2">Interactive demo</h2>
                        <p className="text-slate-400 font-light leading-relaxed max-w-2xl">
                            Simulate a procurement workflow. Switch between roles to see how the agent protects the organization from different perspectives.
                        </p>
                    </div>
                </RevealOnScroll>
                <RiskGuardDemo />
            </section>

            <ProjectNavigation currentId="risk-guard" />
        </SubPageShell>
    );
};

export default RiskGuardPage;
