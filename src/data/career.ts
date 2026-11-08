/**
 * Career record. Single source for the Flight Log chapter; `code` is the
 * short mono label on the boarding pass, `headline` the one outcome line.
 */
export type Job = {
    company: string;
    code: string;
    year: string;
    headline: string;
    role: string;
    period: string;
    points: string[];
    link?: string;
    linkText?: string;
};

const newestFirst: Job[] = [
    {
        company: 'Agoda',
        code: 'AGODA',
        year: '2024',
        headline: '15,000+ hours a year automated by a 12-person Analytics Engineering team, with agents in production.',
        role: 'Associate Director, FinTech Data and Automation',
        period: 'Apr 2024  – Present',
        points: [
            'Lead a team of 12 Analytics Engineering professionals in FinTech Data and Automation, spanning finance analytics and RPA/AI, to identify and execute high-impact process automation opportunities.',
            'Crafting the departmental AI vision and roadmap; led workshops and built AI Agents (RAG, Auto-SQL) to automate workflows.',
            'Achieved over 15,000 hours in annualized time savings by deploying targeted automation solutions and machine learning models for collection risk and cashback liability.',
            'Orchestrated deep-dive variance analysis between financial statements and operational data, providing critical insights to leadership on revenue and cost drivers.',
        ],
    },
    {
        company: 'Really Cool Airlines',
        code: 'RCA',
        year: '2023',
        headline: 'Built the commercial division from zero; the plan behind 200M THB in seed funding.',
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
        code: 'THAIRATH',
        year: '2022',
        headline: 'Group-wide KPI frameworks and a new media business unit.',
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
        code: 'AGODA',
        year: '2017',
        headline: '100+ Tableau dashboards for 600+ users; ML for partner ROI and churn.',
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
        code: 'NOK AIR',
        year: '2016',
        headline: 'Turnaround models that lifted aircraft utilisation 15%.',
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
        code: 'THAI SMILE',
        year: '2015',
        headline: 'Network planning on route profitability that grew market share.',
        role: 'Corporate Strategy & Planning Manager',
        period: 'Nov 2015 – Sep 2016',
        points: [
            'Led data-driven network planning to analyze route profitability, directly contributing to increased market share.',
            'Managed negotiations with aviation authorities/airports to secure vital operating permits and slots.',
        ],
    },
];

/** Chronological: the route flies left to right, first leg first. */
export const career: Job[] = [...newestFirst].reverse();
