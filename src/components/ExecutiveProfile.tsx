import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
    { label: "Years Experience", value: "20+" },
    { label: "Users Empowered", value: "600+" },
    { label: "Dashboards Built", value: "100+" },
    { label: "Process Reduction", value: "60%" },
];

export default function ExecutiveProfile() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="about" className="py-20 px-4 relative">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center mb-16"
                >
                    Executive <span className="text-primary">Profile</span>
                </motion.h2>

                <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-6 bg-dark-lighter/50 backdrop-blur-sm border border-primary/20 rounded-2xl text-center hover:border-primary/50 transition-colors"
                        >
                            <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                            <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 text-lg text-gray-300 leading-relaxed"
                    >
                        <div className="p-6 border-l-4 border-primary bg-dark-lighter/30 rounded-r-xl">
                            <p>
                                Executive leader with nearly 20 years of experience (10+ in people management), possessing a <strong className="text-white">unique combination of Business Strategy and Technical Execution expertise</strong>.
                            </p>
                        </div>
                        <p>
                            Specialized in <strong className="text-white">scaling high-performing AI, Automation, and Analytics functions</strong>, I am a hands-on builder who translates complex data into C-suite strategies, having secured <strong className="text-white">200M THB in capital</strong> via data-driven planning. Expert in bridging the gap between Finance, Engineering, and Commercial strategy in both hyper-growth Tech (Agoda) and Aviation sectors.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 blur-3xl rounded-full" />
                        <div className="relative bg-dark-lighter border border-primary/20 p-8 rounded-2xl">
                            <h3 className="text-xl font-semibold mb-4 text-white">Core Competencies</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    "Strategic Planning", "Data Governance",
                                    "Cloud Architecture", "Team Building",
                                    "Process Automation", "Stakeholder Mgmt"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-gray-400">
                                        <div className="w-2 h-2 bg-primary rounded-full" />
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
