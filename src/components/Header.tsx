import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { CHAPTERS } from './home/chapters';
import { useActiveChapter } from './home/useActiveChapter';
import { useScrollTo } from './home/useScrollTo';
import { openConsole, isMac } from './console/consoleBus';

/**
 * Home chrome. At the top of the page the bar sits spacious and transparent;
 * once scrolled it contracts into a centered floating console capsule with a
 * shared-element active indicator. The left chapter rail gives live spatial
 * orientation from 1280px up with a continuous vertical scroll thread.
 */
const NAV = CHAPTERS.filter((c) => c.id !== 'top' && c.id !== 'principle');

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mac] = useState(isMac);
    const active = useActiveChapter();
    const scrollTo = useScrollTo();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.2 });
    const scaleY = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.2 });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 48);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            {/* Top 1px scroll progress rule anchored to the viewport ceiling. */}
            <motion.div
                style={{ scaleX }}
                aria-hidden="true"
                className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-signal"
            />

            <motion.header
                initial={{ y: -32, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 [transition-timing-function:var(--ease-out-expo)] ${
                    scrolled ? 'px-4 pt-3 md:px-6' : 'px-0 pt-0'
                }`}
                style={{ paddingTop: scrolled ? 'calc(env(safe-area-inset-top) + 0.75rem)' : 'env(safe-area-inset-top)' }}
            >
                <div
                    className={`mx-auto flex items-center justify-between gap-4 transition-all duration-500 [transition-timing-function:var(--ease-out-expo)] ${
                        scrolled
                            ? 'h-12 max-w-4xl rounded-full border border-hairline-strong bg-veil px-4 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-md md:px-5'
                            : 'h-16 max-w-7xl rounded-none border border-transparent bg-transparent px-6 md:px-10'
                    }`}
                >
                    <a
                        href="#top"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollTo(0);
                        }}
                        className="group flex items-center gap-1 font-display text-lg font-semibold tracking-tight text-text-strong md:text-xl"
                        aria-label="Wutcharin Thatan, back to top"
                    >
                        WT<span className="text-signal transition-opacity group-hover:opacity-60">.</span>
                    </a>

                    <nav aria-label="Sections" className="hidden md:block">
                        <ul className="flex items-center gap-0.5">
                            {NAV.map((c) => {
                                // Principle sits between Proof and Work and reads under Proof in top nav.
                                const on = c.id === active || (c.id === 'proof' && active === 'principle');
                                return (
                                    <li key={c.id}>
                                        <a
                                            href={`#${c.id}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollTo(`#${c.id}`);
                                            }}
                                            aria-current={on ? 'location' : undefined}
                                            className={`relative inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-medium tracking-tight transition-colors ${
                                                on ? 'text-text-strong' : 'text-text-mute hover:text-text-strong'
                                            }`}
                                        >
                                            {on && (
                                                <motion.span
                                                    layoutId="header-active-nav"
                                                    aria-hidden="true"
                                                    className="absolute inset-0 rounded-full border border-signal/35 bg-signal/10"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                                                />
                                            )}
                                            <span className="relative">{c.id === 'contact' ? 'Contact' : c.name}</span>
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={openConsole}
                            data-cursor="open"
                            className="hidden items-center gap-2.5 rounded-full border border-hairline py-1 pl-3 pr-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute transition-colors hover:border-hairline-strong hover:text-text-strong md:flex lg:pl-3.5"
                            aria-label="Open console: search projects and sections"
                        >
                            <Search className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                            <span className="hidden lg:inline">Console</span>
                            <kbd className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[10px] tracking-normal text-text">
                                {mac ? '⌘K' : 'Ctrl K'}
                            </kbd>
                        </button>
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={openConsole}
                            className="rounded-full p-2 text-text-strong transition-colors hover:bg-text-strong/10 md:hidden"
                            aria-label="Open menu"
                        >
                            <Menu size={18} />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Chapter rail: spatial orientation from 1280px laptops up. */}
            <nav aria-label="Chapters" className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 min-[1280px]:block min-[1440px]:left-6">
                <div className="relative pl-3">
                    {/* Continuous vertical progress hairline behind the chapter markers. */}
                    <span aria-hidden="true" className="absolute bottom-2 left-0 top-2 w-px bg-hairline">
                        <motion.span style={{ scaleY }} className="block h-full w-full origin-top bg-signal/70" />
                    </span>

                    <ol className="flex flex-col gap-2.5">
                        {CHAPTERS.map((c) => {
                            const on = c.id === active;
                            return (
                                <li key={c.id}>
                                    <a
                                        href={`#${c.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            scrollTo(c.id === 'top' ? 0 : `#${c.id}`);
                                        }}
                                        aria-current={on ? 'location' : undefined}
                                        className="group flex items-center gap-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.26em]"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className={`h-px transition-all duration-500 ${
                                                on ? 'w-5 bg-signal' : 'w-2.5 bg-hairline-strong group-hover:w-4 group-hover:bg-text-mute'
                                            }`}
                                        />
                                        <span className={`tabular-nums transition-colors ${on ? 'text-text-strong' : 'text-text-mute'}`}>
                                            {c.index}
                                        </span>
                                        <span
                                            className={`-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${
                                                on ? 'text-text-strong min-[1520px]:translate-x-0 min-[1520px]:opacity-100' : 'text-text-mute'
                                            }`}
                                        >
                                            {c.name}
                                        </span>
                                    </a>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </nav>
        </>
    );
}
