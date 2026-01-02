import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, SquareKanban, StarHalf, Database, FileText, MessageSquare, TrendingUp, Briefcase, Brain } from 'lucide-react';

const projects = [
    {
        id: 'agentic-ai',
        title: "Agentic AI",
        desc: "Stanford CS230 Lecture Deep Dive",
        icon: Brain,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        link: "/agentic-ai"
    },
    {
        id: 'risk-guard',
        title: "RiskGuard AI",
        desc: "Internal Audit & Compliance Agent",
        icon: ShieldCheck,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        link: "/risk-guard"
    },
    {
        id: 'project-flow',
        title: "ProjectFlow AI",
        desc: "Autonomous Scrum Master Agent",
        icon: SquareKanban,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        link: "/project-flow"
    },
    {
        id: 'review-flow',
        title: "ReviewFlow AI",
        desc: "Reputation & Sentiment Engine",
        icon: StarHalf,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        link: "/review-flow"
    },
    {
        id: 'query-flow',
        title: "QueryFlow AI",
        desc: "Enterprise Data Agent",
        icon: Database,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
        border: "border-violet-500/20",
        link: "/query-flow"
    },
    {
        id: 'collections',
        title: "Collections AI",
        desc: "Autonomous Finance Recovery Agent",
        icon: Database,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        link: "/collections"
    },
    {
        id: 'slip-verify',
        title: "SlipVerify AI",
        desc: "Expense Verification Agent",
        icon: FileText,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        link: "/slip-verify"
    },
    {
        id: 'thai-election',
        title: "Thai Election AI",
        desc: "RAG-based Political Analyst",
        icon: MessageSquare,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        link: "/thai-election"
    },
    {
        id: 'ai-evolution',
        title: "AI Evolution Stats",
        desc: "The Rise of Intelligence",
        icon: TrendingUp,
        color: "text-fuchsia-500",
        bg: "bg-fuchsia-500/10",
        border: "border-fuchsia-500/20",
        link: "/ai-evolution"
    },
    {
        id: 'future-of-work',
        title: "Future of Work",
        desc: "AI & Workforce Data Story",
        icon: Briefcase,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        link: "/future-of-work"
    },
    {
        id: 'karpathy-deep-dive',
        title: "Karpathy LLM Guide",
        desc: "The Probabilistic OS",
        icon: Brain,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        link: "/karpathy-deep-dive"
    }
];

interface ProjectNavigationProps {
    currentId: string;
}

const ProjectNavigation = ({ currentId }: ProjectNavigationProps) => {
    // Filter out current project and get next 3
    const otherProjects = projects.filter(p => p.id !== currentId).slice(0, 3);

    return (
        <section className="py-20 border-t border-slate-800 bg-[#020617]">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Explore Other Agents</h2>
                    <Link to="/" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {otherProjects.map((project) => (
                        <Link
                            key={project.id}
                            to={project.link}
                            className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${project.color}`}>
                                <project.icon className="w-24 h-24 -mr-4 -mt-4 transform rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className={`w-10 h-10 rounded-lg ${project.bg} ${project.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <project.icon className={`w-5 h-5 ${project.color}`} />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-slate-400 font-medium">
                                    {project.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectNavigation;
