import type { Project } from '../../../../data/projects';

/**
 * Words for the project index's hover card: what each project does, in one
 * line, matching what its 3D specimen acts out. Drawn from the project's own
 * description; nothing here adds a claim.
 */
export const DOES: Record<string, string> = {
    'risk-guard': 'Tests every transaction as it happens and pulls out the risky ones.',
    'project-flow': 'Runs Scrum on Jira: moves the work, flags scope creep, checks done.',
    'review-flow': 'Reads each review for sentiment and routes it to the team that fixes it.',
    'query-flow': 'A plain question goes in; SQL and a table come out, each number traced.',
    collections: 'Disputes card overcharges: strategy, rebuttal, follow-up, money back.',
    'slip-verify': 'Reads each bank slip and catches the fakes and the reused ones.',
    'karpathy-deep-dive': 'How an LLM reads: tokens rising through the layers to the next one.',
    'human-edge': 'What stays human when machines do the rest.',
    'agentic-ai': 'The ReAct loop from Stanford CS230: reason, act, observe, repeat.',
    'ai-evolution': 'Model size and context length, growing year by year.',
    'future-of-work': 'Which jobs change, and which new ones appear.',
    flowaios: 'Six channels into one inbox, worked by three agents.',
    'resume-builder': 'A résumé written with AI suggestions, shown as you type.',
    'gemini-ocr': 'A complex document goes in; clean, structured fields come out.',
};

/** What clicking the row opens. */
export function opens(p: Project): string {
    if (p.link.startsWith('http')) return `Opens ${new URL(p.link).hostname.replace(/^www\./, '')}`;
    if (p.tier === 'agent') return 'Opens the live demo';
    if (p.tier === 'insight') return 'Opens the interactive story';
    return 'Opens the build';
}

export function kind(p: Project): string {
    if (p.tier === 'agent') return 'Agent · live demo';
    if (p.tier === 'insight') return p.badge ?? 'Story';
    return 'Lab build';
}
