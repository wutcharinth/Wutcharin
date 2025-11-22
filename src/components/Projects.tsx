import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const projects = [
    {
        title: "Really Cool Airlines",
        role: "Head of Commercial",
        desc: "Led commercial division setup, secured 200M THB seed capital, and obtained CAAT business license. Speaker at Routes World 2023.",
        tags: ["Business Strategy", "Fundraising", "Aviation"],
        link: "https://aviationweek.com/air-transport/airports-networks/thai-startup-really-cool-airlines-plans-q2-2024-launch-airbus-a330",
        featured: true
    },
    {
        title: "SplitBill AI",
        role: "Creator & Developer",
        desc: "Built end-to-end in 7 days. Features instant receipt scanning with Gemini AI, automatic item parsing, and smart assignment.",
        tags: ["Gemini AI", "React", "Firebase", "Google AI Studio"],
        link: "https://splitbill-ai.com/",
        featured: true
    },
    {
        title: "LocalGuide",
        role: "Full Stack Developer",
        desc: "Booking platform prototype connecting travelers with local guides. Complete auth system, profile management, and payments.",
        tags: ["React", "Express.js", "PostgreSQL", "Railway"],
        link: "https://web-production-c4714.up.railway.app",
        featured: false
    }
];

export default function Projects() {
    return (
        <section id="projects" className="py-20 px-4 bg-dark-lighter/30">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">Featured <span className="text-primary">Projects</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        From rapid AI prototypes to large-scale commercial aviation strategies.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group block bg-dark border border-primary/10 rounded-2xl p-6 hover:border-primary/50 transition-all hover:-translate-y-2 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowUpRight className="text-primary w-6 h-6" />
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <span className="text-sm text-primary/80 font-medium">{project.role}</span>
                            </div>

                            <p className="text-gray-400 text-sm mb-6 line-clamp-4">
                                {project.desc}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
