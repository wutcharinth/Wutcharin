import { ShieldCheck, AlertTriangle, GitFork, Database, Zap, Lock, FileSearch, Scale } from 'lucide-react';
import RiskGuardDemo from '../components/risk-guard/RiskGuardDemo';
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

const ACCENT = '#f43f5e';

const SECTIONS = [
    { id: 'problem', label: 'Risks' },
    { id: 'architecture', label: 'Graph' },
    { id: 'demo', label: 'Sandbox' },
];

const problems: TensionItem[] = [
    {
        icon: AlertTriangle,
        title: 'Conflict of interest',
        body: 'Hidden relationships between employees and vendors often evade manual checks. RiskGuard cross-references HR and Vendor registries instantly.',
        metric: '0% blind spots',
        tag: 'Entity graph',
    },
    {
        icon: Lock,
        title: 'Policy drift & split POs',
        body: 'Complex procurement thresholds are easy to game by splitting invoices below approval limits. Every PO is verified against live policy rules.',
        metric: 'OPA verified',
        tag: 'Compliance',
    },
    {
        icon: FileSearch,
        title: 'Audit sampling fatigue',
        body: 'Traditional sampling audits miss up to 95% of transactions. RiskGuard inspects 100% of purchase orders in real time and escalates only true risk.',
        metric: '100% coverage',
        tag: 'Continuous audit',
    },
];

const graphNodes: FlowNodeSpec[] = [
    {
        id: 'entity',
        step: '01',
        title: 'Entity resolution',
        role: 'Cross-registry join',
        icon: Database,
        detail: 'Cross-checks HR records and Vendor master data for shared addresses, phone numbers, directors, or bank accounts indicating conflict of interest.',
        statePreview: `{
  "poId": "PO-2026-8841",
  "vendorMatch": "SHARED_BANK_ACCT",
  "hrLink": "emp_4102",
  "conflictFlag": true
}`,
        highlightLines: [4, 7],
    },
    {
        id: 'policy',
        step: '02',
        title: 'Policy engine',
        role: 'OPA guardrails',
        icon: ShieldCheck,
        detail: 'Evaluates Open Policy Agent rules covering budget ceilings, authorization sign-off tiers, split-invoice velocity, and restricted categories.',
        statePreview: `{
  "policy": "procurement_v4.rego",
  "budgetLimit": "EXCEEDED_14%",
  "splitWindow": "3 POs in 48h",
  "violations": 2
}`,
        highlightLines: [8, 11],
    },
    {
        id: 'scoring',
        step: '03',
        title: 'Risk scoring',
        role: 'Composite score',
        icon: Scale,
        detail: 'Combines entity graph anomalies and policy violations into an explainable 0 to 100 risk score with cited evidence for auditors.',
        statePreview: `{
  "compositeScore": 84,
  "tier": "HIGH_RISK",
  "rationale": "Shared beneficiary + split PO"
}`,
        highlightLines: [13, 18],
    },
    {
        id: 'routing',
        step: '04',
        title: 'Human escalation',
        role: 'Conditional edge',
        icon: GitFork,
        detail: 'Low-risk POs auto-approve with an audit receipt. High-risk cases freeze disbursement and route to the Audit Committee with full state history.',
        statePreview: `{
  "route": "escalate -> human_review",
  "disbursement": "HELD",
  "sla": "4h audit committee"
}`,
        highlightLines: [15, 21],
    },
];

const GRAPH_CODE = `# Cyclic LangGraph definition for continuous PO auditing
workflow = StateGraph(AuditState)

# 1. Cross-reference HR + Vendor entities
workflow.add_node("entity_resolution", entity_node)
workflow.add_edge(START, "entity_resolution")

# 2. Enforce OPA procurement policy rules
workflow.add_node("policy_check", policy_node)
workflow.add_edge("entity_resolution", "policy_check")

# 3. Compute explainable risk score & route conditionally
workflow.add_node("risk_scoring", scoring_node)
workflow.add_edge("policy_check", "risk_scoring")
workflow.add_conditional_edges(
    "risk_scoring",
    router_function,
    { "approve": END, "escalate": "human_review" },
)
workflow.add_edge("human_review", "policy_check")
app = workflow.compile()`;

const RiskGuardPage = () => {
    return (
        <SubPageShell statusLabel="Agent Online" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="RiskGuard AI Agent: Continuous Procurement Audit"
                description="An autonomous internal audit agent built on LangGraph that checks purchase orders, detects conflicts of interest, and enforces procurement policy."
                url="https://wutcharin.com/risk-guard"
            />
            <SubPageHero
                badgeLabel="Interactive Simulation"
                BadgeIcon={ShieldCheck}
                titleLead="RiskGuard"
                titleAccent="AI Agent."
                accentColor={ACCENT}
                description={
                    <>
                        An audit agent that checks purchase orders, uncovers hidden conflicts of interest and keeps every approval compliant. Built on{' '}
                        <span className="font-normal text-text-strong">LangGraph</span>.
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
                    eyebrow="Audit exposure"
                    title="Sampling misses"
                    accent="95% of spend."
                    accentColor={ACCENT}
                    lead="Manual internal audits review a sliver of procurement volume weeks after funds have left the company. RiskGuard evaluates every transaction before release."
                />
                <TensionLedger items={problems} accentColor={ACCENT} />
            </section>

            {/* 02 · Interactive LangGraph motion-graphic pipeline */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="architecture"
                    index="02"
                    eyebrow="Cyclic state graph"
                    title="Powered by"
                    accent="LangGraph."
                    accentColor={ACCENT}
                    lead="RiskGuard models internal audit as a stateful cyclic graph, enabling cross-database entity lookups, policy verification, and human-in-the-loop escalation."
                />
                <InteractiveFlowDiagram
                    nodes={graphNodes}
                    accentColor={ACCENT}
                    filename="risk_graph.py"
                    code={GRAPH_CODE}
                    cyclicLabel="Human review can re-evaluate policy rules"
                />
            </section>

            {/* 03 · Interactive sandbox */}
            <section id="demo" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <SectionHeader
                    index="03"
                    eyebrow="Interactive sandbox"
                    title="Simulate the"
                    accent="audit desk."
                    accentColor={ACCENT}
                    lead="Switch between requester, policy engine, and auditor roles to inspect how RiskGuard flags conflicts and routes escalations in real time."
                />
                <DemoStageFrame
                    label="Live Simulation · Procurement Audit"
                    accentColor={ACCENT}
                    badges={['Entity Resolution', 'OPA Policy', 'Human Escalation']}
                >
                    <RiskGuardDemo />
                </DemoStageFrame>
            </section>

            <ProjectNavigation currentId="risk-guard" />
        </SubPageShell>
    );
};

export default RiskGuardPage;
