import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                return true;
            }
            document.documentElement.classList.remove('dark');
        }
        return false;
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Profile', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Experience', href: '#experience' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-bg border-b-4 border-border ${isScrolled ? 'py-4' : 'py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <a href="#" className="text-4xl font-black text-text tracking-tighter hover:text-primary transition-colors">
                    WT<span className="text-primary">.</span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-bold text-text hover:bg-inverse hover:text-inverse-text px-2 py-1 transition-all uppercase tracking-widest"
                        >
                            {link.name}
                        </a>
                    ))}
                    <button
                        onClick={toggleTheme}
                        className="p-2 hover:bg-inverse hover:text-inverse-text transition-colors border-2 border-transparent hover:border-border"
                        aria-label="Toggle Dark Mode"
                    >
                        {isDark ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                </nav>

                <div className="md:hidden flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="text-text p-2 hover:bg-inverse hover:text-inverse-text transition-colors"
                    >
                        {isDark ? <Sun size={24} /> : <Moon size={24} />}
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        className="text-text border-4 border-border p-2 hover:bg-inverse hover:text-inverse-text transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                    </button>
                </div>

                {/* Mobile Nav */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-bg border-b-4 border-border p-8 md:hidden shadow-[8px_8px_0px_0px_var(--shadow-color)]">
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-4xl font-black text-text hover:text-primary uppercase tracking-tighter"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
