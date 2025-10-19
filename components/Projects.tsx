import React from 'react';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

const projectsData = [
    {
        title: "SplitBill AI",
        url: "https://splitbill-ai.com/",
        description: "An intelligent bill-splitting application that leverages AI to parse receipts and simplify expense sharing among groups. Built for speed and convenience.",
        tech: ["AI/ML", "React", "Node.js", "Cloud Services"]
    },
    {
        title: "Local Friend - Booking Platform",
        url: "https://web-production-c4714.up.railway.app/",
        description: "A full-stack prototype for a platform connecting travelers with local guides. Features user authentication, guide profiles, and booking functionality.",
        tech: ["Full Stack", "React", "Express.js", "PostgreSQL", "Railway"]
    }
];

const Projects: React.FC = () => {
    return (
        <section className="py-16 md:py-24">
            <h2 className="text-3xl font-bold text-white mb-2">My Projects</h2>
            <div className="w-20 h-1 bg-cyan-500 mb-10"></div>
            <div className="grid grid-cols-1 gap-8">
                {projectsData.map((project, index) => (
                    <a 
                        key={index}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-800/50 p-6 rounded-lg border border-gray-700 group hover:border-cyan-500 hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="flex justify-between items-start">
                           <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">{project.title}</h3>
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
                    </a>
                ))}
            </div>
        </section>
    );
};

export default Projects;