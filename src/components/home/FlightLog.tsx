import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { gsap, ScrollTrigger, usePrefersReducedMotion, RevealOnScroll } from '../../lib/motion';
import { sceneBus } from '../../scene/sceneBus';
import { detectTier } from '../../scene/tier';
import { projectWorld } from '../../scene/sampled';
import { ROUTE_WAYPOINTS, routePoint } from '../../scene/formations';
import { career, type Job } from '../../data/career';
import ChapterLabel from './ChapterLabel';
import { SIGNAL } from './scenes';
import { useScrollTo } from './useScrollTo';
import { useOverlayLoop } from './useOverlayLoop';
import Rise from './Rise';

/**
 * Chapter 04: Path. The career began in airline planning, so it reads as a
 * flight log: the field draws the route, a marker flies it with scroll, and
 * each stop is a boarding pass. Narrow screens and reduced motion get the
 * same passes as a vertical itinerary.
 */

const LEGS = ROUTE_WAYPOINTS.length - 1;

function Heading() {
    return (
        <div>
            <ChapterLabel index="04" name="Path" className="mb-6" />
            <Rise
                className="max-w-xl text-4xl leading-[0.95] tracking-[-0.02em] text-text-strong md:text-6xl"
                parts={['From airline networks', { text: 'to agent networks', accent: true }, { text: '.', glue: true }]}
            />
        </div>
    );
}

function Details({ job }: { job: Job }) {
    const [open, setOpen] = useState(false);
    const id = useId();
    return (
        <div className="mt-4">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.28em] text-text-mute transition-colors hover:text-text-strong"
            >
                {open ? 'Hide detail' : 'Full detail'}
                <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            <div id={id} hidden={!open}>
                <ul className="mt-4 space-y-2.5 text-sm font-light leading-relaxed text-text-mute">
                    {job.points.map((p) => (
                        <li key={p} className="flex gap-3">
                            <span className="mt-2 h-px w-3 shrink-0 bg-hairline-strong" aria-hidden="true" />
                            {p}
                        </li>
                    ))}
                </ul>
                {job.link && (
                    <a
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-sm text-signal hover:text-text-strong"
                    >
                        {job.linkText} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                )}
            </div>
        </div>
    );
}

/** The boarding pass: a perforated ticket stub, mono header, one outcome line. */
function Pass({ job, index, current }: { job: Job; index: number; current?: boolean }) {
    const from = index > 0 ? career[index - 1].code : 'ORIGIN';
    return (
        <article className="relative overflow-hidden rounded-xl border border-hairline bg-bg">
            <header className="flex items-center justify-between gap-4 border-b border-dashed border-hairline-strong px-5 py-3 font-mono text-[11px] uppercase tracking-[0.24em] text-text-mute">
                <span className="shrink-0 whitespace-nowrap tabular-nums">
                    Leg {String(index + 1).padStart(2, '0')} / {String(career.length).padStart(2, '0')}
                </span>
                <span className="truncate">
                    {from} <span className="text-signal">→</span> {job.code}
                </span>
                <span className="shrink-0 tabular-nums text-text-strong">{job.year}</span>
            </header>
            <div className="px-5 pb-5 pt-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="text-2xl leading-tight tracking-[-0.01em] text-text-strong md:text-3xl">{job.company}</h3>
                        <p className="mt-1 text-sm text-text">{job.role}</p>
                    </div>
                    {current && (
                        <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-violet-400/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-signal">
                            <span className="h-1 w-1 animate-pulse rounded-full bg-violet-400" aria-hidden="true" />
                            Now
                        </span>
                    )}
                </div>
                <p className="mt-4 font-serif text-lg italic leading-snug text-text-strong md:text-xl">{job.headline}</p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mute">{job.period}</p>
                <Details job={job} />
            </div>
        </article>
    );
}

/** Vertical itinerary: phones, reduced motion, narrow windows. */
function Itinerary() {
    return (
        <div className="relative mx-auto max-w-6xl px-6 py-chapter md:px-10">
            <Heading />
            <ol className="relative mt-16 space-y-6 border-l border-hairline pl-6 md:ml-2 md:max-w-2xl">
                {career.map((job, i) => (
                    <li key={job.role + job.year} className="relative">
                        <span
                            aria-hidden="true"
                            className={`absolute -left-[29px] top-6 h-2 w-2 rounded-full ${i === career.length - 1 ? 'bg-violet-400 shadow-[0_0_18px_rgba(139,92,246,0.6)]' : 'bg-hairline-strong'}`}
                        />
                        <RevealOnScroll>
                            <div data-reveal-child>
                                <Pass job={job} index={i} current={i === career.length - 1} />
                            </div>
                        </RevealOnScroll>
                    </li>
                ))}
            </ol>
        </div>
    );
}

const STEPS = 32;

function RouteStage() {
    const sceneOff = useMemo(() => detectTier() === null, []);
    const sectionRef = useRef<HTMLElement>(null);
    const markerRef = useRef<HTMLDivElement>(null);
    const baseRef = useRef<SVGPathElement>(null);
    const trailRef = useRef<SVGPathElement>(null);
    const stopRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const flown = useRef(0);
    const [active, setActive] = useState(0);
    const scrollTo = useScrollTo();

    // Every frame while on screen: project the route through the live camera
    // so the trail, stops and aircraft sit exactly on the particles.
    useOverlayLoop(sectionRef, () => {
        let d = '';
        for (let i = 0; i <= LEGS * STEPS; i++) {
            const [x, y, z] = routePoint(i / STEPS);
            const [l, t] = projectWorld(x, y, z);
            d += `${i ? 'L' : 'M'}${l.toFixed(2)},${t.toFixed(2)}`;
        }
        baseRef.current?.setAttribute('d', d);
        trailRef.current?.setAttribute('d', d);
        if (trailRef.current) trailRef.current.style.strokeDashoffset = String(1 - flown.current);
        ROUTE_WAYPOINTS.forEach(([x, y], i) => {
            const el = stopRefs.current[i];
            if (!el) return;
            const [l, t] = projectWorld(x, y, 0);
            el.style.left = `${l}%`;
            el.style.top = `${t}%`;
        });
        const m = markerRef.current;
        if (m) {
            const [x, y, z] = routePoint(flown.current * LEGS);
            const [l, t] = projectWorld(x, y, z);
            m.style.left = `${l}%`;
            m.style.top = `${t}%`;
        }
    });

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const scene = () => !sceneOff && sceneBus.apply({ formation: 'route', mode: 'full', chaos: 0.04, accent: SIGNAL, repel: 0.3 });
        let current = -1;
        const ctx = gsap.context(() => {
            ScrollTrigger.create({ trigger: section, start: 'top 55%', end: 'bottom 45%', onEnter: scene, onEnterBack: scene });
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: (self) => {
                    // Fly the full route by ~90% of the pin, then hold on "now".
                    flown.current = Math.min(1, self.progress / 0.9);
                    const i = Math.round(flown.current * LEGS);
                    if (i !== current) {
                        current = i;
                        setActive(i);
                    }
                },
            });
        }, section);
        return () => ctx.revert();
    }, [sceneOff]);

    const goTo = (i: number) => {
        const section = sectionRef.current;
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        const span = section.offsetHeight - window.innerHeight;
        scrollTo(top + span * 0.9 * (i / LEGS) + 2);
    };

    const job = career[active];

    return (
        <section ref={sectionRef} id="path" aria-label="Career path" className="relative h-[340vh]">
            <div className="sticky top-0 h-[100svh] overflow-hidden px-10">
                {/* Route: hairline for the whole itinerary, signal for flown legs. */}
                <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path ref={baseRef} fill="none" stroke="var(--color-hairline-strong)" strokeWidth={1} vectorEffect="non-scaling-stroke" strokeDasharray={sceneOff ? '4 6' : undefined} />
                    <path
                        ref={trailRef}
                        fill="none"
                        stroke="var(--color-signal)"
                        strokeOpacity={0.85}
                        strokeWidth={1.5}
                        vectorEffect="non-scaling-stroke"
                        pathLength={1}
                        strokeDasharray="1 1"
                        strokeDashoffset={1}
                    />
                </svg>

                {/* Stops */}
                {career.map((c, i) => (
                    <button
                        key={c.role + c.year}
                        ref={(el) => {
                            stopRefs.current[i] = el;
                        }}
                        type="button"
                        onClick={() => goTo(i)}
                        className="group absolute -translate-x-1/2 -translate-y-1/2 p-3"
                        aria-label={`Leg ${i + 1}: ${c.company}, ${c.year}`}
                        aria-current={i === active ? 'step' : undefined}
                    >
                        <span
                            className={`block h-2 w-2 rounded-full transition-all duration-500 ${i <= active ? 'bg-violet-400' : 'bg-text-mute/50'} ${i === active ? 'scale-150 shadow-[0_0_18px_rgba(139,92,246,0.6)]' : ''}`}
                        />
                        <span
                            className={`absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap text-center font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${i === active ? 'text-text-strong' : 'text-text-mute group-hover:text-text'}`}
                        >
                            {c.code}
                            <span className="block tabular-nums opacity-70">{c.year}</span>
                        </span>
                    </button>
                ))}

                {/* The aircraft: a bright point riding the arc. */}
                <div ref={markerRef} aria-hidden="true" className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2">
                    <span className="block h-3 w-3 rounded-full border border-violet-300/80 bg-bg shadow-[0_0_18px_rgba(139,92,246,0.6)]" />
                </div>

                <div className="pointer-events-none relative mx-auto flex h-full max-w-6xl flex-col justify-between py-28">
                    <Heading />
                    <div className="pointer-events-auto w-full max-w-md" aria-live="polite">
                        <Pass key={active} job={job} index={active} current={active === career.length - 1} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function FlightLog() {
    const reduced = usePrefersReducedMotion();
    const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth / window.innerHeight >= 1.3 && window.innerWidth >= 1024);

    useEffect(() => {
        const onResize = () => setWide(window.innerWidth / window.innerHeight >= 1.3 && window.innerWidth >= 1024);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    if (reduced || !wide) {
        return (
            <section id="path" aria-label="Career path" className="relative">
                <ItineraryScene />
                <Itinerary />
            </section>
        );
    }
    return <RouteStage />;
}

/** On the itinerary layout the field holds a calm helix behind the list. */
function ItineraryScene() {
    const reduced = usePrefersReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current?.parentElement;
        if (!el || reduced || detectTier() === null) return;
        const apply = () => sceneBus.apply({ formation: 'helix', mode: 'ambient', chaos: 0.1, accent: SIGNAL, repel: 1 });
        const st = ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onEnter: apply, onEnterBack: apply });
        return () => st.kill();
    }, [reduced]);
    return <div ref={ref} hidden />;
}
