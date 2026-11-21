import { useState, useEffect, useRef, type ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Cpu,
    FolderOpen,
    Bell,
    Scale,
    BrainCircuit,
    Send,
    Building2,
    RotateCcw,
    Check,
    Gavel,
    FileText,
    CalendarX,
    Mail,
    Reply,
    Plane,
    AlertTriangle,
    Play,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../lib/motion/usePrefersReducedMotion';

type ScenarioType = 'success' | 'rebuttal' | 'fail';

interface LogItem {
    id: string;
    title: string;
    desc: string;
    tone: 'neutral' | 'ok' | 'warn' | 'err' | 'accent';
}

interface EvidenceItem {
    id: string;
    icon: ComponentType<{ className?: string }>;
    name: string;
    tag: string;
}

const ACCENT = '#8b5cf6';

export default function CollectionsDemo() {
    const reduced = usePrefersReducedMotion();
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
    const [confidence, setConfidence] = useState<string>('--');
    const [isRunning, setIsRunning] = useState(false);
    const [outcome, setOutcome] = useState<'success' | 'fail' | null>(null);
    const [showRebuttal, setShowRebuttal] = useState(false);

    const logsContainerRef = useRef<HTMLDivElement>(null);
    const runIdRef = useRef(0);

    useEffect(() => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = (title: string, desc: string, tone: LogItem['tone'] = 'neutral') => {
        setLogs((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, title, desc, tone }]);
    };

    const addEvidence = (icon: ComponentType<{ className?: string }>, name: string, tag: string) => {
        setEvidence((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, icon, name, tag }]);
    };

    const runScenario = async (type: ScenarioType) => {
        const myRun = runIdRef.current + 1;
        runIdRef.current = myRun;
        const cancelled = () => runIdRef.current !== myRun;
        const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 100) : ms));

        setIsRunning(true);
        setSelectedScenario(type);
        setLogs([]);
        setEvidence([]);
        setConfidence('--');
        setActiveNode(null);
        setOutcome(null);
        setShowRebuttal(false);

        // 1. Trigger
        addLog('TRIGGER', "Webhook detected VCC Transaction #882190 charged by 'Grand Hotel Plaza'.");
        addEvidence(FileText, 'VCC_Statement.csv', 'SOURCE');
        setActiveNode('trigger');
        await wait(650);
        if (cancelled()) return;

        // 2. Analyst
        setActiveNode('analyst');
        addLog('POLICY CHECK', 'Booking #BK-99201 cancelled Oct 20 (24h prior to check-in).', 'accent');
        addLog('VERDICT', "Policy allows free cancellation until Oct 21. Charge is INVALID.", 'ok');
        setConfidence('99.8%');
        addEvidence(CalendarX, 'Booking_Log.json', 'PMS');
        await wait(950);
        if (cancelled()) return;

        // 3. Strategist
        setActiveNode('strategy');
        addLog('PARTNER TIER', 'Silver Partner. 2 prior disputes (100% win rate).');
        addLog('STRATEGY', "Tone: FIRM_PROFESSIONAL · Template_B_Overcharge_Notice.", 'accent');
        await wait(950);
        if (cancelled()) return;

        // 4. Action
        setActiveNode('action');
        addLog('DISPATCH', 'Sending dispute dossier to reservations@grandhotelplaza.com...');
        addEvidence(Mail, 'Dispute_Email_Draft.eml', 'OUTBOX');
        await wait(800);
        if (cancelled()) return;

        // 5. Hotel
        setActiveNode('hotel');
        addLog('AWAITING REPLY', 'Monitoring IMAP thread for partner response...');
        await wait(1200);
        if (cancelled()) return;

        if (type === 'success') {
            addLog('REPLY RECEIVED', "Grand Hotel Plaza: 'Apologies, accounting error. Refund processed.'", 'ok');
            addEvidence(Reply, 'Hotel_Reply.eml', 'INBOX');
            setActiveNode('outcome-success');
            setOutcome('success');
            addLog('CLOSED', 'Refund verified in VCC ledger. Recovered $450.00.', 'ok');
        } else if (type === 'rebuttal') {
            setActiveNode('hotel-error');
            addLog('REPLY RECEIVED', "Grand Hotel Plaza: 'Guest did not arrive. No-Show fee applies.'", 'err');
            await wait(600);
            if (cancelled()) return;

            setShowRebuttal(true);
            setActiveNode('rebuttal');
            addLog('AI REBUTTAL', "Checking Force Majeure & flight disruption APIs...", 'warn');
            await wait(850);
            if (cancelled()) return;

            addEvidence(Plane, 'Flight_Status_UA882.json', 'EXT API');
            addLog('EVIDENCE FOUND', 'Flight UA882 (SFO -> JFK) cancelled due to severe weather.', 'accent');
            addLog('COUNTER-EMAIL', 'Citing contract clause 4.2 weather waiver with flight record.');
            await wait(800);
            if (cancelled()) return;

            setActiveNode('hotel');
            addLog('PARTNER WAIVER', "'Understood. Fee waived and credit issued.'", 'ok');
            await wait(700);
            if (cancelled()) return;

            setActiveNode('outcome-success');
            setOutcome('success');
            addLog('CLOSED', 'Waiver confirmed in VCC ledger. Recovered $450.00.', 'ok');
        } else {
            addLog('SLA TIMEOUT', 'No reply received within 48h window. Escalating.', 'err');
            await wait(550);
            if (cancelled()) return;
            setActiveNode('outcome-fail');
            setOutcome('fail');
            addLog('CHARGEBACK FILED', 'Initiated VCC Chargeback (Reason Code 4837 - No Credit Processed).', 'err');
        }

        setIsRunning(false);
    };

    const nodes = [
        { id: 'trigger', icon: Bell, title: 'VCC Overcharge Detected', subtitle: 'Charge: $450 · Status: Cancelled', badge: null },
        { id: 'analyst', icon: Scale, title: 'Policy Validation', subtitle: 'Matching timestamp vs. contract rules', badge: 'AI ANALYST' },
        { id: 'strategy', icon: BrainCircuit, title: 'Strategy Engine', subtitle: 'Selecting negotiation tone & tier', badge: 'STRATEGIST' },
        { id: 'action', icon: Send, title: 'Execute Action', subtitle: 'Dispatching evidence dossier', badge: null },
        { id: 'hotel', icon: Building2, title: 'External Hotel', subtitle: 'Monitoring partner inbox thread', badge: null, dashed: true },
    ];

    return (
        <div className="min-h-[680px] lg:h-[740px] flex flex-col font-sans bg-bg text-text overflow-hidden">
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
                            Cognitive Collections <span className="font-serif italic" style={{ color: ACCENT }}>AI</span>
                        </div>
                        <div className="text-[10px] text-text-mute font-mono tracking-[0.18em] uppercase">
                            Autonomous Dispute Agent v3.0
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-6 text-[11px] font-mono">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-text-mute uppercase tracking-[0.16em]">Case ID</span>
                        <span className="text-text-strong font-medium">#BK-99201</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-text-mute uppercase tracking-[0.16em]">Dispute</span>
                        <span className="text-text-strong font-medium">$450.00</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] text-text-mute uppercase tracking-[0.16em]">Confidence</span>
                        <span className={confidence !== '--' ? 'text-emerald-500 font-semibold' : 'text-text-mute'}>
                            {confidence}
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* LEFT: AI Reasoning Log + Evidence */}
                <aside className="w-full lg:w-[320px] border-b lg:border-b-0 lg:border-r border-hairline bg-panel/40 flex flex-col shrink-0 max-h-[340px] lg:max-h-none">
                    <div className="px-4 py-3 border-b border-hairline flex justify-between items-center shrink-0">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong flex items-center gap-2">
                            <Cpu className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                            Reasoning Trace
                        </h3>
                        <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {isRunning ? 'RUNNING' : 'READY'}
                        </span>
                    </div>

                    <div ref={logsContainerRef} className="flex-1 p-4 space-y-3 overflow-y-auto">
                        {logs.length === 0 && (
                            <div className="text-text-mute text-xs font-mono text-center mt-8">
                                Select a dispute scenario to watch the autonomous recovery loop.
                            </div>
                        )}
                        <AnimatePresence initial={false}>
                            {logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="border-l border-violet-500/50 pl-2.5"
                                >
                                    <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-violet-500 mb-0.5">
                                        {log.title}
                                    </div>
                                    <div
                                        className={`text-xs leading-relaxed ${
                                            log.tone === 'ok'
                                                ? 'text-emerald-500'
                                                : log.tone === 'err'
                                                  ? 'text-rose-500'
                                                  : log.tone === 'warn'
                                                    ? 'text-amber-500'
                                                    : log.tone === 'accent'
                                                      ? 'text-text-strong'
                                                      : 'text-text'
                                        }`}
                                    >
                                        {log.desc}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <div className="h-[150px] border-t border-hairline bg-panel flex flex-col shrink-0">
                        <div className="px-4 py-2 border-b border-hairline text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute flex items-center gap-2">
                            <FolderOpen className="w-3 h-3" /> Gathered Evidence ({evidence.length})
                        </div>
                        <div className="flex-1 p-3 overflow-y-auto space-y-1.5">
                            <AnimatePresence initial={false}>
                                {evidence.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 bg-bg px-2.5 py-1.5 rounded-lg border border-hairline"
                                        >
                                            <Icon className="text-text-mute w-3.5 h-3.5 shrink-0" />
                                            <span className="text-xs font-mono text-text-strong truncate flex-1">{item.name}</span>
                                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-hairline text-text-mute">
                                                {item.tag}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </div>
                </aside>

                {/* CENTER: Live State Graph */}
                <section className="flex-1 bg-bg relative overflow-y-auto p-5 flex flex-col items-center justify-between">
                    <div
                        className="absolute inset-0 opacity-[0.12] pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-text-mute) 1px, transparent 0)',
                            backgroundSize: '26px 26px',
                        }}
                    />

                    <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-3 my-auto">
                        {nodes.map((node, idx) => {
                            const Icon = node.icon;
                            const isActive = activeNode === node.id;
                            const isHotelError = node.id === 'hotel' && activeNode === 'hotel-error';
                            return (
                                <div key={node.id} className="w-full flex flex-col items-center">
                                    {idx > 0 && <div className="w-[2px] h-3 bg-hairline-strong" />}
                                    <motion.div
                                        animate={isActive && !reduced ? { scale: 1.02 } : { scale: 1 }}
                                        className={`relative w-full rounded-xl border p-3 flex items-center gap-3 transition-colors ${
                                            node.dashed ? 'border-dashed' : ''
                                        } ${
                                            isHotelError
                                                ? 'border-rose-500/60 bg-rose-500/[0.08]'
                                                : isActive
                                                  ? 'border-violet-500/60 bg-violet-500/[0.08]'
                                                  : 'border-hairline bg-panel/70'
                                        }`}
                                    >
                                        {node.badge && (
                                            <span
                                                className={`absolute -top-2 right-3 text-[9px] font-mono uppercase tracking-[0.14em] px-2 py-0.5 rounded border ${
                                                    isActive
                                                        ? 'bg-text-strong text-bg border-text-strong'
                                                        : 'bg-bg text-text-mute border-hairline'
                                                }`}
                                            >
                                                {node.badge}
                                            </span>
                                        )}
                                        <div
                                            className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
                                                isHotelError
                                                    ? 'border-rose-500 text-rose-500 bg-rose-500/15'
                                                    : isActive
                                                      ? 'border-violet-500 text-violet-500 bg-violet-500/15'
                                                      : 'border-hairline bg-bg text-text-mute'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-xs font-medium text-text-strong truncate">{node.title}</div>
                                            <div className="text-[11px] font-mono text-text-mute truncate">{node.subtitle}</div>
                                        </div>
                                    </motion.div>
                                </div>
                            );
                        })}

                        {/* Conditional AI Rebuttal Branch */}
                        <AnimatePresence>
                            {showRebuttal && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="w-full rounded-xl border border-amber-500/50 bg-amber-500/[0.08] p-3 flex items-center gap-3"
                                >
                                    <div className="w-9 h-9 rounded-lg border border-amber-500/50 bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                                        <RotateCcw className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs font-medium text-text-strong">AI Rebuttal Loop</div>
                                        <div className="text-[11px] font-mono text-amber-500 truncate">
                                            Attached Flight UA882 Weather Waiver -&gt; Re-sent to Hotel
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Outcome Pair */}
                        <div className="grid grid-cols-2 gap-3 w-full pt-2">
                            <div
                                className={`rounded-xl border p-3 flex items-center gap-2.5 transition-all ${
                                    outcome === 'success'
                                        ? 'border-emerald-500/60 bg-emerald-500/10 opacity-100'
                                        : 'border-hairline bg-panel/40 opacity-45'
                                }`}
                            >
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                        outcome === 'success'
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-bg border border-hairline text-text-mute'
                                    }`}
                                >
                                    <Check className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-text-strong">Refunded</div>
                                    <div className="text-[10px] font-mono text-text-mute">$450 Recovered</div>
                                </div>
                            </div>

                            <div
                                className={`rounded-xl border p-3 flex items-center gap-2.5 transition-all ${
                                    outcome === 'fail'
                                        ? 'border-rose-500/60 bg-rose-500/10 opacity-100'
                                        : 'border-hairline bg-panel/40 opacity-45'
                                }`}
                            >
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                        outcome === 'fail'
                                            ? 'bg-rose-500 text-white'
                                            : 'bg-bg border border-hairline text-text-mute'
                                    }`}
                                >
                                    <Gavel className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-text-strong">Chargeback</div>
                                    <div className="text-[10px] font-mono text-text-mute">Code 4837 Filed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* RIGHT: Scenario Launcher */}
                <aside className="w-full lg:w-[260px] border-t lg:border-t-0 lg:border-l border-hairline bg-panel/40 p-4 flex flex-col justify-between shrink-0">
                    <div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-mute mb-3">
                            Simulate Outcome
                        </div>
                        <div className="space-y-2.5">
                            {(
                                [
                                    {
                                        id: 'success',
                                        code: 'SCENARIO A',
                                        title: 'Hotel Agrees',
                                        sub: 'Full refund processed',
                                        accent: '#10b981',
                                        Icon: Play,
                                    },
                                    {
                                        id: 'rebuttal',
                                        code: 'SCENARIO B',
                                        title: 'Hotel Denies (No-Show)',
                                        sub: 'Triggers AI Rebuttal loop',
                                        accent: '#f59e0b',
                                        Icon: RotateCcw,
                                    },
                                    {
                                        id: 'fail',
                                        code: 'SCENARIO C',
                                        title: 'Hotel Ignores (48h)',
                                        sub: 'Auto-files VCC chargeback',
                                        accent: '#f43f5e',
                                        Icon: AlertTriangle,
                                    },
                                ] as const
                            ).map(({ id, code, title, sub, accent, Icon }) => {
                                const active = selectedScenario === id;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => runScenario(id)}
                                        disabled={isRunning}
                                        data-cursor="play"
                                        className={`w-full p-3.5 rounded-xl border text-left transition-all disabled:opacity-50 ${
                                            active
                                                ? 'border-hairline-strong bg-panel-strong'
                                                : 'border-hairline bg-bg hover:border-hairline-strong'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: accent }}>
                                                {code}
                                            </span>
                                            <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
                                        </div>
                                        <div className="text-xs font-medium text-text-strong">{title}</div>
                                        <div className="text-[11px] text-text-mute mt-0.5">{sub}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-hairline text-[10px] font-mono text-text-mute text-center tracking-[0.14em] uppercase">
                        LangGraph · Stateful Recovery
                    </div>
                </aside>
            </main>
        </div>
    );
}
