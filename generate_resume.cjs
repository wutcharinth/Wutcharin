const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, WidthType, Table, TableRow, TableCell } = require("docx");
const fs = require("fs");

// Resume Data
const profile = {
    name: "WUTCHARIN THATAN",
    title: "EXECUTIVE LEADER - AI, AUTOMATION & ANALYTICS",
    contact: [
        "Bangkok, Thailand",
        "wutcharin.th@gmail.com",
        "linkedin.com/in/wutcharin",
        "github.com/wutcharinth"
    ],
    summary: "Data-driven executive who architects analytics functions as revenue-generating engines. With a 20-year career spanning high-stakes turnarounds in aviation to hyper-growth in travel tech, I specialize in building elite teams, deploying scalable data platforms, and translating complex insights into decisive C-suite strategies. Proven track record in bridging innovation-driven tech environments with traditional businesses embracing change."
};

const coreCompetencies = [
    "AI Strategy & Implementation", "Enterprise Automation", "Data Governance",
    "Digital Transformation", "Team Building & Leadership", "Stakeholder Management",
    "Cloud Architecture", "Financial Modeling", "Product Management"
];

const techStack = [
    "AI/LLM: AI Agents, RAG, Claude Code, Cursor, Antigravity, OpenAI API",
    "Tools: VS Code, n8n, Zapier, Make, Workflow Automation",
    "Data: Python, SQL, Tableau, PowerBI, Looker",
    "Dev: React, TypeScript, Node.js, Google Cloud, Firebase"
];

const experience = [
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

const projects = [
    {
        title: "Really Cool Airlines Launch",
        role: "Strategic Lead",
        desc: "Led commercial division setup, secured 200M THB seed capital, and obtained CAAT business license. Speaker at Routes World 2023."
    },
    {
        title: "SplitBill AI",
        role: "Full Stack Developer",
        desc: "Built end-to-end in 7 days. Features instant receipt scanning with Gemini AI, automatic item parsing, and smart assignment. (React, Firebase, Gemini AI)"
    },
    {
        title: "LocalGuide Platform",
        role: "Full Stack Developer",
        desc: "Booking platform prototype connecting travelers with local guides. Complete auth system, profile management, and payments. (React, Node.js, PostgreSQL)"
    }
];

const education = [
    {
        degree: "Master of Science in Finance",
        school: "Chulalongkorn University",
        year: "2012 - 2014"
    },
    {
        degree: "Bachelor of Engineering (Computer Engineering)",
        school: "Chiang Mai University",
        year: "2004 - 2008"
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
            bottom: { color: "2e2e2e", space: 6, value: BorderStyle.SINGLE, size: 12 },
        },
        run: {
            color: "2e2e2e",
            bold: true,
            size: 28, // 14pt
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
                        top: 1000, // ~0.7 inch
                        right: 1000,
                        bottom: 1000,
                        left: 1000,
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
                        color: "000000",
                        font: "Calibri",
                    },
                }),
                new Paragraph({
                    text: profile.title,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                    run: {
                        size: 24, // 12pt
                        color: "555555",
                        tracking: 100, // Letter spacing
                        font: "Calibri",
                    },
                }),
                new Paragraph({
                    text: profile.contact.join("  |  "),
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                    run: {
                        size: 20, // 10pt
                        color: "333333",
                        font: "Calibri",
                    },
                    border: {
                        bottom: { color: "eeeeee", space: 20, value: BorderStyle.SINGLE, size: 6 },
                    },
                }),

                // --- SUMMARY ---
                createSectionHeader("Executive Summary"),
                new Paragraph({
                    text: profile.summary,
                    alignment: AlignmentType.JUSTIFIED,
                    spacing: { after: 300 },
                }),

                // --- CORE COMPETENCIES (Grid Layout) ---
                createSectionHeader("Core Competencies"),
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
                                    children: [new Paragraph({ text: coreCompetencies.slice(0, 3).join("\n"), spacing: { line: 300 } })],
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: coreCompetencies.slice(3, 6).join("\n"), spacing: { line: 300 } })],
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: coreCompetencies.slice(6, 9).join("\n"), spacing: { line: 300 } })],
                                }),
                            ],
                        }),
                    ],
                }),

                // --- TECHNICAL ARSENAL ---
                createSectionHeader("Technical Arsenal"),
                ...techStack.map(tech => new Paragraph({
                    text: "• " + tech,
                    spacing: { after: 100 },
                    indent: { left: 400 },
                })),

                // --- EXPERIENCE ---
                createSectionHeader("Professional Experience"),
                ...experience.flatMap((exp) => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: exp.company, bold: true, size: 26 }),
                            new TextRun({ text: "\t" + exp.period, bold: true, size: 24, color: "555555" }),
                        ],
                        tabStops: [{ type: "right", position: 9500 }],
                        spacing: { before: 300, after: 50 },
                    }),
                    new Paragraph({
                        text: exp.role,
                        italics: true,
                        size: 24,
                        color: "06b6d4", // Cyan-ish accent
                        spacing: { after: 150 },
                    }),
                    ...exp.points.map((point) =>
                        new Paragraph({
                            text: point,
                            bullet: { level: 0 },
                            spacing: { after: 100 },
                            alignment: AlignmentType.JUSTIFIED,
                        })
                    ),
                ]),

                // --- PROJECTS ---
                createSectionHeader("Key Projects"),
                ...projects.flatMap((proj) => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: proj.title, bold: true }),
                            new TextRun({ text: " | " + proj.role, italics: true }),
                        ],
                        spacing: { before: 200, after: 50 },
                    }),
                    new Paragraph({
                        text: proj.desc,
                        spacing: { after: 150 },
                        indent: { left: 400 },
                    }),
                ]),

                // --- EDUCATION ---
                createSectionHeader("Education"),
                ...education.flatMap((edu) => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: edu.school, bold: true }),
                            new TextRun({ text: "\t" + edu.year, bold: true }),
                        ],
                        tabStops: [{ type: "right", position: 9500 }],
                        spacing: { before: 100, after: 50 },
                    }),
                    new Paragraph({
                        text: edu.degree,
                        italics: true,
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
