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
        <section id="about" className="py-20 px-4 relative bg-secondary/10 border-y-2 border-black">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center mb-16 uppercase tracking-tighter"
                >
                    Executive <span className="text-primary bg-black px-2 text-white">Profile</span>
                </motion.h2>

                <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                            <div className="text-4xl font-bold text-black mb-2">{stat.value}</div>
                            <div className="text-sm text-black font-bold uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 text-lg text-black leading-relaxed font-medium"
                    >
                        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <p>
                                Executive leader with nearly 20 years of experience (10+ in people management), possessing a <strong className="bg-primary text-white px-1">unique combination of Business Strategy and Technical Execution expertise</strong>.
                            </p>
                        </div>
                        <p>
                            Specialized in <strong className="bg-black text-white px-1">scaling high-performing AI, Automation, and Analytics functions</strong>, I am a hands-on builder who translates complex data into C-suite strategies, having secured <strong className="bg-black text-white px-1">200M THB in capital</strong> via data-driven planning. Expert in bridging the gap between Finance, Engineering, and Commercial strategy in both hyper-growth Tech (Agoda) and Aviation sectors.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-bold mb-6 text-black uppercase border-b-2 border-black pb-2 inline-block">Core Competencies</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    "Strategic Planning", "Data Governance",
                                    "Cloud Architecture", "Team Building",
                                    "Process Automation", "Stakeholder Mgmt"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-black font-bold">
                                        <div className="w-3 h-3 bg-black" />
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
