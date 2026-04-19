import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
    const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.2 });

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 40);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Section-aware active link via IntersectionObserver.
    // Clears to '' when near the top (hero visible) so no item is highlighted.
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

        const onScroll = () => {
            if (window.scrollY < window.innerHeight * 0.4) setActive('');
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            obs.disconnect();
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

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
                    ? 'bg-slate-950/60 backdrop-blur-xl pb-3 border-b border-white/5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]'
                    : 'bg-transparent pb-5'
                    }`}
            style={{ paddingTop: `calc(env(safe-area-inset-top) + ${isScrolled ? '0.75rem' : '1.25rem'})` }}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-6">
                    <a
                        href="#"
                        className="group flex items-center gap-1 text-xl font-medium text-white tracking-tight cursor-hover"
                        data-cursor="home"
                    >
                        <span className="relative">
                            WT
                            <span className="absolute -bottom-1 left-0 h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 w-full" />
                        </span>
                        <span className="text-violet-400">.</span>
                    </a>

                    <nav ref={navRef} className="hidden md:flex items-center relative">
                        {/* Active-link indicator pill */}
                        <AnimatePresence>
                            {indicator && (
                                <motion.div
                                    layoutId="navActivePill"
                                    className="absolute inset-y-1 rounded-full bg-white/10 border border-white/10"
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
                                    className={`relative px-4 py-2 text-[11px] font-mono uppercase tracking-[0.22em] transition-colors cursor-hover ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </a>
                            );
                        })}
                    </nav>

                    <div className="md:hidden flex items-center gap-4">
                        <button
                            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Scroll progress bar */}
                <motion.div
                    style={{ scaleX }}
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 origin-left"
                />
            </motion.header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-[60px] left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-white/10 p-8 md:hidden"
                    >
                        <nav className="flex flex-col gap-5">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    className="text-2xl font-medium text-white hover:text-violet-300 tracking-tight"
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
