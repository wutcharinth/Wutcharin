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
        headline: '15,000+ hours a year automated. A 12-person Analytics Engineering team. Agents in production.',
        role: 'Associate Director, FinTech Data and Automation',
        period: 'Apr 2024 – Present',
        points: [
            'Lead a team of 12 Analytics Engineering professionals across analytics, AI and automation.',
            'Set the AI vision and roadmap for the department. Built AI agents (RAG, Auto-SQL) and ran workshops.',
            'Saved 15,000+ hours a year with automation and machine learning for collection risk and cashback liability.',
            'Compared financial statements with operational data to explain revenue and cost changes to leadership.',
            'Guest speaker at Agoda\'s People Team Offsite 2026. Presented the Finance AI Showcase to the People team.',
        ],
        link: 'https://lnkd.in/p/gVtACwcm',
        linkText: 'See the offsite post on LinkedIn',
    },
    {
        company: 'Really Cool Airlines',
        code: 'RCA',
        year: '2023',
        headline: 'Built the commercial team from zero. Wrote the plan behind 200M THB in seed funding.',
        role: 'Head of Commercial',
        period: 'Apr 2023 – Feb 2024',
        points: [
            'Built the commercial division from zero: 11 people across 6 functions, including network planning and revenue management.',
            'Wrote the business plan and investor pitch. The plan helped secure 200M THB in seed funding.',
        ],
        link: 'https://aviationweek.com/air-transport/airports-networks/thai-startup-really-cool-airlines-plans-q2-2024-launch-airbus-a330',
        linkText: 'Read the Aviation Week story',
    },
    {
        company: 'Thairath Group',
        code: 'THAIRATH',
        year: '2022',
        headline: 'One set of KPIs for the whole group, and the plan for a new media business.',
        role: 'Head of Strategic Foresight and Planning',
        period: 'Apr 2022 – Mar 2023',
        points: [
            'Moved the whole group onto shared data: standard KPIs and one view of performance for every business unit.',
            'Wrote the plan for a new media business unit to reduce content-rights risk and add international revenue.',
            'Advised senior leadership on budgets, workflows and technology, with data.',
        ],
    },
    {
        company: 'Agoda',
        code: 'AGODA',
        year: '2017',
        headline: '100+ dashboards for 600+ users. ML models for partner ROI and churn.',
        role: 'Associate Director, Supply Analytics',
        period: 'Nov 2017 – Apr 2022',
        points: [
            'Led analytics for the Partner Programs division. Presented insights directly to C-level leaders.',
            'Managed credit risk for prepaid partner programs to reduce financial exposure.',
            'Built machine learning models for partner ROI, churn and a Supply Health Score.',
            'Set up partner segmentation so teams could target the right partners.',
            'Launched a self-service BI system: 100+ Tableau dashboards for 600+ users.',
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
            'Built network and fleet models for the turnaround. Aircraft utilisation went up 15%.',
            'Studied competitors to find market gaps and guide fleet and network decisions.',
            'Presented the turnaround plan to the board, creditors and investors. The plan brought in new capital.',
        ],
    },
    {
        company: 'Thai Smile Airways',
        code: 'THAI SMILE',
        year: '2015',
        headline: 'Route profit analysis that grew market share.',
        role: 'Corporate Strategy & Planning Manager',
        period: 'Nov 2015 – Sep 2016',
        points: [
            'Planned the network with route profit data. Market share went up.',
            'Negotiated with aviation authorities and airports for permits and slots.',
        ],
    },
];

/** Chronological: the route flies left to right, first leg first. */
export const career: Job[] = [...newestFirst].reverse();
