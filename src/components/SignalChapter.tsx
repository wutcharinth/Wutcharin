import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, usePrefersReducedMotion } from '../lib/motion';
import { sceneBus } from '../scene/sceneBus';
import type { FormationId } from '../scene/formations';

/**
 * Chapter 02 — the thesis made visible. A pinned viewport where scroll
 * scrubs the particle field from raw noise into ordered formations while
 * three proof stats land in sequence. Replaces the autoplay CinematicReel:
 * the visitor drives the story, nothing rotates on a timer.
 */

const STATS = [
    {
        value: '12,000+',
        unit: 'hours',
        label: 'automated annually',
        detail: 'Measured, compounding time savings from deployed automation and machine learning across finance operations.',
    },
    {
        value: '20+',
        unit: 'agents',
        label: 'in production',
        detail: 'Autonomous workflows across audit, finance, sales, and operations. Shipped. Running. Delivering.',
    },
    {
        value: '50',
        unit: 'people',
        label: 'data professionals led',
        detail: 'Business analysts, data specialists, and PMOs across multiple business units.',
    },
];

const PHASE_FORMATION: FormationId[] = ['noise', 'wave', 'lattice'];

export default function SignalChapter() {
    const reduced = usePrefersReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (reduced) return;
        const section = sectionRef.current;
        if (!section) return;

        let formation: FormationId = 'noise';
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: (self) => {
                    const p = self.progress;
                    // Chaos decays as the visitor scrubs: noise resolves to signal.
                    const next: FormationId = PHASE_FORMATION[Math.min(2, Math.floor(p * 3))];
                    if (next !== formation) {
                        formation = next;
                    }
                    sceneBus.apply({
                        formation,
                        mode: 'full',
                        chaos: Math.max(0.05, 1 - p * 1.1),
                        accent: '#a78bfa',
                    });
                    setActive(Math.min(2, Math.floor(p * 3)));
                },
            });
        }, section);
        return () => ctx.revert();
    }, [reduced]);

    // Reduced motion: no pin, no scrub — a plain readable stat grid.
    if (reduced) {
        return (
            <section id="signal" className="relative py-chapter px-6 md:px-10">
                <ChapterHeading />
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 mt-16">
                    {STATS.map((s) => (
                        <div key={s.label}>
                            <div className="text-5xl md:text-6xl text-text-strong tabular-nums">{s.value}</div>
                            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-signal/70">
                                {s.unit} · {s.label}
                            </div>
                            <p className="mt-4 text-sm text-text-strong/50 font-light leading-relaxed">{s.detail}</p>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} id="signal" className="relative h-[280vh]">
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden px-6 md:px-10">
                <div className="max-w-6xl mx-auto w-full">
                    <ChapterHeading />

                    {/* Stat lockups — stacked, crossfaded by scroll position. */}
                    <div className="relative mt-14 min-h-[40vh]">
                        {STATS.map((s, i) => {
                            const isActive = i === active;
                            return (
                                <div
                                    key={s.label}
                                    className="absolute inset-x-0 top-0 transition-all duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
                                    style={{
                                        opacity: isActive ? 1 : 0,
                                        transform: `translateY(${isActive ? 0 : i < active ? -28 : 28}px)`,
                                        pointerEvents: isActive ? 'auto' : 'none',
                                    }}
                                >
                                    <div className="flex items-baseline gap-3 mb-3">
                                        <span className="font-mono text-[10px] text-text-strong/30 tracking-[0.28em] tabular-nums">
                                            0{i + 1} / 03
                                        </span>
                                        <span className="font-mono text-[10px] text-signal/70 tracking-[0.28em] uppercase">
                                            {s.unit}
                                        </span>
                                    </div>
                                    <div className="text-[clamp(4.5rem,13vw,11rem)] leading-[0.85] tracking-[-0.04em] text-text-strong tabular-nums font-display font-semibold">
                                        {s.value}
                                    </div>
                                    <p className="mt-5 text-xl md:text-2xl text-text-strong/65 font-light">{s.label}</p>
                                    <p className="mt-3 max-w-md text-sm md:text-base text-text-strong/45 font-light leading-relaxed">
                                        {s.detail}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Scrub rail */}
                    <div className="mt-10 flex items-center gap-2" aria-hidden="true">
                        {STATS.map((s, i) => (
                            <span
                                key={s.label}
                                className="h-[2px] w-10 transition-colors duration-500"
                                style={{ backgroundColor: i <= active ? 'rgba(167,139,250,0.9)' : 'rgba(255,255,255,0.12)' }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ChapterHeading() {
    return (
        <div>
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-text-strong/10">
                <span className="h-1 w-1 rounded-full bg-violet-400" />
                <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-text">01 · Signal</span>
            </div>
            <h2 className="text-3xl md:text-5xl tracking-[-0.02em] text-text-strong leading-[0.98] max-w-2xl">
                Noise resolves into <span className="font-serif italic font-normal text-signal">signal</span>.
            </h2>
        </div>
    );
}
