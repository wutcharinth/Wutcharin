import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Bot, TrendingUp, TrendingDown, BookOpen, Brain,
    CreditCard, ClipboardList, Zap, Scale, UserCheck,
    Users, DollarSign, Briefcase, ArrowLeft, ArrowDown
} from 'lucide-react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import ProjectNavigation from '../components/ProjectNavigation';

// --- DATA STRUCTURES ---
const globalProjections = {
    globalDisplaced: { value: 300, unit: "Million", source: "Goldman Sachs (Global)" },
    usOccupationalShifts: { value: 12, unit: "Million", source: "McKinsey/BLS (US Shifts by 2030)" },
    taskAutomation: { value: 60, unit: "%", context: "of tasks modified by AI", source: "National University" },
    jobAutomation: { value: 30, unit: "%", context: "of US jobs fully automatable by 2030", source: "PwC/National University" },
    skillShift: { value: 39, unit: "%", context: "of skills outdated by 2030", source: "WEF Future of Jobs Report 2025" }
};

const affectedSectors = [
    { name: "Clerical & Admin", icon: ClipboardList, risk: 90, detail: "Data entry, scheduling, and secretarial tasks are highly exposed due to their routine, repetitive nature.", color: "text-red-400" },
    { name: "Legal & Paralegal", icon: Scale, risk: 70, detail: "Routine legal research and document review. BLS projects only 1.2% growth (slower than average) due to automation pressure.", color: "text-red-400" },
    { name: "Credit Analysts", icon: CreditCard, risk: 78, detail: "Transactional finance analysis and credit risk modeling. BLS projects an employment decline of -3.9% by 2033.", color: "text-red-400" },
    { name: "Mid-Level Coding", icon: Zap, risk: 60, detail: "AI now writes 30%+ of code in some major firms, changing the role from creation to review and architecture.", color: "text-red-400" },
];

const growthSectors = [
    { name: "Software Developers", icon: Zap, growth: 17.9, detail: "Role shifts from creation to architecture and review. BLS projects a strong growth of +17.9% by 2033.", color: "text-green-400" },
    { name: "Prompt Engineers", icon: Brain, growth: 400, detail: "Specialists in communicating with AI models, optimizing inputs for desired, unbiased, and high-quality outputs.", color: "text-green-400" },
    { name: "Personal Financial Advisors", icon: Users, growth: 17.1, detail: "While robo-advisors handle basic tasks, demand for human strategic advice remains high (BLS: +17.1% by 2033).", color: "text-green-400" },
    { name: "Human-Centric Roles", icon: UserCheck, growth: 50, detail: "Roles requiring high empathy, complex human judgment, and physical presence (e.g., therapy, nursing, skilled trades).", color: "text-green-400" },
];

const companyLayoffs = [
    { name: "Microsoft", layoffs: "15,387", year: "2025", context: "Cuts attributed to 'streamlining' across divisions, following CEO comments on AI-written code.", icon: 'MS', color: "bg-blue-600" },
    { name: "Amazon", layoffs: "~14,625", year: "2025", context: "Restructuring in corporate and retail departments, leveraging efficiency gains from automation.", icon: 'AMZ', color: "bg-yellow-600" },
    { name: "Salesforce", layoffs: "~700", year: "2024", context: "CEO cited agentic AI reducing need for customer support headcount by thousands.", icon: 'SF', color: "bg-cyan-600" },
    { name: "Klarna (CS Workers)", layoffs: "Equivalent of 700 FTEs", year: "2024", context: "Customer Service entirely replaced by an in-house AI assistant, publicly reported.", icon: 'KL', color: "bg-pink-600" },
];

// --- CUSTOM HOOK FOR INTERACTIVITY: COUNT-UP ANIMATION ---
const useCountUp = (endValue: number, duration = 1000) => {
    const [count, setCount] = useState(0);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        setCount(0);
        startTimeRef.current = null;
        let animationFrameId: number;

        const animateCount = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = timestamp - startTimeRef.current;
            const percentage = Math.min(progress / duration, 1);
            const currentValue = percentage * endValue;

            if (progress >= 0) {
                setCount(parseFloat(currentValue.toFixed(1)));
            }

            if (percentage < 1) {
                animationFrameId = requestAnimationFrame(animateCount);
            } else {
                setCount(endValue);
            }
        };

        animationFrameId = requestAnimationFrame(animateCount);
        return () => cancelAnimationFrame(animationFrameId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endValue, duration]);

    return count;
};

// --- VISUAL COMPONENTS ---

interface StatBoxProps {
    number: number;
    unit: string;
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    color: string;
    source: string;
    decimals?: number;
}

const StatBox = ({ number, unit, label, icon: Icon, color, source, decimals = 0 }: StatBoxProps) => {
    const countedNumber = useCountUp(number, 1500);
    const displayValue = decimals > 0 ? countedNumber.toFixed(1) : Math.round(countedNumber);

    return (
        <div className={`p-6 md:p-8 rounded-xl shadow-2xl ${color} bg-gray-800/60 backdrop-blur-sm border border-cyan-700/30 flex flex-col items-start h-full transform transition duration-300 hover:scale-[1.02] hover:shadow-cyan-500/50`}>
            <div className="flex items-center space-x-4 mb-3">
                <Icon className={`w-10 h-10 ${color}`} />
                <h3 className="text-lg font-semibold text-gray-300">{label}</h3>
            </div>
            <div className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-200 leading-none">
                {displayValue}
                <span className="text-2xl ml-2 text-gray-400">{unit}</span>
            </div>
            <p className="mt-4 text-xs text-gray-500 italic">Source: {source}</p>
        </div>
    );
};

interface ProgressVisualProps {
    label: string;
    value: number;
    unit: string;
    color: string;
    context: string;
    type?: 'bar' | 'ring';
    subValue?: number | null;
    source?: string;
}

const ProgressVisual = ({ label, value, color, context, type = 'bar', subValue = null }: ProgressVisualProps) => {
    if (type === 'ring') {
        const strokeWidth = 10;
        const radius = 50;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (value / 100) * circumference;
        const countedValue = useCountUp(value, 1500).toFixed(0);

        return (
            <div className="flex flex-col items-center justify-center p-6 bg-gray-800/60 rounded-xl border border-cyan-700/30 shadow-lg h-full">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                    <circle className="text-gray-700" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                    <circle
                        className={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="60"
                        cy="60"
                    />
                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-white font-bold text-2xl transform rotate-90 translate-x-10 translate-y-1">
                        {countedValue}%
                    </text>
                </svg>
                <p className="mt-4 text-center text-sm font-semibold text-cyan-400">{label}</p>
                <p className="text-xs text-gray-500 italic">{context}</p>
            </div>
        );
    }

    const countedTaskValue = useCountUp(value, 1500).toFixed(0);
    const countedJobValue = subValue !== null ? useCountUp(subValue, 1500).toFixed(0) : "0";

    return (
        <div className="p-6 bg-gray-800/60 rounded-xl border border-cyan-700/30 shadow-lg h-full flex flex-col justify-between">
            <div>
                <h4 className="text-lg font-semibold text-white mb-4">Automation Scope: Task vs. Job</h4>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-400">Tasks Modified by AI</span>
                        <span className="text-xl font-extrabold text-cyan-400">{countedTaskValue}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                            className="h-2.5 rounded-full bg-cyan-600 transition-all duration-1000"
                            style={{ width: `${value}%` }}
                        ></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-400">Full Job Displacement Risk</span>
                        <span className="text-xl font-extrabold text-red-400">{countedJobValue}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                            className="h-2.5 rounded-full bg-red-600 transition-all duration-1000"
                            style={{ width: `${subValue}%` }}
                        ></div>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-xs text-gray-500 italic">{context}</p>
        </div>
    );
};

interface Sector {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    risk?: number;
    growth?: number;
    detail: string;
}

const SectorCard = ({ sector, type, decimals = 0 }: { sector: Sector, type: 'vulnerable' | 'growing', decimals?: number }) => {
    const displayValue = type === 'vulnerable' ? sector.risk : sector.growth;
    const unit = '%';
    const color = type === 'vulnerable' ? 'text-red-400' : 'text-green-400';
    const barColor = type === 'vulnerable' ? 'bg-red-600' : 'bg-green-600';
    const barHoverShadow = type === 'vulnerable' ? 'hover:shadow-red-500/40' : 'hover:shadow-green-500/40';

    const safeValue = displayValue ?? 0;

    return (
        <div className={`p-5 bg-gray-800/60 rounded-xl border border-cyan-700/30 shadow-xl flex flex-col h-full 
      transform transition duration-500 hover:shadow-2xl ${barHoverShadow} hover:border-cyan-500 hover:translate-y-[-4px]`}>

            <div className="flex items-start space-x-3 mb-3">
                <sector.icon className={`w-8 h-8 flex-shrink-0 ${color}`} />
                <h4 className="text-xl font-bold text-white leading-tight">{sector.name}</h4>
            </div>

            <p className="text-sm text-gray-400 flex-grow mb-4">{sector.detail}</p>

            <div className="mt-auto pt-3 border-t border-gray-700/50">
                <p className="text-xs text-gray-500 font-medium mb-1">
                    {type === 'vulnerable' ? 'Estimated Automation Exposure:' : 'Projected Growth Rate (by 2033):'}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${barColor} transition-all duration-1000`}
                        style={{ width: `${safeValue > 100 ? 100 : safeValue}%` }}
                    ></div>
                </div>
                <span className={`text-xl font-extrabold ${color} mt-1 block`}>
                    {type === 'growing' && safeValue > 0 && '+'}{decimals > 0 ? safeValue.toFixed(decimals) : safeValue}{unit}
                </span>
            </div>
        </div>
    );
};

const CompanyLayoffCard = ({ company }: { company: { name: string, color: string, year: string, layoffs: string, context: string } }) => (
    <div className={`p-5 rounded-xl shadow-xl ${company.color}/30 border-l-4 border-red-500 bg-gray-800/70 h-full`}>
        <div className="flex justify-between items-start mb-3">
            <h4 className="text-xl font-bold text-white">{company.name}</h4>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-700 text-white shadow-md">{company.year}</span>
        </div>
        <div className="mb-3">
            <p className="text-2xl font-extrabold text-red-400 leading-none">{company.layoffs}</p>
            <p className="text-sm text-gray-400">Total Roles Affected</p>
        </div>
        <p className="text-sm text-gray-300">
            <span className="font-bold">Reason:</span> {company.context}
        </p>
    </div>
);


const FutureOfWorkPage = () => {
    const [activeTab, setActiveTab] = useState('disruption');

    useEffect(() => {
        window.scrollTo(0, 0);
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    const disruptionContext = (
        <div className="p-6 bg-gray-800/80 rounded-xl border-l-4 border-red-500 shadow-inner mb-10">
            <p className="text-lg text-gray-300">
                The primary impact of AI today is the <span className="font-bold text-red-300">automation of tasks</span>, not jobs in their entirety. While reports show up to <span className="font-bold text-red-300">60% of jobs</span> will have tasks modified by AI, only a subset, particularly those involving high-volume routine knowledge work, face high risk of <span className="font-bold text-red-300">full displacement</span>.
            </p>
        </div>
    );

    const transformationContext = (
        <div className="p-6 bg-gray-800/80 rounded-xl border-l-4 border-green-500 shadow-inner mb-10">
            <p className="text-lg text-gray-300">
                AI is a powerful force of <span className="font-bold text-green-300">job creation</span>. The focus is moving toward roles that manage, train, and apply AI ethically. This requires a profound <span className="font-bold text-cyan-300">skill shift</span>, prioritizing uniquely human capabilities like complex judgment, creative direction, and social intelligence.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-[#020617]/80 backdrop-blur border-b border-slate-800 transition-all duration-300">
                <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-cyan-500 uppercase">Live Data Insight</span>
                </div>
            </nav>

            <main className="pt-32 pb-20">
                {/* HERO SECTION - REFACTORED TO MATCH AIEvolutionPage & RiskGuardPage */}
                <section className="container mx-auto px-6 mb-24 relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] -z-10"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <Briefcase className="w-3 h-3" />
                            Data Journalism
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                        >
                            The Future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                Work
                            </span>
                        </motion.h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed mb-10 border-l-4 border-cyan-500 pl-6">
                            A data-driven view on global job disruption and the emerging roles of tomorrow. <span className="text-white font-bold">Automation vs. Transformation</span>.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center gap-2">
                                <BookOpen className="w-5 h-5" /> Read Full Report
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-0 right-10 hidden lg:block"
                    >
                        <div className="text-slate-600 font-mono text-xs rotate-90 origin-right flex items-center gap-2">
                            SCROLL TO EXPLORE <ArrowDown className="w-4 h-4 -rotate-90" />
                        </div>
                    </motion.div>
                </section>

                {/* MAIN CONTENT AREA */}
                <div id="report" className="container mx-auto px-6">

                    {/* INTERACTIVE TAB NAVIGATION */}
                    <div className="flex justify-center mb-10">
                        <div className="flex p-1 bg-gray-800 rounded-full shadow-inner border border-gray-700">
                            <button
                                onClick={() => setActiveTab('disruption')}
                                className={`px-8 py-3 rounded-full text-sm font-medium transition duration-300 ${activeTab === 'disruption'
                                    ? 'bg-red-700 text-white shadow-xl shadow-red-700/40'
                                    : 'text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                <TrendingDown className="inline w-4 h-4 mr-2" />
                                I. The Disruption Scenario
                            </button>
                            <button
                                onClick={() => setActiveTab('transformation')}
                                className={`px-8 py-3 rounded-full text-sm font-medium transition duration-300 ${activeTab === 'transformation'
                                    ? 'bg-green-700 text-white shadow-xl shadow-green-700/40'
                                    : 'text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                <TrendingUp className="inline w-4 h-4 mr-2" />
                                II. The Transformation Imperative
                            </button>
                        </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div key={activeTab} className="min-h-[600px]">
                        {activeTab === 'disruption' && (
                            <div className="animate-in fade-in duration-500">
                                {disruptionContext}

                                <div className="grid lg:grid-cols-4 gap-8 mb-12">
                                    {/* Global Displaced Jobs */}
                                    <StatBox
                                        number={globalProjections.globalDisplaced.value}
                                        unit={globalProjections.globalDisplaced.unit}
                                        label="Global Jobs Exposed"
                                        icon={TrendingDown}
                                        color="text-red-400"
                                        source={globalProjections.globalDisplaced.source}
                                    />
                                    {/* US Occupational Shifts */}
                                    <StatBox
                                        number={globalProjections.usOccupationalShifts.value}
                                        unit={globalProjections.usOccupationalShifts.unit}
                                        label="US Occupational Shifts Expected"
                                        icon={Briefcase}
                                        color="text-red-400"
                                        source={globalProjections.usOccupationalShifts.source}
                                    />

                                    {/* Task vs. Job Automation Bar */}
                                    <div className="lg:col-span-2">
                                        <ProgressVisual
                                            label="Automation Scope"
                                            value={globalProjections.taskAutomation.value as number}
                                            unit={globalProjections.taskAutomation.unit}
                                            color="text-cyan-400"
                                            subValue={globalProjections.jobAutomation.value as number}
                                            context={`(BLS: The shift affects tasks first, with up to ${globalProjections.jobAutomation.value}% facing full job replacement.)`}
                                            type="bar"
                                        />
                                    </div>
                                </div>

                                {/* AI-Driven Layoffs at Profitable US Companies */}
                                <h3 className="text-2xl font-bold text-gray-300 mb-6 pt-4 border-t border-gray-700/50 flex items-center">
                                    <DollarSign className="w-5 h-5 mr-3 text-red-400" />
                                    Case Study: Efficiency-Driven Layoffs
                                </h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                    {companyLayoffs.map((company, index) => (
                                        <CompanyLayoffCard key={index} company={company} />
                                    ))}
                                </div>

                                <h3 className="text-2xl font-bold text-gray-300 mb-6 border-b border-gray-700/50 pb-2 flex items-center">
                                    <Bot className="w-5 h-5 mr-3 text-red-400" />
                                    The Vulnerable Quadrant
                                </h3>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {affectedSectors.map((sector, index) => (
                                        <SectorCard key={index} sector={sector} type="vulnerable" />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'transformation' && (
                            <div className="animate-in fade-in duration-500">
                                {transformationContext}

                                <div className="grid lg:grid-cols-4 gap-8 mb-12">
                                    {/* Net Job Creation */}
                                    <StatBox
                                        number={globalProjections.usOccupationalShifts.value}
                                        unit={globalProjections.usOccupationalShifts.unit}
                                        label="New Roles Created (Implied Net Growth)"
                                        icon={TrendingUp}
                                        color="text-green-400"
                                        source={globalProjections.globalDisplaced.source}
                                    />

                                    {/* Prompt Engineer Growth */}
                                    <StatBox
                                        number={growthSectors.find(s => s.name === "Prompt Engineers")?.growth || 0}
                                        unit="%"
                                        label="Prompt Engineer Growth (YOY)"
                                        icon={Brain}
                                        color="text-green-400"
                                        source="Industry Data"
                                        decimals={0}
                                    />

                                    {/* Required Skill Shift */}
                                    <div className="lg:col-span-2">
                                        <ProgressVisual
                                            label="Required Skill Transformation"
                                            value={globalProjections.skillShift.value as number}
                                            unit={globalProjections.skillShift.unit}
                                            color="text-cyan-400"
                                            context={`(BLS: This percentage of current global skill sets will be outdated by 2030, requiring upskilling.)`}
                                            source={globalProjections.skillShift.source}
                                            type="ring"
                                        />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-300 mb-6 border-b border-gray-700/50 pb-2 flex items-center">
                                    <Brain className="w-5 h-5 mr-3 text-green-400" />
                                    The Emerging Roles
                                </h3>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {growthSectors.map((sector, index) => (
                                        <SectorCard key={index} sector={sector} type="growing" decimals={1} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CITATIONS SECTION */}
                    <section className="mt-20 pt-8 border-t border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-300 flex items-center mb-4">
                            <BookOpen className="w-5 h-5 mr-3 text-cyan-400" />
                            Reference Sources
                        </h2>
                        <ul className="text-sm text-gray-500 space-y-3 list-disc pl-5">
                            <li>
                                <span className="font-bold">US Bureau of Labor Statistics (BLS) Projections:</span> Used for specific 2023-2033 occupational growth/decline figures.
                                <a href="https://www.bls.gov/opub/ted/2025/ai-impacts-in-bls-employment-projections.htm" target="_blank" rel="noopener noreferrer" className="ml-2 text-cyan-400 hover:text-cyan-300 underline">(Source Link)</a>
                            </li>
                            <li>
                                <span className="font-bold">McKinsey Global Institute (MGI) / CBO:</span> Data on US occupational shifts (12M by 2030), task-level automation (60%), and overall economic context.
                                <a href="https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america" target="_blank" rel="noopener noreferrer" className="ml-2 text-cyan-400 hover:text-cyan-300 underline">(Source Link)</a>
                            </li>
                            <li>
                                <span className="font-bold">World Economic Forum (WEF) Future of Jobs Report:</span> Global figures for job displacement (92M) and creation (170M), and skill transformation (39%).
                                <a href="https://www.weforum.org/publications/the-future-of-jobs-report-2025/" target="_blank" rel="noopener noreferrer" className="ml-2 text-cyan-400 hover:text-cyan-300 underline">(Source Link)</a>
                            </li>
                            <li>
                                <span className="font-bold">Goldman Sachs / PwC / National University:</span> Global (300M) and US (30%) job exposure rates, and company layoff data (e.g., Salesforce/Klarna).
                                <a href="https://www.nu.edu/blog/ai-job-statistics/" target="_blank" rel="noopener noreferrer" className="ml-2 text-cyan-400 hover:text-cyan-300 underline">(Source Link)</a>
                            </li>
                        </ul>
                        <p className="mt-4 text-xs text-gray-600 italic">
                            *Note: Projections are estimates and subject to the pace of AI adoption and economic policy.
                        </p>
                    </section>
                </div>
            </main>

            <ProjectNavigation currentId="future-of-work" />

            <footer className="py-12 border-t border-slate-800 bg-[#020617] text-center">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Wutcharin Thatan. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default FutureOfWorkPage;
