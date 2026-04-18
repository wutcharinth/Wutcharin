import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpRight, ShieldCheck, SquareKanban, StarHalf, Database, MessageSquare,
    FileText, ScanText, Code, Receipt, Map, TrendingUp, Briefcase, Brain,
    Sparkles, Heart, BarChart2, type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SplitText, RevealOnScroll, TiltCard } from '../lib/motion';

type Project = {
    title: string;
    role: string;
    badge?: string;
    desc: string;
    tags: string[];
    link: string;
    icon: LucideIcon;
    accent: string; // hex-ish, used for ambient glow
};

type Section = {
    category: string;
    description: string;
    items: Project[];
};

const projectSections: Section[] = [
    {
        category: 'Interactive Lecture Insights',
        description: 'Transforming profound lectures and data into interactive visual experiences',
        items: [
            { title: 'Karpathy LLM Guide', role: 'Interactive Article', badge: 'Lecture Insight', desc: "A definitive technical and strategic synthesis of Andrej Karpathy's masterclass on professional LLM utilization. Features Token visualizers and Model ELO charts.", tags: ['Andrej Karpathy', 'LLM', 'Interactive', 'Education'], link: '/karpathy-deep-dive', icon: Brain, accent: '#818cf8' },
            { title: 'The Human Edge', role: 'Interactive Article', badge: 'Lecture Insight', desc: "Based on Po-Shen Loh's philosophy. Features a 'Mental Fitness' simulation and visualizations of the new survival skills in the AI era.", tags: ['Philosophy', 'React', 'Interactive', 'Mental Fitness'], link: '/human-edge', icon: Heart, accent: '#22d3ee' },
            { title: 'Agentic AI Deep Dive', role: 'Technical Writer & Educator', badge: 'Lecture Insight', desc: "Interactive article exploring Stanford CS230's lecture on Agentic AI. Features visualizations of the Jagged Frontier, Prompt Engineering, HyDE, and ReAct patterns.", tags: ['Stanford CS230', 'Agentic AI', 'Interactive', 'Education'], link: '/agentic-ai', icon: Brain, accent: '#a78bfa' },
            { title: 'Thai Election 2566', role: 'Data Artist & AI Engineer', badge: 'Data Story', desc: 'Interactive data storytelling with an integrated RAG-based AI chatbot. Visualizes 2023 election results with deep political insights.', tags: ['Data Viz', 'RAG', 'Gemini AI', 'React'], link: '/thai-election', icon: MessageSquare, accent: '#fb923c' },
            { title: 'Thailand 2026 Election Investigation', role: 'Data Investigator & Journalist', badge: 'Data Story', desc: "Statistical investigation of Thailand's controversial Feb 8, 2026 election. Covers QR-code ballot secrecy, vote-count mismatches, the 1:1 ratio anomaly, and annulment petitions — using official ECT data across 382 districts.", tags: ['ECT Data', 'ECharts', 'Bilingual', 'Investigation'], link: '/election-2026.html', icon: BarChart2, accent: '#ef4444' },
            { title: 'AI Evolution Stats', role: 'Data Storyteller', badge: 'Data Story', desc: 'Interactive visualization of the exponential rise of AI. From Parameter Explosions to the Context Revolution.', tags: ['Data Storytelling', 'Recharts', 'React', 'AI Trends'], link: '/ai-evolution', icon: TrendingUp, accent: '#e879f9' },
            { title: 'Future of Work', role: 'Data Journalist', badge: 'Data Story', desc: 'A data-driven view on global job disruption and the emerging roles of tomorrow. Automation vs Transformation.', tags: ['Data Journalism', 'React', 'Labor Stats'], link: '/future-of-work', icon: Briefcase, accent: '#22d3ee' },
        ],
    },
    {
        category: 'AI Agents & Agentic Simulations',
        description: 'Autonomous agents solving complex enterprise workflows',
        items: [
            { title: 'RiskGuard AI', role: 'AI Engineer', desc: 'Internal Control System that audits transactions in real-time. Features Policy Checks, Entity Resolution (COI), and Market Benchmarking.', tags: ['LangGraph', 'React', 'Risk', 'Audit'], link: '/risk-guard', icon: ShieldCheck, accent: '#f43f5e' },
            { title: 'ProjectFlow AI', role: 'AI Engineer', desc: 'Autonomous Scrum Master that manages Jira boards. Features Scope Creep detection, Auto-Grooming, and Definition of Done checks.', tags: ['Jira API', 'React', 'Agentic AI', 'DevOps'], link: '/project-flow', icon: SquareKanban, accent: '#3b82f6' },
            { title: 'ReviewFlow AI', role: 'AI Engineer', desc: 'Reputation Engine that turns feedback into action. Features Sentiment Analysis, Intelligent Routing, and Automated Operational Triggers.', tags: ['NLP', 'React', 'Automation', 'Reputation'], link: '/review-flow', icon: StarHalf, accent: '#f59e0b' },
            { title: 'QueryFlow AI', role: 'Data Engineer', desc: 'Enterprise Data Agent that bridges natural language and SQL. Features Metadata Scouting, Federated Execution, and Lineage Tracking.', tags: ['Text-to-SQL', 'React', 'Trino', 'Data'], link: '/query-flow', icon: Database, accent: '#8b5cf6' },
            { title: 'Enterprise Collections AI', role: 'AI Engineer', desc: 'Autonomous dispute agent for VCC overcharges. Features cognitive flow, strategy engine, and auto-rebuttal loops.', tags: ['LangGraph', 'React', 'Agentic AI', 'FinTech'], link: '/collections', icon: Sparkles, accent: '#10b981' },
            { title: 'SlipVerify AI', role: 'AI Engineer', desc: 'Intelligent expense verification system using ChainGraph. Features multi-agent orchestration for fraud detection and OCR.', tags: ['LangGraph', 'React', 'Agentic AI', 'OCR'], link: '/slip-verify', icon: FileText, accent: '#a855f7' },
        ],
    },
    {
        category: 'AI Projects & Websites',
        description: 'Full-stack applications and AI-powered tools',
        items: [
            { title: 'SplitBill AI', role: 'Creator & Developer', desc: 'Built end-to-end. Features instant receipt scanning with Gemini AI, automatic item parsing, and smart assignment.', tags: ['Gemini AI', 'React', 'Firebase'], link: 'https://splitbill-ai.com/', icon: Receipt, accent: '#ec4899' },
            { title: 'AI Resume Builder', role: 'Full Stack Developer', desc: 'Interactive resume builder with AI-powered content suggestions and real-time preview.', tags: ['React', 'Gemini AI', 'Tailwind CSS'], link: '/resume-builder', icon: Code, accent: '#14b8a6' },
            { title: 'Gemini OCR', role: 'Frontend Developer', desc: "High-accuracy OCR tool powered by Google's Gemini Vision Pro. Extracts structured data from complex documents.", tags: ['Gemini API', 'React', 'OCR', 'AI'], link: '/gemini-ocr', icon: ScanText, accent: '#818cf8' },
            { title: 'Local Guide', role: 'Full Stack Developer', desc: 'End-to-end booking platform POC. Demonstrates full-stack development capabilities including real-time availability and booking management.', tags: ['React', 'Full Stack', 'Booking System', 'POC'], link: 'https://web-production-c4714.up.railway.app/', icon: Map, accent: '#22d3ee' },
        ],
    },
];

const ALL = 'All Projects';

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const isExternal = project.link.startsWith('http') || project.link.endsWith('.html');
    const Icon = project.icon;

    const Inner = (
        <TiltCard max={7} lift={8} className="group relative h-full rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm p-6 md:p-7 overflow-hidden" data-cursor="view">
            {/* Ambient glow that matches the project accent */}
            <div
                className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                style={{ backgroundColor: project.accent }}
                aria-hidden="true"
            />
            {/* Oversized ghost icon */}
            <div className="pointer-events-none absolute -bottom-6 -right-4 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-500">
                <Icon className="w-44 h-44" style={{ color: project.accent }} />
            </div>
            {/* Subtle top highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

            <div data-tilt-parallax data-tilt-depth="14" className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div
                        className="w-11 h-11 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{
                            backgroundColor: `${project.accent}14`,
                            borderColor: `${project.accent}33`,
                        }}
                    >
                        <Icon className="w-5 h-5" style={{ color: project.accent }} />
                    </div>
                    {project.badge ? (
                        <span
                            className="px-2.5 py-1 rounded-md text-[9px] font-mono uppercase tracking-[0.2em] border"
                            style={{
                                color: project.accent,
                                backgroundColor: `${project.accent}14`,
                                borderColor: `${project.accent}33`,
                            }}
                        >
                            {project.badge}
                        </span>
                    ) : (
                        <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                            <span>Open</span>
                            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                    )}
                </div>

                <div className="mb-1 flex items-baseline gap-2">
                    <span className="font-mono text-[10px] text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-lg md:text-xl font-medium text-white tracking-[-0.01em]">{project.title}</h3>
                </div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.18em] mb-5">{project.role}</p>

                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 flex-grow mb-6">
                    {project.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 group-hover:border-white/20 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </TiltCard>
    );

    if (isExternal) {
        return (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                {Inner}
            </a>
        );
    }
    return (
        <Link to={project.link} className="block h-full">
            {Inner}
        </Link>
    );
}

export default function Projects() {
    const categories = useMemo(() => [ALL, ...projectSections.map((s) => s.category)], []);
    const [active, setActive] = useState(ALL);

    const visible = useMemo(() => {
        if (active === ALL) return projectSections;
        return projectSections.filter((s) => s.category === active);
    }, [active]);

    return (
        <section id="projects" className="relative py-32 px-4 overflow-hidden">
            {/* Background grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]"
                aria-hidden="true"
            />

            <div className="relative max-w-7xl mx-auto">
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                    >
                        <span className="h-1 w-1 rounded-full bg-violet-400" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300">03 · Work</span>
                    </motion.div>

                    <SplitText
                        as="h2"
                        mode="words"
                        stagger={0.06}
                        className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-0.03em] text-white leading-[0.92] block max-w-3xl"
                    >
                        Featured Projects
                    </SplitText>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-8 max-w-2xl text-base md:text-lg text-slate-400 font-light leading-relaxed"
                    >
                        Rapid AI prototypes — often shipped in days, not weeks — and scalable intelligent systems at enterprise scale.
                    </motion.p>

                    {/* Filter tabs */}
                    <div className="mt-10 flex flex-wrap gap-2">
                        {categories.map((c) => {
                            const isActive = c === active;
                            return (
                                <button
                                    key={c}
                                    onClick={() => setActive(c)}
                                    className={`relative cursor-hover rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors ${isActive ? 'text-slate-950' : 'text-slate-300 hover:text-white'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="projectFilterPill"
                                            className="absolute inset-0 rounded-full bg-white"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{c}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-20"
                    >
                        {visible.map((section, si) => (
                            <div key={section.category}>
                                <RevealOnScroll staggerChildren={0.08} className="mb-10">
                                    <div data-reveal-child className="flex items-baseline gap-4 flex-wrap">
                                        <span className="font-mono text-xs text-violet-300/80 tracking-[0.22em] uppercase">
                                            Cat · 0{si + 1}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-medium text-white tracking-[-0.01em]">
                                            {section.category}
                                        </h3>
                                    </div>
                                    <div data-reveal-child className="mt-2 text-sm md:text-base text-slate-400 font-light max-w-2xl">
                                        {section.description}
                                    </div>
                                    <div data-reveal-child className="mt-4 h-px w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
                                </RevealOnScroll>

                                <RevealOnScroll staggerChildren={0.08} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {section.items.map((p, i) => (
                                        <div key={p.title} data-reveal-child className="h-full">
                                            <ProjectCard project={p} index={i} />
                                        </div>
                                    ))}
                                </RevealOnScroll>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
