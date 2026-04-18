import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Lenis from 'lenis';

interface SubPageShellProps {
    /** Tailwind accent color for status dot + selection (e.g. "violet", "rose", "blue") */
    accent?: string;
    /** Label shown next to the pulsing status dot */
    statusLabel?: string;
    /** Direct CSS color for the scroll-progress bar and status dot (hex/rgb) */
    accentColor?: string;
    children: ReactNode;
}

/**
 * Shared shell for every project sub-page:
 *   • Lenis smooth scroll (with cleanup)
 *   • Fixed top nav with back link + status pill
 *   • Gradient scroll-progress bar under the nav
 *   • Footer with copyright
 *
 * Pages embed their hero + main content as children.
 */
export default function SubPageShell({
    statusLabel = 'System Online',
    accentColor = '#a78bfa',
    children,
}: SubPageShellProps) {
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 30, mass: 0.25 });

    useEffect(() => {
        window.scrollTo(0, 0);
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <div className="relative min-h-screen bg-[#020617] text-slate-200 font-sans">
            {/* Ambient noise layer */}
            <div className="pointer-events-none fixed inset-0 bg-noise opacity-[0.03] mix-blend-overlay z-0" aria-hidden="true" />

            {/* Nav */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 left-0 right-0 z-50 bg-slate-950/70 backdrop-blur-xl border-b border-white/5"
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link
                        to="/"
                        data-cursor="back"
                        className="group flex items-center gap-2 text-[10px] font-mono text-slate-400 hover:text-white uppercase tracking-[0.25em] transition-colors cursor-hover"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                        Back to portfolio
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: accentColor }} />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: accentColor }} />
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em]" style={{ color: accentColor }}>
                            {statusLabel}
                        </span>
                    </div>
                </div>
                <motion.div
                    style={{ scaleX: progress, background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }}
                    className="h-[1.5px] origin-left"
                />
            </motion.nav>

            <main className="relative pt-28 pb-20 z-10">{children}</main>

            <footer className="relative z-10 py-10 border-t border-white/5 bg-slate-950 text-center">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em]">
                    &copy; {new Date().getFullYear()} Wutcharin Thatan · All rights reserved
                </p>
            </footer>
        </div>
    );
}
