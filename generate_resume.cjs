
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType, Table, TableRow, TableCell } = require("docx");
const fs = require("fs");

// Resume Data
const profile = {
    name: "WUTCHARIN THATAN",
    title: "EXECUTIVE LEADER | AI, AUTOMATION & ANALYTICS",
    contact: [
        "(+66) 061-565-5969",
        "wutcharin.th@gmail.com",
        "linkedin.com/in/Wutcharin"
    ],
    summary: "An executive leader with nearly 20 years of experience, including a decade in people management, who builds and scales high-performing AI, Automation, and Analytics functions to operate as revenue-generating engines. With a career spanning corporate turnarounds and hyper-growth tech, I specialize in translating complex data into decisive C-suite strategies, securing capital, and embedding a data-first culture to drive measurable business outcomes."
};

const coreCompetencies = [
    { area: "Strategic Leadership & Vision", desc: "Corporate data strategy, AI roadmaps & vision, and C-suite advisory on AI integration." },
    { area: "Team Leadership & Growth", desc: "Building, mentoring, and scaling high-performing teams of data and AI specialists." },
    { area: "Business Acumen & Impact", desc: "Go-to-market strategy, venture capital acquisition, and complex corporate turnarounds." },
    { area: "Vendor & Partner Management", desc: "Tech vendor negotiation and strategic partner management in aviation and tech industries." }
];

const techSkills = [
    { area: "Analytics & Machine Learning", desc: "SQL, Python (Pandas, Scikit-learn) for predictive modeling (ROI, churn, LTV) & forecasting." },
    { area: "AI, Automation & Prototyping", desc: "RPA (Power Automate, n8n) & GenAI for process automation and rapid web app prototyping." },
    { area: "Visualization & Communication", desc: "BI Platforms (Tableau, Metabase, SuperSet) for data storytelling & compelling visualization." }
];

const highlights = [
    "Saved 12,000+ hours annually via targeted AI & automation initiatives in FinTech.",
    "Secured 200M THB in seed funding by developing the business plan and investor pitch.",
    "Increased Aircraft Utilization by 15% & boosted cabin factor by +3 p.p. in a corporate turnaround.",
    "Empowered 600+ Users by deploying over 100 Tableau dashboards."
];

const experience = [
    {
        company: "Agoda",
        role: "Associate Director - FinTech Data and Automation",
        period: "Apr 2024 - Present",
        desc: "Global Travel Tech",
        points: [
            "Direct a cross-functional division of 10, encompassing Finance Analytics and RPA/AI teams, to identify and execute on high-impact process automation opportunities.",
            "Crafting the departmental AI vision and roadmap; co-creating a Finance hackathon to foster innovation and identify automation opportunities from the ground up.",
            "Achieved over 12,000 hours in annualized time savings by deploying targeted automation solutions and machine learning models for collection risk and cashback liability.",
            "Orchestrated deep-dive variance analysis between financial statements and operational data, providing critical insights to leadership on revenue and cost drivers."
        ]
    },
    {
        company: "Really Cool Airlines",
        role: "Head of Commercial",
        period: "Apr 2023 - Feb 2024",
        desc: "Airline Startup",
        points: [
            "Architected and scaled the airline's entire commercial division from inception, building and mentoring a team of 11 across 6 functions including Network Planning and Revenue Management.",
            "Developed the definitive business plan and investor pitch, leveraging data-driven market analysis to craft a compelling go-to-market strategy that successfully secured 200M THB in seed funding."
        ]
    },
    {
        company: "Thairath Group",
        role: "Head of Strategic Foresight & Planning",
        period: "Apr 2022 - Mar 2023",
        desc: "Thai Media Conglomerate",
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
        desc: "Global Travel Tech",
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
        desc: "Low-Cost Airline",
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
        desc: "Regional Airline",
        points: [
            "Led the network planning function, a data-driven strategy to analyze route profitability and market demand, which directly contributed to increased market share.",
            "Managed and executed successful negotiations with key external partners, including aviation authorities and airport operators, to secure vital operating permits and strategic slots."
        ]
    }
];

const education = [
    {
        degree: "Master of Business Administration",
        school: "Stamford International University",
        year: ""
    },
    {
        degree: "Bachelor of Engineering",
        school: "Chulalongkorn University",
        year: ""
    }
];

// Styles
const styles = {
    default: {
        document: {
            run: {
                font: "Calibri",
                size: 22, // 11pt
            },
            paragraph: {
                spacing: { line: 276 }, // 1.15 line spacing
            },
        },
    },
};

// Helper to create section headers
const createSectionHeader = (text) => {
    return new Paragraph({
        text: text.toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        border: {
            bottom: { color: "06b6d4", space: 6, value: BorderStyle.SINGLE, size: 12 }, // Cyan accent
        },
        run: {
            color: "2e2e2e",
            bold: true,
            size: 24, // 12pt
            font: "Calibri",
        },
    });
};

const doc = new Document({
    styles: styles,
    sections: [
        {
            properties: {
                page: {
                    margin: {
                        top: 720, // 0.5 inch
                        right: 720,
                        bottom: 720,
                        left: 720,
                    },
                },
            },
            children: [
                // --- HEADER ---
                new Paragraph({
                    text: profile.name,
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 100 },
                    run: {
                        size: 48, // 24pt
                        bold: true,
                        color: "1e293b", // Slate 800
                        font: "Calibri",
                    },
                }),
                new Paragraph({
                    text: profile.title,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    run: {
                        size: 20, // 10pt
                        color: "06b6d4", // Cyan 400
                        bold: true,
                        tracking: 100,
                        font: "Calibri",
                    },
                }),
                new Paragraph({
                    text: profile.contact.join("  |  "),
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    run: {
                        size: 20, // 10pt
                        color: "64748b", // Slate 500
                        font: "Calibri",
                    },
                    border: {
                        bottom: { color: "e2e8f0", space: 20, value: BorderStyle.SINGLE, size: 6 },
                    },
                }),

                // --- SUMMARY ---
                createSectionHeader("Executive Profile"),
                new Paragraph({
                    text: profile.summary,
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 300 },
                }),

                // --- CAREER HIGHLIGHTS ---
                createSectionHeader("Career Highlights"),
                ...highlights.map(highlight => new Paragraph({
                    text: "• " + highlight,
                    spacing: { after: 100 },
                    indent: { left: 400 },
                    run: { bold: true, color: "334155" }
                })),

                // --- CORE COMPETENCIES & TECHNICAL SKILLS (Grid) ---
                createSectionHeader("Core Competencies & Technical Skills"),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                        insideVertical: { style: BorderStyle.NONE },
                        insideHorizontal: { style: BorderStyle.NONE },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ text: "COMPETENCIES", run: { bold: true, color: "06b6d4" }, spacing: { after: 100 } }),
                                        ...coreCompetencies.map(c => new Paragraph({
                                            children: [
                                                new TextRun({ text: c.area + ": ", bold: true, size: 20 }),
                                                new TextRun({ text: c.desc, size: 20 })
                                            ],
                                            spacing: { after: 100 }
                                        }))
                                    ],
                                }),
                                new TableCell({
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ text: "TECHNICAL SKILLS", run: { bold: true, color: "06b6d4" }, spacing: { after: 100 } }),
                                        ...techSkills.map(t => new Paragraph({
                                            children: [
                                                new TextRun({ text: t.area + ": ", bold: true, size: 20 }),
                                                new TextRun({ text: t.desc, size: 20 })
                                            ],
                                            spacing: { after: 100 }
                                        }))
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),

                // --- EXPERIENCE ---
                createSectionHeader("Professional Experience"),
                ...experience.flatMap((exp) => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.company, bold: true, size: 24 }),
                            new TextRun({ text: " | " + exp.desc, italics: true, size: 22, color: "64748b" }),
                            new TextRun({ text: "\t" + exp.period, bold: true, size: 22, color: "0f172a" }),
                        ],
                        tabStops: [{ type: "right", position: 10500 }],
                        spacing: { before: 300, after: 50 },
                    }),
                    new Paragraph({
                        text: exp.role,
                        bold: true,
                        size: 22,
                        color: "06b6d4",
                        spacing: { after: 100 },
                    }),
                    ...exp.points.map((point) =>
                        new Paragraph({
                            text: point,
                            bullet: { level: 0 },
                            spacing: { after: 50 },
                            alignment: AlignmentType.JUSTIFIED,
                        })
                    ),
                ]),

                // --- EDUCATION ---
                createSectionHeader("Education"),
                ...education.flatMap((edu) => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: edu.degree, bold: true }),
                        ],
                        spacing: { before: 100, after: 50 },
                    }),
                    new Paragraph({
                        text: edu.school,
                        color: "64748b",
                        spacing: { after: 200 },
                    }),
                ]),
            ],
        },
    ],
});

// Generate File
Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("Wutcharin_Thatan_Resume.docx", buffer);
    console.log("Resume generated successfully!");
});

