import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Profile', href: '#about' },
        { name: 'Projects', href: '#projects' },
        { name: 'Experience', href: '#experience' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-bg border-b-4 border-black ${isScrolled ? 'py-4' : 'py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <a href="#" className="text-4xl font-black text-black tracking-tighter hover:text-primary transition-colors">
                    WT<span className="text-primary">.</span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-lg font-bold text-black hover:bg-black hover:text-white px-2 py-1 transition-all uppercase tracking-widest"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-black border-4 border-black p-2 hover:bg-black hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
                </button>

                {/* Mobile Nav */}
                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-bg border-b-4 border-black p-8 md:hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <nav className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-4xl font-black text-black hover:text-primary uppercase tracking-tighter"
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
