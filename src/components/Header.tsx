import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
    { name: 'Home', href: '#', id: '' },
    { name: 'Profile', href: '#about', id: 'about' },
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Contact', href: '#contact', id: 'contact' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [active, setActive] = useState<string>('');
    const navRef = useRef<HTMLElement | null>(null);
    const menuButtonRef = useRef<HTMLButtonElement | null>(null);
    const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.2 });

    // One scroll listener drives both the condensed-header state and the
    // near-top active-link reset (no item highlighted while the hero shows).
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setIsScrolled(y > 40);
            if (y < window.innerHeight * 0.4) setActive('');
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Section-aware active link via IntersectionObserver.
    useEffect(() => {
        const sections = navLinks
            .filter((l) => l.id)
            .map((l) => ({ id: l.id, el: document.getElementById(l.id) }))
            .filter((s): s is { id: string; el: HTMLElement } => !!s.el);
        if (sections.length === 0) return;

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) setActive(e.target.id);
                });
            },
            { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
        );
        sections.forEach((s) => obs.observe(s.el));

        return () => obs.disconnect();
    }, []);

    // Mobile menu: lock body scroll, close on Escape, and manage focus
    // (move into the menu on open, return to the toggle on close).
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const toggleButton = menuButtonRef.current;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.querySelector<HTMLAnchorElement>('#mobile-menu a')?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
            toggleButton?.focus();
        };
    }, [isMobileMenuOpen]);

    // Update indicator position to current active link
    useEffect(() => {
        if (!navRef.current) return;
        const el = navRef.current.querySelector<HTMLAnchorElement>(`[data-nav-id="${active}"]`);
        if (!el) {
            setIndicator(null);
            return;
        }
        const parentRect = navRef.current.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        setIndicator({ left: rect.left - parentRect.left, width: rect.width });
    }, [active, isScrolled]);

    return (
        <>
            <motion.header
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? 'bg-bg/60 backdrop-blur-xl pb-3 border-b border-text-strong/5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]'
                    : 'bg-transparent pb-5'
                    }`}
            style={{ paddingTop: `calc(env(safe-area-inset-top) + ${isScrolled ? '0.75rem' : '1.25rem'})` }}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-6">
                    <a
                        href="#"
                        className="group flex items-center gap-1 text-xl font-medium text-text-strong tracking-tight cursor-hover"
                        data-cursor="home"
                    >
                        <span className="relative">
                            WT
                            <span className="absolute -bottom-1 left-0 h-px bg-text-strong scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 w-full" />
                        </span>
                        <span className="text-signal">.</span>
                    </a>

                    <nav ref={navRef} className="hidden md:flex items-center relative">
                        {/* Active-link indicator pill */}
                        <AnimatePresence>
                            {indicator && (
                                <motion.div
                                    layoutId="navActivePill"
                                    className="absolute inset-y-1 rounded-full bg-text-strong/10 border border-text-strong/10"
                                    animate={{ left: indicator.left, width: indicator.width, opacity: 1 }}
                                    initial={{ opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                />
                            )}
                        </AnimatePresence>
                        {navLinks.map((link) => {
                            const isActive = link.id === active;
                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    data-nav-id={link.id}
                                    className={`relative px-4 py-2 text-[11px] font-mono uppercase tracking-[0.28em] transition-colors cursor-hover ${isActive ? 'text-text-strong' : 'text-text-mute hover:text-text-strong'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            ref={menuButtonRef}
                            className="md:hidden text-text-strong p-2 hover:bg-text-strong/10 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Scroll progress bar — single Violet Signal, 10% Rule */}
                <motion.div
                    style={{ scaleX }}
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-signal origin-left"
                />
            </motion.header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 z-30 bg-bg/60 backdrop-blur-sm md:hidden"
                        aria-hidden="true"
                    />
                )}
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-panel"
                        id="mobile-menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-[60px] left-0 right-0 z-40 bg-bg/95 backdrop-blur-xl border-b border-text-strong/10 p-8 md:hidden"
                    >
                        <nav className="flex flex-col gap-5">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    className="text-2xl font-medium text-text-strong hover:text-signal tracking-tight"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
