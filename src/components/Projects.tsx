import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
    {
        title: "Enterprise Collections AI",
        role: "AI Engineer",
        desc: "Autonomous dispute agent for VCC overcharges. Features cognitive flow, strategy engine, and auto-rebuttal loops.",
        tags: ["LangGraph", "React", "Agentic AI", "FinTech"],
        link: "/collections",
        featured: true
    },
    {
        title: "SlipVerify AI",
        role: "AI Engineer",
        desc: "Intelligent expense verification system using ChainGraph. Features multi-agent orchestration for fraud detection and OCR.",
        tags: ["LangGraph", "React", "Agentic AI", "OCR"],
        link: "/slip-verify",
        featured: true
    },
    {
        title: "Thai Election Chatbot",
        role: "AI Engineer",
        desc: "RAG-based chatbot for Thai election data. Uses vector search and LLMs to answer complex political queries.",
        tags: ["RAG", "Vector DB", "LLM", "React"],
        link: "/thai-election",
        featured: true
    },
    {
        title: "Gemini OCR",
        role: "Frontend Developer",
        desc: "High-accuracy OCR tool powered by Google's Gemini Vision Pro. Extracts structured data from complex documents.",
        tags: ["Gemini API", "React", "OCR", "AI"],
        link: "/gemini-ocr",
        featured: false
    },
    {
        title: "AI Resume Builder",
        role: "Full Stack Developer",
        desc: "Interactive resume builder with AI-powered content suggestions and real-time preview.",
        tags: ["React", "OpenAI API", "Tailwind CSS"],
        link: "/resume-builder",
        featured: false
    },
    {
        title: "SplitBill AI",
        role: "Creator & Developer",
        desc: "Built end-to-end in 7 days. Features instant receipt scanning with Gemini AI, automatic item parsing, and smart assignment.",
        tags: ["Gemini AI", "React", "Firebase", "Google AI Studio"],
        link: "https://splitbill-ai.com/",
        featured: true
    }
];

export default function Projects() {
    return (
        <section id="projects" className="py-20 px-4 bg-bg">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 uppercase tracking-tighter text-text">Featured <span className="text-inverse-text bg-inverse px-2">Projects</span></h2>
                    <p className="text-text font-bold max-w-2xl mx-auto border-2 border-border bg-bg inline-block px-4 py-2 shadow-[4px_4px_0px_0px_var(--shadow-color)]">
                        Building rapid AI prototypes and scalable intelligent solutions.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => {
                        const isExternal = project.link.startsWith('http');

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="h-full"
                            >
                                {isExternal ? (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block h-full bg-bg border-2 border-border p-6 hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] relative overflow-hidden flex flex-col"
                                    >
                                        <ProjectContent project={project} />
                                    </a>
                                ) : (
                                    <Link
                                        to={project.link}
                                        className="group block h-full bg-bg border-2 border-border p-6 hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] relative overflow-hidden flex flex-col"
                                    >
                                        <ProjectContent project={project} />
                                    </Link>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ProjectContent({ project }: { project: typeof projects[0] }) {
    return (
        <>
            <div className="absolute top-0 right-0 p-4 opacity-100">
                <ArrowUpRight className="text-text group-hover:text-white w-6 h-6 border-2 border-border group-hover:border-white bg-bg group-hover:bg-inverse transition-colors" />
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-bold text-text group-hover:text-white transition-colors uppercase tracking-tight">
                    {project.title}
                </h3>
                <span className="text-sm text-primary group-hover:text-text font-bold bg-inverse group-hover:bg-bg px-1 inline-block mt-1">{project.role}</span>
            </div>

            <p className="text-text group-hover:text-white text-sm mb-6 line-clamp-4 font-medium border-t-2 border-border group-hover:border-white pt-4 flex-grow">
                {project.desc}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-bg border-2 border-border text-text font-bold group-hover:bg-inverse group-hover:text-inverse-text group-hover:border-inverse-text transition-colors">
                        {tag}
                    </span>
                ))}
            </div>
        </>
    );
}
