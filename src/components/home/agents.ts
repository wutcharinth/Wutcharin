/**
 * The hero constellation's roster: the agents the team runs, grouped by the
 * domain they serve. The split follows the Proof chapter's agent mix
 * (audit and risk 30%, finance 30%, operations 25%, sales 15%), so 20 nodes
 * read as 6, 6, 5 and 3.
 *
 * The names are kinds of work taken from the résumé and the site, not an
 * official inventory. Edit them here to match the production roster; the
 * constellation lays itself out from this list.
 */

export type Domain = { id: string; name: string; agents: string[] };

export const DOMAINS: Domain[] = [
    {
        id: 'finance',
        name: 'Finance',
        agents: ['Reconciliation', 'Collection risk', 'Cashback liability', 'Payout checks', 'Month-end close', 'Text-to-SQL'],
    },
    {
        id: 'audit',
        name: 'Audit & risk',
        agents: ['Transaction audit', 'Policy checks', 'Conflict of interest', 'Price benchmark', 'Card disputes', 'Slip verification'],
    },
    {
        id: 'ops',
        name: 'Operations',
        agents: ['Document OCR', 'Structured data', 'Deep-dive analysis', 'Onboarding guide', 'Variance drivers'],
    },
    {
        id: 'sales',
        name: 'Sales',
        agents: ['Market research', 'Review routing', 'Partner insights'],
    },
];

export const AGENT_COUNT = DOMAINS.reduce((n, d) => n + d.agents.length, 0);
