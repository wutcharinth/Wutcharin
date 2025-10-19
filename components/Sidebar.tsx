import React from 'react';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { MailIcon } from './icons/MailIcon';
import { DownloadIcon } from './icons/DownloadIcon';

const competencies = {
    "Data Strategy & Leadership": ["Team Building", "FinTech Analytics", "Commercial Strategy", "Executive Communication", "Data Monetization"],
    "Technical Leadership": ["Predictive Modeling (ROI/Churn)", "BI Platform Architecture", "Data-Driven Culture Change"],
    "Business Acumen": ["Startup Fundraising", "Corporate Turnaround", "Strategic Planning", "P&L Optimization"]
};

const techSkills = {
    "Analytics & Machine Learning": ["SQL", "Python (Pandas, NumPy)", "Regression", "Classification", "Clustering", "Time Series Forecasting"],
    "Visualization & BI": ["Tableau", "Power BI", "Looker Studio", "Metabase", "SuperSet", "Matplotlib"],
    "Project Management": ["Agile", "Scrum", "Jira", "Asana", "Trello", "Notion"],
    "AI & Automation": ["AI-driven Prototyping", "n8n", "RPA Tools"]
};

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, isActive }) => (
    <a href={href} className="group flex items-center py-2">
        <span className={`nav-indicator mr-4 h-px transition-all duration-300 ${isActive ? 'w-16 bg-cyan-400' : 'w-8 bg-gray-600 group-hover:w-16 group-hover:bg-cyan-400'}`}></span>
        <span className={`nav-text text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'}`}>
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
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Wutcharin Thatan
                </h1>
                <h2 className="mt-3 text-lg sm:text-xl font-medium tracking-tight text-gray-300">
                    Executive Leader | Data & Analytics
                </h2>
                
                <div className="mt-8 space-y-4 text-gray-400">
                     <a href="tel:+660615655969" className="flex items-center gap-3 hover:text-cyan-400 transition-colors">
                        <PhoneIcon className="w-5 h-5" />
                        <span>(+66) 061-565-5969</span>
                    </a>
                    <a href="mailto:wutcharin.th@gmail.com" className="flex items-center gap-3 hover:text-cyan-400 transition-colors">
                        <MailIcon className="w-5 h-5" />
                        <span>wutcharin.th@gmail.com</span>
                    </a>
                    <a href="https://linkedin.com/in/Wutcharin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-cyan-400 transition-colors">
                        <LinkedinIcon className="w-5 h-5" />
                        <span>linkedin.com/in/Wutcharin</span>
                    </a>
                </div>

                <div className="mt-8">
                    <a 
                        href="/Wutcharin_Thatan_Resume.pdf"
                        download
                        className="group inline-flex items-center justify-center gap-3 w-full text-center bg-gray-800 hover:bg-gray-700/80 border border-gray-700 hover:border-cyan-500/50 px-6 py-3 rounded-lg transition-all duration-300"
                    >
                        <DownloadIcon className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                        <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">Download Resume</span>
                    </a>
                </div>

                 <nav className="hidden lg:block mt-12">
                    <ul className="flex flex-col">
                        <li><NavLink href="#profile" isActive={activeSection === 'profile'}>Executive Profile</NavLink></li>
                        <li><NavLink href="#highlights" isActive={activeSection === 'highlights'}>Career Highlights</NavLink></li>
                        <li><NavLink href="#experience" isActive={activeSection === 'experience'}>Experience</NavLink></li>
                        <li><NavLink href="#projects" isActive={activeSection === 'projects'}>Projects</NavLink></li>
                        <li><NavLink href="#contact" isActive={activeSection === 'contact'}>Contact</NavLink></li>
                    </ul>
                </nav>
            </div>


            <div className="space-y-10 mt-12 lg:mt-16">
                 <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">Core Competencies</h3>
                    {Object.entries(competencies).map(([title, skills]) => (
                         <div key={title} className="mb-4">
                            <h4 className="font-bold text-gray-200 mb-1">{title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{skills.join(', ')}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">Technical Skills & Tools</h3>
                    {Object.entries(techSkills).map(([title, skills]) => (
                        <div key={title} className="mb-4">
                            <h4 className="font-bold text-gray-200 mb-1">{title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{skills.join(', ')}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">Education</h3>
                     <div className="mb-4">
                        <h4 className="font-bold text-gray-200">Master of Business Administration</h4>
                        <p className="text-gray-400 text-sm">Stamford International University</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-200">Bachelor of Engineering</h4>
                        <p className="text-gray-400 text-sm">Chulalongkorn University</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
