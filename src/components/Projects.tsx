import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
    {
        title: "Thai Election 2566",
        role: "Data Artist & AI Engineer",
        desc: "Interactive data storytelling with an integrated RAG-based AI chatbot. Visualizes 2023 election results with deep political insights.",
        tags: ["Data Viz", "RAG", "Gemini AI", "React"],
        link: "/thai-election",
        featured: true
    },
    {
        title: "QueryFlow AI",
        role: "Data Engineer",
        desc: "Enterprise Data Agent that bridges natural language and SQL. Features Metadata Scouting, Federated Execution, and Lineage Tracking.",
        tags: ["Text-to-SQL", "React", "Trino", "Data"],
        link: "/query-flow",
        featured: true
    },
    {
        title: "RiskGuard AI",
        role: "AI Engineer",
        desc: "Internal Control System that audits transactions in real-time. Features Policy Checks, Entity Resolution (COI), and Market Benchmarking.",
        tags: ["LangGraph", "React", "Risk", "Audit"],
        link: "/risk-guard",
        featured: true
    },
    {
        title: "ProjectFlow AI",
        role: "AI Engineer",
        desc: "Autonomous Scrum Master that manages Jira boards. Features Scope Creep detection, Auto-Grooming, and Definition of Done checks.",
        tags: ["Jira API", "React", "Agentic AI", "DevOps"],
        link: "/project-flow",
        featured: true
    },
    {
        title: "ReviewFlow AI",
        role: "AI Engineer",
        desc: "Reputation Engine that turns feedback into action. Features Sentiment Analysis, Intelligent Routing, and Automated Operational Triggers.",
        tags: ["NLP", "React", "Automation", "Reputation"],
        link: "/review-flow",
        featured: true
    },
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
        title: "Local Guide",
        role: "Full Stack Developer",
        desc: "AI-powered travel companion that creates personalized itineraries and provides local insights.",
        tags: ["React", "AI", "Maps API", "Travel"],
        link: "https://web-production-c4714.up.railway.app/",
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
        tags: ["React", "Gemini AI", "Tailwind CSS"],
        link: "/resume-builder",
        featured: false
    },
    {
        title: "SplitBill AI",
        role: "Creator & Developer",
        desc: "Built end-to-end. Features instant receipt scanning with Gemini AI, automatic item parsing, and smart assignment.",
        tags: ["Gemini AI", "React", "Firebase"],
        link: "https://splitbill-ai.com/",
        featured: true
    }
];

export default function Projects() {
    return (
        <section id="projects" className="py-20 px-4 relative">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tight">
                        Featured <span className="text-violet-500">Projects</span>
                    </h2>
                    <p className="text-sm font-bold text-violet-400 mb-6 uppercase tracking-widest">Personal projects that showcase my ability</p>
                    <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Building rapid AI prototypes (often within days not weeks) and scalable intelligent solutions.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                        className="group block h-full bg-slate-900/50 border border-slate-800 p-6 hover:border-violet-500/50 hover:bg-slate-800/50 transition-all rounded-2xl relative overflow-hidden flex flex-col"
                                    >
                                        <ProjectContent project={project} />
                                    </a>
                                ) : (
                                    <Link
                                        to={project.link}
                                        className="group block h-full bg-slate-900/50 border border-slate-800 p-6 hover:border-violet-500/50 hover:bg-slate-800/50 transition-all rounded-2xl relative overflow-hidden flex flex-col"
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
                <ArrowUpRight className="text-slate-500 group-hover:text-violet-400 w-6 h-6 transition-colors" />
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight pr-8">
                    {project.title}
                </h3>
                <span className="text-xs text-violet-400 font-mono mt-1 inline-block">{project.role}</span>
            </div>

            <p className="text-slate-400 text-sm mb-6 line-clamp-4 leading-relaxed flex-grow">
                {project.desc}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full text-slate-300 group-hover:border-violet-500/30 group-hover:text-violet-200 transition-colors">
                        {tag}
                    </span>
                ))}
            </div>
        </>
    );
}
