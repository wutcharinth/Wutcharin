import { GitFork, Database, Search, Brain, Code, Network, Zap, ShieldCheck } from 'lucide-react';
import QueryFlowDemo from '../components/query-flow/QueryFlowDemo';
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

const ACCENT = '#7c3aed';

const SECTIONS = [
    { id: 'problem', label: 'Silos' },
    { id: 'architecture', label: 'Semantic RAG' },
    { id: 'demo', label: 'Sandbox' },
];

const problems: TensionItem[] = [
    {
        icon: Database,
        title: 'Fragmented data silos',
        body: 'Financial and operational records span Postgres, Snowflake, and Databricks. Joining schemas across warehouses manually slows down every executive answer.',
        metric: '3+ engines',
        tag: 'Federation',
    },
    {
        icon: Code,
        title: 'SQL ticket bottleneck',
        body: 'Analysts and finance leads wait days in an engineering queue for routine cohort or variance queries, delaying operational decisions.',
        metric: 'Days -> secs',
        tag: 'Self-serve',
    },
    {
        icon: Brain,
        title: 'Schema hallucination gap',
        body: 'Generic chatbots invent column names and join keys. QueryFlow grounds every query against a live semantic metadata catalog before writing SQL.',
        metric: 'Catalog RAG',
        tag: 'Precision',
    },
];

const flowNodes: FlowNodeSpec[] = [
    {
        id: 'scout',
        step: '01',
        title: 'Metadata scout',
        role: 'Catalog RAG',
        icon: Search,
        detail: 'Resolves business terms ("net booking revenue", "active cohorts") against the enterprise Data Catalog to fetch exact table DDL, lineage, and join keys.',
        statePreview: `{
  "entities": ["fact_bookings", "dim_hotel"],
  "catalogMatch": 0.98,
  "verifiedColumns": ["net_thb", "booked_at"]
}`,
        highlightLines: [1, 3],
    },
    {
        id: 'sql',
        step: '02',
        title: 'SQL generator',
        role: 'Dialect compiler',
        icon: Code,
        detail: 'Synthesizes optimized federated Trino SQL with explicit date partitions and cross-warehouse joins between Snowflake and Postgres.',
        statePreview: `{
  "dialect": "trino",
  "joins": ["snowflake.fact", "pg.merchants"],
  "costGuard": "PARTITION_PRUNED"
}`,
        highlightLines: [5, 10],
    },
    {
        id: 'policy',
        step: '03',
        title: 'RBAC & policy gate',
        role: 'Row security',
        icon: ShieldCheck,
        detail: 'Validates the generated AST against user permissions, PII column masks, and query scan limits before touching production compute.',
        statePreview: `{
  "principal": "finance_director",
  "piiMasked": true,
  "readOnly": "VERIFIED",
  "gate": "ALLOW"
}`,
        highlightLines: [12, 16],
    },
    {
        id: 'exec',
        step: '04',
        title: 'Federated execute',
        role: 'Trino + summary',
        icon: Network,
        detail: 'Runs the verified query through Trino, heals syntax or timeout errors automatically, and summarizes anomalies into an executive brief.',
        statePreview: `{
  "rowsReturned": 142,
  "latencyMs": 840,
  "summary": "Q4 margin +3.4% YoY"
}`,
        highlightLines: [14, 19],
    },
];

const AGENT_CODE = `# 1. Ground user question against live Data Catalog
schema = catalog.search(query.entities, top_k=6)

# 2. Synthesize federated SQL with verified DDL
sql = llm.generate_sql(
    prompt=query.text,
    context=schema.ddl,
    dialect="trino",
    read_only=True,
)

# 3. Enforce RBAC + PII policy before execution
if policy_check(user=query.actor, ast=parse_sql(sql)):
    df = trino.execute(sql, timeout_sec=15)
    return insight_engine.summarize(df, sql=sql)
else:
    return { "status": "ACCESS_DENIED", "audit": True }`;

const QueryFlowPage = () => {
    return (
        <SubPageShell statusLabel="System Online" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="QueryFlow Enterprise Data Agent: Federated Text-to-SQL"
                description="Ask in plain words and get verified data. QueryFlow discovers exact schemas via Semantic RAG, checks RBAC policies, and executes federated SQL across Snowflake and Postgres."
                url="https://wutcharin.com/query-flow"
            />
            <SubPageHero
                badgeLabel="Interactive Simulation"
                BadgeIcon={Database}
                titleLead="QueryFlow"
                titleAccent="Enterprise Data Agent."
                accentColor={ACCENT}
                description={
                    <>
                        Ask in plain words. Get verified data back. The agent discovers exact schemas, enforces row-level access, and runs federated SQL
                        across <span className="font-normal text-text-strong">Snowflake</span> and{' '}
                        <span className="font-normal text-text-strong">Postgres</span>.
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
                    eyebrow="Data friction"
                    title="Trusted answers should"
                    accent="not take days."
                    accentColor={ACCENT}
                    lead="Business teams sit on rich multi-warehouse telemetry that remains locked behind manual SQL queues and brittle ad-hoc prompts."
                />
                <TensionLedger items={problems} accentColor={ACCENT} />
            </section>

            {/* 02 · Interactive Semantic RAG diagram */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="architecture"
                    index="02"
                    eyebrow="Semantic RAG"
                    title="Catalog-grounded"
                    accent="federated SQL."
                    accentColor={ACCENT}
                    lead="QueryFlow treats SQL generation as a verified compiler pipeline: catalog discovery, AST security checks, federated execution, and automatic self-correction."
                />
                <InteractiveFlowDiagram
                    nodes={flowNodes}
                    accentColor={ACCENT}
                    filename="agent_core.py"
                    code={AGENT_CODE}
                    cyclicLabel="Execution errors loop back for auto-heal"
                />
            </section>

            {/* 03 · Interactive sandbox */}
            <section id="demo" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <SectionHeader
                    index="03"
                    eyebrow="Interactive sandbox"
                    title="Query the"
                    accent="live federation."
                    accentColor={ACCENT}
                    lead="Run plain-English analytical questions to watch metadata discovery, federated SQL synthesis, and policy-checked execution step by step."
                />
                <DemoStageFrame
                    label="Live Simulation · Federated SQL Agent"
                    accentColor={ACCENT}
                    badges={['Catalog RAG', 'Trino Federation', 'RBAC Guard']}
                >
                    <QueryFlowDemo />
                </DemoStageFrame>
            </section>

            <ProjectNavigation currentId="query-flow" />
        </SubPageShell>
    );
};

export default QueryFlowPage;
