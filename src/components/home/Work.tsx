import { lazy, Suspense, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, ScrambleText, usePrefersReducedMotion, RevealOnScroll } from '../../lib/motion';
import { projects, type Project } from '../../data/projects';
import { sceneBus } from '../../scene/sceneBus';
import { detectTier, simsAllowed } from '../../scene/tier';
import ChapterLabel from './ChapterLabel';
import Poster from './work/Poster';
import SimStage from './work/sims';
import { preloadSims } from './work/sims/loaders';
import { hasSim } from './work/sims/ids';
import { DOES, kind, opens } from './work/specimens/copy';
import { SIGNAL } from './scenes';
import { useScrollTo } from './useScrollTo';
import Rise from './Rise';

const loadSpecimens = () => import('./work/specimens/SpecimenCanvas');
const SpecimenCanvas = lazy(loadSpecimens);

/**
 * Chapter 03: Work.
 *   Theatre: four products, each with a preloaded live 3D simulation. Tighter
 *            pinning (310vh) paired with named interactive tabs and arrow keys.
 *   Index:   everything else, filterable, with an editorial column header,
 *            pointer + keyboard-accessible 3D specimen preview, and enriched
 *            mobile rows showing one-line summaries and stack tags.
 */

const featured = projects
    .filter((p) => p.featured !== undefined)
    .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
const rest = projects.filter((p) => p.featured === undefined);

const COUNT_WORD: Record<number, string> = { 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six' };

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
            <ChapterLabel index="03" name="Work" className="mb-5" />
            <Rise
                className="text-4xl leading-[0.95] tracking-[-0.02em] text-text-strong md:text-6xl"
                parts={['Selected', { text: 'work', accent: true }]}
            />
        </div>
    );
}

/** The words of a case study. The simulation sits beside it, outside the link. */
function PlateCopy({ project, index }: { project: Project; index: number }) {
    return (
        <div>
            <div className="flex items-baseline gap-3 font-mono text-[11px] uppercase tracking-[0.28em]">
                <span className="tabular-nums text-text-mute">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-signal">
                    {project.badge ?? (isExternal(project) ? new URL(project.link).hostname.replace(/^www\./, '') : project.role)}
                </span>
            </div>
            <h3 className="mt-3.5 text-4xl leading-[0.92] tracking-[-0.02em] text-text-strong md:text-5xl xl:text-6xl">{project.title}</h3>
            {project.tagline && <p className="mt-3.5 font-serif text-xl italic text-text md:text-2xl">{project.tagline}</p>}
            <p className="mt-3.5 max-w-md text-sm font-light leading-relaxed text-text-mute md:text-base">{project.desc}</p>

            {/* Technical stack tags as restrained monochrome hairlines. */}
            {project.tags.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technology stack">
                    {project.tags.slice(0, 3).map((tag) => (
                        <li
                            key={tag}
                            className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-mute"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
                <ProjectLink
                    project={project}
                    className={`group inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-2.5 text-sm text-text-strong transition-colors hover:bg-text-strong hover:text-bg ${focusRing}`}
                >
                    {isExternal(project) ? 'Visit live' : 'Open case study'}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </ProjectLink>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-mute">{project.role}</span>
            </div>
        </div>
    );
}

/** A product's live simulation, or its poster where 3D cannot run. */
function Stage({ project, index, running, compact }: { project: Project; index: number; running: boolean; compact: boolean }) {
    const allowed = useMemo(() => simsAllowed(), []);
    const poster = (
        <div className="flex h-full w-full items-center">
            <div className="w-full">
                <Poster project={project} index={index} />
            </div>
        </div>
    );
    if (!allowed || !hasSim(project.id)) return poster;
    return <SimStage id={project.id} running={running} compact={compact} fallback={<StageLoading />} />;
}

function StageLoading() {
    return (
        <div className="frame-ticks flex h-full w-full items-center justify-center rounded-lg border border-hairline">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">Initializing stage</span>
        </div>
    );
}

/** On phones: mount a simulation only while its plate is on screen. */
function StageSlot({ project, index }: { project: Project; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    return (
        <div ref={ref} className="h-[460px] w-full">
            {visible ? <Stage project={project} index={index} running compact /> : <StageLoading />}
        </div>
    );
}

function Theatre() {
    const sectionRef = useRef<HTMLElement>(null);
    const [active, setActive] = useState(0);
    const [inView, setInView] = useState(false);
    const sceneOff = useMemo(() => detectTier() === null, []);
    const scrollTo = useScrollTo();
    const n = featured.length;

    // Preload all 4 simulation chunks well before the user reaches #work.
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || !simsAllowed()) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    preloadSims();
                    io.disconnect();
                }
            },
            { rootMargin: '500px 0px' },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;
        const restField = () => {
            if (!sceneOff) sceneBus.apply({ mode: 'hidden' });
        };
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: 'bottom bottom',
                onUpdate: (self) => setActive(Math.min(n - 1, Math.round(self.progress * (n - 1)))),
            });
            ScrollTrigger.create({
                trigger: section,
                start: 'top 55%',
                end: 'bottom 45%',
                onToggle: (self) => setInView(self.isActive),
                onEnter: restField,
                onEnterBack: restField,
            });
        }, section);
        return () => ctx.revert();
    }, [sceneOff, n]);

    const goTo = (i: number) => {
        const clamped = Math.max(0, Math.min(n - 1, i));
        const section = sectionRef.current;
        if (!section) return;
        const top = section.getBoundingClientRect().top + window.scrollY;
        scrollTo(top + (section.offsetHeight - window.innerHeight) * (clamped / (n - 1)) + 2);
    };

    const onKey = (e: KeyboardEvent) => {
        if ((e.target as HTMLElement).closest('button, a, input')) return;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            goTo(active + 1);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goTo(active - 1);
        }
    };

    const project = featured[active];

    return (
        <section
            ref={sectionRef}
            id="work"
            aria-label="Selected work"
            aria-roledescription="carousel"
            className="relative"
            style={{ height: `${n * 72 + 22}vh` }}
            onKeyDown={onKey}
        >
            <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
                <div className="relative mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-10 pt-20">
                    <Heading />
                    <p className="hidden max-w-xs pb-2 text-right text-sm font-light leading-relaxed text-text-mute lg:block">
                        {COUNT_WORD[n] ?? n} flagship builds running live.
                        <br />
                        Pick any tab below, then interact with the stage.
                    </p>
                </div>

                <div className="relative mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-cols-12 items-center gap-10 px-10 py-5">
                    {/* The copy changes smoothly in place as the stage changes. */}
                    <div className="relative col-span-4 h-full">
                        {featured.map((p, i) => (
                            <div
                                key={p.id}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${i + 1} of ${n}`}
                                aria-hidden={i !== active}
                                className="absolute inset-0 flex flex-col justify-center transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-out-expo)]"
                                style={{
                                    opacity: i === active ? 1 : 0,
                                    transform: `translateY(${(i - active) * 24}px)`,
                                    pointerEvents: i === active ? 'auto' : 'none',
                                    visibility: Math.abs(i - active) > 1 ? 'hidden' : 'visible',
                                }}
                            >
                                <PlateCopy project={p} index={i} />
                            </div>
                        ))}
                    </div>
                    <div className="col-span-8 h-full max-h-[600px] min-h-[360px]">
                        <motion.div
                            key={project.id}
                            className="h-full w-full"
                            initial={{ opacity: 0, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Stage project={project} index={active} running={inView} compact={false} />
                        </motion.div>
                    </div>
                </div>

                {/* Named product tab bar + arrow steppers: see all flagship builds at once. */}
                <div className="relative mx-auto flex w-full max-w-6xl items-end gap-6 px-10 pb-7">
                    <div
                        className="grid flex-1 gap-4"
                        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
                        role="tablist"
                        aria-label="Case studies"
                    >
                        {featured.map((p, i) => {
                            const on = i === active;
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={on}
                                    onClick={() => goTo(i)}
                                    data-cursor="view"
                                    className="group text-left"
                                >
                                    <span className="relative block h-px w-full bg-hairline-strong">
                                        <span
                                            className="absolute inset-0 origin-left bg-signal transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]"
                                            style={{ transform: `scaleX(${i <= active ? 1 : 0})` }}
                                        />
                                    </span>
                                    <span className="mt-2.5 flex items-baseline gap-2">
                                        <span className="font-mono text-[10px] tabular-nums text-text-mute">
                                            0{i + 1}
                                        </span>
                                        <span
                                            className={`truncate font-display text-sm font-medium tracking-[-0.01em] transition-colors ${
                                                on ? 'text-text-strong' : 'text-text-mute group-hover:text-text'
                                            }`}
                                        >
                                            {p.title}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
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
                                data-cursor="step"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline-strong text-text-strong transition-colors hover:border-signal hover:bg-signal/10 disabled:cursor-default disabled:border-hairline disabled:text-text-mute/40 disabled:hover:bg-transparent"
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

/** Phones and reduced motion: the same products, stacked, each simulation live only on screen. */
function Stack() {
    const ref = useRef<HTMLElement>(null);
    const reduced = usePrefersReducedMotion();
    useEffect(() => {
        const el = ref.current;
        if (!el || reduced || detectTier() === null) return;
        const apply = () => sceneBus.apply({ mode: 'hidden' });
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
                            <div data-reveal-child className="space-y-6">
                                <PlateCopy project={p} index={i} />
                                <StageSlot project={p} index={i} />
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
}

function IndexRow({
    project,
    onHover,
    onKeyboardFocus,
}: {
    project: Project;
    onHover: (p: Project | null) => void;
    onKeyboardFocus: (p: Project | null, rect?: DOMRect) => void;
}) {
    const agent = project.tier === 'agent';
    return (
        <ProjectLink
            project={project}
            onMouseEnter={() => onHover(project)}
            onMouseLeave={() => onHover(null)}
            onFocus={(e: React.FocusEvent<HTMLElement>) => onKeyboardFocus(project, e.currentTarget.getBoundingClientRect())}
            onBlur={() => onKeyboardFocus(null)}
            className={`group relative -mx-2 grid grid-cols-12 items-center gap-x-4 rounded-md border-t border-hairline px-2 py-4 transition-[background-color,opacity] duration-300 hover:bg-panel group-hover/index:opacity-40 hover:!opacity-100 focus-visible:!opacity-100 ${focusRing}`}
        >
            {/* A line of signal draws across the row's top edge on hover. */}
            <span
                aria-hidden="true"
                className="absolute inset-x-2 -top-px h-px origin-left scale-x-0 bg-signal transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
            <span className="col-span-1 flex justify-center" aria-hidden="true">
                {agent ? (
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60 [animation-duration:2.4s]" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
                    </span>
                ) : (
                    <span className="h-1.5 w-1.5 rounded-full border border-signal/70" />
                )}
            </span>
            <span className="col-span-7 min-w-0 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-2 sm:col-span-5">
                <ScrambleText
                    text={project.navTitle ?? project.title}
                    onHover
                    className={`truncate text-base font-medium tracking-tight text-text-strong md:text-lg ${agent ? 'font-mono !text-sm md:!text-base' : ''}`}
                />
                {/* Phones lack the hover specimen card: show the crisp 1-line summary + top 2 tags directly. */}
                <span className="mt-1 block text-xs font-light leading-snug text-text-mute sm:hidden">
                    {DOES[project.id] ?? project.tagline ?? project.role}
                </span>
                <span className="mt-1.5 block truncate font-mono text-[9px] uppercase tracking-[0.18em] text-text-mute/80 sm:hidden">
                    {project.tags.slice(0, 2).join(' · ')}
                </span>
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
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || reduced || detectTier() === null) return;
        const apply = () => sceneBus.apply({ formation: 'network', mode: 'ambient', chaos: 0.16, accent: SIGNAL, repel: 1 });
        const st = ScrollTrigger.create({ trigger: el, start: 'top 60%', end: 'bottom 40%', onEnter: apply, onEnterBack: apply });
        return () => st.kill();
    }, [reduced]);

    const [filter, setFilter] = useState<Filter>('all');
    const [hovered, setHoveredState] = useState<Project | null>(null);
    const [shown, setShown] = useState<Project | null>(null);
    const setHovered = (p: Project | null) => {
        setHoveredState(p);
        if (p) setShown(p);
    };
    const [pointerFine] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    const [specimens] = useState(() => simsAllowed());

    useEffect(() => {
        const el = sectionRef.current;
        if (!el || !pointerFine || !specimens) return;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                void loadSpecimens();
                io.disconnect();
            }
        });
        io.observe(el);
        return () => io.disconnect();
    }, [pointerFine, specimens]);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
    const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

    const handleKeyboardFocus = (p: Project | null, rect?: DOMRect) => {
        setHovered(p);
        if (p && rect && pointerFine) {
            const W = 320;
            x.set(Math.max(24, window.innerWidth - W - 36));
            y.set(Math.min(Math.max(rect.top + rect.height / 2, 260), window.innerHeight - 220));
        }
    };

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
                    const W = 320;
                    x.set(e.clientX + 24 + W > window.innerWidth ? e.clientX - 24 - W : e.clientX + 24);
                    y.set(Math.min(Math.max(e.clientY, 292), window.innerHeight - 212));
                }}
            >
                <div className="flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-6">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-signal">Index</p>
                        <p className="mt-2 max-w-md text-sm font-light text-text-mute">
                            Agent demos you can run. Data stories. Lab builds, often shipped in days.
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
                                    filter === f.id ? 'border-signal/40 text-text-strong' : 'border-hairline text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {filter === f.id && (
                                    <motion.span layoutId="index-filter" className="absolute inset-0 rounded-full bg-signal/10" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                                )}
                                <span className="relative">
                                    {f.label} <span className="tabular-nums opacity-60">{String(counts[f.id]).padStart(2, '0')}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editorial column header bar on tablet/desktop. */}
                <div
                    aria-hidden="true"
                    className="hidden grid-cols-12 gap-x-4 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute/70 sm:grid"
                >
                    <span className="col-span-1 text-center">State</span>
                    <span className="col-span-5">Project</span>
                    <span className="col-span-4">Summary</span>
                    <span className="col-span-1 text-right">Kind</span>
                    <span className="col-span-1" />
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
                                <IndexRow project={p} onHover={setHovered} onKeyboardFocus={handleKeyboardFocus} />
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            </div>

            {/* Cursor-following & keyboard-anchored 3D specimen preview card. */}
            {pointerFine && (
                <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-40 w-80" style={{ x: sx, y: sy, translateY: '-50%' }}>
                    <motion.div
                        initial={false}
                        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.96, y: hovered ? 0 : 6 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden rounded-lg border border-hairline-strong bg-bg shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
                    >
                        {shown && (
                            <>
                                <div className="flex items-center justify-between px-4 pb-2 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">
                                    <span className="flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-signal" />
                                        {kind(shown)}
                                    </span>
                                    <span className="tabular-nums">
                                        {String(sorted.indexOf(shown) + 1).padStart(2, '0')} / {String(sorted.length).padStart(2, '0')}
                                    </span>
                                </div>
                                {specimens && (
                                    <div className="h-44 border-y border-hairline">
                                        <Suspense fallback={null}>
                                            <SpecimenCanvas id={shown.id} running={hovered !== null} />
                                        </Suspense>
                                    </div>
                                )}
                                <div className="px-4 pb-3 pt-3">
                                    <p className="font-display text-lg font-semibold leading-tight tracking-[-0.01em] text-text-strong">{shown.title}</p>
                                    {shown.tagline && <p className="mt-0.5 font-serif text-sm italic text-text">{shown.tagline}</p>}
                                    <p className="mt-2 text-xs leading-relaxed text-text-mute">{DOES[shown.id] ?? shown.desc}</p>
                                    <p className="mt-3 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-text-mute">{shown.tags.slice(0, 3).join(' · ')}</p>
                                    <p className="mt-3 flex items-center gap-1.5 border-t border-hairline pt-2.5 text-xs text-text-strong">
                                        {opens(shown)}
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
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
