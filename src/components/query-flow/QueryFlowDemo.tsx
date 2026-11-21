import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    LineChart,
    Layers,
    UserX,
    MessageSquare,
    Bot,
    Send,
    Loader2,
    Search,
    Key,
    Code,
    Play,
    Lightbulb,
    Sparkles,
    Network,
    ChevronRight,
    Check,
    BarChart3,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../lib/motion/usePrefersReducedMotion';

type Role = 'user' | 'engineer';
type ScenarioType = 'revenue' | 'roi' | 'churn';

interface ChatMsg {
    id: string;
    sender: 'user' | 'agent';
    text: string;
}

interface ScenarioData {
    q: string;
    meta: string;
    sqlLines: string[];
    insight: string;
    data: string[][];
    type: 'single' | 'double';
}

const ACCENT = '#8b5cf6';

const SCENARIOS: Record<ScenarioType, ScenarioData> = {
    revenue: {
        q: 'Show revenue trend for Q3 2025.',
        meta: 'Catalog match: finance_mart.monthly_revenue',
        sqlLines: [
            'SELECT month, revenue',
            'FROM finance_mart.monthly_revenue',
            "WHERE quarter = '2025-Q3'",
            'ORDER BY month;',
        ],
        insight: 'Revenue peaked in August ($520K) driven by the Summer Campaign, growing 12% MoM.',
        data: [
            ['Month', 'Revenue'],
            ['Jul', '450000'],
            ['Aug', '520000'],
            ['Sep', '490000'],
        ],
        type: 'single',
    },
    roi: {
        q: 'Compare Ad Spend vs Sales Revenue by Channel.',
        meta: 'Cross-DB join: pg.sales (Postgres) + sf.marketing (Snowflake)',
        sqlLines: [
            'SELECT s.channel,',
            '  SUM(s.amount) AS sales,',
            '  SUM(m.spend) AS spend',
            'FROM postgres.sales s',
            'JOIN snowflake.ads m ON s.utm_id = m.id',
            'GROUP BY 1;',
        ],
        insight: 'Instagram has the highest ROI (4.2x), while LinkedIn spend is inefficient (0.8x ROI). Recommend shifting budget.',
        data: [
            ['Channel', 'Sales', 'Spend'],
            ['Google', '120000', '40000'],
            ['Insta', '180000', '42000'],
            ['LinkedIn', '20000', '25000'],
        ],
        type: 'double',
    },
    churn: {
        q: 'Why did churn increase last month?',
        meta: 'Joining product_usage with cancellation_logs',
        sqlLines: [
            'SELECT reason, COUNT(*)',
            'FROM cancellations',
            "WHERE date > NOW() - INTERVAL '30 days'",
            'GROUP BY 1 ORDER BY 2 DESC;',
        ],
        insight: "60% of churn is tagged as 'Pricing', correlating directly with the Oct 1st plan adjustment.",
        data: [
            ['Reason', 'Count'],
            ['Pricing', '450'],
            ['Bugs', '120'],
            ['Support', '80'],
        ],
        type: 'single',
    },
};

const SQL_KEYWORDS = new Set(['SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'GROUP', 'BY', 'ORDER', 'DESC', 'AS', 'SUM', 'COUNT', 'NOW', 'INTERVAL']);

function SqlCodeBlock({ lines }: { lines: string[] }) {
    return (
        <div className="bg-bg p-2.5 rounded-lg border border-hairline font-mono text-[10px] leading-relaxed overflow-x-auto">
            {lines.map((line, i) => (
                <div key={i} className="whitespace-pre">
                    {line.split(/(\s+|'[^']*')/g).map((token, j) => {
                        if (/^'[^']*'$/.test(token)) {
                            return <span key={j} className="text-emerald-500">{token}</span>;
                        }
                        if (SQL_KEYWORDS.has(token.replace(/[(),]/g, '').toUpperCase())) {
                            return <span key={j} className="text-violet-500 font-semibold">{token}</span>;
                        }
                        return <span key={j} className="text-text">{token}</span>;
                    })}
                </div>
            ))}
        </div>
    );
}

const QueryFlowDemo = () => {
    const reduced = usePrefersReducedMotion();
    const [role, setRole] = useState<Role>('user');
    const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(null);
    const [mobileTab, setMobileTab] = useState<'chat' | 'chain' | 'result'>('chain');
    const [isRunning, setIsRunning] = useState(false);

    const [chatFeed, setChatFeed] = useState<ChatMsg[]>([
        {
            id: 'welcome',
            sender: 'agent',
            text: 'Connected to Sales (Postgres) and Marketing (Snowflake). Select a prompt above to trace federated SQL execution.',
        },
    ]);
    const [userInput, setUserInput] = useState('Select a scenario prompt above...');
    const [agentPhase, setAgentPhase] = useState<'idle' | 'running' | 'done'>('idle');

    const [nodeStatus, setNodeStatus] = useState({
        meta: 'idle' as 'idle' | 'active' | 'done',
        source: 'idle' as 'idle' | 'active' | 'done',
        gen: 'idle' as 'idle' | 'active' | 'done',
        exec: 'idle' as 'idle' | 'active' | 'done',
        insight: 'idle' as 'idle' | 'active' | 'done',
    });

    const [logs, setLogs] = useState<string[]>(['> System ready. Waiting for query...']);
    const [metaLog, setMetaLog] = useState('Catalog idle');
    const [sqlLines, setSqlLines] = useState<string[]>(['-- Select a query to generate SQL']);
    const [resultData, setResultData] = useState<ScenarioData | null>(null);
    const [lineageApproved, setLineageApproved] = useState(false);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const runIdRef = useRef(0);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatFeed]);

    const addLog = (msg: string) => setLogs((prev) => [`> ${msg}`, ...prev]);

    const runScenario = async (type: ScenarioType) => {
        const myRun = runIdRef.current + 1;
        runIdRef.current = myRun;
        const cancelled = () => runIdRef.current !== myRun;
        const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 100) : ms));

        setIsRunning(true);
        setActiveScenario(type);
        setNodeStatus({ meta: 'idle', source: 'idle', gen: 'idle', exec: 'idle', insight: 'idle' });
        setResultData(null);
        setSqlLines(['-- Generating SQL...']);
        setMetaLog('Searching Data Catalog...');
        setLineageApproved(false);
        setLogs(['> Pipeline initialized.']);
        setAgentPhase('running');

        const data = SCENARIOS[type];
        setUserInput(data.q);
        await wait(350);
        if (cancelled()) return;

        setChatFeed((prev) => [...prev, { id: `u-${myRun}`, sender: 'user', text: data.q }]);
        setUserInput('Select a scenario prompt above...');

        // 1. Metadata
        await wait(350);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, meta: 'active' }));
        setMetaLog(data.meta);
        addLog('Catalog Search: tables located.');

        // 2. Lineage
        await wait(650);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, meta: 'done', source: 'active' }));
        setLineageApproved(true);
        addLog('RBAC & Lineage verified. Access granted.');

        // 3. SQL Gen
        await wait(650);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, source: 'done', gen: 'active' }));
        setSqlLines(data.sqlLines);
        addLog('Read-only federated SQL synthesized.');

        // 4. Execution
        await wait(800);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, gen: 'done', exec: 'active' }));
        addLog('Trino federated query executed (230ms).');

        // 5. Insight
        await wait(700);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, exec: 'done', insight: 'active' }));
        setResultData(data);
        addLog('Narrative synthesis complete.');

        await wait(300);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, insight: 'done' }));
        setChatFeed((prev) => [
            ...prev,
            { id: `a-${myRun}`, sender: 'agent', text: data.insight },
        ]);
        setAgentPhase('done');
        setIsRunning(false);
    };

    const steps = [
        {
            key: 'meta' as const,
            title: 'Metadata Scout',
            subtitle: 'Tool: Data Catalog Search',
            icon: Search,
            content: <div className="bg-bg px-2.5 py-1.5 rounded-lg border border-hairline text-[11px] font-mono text-text-mute truncate">{metaLog}</div>,
        },
        {
            key: 'source' as const,
            title: 'Security & Lineage',
            subtitle: 'RBAC & Policy Guard',
            icon: Key,
            content: (
                <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.14em] px-2 py-0.5 rounded border ${
                        lineageApproved
                            ? 'bg-emerald-500/12 text-emerald-500 border-emerald-500/35'
                            : 'bg-bg text-text-mute border-hairline'
                    }`}
                >
                    {lineageApproved && <Check className="w-3 h-3" />}
                    {lineageApproved ? 'Read-Only Approved' : 'Awaiting Query'}
                </span>
            ),
        },
        {
            key: 'gen' as const,
            title: 'SQL Generator',
            subtitle: 'Schema-Grounded LLM',
            icon: Code,
            content: <SqlCodeBlock lines={sqlLines} />,
        },
        {
            key: 'exec' as const,
            title: 'Federated Execution',
            subtitle: 'Trino / Presto Engine',
            icon: Play,
            content: null,
        },
        {
            key: 'insight' as const,
            title: 'Insight Engine',
            subtitle: 'Narrative Synthesis',
            icon: Lightbulb,
            content: null,
        },
    ];

    return (
        <div className="min-h-[640px] lg:h-[680px] flex flex-col font-sans bg-bg text-text overflow-hidden">
            {/* Header */}
            <header className="border-b border-hairline bg-panel px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                        style={{ borderColor: `${ACCENT}44`, backgroundColor: `${ACCENT}14`, color: ACCENT }}
                    >
                        <Brain className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-display font-medium text-sm leading-tight text-text-strong flex items-center gap-1.5">
                            QueryFlow <span className="font-serif italic" style={{ color: ACCENT }}>AI</span>
                        </div>
                        <div className="text-[10px] text-text-mute font-mono tracking-[0.18em] uppercase">
                            Federated Data Agent v3.1
                        </div>
                    </div>
                </div>

                {/* Scenario Selector */}
                <div className="flex flex-wrap items-center bg-bg border border-hairline rounded-full p-0.5 gap-0.5">
                    {(
                        [
                            { id: 'revenue', label: 'Revenue', Icon: LineChart },
                            { id: 'roi', label: 'ROI (Multi-DB)', Icon: Layers },
                            { id: 'churn', label: 'Churn', Icon: UserX },
                        ] as const
                    ).map(({ id, label, Icon }) => {
                        const active = activeScenario === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => runScenario(id)}
                                data-cursor="play"
                                className={`relative px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.1em] transition-colors flex items-center gap-1.5 ${
                                    active ? 'text-text-strong font-medium' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="queryflow-scenario-pill"
                                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                        className="absolute inset-0 rounded-full border"
                                        style={{ backgroundColor: `${ACCENT}18`, borderColor: `${ACCENT}55` }}
                                    />
                                )}
                                <Icon className="w-3.5 h-3.5 relative z-10" style={active ? { color: ACCENT } : undefined} />
                                <span className="relative z-10">{label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Role Switcher */}
                <div className="flex items-center bg-bg border border-hairline rounded-full p-0.5">
                    {(['user', 'engineer'] as Role[]).map((r) => {
                        const active = role === r;
                        return (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`relative px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.14em] transition-colors ${
                                    active ? 'text-bg font-medium' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="queryflow-role-pill"
                                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                        className="absolute inset-0 rounded-full bg-text-strong"
                                    />
                                )}
                                <span className="relative z-10">{r === 'user' ? 'Analyst' : 'Engineer'}</span>
                            </button>
                        );
                    })}
                </div>
            </header>

            {/* Main 3-Pane Content */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* LEFT: Chat Interface */}
                <section
                    className={`w-full lg:w-[270px] border-r border-hairline bg-panel/40 flex-col relative z-10 shrink-0 ${
                        mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
                    }`}
                >
                    <div className="px-4 py-3 border-b border-hairline flex justify-between items-center shrink-0">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                            Query Feed
                        </h3>
                        <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            ONLINE
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={chatContainerRef}>
                        <AnimatePresence initial={false}>
                            {chatFeed.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0 ${
                                            msg.sender === 'user'
                                                ? 'bg-text-strong text-bg border-text-strong'
                                                : 'bg-panel border-hairline text-text-strong'
                                        }`}
                                    >
                                        {msg.sender === 'user' ? 'U' : <Bot className="w-3.5 h-3.5" style={{ color: ACCENT }} />}
                                    </div>
                                    <div
                                        className={`p-3 rounded-xl text-xs leading-relaxed border ${
                                            msg.sender === 'user'
                                                ? 'border-violet-500/35 bg-violet-500/10 text-text-strong'
                                                : 'border-hairline bg-bg text-text'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="p-3 border-t border-hairline bg-panel">
                        <div className="bg-bg border border-hairline rounded-lg px-3 py-2 flex items-center gap-2">
                            <span className="text-[11px] font-mono text-text-mute truncate">{userInput}</span>
                            <Send className="w-3 h-3 ml-auto text-text-mute shrink-0" />
                        </div>
                    </div>
                </section>

                {/* CENTER: Reasoning Chain */}
                <section
                    className={`flex-1 bg-bg relative flex-col overflow-hidden ${
                        mobileTab === 'chain' ? 'flex' : 'hidden lg:flex'
                    }`}
                >
                    <div className="px-4 py-3 border-b border-hairline bg-panel/60 flex items-center justify-between shrink-0">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-mute">
                            Reasoning Chain
                        </span>
                        <span className="text-[11px] font-mono text-text-strong flex items-center gap-1.5">
                            {agentPhase === 'running' && <Loader2 className="w-3 h-3 animate-spin text-violet-500" />}
                            {agentPhase === 'done' && <Check className="w-3 h-3 text-emerald-500" />}
                            {agentPhase === 'idle' ? 'Waiting' : agentPhase === 'running' ? 'Synthesizing...' : 'Complete'}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5">
                        <div className="max-w-md mx-auto space-y-3">
                            {steps.map((step, i) => {
                                const state = nodeStatus[step.key];
                                const Icon = step.icon;
                                const isActive = state === 'active';
                                const isDone = state === 'done';

                                return (
                                    <div key={step.key} className="relative">
                                        {i < steps.length - 1 && (
                                            <div className="absolute left-6 -bottom-3 h-3 w-[2px] bg-hairline overflow-hidden">
                                                <motion.div
                                                    className="w-full h-full origin-top"
                                                    style={{ backgroundColor: ACCENT }}
                                                    initial={{ scaleY: 0 }}
                                                    animate={{ scaleY: isActive || isDone ? 1 : 0 }}
                                                />
                                            </div>
                                        )}

                                        <div
                                            className={`p-3.5 rounded-xl border transition-all duration-300 ${
                                                isActive
                                                    ? 'border-violet-500/60 bg-violet-500/[0.08]'
                                                    : isDone
                                                      ? 'border-hairline-strong bg-panel'
                                                      : 'border-hairline bg-panel/40 opacity-75'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div
                                                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${
                                                        isActive
                                                            ? 'border-violet-500 bg-violet-500/20 text-violet-500'
                                                            : isDone
                                                              ? 'border-emerald-500/40 bg-emerald-500/12 text-emerald-500'
                                                              : 'border-hairline bg-bg text-text-mute'
                                                    }`}
                                                >
                                                    <Icon className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-xs font-medium text-text-strong">{step.title}</div>
                                                    <div className="text-[10px] font-mono text-text-mute">{step.subtitle}</div>
                                                </div>
                                                {isDone && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                                                {isActive && <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500 shrink-0" />}
                                            </div>
                                            {step.content}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* RIGHT: Data Visualization & Lineage */}
                <section
                    className={`w-full lg:w-[350px] border-l border-hairline bg-panel/40 flex-col relative z-10 shrink-0 ${
                        mobileTab === 'result' ? 'flex' : 'hidden lg:flex'
                    }`}
                >
                    <div className="px-4 py-3 border-b border-hairline flex justify-between items-center shrink-0">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong flex items-center gap-2">
                            <BarChart3 className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                            {role === 'user' ? 'Output & Chart' : 'Federated Lineage'}
                        </h3>
                        <span className="text-[9px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border border-hairline text-text-mute">
                            {role}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5">
                        {role === 'user' && (
                            <div className="space-y-4">
                                {!resultData ? (
                                    <div className="rounded-xl border border-hairline bg-bg/70 p-6 min-h-[210px] flex flex-col items-center justify-center text-center gap-2">
                                        <BarChart3 className="w-6 h-6 text-text-mute opacity-60" />
                                        <span className="text-xs font-mono text-text-mute">
                                            {isRunning ? 'Executing query across sources...' : 'Pick Revenue, ROI, or Churn above to render results.'}
                                        </span>
                                    </div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        {/* Animated Bar Chart */}
                                        <div className="bg-bg border border-hairline rounded-xl p-4 h-[195px] flex items-end justify-between gap-3">
                                            {resultData.data.slice(1).map((row, i) => {
                                                const isDouble = resultData.type === 'double';
                                                const val1 = parseInt(row[1], 10);
                                                const val2 = isDouble ? parseInt(row[2], 10) : 0;
                                                const values1 = resultData.data.slice(1).map((r) => parseInt(r[1], 10));
                                                const values2 = isDouble ? resultData.data.slice(1).map((r) => parseInt(r[2], 10)) : [];
                                                const max = Math.max(...values1, ...values2) || 1;

                                                return (
                                                    <div key={row[0]} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
                                                        <div className="flex gap-1.5 w-full justify-center items-end flex-1">
                                                            <motion.div
                                                                initial={{ height: 0 }}
                                                                animate={{ height: `${Math.max(10, (val1 / max) * 100)}%` }}
                                                                transition={{ duration: reduced ? 0.1 : 0.6, delay: i * 0.08 }}
                                                                className="w-5 rounded-t border-t-2 relative group"
                                                                style={{
                                                                    backgroundColor: isDouble ? 'rgba(16,185,129,0.28)' : `${ACCENT}33`,
                                                                    borderColor: isDouble ? '#10b981' : ACCENT,
                                                                }}
                                                                title={`${resultData.data[0][1]}: ${row[1]}`}
                                                            />
                                                            {isDouble && (
                                                                <motion.div
                                                                    initial={{ height: 0 }}
                                                                    animate={{ height: `${Math.max(10, (val2 / max) * 100)}%` }}
                                                                    transition={{ duration: reduced ? 0.1 : 0.6, delay: i * 0.08 + 0.05 }}
                                                                    className="w-5 rounded-t border-t-2 bg-rose-500/25 border-rose-500"
                                                                    title={`${resultData.data[0][2]}: ${row[2]}`}
                                                                />
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] font-mono text-text-mute">{row[0]}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* AI Insight Box */}
                                        <div
                                            className="rounded-xl p-3.5 border"
                                            style={{ backgroundColor: `${ACCENT}10`, borderColor: `${ACCENT}40` }}
                                        >
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Sparkles className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                                                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-strong">
                                                    Key Takeaway
                                                </span>
                                            </div>
                                            <p className="text-xs text-text leading-relaxed">{resultData.insight}</p>
                                        </div>

                                        {/* Data Table */}
                                        <div className="border border-hairline rounded-xl overflow-hidden bg-bg">
                                            <table className="w-full text-left text-[11px]">
                                                <thead className="bg-panel border-b border-hairline">
                                                    <tr>
                                                        {resultData.data[0].map((h, i) => (
                                                            <th key={i} className="px-3 py-2 font-mono uppercase tracking-[0.12em] text-text-mute text-[10px]">
                                                                {h}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="font-mono text-text">
                                                    {resultData.data.slice(1).map((row, i) => (
                                                        <tr key={i} className="border-b border-hairline/60 last:border-b-0">
                                                            {row.map((cell, j) => (
                                                                <td key={j} className="px-3 py-2">
                                                                    {cell}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {role === 'engineer' && (
                            <div className="space-y-4">
                                <div className="bg-bg rounded-xl p-4 border border-hairline">
                                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute mb-4 flex items-center gap-2">
                                        <Network className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                                        Data Lineage
                                    </div>
                                    <div className="flex items-center justify-between gap-1.5">
                                        <div className="flex-1 rounded-lg border border-sky-500/40 bg-sky-500/10 p-2 text-center font-mono text-[10px] text-text-strong">
                                            Postgres
                                            <div className="text-[9px] text-text-mute">Sales</div>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-text-mute shrink-0" />
                                        <div className="flex-1 rounded-lg border border-violet-500/40 bg-violet-500/10 p-2 text-center font-mono text-[10px] text-text-strong">
                                            Snowflake
                                            <div className="text-[9px] text-text-mute">Marketing</div>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-text-mute shrink-0" />
                                        <div className="flex-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-2 text-center font-mono text-[10px] text-text-strong">
                                            Mart
                                            <div className="text-[9px] text-text-mute">Unified</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-[10px] font-mono text-text-mute text-center">
                                        Freshness: <span className="text-emerald-500">Live Replication</span>
                                    </div>
                                </div>

                                <div className="bg-bg p-3.5 rounded-xl border border-hairline font-mono text-[10px] text-text-mute h-44 overflow-y-auto space-y-1.5">
                                    {logs.map((log, i) => (
                                        <div key={i} className="text-text border-l border-violet-500/60 pl-2">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Mobile Nav */}
            <nav className="lg:hidden h-12 bg-panel border-t border-hairline flex justify-around items-center shrink-0">
                {(
                    [
                        { id: 'chat', label: 'Query', Icon: MessageSquare },
                        { id: 'chain', label: 'Chain', Icon: Brain },
                        { id: 'result', label: 'Results', Icon: BarChart3 },
                    ] as const
                ).map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setMobileTab(id)}
                        className={`flex-1 h-full flex flex-col items-center justify-center text-[10px] font-mono uppercase tracking-[0.14em] border-t-2 ${
                            mobileTab === id ? 'border-violet-500 text-text-strong' : 'border-transparent text-text-mute'
                        }`}
                    >
                        <Icon className="w-3.5 h-3.5 mb-0.5" />
                        {label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default QueryFlowDemo;
