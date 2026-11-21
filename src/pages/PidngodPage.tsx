import { BookCheck, Github, Play, FileStack, Scale, Clock, History, ShieldCheck, Tags, UserCheck } from 'lucide-react';
import PidngodDemo from '../components/pidngod/PidngodDemo';
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
import { RevealOnScroll } from '../lib/motion';

/** Ledger green: the product's own mark, used here only as a signal. */
const ACCENT = '#43c190';
const REPO = 'https://github.com/wutcharinth/bancheesolution';

const SECTIONS = [
    { id: 'problem', label: 'Problem' },
    { id: 'demo', label: 'Desk' },
    { id: 'engine', label: 'Engine' },
    { id: 'build', label: 'Stack' },
];

const pressures: TensionItem[] = [
    {
        icon: FileStack,
        title: 'Documents arrive from everywhere.',
        body: 'A photo in LINE, a row in Excel, a PDF by email, a folder on a shared drive. One client, one month, four channels.',
        metric: '4 channels',
        tag: 'Intake chaos',
    },
    {
        icon: Scale,
        title: 'Every document has rules.',
        body: 'The seller tax ID has a check digit. A full tax invoice needs the buyer tax ID. Input VAT can be claimed for six months. Withholding tax has a rate and a form.',
        metric: '10 rules',
        tag: 'Revenue Code',
    },
    {
        icon: Clock,
        title: 'The deadline does not move.',
        body: 'VAT and withholding returns each have their own due date, every month, for every client. One late document holds the whole return.',
        metric: 'Monthly',
        tag: 'Filing pressure',
    },
];

const engineNodes: FlowNodeSpec[] = [
    {
        id: 'vendor',
        step: '01',
        title: 'Vendor history',
        role: 'Client memory',
        icon: History,
        detail: 'Checks what this specific client booked for this vendor in previous closes. Every human confirmation strengthens the vendor rule.',
        statePreview: `{
  "vendorTaxId": "0105561084211",
  "priorAccount": "5210 · Cloud & SaaS",
  "confidence": 0.96,
  "source": "vendor_rule"
}`,
        highlightLines: [2, 6],
    },
    {
        id: 'asset',
        step: '02',
        title: 'Asset rule',
        role: 'Capex threshold',
        icon: ShieldCheck,
        detail: "Above the client's capitalization threshold, equipment is automatically classified as a fixed asset rather than an immediate expense.",
        statePreview: `{
  "netSatang": 4200000,
  "thresholdSatang": 2000000,
  "reclassify": "1250 · Office Equipment",
  "vatClaimable": true
}`,
        highlightLines: [8, 12],
    },
    {
        id: 'keywords',
        step: '03',
        title: 'Keywords & checks',
        role: 'Revenue Code',
        icon: Tags,
        detail: 'Runs all 10 Thai Revenue Code validations (check digits, section 86/4 buyer tax ID, duplicate invoice detection, WHT form PND3/53/54).',
        statePreview: `{
  "section86_4": "PASS",
  "duplicateOf": null,
  "whtForm": "PND53 (3%)",
  "matchedCode": "5320"
}`,
        highlightLines: [14, 19],
    },
    {
        id: 'review',
        step: '04',
        title: 'Human confirm',
        role: 'Audit log',
        icon: UserCheck,
        detail: 'Low-confidence or blocked items route to the bookkeeper. Confirming writes an append-only audit entry and updates vendor history.',
        statePreview: `{
  "status": "CONFIRMED",
  "actor": "bookkeeper@firm.th",
  "learnedRule": true,
  "exportReady": "PEAK_CSV"
}`,
        highlightLines: [21, 26],
    },
];

const ENGINE_CODE = `// Deterministic Thai Revenue Code & account-code resolver
export function resolveDocument(ctx: FirmCtx, doc: TaxDoc) {
  const history = ctx.vendorRules.get(doc.sellerTaxId);
  if (history && history.confirmations >= 1) {
    return { code: history.account, conf: 0.96, source: 'vendor' };
  }

  // Capitalize equipment above the client's asset threshold (satang)
  if (doc.category === 'equipment' && doc.baseSatang >= ctx.assetFloor) {
    return { code: '1250', conf: 0.92, source: 'asset_rule' };
  }

  // Run 10 Revenue Code checks: check digit, 86/4, 6-mo VAT, duplicates
  const findings = runRevenueChecks(ctx, doc);
  const dup = findDuplicateInvoice(ctx.docs, doc);
  if (dup) {
    return { status: 'DUPLICATE_HELD', dupOf: dup.id, findings };
  }

  // Escalate ambiguous items; confirmations become next month's rule
  const guess = matchClientChart(ctx.chart, doc.description);
  return {
    code: guess.code,
    review: guess.conf < 0.85 || findings.some((f) => f.sev === 'block'),
    auditLog: 'APPEND_ONLY',
  };
}`;

const checks = [
    'Seller tax ID check digit',
    'Buyer tax ID on a full tax invoice (section 86/4)',
    'Seller VAT registration',
    'VAT at 7% of the base amount',
    'Six-month window for input VAT',
    'Duplicates: same vendor and document number',
    'Disallowed input VAT, folded into the expense',
    'PP36 for services bought from abroad',
    'Withholding tax rate and form (PND3, PND53, PND54)',
    'A hint when withholding tax may have been missed',
];

const build = [
    ['Runtime', 'Cloudflare Workers. A Hono API and a static React app in one deploy.'],
    ['Data', 'D1 for the books, R2 for the original documents. Every query is scoped to the signed-in firm.'],
    ['AI', 'Gemini reads uploaded photos and PDFs, on the server only. The browser never sees the key.'],
    ['Money', 'Stored as whole satang everywhere. No floating point in the ledger.'],
    ['Control', 'The model suggests and a person confirms. Every action goes to an append-only audit log.'],
];

const PidngodPage = () => {
    return (
        <SubPageShell statusLabel="POC · Live demo" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="Pidngod (POC): month-end close for Thai bookkeepers"
                description="A proof of concept. Pidngod checks each document against the Thai Revenue Code, catches duplicates and suggests the account code. Try the real check engine on 18 sample documents."
                url="https://wutcharin.com/pidngod"
            />
            <SubPageHero
                badgeLabel="Proof of concept"
                BadgeIcon={BookCheck}
                titleLead="Pidngod"
                titleAccent="Close the month."
                accentColor={ACCENT}
                figureLabel="Ledger Engine · 10 Rules"
                description={
                    <>
                        The monthly workbench for Thai bookkeepers and small accounting firms. It checks each document against the Revenue Code, catches
                        duplicates, suggests the account code from each client&rsquo;s own books and exports a file the accounting software can import.{' '}
                        <span className="text-text-mute">
                            The name is Thai: <span lang="th">ปิดงวด</span>, &ldquo;close the period&rdquo;.
                        </span>
                    </>
                }
                primaryCta={{ label: 'Try the review desk', href: '#demo', icon: Play }}
                secondaryCta={{ label: 'Source on GitHub', href: REPO, icon: Github, external: true }}
            />

            {/* 01 · The month-end problem */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="problem"
                    index="01"
                    eyebrow="The month-end problem"
                    title="Dozens of clients, closed"
                    accent="every month."
                    accentColor={ACCENT}
                    lead="A small Thai accounting firm reconciles hundreds of receipts, tax invoices, and withholding slips per client against immovable Revenue Department deadlines."
                />
                <TensionLedger items={pressures} accentColor={ACCENT} />
            </section>

            {/* 02 · The live review desk */}
            <section id="demo" className="mx-auto mb-24 max-w-7xl scroll-mt-24 px-4 md:mb-32 md:px-10">
                <div className="mx-auto max-w-6xl">
                    <SectionHeader
                        index="02"
                        eyebrow="The review desk"
                        title="Not a recording."
                        accent="The real engine."
                        accentColor={ACCENT}
                        lead={
                            <div className="space-y-4">
                                <p>
                                    The product&rsquo;s own check engine runs in your browser on 18 sample documents for one client. Every decision you make
                                    updates the filing deadlines and the PEAK export live.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] tracking-[0.14em] text-text-mute">
                                    <span className="rounded-full border border-hairline px-2.5 py-1">
                                        <b className="text-text-strong">06</b> duplicate of 01
                                    </span>
                                    <span className="rounded-full border border-hairline px-2.5 py-1">
                                        <b className="text-text-strong">17</b> teaches new vendor rule
                                    </span>
                                    <span className="rounded-full border border-hairline px-2.5 py-1">
                                        <b className="text-text-strong">12 &amp; 13</b> blocked VAT
                                    </span>
                                </div>
                            </div>
                        }
                    />
                </div>
                <DemoStageFrame
                    label="Live Engine · 18 Sample Documents"
                    accentColor={ACCENT}
                    badges={['Whole Satang Ledger', 'Revenue Code Rules', 'PEAK Export']}
                >
                    <PidngodDemo />
                </DemoStageFrame>
                <p className="mx-auto mt-4 max-w-6xl text-xs leading-relaxed text-text-mute">
                    Sample data only: the companies, tax IDs and amounts are invented. Reading photos and PDFs with AI runs server-side, so this browser desk starts right after extraction.
                </p>
            </section>

            {/* 03 · Interactive decision pipeline & 10 Revenue Code checks */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="engine"
                    index="03"
                    eyebrow="How it decides"
                    title="Four deterministic stages,"
                    accent="in order."
                    accentColor={ACCENT}
                    lead="Each answer carries a reason and a confidence score. A human correction becomes next month's vendor rule automatically."
                />
                <InteractiveFlowDiagram
                    nodes={engineNodes}
                    accentColor={ACCENT}
                    filename="src/engine/resolve.ts"
                    code={ENGINE_CODE}
                    cyclicLabel="Confirmed correction updates vendor history"
                />

                <RevealOnScroll staggerChildren={0.04} className="mt-12 rounded-lg border border-hairline bg-panel/50 p-6 md:p-8">
                    <p data-reveal-child className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute">
                        10 automated Revenue Code validations
                    </p>
                    <ul className="mt-5 grid gap-x-10 sm:grid-cols-2">
                        {checks.map((c, idx) => (
                            <li
                                key={c}
                                data-reveal-child
                                className="flex items-baseline gap-3 border-b border-hairline py-3 text-sm text-text last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
                            >
                                <span className="font-mono text-[10px] tabular-nums" style={{ color: ACCENT }}>
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <span>{c}</span>
                            </li>
                        ))}
                    </ul>
                </RevealOnScroll>
            </section>

            {/* 04 · How it is built */}
            <section className="mx-auto mb-16 max-w-6xl px-6 md:mb-24 md:px-10">
                <SectionHeader
                    id="build"
                    index="04"
                    eyebrow="How it is built"
                    title="Small, fast, and"
                    accent="strict about money."
                    accentColor={ACCENT}
                    lead="Status: proof of concept (POC). The core loop works end to end and the check engine is unit-tested. Payroll forms and bank reconciliation are next."
                />
                <RevealOnScroll staggerChildren={0.06} className="mt-10 border-t border-hairline">
                    <dl>
                        {build.map(([k, v]) => (
                            <div
                                key={k}
                                data-reveal-child
                                className="grid grid-cols-[7rem_minmax(0,1fr)] gap-x-6 border-b border-hairline py-5 transition-colors hover:bg-panel/40 sm:px-2"
                            >
                                <dt className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text-mute">{k}</dt>
                                <dd className="text-base font-light leading-relaxed text-text-strong">{v}</dd>
                            </div>
                        ))}
                    </dl>
                </RevealOnScroll>
            </section>

            <ProjectNavigation currentId="pidngod" />
        </SubPageShell>
    );
};

export default PidngodPage;
