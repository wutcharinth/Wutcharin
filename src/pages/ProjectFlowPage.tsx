import { GitFork, Layout, Brain, Bot, Users, Zap, SquareKanban, ShieldAlert } from 'lucide-react';
import ProjectFlowDemo from '../components/project-flow/ProjectFlowDemo';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import {
    DemoStageFrame,
    InteractiveFlowDiagram,
    SectionHeader,
    TensionLedger,
    type FlowNodeSpec,
    type TensionItem,
} from '../components/shared/ShowcaseBlocks';
import SEO from '../components/SEO';

const ACCENT = '#2563eb';

const SECTIONS = [
    { id: 'problem', label: 'Friction' },
    { id: 'architecture', label: 'Pipeline' },
    { id: 'demo', label: 'Sandbox' },
];

const problems: TensionItem[] = [
    {
        icon: Layout,
        title: 'Backlog ambiguity',
        body: 'Product backlogs accumulate vague one-line tickets. ProjectFlow enforces crisp acceptance criteria before a story can enter an active sprint.',
        metric: 'DoR gated',
        tag: 'Grooming',
    },
    {
        icon: Users,
        title: 'Uneven sprint workloads',
        body: 'Manual ticket routing overloads senior engineers. The agent balances assignments using historical velocity, domain tags, and live capacity.',
        metric: 'Balanced load',
        tag: 'Capacity',
    },
    {
        icon: ShieldAlert,
        title: 'Mid-sprint scope creep',
        body: 'Unplanned changes silently derail delivery dates. ProjectFlow detects mid-sprint scope expansion and triggers a Product Owner approval gate.',
        metric: 'HITL guard',
        tag: 'Governance',
    },
];

const flowNodes: FlowNodeSpec[] = [
    {
        id: 'context',
        step: '01',
        title: 'Context engine',
        role: 'RAG grounding',
        icon: Brain,
        detail: 'Reads incoming Jira tickets, checks acceptance criteria completeness, and retrieves linked PRDs and architecture docs via RAG.',
        statePreview: `{
  "ticket": "FIN-418",
  "acceptanceCriteria": "COMPLETE",
  "estimatedPoints": 5,
  "domain": "backend-payments"
}`,
        highlightLines: [2, 6],
    },
    {
        id: 'balancer',
        step: '02',
        title: 'Load balancer',
        role: 'Skill & capacity',
        icon: Users,
        detail: 'Matches ticket domain against team skill vectors and active sprint utilization so no engineer exceeds target velocity.',
        statePreview: `{
  "candidate": "somchai.k",
  "skillMatch": 0.94,
  "currentLoad": "62% (8/13 pts)",
  "status": "OPTIMAL"
}`,
        highlightLines: [8, 12],
    },
    {
        id: 'guard',
        step: '03',
        title: 'Scope guard',
        role: 'Sprint policy',
        icon: ShieldAlert,
        detail: 'Verifies whether the ticket alters an active sprint commitment. Scope spikes pause execution for Product Owner sign-off.',
        statePreview: `{
  "sprintActive": true,
  "deltaPoints": "+5 pts",
  "scopeCreep": false,
  "gate": "PASS"
}`,
        highlightLines: [14, 17],
    },
    {
        id: 'action',
        step: '04',
        title: 'Jira action agent',
        role: 'Tool execution',
        icon: Bot,
        detail: 'Commits the decision via Jira & GitHub tool calls: assigns the developer, attaches refined acceptance criteria, and moves the card into sprint.',
        statePreview: `{
  "tool": "jira.assign_and_move",
  "assignee": "somchai.k",
  "column": "Sprint 24 · Ready",
  "synced": true
}`,
        highlightLines: [18, 22],
    },
];

const PIPELINE_CODE = `# Multi-tool Scrum orchestration pipeline
def groom_and_route(ticket: JiraTicket, sprint: SprintState):
    # 1. Enrich ticket with PRD context & verify DoR
    spec = rag_context.analyze(ticket.body, docs=sprint.prds)
    if not spec.has_acceptance_criteria:
        return jira.request_clarification(ticket.id, spec.gaps)

    # 2. Compute skill-weighted capacity across engineers
    owner = load_balancer.select(
        domain=spec.domain,
        points=spec.points,
        roster=sprint.engineers,
    )

    # 3. Guard active sprint scope before mutating Jira
    if sprint.is_locked and spec.points > sprint.buffer:
        return hitl.escalate_scope_creep(ticket.id, owner)

    return jira.assign_ticket(
        ticket_id=ticket.id,
        assignee=owner.handle,
        criteria=spec.checklist,
    )`;

const ProjectFlowPage = () => {
    return (
        <SubPageShell statusLabel="System Online" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="ProjectFlow AI Scrum Master: Autonomous Backlog & Sprint Routing"
                description="An agent that grooms backlogs, matches tickets to the right developer by capacity and skill, and guards against sprint scope creep."
                url="https://wutcharin.com/project-flow"
            />
            <SubPageHero
                badgeLabel="Interactive Simulation"
                BadgeIcon={SquareKanban}
                titleLead="ProjectFlow"
                titleAccent="AI Scrum Master."
                accentColor={ACCENT}
                description={
                    <>
                        An agent that grooms the backlog, assigns each ticket to the right developer and protects sprint commitments. Built on{' '}
                        <span className="font-normal text-text-strong">LangChain</span>.
                    </>
                }
                primaryCta={{ label: 'Live simulation', href: '#demo', icon: Zap }}
                secondaryCta={{ label: 'Architecture', href: '#architecture', icon: GitFork }}
            />

            {/* 01 · Problem ledger */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="problem"
                    index="01"
                    eyebrow="Delivery friction"
                    title="Sprints break before"
                    accent="code is written."
                    accentColor={ACCENT}
                    lead="Unclear requirements, overloaded engineers, and mid-sprint surprises cost teams more velocity than technical debt."
                />
                <TensionLedger items={problems} accentColor={ACCENT} />
            </section>

            {/* 02 · Interactive orchestration diagram */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="architecture"
                    index="02"
                    eyebrow="Agent pipeline"
                    title="Orchestrated with"
                    accent="LangChain."
                    accentColor={ACCENT}
                    lead="ProjectFlow chains document retrieval, developer load balancing, and Jira/GitHub API tools with a human approval gate for scope creep."
                />
                <InteractiveFlowDiagram
                    nodes={flowNodes}
                    accentColor={ACCENT}
                    filename="scrum_agent.py"
                    code={PIPELINE_CODE}
                    cyclicLabel="Clarification loop returns incomplete tickets"
                />
            </section>

            {/* 03 · Interactive sandbox */}
            <section id="demo" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <SectionHeader
                    index="03"
                    eyebrow="Interactive sandbox"
                    title="Test the"
                    accent="sprint desk."
                    accentColor={ACCENT}
                    lead="Submit tickets, inspect automated grooming decisions, and watch capacity rebalance across the engineering squad."
                />
                <DemoStageFrame
                    label="Live Simulation · AI Scrum Master"
                    accentColor={ACCENT}
                    badges={['RAG Grooming', 'Capacity Balance', 'Scope Guard']}
                >
                    <ProjectFlowDemo />
                </DemoStageFrame>
            </section>

            <ProjectNavigation currentId="project-flow" />
        </SubPageShell>
    );
};

export default ProjectFlowPage;
