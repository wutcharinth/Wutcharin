import React from 'react';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { MailIcon } from './icons/MailIcon';
import { DownloadIcon } from './icons/DownloadIcon';

const topSkills = [
    "Data Strategy",
    "Machine Learning",
    "BI Architecture",
    "Python & SQL",
    "Tableau & Power BI",
    "Team Leadership"
];

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, isActive }) => (
    <a href={href} className="group flex items-center py-3 px-3 -mx-3 rounded-lg transition-all duration-200">
        <span className={`nav-indicator mr-3 h-px transition-all duration-300 ${isActive ? 'w-12 bg-cyan-400' : 'w-6 bg-gray-600 group-hover:w-12 group-hover:bg-cyan-400'}`}></span>
        <span className={`nav-text text-sm font-semibold tracking-wide transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-gray-200'}`}>
            {children}
        </span>
    </a>
);

interface SidebarProps {
    activeSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection }) => {
    return (
        <div className="lg:sidebar lg:py-24">
            <div className="py-12 lg:py-0">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
                        Wutcharin<br/>Thatan
                    </h1>
                    <p className="text-lg text-gray-300 font-medium mb-2">
                        Executive Leader
                    </p>
                    <p className="text-cyan-400 font-semibold">
                        Data & Analytics
                    </p>
                </div>

                {/* Navigation - More Prominent */}
                <nav className="hidden lg:block mb-10">
                    <ul className="flex flex-col space-y-1">
                        <li><NavLink href="#profile" isActive={activeSection === 'profile'}>Profile</NavLink></li>
                        <li><NavLink href="#highlights" isActive={activeSection === 'highlights'}>Highlights</NavLink></li>
                        <li><NavLink href="#experience" isActive={activeSection === 'experience'}>Experience</NavLink></li>
                        <li><NavLink href="#projects" isActive={activeSection === 'projects'}>Projects</NavLink></li>
                        <li><NavLink href="#contact" isActive={activeSection === 'contact'}>Contact</NavLink></li>
                    </ul>
                </nav>

                {/* Key Skills Pills */}
                <div className="mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                        Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {topSkills.map((skill) => (
                            <span 
                                key={skill}
                                className="inline-block px-3 py-1.5 bg-gray-800/80 border border-gray-700/50 text-gray-300 text-sm rounded-full hover:border-cyan-500/50 hover:text-cyan-400 transition-colors duration-200"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* CTA Button - More Prominent */}
                <div className="mb-10">
                    <a 
                        href="/Wutcharin_Thatan_Resume.pdf"
                        download
                        className="group relative inline-flex items-center justify-center gap-2 w-full text-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-3.5 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02]"
                    >
                        <DownloadIcon className="w-5 h-5 text-white" />
                        <span className="font-bold text-white">Download Resume</span>
                    </a>
                </div>

                {/* Contact Section - Cleaner */}
                <div className="space-y-3">
                    <a 
                        href="mailto:wutcharin.th@gmail.com" 
                        className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-700/50 group-hover:border-cyan-500/50 transition-colors">
                            <MailIcon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Email</span>
                    </a>
                    <a 
                        href="https://linkedin.com/in/Wutcharin" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 border border-gray-700/50 group-hover:border-cyan-500/50 transition-colors">
                            <LinkedinIcon className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                </div>

                {/* Education - Minimal */}
                <div className="mt-16 pt-8 border-t border-gray-800">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                        Education
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="font-semibold text-gray-200 text-sm">MBA</p>
                            <p className="text-gray-500 text-xs">Stamford International</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-200 text-sm">B.Eng</p>
                            <p className="text-gray-500 text-xs">Chulalongkorn University</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
