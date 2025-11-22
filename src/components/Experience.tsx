import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const experiences = [
    {
        company: "Agoda",
        role: "Associate Director - FinTech Data and Automation",
        period: "Apr 2024 - Present",
        points: [
            "Orchestrating the data and automation strategy for the FinTech vertical, leading a 7-person team to enhance risk management, compliance, and operational efficiency.",
            "Leading Finance AI Department Co-creation Roadmap and ideation, driving strategic initiatives that leverage AI to transform financial operations and decision-making processes.",
            "Delivering comprehensive analytics for Treasury, Tax, Credit Risk, and Collections to drive efficiency gains and resolve upstream data issues.",
            "Championing adoption of advanced analytics and self-service BI tools to embed data-driven decision-making across the finance organization."
        ]
    },
    {
        company: "Agoda",
        role: "Associate Director - Supply Analytics",
        period: "Nov 2017 - Apr 2022",
        points: [
            "Capitalized on data to drive supply strategy, developing predictive ROI and churn models that significantly grew high-value partnerships and informed C-suite decisions.",
            "Architected the centralized Supply department database, empowering the organization with enhanced data accessibility and analysis capabilities.",
            "Designed and deployed over 100 Tableau dashboards, democratizing data for 600+ weekly users and fostering a culture of self-service analytics."
        ]
    },
    {
        company: "Really Cool Airlines",
        role: "Head of Commercial",
        period: "Apr 2023 - Feb 2024",
        points: [
            "Pioneered the airline's commercial division from concept, establishing 6 teams (11 headcount) and securing 200M THB in seed capital by articulating a compelling market entry strategy.",
            "Directed all commercial functions: Route Planning, Revenue Management, Sales & Distribution, Marketing, and Product Development.",
            "Led provider selection and negotiation for all key systems, balancing lean startup budgets with critical capabilities."
        ]
    },
    {
        company: "Thairath Group",
        role: "Head of Strategic Foresight and Planning",
        period: "Apr 2022 - Apr 2023",
        points: [
            "Engineered a group-wide data transformation, implementing KPI frameworks and analytics systems that unified strategic priorities across diverse business units.",
            "Advised on resource allocation, inter-departmental communication, and technology decisions to drive group-level goals.",
            "Launched a new business unit (Taro Media) by authoring the complete business plan to mitigate content rights risks and capture international revenue streams."
        ]
    },
    {
        company: "Nok Air",
        role: "Planning Director",
        period: "Oct 2016 - Nov 2017",
        points: [
            "Co-architected a successful corporate turnaround by deploying analytical models for network optimization, directly leading to a 15% increase in aircraft utilization and a +3 p.p. YoY gain in cabin factor.",
            "Authored and presented the comprehensive turnaround strategy to the Board of Directors, lessors, banks, and potential investors, securing critical new investment."
        ]
    },
    {
        company: "Thai Smile Airways",
        role: "Corporate Strategy & Planning Manager",
        period: "Nov 2015 - Oct 2016",
        points: [
            "Increased route profitability and expanded market share by directing data-driven network planning and capacity decisions.",
            "Led successful negotiations with aviation authorities and airports to secure operating permits and optimal slots for new destinations."
        ]
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

                                        <ul className="space-y-2">
                                            {exp.points.map((point, i) => (
                                                <li key={i} className="text-gray-400 text-sm leading-relaxed flex gap-2">
                                                    <span className="text-primary mt-1.5">•</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
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
