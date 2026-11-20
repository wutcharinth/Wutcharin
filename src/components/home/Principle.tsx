import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap, ScrollTrigger, RevealOnScroll, usePrefersReducedMotion } from '../../lib/motion';
import { projectWorld } from '../../scene/sampled';
import { useOverlayLoop } from './useOverlayLoop';
import ChapterLabel from './ChapterLabel';
import { SIGNAL } from './scenes';
import { useChapterScene } from './useChapterScene';
import { useScrollTo } from './useScrollTo';
import Rise from './Rise';

/**
 * Chapter 02: Principle. A two-act pinned stage (160vh on desktop) where
 * scrolling scrubs meaningfully from the triage thesis (Act 01) into the
 * five-layer production agent stack + 20 reusable Claude Skills (Act 02).
 * Executives can also switch acts immediately with one click.
 */

const STACK_LAYERS = [
    { index: '01', name: 'Orchestration', detail: 'Deterministic state machines, routing and handoffs.' },
    { index: '02', name: 'Memory', detail: 'Scoped context persistence and domain retrieval.' },
    { index: '03', name: 'Tools', detail: 'Governed SQL, API and document connectors.' },
    { index: '04', name: 'Guardrails', detail: 'Policy bounds, anomaly flags and human escalation.' },
    { index: '05', name: 'Tests', detail: 'Automated eval suites before and after every release.' },
] as const;

const triageScene = () => {
    const wide = window.innerWidth / Math.max(1, window.innerHeight) >= 1;
    return wide
        ? ({ formation: 'triage', mode: 'full', chaos: 0.06, accent: SIGNAL, repel: 1 } as const)
        : ({ formation: 'lattice', mode: 'ambient', chaos: 0.1, accent: SIGNAL, repel: 1 } as const);
};

function Lane({ x, y, title, note, accent, dimmed }: { x: number; y: number; title: string; note: string; accent?: boolean; dimmed?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    useOverlayLoop(ref, () => {
        const el = ref.current;
        if (!el) return;
        const [l, t] = projectWorld(x, y, 0);
        el.style.left = `${l}%`;
        el.style.top = `${t}%`;
    });
    return (
        <div
            ref={ref}
            className={`absolute hidden -translate-x-1/2 transition-opacity duration-500 md:block ${dimmed ? 'opacity-25' : 'opacity-100'}`}
            aria-hidden="true"
        >
            <div className={`font-mono text-[11px] uppercase tracking-[0.28em] ${accent ? 'text-signal' : 'text-text-strong'}`}>
                {title}
            </div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mute">{note}</div>
        </div>
    );
}

function ProductionStack({ visible }: { visible: boolean }) {
    return (
        <div className="rounded-lg border border-hairline bg-veil p-5 backdrop-blur-sm md:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-hairline pb-3.5 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">
                <span className="flex items-center gap-2 text-text-strong">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                    Production Agent Architecture
                </span>
                <span className="tabular-nums">5 Layers</span>
            </div>

            <ol className="divide-y divide-hairline">
                {STACK_LAYERS.map((layer, i) => (
                    <li
                        key={layer.index}
                        className="grid grid-cols-12 items-baseline gap-3 py-3 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)]"
                        style={{
                            opacity: visible ? 1 : 0.25,
                            transform: visible ? 'translateX(0)' : 'translateX(10px)',
                            transitionDelay: visible ? `${i * 75}ms` : '0ms',
                        }}
                    >
                        <span className="col-span-2 font-mono text-[11px] tabular-nums text-text-mute">{layer.index}</span>
                        <span className="col-span-4 font-display text-sm font-medium tracking-[-0.01em] text-text-strong md:text-base">
                            {layer.name}
                        </span>
                        <span className="col-span-6 text-xs font-light leading-relaxed text-text-mute md:text-[13px]">
                            {layer.detail}
                        </span>
                    </li>
                ))}
            </ol>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-3.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute">
                <span>Shared practice across FinTech</span>
                <span className="text-signal">20 reusable Claude Skills</span>
            </div>
        </div>
    );
}

export default function Principle() {
    const ref = useRef<HTMLElement>(null);
    const reduced = usePrefersReducedMotion();
    const { sceneOff } = useChapterScene(ref, triageScene);
    const [act, setAct] = useState<0 | 1>(0);
    const scrollTo = useScrollTo();

    useEffect(() => {
        const section = ref.current;
        if (!section || reduced) return;
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: (self) => {
                    setAct(self.progress >= 0.45 ? 1 : 0);
                },
            });
        }, section);
        return () => ctx.revert();
    }, [reduced]);

    const jumpAct = (next: 0 | 1) => {
        setAct(next);
        const section = ref.current;
        if (!section || reduced || window.innerWidth < 768) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        const span = Math.max(0, section.offsetHeight - window.innerHeight);
        if (span > 0) {
            scrollTo(top + span * (next === 0 ? 0.12 : 0.78));
        }
    };

    return (
        <section ref={ref} id="principle" aria-label="Operating principle" className="relative md:h-[160vh]">
            <div className="relative overflow-hidden px-6 py-chapter md:sticky md:top-0 md:flex md:h-[100svh] md:items-center md:px-10 md:py-0">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-bg)_0%,color-mix(in_srgb,var(--color-bg)_65%,transparent)_45%,transparent_66%)] md:block"
                />
                {!sceneOff && (
                    <>
                        <Lane x={5.2} y={3.6} title="Patterns → code" note="The volume · automated" dimmed={act === 1} />
                        <Lane x={5.2} y={-3.9} title="Exceptions → people" note="The edge cases · a person decides" accent dimmed={act === 1} />
                    </>
                )}

                <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-12">
                    <RevealOnScroll staggerChildren={0.1} className="md:col-span-6">
                        <div data-reveal-child className="mb-6 flex flex-wrap items-center justify-between gap-4">
                            <ChapterLabel index="02" name="Principle" />

                            {/* Instant 2-act switcher so skimming executives never wait on scroll. */}
                            <div
                                className="hidden items-center gap-1 rounded-full border border-hairline bg-veil p-1 md:inline-flex"
                                role="tablist"
                                aria-label="Operating principle views"
                            >
                                {(
                                    [
                                        [0, '01 Triage'],
                                        [1, '02 System stack'],
                                    ] as const
                                ).map(([idx, label]) => {
                                    const on = act === idx;
                                    return (
                                        <button
                                            key={label}
                                            type="button"
                                            role="tab"
                                            aria-selected={on}
                                            onClick={() => jumpAct(idx)}
                                            className={`relative rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                                on ? 'text-text-strong' : 'text-text-mute hover:text-text-strong'
                                            }`}
                                        >
                                            {on && (
                                                <motion.span
                                                    layoutId="principle-act"
                                                    aria-hidden="true"
                                                    className="absolute inset-0 rounded-full border border-signal/35 bg-signal/10"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                                />
                                            )}
                                            <span className="relative">{label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <Rise
                            className="text-4xl leading-[0.98] tracking-[-0.02em] text-text-strong md:text-5xl lg:text-6xl"
                            parts={[
                                'Code takes the volume.',
                                { text: 'People take the', line: true },
                                { text: 'judgment', accent: true },
                                { text: '.', glue: true },
                            ]}
                        />

                        <p data-reveal-child className="mt-7 text-base font-light leading-relaxed text-text-mute md:text-lg">
                            For 20 years I have turned data into decisions for C-level leaders, in aviation, media and travel tech. Today
                            I build the teams and the AI that do it at scale.
                        </p>
                        <p data-reveal-child className="mt-4 text-base font-light leading-relaxed text-text-mute md:text-lg">
                            An agent is the small part. The <span className="text-text-strong">system around it</span> is the work: orchestration,
                            memory, tools, guardrails and tests. That is what keeps an agent reliable in production, not only in a demo.
                        </p>
                    </RevealOnScroll>

                    {/* Desktop Act 02 reveal: glides in cleanly over the right stage when scrubbed or toggled. */}
                    <div
                        className={`hidden transition-all duration-700 [transition-timing-function:var(--ease-out-expo)] md:col-span-6 md:block ${
                            act === 1 || reduced ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
                        }`}
                        aria-hidden={!reduced && act !== 1}
                    >
                        <ProductionStack visible={act === 1 || reduced} />
                    </div>

                    {/* Mobile & narrow layout: triage legend + full 5-layer stack directly readable. */}
                    <div className="space-y-8 md:hidden">
                        <dl className="grid grid-cols-2 gap-6 border-t border-hairline pt-6">
                            <div>
                                <dt className="font-mono text-[11px] uppercase tracking-[0.28em] text-text-strong">Patterns → code</dt>
                                <dd className="mt-2 text-sm text-text-mute">The volume, automated end to end.</dd>
                            </div>
                            <div>
                                <dt className="font-mono text-[11px] uppercase tracking-[0.28em] text-signal">Exceptions → people</dt>
                                <dd className="mt-2 text-sm text-text-mute">The edge cases go to a person.</dd>
                            </div>
                        </dl>
                        <ProductionStack visible />
                    </div>
                </div>
            </div>
        </section>
    );
}
