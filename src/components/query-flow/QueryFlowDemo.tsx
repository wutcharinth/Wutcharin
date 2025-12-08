import { useState, useRef, useEffect } from 'react';
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
    Check
} from 'lucide-react';
import './QueryFlowDemo.css';

type Role = 'user' | 'engineer';
type ScenarioType = 'revenue' | 'roi' | 'churn';

interface ScenarioData {
    q: string;
    meta: string;
    sql: string;
    insight: string;
    data: string[][];
    type: 'single' | 'double';
}

const scenarios: Record<ScenarioType, ScenarioData> = {
    revenue: {
        q: "Show revenue trend for Q3 2025.",
        meta: "Searching Data Catalog... Found `finance_mart.monthly_revenue`.",
        sql: `<span class="sql-kw">SELECT</span> month, revenue \n<span class="sql-kw">FROM</span> finance_mart.monthly_revenue \n<span class="sql-kw">WHERE</span> quarter = <span class="sql-str">'2025-Q3'</span> \n<span class="sql-kw">ORDER BY</span> month;`,
        insight: "Revenue peaked in August ($520K) driven by the Summer Campaign, growing 12% MoM.",
        data: [["Month", "Revenue"], ["Jul", "450000"], ["Aug", "520000"], ["Sep", "490000"]],
        type: "single"
    },
    roi: {
        q: "Compare Ad Spend vs Sales Revenue by Channel.",
        meta: "Cross-DB Query: `pg.sales` (Postgres) JOIN `sf.marketing` (Snowflake).",
        sql: `<span class="sql-kw">SELECT</span> s.channel, \n  <span class="sql-kw">SUM</span>(s.amount) <span class="sql-kw">AS</span> sales,\n  <span class="sql-kw">SUM</span>(m.spend) <span class="sql-kw">AS</span> spend\n<span class="sql-kw">FROM</span> postgres.sales s\n<span class="sql-kw">JOIN</span> snowflake.ads m <span class="sql-kw">ON</span> s.utm_id = m.id\n<span class="sql-kw">GROUP BY</span> 1;`,
        insight: "Instagram has the highest ROI (4.2x), while LinkedIn spend is inefficient (0.8x ROI). Recommend shifting budget.",
        data: [["Channel", "Sales", "Spend"], ["Google", "120000", "40000"], ["Insta", "180000", "42000"], ["LinkedIn", "20000", "25000"]],
        type: "double"
    },
    churn: {
        q: "Why did churn increase last month?",
        meta: "Analyzing `product_usage` vs `cancellation_logs`.",
        sql: `<span class="sql-kw">SELECT</span> reason, <span class="sql-kw">COUNT</span>(*) \n<span class="sql-kw">FROM</span> cancellations \n<span class="sql-kw">WHERE</span> date > <span class="sql-kw">NOW</span>() - <span class="sql-kw">INTERVAL</span> <span class="sql-str">'30 days'</span>\n<span class="sql-kw">GROUP BY</span> 1 <span class="sql-kw">ORDER BY</span> 2 <span class="sql-kw">DESC</span>;`,
        insight: "60% of churn is tagged as 'Pricing'. This correlates with the recent price hike on Oct 1st.",
        data: [["Reason", "Count"], ["Pricing", "450"], ["Bugs", "120"], ["Support", "80"]],
        type: "single"
    }
};

const QueryFlowDemo = () => {
    const [role, setRole] = useState<Role>('user');
    const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [chatFeed, setChatFeed] = useState<React.ReactNode[]>([
        <div key="welcome" className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs"><Bot className="w-4 h-4 text-slate-400" /></div>
            <div className="bg-slate-800 p-3 rounded-r-xl rounded-bl-xl text-xs text-slate-300 border border-slate-700">
                I have access to <strong>Sales (Postgres)</strong> and <strong>Marketing (Snowflake)</strong>. Ask me anything!
            </div>
        </div>
    ]);
    const [userInput, setUserInput] = useState("Type your question...");
    const [agentStatus, setAgentStatus] = useState<React.ReactNode>(<><Loader2 className="w-3 h-3 text-slate-500" /> Waiting</>);

    // Node States
    const [nodeStatus, setNodeStatus] = useState({
        meta: 'idle', // idle, active
        source: 'idle',
        gen: 'idle',
        exec: 'idle',
        insight: 'idle'
    });

    const [logs, setLogs] = useState<string[]>(['> System ready.']);
    const [metaLog, setMetaLog] = useState("...");
    const [sqlPreview, setSqlPreview] = useState("-- SQL");
    const [resultData, setResultData] = useState<ScenarioData | null>(null);
    const [sourceBadges, setSourceBadges] = useState<React.ReactNode>(<span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-500 border border-slate-700">Access Check</span>);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatFeed]);

    const addLog = (msg: string) => {
        setLogs(prev => [`> ${msg}`, ...prev]);
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const runScenario = async (type: ScenarioType) => {
        if (isRunning) return;
        setIsRunning(true);
        setActiveScenario(type);
        setRole('user');

        // Reset
        setNodeStatus({ meta: 'idle', source: 'idle', gen: 'idle', exec: 'idle', insight: 'idle' });
        setResultData(null);
        setSqlPreview("-- SQL");
        setMetaLog("...");
        setLogs(['> System ready.']);
        setSourceBadges(<span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded text-slate-500 border border-slate-700">Access Check</span>);

        const data = scenarios[type];
        setAgentStatus(<><Loader2 className="w-3 h-3 animate-spin text-violet-400" /> Thinking...</>);

        // 1. Chat
        setUserInput(data.q);
        await wait(600);
        setChatFeed(prev => [...prev,
        <div key={`user-${Date.now()}`} className="flex gap-3 flex-row-reverse animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs text-white font-bold">U</div>
            <div className="bg-violet-900/30 p-3 rounded-l-xl rounded-br-xl text-xs text-violet-100 border border-violet-500/30">{data.q}</div>
        </div>
        ]);
        setUserInput("Type your question...");

        // 2. Metadata
        await wait(500);
        setNodeStatus(prev => ({ ...prev, meta: 'active' }));
        setMetaLog(data.meta);
        addLog("Catalog Search: Success. Tables located.");

        // 3. Source Valid
        await wait(800);
        setNodeStatus(prev => ({ ...prev, meta: 'idle', source: 'active' }));
        setSourceBadges(<span className="text-[9px] bg-green-900/30 px-2 py-0.5 rounded text-green-400 border border-green-500/50 flex items-center gap-1"><Check className="w-3 h-3" />Approved</span>);
        addLog("Lineage Verified. Access Granted.");

        // 4. SQL
        await wait(800);
        setNodeStatus(prev => ({ ...prev, source: 'idle', gen: 'active' }));
        setSqlPreview(data.sql);
        addLog("SQL Generated.");

        // 5. Exec
        await wait(1000);
        setNodeStatus(prev => ({ ...prev, gen: 'idle', exec: 'active' }));
        addLog("Federated Query Executed (230ms).");

        // 6. Insight
        await wait(1000);
        setNodeStatus(prev => ({ ...prev, exec: 'idle', insight: 'active' }));

        // Show Result
        await wait(500);
        setResultData(data);

        // Agent Reply
        setChatFeed(prev => [...prev,
        <div key={`agent-${Date.now()}`} className="flex gap-3 animate-slide-up">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs"><Bot className="w-4 h-4 text-violet-400" /></div>
            <div className="bg-slate-800 p-3 rounded-r-xl rounded-bl-xl text-xs text-slate-300 border border-slate-700">Analysis complete. See the insight regarding {data.q.split(' ')[2]}.</div>
        </div>
        ]);
        setAgentStatus(<><Check className="w-3 h-3 text-green-500" /> Done</>);

        setIsRunning(false);
    };

    return (
        <div className="query-flow-demo h-[600px] flex flex-col font-sans bg-[#0F172A] rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            {/* Header */}
            <header className="h-14 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4 z-50 shrink-0 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-violet-600 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20">
                        <Brain className="w-4 h-4" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm leading-tight tracking-tight text-white">QueryFlow <span className="text-violet-400">AI</span></h1>
                        <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Enterprise Data Agent v3.1</div>
                    </div>
                </div>

                {/* Scenario Selector */}
                <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 gap-2">
                    <button onClick={() => runScenario('revenue')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${activeScenario === 'revenue' ? 'bg-green-600 text-white border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}>
                        <LineChart className="w-3.5 h-3.5" /> Revenue
                    </button>
                    <button onClick={() => runScenario('roi')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${activeScenario === 'roi' ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}>
                        <Layers className="w-3.5 h-3.5" /> ROI (Multi-DB)
                    </button>
                    <button onClick={() => runScenario('churn')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${activeScenario === 'churn' ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}>
                        <UserX className="w-3.5 h-3.5" /> Churn
                    </button>
                </div>

                {/* Role Switcher */}
                <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700 gap-1">
                    <button onClick={() => setRole('user')} className={`role-btn px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${role === 'user' ? 'active' : 'text-slate-400 hover:text-white'}`}>
                        User View
                    </button>
                    <button onClick={() => setRole('engineer')} className={`role-btn px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${role === 'engineer' ? 'active' : 'text-slate-400 hover:text-white'}`}>
                        Engineer View
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">

                {/* LEFT: Chat Interface */}
                <section className="w-[300px] border-r border-slate-700 bg-[#0B1120] flex flex-col relative z-20 shadow-2xl">
                    <div className="p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur shrink-0 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><MessageSquare className="w-3 h-3" />Analysis Request</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                            <span className="text-[9px] text-violet-500 font-mono">ONLINE</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={chatContainerRef}>
                        {chatFeed}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-700 bg-slate-900">
                        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 flex items-center gap-2 opacity-70">
                            <span className="text-xs text-slate-400 italic truncate">{userInput}</span>
                            <Send className="w-3 h-3 ml-auto text-slate-500" />
                        </div>
                    </div>
                </section>

                {/* CENTER: Agent Brain (Logic Flow) */}
                <section className="flex-1 bg-[#0F172A] relative flex flex-col items-center pt-6 overflow-hidden">
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-800 transform -translate-x-1/2 z-0"></div>

                    <div className="absolute top-4 left-4 z-10">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Reasoning Chain</div>
                        <div className="flex items-center gap-2 text-slate-300 text-sm font-mono">
                            {agentStatus}
                        </div>
                    </div>

                    <div className="relative w-full max-w-md flex flex-col gap-4 items-center z-10 px-4 h-full overflow-y-auto custom-scrollbar pb-20">

                        {/* Node 1: Metadata Scout */}
                        <div className={`node-card w-full p-3 rounded-xl relative z-10 ${nodeStatus.meta === 'active' ? 'node-active' : ''}`}>
                            <div className={`flow-line ${nodeStatus.meta === 'active' ? 'active' : ''}`}></div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-6 h-6 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-blue-400">
                                    <Search className="w-3 h-3" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white">Metadata Scout</h3>
                                    <div className="text-[10px] text-slate-500 font-mono">Tool: Data Catalog Search</div>
                                </div>
                            </div>
                            <div className="bg-black/30 p-2 rounded border border-slate-700/50 text-[11px] font-mono text-slate-400 truncate">{metaLog}</div>
                        </div>

                        {/* Node 2: Source Validation */}
                        <div className={`node-card w-full p-3 rounded-xl relative z-10 ${nodeStatus.source === 'active' ? 'node-active' : ''}`}>
                            <div className={`flow-line ${nodeStatus.source === 'active' ? 'active' : ''}`}></div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-6 h-6 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-yellow-400">
                                    <Key className="w-3 h-3" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white">Security & Lineage</h3>
                                    <div className="text-[10px] text-slate-500 font-mono">Policy Check</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {sourceBadges}
                            </div>
                        </div>

                        {/* Node 3: SQL Generation */}
                        <div className={`node-card w-full p-3 rounded-xl relative z-10 ${nodeStatus.gen === 'active' ? 'node-active' : ''}`}>
                            <div className={`flow-line ${nodeStatus.gen === 'active' ? 'active' : ''}`}></div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-6 h-6 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-purple-400">
                                    <Code className="w-3 h-3" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white">SQL Generator</h3>
                                    <div className="text-[9px] text-slate-500 font-mono">LLM (GPT-4o)</div>
                                </div>
                            </div>
                            <div className="bg-black p-2 rounded border border-slate-700 text-[9px] font-mono text-slate-300 min-h-[40px] max-h-[100px] overflow-y-auto custom-scrollbar" dangerouslySetInnerHTML={{ __html: sqlPreview }}></div>
                        </div>

                        {/* Node 4: Execution */}
                        <div className={`node-card w-full p-3 rounded-xl relative z-10 ${nodeStatus.exec === 'active' ? 'node-active' : 'opacity-50'}`}>
                            <div className={`flow-line ${nodeStatus.exec === 'active' ? 'active' : ''}`}></div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-green-400">
                                    <Play className="w-3 h-3" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white">Federated Execution</h3>
                                    <div className="text-[9px] text-slate-500 font-mono">Trino / Presto Engine</div>
                                </div>
                            </div>
                        </div>

                        {/* Node 5: Insight Generator */}
                        <div className={`node-card w-full p-3 rounded-xl relative z-10 ${nodeStatus.insight === 'active' ? 'node-active' : 'opacity-50'}`}>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-6 h-6 rounded bg-slate-800 border border-slate-600 flex items-center justify-center text-violet-400">
                                    <Lightbulb className="w-3 h-3" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white">Insight Engine</h3>
                                    <div className="text-[9px] text-slate-500 font-mono">Narrative Generation</div>
                                </div>
                            </div>
                            <div className="text-[9px] text-slate-400 italic">{nodeStatus.insight === 'active' ? 'Analyzing trends...' : '...'}</div>
                        </div>

                    </div>
                </section>

                {/* RIGHT: Results & Configuration */}
                <section className="w-[400px] border-l border-slate-700 bg-[#0B1120] flex flex-col relative z-20 shadow-2xl">
                    <div className="p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur shrink-0 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-violet-400 uppercase tracking-wider">{role === 'user' ? "Data Visualization" : "System Lineage"}</h2>
                        <span className="text-[9px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">{role === 'user' ? "USER MODE" : "ADMIN MODE"}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

                        {/* USER VIEW */}
                        {role === 'user' && (
                            <div className="space-y-6">
                                {!resultData ? (
                                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 min-h-[200px] flex items-center justify-center text-slate-500 text-xs italic">
                                        No data loaded.
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-slide-up">
                                        {/* Chart */}
                                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 h-[200px] flex items-end justify-between gap-4 relative">
                                            {resultData.data.slice(1).map((row, i) => {
                                                const isDouble = resultData.type === 'double';
                                                const val1 = parseInt(row[1]);
                                                const val2 = isDouble ? parseInt(row[2]) : 0;
                                                const values1 = resultData.data.slice(1).map(r => parseInt(r[1]));
                                                const values2 = isDouble ? resultData.data.slice(1).map(r => parseInt(r[2])) : [];
                                                const max = Math.max(...values1, ...values2) || 1;

                                                return (
                                                    <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end group">
                                                        <div className="flex gap-1 w-full justify-center items-end h-full">
                                                            <div className={`w-4 ${isDouble ? 'bg-green-500/60 border-green-400' : 'bg-violet-500/50 border-violet-400'} border-t-2 rounded-t-sm hover:opacity-100 transition-all animate-grow-bar relative`} style={{ height: `${(val1 / max) * 100}%` } as any}>
                                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{row[1]}</div>
                                                            </div>
                                                            {isDouble && (
                                                                <div className="w-4 bg-red-500/60 border-t-2 border-red-400 rounded-t-sm hover:opacity-100 transition-all animate-grow-bar relative" style={{ height: `${(val2 / max) * 100}%` } as any}>
                                                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">{row[2]}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="text-[9px] text-slate-500 font-mono mt-1">{row[0]}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* AI Insight Box */}
                                        <div className="bg-violet-900/20 border border-violet-500/30 rounded-lg p-3 animate-slide-up">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="w-3 h-3 text-violet-400" />
                                                <span className="text-[10px] font-bold text-violet-200 uppercase">Key Takeaway</span>
                                            </div>
                                            <p className="text-xs text-slate-300 leading-relaxed">{resultData.insight}</p>
                                        </div>

                                        {/* Table */}
                                        <div className="border border-slate-700 rounded-lg overflow-hidden">
                                            <table className="w-full text-left text-[10px]">
                                                <thead className="bg-slate-800 text-slate-400">
                                                    <tr>
                                                        {resultData.data[0].map((h, i) => (
                                                            <th key={i} className="p-2 border-b border-slate-700 uppercase font-bold text-violet-400">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-slate-900 text-slate-300 font-mono">
                                                    {resultData.data.slice(1).map((row, i) => (
                                                        <tr key={i} className="hover:bg-slate-800 transition-colors">
                                                            {row.map((cell, j) => (
                                                                <td key={j} className="p-2 border-b border-slate-800">{cell}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ENGINEER VIEW */}
                        {role === 'engineer' && (
                            <div className="space-y-6">
                                {/* Lineage Graph */}
                                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><Network className="w-3 h-3" />Data Lineage</div>
                                    <div className="flex items-center justify-between px-2">
                                        <div className="lineage-node text-blue-300">Postgres<br />(Sales)</div>
                                        <div className="flex-1 h-[2px] bg-slate-600 mx-2 relative"><ChevronRight className="w-3 h-3 absolute right-0 -top-[5px] text-slate-600" /></div>
                                        <div className="lineage-node text-purple-300">Snowflake<br />(Marketing)</div>
                                        <div className="flex-1 h-[2px] bg-slate-600 mx-2 relative"><ChevronRight className="w-3 h-3 absolute right-0 -top-[5px] text-slate-600" /></div>
                                        <div className="lineage-node text-green-300 border-green-500/50">Mart<br />(Unified)</div>
                                    </div>
                                    <div className="mt-4 text-[9px] text-slate-500 text-center">Data freshness: <span className="text-green-400">Live</span></div>
                                </div>

                                {/* Validation Log */}
                                <div className="bg-black p-3 rounded border border-slate-700 font-mono text-[10px] text-slate-400 h-40 overflow-y-auto custom-scrollbar space-y-1">
                                    {logs.map((log, i) => (
                                        <div key={i} className="text-slate-300 border-l-2 border-violet-500 pl-2">{log}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </section>

            </main>
        </div>
    );
};

export default QueryFlowDemo;
