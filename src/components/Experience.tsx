import { motion } from 'framer-motion';
import { Calendar, ArrowUpRight } from 'lucide-react';

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
        company: "Really Cool Airlines",
        role: "Head of Commercial",
        period: "Apr 2023 - Feb 2024",
        points: [
            "Architected and scaled the airline's entire commercial division from inception, building and mentoring a team of 11 across 6 functions including Network Planning and Revenue Management.",
            "Developed the definitive business plan and investor pitch, leveraging data-driven market analysis to craft a compelling go-to-market strategy that successfully secured 200M THB in seed funding."
        ],
        link: "https://aviationweek.com/air-transport/airports-networks/thai-startup-really-cool-airlines-plans-q2-2024-launch-airbus-a330",
        linkText: "Read Coverage in Aviation Week"
    },
    {
        company: "Thairath Group",
        role: "Head of Strategic Foresight and Planning",
        period: "Apr 2022 - Mar 2023",
        points: [
            "Led a group-wide data transformation, establishing standardized KPI frameworks and deploying analytics systems to create a unified view of performance across business units.",
            "Launched a new media business unit by developing the complete business plan to mitigate content rights risks and capture new international revenue streams.",
            "Functioned as a key strategic advisor to senior leadership, providing data-driven recommendations on resource allocation, operational workflows, and technology investments."
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
        period: "Nov 2015 - Sep 2016",
        points: [
            "Led data-driven network planning to analyze route profitability, directly contributing to increased market share.",
            "Managed negotiations with aviation authorities/airports to secure vital operating permits and slots."
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
                    className="text-4xl font-bold text-center mb-16 uppercase tracking-tighter text-text"
                >
                    Professional <span className="text-inverse-text bg-inverse px-2">Experience</span>
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

                                        {/* @ts-ignore */}
                                        {exp.link && (
                                            <div className="mt-4 pt-4 border-t-2 border-border">
                                                <a
                                                    /* @ts-ignore */
                                                    href={exp.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-text transition-colors uppercase tracking-wide"
                                                >
                                                    <span className="border-b-2 border-primary hover:border-text">
                                                        {/* @ts-ignore */}
                                                        {exp.linkText || "View Related News"}
                                                    </span>
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </a>
                                            </div>
                                        )}
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
