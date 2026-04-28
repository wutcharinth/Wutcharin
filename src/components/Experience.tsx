import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SplitText, RevealOnScroll } from '../lib/motion';

type Job = {
    company: string;
    role: string;
    period: string;
    points: string[];
    link?: string;
    linkText?: string;
};

const experiences: Job[] = [
    {
        company: 'Agoda',
        role: 'Associate Director, FinTech Data and Automation',
        period: 'Apr 2024  – Present',
        points: [
            'Direct a cross-functional division of 10, encompassing Finance Analytics and RPA/AI teams, to identify and execute on high-impact process automation opportunities.',
            'Crafting the departmental AI vision and roadmap; led workshops and built AI Agents (RAG, Auto-SQL) to automate workflows.',
            'Achieved over 12,000 hours in annualized time savings by deploying targeted automation solutions and machine learning models for collection risk and cashback liability.',
            'Orchestrated deep-dive variance analysis between financial statements and operational data, providing critical insights to leadership on revenue and cost drivers.',
        ],
    },
    {
        company: 'Really Cool Airlines',
        role: 'Head of Commercial',
        period: 'Apr 2023 – Feb 2024',
        points: [
            "Architected and scaled the airline's entire commercial division from inception, building and mentoring a team of 11 across 6 functions including Network Planning and Revenue Management.",
            'Developed the definitive business plan and investor pitch, leveraging data-driven market analysis to craft a compelling go-to-market strategy that successfully secured 200M THB in seed funding.',
        ],
        link: 'https://aviationweek.com/air-transport/airports-networks/thai-startup-really-cool-airlines-plans-q2-2024-launch-airbus-a330',
        linkText: 'Read coverage in Aviation Week',
    },
    {
        company: 'Thairath Group',
        role: 'Head of Strategic Foresight and Planning',
        period: 'Apr 2022 – Mar 2023',
        points: [
            'Led a group-wide data transformation, establishing standardized KPI frameworks and deploying analytics systems to create a unified view of performance across business units.',
            'Launched a new media business unit by developing the complete business plan to mitigate content rights risks and capture new international revenue streams.',
            'Functioned as a key strategic advisor to senior leadership, providing data-driven recommendations on resource allocation, operational workflows, and technology investments.',
        ],
    },
    {
        company: 'Agoda',
        role: 'Associate Director, Supply Analytics',
        period: 'Nov 2017 – Apr 2022',
        points: [
            'Directed analytics for the Partner Programs division, transforming raw data into actionable insights and strategic recommendations presented directly to C-level leadership.',
            'Oversaw credit risk management and analytics for the Partner Prepaid Programs, mitigating financial exposure and optimizing partner payment solutions.',
            'Developed and deployed multiple high-impact machine learning models, including partner ROI/churn prediction and a proprietary Supply Health Score.',
            'Established comprehensive analytics frameworks for partner segmentation and evaluation, enabling more targeted and effective partner engagement strategies.',
            'Designed and implemented a scalable, self-service BI ecosystem, launching 100+ Tableau dashboards that served 600+ users.',
        ],
    },
    {
        company: 'Nok Air',
        role: 'Planning Director',
        period: 'Oct 2016 – Nov 2017',
        points: [
            'Played a pivotal role in a successful corporate turnaround by developing analytical models for network and fleet optimization, leading to a 15% increase in aircraft utilization.',
            'Conducted in-depth competitor analysis to identify market opportunities and inform strategic fleet and network decisions.',
            'Developed and presented the full turnaround strategy to the Board of Directors, creditors, and potential investors, resulting in the acquisition of crucial new capital.',
        ],
    },
    {
        company: 'Thai Smile Airways',
        role: 'Corporate Strategy & Planning Manager',
        period: 'Nov 2015 – Sep 2016',
        points: [
            'Led data-driven network planning to analyze route profitability, directly contributing to increased market share.',
            'Managed negotiations with aviation authorities/airports to secure vital operating permits and slots.',
        ],
    },
];

export default function Experience() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start center', 'end end'],
    });
    const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    return (
        <section id="experience" className="relative py-32 px-4 overflow-hidden">
            <div className="pointer-events-none absolute top-1/3 -right-20 h-[30rem] w-[30rem] rounded-full bg-violet-600/5 blur-[130px]" aria-hidden="true" />

            <div className="relative max-w-5xl mx-auto">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-white/10"
                    >
                        <span className="h-1 w-1 rounded-full bg-violet-400" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-slate-300">04 · Journey</span>
                    </motion.div>
                    <SplitText
                        as="h2"
                        mode="words"
                        stagger={0.05}
                        className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-0.03em] text-white leading-[0.92]"
                    >
                        Professional Experience
                    </SplitText>
                </div>

                <div ref={sectionRef} className="relative">
                    {/* Track line (faded) */}
                    <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-white/10" aria-hidden="true" />
                    {/* Progress line — single Violet Signal, no rainbow */}
                    <motion.div
                        style={{ height: lineHeight }}
                        className="absolute left-4 md:left-6 top-0 w-px bg-violet-400"
                        aria-hidden="true"
                    />

                    <div className="space-y-14">
                        {experiences.map((exp, index) => (
                            <RevealOnScroll
                                key={index}
                                staggerChildren={0.08}
                                className="relative pl-14 md:pl-20"
                            >
                                {/* Node */}
                                <div
                                    data-reveal-child
                                    className="absolute left-4 md:left-6 top-2 -translate-x-1/2 flex items-center justify-center"
                                >
                                    <div className="relative h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(139,92,246,0.6)]">
                                        <span className="absolute inset-0 rounded-full bg-violet-400 animate-[pulse-ring_2.2s_ease-out_infinite] opacity-60" />
                                    </div>
                                </div>

                                {/* Period badge above card */}
                                <div
                                    data-reveal-child
                                    className="font-mono text-[10px] uppercase tracking-[0.28em] text-violet-300/80 mb-3"
                                >
                                    {exp.period}
                                </div>

                                <div
                                    data-reveal-child
                                    className="group relative rounded-xl border border-white/10 bg-white/[0.02] p-6 md:p-8 hover:border-white/25 transition-colors"
                                >
                                    <div className="flex items-baseline gap-3 flex-wrap mb-2">
                                        <h3 className="text-xl md:text-2xl font-medium text-white tracking-[-0.01em]">
                                            {exp.company}
                                        </h3>
                                        <span className="h-1 w-1 rounded-full bg-white/20" />
                                        <p className="text-sm md:text-base text-slate-300 font-light">{exp.role}</p>
                                    </div>

                                    <ul className="space-y-2.5 mt-5">
                                        {exp.points.map((point, i) => (
                                            <li key={i} className="relative flex gap-3 text-sm md:text-[15px] text-slate-400 leading-relaxed font-light">
                                                <span className="mt-[0.6em] block h-[3px] w-2.5 shrink-0 bg-violet-400/60 rounded-full" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {exp.link && (
                                        <div className="mt-6 pt-5 border-t border-white/5">
                                            <a
                                                href={exp.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-[11px] font-mono text-violet-300 hover:text-white uppercase tracking-[0.2em] transition-colors group/link"
                                                data-cursor="read"
                                            >
                                                <span className="border-b border-violet-500/30 group-hover/link:border-white">
                                                    {exp.linkText || 'View related news'}
                                                </span>
                                                <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
