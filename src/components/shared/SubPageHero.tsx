import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { MagneticButton, SplitText, usePrefersReducedMotion } from '../../lib/motion';
import { projects } from '../../data/projects';
import { detectTier } from '../../scene/tier';

const SpecimenCanvas = lazy(() => import('../home/work/specimens/SpecimenCanvas'));

const SPECIMEN_IDS = new Set([
    'risk-guard',
    'project-flow',
    'review-flow',
    'query-flow',
    'collections',
    'slip-verify',
    'karpathy-deep-dive',
    'human-edge',
    'agentic-ai',
    'ai-evolution',
    'future-of-work',
    'flowaios',
    'resume-builder',
    'gemini-ocr',
]);

interface SubPageHeroProps {
    /** Small mono label (e.g. "Interactive Simulation"). */
    badgeLabel: string;
    BadgeIcon?: LucideIcon;
    /** Title, set in the display face. */
    titleLead: string;
    /** Second line, set in the serif italic voice in the project's hue. */
    titleAccent: string;
    description: ReactNode;
    /** The project's identity hue (hex). Used sparingly: dot, accent line, rule. */
    accentColor: string;
    /** Kept for API compatibility; no longer drawn (no gradients). */
    accentColor2?: string;
    primaryCta?: { label: string; href: string; icon?: LucideIcon; external?: boolean };
    secondaryCta?: { label: string; href: string; icon?: LucideIcon; external?: boolean };
    /** Kept for API compatibility; the case number now comes from the data. */
    index?: string;
    /** Optional explicit specimen ID override (defaults to current project ID). */
    specimenId?: string;
    /** Optional telemetry caption inside the specimen frame. */
    figureLabel?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;
const featuredCount = projects.filter((p) => p.featured !== undefined).length;

/**
 * Hero for every subpage, aligned with Home's Arrival chapter: split editorial
 * typography on the left paired with a live corner-ticked 3D Specimen (or
 * animated schematic fallback) on the right, plus an executive 4-column meta row.
 */
export default function SubPageHero({
    badgeLabel,
    BadgeIcon,
    titleLead,
    titleAccent,
    description,
    accentColor,
    primaryCta,
    secondaryCta,
    specimenId,
    figureLabel,
}: SubPageHeroProps) {
    const { pathname } = useLocation();
    const project = projects.find((p) => p.link === pathname);
    const resolvedSpecimen = specimenId ?? (project && SPECIMEN_IDS.has(project.id) ? project.id : undefined);

    const { scrollY } = useScroll();
    const lift = useTransform(scrollY, [0, 520], [0, -48]);
    const fade = useTransform(scrollY, [0, 460], [1, 0.3]);

    return (
        <section className="relative overflow-hidden">
            <motion.div
                style={{ y: lift, opacity: fade }}
                className="relative mx-auto max-w-6xl px-6 pb-20 pt-10 md:px-10 md:pb-24 md:pt-14"
            >
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6, ease }}
                            className="mb-7 inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1"
                        >
                            {BadgeIcon ? (
                                <BadgeIcon className="h-3 w-3" style={{ color: accentColor }} aria-hidden="true" />
                            ) : (
                                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
                            )}
                            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text">{badgeLabel}</span>
                        </motion.div>

                        <h1>
                            <SplitText
                                as="span"
                                trigger="load"
                                mode="words"
                                stagger={0.05}
                                duration={0.95}
                                className="block text-5xl leading-[0.94] tracking-[-0.02em] text-text-strong md:text-6xl lg:text-7xl"
                            >
                                {titleLead}
                            </SplitText>
                            <span className="block" style={{ color: accentColor }}>
                                <SplitText
                                    as="span"
                                    trigger="load"
                                    mode="words"
                                    stagger={0.05}
                                    delay={0.18}
                                    duration={0.95}
                                    className="mt-1 block font-serif text-5xl font-normal italic leading-[1] tracking-[-0.01em] md:text-6xl lg:text-7xl"
                                >
                                    {titleAccent}
                                </SplitText>
                            </span>
                        </h1>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.65, duration: 0.75, ease }}
                            className="mt-8 max-w-xl text-base font-light leading-relaxed text-text md:text-lg"
                        >
                            {description}
                        </motion.div>

                        {(primaryCta || secondaryCta) && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.7, ease }}
                                className="mt-9 flex flex-wrap gap-3"
                            >
                                {primaryCta && <CtaButton {...primaryCta} primary accentColor={accentColor} />}
                                {secondaryCta && <CtaButton {...secondaryCta} accentColor={accentColor} />}
                            </motion.div>
                        )}
                    </div>

                    {/* Right-side Studio Specimen Stage (3D model or animated blueprint schematic) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35, duration: 0.85, ease }}
                        className="lg:col-span-5"
                    >
                        <HeroSpecimenStage
                            specimenId={resolvedSpecimen}
                            accentColor={accentColor}
                            title={project?.title ?? titleLead}
                            figureLabel={figureLabel ?? (resolvedSpecimen ? '3D Specimen · Live' : 'System Schematic · Live')}
                            category={project?.badge ?? badgeLabel}
                        />
                    </motion.div>
                </div>

                {project && (
                    <motion.dl
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.95, duration: 0.75 }}
                        className="mt-14 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-hairline pt-6 md:grid-cols-4"
                    >
                        <Meta label="Role">{project.role}</Meta>
                        <Meta label="Stack">{project.tags.slice(0, 3).join(' · ')}</Meta>
                        <Meta label="Type">
                            {project.badge ?? (project.tier === 'agent' ? 'AI agent' : project.tier === 'lab' ? 'Lab build' : 'Insight')}
                        </Meta>
                        <Meta label={project.featured ? 'Case study' : 'Status'}>
                            {project.featured ? (
                                <span className="tabular-nums">
                                    {String(project.featured).padStart(2, '0')} / {String(featuredCount).padStart(2, '0')}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
                                    {project.tier === 'agent' ? 'Live demo' : 'Interactive'}
                                </span>
                            )}
                        </Meta>
                    </motion.dl>
                )}
            </motion.div>
        </section>
    );
}

function HeroSpecimenStage({
    specimenId,
    accentColor,
    title,
    figureLabel,
    category,
}: {
    specimenId?: string;
    accentColor: string;
    title: string;
    figureLabel: string;
    category: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(true);
    const reduced = usePrefersReducedMotion();
    const can3D = useMemo(() => Boolean(specimenId) && !reduced && detectTier() !== null, [specimenId, reduced]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className="frame-ticks relative aspect-[5/4] w-full overflow-hidden rounded-lg border border-hairline bg-panel/60 lg:aspect-square"
        >
            {/* Subtle top telemetry bar */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 font-mono text-[9px] uppercase tracking-[0.24em] text-text-mute">
                <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
                    {figureLabel}
                </span>
                <span className="tabular-nums opacity-70">{category}</span>
            </div>

            {can3D && specimenId ? (
                <Suspense fallback={<SchematicFallback accentColor={accentColor} reduced={reduced} />}>
                    <SpecimenCanvas id={specimenId} running={inView} />
                </Suspense>
            ) : (
                <SchematicFallback accentColor={accentColor} reduced={reduced} />
            )}

            {/* Bottom registration caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between border-t border-hairline/70 bg-bg/75 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.22em] text-text-mute backdrop-blur-sm">
                <span className="truncate text-text-strong">{title}</span>
                <span className="shrink-0 opacity-75">Interactive below ↓</span>
            </div>
        </div>
    );
}

/** Crisp animated architectural orbital schematic for non-3D or reduced-motion heroes. */
function SchematicFallback({ accentColor, reduced }: { accentColor: string; reduced: boolean }) {
    return (
        <div className="flex h-full w-full items-center justify-center p-8" aria-hidden="true">
            <svg viewBox="0 0 260 260" className="h-full w-full max-w-[240px]">
                {/* Precision crosshair & concentric guide rings */}
                <line x1="130" y1="18" x2="130" y2="242" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="3 5" />
                <line x1="18" y1="130" x2="242" y2="130" stroke="currentColor" strokeOpacity="0.12" strokeDasharray="3 5" />
                <circle cx="130" cy="130" r="94" fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
                <circle cx="130" cy="130" r="62" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="130" cy="130" r="28" fill="none" stroke={accentColor} strokeOpacity="0.6" strokeWidth="1.25" />

                {/* Orbiting signal arc */}
                <motion.circle
                    cx="130"
                    cy="130"
                    r="94"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="64 530"
                    animate={reduced ? undefined : { rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
                    style={{ originX: '130px', originY: '130px' }}
                />

                {/* Cardinal nodes */}
                {[
                    [130, 36],
                    [224, 130],
                    [130, 224],
                    [36, 130],
                ].map(([cx, cy], idx) => (
                    <g key={idx}>
                        <circle cx={cx} cy={cy} r="4" fill="var(--color-bg)" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.2" />
                        <circle cx={cx} cy={cy} r="1.5" fill={idx === 0 ? accentColor : 'currentColor'} />
                    </g>
                ))}

                {/* Center core */}
                <motion.circle
                    cx="130"
                    cy="130"
                    r="7"
                    fill={accentColor}
                    animate={reduced ? undefined : { opacity: [0.55, 1, 0.55], scale: [0.92, 1.08, 0.92] }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                    style={{ originX: '130px', originY: '130px' }}
                />
            </svg>
        </div>
    );
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute">{label}</dt>
            <dd className="mt-2 text-sm text-text-strong">{children}</dd>
        </div>
    );
}

function CtaButton({
    label,
    href,
    icon: Icon = ArrowRight,
    external,
    primary,
    accentColor,
}: {
    label: string;
    href: string;
    icon?: LucideIcon;
    external?: boolean;
    primary?: boolean;
    accentColor: string;
}) {
    const isHash = href.startsWith('#');
    const handleClick = (e: React.MouseEvent) => {
        if (!isHash) return;
        e.preventDefault();
        const target = document.getElementById(href.slice(1));
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <MagneticButton
            as="a"
            href={href}
            onClick={handleClick}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className={`group rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors ${
                primary ? 'bg-text-strong text-bg hover:bg-signal' : 'border border-hairline-strong text-text-strong hover:bg-text-strong/5'
            }`}
            data-cursor={primary ? 'play' : 'open'}
        >
            <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={primary ? undefined : { color: accentColor }} aria-hidden="true" />
                {label}
            </span>
        </MagneticButton>
    );
}
