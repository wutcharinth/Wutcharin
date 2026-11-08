import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { openConsole, isMac } from '../console/consoleBus';
import { useBangkokTime } from '../home/useBangkokTime';

interface SubPageShellProps {
    /** Legacy prop, unused. */
    accent?: string;
    /** Label next to the live status dot. */
    statusLabel?: string;
    /** The project's identity hue (hex): status dot and reading-progress line. */
    accentColor?: string;
    children: ReactNode;
}

/**
 * Shared frame for every project page, in the home page's system:
 * a quiet top bar (back to Work, live status, console, theme), a solid
 * reading-progress line in the project hue, and the home footer.
 * "Back" returns to the Work chapter, not the top of the home page.
 */
export default function SubPageShell({ statusLabel = 'Live demo', accentColor = '#a78bfa', children }: SubPageShellProps) {
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.25 });
    const [mac] = useState(isMac);
    const [touch] = useState(() => window.matchMedia('(hover: none)').matches);
    const time = useBangkokTime();

    useEffect(() => {
        // Smooth scroll is global (ScrollProvider); each page opens at the top.
        window.scrollTo(0, 0);
    }, []);

    return (
        // Transparent root: the ambient particle field shows through.
        <div className="relative min-h-screen font-sans text-text">
            <motion.nav
                aria-label="Project"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-bg/85"
                style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
                    <Link
                        to="/#work"
                        data-cursor="back"
                        className="group flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute transition-colors hover:text-text-strong"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                        Back to work
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="hidden items-center gap-2 sm:flex">
                            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 [animation-duration:2.4s]" style={{ backgroundColor: accentColor }} />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text">{statusLabel}</span>
                        </span>
                        <button
                            type="button"
                            onClick={openConsole}
                            className="flex items-center gap-2 rounded-full border border-hairline py-1 pl-3 pr-1 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute transition-colors hover:border-hairline-strong hover:text-text-strong"
                            aria-label="Open console: search projects and sections"
                        >
                            {touch ? 'Menu' : 'Search'}
                            {!touch && (
                                <kbd className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] tracking-normal text-text">{mac ? '⌘K' : 'Ctrl K'}</kbd>
                            )}
                        </button>
                        <ThemeToggle />
                    </div>
                </div>
                {/* Reading progress, in the project's hue. */}
                <motion.div style={{ scaleX: progress, backgroundColor: accentColor }} className="h-px origin-left" />
            </motion.nav>

            <main id="main-content" className="relative z-10 pb-20 pt-28">
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
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-text-strong"
                    >
                        Back to top <ArrowUp className="h-3 w-3" aria-hidden="true" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
