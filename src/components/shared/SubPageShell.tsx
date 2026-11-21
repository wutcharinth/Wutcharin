import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { openConsole, isMac } from '../console/consoleBus';
import { useBangkokTime } from '../home/useBangkokTime';
import { useLenis } from '../../lib/scroll/ScrollProvider';

export interface SubPageSection {
    id: string;
    label: string;
}

interface SubPageShellProps {
    /** Legacy prop, unused. */
    accent?: string;
    /** Label next to the live status dot. */
    statusLabel?: string;
    /** The project's identity hue (hex): status dot and reading-progress line. */
    accentColor?: string;
    /** Optional section anchors for the 1280px+ left Chapter Rail. */
    sections?: SubPageSection[];
    children: ReactNode;
}

/**
 * Shared frame for every subpage, aligned with the home page's Black Console
 * and Daylight Console system: viewport-ceiling 1px reading-progress rule,
 * scroll-aware floating pill console header, optional left section rail on
 * wide viewports, and unified Bangkok-time footer.
 */
export default function SubPageShell({
    statusLabel = 'Live demo',
    accentColor = '#a78bfa',
    sections,
    children,
}: SubPageShellProps) {
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.25 });
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string>(sections?.[0]?.id ?? '');
    const [mac] = useState(isMac);
    const [touch] = useState(() => window.matchMedia('(hover: none)').matches);
    const time = useBangkokTime();
    const lenis = useLenis();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 36);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!sections?.length) return;
        const els = sections
            .map((s) => document.getElementById(s.id))
            .filter((el): el is HTMLElement => el !== null);
        if (!els.length) return;

        const io = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target.id) {
                    setActiveSection(visible[0].target.id);
                }
            },
            { rootMargin: '-25% 0px -45% 0px', threshold: [0.05, 0.25, 0.5] },
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [sections]);

    const jumpTo = (id: string) => {
        const target = document.getElementById(id);
        if (!target) return;
        if (lenis) {
            lenis.scrollTo(target, { offset: -96 });
        } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const scrollToTop = () => {
        if (lenis) {
            lenis.scrollTo(0);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative min-h-screen font-sans text-text">
            {/* Viewport-ceiling 1px reading progress rule, in the project's identity hue */}
            <motion.div
                aria-hidden="true"
                style={{ scaleX: progress, backgroundColor: accentColor }}
                className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[1.5px] origin-left"
            />

            {/* Scroll-aware floating capsule console matching Home's Header.tsx */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-3.5 sm:px-6"
                style={{ paddingTop: 'calc(0.875rem + env(safe-area-inset-top))' }}
            >
                <nav
                    aria-label="Project"
                    className={`pointer-events-auto mx-auto flex h-12 max-w-5xl items-center justify-between gap-3 rounded-full border px-4 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] sm:px-5 ${
                        scrolled
                            ? 'border-hairline-strong bg-bg/90 shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-md'
                            : 'border-hairline bg-bg/70 backdrop-blur-sm'
                    }`}
                >
                    <Link
                        to="/#work"
                        data-cursor="back"
                        className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-text-mute transition-colors hover:text-text-strong"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
                        <span>Work</span>
                    </Link>

                    {/* Compact section switcher inside the pill when sections are provided (md+) */}
                    {sections && sections.length > 0 && (
                        <div className="hidden items-center gap-1 md:flex" role="navigation" aria-label="On this page">
                            {sections.map((s) => {
                                const on = activeSection === s.id;
                                return (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => jumpTo(s.id)}
                                        data-cursor="step"
                                        className={`relative rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                            on ? 'text-text-strong' : 'text-text-mute hover:text-text'
                                        }`}
                                    >
                                        {on && (
                                            <motion.span
                                                layoutId="subpage-nav-pill"
                                                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                                className="absolute inset-0 -z-10 rounded-full border border-hairline-strong bg-panel"
                                            />
                                        )}
                                        {s.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex items-center gap-2.5">
                        <span className="hidden items-center gap-2 lg:flex">
                            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                                <span
                                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 [animation-duration:2.4s]"
                                    style={{ backgroundColor: accentColor }}
                                />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute">{statusLabel}</span>
                        </span>
                        <button
                            type="button"
                            onClick={openConsole}
                            data-cursor="explore"
                            className="flex items-center gap-2 rounded-full border border-hairline py-1 pl-3 pr-1 font-mono text-[10px] uppercase tracking-[0.22em] text-text-mute transition-colors hover:border-hairline-strong hover:text-text-strong"
                            aria-label="Open console: search projects and sections"
                        >
                            {touch ? 'Menu' : 'Console'}
                            {!touch && (
                                <kbd className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[9px] tracking-normal text-text">
                                    {mac ? '⌘K' : 'Ctrl K'}
                                </kbd>
                            )}
                        </button>
                        <ThemeToggle />
                    </div>
                </nav>
            </motion.header>

            {/* Desktop left Chapter Rail (1280px+) mirroring the home page */}
            {sections && sections.length > 0 && (
                <aside
                    aria-label="Page sections"
                    className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 xl:flex xl:flex-col xl:gap-3"
                >
                    <div className="relative flex flex-col gap-3 pl-3">
                        <span aria-hidden="true" className="absolute bottom-1 left-0 top-1 w-px bg-hairline" />
                        <motion.span
                            aria-hidden="true"
                            style={{ scaleY: progress, backgroundColor: accentColor }}
                            className="absolute bottom-1 left-0 top-1 w-px origin-top"
                        />
                        {sections.map((s, idx) => {
                            const on = activeSection === s.id;
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => jumpTo(s.id)}
                                    data-cursor="step"
                                    className="group flex items-center gap-2.5 text-left"
                                >
                                    <span
                                        className={`h-px transition-all duration-300 ${
                                            on ? 'w-4 bg-text-strong' : 'w-2 bg-hairline-strong group-hover:w-3 group-hover:bg-text-mute'
                                        }`}
                                    />
                                    <span
                                        className={`font-mono text-[10px] tabular-nums tracking-[0.2em] transition-colors ${
                                            on ? 'text-text-strong' : 'text-text-mute/70 group-hover:text-text'
                                        }`}
                                    >
                                        0{idx + 1}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </aside>
            )}

            <main id="main-content" className="relative z-10 pb-20 pt-24">
                {children}
            </main>

            <footer className="relative z-10 border-t border-hairline px-6 py-8">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute sm:flex-row">
                    <span>© {new Date().getFullYear()} Wutcharin Thatan</span>
                    <span className="tabular-nums">
                        Bangkok <span className="text-text-strong">{time}</span> · ICT (UTC+7)
                    </span>
                    <button
                        type="button"
                        onClick={scrollToTop}
                        data-cursor="step"
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-text-strong"
                    >
                        Back to top <ArrowUp className="h-3 w-3" aria-hidden="true" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
