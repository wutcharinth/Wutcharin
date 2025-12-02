import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Bot, Zap, TrendingUp, CheckCircle2 } from 'lucide-react';

const stats = [
    { label: "Years People Management", value: "10+", icon: Users },
    { label: "AI Agents Deployed", value: "20+", icon: Bot },
    { label: "Hours Annual Efficiency", value: "12k", icon: Zap },
    { label: "Data Pros Managed", value: "50+", icon: TrendingUp },
];

export default function ExecutiveProfile() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="about" className="py-24 px-4 relative">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 uppercase tracking-tight">
                        Executive <span className="text-violet-500">Profile</span>
                    </h2>
                    <div className="w-24 h-1 bg-violet-600 mx-auto rounded-full"></div>
                </motion.div>

                <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-violet-500/30 transition-all group hover:bg-slate-800/50"
                        >
                            <stat.icon className="w-8 h-8 text-violet-500 mb-4 group-hover:scale-110 transition-transform" />
                            <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                            <div className="text-sm text-slate-400 font-bold uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8 text-lg text-slate-300 leading-relaxed"
                    >
                        <div className="p-8 border border-slate-800 bg-slate-900/30 rounded-2xl">
                            <p>
                                Executive leader with nearly 20 years of experience (10+ in people management), possessing a <strong className="text-white">unique combination of Business Strategy and Technical Execution expertise</strong>.
                            </p>
                        </div>
                        <p>
                            Specialized in <strong className="text-violet-400">scaling high-performing AI, Automation, and Analytics functions</strong>, I am a hands-on builder who translates complex data into C-suite strategies, having managed <strong className="text-white">50+ data professionals</strong> over my career. Expert in bridging the gap between Finance, Engineering, and Commercial strategy in both hyper-growth Tech (Agoda) and Aviation sectors.
                        </p>
                        <blockquote className="p-6 border-l-4 border-violet-500 bg-slate-900/50 text-slate-200 italic rounded-r-xl">
                            "Exceptions deserve people. Patterns deserve Code."
                        </blockquote>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-10 shadow-2xl">
                            <h3 className="text-2xl font-bold mb-8 text-white uppercase tracking-tight flex items-center gap-3">
                                <div className="w-2 h-8 bg-violet-500 rounded-full"></div>
                                Core Competencies
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                {['Strategic Planning', 'Data Governance', 'Cloud Architecture', 'Team Building', 'Process Automation', 'Stakeholder Mgmt', 'Data Analytics', 'AI Automation', 'Rapid Prototyping'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-slate-300 font-medium group hover:translate-x-2 transition-transform">
                                        <CheckCircle2 className="w-5 h-5 text-violet-500 group-hover:text-violet-400 transition-colors" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
