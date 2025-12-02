
import { motion } from 'framer-motion';

const skills = [
    "Strategic Transformation", "Startups", "Negotiation", "Commercial Operations", "Business Development",
    "Strategic Planning", "Analytical Skills", "Business Analysis", "Artificial Intelligence (AI)", "Automation",
    "Data Analytics", "FinTech", "Machine Learning", "Tableau", "KPI Development",
    "Financial Modeling", "Database Management", "Credit Risk Modeling", "Business Intelligence", "Project Management",
    "AI Agents", "AI Automations", "RAG", "LLM Integration",
    "Cursor", "Claude Code", "Antigravity", "VS Code",
    "n8n", "Python", "SQL",
    "Prompt Engineering", "Workflow Automation", "Data Strategy",
    "PowerBI", "React", "TypeScript",
    "Team Leadership", "Google Cloud"
];

export default function SkillsMarquee() {
    return (
        <section className="py-20 bg-[#020617] border-y border-white/5 overflow-hidden relative">
            <div className="absolute inset-0 bg-violet-500/5 blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-4 mb-10 text-center relative z-10">
                <h2 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-2">Technical Expertise</h2>
                <div className="w-12 h-1 bg-violet-600 mx-auto rounded-full"></div>
            </div>

            <div className="flex relative z-10">
                <motion.div
                    className="flex gap-4 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 60,
                    }}
                >
                    {[...skills, ...skills].map((skill, index) => (
                        <div
                            key={index}
                            className="px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-full text-lg font-medium text-slate-300 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/10 transition-all cursor-default"
                        >
                            {skill}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
