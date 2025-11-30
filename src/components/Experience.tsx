import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const experiences = [
    {
        company: "Agoda",
        role: "Associate Director - FinTech Data and Automation",
        period: "Apr 2024 - Present",
        points: [
            "Strategic Leadership: Lead the FinTech Data and Automation (FDA) division, comprised of an 8-person team across Finance Analytics and RPA/AI. Drive operational efficiencies across critical functions including Treasury, Tax, and Credit Risk.",
            "Impact: Achieved 12,000 hours in annual productivity gain by implementing targeted automation and data-driven process improvements, significantly reducing manual workload in financial reconciliation.",
            "Vision: Define and execute the long-term AI, Automation, and Analytics vision for FinTech, championing advanced analytics and self-service BI tools to embed a data-first culture within the finance organization."
        ]
    },
    {
        company: "Agoda",
        role: "Associate Director - Supply Analytics",
        period: "Nov 2017 - Apr 2022",
        points: [
            "Analytics Leadership: Led a team of 7 data professionals across Partner Programs and the Agoda Display Network. Partnered with MIS on database/dashboard development and presented KPI insights to senior leaders.",
            "Cross-Functional Collaboration: Collaborated intensively with Sales, Account Management, and Product teams on new product launches, sales strategies, and goal setting.",
            "Innovation: Built credit risk models and protocols. Evaluated business opportunities and formulated optimization strategies to support Regional Account Management.",
            "Scale: Oversaw the development and delivery of a comprehensive self-service analytics ecosystem, including 100+ Tableau dashboards for 600+ users."
        ]
    },
    {
        company: "Really Cool Airlines",
        role: "Head of Commercial",
        period: "Apr 2023 - Feb 2024",
        points: [
            "Startup Launch: Built and mentored a high-performing commercial division of 11 professionals from the ground up, establishing 6 teams including Network Planning, Revenue Management, Commercial Operations, and Marketing.",
            "Fundraising: Translated complex market data into a compelling vision and investor pitch, leveraging insights from fleet and schedule planning to secure 200M THB in seed funding to launch the airline.",
            "Strategy: Foster a culture of excellence and innovation, setting the strategic direction for route planning and business development."
        ]
    },
    {
        company: "Thairath Group",
        role: "Head of Strategic Foresight and Planning",
        period: "Apr 2022 - Apr 2023",
        points: [
            "Transformation: Managed a team of PMOs and led a data-driven culture project, implementing KPI frameworks and analytics systems that unified strategic priorities across diverse business units.",
            "Advisory: Advised on resource allocation, inter-departmental communication, and technology decisions to drive group-level goals. Launched a new media business unit by developing plans to mitigate content rights risks."
        ]
    },
    {
        company: "Nok Air",
        role: "Planning Director",
        period: "Oct 2016 - Nov 2017",
        points: [
            "Corporate Turnaround: Co-architected a successful corporate turnaround using analytical models to increase aircraft utilization by 15%. Led route network planning, financial modeling, and competitive analysis to design multi-year strategic plans.",
            "Capital Secured: Developed and presented the comprehensive turnaround strategy to the Board of Directors, lessors, banks, and potential investors, securing critical new investment."
        ]
    },
    {
        company: "Thai Smile Airways",
        role: "Corporate Strategy & Planning Manager",
        period: "Nov 2015 - Oct 2016",
        points: [
            "Network Strategy: Managed a team of 8 on network optimization, route expansion, and strategic planning. Monitored KPIs and provided recommendations to senior leadership.",
            "Relations: Built and maintained critical relationships with aviation authorities and government bodies to secure vital operating permits and slots."
        ]
    }
];

export default function Experience() {
    return (
        <section id="experience" className="py-20 px-4 bg-bg">
            <div className="max-w-4xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold text-center mb-16 uppercase tracking-tighter"
                >
                    Professional <span className="text-white bg-primary px-2 border-2 border-border shadow-[4px_4px_0px_0px_var(--shadow-color)]">Experience</span>
                </motion.h2>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-0 md:left-1/2 h-full w-1 bg-border transform -translate-x-1/2 hidden md:block" />

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
                                <div className="absolute left-0 md:left-1/2 w-6 h-6 bg-bg border-2 border-border transform -translate-x-1/2 mt-1.5 hidden md:block z-10" />

                                <div className="flex-1">
                                    <div className={`p-6 bg-bg border-2 border-border shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] transition-all ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'
                                        }`}>
                                        <h3 className="text-xl font-bold text-text mb-1 uppercase">{exp.company}</h3>
                                        <h4 className="text-primary font-bold mb-3 border-b-2 border-border inline-block">{exp.role}</h4>

                                        <div className={`flex items-center gap-2 text-sm text-text font-bold mb-4 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                                            }`}>
                                            <Calendar className="w-4 h-4" />
                                            {exp.period}
                                        </div>

                                        <ul className="space-y-2">
                                            {exp.points.map((point, i) => (
                                                <li key={i} className="text-text text-sm leading-relaxed flex gap-2 font-medium">
                                                    <span className="text-text mt-1.5 min-w-[6px] h-[6px] bg-text block" />
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
