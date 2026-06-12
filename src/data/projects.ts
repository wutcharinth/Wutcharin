import {
    ShieldCheck, SquareKanban, StarHalf, Database, MessageSquare,
    FileText, ScanText, Code, Receipt, TrendingUp, Briefcase, Brain,
    Sparkles, Heart, BarChart2, Inbox, Bot, type LucideIcon,
} from 'lucide-react';
import type { FormationId } from '../scene/formations';

/**
 * Single source of truth for every showcased project.
 * Consumed by the home Projects index and the sub-page ProjectNavigation;
 * later phases hang scene formation/accent state off the same records.
 */

export type ProjectTier = 'insight' | 'agent' | 'lab';

export type Project = {
    id: string;
    title: string;
    /** Shorter display title used in compact navigation rows. */
    navTitle?: string;
    role: string;
    badge?: string;
    desc: string;
    /** One-line outcome/positioning, used by compact rows. */
    tagline?: string;
    tags: string[];
    /** Internal route, external URL, or static .html artifact. */
    link: string;
    icon: LucideIcon;
    /** Hex accent — ambient glow today, scene accent from Phase 3 on. */
    accent: string;
    tier: ProjectTier;
    /** Case-study rank: presence puts the project in Act 1, value orders it. */
    featured?: number;
    /** Formation the world morphs into when this case study takes attention. */
    formation?: FormationId;
};

export const projects: Project[] = [
    // --- Interactive lecture insights & data stories ---
    {
        id: 'karpathy-deep-dive',
        featured: 4,
        formation: 'wave',
        title: 'Karpathy LLM Guide',
        role: 'Interactive Article',
        badge: 'Lecture Insight',
        desc: "A definitive technical and strategic synthesis of Andrej Karpathy's masterclass on professional LLM utilization. Features Token visualizers and Model ELO charts.",
        tagline: 'The Probabilistic OS',
        tags: ['Andrej Karpathy', 'LLM', 'Interactive', 'Education'],
        link: '/karpathy-deep-dive',
        icon: Brain,
        accent: '#818cf8',
        tier: 'insight',
    },
    {
        id: 'human-edge',
        title: 'The Human Edge',
        role: 'Interactive Article',
        badge: 'Lecture Insight',
        desc: "Based on Po-Shen Loh's philosophy. Features a 'Mental Fitness' simulation and visualizations of the new survival skills in the AI era.",
        tagline: 'Survival in the AI Era',
        tags: ['Philosophy', 'React', 'Interactive', 'Mental Fitness'],
        link: '/human-edge',
        icon: Heart,
        accent: '#22d3ee',
        tier: 'insight',
    },
    {
        id: 'agentic-ai',
        title: 'Agentic AI Deep Dive',
        navTitle: 'Agentic AI',
        role: 'Technical Writer & Educator',
        badge: 'Lecture Insight',
        desc: "Interactive article exploring Stanford CS230's lecture on Agentic AI. Features visualizations of the Jagged Frontier, Prompt Engineering, HyDE, and ReAct patterns.",
        tagline: 'Stanford CS230 Lecture Deep Dive',
        tags: ['Stanford CS230', 'Agentic AI', 'Interactive', 'Education'],
        link: '/agentic-ai',
        icon: Brain,
        accent: '#a78bfa',
        tier: 'insight',
    },
    {
        id: 'thai-election',
        featured: 1,
        formation: 'network',
        title: 'Thai Election 2566',
        navTitle: 'Thai Election AI',
        role: 'Data Artist & AI Engineer',
        badge: 'Data Story',
        desc: 'Interactive data storytelling with an integrated RAG-based AI chatbot. Visualizes 2023 election results with deep political insights.',
        tagline: 'RAG-based Political Analyst',
        tags: ['Data Viz', 'RAG', 'Gemini AI', 'React'],
        link: '/thai-election',
        icon: MessageSquare,
        accent: '#fb923c',
        tier: 'insight',
    },
    {
        id: 'election-2026',
        featured: 5,
        formation: 'lattice',
        title: 'Thailand 2026 Election Investigation',
        role: 'Data Investigator & Journalist',
        badge: 'Data Story',
        desc: "Statistical investigation of Thailand's controversial Feb 8, 2026 election. Covers QR-code ballot secrecy, vote-count mismatches, the 1:1 ratio anomaly, and annulment petitions, using official ECT data across 382 districts.",
        tags: ['ECT Data', 'ECharts', 'Bilingual', 'Investigation'],
        link: '/election-2026.html',
        icon: BarChart2,
        accent: '#ef4444',
        tier: 'insight',
    },
    {
        id: 'ai-evolution',
        title: 'AI Evolution Stats',
        role: 'Data Storyteller',
        badge: 'Data Story',
        desc: 'Interactive visualization of the exponential rise of AI. From Parameter Explosions to the Context Revolution.',
        tagline: 'The Rise of Intelligence',
        tags: ['Data Storytelling', 'Recharts', 'React', 'AI Trends'],
        link: '/ai-evolution',
        icon: TrendingUp,
        accent: '#e879f9',
        tier: 'insight',
    },
    {
        id: 'future-of-work',
        title: 'Future of Work',
        role: 'Data Journalist',
        badge: 'Data Story',
        desc: 'A data-driven view on global job disruption and the emerging roles of tomorrow. Automation vs Transformation.',
        tagline: 'AI & Workforce Data Story',
        tags: ['Data Journalism', 'React', 'Labor Stats'],
        link: '/future-of-work',
        icon: Briefcase,
        accent: '#22d3ee',
        tier: 'insight',
    },

    // --- AI agents & agentic simulations ---
    {
        id: 'risk-guard',
        featured: 2,
        formation: 'helix',
        title: 'RiskGuard AI',
        role: 'AI Engineer',
        desc: 'Internal Control System that audits transactions in real-time. Features Policy Checks, Entity Resolution (COI), and Market Benchmarking.',
        tagline: 'Internal Audit & Compliance Agent',
        tags: ['LangGraph', 'React', 'Risk', 'Audit'],
        link: '/risk-guard',
        icon: ShieldCheck,
        accent: '#f43f5e',
        tier: 'agent',
    },
    {
        id: 'project-flow',
        title: 'ProjectFlow AI',
        role: 'AI Engineer',
        desc: 'Autonomous Scrum Master that manages Jira boards. Features Scope Creep detection, Auto-Grooming, and Definition of Done checks.',
        tagline: 'Autonomous Scrum Master Agent',
        tags: ['Jira API', 'React', 'Agentic AI', 'DevOps'],
        link: '/project-flow',
        icon: SquareKanban,
        accent: '#3b82f6',
        tier: 'agent',
    },
    {
        id: 'review-flow',
        title: 'ReviewFlow AI',
        role: 'AI Engineer',
        desc: 'Reputation Engine that turns feedback into action. Features Sentiment Analysis, Intelligent Routing, and Automated Operational Triggers.',
        tagline: 'Reputation & Sentiment Engine',
        tags: ['NLP', 'React', 'Automation', 'Reputation'],
        link: '/review-flow',
        icon: StarHalf,
        accent: '#f59e0b',
        tier: 'agent',
    },
    {
        id: 'query-flow',
        title: 'QueryFlow AI',
        role: 'Data Engineer',
        desc: 'Enterprise Data Agent that bridges natural language and SQL. Features Metadata Scouting, Federated Execution, and Lineage Tracking.',
        tagline: 'Enterprise Data Agent',
        tags: ['Text-to-SQL', 'React', 'Trino', 'Data'],
        link: '/query-flow',
        icon: Database,
        accent: '#8b5cf6',
        tier: 'agent',
    },
    {
        id: 'collections',
        title: 'Enterprise Collections AI',
        navTitle: 'Collections AI',
        role: 'AI Engineer',
        desc: 'Autonomous dispute agent for VCC overcharges. Features cognitive flow, strategy engine, and auto-rebuttal loops.',
        tagline: 'Autonomous Finance Recovery Agent',
        tags: ['LangGraph', 'React', 'Agentic AI', 'FinTech'],
        link: '/collections',
        icon: Sparkles,
        accent: '#10b981',
        tier: 'agent',
    },
    {
        id: 'slip-verify',
        title: 'SlipVerify AI',
        role: 'AI Engineer',
        desc: 'Intelligent expense verification system using ChainGraph. Features multi-agent orchestration for fraud detection and OCR.',
        tagline: 'Expense Verification Agent',
        tags: ['LangGraph', 'React', 'Agentic AI', 'OCR'],
        link: '/slip-verify',
        icon: FileText,
        accent: '#a855f7',
        tier: 'agent',
    },

    // --- AI products & websites ---
    {
        id: 'flowaios',
        featured: 3,
        formation: 'terminus',
        title: 'FlowAIOS',
        role: 'Founder & Builder',
        desc: 'AI Operating System for Thai/SEA customer ops — unified inbox across LINE, Shopee, Lazada, IG, FB & Email with three AI agents (Service, Operations, Growth) and self-improving brand voice.',
        tags: ['Gemini', 'Claude', 'Supabase', 'Vercel'],
        link: 'https://flowaios.vercel.app/',
        icon: Inbox,
        accent: '#06b6d4',
        tier: 'lab',
    },
    {
        id: 'jongtoh',
        title: 'Jongtoh',
        role: 'Founder & Builder',
        desc: 'Multi-channel AI host for Thai hospitality — restaurants, bars, cafés and live venues. LINE OA-first reception, bookings and FAQs, with Messenger and IG on the roadmap.',
        tags: ['LINE OA', 'Cloudflare', 'Hospitality AI', 'Bilingual'],
        link: 'https://jongtoh.com/',
        icon: Bot,
        accent: '#e8a542',
        tier: 'lab',
    },
    {
        id: 'klikr',
        title: 'Klikr',
        role: 'Full Stack Developer',
        desc: 'Real-time audience engagement platform featuring interactive presentations, live quizzes, and instant scoring.',
        tags: ['React', 'Interactive', 'Platform'],
        link: 'https://www.klikrapp.com/',
        icon: Sparkles,
        accent: '#10b981',
        tier: 'lab',
    },
    {
        id: 'splitbill-ai',
        title: 'SplitBill AI',
        role: 'Creator & Developer',
        desc: 'Built end-to-end. Features instant receipt scanning with Gemini AI, automatic item parsing, and smart assignment.',
        tags: ['Gemini AI', 'React', 'Firebase'],
        link: 'https://splitbill-ai.com/',
        icon: Receipt,
        accent: '#ec4899',
        tier: 'lab',
    },
    {
        id: 'resume-builder',
        title: 'AI Resume Builder',
        role: 'Full Stack Developer',
        desc: 'Interactive resume builder with AI-powered content suggestions and real-time preview.',
        tags: ['React', 'Gemini AI', 'Tailwind CSS'],
        link: '/resume-builder',
        icon: Code,
        accent: '#14b8a6',
        tier: 'lab',
    },
    {
        id: 'gemini-ocr',
        title: 'Gemini OCR',
        role: 'Frontend Developer',
        desc: "High-accuracy OCR tool powered by Google's Gemini Vision Pro. Extracts structured data from complex documents.",
        tags: ['Gemini API', 'React', 'OCR', 'AI'],
        link: '/gemini-ocr',
        icon: ScanText,
        accent: '#818cf8',
        tier: 'lab',
    },
];

