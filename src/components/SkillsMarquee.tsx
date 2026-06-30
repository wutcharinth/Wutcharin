import { useState, useEffect } from 'react';
import { Pause, Play } from 'lucide-react';
import { Marquee, usePrefersReducedMotion } from '../lib/motion';

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
    const reduced = usePrefersReducedMotion();
    const [paused, setPaused] = useState(false);

    // Reflect the OS preference: when reduced motion is on, the ticker starts
    // paused (and the toggle reflects that), but stays user-controllable.
    useEffect(() => {
        setPaused(reduced);
    }, [reduced]);

    return (
        <section aria-label="Skills" className="relative overflow-hidden border-y border-text-strong/5 py-10">
            <Marquee speed={85} direction="left" gap={0} paused={paused}>
                {SKILLS.map((s) => (
                    <span key={s} className="shrink-0 inline-flex items-center">
                        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute hover:text-text transition-colors whitespace-nowrap">
                            {s}
                        </span>
                        <span className="mx-6 h-1 w-1 rounded-full bg-signal/40" aria-hidden="true" />
                    </span>
                ))}
            </Marquee>

            {/* Pause/play — WCAG 2.2.2 control for moving content; keyboard reachable. */}
            <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play skills ticker' : 'Pause skills ticker'}
                className="absolute bottom-1.5 right-3 z-10 flex items-center gap-1.5 rounded-full border border-hairline bg-bg/60 backdrop-blur px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-text-mute hover:text-text-strong transition-colors"
            >
                {paused ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
                {paused ? 'Play' : 'Pause'}
            </button>
        </section>
    );
}
