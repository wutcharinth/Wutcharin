import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, ScrambleText, TiltCard, usePrefersReducedMotion, RevealOnScroll } from '../../lib/motion';
import { projects, type Project } from '../../data/projects';
import { sceneBus } from '../../scene/sceneBus';
import { detectTier } from '../../scene/tier';
import ChapterLabel from './ChapterLabel';
import Poster from './work/Poster';
import { useScrollTo } from './useScrollTo';
import Rise from './Rise';

/**
 * Chapter 03: Work.
 *   Theatre: the five case studies as a horizontal, scroll-driven gallery of
 *            full-height plates. As each plate centres, the field behind it
 *            becomes that project's formation and accent.
 *   Index:   everything else, filterable, with a cursor-following reel
 *            preview on pointer devices.
 */

const featured = projects
    .filter((p) => p.featured !== undefined)
    .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
const rest = projects.filter((p) => p.featured === undefined);

type Filter = 'all' | 'agent' | 'insight' | 'lab';
const FILTERS: Array<{ id: Filter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'agent', label: 'Agents' },
    { id: 'insight', label: 'Insights' },
    { id: 'lab', label: 'Lab' },
];

const isExternal = (p: Project) => p.link.startsWith('http') || p.link.endsWith('.html');

function ProjectLink({ project, className, children, ...rest }: { project: Project; className?: string; children: ReactNode } & Record<string, unknown>) {
    if (isExternal(project)) {
        return (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className={className} data-cursor="open" {...rest}>
                {children}
            </a>
        );
    }
    return (
        <Link to={project.link} className={className} data-cursor="view" {...rest}>
            {children}
        </Link>
    );
}

const focusRing =
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-signal/70';

function Heading() {
    return (
        <div>
            <ChapterLabel index="03" name="Work" className="mb-6" />
            <Rise
                className="text-4xl leading-[0.95] tracking-[-0.02em] text-text-strong md:text-6xl"
                parts={['Selected', { text: 'work', accent: true }]}
            />
        </div>
    );
}

function Plate({ project, index, total }: { project: Project; index: number; total: number }) {
    return (
        <ProjectLink
            project={project}
            className={`group grid h-full w-full grid-cols-1 items-center gap-8 rounded-xl md:grid-cols-12 md:gap-10 ${focusRing}`}
            aria-label={`${project.title}: ${project.tagline ?? project.role}. Case study ${index + 1} of ${total}.`}
        >
            <div className="order-2 md:order-1 md:col-span-5">
                <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.28em]">
                    <span className="tabular-nums text-text-mute">{String(index + 1).padStart(2, '0')}</span>
                    <span style={{ color: project.accent }}>{project.badge ?? project.role}</span>
                </div>
                {/* Long titles step down a size so the plate never outgrows its stage. */}
                <h3
                    className={`mt-4 text-4xl leading-[0.92] tracking-[-0.02em] text-text-strong transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-2 ${
                        project.title.length > 20 ? 'md:text-5xl lg:text-[3.5rem]' : 'md:text-6xl lg:text-7xl'
                    }`}
                >
                    {project.title}
                </h3>
                {project.tagline && <p className="mt-4 font-serif text-xl italic text-text md:text-2xl">{project.tagline}</p>}
                <p className="mt-4 line-clamp-3 max-w-md text-sm font-light leading-relaxed text-text-mute md:text-base">{project.desc}</p>
                <div className="mt-8 flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-2.5 text-sm text-text-strong transition-colors group-hover:bg-text-strong group-hover:text-bg">
                        {isExternal(project) ? 'Visit live' : 'Open case study'}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-text-mute lg:inline">{project.role}</span>
                </div>
            </div>
            <div className="order-1 md:order-2 md:col-span-7">
                {/* The frame leans toward the cursor and catches a little light. */}
                <TiltCard max={5} lift={6} parallax={false} className="rounded-lg">
                    <Poster project={project} index={index} />
                </TiltCard>
            </div>
        </ProjectLink>
    );
}

function Theatre() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const sceneOff = useMemo(() => detectTier() === null, []);
    const scrollTo = useScrollTo();
    const n = featured.length;

    useEffect(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;
        let current = -1;
        const take = (i: number) => {
            if (i === current) return;
            current = i;
            setActive(i);
            const p = featured[i];
            if (!sceneOff) sceneBus.apply({ formation: p.formation ?? 'network', accent: p.accent, chaos: 0.12, mode: 'full', repel: 1 });
        };
        // The track is scroll-driven but dwells on each plate: scroll moves
        // it only through the middle of each step, so wherever the visitor
        // stops, a whole case study is in frame rather than two halves.
        const dwell = (p: number) => {
            const s = p * (n - 1);
            const i = Math.min(n - 2, Math.floor(s));
            const f = Math.min(1, Math.max(0, (s - i - 0.28) / 0.44));
            return (i + f * f * (3 - 2 * f)) / (n - 1);
        };
        const ctx = gsap.context(() => {
            gsap.to(track, {
                // First plate to last plate, exactly: every plate rests on the
                // same left edge at any viewport width.
                x: () => {
                    const first = track.firstElementChild as HTMLElement | null;
                    const last = track.lastElementChild as HTMLElement | null;
                    return first && last ? -(last.offsetLeft - first.offsetLeft) : 0;
                },
                ease: dwell,
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => take(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
                },
            });
            ScrollTrigger.create({
                trigger: section,
                start: 'top 55%',
                end: 'bottom 45%',
                onEnter: () => {
                    const i = Math.max(0, current);
                    current = -1;
                    take(i);
                },
                onEnterBack: () => {
                    const i = Math.max(0, current);
                    current = -1;
                    take(i);
                },
            });
        }, section);
        return () => ctx.revert();
    }, [sceneOff, n]);

    const goTo = (i: number) => {
        const section = sectionRef.current;
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        scrollTo(top + (section.offsetHeight - window.innerHeight) * (i / (n - 1)) + 2);
    };

    const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            goTo(Math.min(n - 1, active + 1));
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goTo(Math.max(0, active - 1));
        }
    };

    return (
        <section
            ref={sectionRef}
            id="work"
            aria-label="Selected work"
            aria-roledescription="carousel"
            className="relative"
            style={{ height: `${n * 90 + 40}vh` }}
            onKeyDown={onKey}
        >
            <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
                {/* Reading floor: the active plate's copy sits left, so the
                    left of the stage settles the field without hiding it. */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--color-bg)_0%,color-mix(in_srgb,var(--color-bg)_70%,transparent)_42%,transparent_68%)]"
                />
                <div className="relative mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-10 pt-24">
                    <Heading />
                    <p className="hidden max-w-xs pb-2 text-right text-sm font-light leading-relaxed text-text-mute lg:block">
                        Five case studies. Scroll, or use the arrows.
                        <br />
                        The background changes with each one.
                    </p>
                </div>

                <div className="relative flex flex-1 items-center">
                    <div ref={trackRef} className="flex h-[62vh] items-center gap-[8vw] pl-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] pr-[10vw] will-change-transform">
                        {featured.map((p, i) => (
                            <div
                                key={p.id}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${i + 1} of ${n}`}
                                className="h-full w-[min(82vw,1120px)] shrink-0 transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-out-expo)]"
                                // Plates off stage sit back: smaller and dimmer.
                                style={{ opacity: i === active ? 1 : 0.22, transform: `scale(${i === active ? 1 : 0.9})` }}
                            >
                                <Plate project={p} index={i} total={n} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Counter + progress: always know where you are. */}
                <div className="relative mx-auto flex w-full max-w-6xl items-center gap-6 px-10 pb-10 font-mono text-[11px] uppercase tracking-[0.28em] text-text-mute">
                    <span className="tabular-nums text-text-strong">
                        {String(active + 1).padStart(2, '0')} <span className="text-text-mute">/ {String(n).padStart(2, '0')}</span>
                    </span>
                    <div className="flex flex-1 gap-1.5" role="tablist" aria-label="Case studies">
                        {featured.map((p, i) => (
                            <button
                                key={p.id}
                                type="button"
                                role="tab"
                                aria-selected={i === active}
                                aria-label={p.title}
                                onClick={() => goTo(i)}
                                className="group h-6 flex-1"
                            >
                                <span
                                    className="block h-[2px] w-full transition-colors duration-500 group-hover:bg-text-strong/60"
                                    style={{ backgroundColor: i <= active ? 'var(--color-signal)' : 'var(--color-hairline-strong)' }}
                                />
                            </button>
                        ))}
                    </div>
                    <span className="hidden max-w-[16rem] truncate md:inline">{featured[active].title}</span>
                    <div className="flex items-center gap-2">
                        {(
                            [
                                ['Previous case study', active - 1, ArrowLeft],
                                ['Next case study', active + 1, ArrowRight],
                            ] as const
                        ).map(([label, to, Icon]) => (
                            <button
                                key={label}
                                type="button"
                                aria-label={label}
                                disabled={to < 0 || to > n - 1}
                                onClick={() => goTo(to)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline-strong text-text-strong transition-colors hover:border-signal hover:bg-signal/10 disabled:cursor-default disabled:border-hairline disabled:text-text-mute/40 disabled:hover:bg-transparent"
                            >
                                <Icon className="h-4 w-4" aria-hidden="true" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/** Phones and reduced motion: the same plates, stacked. */
function Stack() {
    const ref = useRef<HTMLElement>(null);
    const reduced = usePrefersReducedMotion();
    useEffect(() => {
        const el = ref.current;
        if (!el || reduced || detectTier() === null) return;
        const apply = () => sceneBus.apply({ formation: 'network', mode: 'ambient', chaos: 0.16, accent: '#a78bfa', repel: 1 });
        const st = ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 45%', onEnter: apply, onEnterBack: apply });
        return () => st.kill();
    }, [reduced]);
    return (
        <section ref={ref} id="work" aria-label="Selected work" className="relative px-6 py-chapter md:px-10">
            <div className="mx-auto max-w-6xl">
                <Heading />
                <div className="mt-14 space-y-20">
                    {featured.map((p, i) => (
                        <RevealOnScroll key={p.id}>
                            <div data-reveal-child>
                                <Plate project={p} index={i} total={featured.length} />
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}

function IndexRow({ project, onHover }: { project: Project; onHover: (p: Project | null) => void }) {
    const agent = project.tier === 'agent';
    return (
        <ProjectLink
            project={project}
            onMouseEnter={() => onHover(project)}
            onMouseLeave={() => onHover(null)}
            className={`group relative grid grid-cols-12 items-center gap-x-4 border-t border-hairline px-2 py-4 -mx-2 rounded-md transition-[background-color,opacity] duration-300 hover:bg-panel group-hover/index:opacity-40 hover:!opacity-100 focus-visible:!opacity-100 ${focusRing}`}
        >
            {/* The row's own accent draws across its top edge on hover. */}
            <span
                aria-hidden="true"
                className="absolute inset-x-2 -top-px h-px origin-left scale-x-0 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-x-100"
                style={{ backgroundColor: project.accent }}
            />
            <span className="col-span-1 flex justify-center" aria-hidden="true">
                {agent ? (
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 [animation-duration:2.4s]" style={{ backgroundColor: project.accent }} />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.accent }} />
                    </span>
                ) : (
                    <span className="h-1.5 w-1.5 rounded-full border" style={{ borderColor: project.accent }} />
                )}
            </span>
            <span className="col-span-7 min-w-0 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-2 sm:col-span-5">
                <ScrambleText
                    text={project.navTitle ?? project.title}
                    onHover
                    className={`truncate text-base font-medium tracking-tight text-text-strong md:text-lg ${agent ? 'font-mono !text-sm md:!text-base' : ''}`}
                />
                {/* Phones have no room for the tagline column: it sits under the name. */}
                <span className="mt-0.5 block truncate text-xs font-light text-text-mute sm:hidden">{project.tagline ?? project.role}</span>
            </span>
            <span className="hidden truncate font-mono text-[11px] uppercase tracking-[0.18em] text-text-mute sm:col-span-4 sm:block">
                {project.tagline ?? project.role}
            </span>
            <span className="col-span-3 truncate text-right font-mono text-[11px] uppercase tracking-[0.18em] text-text-mute sm:col-span-1">
                {agent ? 'Live' : project.tier === 'insight' ? 'Story' : 'Build'}
            </span>
            <span className="col-span-1 flex justify-end">
                <ArrowUpRight className="h-4 w-4 text-text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-strong" aria-hidden="true" />
            </span>
        </ProjectLink>
    );
}

function Index() {
    const sectionRef = useRef<HTMLElement>(null);
    const reduced = usePrefersReducedMotion();
    // The index is for reading: the field steps back to an ambient network.
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || reduced || detectTier() === null) return;
        const apply = () => sceneBus.apply({ formation: 'network', mode: 'ambient', chaos: 0.16, accent: '#a78bfa', repel: 1 });
        const st = ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 40%', onEnter: apply, onEnterBack: apply });
        return () => st.kill();
    }, [reduced]);
    const [filter, setFilter] = useState<Filter>('all');
    const [hovered, setHovered] = useState<Project | null>(null);
    const [pointerFine] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
    const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

    const counts = useMemo(
        () => ({
            all: rest.length,
            agent: rest.filter((p) => p.tier === 'agent').length,
            insight: rest.filter((p) => p.tier === 'insight').length,
            lab: rest.filter((p) => p.tier === 'lab').length,
        }),
        [],
    );
    const visible = filter === 'all' ? rest : rest.filter((p) => p.tier === filter);
    const order = { agent: 0, insight: 1, lab: 2 } as const;
    const sorted = [...visible].sort((a, b) => order[a.tier] - order[b.tier]);

    return (
        <section ref={sectionRef} id="index" aria-label="Project index" className="relative px-6 pb-chapter md:px-10">
            <div
                className="mx-auto max-w-6xl"
                onMouseMove={(e) => {
                    x.set(e.clientX);
                    y.set(e.clientY);
                }}
            >
                <div className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-6">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-signal">Index</p>
                        <p className="mt-2 max-w-md text-sm font-light text-text-mute">
                            Agents in production. Data stories. Lab builds, often shipped in days.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filter projects">
                        {FILTERS.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                role="radio"
                                aria-checked={filter === f.id}
                                onClick={() => setFilter(f.id)}
                                className={`relative rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.24em] transition-colors ${
                                    filter === f.id ? 'border-violet-400/40 text-text-strong' : 'border-hairline text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {filter === f.id && (
                                    <motion.span layoutId="index-filter" className="absolute inset-0 rounded-full bg-violet-500/10" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                                )}
                                <span className="relative">
                                    {f.label} <span className="tabular-nums opacity-60">{String(counts[f.id]).padStart(2, '0')}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <motion.ul layout className="group/index border-b border-hairline">
                    <AnimatePresence initial={false} mode="popLayout">
                        {sorted.map((p) => (
                            <motion.li
                                key={p.id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <IndexRow project={p} onHover={setHovered} />
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            </div>

            {/* Cursor-following reel preview: pointer devices only. */}
            {pointerFine && (
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none fixed left-0 top-0 z-40 w-72"
                    style={{ x: sx, y: sy, translateX: '24px', translateY: '-50%' }}
                >
                    <AnimatePresence>
                        {hovered && (
                            <motion.div
                                key={hovered.id}
                                initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute inset-x-0 top-0 shadow-[0_0_18px_rgba(139,92,246,0.25)]"
                            >
                                <Poster project={hovered} index={rest.indexOf(hovered)} compact />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </section>
    );
}

export default function Work() {
    const reduced = usePrefersReducedMotion();
    const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
    useEffect(() => {
        const onResize = () => setWide(window.innerWidth >= 1024);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return (
        <>
            {wide && !reduced ? <Theatre /> : <Stack />}
            <Index />
        </>
    );
}
