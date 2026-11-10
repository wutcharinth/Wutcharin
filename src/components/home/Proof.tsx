import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, ScrollTrigger, usePrefersReducedMotion } from '../../lib/motion';
import { sceneBus } from '../../scene/sceneBus';
import { detectTier } from '../../scene/tier';
import ChapterLabel from './ChapterLabel';
import { numeralScene } from './scenes';
import { useScrollTo } from './useScrollTo';
import Rise from './Rise';

/**
 * Chapter 01: Proof. A pinned stage where the particles themselves become
 * each number as you scrub. Between beats the field passes through noise,
 * so every figure is the thesis performed: chaos, then order.
 */

type Beat = {
    glyph: string;
    value: string;
    unit: string;
    /** Two or three words for the stage rail. */
    short: string;
    claim: string;
    detail: string;
    mix?: Array<[string, number]>;
};

const BEATS: Beat[] = [
    {
        glyph: '15,000',
        value: '15,000+',
        unit: 'Hours automated per year',
        short: 'Hours a year',
        claim: 'Time given back to finance teams, every year.',
        detail: 'Machine learning, RPA and AI agents. All in daily use. No pilots.',
        mix: [['Collections ML', 40], ['RPA', 28], ['AI agents', 22], ['Dashboards', 10]],
    },
    {
        glyph: '20+',
        value: '20+',
        unit: 'AI agents in production',
        short: 'Agents live',
        claim: 'Built, live and owned. In four functions.',
        detail: 'Agents for audit, finance, sales and operations. Each one has guardrails and tests.',
        mix: [['Audit & risk', 30], ['Finance', 30], ['Operations', 25], ['Sales', 15]],
    },
    {
        glyph: '12',
        value: '12',
        unit: 'Analytics engineers on the team',
        short: 'Engineers',
        claim: 'FinTech Data & Automation at Agoda, today.',
        detail: '50+ data professionals led over 20 years. From the first hire to teams of teams.',
    },
    {
        glyph: '20 yrs',
        value: '20',
        unit: 'Years across three industries',
        short: 'Years',
        claim: 'Aviation, travel tech and media.',
        detail: 'Airline planning. Travel analytics at scale. Media strategy. Now, FinTech automation.',
        mix: [['Travel tech', 50], ['Aviation', 30], ['Media', 10], ['Other', 10]],
    },
];

function Mix({ mix, active }: { mix: NonNullable<Beat['mix']>; active: boolean }) {
    return (
        <div className="mt-8 max-w-md">
            <div className="flex h-1 w-full gap-[3px] overflow-hidden rounded-full" aria-hidden="true">
                {mix.map(([name, pct], i) => (
                    <span
                        key={name}
                        className={`origin-left transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-expo)] ${i === 0 ? 'bg-signal' : 'bg-text-strong'}`}
                        style={{
                            width: `${pct}%`,
                            opacity: i === 0 ? 0.9 : 0.5 - i * 0.12,
                            // Each share draws in after the one before it.
                            transform: `scaleX(${active ? 1 : 0})`,
                            transitionDelay: active ? `${250 + i * 110}ms` : '0ms',
                        }}
                    />
                ))}
            </div>
            <p className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-text-mute">
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

function BeatCopy({ beat, index, showNumeral, active = true }: { beat: Beat; index: number; showNumeral: boolean; active?: boolean }) {
    return (
        <>
            <div className="mb-4 flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.28em]">
                <span className="shrink-0 whitespace-nowrap tabular-nums text-text-mute">0{index + 1} / 0{BEATS.length}</span>
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
            {beat.mix && <Mix mix={beat.mix} active={active} />}
        </>
    );
}

export default function Proof() {
    const reduced = usePrefersReducedMotion();
    const sceneOff = useMemo(() => detectTier() === null, []);
    const sectionRef = useRef<HTMLElement>(null);
    const [active, setActive] = useState(0);
    const fillRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const scrollTo = useScrollTo();

    // Jump to the middle of a beat's share of the pin.
    const goTo = (i: number) => {
        const section = sectionRef.current;
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        scrollTo(top + (section.offsetHeight - window.innerHeight) * ((i + 0.5) / BEATS.length));
    };

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
                onUpdate: (self) => {
                    const at = self.progress * BEATS.length;
                    show(Math.min(BEATS.length - 1, Math.floor(at)));
                    // The rail fills with the scroll: past beats full, the
                    // current one as far as you are through it.
                    fillRefs.current.forEach((el, i) => {
                        if (el) el.style.transform = `scaleX(${Math.min(1, Math.max(0, at - i))})`;
                    });
                },
            });
        }, section);
        return () => ctx.revert();
    }, [reduced, sceneOff]);

    const heading = (
        <div className="mb-10 md:mb-14">
            <ChapterLabel index="01" name="Proof" className="mb-6" />
            <Rise
                className="max-w-xl text-3xl leading-[0.98] tracking-[-0.02em] text-text-strong md:text-5xl"
                parts={['Measured,', { text: 'not claimed', accent: true }, { text: '.', glue: true }]}
            />
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
        <section ref={sectionRef} id="proof" aria-label="Proof" className="relative h-[320vh]">
            <div className="sticky top-0 flex h-[100svh] flex-col justify-end overflow-hidden px-6 pb-28 md:justify-center md:px-10 md:pb-0">
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
                                    <BeatCopy beat={b} index={i} showNumeral={sceneOff} active={i === active} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stage rail: all four figures at a glance. It fills with the
                    scroll, names where you are, and jumps on click. */}
                <div className="absolute inset-x-0 bottom-0 px-6 pb-5 md:px-10 md:pb-8">
                    <ol className="mx-auto flex max-w-6xl gap-3 md:gap-6">
                        {BEATS.map((b, i) => (
                            <li key={b.unit} className="min-w-0 flex-1">
                                <button
                                    type="button"
                                    onClick={() => goTo(i)}
                                    aria-label={`${b.value} ${b.unit}`}
                                    aria-current={i === active ? 'step' : undefined}
                                    className="group block w-full pt-3 text-left"
                                >
                                    <span className="relative block h-px w-full bg-hairline-strong">
                                        <span
                                            ref={(el) => {
                                                fillRefs.current[i] = el;
                                            }}
                                            className="absolute inset-0 origin-left bg-signal"
                                            style={{ transform: `scaleX(${i === 0 ? 0.02 : 0})` }}
                                        />
                                    </span>
                                    <span
                                        className={`mt-3 block font-display text-base font-semibold leading-none tracking-[-0.02em] tabular-nums transition-colors duration-500 md:text-xl ${
                                            i === active ? 'text-text-strong' : 'text-text-mute group-hover:text-text'
                                        }`}
                                    >
                                        {b.value}
                                    </span>
                                    <span
                                        className={`mt-1.5 hidden truncate font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-500 sm:block ${
                                            i === active ? 'text-text' : 'text-text-mute/70 group-hover:text-text-mute'
                                        }`}
                                    >
                                        {b.short}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </section>
    );
}
