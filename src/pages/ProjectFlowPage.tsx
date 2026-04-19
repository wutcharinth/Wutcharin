import { GitFork, Layout, Brain, Bot, Users, Zap, SquareKanban } from 'lucide-react';
import ProjectFlowDemo from '../components/project-flow/ProjectFlowDemo';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import { RevealOnScroll, TiltCard } from '../lib/motion';

const ACCENT = '#2563eb';
const ACCENT2 = '#38bdf8';

const problems = [
    {
        Icon: Layout,
        color: '#3b82f6',
        title: 'Backlog Chaos',
        desc: 'Product backlogs often become dumping grounds for vague ideas. ProjectFlow forces clear acceptance criteria before a ticket enters a sprint.',
    },
    {
        Icon: Users,
        color: '#8b5cf6',
        title: 'Uneven Workloads',
        desc: 'Manual assignment leads to burnout. The agent analyzes historical velocity and current capacity to balance the load dynamically.',
    },
    {
        Icon: Bot,
        color: '#22d3ee',
        title: 'Scope Creep',
        desc: '"Just one small change" can derail a sprint. The agent detects scope creep in real-time and triggers a Human-in-the-Loop review.',
    },
];

const nodes = [
    {
        Icon: Brain,
        color: '#3b82f6',
        n: '01',
        title: 'Context Engine',
        desc: 'Analyzes ticket descriptions for ambiguity and completeness. Uses RAG to check against existing documentation.',
    },
    {
        Icon: Users,
        color: '#8b5cf6',
        n: '02',
        title: 'Load Balancer',
        desc: 'Calculates optimal ticket assignment based on developer skill sets (Frontend/Backend) and current sprint load.',
    },
    {
        Icon: Bot,
        color: '#22d3ee',
        n: '03',
        title: 'Jira Action Agent',
        desc: 'Executes the final decision by updating Jira tickets, moving them to sprints, or flagging them for review.',
    },
];

const ProjectFlowPage = () => {
    return (
        <SubPageShell statusLabel="System Online" accentColor={ACCENT}>
            <SubPageHero
                badgeLabel="Interactive Simulation"
                BadgeIcon={SquareKanban}
                titleLead="ProjectFlow"
                titleAccent="AI Scrum Master."
                accentColor={ACCENT}
                accentColor2={ACCENT2}
                index="02"
                description={
                    <>
                        An autonomous project management agent that grooms backlogs, assigns tickets
                        based on developer velocity, and enforces Definition of Done using{' '}
                        <span className="text-white font-normal">LangChain</span>.
                    </>
                }
                primaryCta={{ label: 'Live simulation', href: '#demo', icon: Zap }}
                secondaryCta={{ label: 'Architecture', href: 'https://github.com/langchain-ai/langchain', icon: GitFork, external: true }}
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
                            Powered by <span style={{ color: ACCENT }}>LangChain</span>
                        </h2>
                        <p data-reveal-child className="text-base md:text-lg text-slate-400 font-light leading-relaxed mb-10">
                            ProjectFlow orchestrates multiple LLM tools to manage the software development lifecycle. It connects directly to Jira and GitHub APIs to perform actions autonomously.
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
                                        <span className="ml-auto text-slate-500 text-[10px]">agent_logic.py</span>
                                    </div>
                                    <pre className="whitespace-pre-wrap leading-relaxed">
{`# Initialize the Agent
tools = [JiraTool(), GitHubTool()]
agent = initialize_agent(
    tools,
    llm=ChatOpenAI(temperature=0),
    agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT
)

# Define the Prompt Template
template = """
You are an autonomous Scrum Master.
Current Velocity: {velocity}
Team Capacity: {capacity}

Rules:
1. Reject tickets with ambiguity score > 0.7
2. Assign frontend tasks to Mike, backend to Sarah
3. Do not exceed individual capacity
"""

agent.run(template.format(
    velocity=32,
    capacity=team_stats
))`}
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
                        <Layout className="w-7 h-7" style={{ color: ACCENT }} />
                    </div>
                    <div data-reveal-child>
                        <h2 className="text-3xl md:text-4xl font-medium text-white tracking-[-0.02em] mb-2">Interactive demo</h2>
                        <p className="text-slate-400 font-light leading-relaxed max-w-2xl">
                            Simulate a sprint planning session. Watch the AI groom the backlog, handle scope creep, and auto-close completed tickets.
                        </p>
                    </div>
                </RevealOnScroll>
                <ProjectFlowDemo />
            </section>

            <ProjectNavigation currentId="project-flow" />
        </SubPageShell>
    );
};

export default ProjectFlowPage;
