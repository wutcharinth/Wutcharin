import React, { useState, useEffect } from 'react';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { GithubIcon } from './icons/GithubIcon';
import { MailIcon } from './icons/MailIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface HeaderProps {
    activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { href: '#profile', label: 'Profile' },
        { href: '#highlights', label: 'Highlights' },
        { href: '#experience', label: 'Experience' },
        { href: '#projects', label: 'Projects' },
        { href: '#contact', label: 'Contact' },
    ];

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-gray-900 backdrop-blur-md shadow-lg border-b border-gray-800' 
                    : 'bg-gray-900/80 backdrop-blur-sm'
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    {/* Logo/Name */}
                    <a href="#" className="flex items-center gap-3 group">
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                Wutcharin Thatan
                            </span>
                            <span className="text-xs text-gray-400">AI, Automation & Analytics Leader</span>
                        </div>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navItems.map(item => (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors ${
                                    activeSection === item.href.replace('#', '')
                                        ? 'text-cyan-400'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Contact & CTA */}
                    <div className="flex items-center gap-4">
                        <a
                            href="mailto:wutcharin.th@gmail.com"
                            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                            aria-label="Email"
                        >
                            <MailIcon className="w-5 h-5" />
                        </a>
                        <a
                            href="https://linkedin.com/in/Wutcharin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                            aria-label="LinkedIn"
                        >
                            <LinkedinIcon className="w-5 h-5" />
                        </a>
                        <a
                            href="https://github.com/wutcharinth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                            aria-label="GitHub"
                        >
                            <GithubIcon className="w-5 h-5" />
                        </a>
                        <a
                            href="/Wutcharin_Thatan_Resume.pdf"
                            download
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105"
                        >
                            <DownloadIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">Resume</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

