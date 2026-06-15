import { Marquee } from '../lib/motion';

/**
 * Demoted to a divider: one slow mono ticker between the profile and work
 * chapters. The stack reads as ambient telemetry, not a section.
 */
const SKILLS = [
    'AI Agents', 'Agentic Systems', 'Orchestration', 'Guardrails & Evals', 'RAG',
    'LLM Integration', 'Claude Code', 'Claude Skills', 'Python', 'SQL',
    'Prompt Engineering', 'Workflow Automation', 'Machine Learning', 'FinTech',
    'Strategic Transformation', 'Analytics', 'Business Intelligence', 'Financial Modeling',
    'Credit Risk Modeling', 'Data Strategy', 'PowerBI', 'Tableau', 'React', 'TypeScript',
    'n8n', 'Google Cloud', 'Team Leadership', 'Commercial Ops',
];

export default function SkillsMarquee() {
    return (
        <section aria-label="Skills" className="relative overflow-hidden border-y border-text-strong/5 py-10">
            <Marquee speed={85} direction="left" gap={0}>
                {SKILLS.map((s) => (
                    <span key={s} className="shrink-0 inline-flex items-center">
                        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute hover:text-text transition-colors whitespace-nowrap">
                            {s}
                        </span>
                        <span className="mx-6 h-1 w-1 rounded-full bg-violet-400/40" aria-hidden="true" />
                    </span>
                ))}
            </Marquee>
        </section>
    );
}
