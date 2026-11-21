import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    Loader2,
    BarChart3,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../lib/motion/usePrefersReducedMotion';

type ScenarioType = 'kudos' | 'risk' | 'menu' | 'comp';
type RoleType = 'store' | 'kitchen' | 'hq';

interface ScenarioData {
    user: string;
    rating: number;
    text: string;
    sentiment: 'POSITIVE' | 'CRITICAL' | 'NEGATIVE' | 'NEUTRAL';
    topic: string;
    reply: string;
    opsAction: 'leaderboard' | 'alert' | 'kitchen_flag' | 'market_intel';
    roleTarget: RoleType;
}

interface FeedItem extends ScenarioData {
    id: number;
}

const ACCENT = '#f59e0b';

const SCENARIOS: Record<ScenarioType, ScenarioData> = {
    kudos: {
        user: 'Emily R.',
        rating: 5,
        text: "Honestly the best dining experience I've had in years! Sarah was our server and she was absolutely amazing. The steak was perfect too.",
        sentiment: 'POSITIVE',
        topic: 'Staff Performance',
        reply: "Hi Emily! We're thrilled to hear that. We'll make sure Sarah is recognized for her outstanding service. Hope to welcome you back soon!",
        opsAction: 'leaderboard',
        roleTarget: 'store',
    },
    risk: {
        user: 'Sarah K.',
        rating: 1,
        text: "DANGEROUS. The chicken was completely raw in the middle. The manager didn't seem to care. Reporting this to health inspection.",
        sentiment: 'CRITICAL',
        topic: 'Food Safety',
        reply: 'Sarah, please message us directly immediately. This is unacceptable and we have opened a priority P0 safety investigation with our culinary director.',
        opsAction: 'alert',
        roleTarget: 'store',
    },
    menu: {
        user: 'Tom W.',
        rating: 3,
        text: "Atmosphere is great but the Truffle Pasta was inedible. Way too salty. I couldn't even finish half of it.",
        sentiment: 'NEGATIVE',
        topic: 'Dish Quality',
        reply: "Hi Tom, thank you for the candid note. We've flagged the Truffle Pasta batch with our Head Chef immediately to recalibrate seasoning.",
        opsAction: 'kitchen_flag',
        roleTarget: 'kitchen',
    },
    comp: {
        user: 'Jessica L.',
        rating: 3,
        text: "It's decent food but honestly PizzaHut down the street has a way better lunch deal for half the price.",
        sentiment: 'NEUTRAL',
        topic: 'Price Sensitivity',
        reply: "Hi Jessica, thank you for sharing that perspective. While we source fresh artisan ingredients, we've shared your value feedback with our menu strategy team.",
        opsAction: 'market_intel',
        roleTarget: 'hq',
    },
};

const ReviewFlowDemo = () => {
    const reduced = usePrefersReducedMotion();
    const [role, setRole] = useState<RoleType>('store');
    const [activeScenario, setActiveScenario] = useState<ScenarioType | null>(null);
    const [mobileTab, setMobileTab] = useState<'feed' | 'brain' | 'dash'>('brain');
    const [isRunning, setIsRunning] = useState(false);
    const [feed, setFeed] = useState<FeedItem[]>([]);

    const [nodeStatus, setNodeStatus] = useState({
        ingest: 'idle' as 'idle' | 'active' | 'done',
        analyze: 'idle' as 'idle' | 'active' | 'done',
        router: 'idle' as 'idle' | 'active' | 'done',
        reply: 'idle' as 'idle' | 'active' | 'done',
        ops: 'idle' as 'idle' | 'active' | 'success' | 'danger',
    });

    const [analysisData, setAnalysisData] = useState<{ sentiment: ScenarioData['sentiment']; topic: string } | null>(null);
    const [replyText, setReplyText] = useState('');
    const [opsText, setOpsText] = useState('Awaiting routing trigger...');
    const [agentStatus, setAgentStatus] = useState<'Idle' | 'Processing...' | 'Complete'>('Idle');

    const [sarahScore, setSarahScore] = useState(42);
    const [sarahHighlight, setSarahHighlight] = useState(false);
    const [criticalTicket, setCriticalTicket] = useState(false);
    const [pastaScore, setPastaScore] = useState(82);
    const [pastaAlert, setPastaAlert] = useState(false);
    const [compIntel, setCompIntel] = useState(false);

    const runIdRef = useRef(0);

    const runScenario = async (type: ScenarioType) => {
        const myRun = runIdRef.current + 1;
        runIdRef.current = myRun;
        const cancelled = () => runIdRef.current !== myRun;
        const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 80) : ms));

        setIsRunning(true);
        setActiveScenario(type);
        setNodeStatus({ ingest: 'idle', analyze: 'idle', router: 'idle', reply: 'idle', ops: 'idle' });
        setAnalysisData(null);
        setReplyText('');
        setOpsText('Checking triggers...');
        setSarahHighlight(false);
        setCriticalTicket(false);
        setPastaScore(82);
        setPastaAlert(false);
        setCompIntel(false);

        const data = SCENARIOS[type];
        setRole(data.roleTarget);
        setAgentStatus('Processing...');
        setFeed((prev) => [{ id: Date.now(), ...data }, ...prev].slice(0, 6));

        // 1. Ingest
        await wait(350);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, ingest: 'active' }));

        // 2. Analyze
        await wait(650);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, ingest: 'done', analyze: 'active' }));
        setAnalysisData({ sentiment: data.sentiment, topic: data.topic });

        // 3. Router
        await wait(700);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, analyze: 'done', router: 'active' }));

        // 4. Parallel Reply + Ops
        await wait(550);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, router: 'done', reply: 'active', ops: 'active' }));

        const typePromise = (async () => {
            if (reduced) {
                setReplyText(data.reply);
                return;
            }
            for (let i = 1; i <= data.reply.length; i += 2) {
                if (cancelled()) return;
                setReplyText(data.reply.slice(0, i + 1));
                await new Promise((r) => setTimeout(r, 14));
            }
            if (!cancelled()) setReplyText(data.reply);
        })();

        const opsPromise = (async () => {
            await wait(350);
            if (cancelled()) return;
            if (data.opsAction === 'leaderboard') {
                setOpsText('Staff kudos logged: Sarah (+10 pts)');
                setNodeStatus((p) => ({ ...p, ops: 'success' }));
                setSarahHighlight(true);
                setSarahScore(52);
            } else if (data.opsAction === 'alert') {
                setOpsText('P0 SAFETY ALERT: SMS + Jira dispatched');
                setNodeStatus((p) => ({ ...p, ops: 'danger' }));
                setCriticalTicket(true);
            } else if (data.opsAction === 'kitchen_flag') {
                setOpsText('KDS Quality Flag: Truffle Pasta batch');
                setNodeStatus((p) => ({ ...p, ops: 'danger' }));
                setPastaScore(65);
                setPastaAlert(true);
            } else {
                setOpsText('Market Intel: Competitor promo indexed');
                setNodeStatus((p) => ({ ...p, ops: 'active' }));
                setCompIntel(true);
            }
        })();

        await Promise.all([typePromise, opsPromise]);
        if (cancelled()) return;

        setNodeStatus((p) => ({ ...p, reply: 'done' }));
        setAgentStatus('Complete');
        setIsRunning(false);
    };

    return (
        <div className="min-h-[660px] lg:h-[720px] flex flex-col font-sans bg-bg text-text overflow-hidden">
            {/* Header */}
            <header className="border-b border-hairline bg-panel px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                        style={{ borderColor: `${ACCENT}44`, backgroundColor: `${ACCENT}14`, color: ACCENT }}
                    >
                        <StarHalf className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-display font-medium text-sm leading-tight text-text-strong flex items-center gap-1.5">
                            ReviewFlow <span className="font-serif italic" style={{ color: ACCENT }}>AI</span>
                        </div>
                        <div className="text-[10px] text-text-mute font-mono tracking-[0.18em] uppercase">
                            Reputation Routing Engine
                        </div>
                    </div>
                </div>

                {/* Scenario Selector */}
                <div className="flex flex-wrap items-center bg-bg border border-hairline rounded-full p-0.5 gap-0.5">
                    {(
                        [
                            { id: 'kudos', label: 'Kudos', Icon: Trophy },
                            { id: 'risk', label: 'Safety', Icon: TriangleAlert },
                            { id: 'menu', label: 'Menu', Icon: Utensils },
                            { id: 'comp', label: 'Intel', Icon: Store },
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
                                        layoutId="reviewflow-scenario-pill"
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
                <div className="hidden md:flex items-center bg-bg border border-hairline rounded-full p-0.5">
                    {(
                        [
                            { id: 'store', label: 'Store' },
                            { id: 'kitchen', label: 'Kitchen' },
                            { id: 'hq', label: 'HQ' },
                        ] as const
                    ).map((r) => {
                        const active = role === r.id;
                        return (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id)}
                                className={`relative px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.14em] transition-colors ${
                                    active ? 'text-bg font-medium' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="reviewflow-role-pill"
                                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                        className="absolute inset-0 rounded-full bg-text-strong"
                                    />
                                )}
                                <span className="relative z-10">{r.label}</span>
                            </button>
                        );
                    })}
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden relative">
                {/* LEFT: Live Review Feed */}
                <section
                    className={`w-full lg:w-[280px] border-r border-hairline bg-panel/40 flex-col shrink-0 ${
                        mobileTab === 'feed' ? 'flex' : 'hidden lg:flex'
                    }`}
                >
                    <div className="px-4 py-3 border-b border-hairline flex justify-between items-center shrink-0">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                            Live Stream
                        </h3>
                        <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            LISTENING
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {feed.length === 0 && (
                            <div className="text-center text-text-mute mt-10 font-mono text-xs">
                                Pick a review scenario above to inject an incoming webhook.
                            </div>
                        )}
                        <AnimatePresence initial={false}>
                            {feed.map((review) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-bg p-3.5 rounded-xl border border-hairline"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full border border-hairline bg-panel flex items-center justify-center text-[10px] font-mono text-text-strong">
                                                {review.user[0]}
                                            </div>
                                            <span className="text-xs font-medium text-text-strong">{review.user}</span>
                                        </div>
                                        <div className="flex text-amber-500 gap-0.5">
                                            {Array.from({ length: review.rating }).map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-text leading-relaxed">{review.text}</p>
                                    <div className="mt-2 pt-2 border-t border-hairline/60 text-[10px] font-mono text-text-mute flex justify-between">
                                        <span>Google Maps</span>
                                        <span>Just Now</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* CENTER: Agent Routing Graph */}
                <section
                    className={`flex-1 bg-bg flex-col overflow-hidden ${
                        mobileTab === 'brain' ? 'flex' : 'hidden lg:flex'
                    }`}
                >
                    <div className="px-4 py-3 border-b border-hairline bg-panel/60 flex items-center justify-between shrink-0">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-mute">
                            Routing Graph
                        </span>
                        <span className="text-[11px] font-mono text-text-strong flex items-center gap-1.5">
                            {isRunning ? (
                                <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                            ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            )}
                            {agentStatus}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5">
                        <div className="max-w-lg mx-auto flex flex-col items-center gap-4">
                            {/* Node 1: Ingest */}
                            <div
                                className={`w-full p-3.5 rounded-xl border transition-colors ${
                                    nodeStatus.ingest === 'active'
                                        ? 'border-amber-500/60 bg-amber-500/[0.08]'
                                        : 'border-hairline bg-panel/50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Inbox className="w-4 h-4 text-amber-500" />
                                        <span className="text-xs font-medium text-text-strong">Ingestion Webhook</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-text-mute">Google Places API</span>
                                </div>
                                <p className="text-[11px] text-text-mute mt-1">Normalizing review text, star rating, and branch ID.</p>
                            </div>

                            {/* Node 2: Sentiment */}
                            <div
                                className={`w-full p-3.5 rounded-xl border transition-colors ${
                                    nodeStatus.analyze === 'active'
                                        ? 'border-amber-500/60 bg-amber-500/[0.08]'
                                        : 'border-hairline bg-panel/50'
                                }`}
                            >
                                <div className="flex items-center gap-2.5 mb-2">
                                    <Brain className="w-4 h-4 text-amber-500" />
                                    <span className="text-xs font-medium text-text-strong">Sentiment &amp; Entity NLP</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                                    <div
                                        className={`bg-bg px-2.5 py-1.5 rounded-lg border border-hairline ${
                                            analysisData?.sentiment === 'POSITIVE'
                                                ? 'text-emerald-500'
                                                : analysisData?.sentiment === 'CRITICAL'
                                                  ? 'text-rose-500 font-semibold'
                                                  : analysisData?.sentiment === 'NEGATIVE'
                                                    ? 'text-amber-500'
                                                    : 'text-text-mute'
                                        }`}
                                    >
                                        Sentiment: {analysisData?.sentiment || '--'}
                                    </div>
                                    <div className="bg-bg px-2.5 py-1.5 rounded-lg border border-hairline text-text">
                                        Topic: {analysisData?.topic || '--'}
                                    </div>
                                </div>
                            </div>

                            {/* Node 3: Diamond Router */}
                            <motion.div
                                animate={nodeStatus.router === 'active' && !reduced ? { scale: 1.15 } : { scale: 1 }}
                                className={`w-11 h-11 rotate-45 rounded-lg border flex items-center justify-center transition-colors ${
                                    nodeStatus.router === 'active'
                                        ? 'border-amber-500 bg-amber-500/15 text-amber-500'
                                        : 'border-hairline-strong bg-panel text-text-mute'
                                }`}
                            >
                                <GitBranch className="-rotate-45 w-4 h-4" />
                            </motion.div>

                            {/* Node 4: Parallel Branches */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                <div
                                    className={`p-3.5 rounded-xl border transition-all ${
                                        nodeStatus.reply !== 'idle'
                                            ? 'border-sky-500/45 bg-sky-500/[0.06] opacity-100'
                                            : 'border-hairline bg-panel/40 opacity-55'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <MessageCircle className="w-3.5 h-3.5 text-sky-500" />
                                        <span className="text-xs font-medium text-text-strong">Brand-Voice Reply</span>
                                    </div>
                                    <div className="text-[11px] text-text leading-relaxed bg-bg border border-hairline rounded-lg p-2.5 min-h-[76px]">
                                        {replyText || <span className="text-text-mute font-mono">Waiting for route...</span>}
                                        {nodeStatus.reply === 'active' && <span className="inline-block w-1.5 h-3 bg-amber-500 ml-0.5 animate-pulse" />}
                                    </div>
                                </div>

                                <div
                                    className={`p-3.5 rounded-xl border transition-all ${
                                        nodeStatus.ops === 'success'
                                            ? 'border-emerald-500/50 bg-emerald-500/[0.07] opacity-100'
                                            : nodeStatus.ops === 'danger'
                                              ? 'border-rose-500/50 bg-rose-500/[0.07] opacity-100'
                                              : nodeStatus.ops === 'active'
                                                ? 'border-amber-500/50 bg-amber-500/[0.07] opacity-100'
                                                : 'border-hairline bg-panel/40 opacity-55'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <Settings className="w-3.5 h-3.5 text-amber-500" />
                                        <span className="text-xs font-medium text-text-strong">Internal Ops Trigger</span>
                                    </div>
                                    <div className="text-[11px] font-mono text-text bg-bg border border-hairline rounded-lg p-2.5 min-h-[76px] flex items-center">
                                        {opsText}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RIGHT: Role Dashboard */}
                <section
                    className={`w-full lg:w-[290px] border-l border-hairline bg-panel/40 flex-col shrink-0 ${
                        mobileTab === 'dash' ? 'flex' : 'hidden lg:flex'
                    }`}
                >
                    <div className="px-4 py-3 border-b border-hairline flex justify-between items-center shrink-0">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong flex items-center gap-2">
                            <BarChart3 className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                            {role === 'store' ? 'Store Ops' : role === 'kitchen' ? 'Kitchen KDS' : 'Market Intel'}
                        </h3>
                        <span className="text-[9px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border border-hairline text-text-mute">
                            {role}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {role === 'store' && (
                            <>
                                <div className="bg-bg rounded-xl p-4 border border-hairline">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute">
                                            Staff Kudos
                                        </span>
                                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <div
                                            className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors ${
                                                sarahHighlight
                                                    ? 'bg-emerald-500/12 border-emerald-500/45'
                                                    : 'bg-panel border-hairline'
                                            }`}
                                        >
                                            <span className="w-5 h-5 rounded-full bg-text-strong text-bg flex items-center justify-center text-[10px] font-mono">
                                                1
                                            </span>
                                            <span className="flex-1 text-xs font-medium text-text-strong">Sarah M.</span>
                                            <span className="text-xs font-mono text-emerald-500 flex items-center gap-1">
                                                {sarahScore} <Star className="w-3 h-3 fill-current" />
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-hairline bg-panel">
                                            <span className="w-5 h-5 rounded-full border border-hairline flex items-center justify-center text-[10px] font-mono text-text-mute">
                                                2
                                            </span>
                                            <span className="flex-1 text-xs text-text">Mike T.</span>
                                            <span className="text-xs font-mono text-text-mute flex items-center gap-1">
                                                28 <Star className="w-3 h-3 fill-current" />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-bg rounded-xl p-4 border border-hairline">
                                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute mb-3">
                                        Critical Tickets
                                    </div>
                                    {!criticalTicket ? (
                                        <div className="text-xs font-mono text-text-mute text-center py-2">
                                            No active P0 alerts.
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.96 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-rose-500/12 border border-rose-500/45 p-2.5 rounded-lg flex items-center justify-between text-xs font-mono text-rose-500"
                                        >
                                            <span className="flex items-center gap-1.5">
                                                <TriangleAlert className="w-3.5 h-3.5" /> TICKET-992
                                            </span>
                                            <span className="font-semibold">P0</span>
                                        </motion.div>
                                    )}
                                </div>
                            </>
                        )}

                        {role === 'kitchen' && (
                            <div className="bg-bg rounded-xl p-4 border border-hairline space-y-4">
                                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute">
                                    Dish Sentiment (24h)
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-text-strong">Truffle Pasta</span>
                                        <span className={`font-mono ${pastaAlert ? 'text-rose-500 font-semibold' : 'text-emerald-500'}`}>
                                            {pastaScore}%
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-panel-strong rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${pastaScore}%` }}
                                            className={`h-full rounded-full ${pastaAlert ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                        />
                                    </div>
                                    {pastaAlert && (
                                        <div className="text-[10px] font-mono text-rose-500 mt-1.5">
                                            Flagged: &quot;Too Salty&quot; (3x in 24h)
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-text-strong">Ribeye Steak</span>
                                        <span className="font-mono text-emerald-500">96%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-panel-strong rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[96%] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {role === 'hq' && (
                            <div className="bg-bg rounded-xl p-4 border border-hairline space-y-3">
                                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute">
                                    Competitor Mentions
                                </div>
                                <div
                                    className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                                        compIntel ? 'bg-rose-500/10 border-rose-500/40' : 'border-transparent'
                                    }`}
                                >
                                    <div className="w-6 h-1.5 bg-rose-500 rounded-full" />
                                    <span className="flex-1 text-xs text-text-strong">PizzaHut</span>
                                    <span className="text-xs font-mono text-text-strong">{compIntel ? '15%' : '12%'}</span>
                                </div>
                                <div className="flex items-center gap-3 p-2">
                                    <div className="w-3.5 h-1.5 bg-sky-500 rounded-full" />
                                    <span className="flex-1 text-xs text-text-mute">Domino&apos;s</span>
                                    <span className="text-xs font-mono text-text-mute">5%</span>
                                </div>
                                {compIntel && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 rounded-lg bg-panel border border-hairline-strong"
                                    >
                                        <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-amber-500 mb-1">
                                            Intel Signal
                                        </div>
                                        <p className="text-xs text-text leading-relaxed">
                                            Cluster of diners citing cheaper lunch combo down the street.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Mobile Nav */}
            <nav className="lg:hidden h-12 bg-panel border-t border-hairline flex justify-around items-center shrink-0">
                {(
                    [
                        { id: 'feed', label: 'Feed', Icon: Globe },
                        { id: 'brain', label: 'Router', Icon: GitBranch },
                        { id: 'dash', label: 'Ops', Icon: BarChart3 },
                    ] as const
                ).map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setMobileTab(id)}
                        className={`flex-1 h-full flex flex-col items-center justify-center text-[10px] font-mono uppercase tracking-[0.14em] border-t-2 ${
                            mobileTab === id ? 'border-amber-500 text-text-strong' : 'border-transparent text-text-mute'
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

export default ReviewFlowDemo;
