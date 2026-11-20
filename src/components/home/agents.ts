/**
 * The hero constellation's roster: the agents the team runs, grouped by the
 * domain they serve. The split follows the Proof chapter's agent mix
 * (audit and risk 30%, finance 30%, operations 25%, sales 15%), so 20 nodes
 * read as 6, 6, 5 and 3.
 *
 * Where a public interactive demo exists on this site, `link` connects the
 * constellation node directly to that working build.
 */

export type AgentItem = {
    name: string;
    summary: string;
    /** Optional internal route to an interactive demo on this site. */
    link?: string;
};

export type Domain = {
    id: string;
    name: string;
    agents: AgentItem[];
};

export const DOMAINS: Domain[] = [
    {
        id: 'finance',
        name: 'Finance',
        agents: [
            { name: 'Reconciliation', summary: 'Matches ledger entries against settlement feeds and flags breaks.' },
            { name: 'Collection risk', summary: 'Disputes virtual card overcharges and tracks recovery to close.', link: '/collections' },
            { name: 'Cashback liability', summary: 'Forecasts redemption exposure and variance across promo cohorts.' },
            { name: 'Payout checks', summary: 'Verifies partner remittance batches before release.' },
            { name: 'Month-end close', summary: 'Checks Thai tax documents against the Revenue Code and flags duplicates.', link: '/pidngod' },
            { name: 'Text-to-SQL', summary: 'Turns plain finance questions into traced Trino SQL and tables.', link: '/query-flow' },
        ],
    },
    {
        id: 'audit',
        name: 'Audit & risk',
        agents: [
            { name: 'Transaction audit', summary: 'Screens live transactions against policy, price and conflict rules.', link: '/risk-guard' },
            { name: 'Policy checks', summary: 'Validates approvals and spend limits before posting.' },
            { name: 'Conflict of interest', summary: 'Cross-checks vendor registries against internal relationships.' },
            { name: 'Price benchmark', summary: 'Flags out-of-band quotes against historical market ranges.' },
            { name: 'Card disputes', summary: 'Builds evidence packets and automates chargeback rebuttals.' },
            { name: 'Slip verification', summary: 'Reads bank transfer slips with OCR to catch fakes and reuse.', link: '/slip-verify' },
        ],
    },
    {
        id: 'ops',
        name: 'Operations',
        agents: [
            { name: 'Document OCR', summary: 'Extracts clean structured records from dense multilingual PDFs.', link: '/gemini-ocr' },
            { name: 'Structured data', summary: 'Normalizes unformatted vendor exports into governed schemas.' },
            { name: 'Deep-dive analysis', summary: 'Explains operational revenue and cost movements for leadership.' },
            { name: 'Onboarding guide', summary: 'Walks analysts through team tools, skills and SQL standards.' },
            { name: 'Variance drivers', summary: 'Isolates root causes behind week-on-week operational swings.' },
        ],
    },
    {
        id: 'sales',
        name: 'Sales',
        agents: [
            { name: 'Market research', summary: 'Synthesizes competitor positioning and regional supply signals.' },
            { name: 'Review routing', summary: 'Classifies customer sentiment and routes issues to the right owner.', link: '/review-flow' },
            { name: 'Partner insights', summary: 'Surfaces partner ROI, health scores and retention priorities.' },
        ],
    },
];

export const AGENT_COUNT = DOMAINS.reduce((n, d) => n + d.agents.length, 0);
