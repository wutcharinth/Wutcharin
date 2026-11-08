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
    /** Real screenshot (16:9 WebP in /public/work) for the case-study plate. */
    poster?: string;
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
        desc: "A clear guide to Andrej Karpathy's lecture on how to use LLMs well. Try the token visualizer. Compare models on Elo charts.",
        tagline: "A practical guide to LLMs",
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
        desc: "Based on the ideas of Po-Shen Loh. Test your mental fitness in a short simulation. See the skills that matter in the AI era.",
        tagline: "Skills that AI cannot replace",
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
        desc: "An interactive guide to the Stanford CS230 lecture on agentic AI. See the jagged frontier, prompt design, HyDE and ReAct at work.",
        tagline: "Stanford CS230, made visual",
        tags: ['Stanford CS230', 'Agentic AI', 'Interactive', 'Education'],
        link: '/agentic-ai',
        icon: Brain,
        accent: '#a78bfa',
        tier: 'insight',
    },
    {
        id: 'thai-election',
        poster: '/work/thai-election.webp',
        featured: 1,
        formation: 'network',
        title: 'Thai Election 2566',
        navTitle: 'Thai Election AI',
        role: 'Data Artist & AI Engineer',
        badge: 'Data Story',
        desc: "The 2023 Thai election in charts. Ask the RAG chatbot about any result.",
        tagline: "Ask the election anything",
        tags: ['Data Viz', 'RAG', 'Gemini AI', 'React'],
        link: '/thai-election',
        icon: MessageSquare,
        accent: '#fb923c',
        tier: 'insight',
    },
    {
        id: 'election-2026',
        poster: '/work/election-2026.webp',
        featured: 5,
        formation: 'lattice',
        title: 'Thailand 2026 Election Investigation',
        role: 'Data Investigator & Journalist',
        badge: 'Data Story',
        desc: "A data check of the 8 February 2026 election. It uses official ECT data from 382 districts. It covers ballot QR codes, count mismatches, the 1:1 ratio and annulment petitions.",
        tagline: "The count, checked with data",
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
        desc: "The growth of AI in numbers. See model size and context length grow, year by year.",
        tagline: "How fast AI grows",
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
        desc: "Which jobs AI will change, and which new jobs it will make. Global data, shown simply.",
        tagline: "AI and jobs, in data",
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
        desc: "An audit agent that checks transactions in real time. It checks policy, finds conflicts of interest and compares prices to the market.",
        tagline: "Audit and compliance agent",
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
        desc: "An agent that runs Scrum on Jira. It finds scope creep, grooms the backlog and checks the definition of done.",
        tagline: "Scrum master agent",
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
        desc: "An agent that turns reviews into action. It reads the sentiment, sends each issue to the right team and starts the fix.",
        tagline: "Review and sentiment agent",
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
        desc: "Ask a data question in plain words. The agent finds the right tables, writes the SQL and shows where each number comes from.",
        tagline: "Plain words in, SQL out",
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
        desc: "An agent that disputes virtual card overcharges. It picks a strategy, writes the rebuttal and follows up until the case closes.",
        tagline: "Finance recovery agent",
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
        desc: "A team of agents that checks expense slips. It reads each slip with OCR and flags possible fraud.",
        tagline: "Expense check agent",
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
        desc: "One inbox for LINE, Shopee, Lazada, IG, FB and email. Three AI agents handle service, operations and growth. The brand voice gets better with use.",
        tagline: "One inbox, three agents",
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
        desc: "An AI host for Thai restaurants, bars, cafés and live venues. It takes bookings and answers questions on LINE OA. Messenger and IG come next.",
        tagline: "AI host for hospitality",
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
        desc: "Live quizzes and interactive slides for any audience. Scores show at once.",
        tagline: "Live audience quizzes",
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
        desc: "Scan a receipt with Gemini. The app reads each item and splits the bill. Built end to end.",
        tagline: "Scan it, split it",
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
        desc: "Build a résumé with AI suggestions. See the result as you type.",
        tagline: "AI résumé builder",
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
        desc: "Read complex documents with Gemini Vision. Get clean, structured data back.",
        tagline: "Documents in, data out",
        tags: ['Gemini API', 'React', 'OCR', 'AI'],
        link: '/gemini-ocr',
        icon: ScanText,
        accent: '#818cf8',
        tier: 'lab',
    },
];

