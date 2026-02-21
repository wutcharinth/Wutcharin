
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, SquareKanban, StarHalf, Database, MessageSquare, FileText, ScanText, Code, Receipt, Map, TrendingUp, Briefcase, Brain, Sparkles, Heart, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const projectSections = [
    {
        category: "Interactive Lecture Insights",
        description: "Transforming profound lectures and data into interactive visual experiences",
        items: [
            {
                title: "Karpathy LLM Guide",
                role: "Interactive Article",
                badge: "Lecture Insight",
                desc: "A definitive technical and strategic synthesis of Andrej Karpathy's masterclass on professional LLM utilization. Features Token visualizers and Model ELO charts.",
                tags: ["Andrej Karpathy", "LLM", "Interactive", "Education"],
                link: "/karpathy-deep-dive",
                featured: true,
                icon: Brain,
                color: "text-indigo-500",
                bg: "bg-indigo-500/10",
                border: "border-indigo-500/20"
            },
            {
                title: "The Human Edge",
                role: "Interactive Article",
                badge: "Lecture Insight",
                desc: "Based on Po-Shen Loh's philosophy. Features a 'Mental Fitness' simulation and visualizations of the new survival skills in the AI era.",
                tags: ["Philosophy", "React", "Interactive", "Mental Fitness"],
                link: "/human-edge",
                featured: true,
                icon: Heart,
                color: "text-cyan-500",
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/20"
            },
            {
                title: "Agentic AI Deep Dive",
                role: "Technical Writer & Educator",
                badge: "Lecture Insight",
                desc: "Interactive article exploring Stanford CS230's lecture on Agentic AI. Features visualizations of the Jagged Frontier, Prompt Engineering, HyDE, and ReAct patterns.",
                tags: ["Stanford CS230", "Agentic AI", "Interactive", "Education"],
                link: "/agentic-ai",
                featured: true,
                icon: Brain,
                color: "text-violet-500",
                bg: "bg-violet-500/10",
                border: "border-violet-500/20"
            },
            {
                title: "Thai Election 2566",
                role: "Data Artist & AI Engineer",
                badge: "Data Story",
                desc: "Interactive data storytelling with an integrated RAG-based AI chatbot. Visualizes 2023 election results with deep political insights.",
                tags: ["Data Viz", "RAG", "Gemini AI", "React"],
                link: "/thai-election",
                featured: true,
                icon: MessageSquare,
                color: "text-orange-500",
                bg: "bg-orange-500/10",
                border: "border-orange-500/20"
            },
            {
                title: "Thailand 2026 Election Investigation",
                role: "Data Investigator & Journalist",
                badge: "Data Story",
                desc: "Statistical investigation of Thailand's controversial Feb 8, 2026 election. Covers QR code ballot secrecy, vote count mismatches, the 1:1 ratio anomaly, and annulment petitions — using official ECT data across 382 districts.",
                tags: ["ECT Data", "ECharts", "Bilingual", "Investigation"],
                link: "/election-2026.html",
                featured: true,
                icon: BarChart2,
                color: "text-red-500",
                bg: "bg-red-500/10",
                border: "border-red-500/20"
            },
            {
                title: "AI Evolution Stats",
                role: "Data Storyteller",
                badge: "Data Story",
                desc: "Interactive visualization of the exponential rise of AI. From Parameter Explosions to the Context Revolution.",
                tags: ["Data Storytelling", "Recharts", "React", "AI Trends"],
                link: "/ai-evolution",
                featured: true,
                icon: TrendingUp,
                color: "text-fuchsia-500",
                bg: "bg-fuchsia-500/10",
                border: "border-fuchsia-500/20"
            },
            {
                title: "Future of Work",
                role: "Data Journalist",
                badge: "Data Story",
                desc: "A data-driven view on global job disruption and the emerging roles of tomorrow. Automation vs Transformation.",
                tags: ["Data Journalism", "React", "Labor Stats"],
                link: "/future-of-work",
                featured: true,
                icon: Briefcase,
                color: "text-cyan-500",
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/20"
            }
        ]
    },
    {
        category: "AI Agents & Agentic Simulations",
        description: "Autonomous agents solving complex enterprise workflows",
        items: [
            {
                title: "RiskGuard AI",
                role: "AI Engineer",
                desc: "Internal Control System that audits transactions in real-time. Features Policy Checks, Entity Resolution (COI), and Market Benchmarking.",
                tags: ["LangGraph", "React", "Risk", "Audit"],
                link: "/risk-guard",
                featured: true,
                icon: ShieldCheck,
                color: "text-rose-500",
                bg: "bg-rose-500/10",
                border: "border-rose-500/20"
            },
            {
                title: "ProjectFlow AI",
                role: "AI Engineer",
                desc: "Autonomous Scrum Master that manages Jira boards. Features Scope Creep detection, Auto-Grooming, and Definition of Done checks.",
                tags: ["Jira API", "React", "Agentic AI", "DevOps"],
                link: "/project-flow",
                featured: true,
                icon: SquareKanban,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                border: "border-blue-500/20"
            },
            {
                title: "ReviewFlow AI",
                role: "AI Engineer",
                desc: "Reputation Engine that turns feedback into action. Features Sentiment Analysis, Intelligent Routing, and Automated Operational Triggers.",
                tags: ["NLP", "React", "Automation", "Reputation"],
                link: "/review-flow",
                featured: true,
                icon: StarHalf,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
                border: "border-amber-500/20"
            },
            {
                title: "QueryFlow AI",
                role: "Data Engineer",
                desc: "Enterprise Data Agent that bridges natural language and SQL. Features Metadata Scouting, Federated Execution, and Lineage Tracking.",
                tags: ["Text-to-SQL", "React", "Trino", "Data"],
                link: "/query-flow",
                featured: true,
                icon: Database,
                color: "text-violet-500",
                bg: "bg-violet-500/10",
                border: "border-violet-500/20"
            },
            {
                title: "Enterprise Collections AI",
                role: "AI Engineer",
                desc: "Autonomous dispute agent for VCC overcharges. Features cognitive flow, strategy engine, and auto-rebuttal loops.",
                tags: ["LangGraph", "React", "Agentic AI", "FinTech"],
                link: "/collections",
                featured: true,
                icon: Sparkles,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
                border: "border-emerald-500/20"
            },
            {
                title: "SlipVerify AI",
                role: "AI Engineer",
                desc: "Intelligent expense verification system using ChainGraph. Features multi-agent orchestration for fraud detection and OCR.",
                tags: ["LangGraph", "React", "Agentic AI", "OCR"],
                link: "/slip-verify",
                featured: true,
                icon: FileText,
                color: "text-purple-500",
                bg: "bg-purple-500/10",
                border: "border-purple-500/20"
            }
        ]
    },
    {
        category: "AI Projects & Websites",
        description: "Full-stack applications and AI-powered tools",
        items: [
            {
                title: "SplitBill AI",
                role: "Creator & Developer",
                desc: "Built end-to-end. Features instant receipt scanning with Gemini AI, automatic item parsing, and smart assignment.",
                tags: ["Gemini AI", "React", "Firebase"],
                link: "https://splitbill-ai.com/",
                featured: true,
                icon: Receipt,
                color: "text-pink-500",
                bg: "bg-pink-500/10",
                border: "border-pink-500/20"
            },
            {
                title: "AI Resume Builder",
                role: "Full Stack Developer",
                desc: "Interactive resume builder with AI-powered content suggestions and real-time preview.",
                tags: ["React", "Gemini AI", "Tailwind CSS"],
                link: "/resume-builder",
                featured: false,
                icon: Code,
                color: "text-teal-500",
                bg: "bg-teal-500/10",
                border: "border-teal-500/20"
            },
            {
                title: "Gemini OCR",
                role: "Frontend Developer",
                desc: "High-accuracy OCR tool powered by Google's Gemini Vision Pro. Extracts structured data from complex documents.",
                tags: ["Gemini API", "React", "OCR", "AI"],
                link: "/gemini-ocr",
                featured: false,
                icon: ScanText,
                color: "text-indigo-500",
                bg: "bg-indigo-500/10",
                border: "border-indigo-500/20"
            },
            {
                title: "Local Guide",
                role: "Full Stack Developer",
                desc: "End-to-end booking platform POC. Demonstrates full-stack development capabilities including real-time availability and booking management.",
                tags: ["React", "Full Stack", "Booking System", "POC"],
                link: "https://web-production-c4714.up.railway.app/",
                featured: true,
                icon: Map,
                color: "text-cyan-500",
                bg: "bg-cyan-500/10",
                border: "border-cyan-500/20"
            }
        ]
    }
];

export default function Projects() {
    return (
        <section id="projects" className="py-20 px-4 relative">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tight">
                        Featured <span className="text-violet-500">Projects</span>
                    </h2>
                    <p className="text-sm font-bold text-violet-400 mb-6 uppercase tracking-widest">Personal projects that showcase my ability</p>
                    <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Building rapid AI prototypes (often within days not weeks) and scalable intelligent solutions.
                    </p>
                </motion.div>

                <div className="space-y-24">
                    {projectSections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="mb-10 pl-4 border-l-4 border-violet-500"
                            >
                                <h3 className="text-2xl font-bold text-white mb-2">{section.category}</h3>
                                <p className="text-slate-400 text-sm">{section.description}</p>
                            </motion.div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {section.items.map((project, index) => {
                                    const isExternal = project.link.startsWith('http') || project.link.endsWith('.html');
                                    // @ts-ignore - Dynamic badge property
                                    const badge = project.badge;

                                    const CardContent = () => (
                                        <>
                                            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${project.color}`}>
                                                <project.icon className="w-32 h-32 -mr-8 -mt-8 transform rotate-12" />
                                            </div>

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className={`w-12 h-12 rounded-xl ${project.bg} ${project.border} border flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                        <project.icon className={`w-6 h-6 ${project.color}`} />
                                                    </div>
                                                    {badge && (
                                                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${badge === 'Lecture Insight'
                                                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                                                : 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30'
                                                            }`}>
                                                            {badge}
                                                        </span>
                                                    )}
                                                    {!badge && <ArrowUpRight className="text-slate-600 group-hover:text-white w-5 h-5 transition-colors" />}
                                                </div>

                                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-xs font-mono text-slate-500 mb-4 uppercase tracking-wide">{project.role}</p>

                                                <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                                    {project.desc}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mt-auto">
                                                    {project.tags.map((tag, i) => (
                                                        <span key={i} className="text-xs px-2.5 py-1 bg-slate-800/50 border border-slate-700 rounded-md text-slate-300 group-hover:border-slate-600 transition-colors">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    );

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
                                                    className="group block h-full bg-slate-900 border border-slate-800 p-6 hover:border-slate-600 transition-all rounded-2xl relative overflow-hidden hover:-translate-y-1 hover:shadow-xl"
                                                >
                                                    <CardContent />
                                                </a>
                                            ) : (
                                                <Link
                                                    to={project.link}
                                                    className="group block h-full bg-slate-900 border border-slate-800 p-6 hover:border-slate-600 transition-all rounded-2xl relative overflow-hidden hover:-translate-y-1 hover:shadow-xl"
                                                >
                                                    <CardContent />
                                                </Link>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
