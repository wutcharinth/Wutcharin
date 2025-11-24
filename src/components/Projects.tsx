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
        <section id="projects" className="py-20 px-4 bg-secondary/10 border-y-2 border-black">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 uppercase tracking-tighter">Featured <span className="text-white bg-black px-2">Projects</span></h2>
                    <p className="text-black font-bold max-w-2xl mx-auto border-2 border-black bg-white inline-block px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
                            className="group block bg-white border-2 border-black p-6 hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-100">
                                <ArrowUpRight className="text-black group-hover:text-white w-6 h-6 border-2 border-black group-hover:border-white bg-white group-hover:bg-black transition-colors" />
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-black group-hover:text-white transition-colors uppercase tracking-tight">
                                    {project.title}
                                </h3>
                                <span className="text-sm text-primary group-hover:text-black font-bold bg-black group-hover:bg-white px-1 inline-block mt-1">{project.role}</span>
                            </div>

                            <p className="text-black group-hover:text-white text-sm mb-6 line-clamp-4 font-medium border-t-2 border-black group-hover:border-white pt-4">
                                {project.desc}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="text-xs px-3 py-1 bg-white border-2 border-black text-black font-bold group-hover:bg-black group-hover:text-white group-hover:border-white transition-colors">
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
