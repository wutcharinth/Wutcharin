import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const experiences = [
    {
        company: "Agoda",
        role: "Associate Director - FinTech Data and Automation",
        period: "Apr 2024 - Present",
        desc: "Orchestrating data strategy for FinTech vertical. Leading Finance AI roadmap and driving adoption of advanced analytics."
    },
    {
        company: "Agoda",
        role: "Associate Director - Supply Analytics",
        period: "Nov 2017 - Apr 2022",
        desc: "Developed predictive ROI models and architected centralized Supply database. Deployed 100+ Tableau dashboards."
    },
    {
        company: "Really Cool Airlines",
        role: "Head of Commercial",
        period: "Apr 2023 - Feb 2024",
        desc: "Pioneered commercial division, secured 200M THB seed capital, and directed all commercial functions."
    },
    {
        company: "Thairath Group",
        role: "Head of Strategic Foresight",
        period: "Apr 2022 - Apr 2023",
        desc: "Engineered group-wide data transformation and launched new business units."
    },
    {
        company: "Nok Air",
        role: "Planning Director",
        period: "Oct 2016 - Nov 2017",
        desc: "Co-architected corporate turnaround leading to 15% increase in aircraft utilization."
    }
];

export default function Experience() {
    return (
        <section id="experience" className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center mb-16"
                >
                    Professional <span className="text-primary">Experience</span>
                </motion.h2>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-0 md:left-1/2 h-full w-px bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 transform -translate-x-1/2 hidden md:block" />

                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 mt-1.5 hidden md:block shadow-[0_0_10px_rgba(6,182,212,0.8)]" />

                                <div className="flex-1">
                                    <div className={`p-6 rounded-2xl bg-dark-lighter border border-primary/10 hover:border-primary/30 transition-colors ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                                        }`}>
                                        <h3 className="text-xl font-bold text-white mb-1">{exp.company}</h3>
                                        <h4 className="text-primary font-medium mb-3">{exp.role}</h4>

                                        <div className={`flex items-center gap-2 text-sm text-gray-500 mb-4 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                                            }`}>
                                            <Calendar className="w-4 h-4" />
                                            {exp.period}
                                        </div>

                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {exp.desc}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
