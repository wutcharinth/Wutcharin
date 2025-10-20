import React from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

const projectsData = [
    {
        title: "Really Cool Airlines - Airline Startup Launch",
        url: "https://aviationweek.com/air-transport/airports-networks/thai-startup-really-cool-airlines-plans-q2-2024-launch-airbus-a330",
        description: "Served as Head of Commercial for Thai aviation startup Really Cool Airlines. Speaker at Routes World 2023 in Istanbul - one of the aviation industry's largest route development conferences. Led comprehensive business plan development, fundraising initiatives, and successfully secured business license from The Civil Aviation Authority of Thailand (CAAT). Featured in Aviation Week for presenting the airline's vision to connect Bangkok with underserved global markets. Although the airline is not yet active, this venture provided invaluable hands-on experience in startup operations, regulatory compliance, aviation business development, investor relations, and international stakeholder management.",
        tech: ["Business Strategy", "Fundraising", "Aviation", "Regulatory Compliance", "Commercial Leadership"],
        featured: true,
        badge: "Speaker at Routes World 2023"
    },
    {
        title: "SplitBill AI - From Idea to Live App in 7 Days",
        url: "https://splitbill-ai.com/",
        description: "Built end-to-end in one week using AI-first approach. Features instant receipt scanning with Gemini AI, automatic item parsing including taxes and service charges, intuitive tap-to-assign interface, and clean summary sharing. Deployed on Firebase with custom domain. A real-world example of rapid AI prototyping, showcasing ability to move from concept to production quickly. Featured in LinkedIn article documenting the entire development journey.",
        tech: ["Gemini AI", "Firebase", "Google AI Studio", "React", "7-Day Build"],
        featured: true,
        badge: "Built in 7 Days",
        articleUrl: "https://www.linkedin.com/pulse/from-idea-live-app-7-days-my-journey-building-splitbill-thatan-wsugc/"
    },
    {
        title: "LocalGuide - Booking Platform Prototype",
        url: "https://web-production-c4714.up.railway.app/",
        description: "Full-stack prototype built for startup founder connecting travelers with local guides. Features complete user authentication system, guide profile management, booking functionality, and payment integration. Demonstrates ability to rapidly build MVPs for entrepreneurs and validate business concepts through functional prototypes.",
        tech: ["Full Stack", "React", "Express.js", "PostgreSQL", "Railway"],
        badge: "Startup MVP"
    }
];

const Projects: React.FC = () => {
    return (
        <section className="py-16 md:py-24">
            <h2 className="text-3xl font-bold text-white mb-2">My Projects</h2>
            <div className="w-20 h-1 bg-cyan-500 mb-6"></div>
            <p className="text-lg text-gray-300 leading-relaxed mb-10">
                Specializing in <span className="font-semibold text-cyan-400">rapid prototyping</span> and AI-first development. I build end-to-end solutions in days, not months — from <span className="font-semibold text-white">AI-powered applications</span> and <span className="font-semibold text-white">full-stack websites</span> to <span className="font-semibold text-white">data-driven dashboards</span>, <span className="font-semibold text-white">interactive presentations</span>, and <span className="font-semibold text-white">research prototypes</span>. My approach combines LLM capabilities with modern frameworks to validate ideas quickly and deliver production-ready solutions.
            </p>
            <div className="grid grid-cols-1 gap-8">
                {projectsData.map((project, index) => (
                    <a 
                        key={index}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block p-6 rounded-lg border group transition-all duration-300 transform hover:-translate-y-1 ${
                            project.featured 
                                ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-500/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20' 
                                : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500 hover:bg-gray-800'
                        }`}
                    >
                        {project.badge && (
                            <div className="mb-3">
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {project.badge}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-start">
                           <div className="flex-1">
                                <h3 className={`text-xl font-bold transition-colors duration-300 ${
                                    project.featured 
                                        ? 'text-cyan-300 group-hover:text-cyan-200' 
                                        : 'text-white group-hover:text-cyan-400'
                                }`}>
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 mt-2 leading-relaxed">{project.description}</p>
                           </div>
                           <ExternalLinkIcon className="w-6 h-6 text-gray-500 group-hover:text-cyan-400 transition-colors duration-300 flex-shrink-0 ml-4" />
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {project.tech.map((tech, tIndex) => (
                                <span key={tIndex} className="text-xs font-medium bg-cyan-900/50 text-cyan-300 px-3 py-1 rounded-full">
                                    {tech}
                                </span>
                            ))}
                        </div>
                        {project.articleUrl && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                                <a 
                                    href={project.articleUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                    Read LinkedIn Article
                                </a>
                            </div>
                        )}
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Projects;