import { Brain, Shield, Zap, Scale, Building2, Gavel, Play, Webhook, RefreshCw } from 'lucide-react';
import CollectionsDemo from '../components/collections/CollectionsDemo';
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

const ACCENT = '#10b981';

const SECTIONS = [
    { id: 'problem', label: 'Leakage' },
    { id: 'architecture', label: 'Strategy' },
    { id: 'demo', label: 'Sandbox' },
];

const problems: TensionItem[] = [
    {
        icon: Building2,
        title: 'Erroneous VCC charges',
        body: 'Hotels frequently charge Virtual Credit Cards in full on free-cancellation bookings or overlook approved no-show waivers.',
        metric: 'Multi-$M risk',
        tag: 'VCC leakage',
    },
    {
        icon: Scale,
        title: '20-minute manual recovery',
        body: 'Human specialists spend 20+ minutes per dispute crossing time zones, language barriers, and multi-tier cancellation clauses.',
        metric: '20m / case',
        tag: 'Ops drag',
    },
    {
        icon: Gavel,
        title: 'Autonomous end-to-end recovery',
        body: 'The agent connects directly to PMS records and payment gateways to detect overcharges, draft partner-aware outreach, and file compliant chargebacks.',
        metric: 'Auto-recover',
        tag: 'Closed loop',
    },
];

const flowNodes: FlowNodeSpec[] = [
    {
        id: 'trigger',
        step: '01',
        title: 'Webhook detect',
        role: 'Gateway audit',
        icon: Webhook,
        detail: 'Listens to virtual card settlement webhooks, compares billed amounts against booking cancellation windows, and isolates true overcharges.',
        statePreview: `{
  "bookingId": "OTA-992104",
  "vccCharged": "$640.00",
  "entitledAmount": "$0.00 (Free Cancel)",
  "leakage": "$640.00"
}`,
        highlightLines: [1, 4],
    },
    {
        id: 'strategy',
        step: '02',
        title: 'Strategy engine',
        role: 'Partner tier',
        icon: Brain,
        detail: 'Selects tone and escalation path dynamically based on hotel VIP tier, historical win rate, and regional compliance rules.',
        statePreview: `{
  "hotelTier": "VIP_PARTNER",
  "winRate": 0.94,
  "tone": "POLITE_REMINDER",
  "template": "vip_inquiry.txt"
}`,
        highlightLines: [6, 13],
    },
    {
        id: 'rebuttal',
        step: '03',
        title: 'Rebuttal loop',
        role: 'Evidence fetch',
        icon: RefreshCw,
        detail: 'If a property contests the claim, the agent automatically pulls timestamped cancellation receipts and waiver logs to argue back.',
        statePreview: `{
  "hotelReply": "DENIED (No-Show)",
  "counterEvidence": "cancel_ts < cutoff - 14h",
  "action": "SEND_REBUTTAL_V2"
}`,
        highlightLines: [15, 19],
    },
    {
        id: 'chargeback',
        step: '04',
        title: 'Recover or file',
        role: 'Settlement',
        icon: Shield,
        detail: 'Verifies refunded settlement on the virtual card ledger, or escalates unresolved breaches straight into card-network chargeback filing.',
        statePreview: `{
  "outcome": "REFUND_CONFIRMED",
  "recovered": "$640.00",
  "cycleTime": "3.2 mins"
}`,
        highlightLines: [18, 22],
    },
];

const STRATEGY_CODE = `# Partner-aware VCC dispute strategy engine
def strategy_node(state: AgentState):
    hotel_tier = state["hotel_tier"]
    history = state["dispute_history"]

    # Adapt outreach tone to partner value & compliance history
    if hotel_tier == "VIP" and history["win_rate"] > 0.9:
        tone = "POLITE_REMINDER"
        template = "templates/vip_inquiry.txt"
    else:
        tone = "FIRM_DEMAND"
        template = "templates/legal_notice.txt"

    # Rebuttal loop attaches fresh policy evidence if contested
    if state["status"] == "CONTESTED":
        evidence = pms.fetch_cancellation_proof(state["booking_id"])
        return { "tone": "EVIDENCE_REBUTTAL", "evidence": evidence }

    return {
        "tone": tone,
        "email_template": template,
        "next_step": "draft_and_dispatch",
    }`;

export default function CollectionsPage() {
    return (
        <SubPageShell statusLabel="System Online" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="Enterprise Collections AI: Autonomous VCC Dispute Resolution"
                description="An autonomous agent that recovers virtual credit card (VCC) overcharges by validating cancellation policies, negotiating with hotels, and filing compliant chargebacks."
                url="https://wutcharin.com/collections"
            />
            <SubPageHero
                badgeLabel="Autonomous Dispute Resolution"
                BadgeIcon={Brain}
                titleLead="Enterprise"
                titleAccent="Collections AI."
                description={
                    <>
                        An agent that recovers revenue lost to <span className="font-normal text-text-strong">virtual card (VCC)</span> overcharges. It
                        audits cancellation policies, negotiates with properties, and escalates chargebacks at scale.
                    </>
                }
                accentColor={ACCENT}
                primaryCta={{ label: 'Run the simulation', href: '#demo', icon: Play }}
                secondaryCta={{ label: 'Strategy graph', href: '#architecture', icon: Zap }}
            />

            {/* 01 · Leakage ledger */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="problem"
                    index="01"
                    eyebrow="Revenue leakage"
                    title="The multi-million dollar"
                    accent="VCC gap."
                    accentColor={ACCENT}
                    lead="Online travel agencies settle hotel bookings with temporary Virtual Credit Cards. When cancellations occur, unmonitored charges bleed margin silently."
                />
                <TensionLedger items={problems} accentColor={ACCENT} />
            </section>

            {/* 02 · Interactive Strategy Engine motion graphic */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="architecture"
                    index="02"
                    eyebrow="Cognitive flow"
                    title="Adaptive dispute"
                    accent="strategy."
                    accentColor={ACCENT}
                    lead="Rather than firing rigid scripts, the Strategy Engine tailors tone to hotel tier and enters an evidence-gathering rebuttal loop whenever a partner pushes back."
                />
                <InteractiveFlowDiagram
                    nodes={flowNodes}
                    accentColor={ACCENT}
                    filename="strategy_engine.py"
                    code={STRATEGY_CODE}
                    cyclicLabel="Denied claims trigger automated evidence rebuttal"
                />
            </section>

            {/* 03 · Interactive sandbox */}
            <section id="demo" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <SectionHeader
                    index="03"
                    eyebrow="Interactive sandbox"
                    title="Watch the agent"
                    accent="recover funds."
                    accentColor={ACCENT}
                    lead="Choose a dispute scenario to observe live policy verification, tone selection, and automated counter-arguments."
                />
                <DemoStageFrame
                    label="Live Simulation · Autonomous Collections"
                    accentColor={ACCENT}
                    badges={['VCC Audit', 'Partner Tone', 'Rebuttal Loop']}
                >
                    <CollectionsDemo />
                </DemoStageFrame>
            </section>

            <ProjectNavigation currentId="collections" />
        </SubPageShell>
    );
}
