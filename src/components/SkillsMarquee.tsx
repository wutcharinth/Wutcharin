
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
        <section className="py-20 bg-bg border-y-2 border-border overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                <h2 className="text-2xl font-bold text-text uppercase tracking-widest border-2 border-border inline-block px-4 py-2 shadow-[4px_4px_0px_0px_var(--shadow-color)]">Technical Expertise</h2>
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
                            className="px-8 py-4 bg-bg border-2 border-border text-xl font-bold text-text hover:bg-inverse hover:text-inverse-text transition-colors cursor-default shadow-[4px_4px_0px_0px_var(--shadow-color)]"
                        >
                            {skill}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
