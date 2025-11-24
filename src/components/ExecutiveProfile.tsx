import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
    { label: "Years Experience", value: "20+" },
    { label: "AI Agents Deployed", value: "20+" },
    { label: "Annual Efficiency", value: "12k Hrs" },
    { label: "Capital Secured", value: "200M THB" },
];

export default function ExecutiveProfile() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="about" className="py-24 px-4 relative bg-white border-y-4 border-black">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-6xl md:text-8xl font-black text-center mb-24 uppercase tracking-tighter leading-none"
                >
                    Executive <span className="text-white bg-black px-4 transform -rotate-2 inline-block">Profile</span>
                </motion.h2>

                <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] text-center hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all group"
                        >
                            <div className="text-6xl font-black text-black mb-4 group-hover:text-primary transition-colors">{stat.value}</div>
                            <div className="text-lg text-black font-black uppercase tracking-widest">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8 text-xl text-black leading-relaxed font-bold"
                    >
                        <div className="p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_#FF1E1E]">
                            <p>
                                Executive leader with nearly 20 years of experience (10+ in people management), possessing a <strong className="bg-black text-white px-2">unique combination of Business Strategy and Technical Execution expertise</strong>.
                            </p>
                        </div>
                        <p className="uppercase">
                            Specialized in <strong className="text-primary underline decoration-4 decoration-black underline-offset-4">scaling high-performing AI, Automation, and Analytics functions</strong>, I am a hands-on builder who translates complex data into C-suite strategies, having secured <strong className="bg-primary text-white px-2">200M THB in capital</strong> via data-driven planning. Expert in bridging the gap between Finance, Engineering, and Commercial strategy in both hyper-growth Tech (Agoda) and Aviation sectors.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="relative bg-black p-10 shadow-[16px_16px_0px_0px_#FF1E1E]">
                            <h3 className="text-3xl font-black mb-8 text-white uppercase border-b-4 border-white pb-4 inline-block">Core Competencies</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {['Strategic Planning', 'Data Governance', 'Cloud Architecture', 'Team Building', 'Process Automation', 'Stakeholder Mgmt'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-white font-bold text-xl uppercase tracking-wider group hover:translate-x-2 transition-transform">
                                        <div className="w-4 h-4 bg-primary border-2 border-white group-hover:bg-white transition-colors"></div>
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
