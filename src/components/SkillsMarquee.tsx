
import { motion } from 'framer-motion';

const skills = [
    "AI Agents", "AI Automations", "RAG", "LLM Integration",
    "Cursor", "Claude Code", "Antigravity", "VS Code",
    "n8n", "Python", "SQL", "Machine Learning",
    "Prompt Engineering", "Workflow Automation", "Data Strategy",
    "Tableau", "PowerBI", "React", "TypeScript",
    "Team Leadership", "Strategic Planning", "Google Cloud"
];

export default function SkillsMarquee() {
    return (
        <section className="py-20 bg-dark-lighter/30 border-y border-primary/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-transparent to-dark z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Technical Expertise</h2>
            </div>

            <div className="flex relative">
                <motion.div
                    className="flex gap-8 whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 40,
                    }}
                >
                    {[...skills, ...skills].map((skill, index) => (
                        <div
                            key={index}
                            className="px-8 py-4 bg-dark border border-primary/20 rounded-xl text-xl font-medium text-gray-300 hover:text-primary hover:border-primary/50 transition-colors cursor-default"
                        >
                            {skill}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
