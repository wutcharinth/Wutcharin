import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, ScrollTrigger, usePrefersReducedMotion } from '../../lib/motion';
import { sceneBus } from '../../scene/sceneBus';
import { detectTier } from '../../scene/tier';
import ChapterLabel from './ChapterLabel';
import { numeralScene } from './scenes';

/**
 * Chapter 01: Proof. A pinned stage where the particles themselves become
 * each number as you scrub. Between beats the field passes through noise,
 * so every figure is the thesis performed: chaos, then order.
 */

type Beat = {
    glyph: string;
    value: string;
    unit: string;
    claim: string;
    detail: string;
    mix?: Array<[string, number]>;
};

const BEATS: Beat[] = [
    {
        glyph: '15,000',
        value: '15,000+',
        unit: 'Hours automated per year',
        claim: 'Time given back to finance teams, every year.',
        detail: 'Machine learning, RPA and AI agents. All in daily use. No pilots.',
        mix: [['Collections ML', 40], ['RPA', 28], ['AI agents', 22], ['Dashboards', 10]],
    },
    {
        glyph: '20+',
        value: '20+',
        unit: 'AI agents in production',
        claim: 'Built, live and owned. In four functions.',
        detail: 'Agents for audit, finance, sales and operations. Each one has guardrails and tests.',
        mix: [['Audit & risk', 30], ['Finance', 30], ['Operations', 25], ['Sales', 15]],
    },
    {
        glyph: '12',
        value: '12',
        unit: 'Analytics engineers on the team',
        claim: 'FinTech Data & Automation at Agoda, today.',
        detail: '50+ data professionals led over 20 years. From the first hire to teams of teams.',
    },
    {
        glyph: '20 yrs',
        value: '20',
        unit: 'Years across three industries',
        claim: 'Aviation, travel tech and media.',
        detail: 'Airline planning. Travel analytics at scale. Media strategy. Now, FinTech automation.',
        mix: [['Travel tech', 50], ['Aviation', 30], ['Media', 10], ['Other', 10]],
    },
];

function Mix({ mix }: { mix: NonNullable<Beat['mix']> }) {
    return (
        <div className="mt-8 max-w-md">
            <div className="flex h-1 w-full gap-[3px] overflow-hidden rounded-full" aria-hidden="true">
                {mix.map(([name, pct], i) => (
                    <span
                        key={name}
                        className={i === 0 ? 'bg-signal' : 'bg-text-strong'}
                        style={{ width: `${pct}%`, opacity: i === 0 ? 0.9 : 0.5 - i * 0.12 }}
                    />
                ))}
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-text-mute">
                {mix.map(([name, pct], i) => (
                    <span key={name}>
                        {i > 0 && <span aria-hidden="true"> · </span>}
                        {name} <span className="text-text-strong tabular-nums">{pct}%</span>
                    </span>
                ))}
            </p>
        </div>
    );
}

function BeatCopy({ beat, index, showNumeral }: { beat: Beat; index: number; showNumeral: boolean }) {
    return (
        <>
            <div className="mb-4 flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.28em]">
                <span className="tabular-nums text-text-mute">0{index + 1} / 0{BEATS.length}</span>
                <span className="text-signal">{beat.unit}</span>
            </div>
            <div
                className={
                    showNumeral
                        ? 'font-display text-[clamp(4.5rem,12vw,10rem)] font-semibold leading-[0.85] tracking-[-0.04em] text-text-strong tabular-nums'
                        : 'sr-only'
                }
            >
                {beat.value}
                {showNumeral ? null : ` ${beat.unit}.`}
            </div>
            <p className="mt-6 max-w-md font-display text-2xl font-medium leading-tight tracking-[-0.01em] text-text-strong md:text-3xl">
                {beat.claim}
            </p>
            <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-text-mute md:text-base">{beat.detail}</p>
            {beat.mix && <Mix mix={beat.mix} />}
        </>
    );
}

export default function Proof() {
    const reduced = usePrefersReducedMotion();
    const sceneOff = useMemo(() => detectTier() === null, []);
    const sectionRef = useRef<HTMLElement>(null);
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (reduced) return;
        const section = sectionRef.current;
        if (!section) return;

        // Bake every numeral ahead of time so the first scrub never waits.
        if (!sceneOff) BEATS.forEach((b) => numeralScene(b.glyph));

        let current = -1;
        const show = (i: number) => {
            if (i === current) return;
            current = i;
            setActive(i);
            if (!sceneOff) sceneBus.apply(numeralScene(BEATS[i].glyph));
        };

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top 55%',
                end: 'bottom bottom',
                onEnter: () => show(Math.max(0, current)),
                onEnterBack: () => {
                    const i = current;
                    current = -1;
                    show(Math.max(0, i));
                },
            });
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: (self) => show(Math.min(BEATS.length - 1, Math.floor(self.progress * BEATS.length))),
            });
        }, section);
        return () => ctx.revert();
    }, [reduced, sceneOff]);

    const heading = (
        <div className="mb-10 md:mb-14">
            <ChapterLabel index="01" name="Proof" className="mb-6" />
            <h2 className="max-w-xl text-3xl leading-[0.98] tracking-[-0.02em] text-text-strong md:text-5xl">
                Measured, <span className="font-serif font-normal italic text-signal">not claimed</span>.
            </h2>
        </div>
    );

    if (reduced) {
        return (
            <section id="proof" aria-label="Proof" className="relative px-6 py-chapter md:px-10">
                <div className="mx-auto max-w-6xl">
                    {heading}
                    <div className="grid gap-20 md:grid-cols-2">
                        {BEATS.map((b, i) => (
                            <div key={b.unit}>
                                <BeatCopy beat={b} index={i} showNumeral />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={sectionRef} id="proof" aria-label="Proof" className="relative h-[380vh]">
            <div className="sticky top-0 flex h-[100svh] flex-col justify-end overflow-hidden px-6 pb-16 md:justify-center md:px-10 md:pb-0">
                <div className="mx-auto grid w-full max-w-6xl md:grid-cols-12">
                    <div className="md:col-span-6">
                        {heading}
                        <div className="relative min-h-[23rem] md:min-h-[26rem]">
                            {BEATS.map((b, i) => (
                                <div
                                    key={b.unit}
                                    aria-hidden={i !== active}
                                    className="absolute inset-x-0 top-0 transition-all duration-700 [transition-timing-function:var(--ease-out-expo)]"
                                    style={{
                                        opacity: i === active ? 1 : 0,
                                        transform: `translateY(${i === active ? 0 : i < active ? -24 : 24}px)`,
                                        visibility: i === active ? 'visible' : 'hidden',
                                    }}
                                >
                                    <BeatCopy beat={b} index={i} showNumeral={sceneOff} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scrub rail */}
                <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 md:bottom-12" aria-hidden="true">
                    {BEATS.map((b, i) => (
                        <span
                            key={b.unit}
                            className="h-[2px] w-8 transition-colors duration-500 md:w-10"
                            style={{ backgroundColor: i <= active ? 'var(--color-signal)' : 'var(--color-hairline-strong)' }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
