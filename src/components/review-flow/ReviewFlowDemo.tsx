import { useState, useRef } from 'react';
import {
    StarHalf,
    Trophy,
    TriangleAlert,
    Utensils,
    Store,
    Globe,
    Inbox,
    Brain,
    GitBranch,
    MessageCircle,
    Settings,
    Star,
    Loader2
} from 'lucide-react';
import './ReviewFlowDemo.css';

type ScenarioType = 'kudos' | 'risk' | 'menu' | 'comp';
type RoleType = 'store' | 'kitchen' | 'hq';

interface ScenarioData {
    user: string;
    avatar: string;
    rating: number;
    text: string;
    sentiment: string;
    topic: string;
    entity: string;
    reply: string;
    opsAction: string;
    roleTarget: RoleType;
}

const scenarios: Record<ScenarioType, ScenarioData> = {
    kudos: {
        user: "Emily R.",
        avatar: "bg-purple-500",
        rating: 5,
        text: "Honestly the best dining experience I've had in years! Sarah was our server and she was absolutely amazing. Attentive without being annoying. The steak was perfect too.",
        sentiment: "POSITIVE",
        topic: "Staff Performance",
        entity: "Sarah",
        reply: "Hi Emily! We're thrilled to hear that! We'll make sure Sarah gets recognized for her excellent service. Hope to see you again soon!",
        opsAction: "leaderboard",
        roleTarget: "store"
    },
    risk: {
        user: "Sarah K.",
        avatar: "bg-red-500",
        rating: 1,
        text: "DANGEROUS. The chicken was completely raw in the middle. The manager didn't seem to care. Reporting this to health inspection.",
        sentiment: "CRITICAL",
        topic: "Food Safety",
        entity: "Raw Chicken",
        reply: "Sarah, please DM us immediately. This is unacceptable and we are launching an immediate internal investigation. We are extremely sorry.",
        opsAction: "alert",
        roleTarget: "store"
    },
    menu: {
        user: "Tom W.",
        avatar: "bg-orange-500",
        rating: 3,
        text: "Atmosphere is great but the Truffle Pasta was inedible. Way too salty. I couldn't even finish half of it.",
        sentiment: "NEGATIVE",
        topic: "Dish Quality",
        entity: "Truffle Pasta",
        reply: "Hi Tom, thanks for the honest feedback. I've flagged this with our Head Chef immediately to check the seasoning on the Truffle Pasta. We hope you'll give us another try.",
        opsAction: "kitchen_flag",
        roleTarget: "kitchen"
    },
    comp: {
        user: "Jessica L.",
        avatar: "bg-blue-500",
        rating: 3,
        text: "It's decent food but honestly PizzaHut down the street has a way better lunch deal for half the price.",
        sentiment: "NEUTRAL",
        topic: "Price Sensitivity",
        entity: "PizzaHut",
        reply: "Hi Jessica, thanks for the feedback. We strive to use premium ingredients that differ from chains, but we hear you on the value. We'll pass this to our marketing team.",
        opsAction: "market_intel",
        roleTarget: "hq"
    }
};

const ReviewFlowDemo = () => {
    const [role, setRole] = useState<RoleType>('store');
    const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [feed, setFeed] = useState<any[]>([]);

    // Node States
    const [nodeStatus, setNodeStatus] = useState({
        ingest: 'idle', // idle, active
        analyze: 'idle',
        router: 'idle', // idle, active
        reply: 'idle', // idle, active, typing
        ops: 'idle' // idle, active, success, danger
    });

    // Data Display States
    const [analysisData, setAnalysisData] = useState<{ sentiment: string, topic: string } | null>(null);
    const [replyText, setReplyText] = useState("");
    const [opsText, setOpsText] = useState("Checking triggers...");
    const [agentStatus, setAgentStatus] = useState("Idle");

    // Dashboard States
    const [sarahScore, setSarahScore] = useState(42);
    const [sarahHighlight, setSarahHighlight] = useState(false);
    const [criticalTicket, setCriticalTicket] = useState<boolean>(false);
    const [pastaScore, setPastaScore] = useState(82);
    const [pastaAlert, setPastaAlert] = useState(false);
    const [compIntel, setCompIntel] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    const resetUI = () => {
        setNodeStatus({
            ingest: 'idle',
            analyze: 'idle',
            router: 'idle',
            reply: 'idle',
            ops: 'idle'
        });
        setAnalysisData(null);
        setReplyText("");
        setOpsText("Checking triggers...");
        setAgentStatus("Idle");
        setSarahHighlight(false);
        setCriticalTicket(false);
        setPastaScore(82);
        setPastaAlert(false);
        setCompIntel(false);
    };

    const typeText = async (text: string) => {
        setReplyText("");
        for (let i = 0; i < text.length; i++) {
            setReplyText(prev => prev + text.charAt(i));
            await new Promise(r => setTimeout(r, 20));
        }
    };

    const runScenario = async (type: ScenarioType) => {
        if (isRunning) return;
        setIsRunning(true);
        setActiveScenario(type);
        resetUI();

        const data = scenarios[type];
        setRole(data.roleTarget);
        setAgentStatus("Processing...");

        // 1. New Review Enters
        const newReview = {
            id: Date.now(),
            ...data
        };
        setFeed(prev => [newReview, ...prev]);

        // 2. Ingest
        await new Promise(r => setTimeout(r, 500));
        setNodeStatus(prev => ({ ...prev, ingest: 'active' }));

        // 3. Analyze
        await new Promise(r => setTimeout(r, 1000));
        setNodeStatus(prev => ({ ...prev, ingest: 'idle', analyze: 'active' }));
        setAnalysisData({ sentiment: data.sentiment, topic: data.topic });

        // 4. Router
        await new Promise(r => setTimeout(r, 1200));
        setNodeStatus(prev => ({ ...prev, analyze: 'idle', router: 'active' }));

        // 5. Actions
        await new Promise(r => setTimeout(r, 800));
        setNodeStatus(prev => ({ ...prev, router: 'idle', reply: 'active', ops: 'active' }));

        // Parallel execution
        const replyPromise = typeText(data.reply);

        const opsPromise = (async () => {
            if (data.opsAction === "leaderboard") {
                setOpsText("Staff Identified: Sarah (+10 pts)");
                setNodeStatus(prev => ({ ...prev, ops: 'success' }));
                await new Promise(r => setTimeout(r, 500));
                setSarahHighlight(true);
                setSarahScore(52);
            } else if (data.opsAction === "alert") {
                setOpsText("SAFETY HAZARD: SMS + Jira Sent");
                setNodeStatus(prev => ({ ...prev, ops: 'danger' }));
                await new Promise(r => setTimeout(r, 500));
                setCriticalTicket(true);
            } else if (data.opsAction === "kitchen_flag") {
                setOpsText("Quality Issue: Flagged in KDS");
                setNodeStatus(prev => ({ ...prev, ops: 'danger' }));
                await new Promise(r => setTimeout(r, 500));
                setPastaScore(65);
                setPastaAlert(true);
            } else if (data.opsAction === "market_intel") {
                setOpsText("Competitor Intel: Logged");
                setNodeStatus(prev => ({ ...prev, ops: 'active' }));
                await new Promise(r => setTimeout(r, 500));
                setCompIntel(true);
            }
        })();

        await Promise.all([replyPromise, opsPromise]);

        setAgentStatus("Complete");
        setIsRunning(false);
    };

    return (
        <div className="h-[800px] flex flex-col font-sans bg-[#0F172A] text-slate-200 overflow-hidden border border-slate-700 rounded-xl shadow-2xl">

            {/* Header */}
            <header className="h-16 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-6 z-50 shadow-xl shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
                        <StarHalf className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight tracking-tight text-white">ReviewFlow <span className="text-amber-400">AI</span></h1>
                        <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Reputation Engine</div>
                    </div>
                </div>

                {/* Scenario Selector */}
                <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 gap-2">
                    <button onClick={() => runScenario('kudos')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${activeScenario === 'kudos' ? 'bg-yellow-600 text-white border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}>
                        <Trophy className="w-3.5 h-3.5" /> Kudos
                    </button>
                    <button onClick={() => runScenario('risk')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${activeScenario === 'risk' ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}>
                        <TriangleAlert className="w-3.5 h-3.5" /> Risk
                    </button>
                    <button onClick={() => runScenario('menu')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${activeScenario === 'menu' ? 'bg-orange-600 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}>
                        <Utensils className="w-3.5 h-3.5" /> Menu
                    </button>
                    <button onClick={() => runScenario('comp')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${activeScenario === 'comp' ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}>
                        <Store className="w-3.5 h-3.5" /> Competitor
                    </button>
                </div>

                {/* Role Switcher */}
                <div className="hidden md:flex bg-slate-800 rounded-lg p-1 border border-slate-700 gap-1">
                    <button onClick={() => setRole('store')} className={`role-btn px-3 py-1.5 rounded-md text-[10px] font-bold transition-all hover:text-white ${role === 'store' ? 'active' : 'text-slate-400'}`}>Store Mgr</button>
                    <button onClick={() => setRole('kitchen')} className={`role-btn px-3 py-1.5 rounded-md text-[10px] font-bold transition-all hover:text-white ${role === 'kitchen' ? 'active' : 'text-slate-400'}`}>Kitchen</button>
                    <button onClick={() => setRole('hq')} className={`role-btn px-3 py-1.5 rounded-md text-[10px] font-bold transition-all hover:text-white ${role === 'hq' ? 'active' : 'text-slate-400'}`}>HQ / Mktg</button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden relative">

                {/* LEFT: Review Feed */}
                <section className="w-[350px] border-r border-slate-700 bg-[#0B1120] flex flex-col relative z-20 shadow-2xl">
                    <div className="p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur shrink-0 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><Globe className="w-3 h-3" /> Live Feed</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[9px] text-green-500 font-mono">LISTENING</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 review-flow-scroll">
                        {feed.length === 0 && (
                            <div className="text-center text-slate-600 mt-10 italic text-xs">Waiting for new reviews...</div>
                        )}
                        {feed.map((review) => (
                            <div key={review.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-lg review-enter mb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full ${review.avatar} flex items-center justify-center text-[10px] text-white font-bold`}>{review.user[0]}</div>
                                        <span className="text-xs font-bold text-slate-200">{review.user}</span>
                                    </div>
                                    <div className="flex text-xs stars gap-0.5">
                                        {Array(review.rating).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-snug">{review.text}</p>
                                <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                                    <span>Google Maps</span>
                                    <span>Just Now</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CENTER: Agent Brain */}
                <section className="flex-1 bg-[#0F172A] relative flex flex-col items-center pt-8 overflow-hidden">
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-800 transform -translate-x-1/2 z-0"></div>

                    <div className="absolute top-4 left-4 z-10">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Agent Workflow</div>
                        <div className="flex items-center gap-2 text-slate-300 text-sm font-mono">
                            {agentStatus === 'Idle' ? <div className="w-2 h-2 bg-slate-500 rounded-full"></div> : <Loader2 className="w-3 h-3 animate-spin text-amber-400" />}
                            {agentStatus}
                        </div>
                    </div>

                    <div className="relative w-full max-w-lg flex flex-col gap-6 items-center z-10 px-4 h-full overflow-y-auto review-flow-scroll pb-20" ref={scrollRef}>

                        {/* Node 1: Ingest */}
                        <div className={`node-card w-full p-4 rounded-xl relative ${nodeStatus.ingest === 'active' ? 'node-active' : ''}`}>
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-slate-400">
                                <Inbox className="w-3 h-3" />
                            </div>
                            <div className="flex justify-between">
                                <h3 className="text-sm font-bold text-white">Ingestion</h3>
                                <span className="text-[9px] font-mono text-slate-500">Google API</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Reading text & star rating.</p>
                        </div>

                        {/* Node 2: Analysis */}
                        <div className={`node-card w-full p-4 rounded-xl relative ${nodeStatus.analyze === 'active' ? 'node-active' : ''}`}>
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-slate-400">
                                <Brain className="w-3 h-3" />
                            </div>
                            <h3 className="text-sm font-bold text-white">Sentiment & NLP</h3>
                            <div className={`mt-2 grid grid-cols-2 gap-2 text-[10px] font-mono transition-opacity ${analysisData ? 'opacity-100' : 'opacity-50'}`}>
                                <div className={`bg-slate-900 p-1 rounded border border-slate-700 ${analysisData?.sentiment === 'POSITIVE' ? 'text-green-400' : analysisData?.sentiment === 'NEGATIVE' ? 'text-amber-400' : analysisData?.sentiment === 'CRITICAL' ? 'text-red-500 font-bold animate-pulse' : 'text-blue-400'}`}>
                                    Sentiment: {analysisData?.sentiment || '--'}
                                </div>
                                <div className="bg-slate-900 p-1 rounded border border-slate-700 text-slate-300">
                                    Topic: {analysisData?.topic || '--'}
                                </div>
                            </div>
                        </div>

                        {/* Node 3: Router */}
                        <div className={`w-12 h-12 bg-slate-800 border border-slate-600 rotate-45 flex items-center justify-center z-10 shadow-xl transition-all duration-300 ${nodeStatus.router === 'active' ? 'scale-125 bg-slate-700 border-amber-500' : ''}`}>
                            <GitBranch className={`-rotate-45 w-5 h-5 ${nodeStatus.router === 'active' ? 'text-amber-400' : 'text-slate-500'}`} />
                        </div>

                        {/* Node 4: Action */}
                        <div className="flex gap-4 w-full">
                            {/* Reply Action */}
                            <div className={`node-card flex-1 p-4 rounded-xl relative transition-all ${nodeStatus.reply === 'active' ? 'node-active opacity-100' : 'opacity-40'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <MessageCircle className="w-3 h-3 text-blue-400" />
                                    <h3 className="text-xs font-bold text-white">Draft Reply</h3>
                                </div>
                                <div className="text-xs text-slate-400 italic bg-slate-900/50 p-2 rounded min-h-[60px] typing-cursor">
                                    {replyText}
                                </div>
                            </div>

                            {/* Ops Action */}
                            <div className={`node-card flex-1 p-4 rounded-xl relative transition-all ${nodeStatus.ops === 'active' ? 'node-active opacity-100' : nodeStatus.ops === 'success' ? 'node-success opacity-100' : nodeStatus.ops === 'danger' ? 'node-danger opacity-100' : 'opacity-40'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Settings className="w-3 h-3 text-amber-400" />
                                    <h3 className="text-xs font-bold text-white">Internal Ops</h3>
                                </div>
                                <div className="text-xs text-slate-400 font-mono">
                                    {opsText}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RIGHT: Dashboard */}
                <section className="w-[350px] border-l border-slate-700 bg-[#0B1120] flex flex-col relative z-20 shadow-2xl">
                    <div className="p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur shrink-0 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                            {role === 'store' ? 'Store Dashboard' : role === 'kitchen' ? 'Kitchen Display' : 'Market Intel'}
                        </h2>
                        <span className="text-[9px] bg-slate-700 px-2 py-0.5 rounded text-slate-300 uppercase">{role} VIEW</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 review-flow-scroll">

                        {/* STORE MGR VIEW */}
                        {role === 'store' && (
                            <div className="role-view">
                                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Staff Kudos</span>
                                        <Trophy className="w-3 h-3 text-yellow-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className={`flex items-center gap-3 p-2 rounded transition-colors ${sarahHighlight ? 'bg-green-900/30 border border-green-500/50' : 'bg-slate-700/50'}`}>
                                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">1</div>
                                            <div className="flex-1 text-xs text-white">Sarah M.</div>
                                            <div className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                                                {sarahScore} <Star className="w-2 h-2 fill-current" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 bg-slate-700/50 rounded">
                                            <div className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">2</div>
                                            <div className="flex-1 text-xs text-white">Mike T.</div>
                                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                28 <Star className="w-2 h-2 fill-current" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-3">Critical Tickets</div>
                                    <div className="space-y-2">
                                        {!criticalTicket && <div className="text-[10px] text-slate-600 italic text-center py-2">No active alerts.</div>}
                                        {criticalTicket && (
                                            <div className="bg-red-900/20 border border-red-500/50 p-2 rounded flex items-center justify-between text-[10px] text-red-200 animate-pulse">
                                                <div className="flex items-center gap-2"><TriangleAlert className="w-3 h-3" /> <span>TICKET-992: Food Safety</span></div>
                                                <span className="font-bold">P0</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* KITCHEN VIEW */}
                        {role === 'kitchen' && (
                            <div className="role-view">
                                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-4">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-3">Dish Feedback (24h)</div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs text-slate-200 mb-1">
                                                <span>Truffle Pasta</span>
                                                <span className={`font-bold ${pastaAlert ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>{pastaScore}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                <div className={`h-full ${pastaAlert ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${pastaScore}%` }}></div>
                                            </div>
                                            {pastaAlert && <div className="text-[9px] text-slate-500 mt-1">Alert: "Too Salty" (3 mentions)</div>}
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-slate-200 mb-1">
                                                <span>Ribeye Steak</span>
                                                <span className="text-green-400 font-bold">96%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 w-[96%]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* HQ VIEW */}
                        {role === 'hq' && (
                            <div className="role-view">
                                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-3">Competitor Mentions</div>
                                    <div className={`flex items-center gap-3 mb-2 ${compIntel ? 'bg-red-900/20 p-1 rounded' : ''}`}>
                                        <div className="w-8 h-1 bg-red-500 rounded"></div>
                                        <div className="flex-1 text-xs text-slate-300">PizzaHut</div>
                                        <div className={`text-xs font-mono text-slate-400 ${compIntel ? 'text-white font-bold' : ''}`}>{compIntel ? '15%' : '12%'}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-1 bg-blue-500 rounded"></div>
                                        <div className="flex-1 text-xs text-slate-300">Domino's</div>
                                        <div className="text-xs font-mono text-slate-400">5%</div>
                                    </div>
                                    {compIntel && (
                                        <div className="mt-4 p-2 bg-slate-700/50 rounded border border-slate-600 animate-pulse">
                                            <div className="text-[9px] text-blue-300 font-bold uppercase mb-1">Intel Alert</div>
                                            <div className="text-[10px] text-slate-300">Customers citing "Cheaper Lunch Deal" at PizzaHut.</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </section>
            </main>
        </div>
    );
};

export default ReviewFlowDemo;
