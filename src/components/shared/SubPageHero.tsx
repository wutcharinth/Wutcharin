import { type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { MagneticButton, SplitText } from '../../lib/motion';
import { projects } from '../../data/projects';

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
}

const ease = [0.16, 1, 0.3, 1] as const;
const featuredCount = projects.filter((p) => p.featured !== undefined).length;

/**
 * Hero for every project page, in the home page's system: mono eyebrow,
 * display title with a serif accent line, plain description, an executive
 * meta row (role, stack, case number) read from the project data, and
 * two CTAs. Flat by default; the project hue appears only as a signal.
 */
export default function SubPageHero({ badgeLabel, BadgeIcon, titleLead, titleAccent, description, accentColor, primaryCta, secondaryCta }: SubPageHeroProps) {
    const { pathname } = useLocation();
    const project = projects.find((p) => p.link === pathname);

    const { scrollY } = useScroll();
    const lift = useTransform(scrollY, [0, 500], [0, -60]);
    const fade = useTransform(scrollY, [0, 420], [1, 0.25]);

    return (
        <section className="relative overflow-hidden">
            <motion.div style={{ y: lift, opacity: fade }} className="relative mx-auto max-w-6xl px-6 pb-20 pt-14 md:px-10 md:pb-28 md:pt-20">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6, ease }}
                    className="mb-8 inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1"
                >
                    {BadgeIcon ? (
                        <BadgeIcon className="h-3 w-3" style={{ color: accentColor }} aria-hidden="true" />
                    ) : (
                        <span className="h-1 w-1 rounded-full" style={{ backgroundColor: accentColor }} aria-hidden="true" />
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text">{badgeLabel}</span>
                </motion.div>

                <h1 className="max-w-4xl">
                    <SplitText
                        as="span"
                        trigger="load"
                        mode="words"
                        stagger={0.06}
                        duration={1}
                        className="block text-5xl leading-[0.95] tracking-[-0.02em] text-text-strong md:text-7xl lg:text-8xl"
                    >
                        {titleLead}
                    </SplitText>
                    <span className="block" style={{ color: accentColor }}>
                        <SplitText
                            as="span"
                            trigger="load"
                            mode="words"
                            stagger={0.06}
                            delay={0.2}
                            duration={1}
                            className="mt-1 block font-serif text-5xl font-normal italic leading-[1] tracking-[-0.01em] md:text-7xl lg:text-8xl"
                        >
                            {titleAccent}
                        </SplitText>
                    </span>
                </h1>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8, ease }}
                    className="mt-10 max-w-2xl text-lg font-light leading-relaxed text-text md:text-xl"
                >
                    {description}
                </motion.div>

                {(primaryCta || secondaryCta) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="mt-10 flex flex-wrap gap-3"
                    >
                        {primaryCta && <CtaButton {...primaryCta} primary accentColor={accentColor} />}
                        {secondaryCta && <CtaButton {...secondaryCta} accentColor={accentColor} />}
                    </motion.div>
                )}

                {project && (
                    <motion.dl
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3, duration: 0.8 }}
                        className="mt-16 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-6 border-t border-hairline pt-6 md:grid-cols-4"
                    >
                        <Meta label="Role">{project.role}</Meta>
                        <Meta label="Stack">{project.tags.slice(0, 3).join(' · ')}</Meta>
                        <Meta label="Type">{project.badge ?? (project.tier === 'agent' ? 'AI agent' : project.tier === 'lab' ? 'Lab build' : 'Insight')}</Meta>
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
        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            data-cursor={primary ? 'view' : 'open'}
        >
            {/* MagneticButton wraps children in an inline-block span: lay out here. */}
            <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" style={primary ? undefined : { color: accentColor }} aria-hidden="true" />
                {label}
            </span>
        </MagneticButton>
    );
}
