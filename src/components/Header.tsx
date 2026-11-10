import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Menu, Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { CHAPTERS } from './home/chapters';
import { useActiveChapter } from './home/useActiveChapter';
import { useScrollTo } from './home/useScrollTo';
import { openConsole, isMac } from './console/consoleBus';

/**
 * Home chrome. The top bar carries the mark, the four destinations a
 * skimming visitor needs (always visible from tablet up, with the current
 * one marked), the console and the theme. The chapter rail adds fine-grained
 * orientation on wide screens; phones navigate through the ⌘K console.
 */
const NAV = CHAPTERS.filter((c) => c.id !== 'top' && c.id !== 'principle');

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mac] = useState(isMac);
    const active = useActiveChapter();
    const scrollTo = useScrollTo();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.2 });

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? 'border-b border-hairline bg-bg/85' : 'bg-transparent'}`}
                style={{ paddingTop: 'env(safe-area-inset-top)' }}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
                    <a
                        href="#top"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollTo(0);
                        }}
                        className="group flex items-center gap-1 text-xl font-medium tracking-tight text-text-strong"
                        aria-label="Wutcharin Thatan, back to top"
                    >
                        WT<span className="text-signal">.</span>
                    </a>

                    <nav aria-label="Sections" className="hidden md:block">
                        <ul className="flex items-center gap-1">
                            {NAV.map((c) => {
                                // Principle sits between Proof and Work and has no
                                // link of its own: it reads as part of Proof here.
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
                                            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium tracking-tight transition-colors ${
                                                on
                                                    ? 'border-signal/40 bg-signal/10 text-text-strong'
                                                    : 'border-transparent text-text-mute hover:text-text-strong'
                                            }`}
                                        >
                                            {c.id === 'contact' ? 'Contact' : c.name}
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
                            className="hidden items-center gap-3 rounded-full border border-hairline py-1.5 pl-3 pr-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mute transition-colors hover:border-hairline-strong hover:text-text-strong md:flex lg:pl-4"
                            aria-label="Open console: search projects and sections"
                        >
                            <Search className="h-3.5 w-3.5 lg:hidden" aria-hidden="true" />
                            <span className="hidden lg:inline">Search</span>
                            <kbd className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[11px] tracking-normal text-text">{mac ? '⌘K' : 'Ctrl K'}</kbd>
                        </button>
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={openConsole}
                            className="rounded-lg p-2 text-text-strong transition-colors hover:bg-text-strong/10 md:hidden"
                            aria-label="Open menu"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
                <motion.div style={{ scaleX }} className="absolute inset-x-0 bottom-0 h-px origin-left bg-signal" />
            </motion.header>

            {/* Chapter rail: orientation at a glance, wide screens only. */}
            <nav aria-label="Chapters" className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 min-[1440px]:block">
                <ol className="flex flex-col gap-3">
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
                                    className="group flex items-center gap-3 py-0.5 font-mono text-[11px] uppercase tracking-[0.28em]"
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`h-px transition-all duration-500 ${on ? 'w-6 bg-signal' : 'w-3 bg-hairline-strong group-hover:w-5 group-hover:bg-text-mute'}`}
                                    />
                                    <span className={`tabular-nums transition-colors ${on ? 'text-text-strong' : 'text-text-mute'}`}>{c.index}</span>
                                    {/* Named on hover; the current one stays named where the margin has room. */}
                                    <span
                                        className={`transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${on ? 'text-text-strong min-[1600px]:translate-x-0 min-[1600px]:opacity-100' : 'text-text-mute'} -translate-x-1 opacity-0`}
                                    >
                                        {c.name}
                                    </span>
                                </a>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </>
    );
}
