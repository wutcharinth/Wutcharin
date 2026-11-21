import { Receipt, ShieldAlert, GitFork, Database, Zap, Lock, Cpu, ScanLine } from 'lucide-react';
import SlipVerifyDemo from '../components/slip-verify/SlipVerifyDemo';
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

const ACCENT = '#3b82f6';

const SECTIONS = [
    { id: 'problem', label: 'Fraud' },
    { id: 'architecture', label: 'Graph' },
    { id: 'demo', label: 'Sandbox' },
];

const problems: TensionItem[] = [
    {
        icon: ShieldAlert,
        title: 'The fake slip epidemic',
        body: 'Thai e-commerce merchants lose millions to edited transfer slips ("Slip Plom"). Basic regex parsing is easily defeated by pixel-accurate tampering.',
        metric: 'Tamper check',
        tag: 'Visual fraud',
    },
    {
        icon: Lock,
        title: 'Cross-order replay attacks',
        body: 'Fraudsters submit one genuine bank transfer receipt across multiple orders. Without a persistent transaction ledger, replays slip through unnoticed.',
        metric: 'Zero replays',
        tag: 'Ledger hash',
    },
    {
        icon: Cpu,
        title: 'Manual verification bottlenecks',
        body: 'Checking every bank transfer by hand stalls fulfillment during peak campaigns. Only ambiguous or flagged slips should require human review.',
        metric: 'Auto-clear',
        tag: 'Throughput',
    },
];

const flowNodes: FlowNodeSpec[] = [
    {
        id: 'ocr',
        step: '01',
        title: 'Vision OCR node',
        role: 'Multimodal extract',
        icon: ScanLine,
        detail: 'Extracts bank issuer, transfer reference ID, exact amount, timestamp, sender, and QR payload from uploaded mobile slip images.',
        statePreview: `{
  "bank": "KBANK",
  "refId": "014091142038APM019",
  "amountThb": 2450.00,
  "ocrConfidence": 0.99
}`,
        highlightLines: [4, 7],
    },
    {
        id: 'ledger',
        step: '02',
        title: 'Ledger dedupe',
        role: 'Shared state',
        icon: Database,
        detail: 'Hashes the reference ID and checks a centralized transaction ledger + blacklisted beneficiary list to catch instant replay attacks.',
        statePreview: `{
  "duplicateFound": false,
  "blacklistMatch": false,
  "qrSignature": "VALID"
}`,
        highlightLines: [8, 11],
    },
    {
        id: 'router',
        step: '03',
        title: 'Confidence router',
        role: 'Conditional edge',
        icon: GitFork,
        detail: 'Routes each slip based on composite confidence: clean matches auto-approve, confirmed duplicates reject, and borderline scans escalate.',
        statePreview: `{
  "decision": "APPROVE | FLAGGED | REJECT",
  "threshold": 0.92,
  "latencyMs": 620
}`,
        highlightLines: [13, 18],
    },
    {
        id: 'human',
        step: '04',
        title: 'Human desk',
        role: 'Exception review',
        icon: ShieldAlert,
        detail: 'Presents flagged slips side by side with anomaly highlights so finance operators resolve edge cases in one click and update the ledger.',
        statePreview: `{
  "queue": "flagged_only",
  "operatorAction": "CONFIRMED",
  "ledgerCommitted": true
}`,
        highlightLines: [17, 21],
    },
];

const GRAPH_CODE = `# Cyclic LangGraph workflow for bank slip verification
workflow = StateGraph(PaymentState)

# 1. Extract transfer fields & QR payload via Vision AI
workflow.add_node("ocr", ocr_node)
workflow.add_edge(START, "ocr")

# 2. Verify against central ledger for replay & tampering
workflow.add_node("fraud_check", fraud_node)
workflow.add_edge("ocr", "fraud_check")

# 3. Route by confidence score & fraud flags
workflow.add_node("human_review", human_node)
workflow.add_conditional_edges(
    "fraud_check",
    router_function,
    { "approve": END, "reject": END, "flagged": "human_review" },
)
workflow.add_edge("human_review", END)
app = workflow.compile()`;

const SlipVerifyPage = () => {
    return (
        <SubPageShell statusLabel="Agent Online" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="SlipVerify AI Agent: Automated Bank Transfer Fraud Detection"
                description="A LangGraph verification agent that reads Thai bank transfer slips, catches replay fraud against a shared ledger, and escalates ambiguous cases."
                url="https://wutcharin.com/slip-verify"
            />
            <SubPageHero
                badgeLabel="Interactive Simulation"
                BadgeIcon={Receipt}
                titleLead="SlipVerify"
                titleAccent="AI Agent."
                accentColor={ACCENT}
                description={
                    <>
                        An agent that inspects bank transfer slips, flags replay fraud against a shared ledger, and clears genuine orders automatically.
                        Built on <span className="font-normal text-text-strong">LangGraph</span>.
                    </>
                }
                primaryCta={{ label: 'Live simulation', href: '#demo', icon: Zap }}
                secondaryCta={{ label: 'Architecture', href: '#architecture', icon: GitFork }}
            />

            {/* 01 · Fraud ledger */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="problem"
                    index="01"
                    eyebrow="Payment integrity"
                    title="Stop fake slips"
                    accent="before fulfillment."
                    accentColor={ACCENT}
                    lead="Bank transfer commerce moves fast, and fraudsters exploit every manual gap between payment screenshot and shipping confirmation."
                />
                <TensionLedger items={problems} accentColor={ACCENT} />
            </section>

            {/* 02 · Interactive LangGraph pipeline */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="architecture"
                    index="02"
                    eyebrow="Cyclic state graph"
                    title="Stateful verification"
                    accent="in LangGraph."
                    accentColor={ACCENT}
                    lead="Unlike a one-shot OCR prompt, SlipVerify maintains persistent state across Vision extraction, duplicate-ledger checks, and human escalation."
                />
                <InteractiveFlowDiagram
                    nodes={flowNodes}
                    accentColor={ACCENT}
                    filename="graph_definition.py"
                    code={GRAPH_CODE}
                    cyclicLabel="Low-confidence scans escalate to human desk"
                />
            </section>

            {/* 03 · Interactive sandbox */}
            <section id="demo" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <SectionHeader
                    index="03"
                    eyebrow="Interactive sandbox"
                    title="Inspect live"
                    accent="slip packets."
                    accentColor={ACCENT}
                    lead="Test a clean bank slip, a blurry low-confidence scan, and a replayed duplicate to trace how the verification graph routes each transaction."
                />
                <DemoStageFrame
                    label="Live Simulation · Bank Slip Verification"
                    accentColor={ACCENT}
                    badges={['Perfect Slip', 'Low Confidence', 'Duplicate Replay']}
                >
                    <SlipVerifyDemo />
                </DemoStageFrame>
            </section>

            <ProjectNavigation currentId="slip-verify" />
        </SubPageShell>
    );
};

export default SlipVerifyPage;
