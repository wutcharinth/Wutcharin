import { useRef } from 'react';
import { RevealOnScroll } from '../../lib/motion';
import { projectWorld } from '../../scene/sampled';
import { useOverlayLoop } from './useOverlayLoop';
import ChapterLabel from './ChapterLabel';
import { SIGNAL } from './scenes';
import { useChapterScene } from './useChapterScene';
import Rise from './Rise';

/**
 * Chapter 02: Principle. The field becomes a triage: one dense stream
 * enters, most of it settles into an ordered lane (patterns, code), a few
 * luminous outliers peel off (exceptions, people). How the teams run,
 * shown in five seconds.
 */

const triageScene = () => {
    const wide = window.innerWidth / Math.max(1, window.innerHeight) >= 1;
    return wide
        ? ({ formation: 'triage', mode: 'full', chaos: 0.06, accent: SIGNAL, repel: 1 } as const)
        : ({ formation: 'lattice', mode: 'ambient', chaos: 0.1, accent: SIGNAL, repel: 1 } as const);
};

function Lane({ x, y, title, note, accent }: { x: number; y: number; title: string; note: string; accent?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    // Registered to the live camera, so the label rides the parallax with
    // the lane it names.
    useOverlayLoop(ref, () => {
        const el = ref.current;
        if (!el) return;
        const [l, t] = projectWorld(x, y, 0);
        el.style.left = `${l}%`;
        el.style.top = `${t}%`;
    });
    return (
        <div ref={ref} className="absolute hidden -translate-x-1/2 md:block" aria-hidden="true">
            <div className={`font-mono text-[11px] uppercase tracking-[0.28em] ${accent ? 'text-signal' : 'text-text-strong'}`}>
                {title}
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mute">{note}</div>
        </div>
    );
}

export default function Principle() {
    const ref = useRef<HTMLElement>(null);
    const { sceneOff } = useChapterScene(ref, triageScene);

    return (
        <section ref={ref} id="principle" aria-label="Operating principle" className="relative md:h-[170vh]">
            {/* Pinned stage on desktop: the lane labels stay registered to the
                fixed field while the chapter holds the screen. */}
            <div className="relative overflow-hidden px-6 py-chapter md:sticky md:top-0 md:flex md:h-[100svh] md:items-center md:px-10 md:py-0">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-bg)_0%,color-mix(in_srgb,var(--color-bg)_60%,transparent)_40%,transparent_60%)] md:block"
            />
            {!sceneOff && (
                <>
                    <Lane x={5.2} y={3.6} title="Patterns → code" note="The volume · automated" />
                    <Lane x={5.2} y={-3.9} title="Exceptions → people" note="The edge cases · a person decides" accent />
                </>
            )}

            <div className="relative mx-auto w-full max-w-6xl">
                <RevealOnScroll staggerChildren={0.1} className="max-w-xl">
                    <div data-reveal-child>
                        <ChapterLabel index="02" name="Principle" className="mb-6" />
                    </div>
                    <Rise
                        className="text-4xl leading-[0.98] tracking-[-0.02em] text-text-strong md:text-6xl"
                        parts={['Most work repeats. The skill is to see', { text: 'what does not', accent: true }, { text: '.', glue: true }]}
                    />
                    <p data-reveal-child className="mt-8 text-base font-light leading-relaxed text-text-mute md:text-lg">
                        For 20 years I have turned data into decisions for C-level leaders, in aviation, media and travel tech. Today
                        I build the teams and the AI that do it at scale.
                    </p>
                    <p data-reveal-child className="mt-4 text-base font-light leading-relaxed text-text-mute md:text-lg">
                        An agent is the small part. The <span className="text-text-strong">system around it</span> is the work: orchestration,
                        memory, tools, guardrails and tests. That is what keeps an agent reliable in production, not only in a demo. My
                        team now shares the practice as 20 reusable Claude Skills.
                    </p>
                </RevealOnScroll>

                {/* Mobile and no-WebGL legend: the same idea, in type. */}
                <dl className={`mt-14 grid max-w-xl grid-cols-2 gap-6 border-t border-hairline pt-6 ${sceneOff ? '' : 'md:hidden'}`}>
                    <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.28em] text-text-strong">Patterns → code</dt>
                        <dd className="mt-2 text-sm text-text-mute">The volume, automated end to end.</dd>
                    </div>
                    <div>
                        <dt className="font-mono text-[11px] uppercase tracking-[0.28em] text-signal">Exceptions → people</dt>
                        <dd className="mt-2 text-sm text-text-mute">The edge cases go to a person.</dd>
                    </div>
                </dl>
            </div>
            </div>
        </section>
    );
}
