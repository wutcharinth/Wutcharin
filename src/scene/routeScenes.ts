import { projects, type ProjectTier } from '../data/projects';
import type { FormationId } from './formations';
import type { SceneTargets } from './sceneBus';

/**
 * Scene state per route, derived from the project records so accents stay
 * single-sourced. Overrides:
 *  - home runs the full noise field (its chapters re-organize it on scroll)
 *  - the resume builder is a tool — frameloop parked, zero GPU
 *  - the four bespoke long-form pages paint their own opaque backgrounds,
 *    so the field would be invisible work; parked there too
 */

const TIER_FORMATION: Record<ProjectTier, FormationId> = {
    insight: 'wave',
    agent: 'network',
    lab: 'lattice',
};

const derived = Object.fromEntries(
    projects
        .filter((p) => p.link.startsWith('/') && !p.link.endsWith('.html'))
        .map((p) => [
            p.link,
            {
                formation: p.formation ?? TIER_FORMATION[p.tier],
                accent: p.accent,
                mode: 'ambient',
                chaos: 0.15,
            } satisfies Partial<SceneTargets>,
        ]),
);

export const ROUTE_SCENES: Record<string, Partial<SceneTargets>> = {
    ...derived,
    '/': { formation: 'noise', accent: '#a78bfa', mode: 'full', chaos: 1 },
    '/resume-builder': { mode: 'hidden' },
    '/agentic-ai': { mode: 'hidden' },
    '/human-edge': { mode: 'hidden' },
    '/karpathy-deep-dive': { mode: 'hidden' },
    '/future-of-work': { mode: 'hidden' },
};

export const FALLBACK_SCENE: Partial<SceneTargets> = { mode: 'hidden' };
