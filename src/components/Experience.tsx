import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const experiences = [
    {
        company: "Agoda",
        role: "Associate Director - FinTech Data and Automation",
        period: "Apr 2024 - Present",
        points: [
            "Direct a cross-functional division of 10, encompassing Finance Analytics and RPA/AI teams, to identify and execute on high-impact process automation opportunities.",
            "Crafting the departmental AI vision and roadmap; led workshops and built AI Agents (RAG, Auto-SQL) to automate workflows.",
            "Achieved over 12,000 hours in annualized time savings by deploying targeted automation solutions and machine learning models for collection risk and cashback liability.",
            "Orchestrated deep-dive variance analysis between financial statements and operational data, providing critical insights to leadership on revenue and cost drivers."
        ]
    },
    {
        company: "Agoda",
        role: "Associate Director - Supply Analytics",
        period: "Nov 2017 - Apr 2022",
        points: [
            "Directed analytics for the Partner Programs division, transforming raw data into actionable insights and strategic recommendations presented directly to C-level leadership.",
            "Oversaw credit risk management and analytics for the Partner Prepaid Programs, mitigating financial exposure and optimizing partner payment solutions.",
            "Developed and deployed multiple high-impact machine learning models, including partner ROI/churn prediction and a proprietary Supply Health Score.",
            "Established comprehensive analytics frameworks for partner segmentation and evaluation, enabling more targeted and effective partner engagement strategies.",
            "Designed and implemented a scalable, self-service BI ecosystem, launching over 100 Tableau dashboards that provided insights to more than 600 users."
        ]
    },
    {
        company: "Really Cool Airlines",
        role: "Head of Commercial",
        period: "Apr 2023 - Feb 2024",
        points: [
            "Architected and scaled the airline's entire commercial division from inception, building and mentoring a team of 11 across 6 functions including Network Planning and Revenue Management.",
            "Developed the definitive business plan and investor pitch, leveraging data-driven market analysis to craft a compelling go-to-market strategy that successfully secured 200M THB in seed funding."
        ]
    },
    {
        company: "Thairath Group",
        role: "Head of Strategic Foresight and Planning",
        period: "Apr 2022 - Apr 2023",
        points: [
            "Led a group-wide data transformation, establishing standardized KPI frameworks and deploying analytics systems to create a unified view of performance across business units.",
            "Launched a new media business unit by developing the complete business plan to mitigate content rights risks and capture new international revenue streams.",
            "Functioned as a key strategic advisor to senior leadership, providing data-driven recommendations on resource allocation, operational workflows, and technology investments."
        ]
    },
    {
        company: "Nok Air",
        role: "Planning Director",
        period: "Oct 2016 - Nov 2017",
        points: [
            "Played a pivotal role in a successful corporate turnaround by developing analytical models for network and fleet optimization, leading to a 15% increase in aircraft utilization.",
            "Conducted in-depth competitor analysis to identify market opportunities and inform strategic fleet and network decisions.",
            "Developed and presented the full turnaround strategy to the Board of Directors, creditors, and potential investors, resulting in the acquisition of crucial new capital."
        ]
    },
    {
        company: "Thai Smile Airways",
        role: "Corporate Strategy & Planning Manager",
        period: "Nov 2015 - Oct 2016",
        points: [
            "Led data-driven network planning to analyze route profitability, directly contributing to increased market share.",
            "Managed negotiations with aviation authorities/airports to secure vital operating permits and slots."
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
