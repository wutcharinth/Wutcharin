import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Cpu,
    FolderOpen,
    Zap,
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
    AlertTriangle
} from 'lucide-react';

// Types
type ScenarioType = 'success' | 'rebuttal' | 'fail';

type LogItem = {
    id: string;
    title: string;
    desc: string;
    colorClass: string;
};

type EvidenceItem = {
    id: string;
    icon: any;
    name: string;
    tag: string;
};

export default function CollectionsDemo() {
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
    const [confidence, setConfidence] = useState<string>('--');
    const [isRunning, setIsRunning] = useState(false);
    const [packetState, setPacketState] = useState<{ target: string | null, visible: boolean }>({ target: null, visible: false });
    const [outcome, setOutcome] = useState<'success' | 'fail' | null>(null);
    const [showRebuttal, setShowRebuttal] = useState(false);

    const logsEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const addLog = (title: string, desc: string, colorClass: string = "text-slate-300") => {
        setLogs(prev => [...prev, { id: Math.random().toString(), title, desc, colorClass }]);
    };

    const addEvidence = (icon: any, name: string, tag: string) => {
        setEvidence(prev => [...prev, { id: Math.random().toString(), icon, name, tag }]);
    };

    const runScenario = async (type: ScenarioType) => {
        if (isRunning) return;
        setIsRunning(true);
        setLogs([]);
        setEvidence([]);
        setConfidence('--');
        setActiveNode(null);
        setOutcome(null);
        setShowRebuttal(false);
        setPacketState({ target: null, visible: false });

        // 1. Trigger
        addLog("TRIGGER", "Webhook detected new VCC Transaction ID: 882190");
        addEvidence(FileText, "VCC_Statement.csv", "SOURCE");
        setActiveNode('trigger');
        await new Promise(r => setTimeout(r, 800));

        // 2. Analyst
        setPacketState({ target: 'analyst', visible: true });
        await new Promise(r => setTimeout(r, 800)); // Travel time
        setActiveNode('analyst');

        addLog("POLICY CHECK", "Cancellation Date: Oct 20 | Policy Deadline: Oct 21", "text-white");
        addLog("LOGIC RESULT", "Cancellation was VALID. Charge is INVALID.", "text-green-400");
        setConfidence("98%");
        addEvidence(CalendarX, "Booking_Log.json", "PMS");
        await new Promise(r => setTimeout(r, 1200));

        // 3. Strategist
        setPacketState({ target: 'strategy', visible: true });
        await new Promise(r => setTimeout(r, 800));
        setActiveNode('strategy');

        addLog("RELATIONSHIP CHECK", "Hotel Tier: Standard Partner. History: 2 previous disputes (Resolved).");
        addLog("STRATEGY", "Select Tone: FIRM_PROFESSIONAL. Use Template B.", "text-violet-300");
        await new Promise(r => setTimeout(r, 1200));

        // 4. Action
        setPacketState({ target: 'action', visible: true });
        await new Promise(r => setTimeout(r, 800));
        setActiveNode('action');

        addLog("GENERATION", "Drafting email with GPT-4o...");
        addEvidence(Mail, "Dispute_Email_Draft.eml", "OUTBOX");
        await new Promise(r => setTimeout(r, 1000));

        // 5. Hotel
        setPacketState({ target: 'hotel', visible: true });
        await new Promise(r => setTimeout(r, 800));
        setActiveNode('hotel');
        addLog("WAITING", "Email sent. Listening for reply...", "text-slate-500 italic");
        await new Promise(r => setTimeout(r, 2000));

        // Branching
        if (type === 'success') {
            addLog("REPLY RECEIVED", "Hotel: 'Apologies, we processed refund.'", "text-green-400");
            addEvidence(Reply, "Hotel_Reply.eml", "INBOX");

            setPacketState({ target: 'outcome-success', visible: true });
            await new Promise(r => setTimeout(r, 800));
            setActiveNode('outcome-success');
            setOutcome('success');
            addLog("CONCLUSION", "Case Closed. Recovered $450.", "text-green-400 font-bold");

        } else if (type === 'rebuttal') {
            setActiveNode('hotel-error'); // Visual state for negative reply
            addLog("REPLY RECEIVED", "Hotel: 'Guest was No-Show. Charge valid.'", "text-red-400");

            // Rebuttal Loop
            setShowRebuttal(true);
            setPacketState({ target: 'rebuttal', visible: true });
            await new Promise(r => setTimeout(r, 800));
            setActiveNode('rebuttal');

            addLog("AI REBUTTAL", "Claim: 'No Show'. Action: Check Guest Flight Data.", "text-yellow-400");
            await new Promise(r => setTimeout(r, 1000));

            addEvidence(Plane, "Flight_Status_Api.json", "EXTERNAL");
            addLog("EVIDENCE FOUND", "Flight UA882 was cancelled. Guest could not arrive.", "text-white");
            addLog("AUTO-REPLY", "Sending Rebuttal: 'Force Majeure policy applies due to flight cancellation.'");

            // Loop back
            setPacketState({ target: 'hotel-return', visible: true }); // Special target for return trip
            await new Promise(r => setTimeout(r, 800));
            setActiveNode('hotel');

            addLog("HOTEL RESPONSE", "Hotel: 'Understood. Refund processed.'", "text-green-400");
            await new Promise(r => setTimeout(r, 1000));

            setPacketState({ target: 'outcome-success', visible: true });
            await new Promise(r => setTimeout(r, 800));
            setActiveNode('outcome-success');
            setOutcome('success');

        } else { // Fail
            addLog("TIMEOUT", "No response for 48 hours.", "text-red-400");
            setPacketState({ target: 'outcome-fail', visible: true });
            await new Promise(r => setTimeout(r, 800));
            setActiveNode('outcome-fail');
            setOutcome('fail');
            addLog("ESCALATION", "Initiating VCC Chargeback (Code 4837).", "text-red-400 font-bold");
        }

        setIsRunning(false);
    };

    // Animation Variants
    const packetVariants = {
        initial: { opacity: 0, top: '10%', left: '50%', x: '-50%' },
        trigger: { opacity: 1, top: '10%', left: '50%', x: '-50%' },
        analyst: { opacity: 1, top: '22%', left: '50%', x: '-50%' },
        strategy: { opacity: 1, top: '34%', left: '50%', x: '-50%' },
        action: { opacity: 1, top: '46%', left: '50%', x: '-50%' },
        hotel: { opacity: 1, top: '58%', left: '50%', x: '-50%' },
        rebuttal: { opacity: 1, top: '70%', left: '70%', x: '-50%' }, // Offset for rebuttal
        'hotel-return': { opacity: 1, top: '58%', left: '50%', x: '-50%' },
        'outcome-success': { opacity: 1, top: '85%', left: '35%', x: '-50%' },
        'outcome-fail': { opacity: 1, top: '85%', left: '65%', x: '-50%' }
    };

    return (
        <div className="w-full h-[800px] bg-[#0F172A] rounded-xl overflow-hidden flex border border-slate-700 shadow-2xl font-sans relative">

            {/* Header Overlay */}
            <div className="absolute top-0 left-0 w-full h-16 bg-slate-900/90 border-b border-slate-700 flex items-center justify-between px-6 z-50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
                        <Brain className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-white tracking-tight text-sm">Cognitive Collections <span className="text-violet-400">AI</span></h1>
                        <div className="text-[10px] text-slate-400 font-mono tracking-widest">AUTONOMOUS DISPUTE AGENT v3.0</div>
                    </div>
                </div>
                <div className="flex gap-8 text-xs font-mono hidden md:flex">
                    <div className="flex flex-col items-end">
                        <span className="text-slate-500">CASE ID</span>
                        <span className="text-white font-bold">#BK-99201</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-slate-500">DISPUTE AMOUNT</span>
                        <span className="text-white font-bold">$450.00</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-slate-500">AI CONFIDENCE</span>
                        <span className={`font-bold ${confidence !== '--' ? 'text-green-400' : 'text-slate-500'}`}>{confidence}</span>
                    </div>
                </div>
            </div>

            {/* LEFT: AI Brain */}
            <aside className="w-[350px] bg-[#0B1120] border-r border-slate-700 flex flex-col z-20 pt-16">
                <div className="p-4 border-b border-slate-700 bg-slate-900 flex justify-between items-center">
                    <h2 className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-2">
                        <Cpu className="w-3 h-3" /> AI Reasoning Log
                    </h2>
                    <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] text-slate-400">ACTIVE</span>
                    </div>
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                    {logs.length === 0 && (
                        <div className="text-slate-600 text-xs italic text-center mt-10">Waiting for trigger event...</div>
                    )}
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="border-l-2 border-violet-500 pl-2 mb-2"
                            >
                                <div className="text-[10px] font-bold text-violet-400 uppercase mb-1">{log.title}</div>
                                <div className={`text-xs ${log.colorClass}`} dangerouslySetInnerHTML={{ __html: log.desc }}></div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div ref={logsEndRef} />
                </div>

                {/* Evidence Drawer */}
                <div className="h-1/3 border-t border-slate-700 bg-slate-900/50 flex flex-col">
                    <div className="p-3 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                        <FolderOpen className="w-3 h-3" /> Gathered Evidence
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto space-y-2 custom-scrollbar">
                        <AnimatePresence>
                            {evidence.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700"
                                >
                                    <item.icon className="text-slate-400 w-3 h-3" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-white truncate">{item.name}</div>
                                    </div>
                                    <span className="text-[9px] bg-slate-700 px-1 rounded text-slate-300">{item.tag}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </aside>

            {/* CENTER: Flow */}
            <section className="flex-1 bg-[#0F172A] relative overflow-hidden pt-24 pb-10 flex flex-col items-center">

                {/* Connection Line */}
                <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-800 transform -translate-x-1/2 z-0"></div>

                {/* Data Packet */}
                <motion.div
                    className="absolute w-8 h-8 bg-white rounded-full shadow-[0_0_20px_white] z-30 flex items-center justify-center text-violet-900"
                    variants={packetVariants}
                    initial="initial"
                    animate={packetState.target || "initial"}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ opacity: packetState.visible ? 1 : 0 }}
                >
                    <Zap className="w-4 h-4 fill-current" />
                </motion.div>

                {/* Nodes */}
                <div className="flex flex-col items-center w-full h-full justify-between py-4 z-10">

                    {/* 1. Trigger */}
                    <Node
                        active={activeNode === 'trigger'}
                        icon={Bell}
                        color="red"
                        title="VCC Overcharge Detected"
                        subtitle="Charge: $450 | Status: Cancelled"
                    />

                    {/* 2. Analyst */}
                    <Node
                        active={activeNode === 'analyst'}
                        icon={Scale}
                        color="violet"
                        title="Policy Validation"
                        subtitle="Matching Timestamp vs. Rules"
                        badge="AI ANALYST"
                    />

                    {/* 3. Strategist */}
                    <Node
                        active={activeNode === 'strategy'}
                        icon={BrainCircuit}
                        color="blue"
                        title="Strategy Engine"
                        subtitle="Determine Tone & Urgency"
                        badge="AI STRATEGIST"
                    />

                    {/* 4. Action */}
                    <Node
                        active={activeNode === 'action'}
                        icon={Send}
                        color="slate"
                        title="Execute Action"
                        subtitle="Send Dispute Email"
                    />

                    {/* 5. Hotel */}
                    <Node
                        active={activeNode === 'hotel'}
                        error={activeNode === 'hotel-error'}
                        icon={Building2}
                        color="slate"
                        title="External Hotel"
                        subtitle="Waiting for reply..."
                        dashed
                    />

                    {/* 6. Rebuttal (Conditional) */}
                    <AnimatePresence>
                        {showRebuttal && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute top-[70%] left-[65%] transform -translate-x-1/2 w-[260px]"
                            >
                                <Node
                                    active={activeNode === 'rebuttal'}
                                    icon={RotateCcw}
                                    color="yellow"
                                    title="Counter-Argument"
                                    subtitle="Fetching New Evidence..."
                                    badge="AI REBUTTAL"
                                />
                                {/* Loop Line */}
                                <svg className="absolute top-1/2 right-full w-12 h-24 -translate-y-1/2 pointer-events-none overflow-visible">
                                    <path d="M 0 0 C -20 0, -20 -100, 0 -100" fill="none" stroke="#EAB308" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 7. Outcome */}
                    <div className="flex gap-8 mt-auto">
                        <div className={`transition-all duration-500 ${outcome === 'success' ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                            <div className={`w-40 p-3 rounded-xl border ${outcome === 'success' ? 'bg-green-900/20 border-green-500' : 'bg-slate-800 border-slate-700'} flex flex-col items-center gap-2`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${outcome === 'success' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                                    <Check className="w-4 h-4" />
                                </div>
                                <div className={`text-xs font-bold ${outcome === 'success' ? 'text-green-400' : 'text-slate-500'}`}>Refunded</div>
                            </div>
                        </div>
                        <div className={`transition-all duration-500 ${outcome === 'fail' ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                            <div className={`w-40 p-3 rounded-xl border ${outcome === 'fail' ? 'bg-red-900/20 border-red-500' : 'bg-slate-800 border-slate-700'} flex flex-col items-center gap-2`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${outcome === 'fail' ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                                    <Gavel className="w-4 h-4" />
                                </div>
                                <div className={`text-xs font-bold ${outcome === 'fail' ? 'text-red-400' : 'text-slate-500'}`}>Chargeback</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* RIGHT: Controls */}
            <aside className="w-[250px] bg-[#0B1120] border-l border-slate-700 p-6 flex flex-col justify-center z-20 pt-16">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">Run Simulation</h3>

                <div className="space-y-4">
                    <button
                        onClick={() => runScenario('success')}
                        disabled={isRunning}
                        className="w-full py-4 bg-slate-800 hover:bg-green-900/20 border border-slate-700 hover:border-green-500 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-left px-4 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="text-[10px] text-slate-400 group-hover:text-green-400 font-bold mb-1">SCENARIO A</div>
                        <div className="text-xs font-bold text-white">Hotel Agrees</div>
                    </button>

                    <button
                        onClick={() => runScenario('rebuttal')}
                        disabled={isRunning}
                        className="w-full py-4 bg-slate-800 hover:bg-yellow-900/20 border border-slate-700 hover:border-yellow-500 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-left px-4 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="text-[10px] text-slate-400 group-hover:text-yellow-400 font-bold mb-1">SCENARIO B</div>
                        <div className="text-xs font-bold text-white">Hotel Denies (No Show)</div>
                        <div className="text-[9px] text-violet-400 mt-1 flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Triggers AI Rebuttal</div>
                    </button>

                    <button
                        onClick={() => runScenario('fail')}
                        disabled={isRunning}
                        className="w-full py-4 bg-slate-800 hover:bg-red-900/20 border border-slate-700 hover:border-red-500 rounded-xl transition-all group disabled:opacity-50 disabled:cursor-not-allowed text-left px-4 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        <div className="text-[10px] text-slate-400 group-hover:text-red-400 font-bold mb-1">SCENARIO C</div>
                        <div className="text-xs font-bold text-white">Hotel Ignores</div>
                        <div className="text-[9px] text-red-400 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Auto-Chargeback</div>
                    </button>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-800">
                    <div className="text-[9px] text-slate-500 text-center font-mono">
                        POWERED BY LANGGRAPH<br />GPT-4o & CLAUDE 3.5
                    </div>
                </div>
            </aside>
        </div>
    );
}

// Sub-component for Node
function Node({ active, error, icon: Icon, color, title, subtitle, badge, dashed }: any) {
    const colorMap: any = {
        red: { bg: 'bg-red-900/10', border: 'border-red-500/30', iconBg: 'bg-red-500/20', iconText: 'text-red-400', glow: 'shadow-[0_0_25px_rgba(239,68,68,0.3)]' },
        violet: { bg: 'bg-violet-900/10', border: 'border-violet-500/30', iconBg: 'bg-violet-500/20', iconText: 'text-violet-400', glow: 'shadow-[0_0_25px_rgba(139,92,246,0.3)]' },
        blue: { bg: 'bg-blue-900/10', border: 'border-blue-500/30', iconBg: 'bg-blue-500/20', iconText: 'text-blue-400', glow: 'shadow-[0_0_25px_rgba(59,130,246,0.3)]' },
        yellow: { bg: 'bg-yellow-900/10', border: 'border-yellow-500/30', iconBg: 'bg-yellow-500/20', iconText: 'text-yellow-400', glow: 'shadow-[0_0_25px_rgba(234,179,8,0.3)]' },
        slate: { bg: 'bg-[#1E293B]', border: 'border-slate-700', iconBg: 'bg-slate-700', iconText: 'text-slate-300', glow: 'shadow-[0_0_25px_rgba(148,163,184,0.3)]' },
    };

    const style = colorMap[color] || colorMap.slate;
    const isActive = active;
    const isError = error;

    return (
        <div className={`
            relative w-[260px] min-h-[70px] rounded-xl border flex items-center p-3 gap-3 transition-all duration-500
            ${dashed ? 'border-dashed' : 'border-solid'}
            ${isActive ? `${style.bg} ${style.border} scale-105 ${style.glow}` : 'bg-[#1E293B] border-slate-700'}
            ${isError ? 'bg-red-900/10 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)]' : ''}
        `}>
            {badge && (
                <div className={`absolute -top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded text-white shadow-sm ${isActive ? 'bg-violet-500' : 'bg-slate-600'}`}>
                    {badge}
                </div>
            )}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${isActive ? `${style.iconBg} ${style.iconText} ${style.border}` : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>{title}</div>
                <div className="text-[10px] text-slate-500 truncate">{subtitle}</div>
            </div>
        </div>
    );
}
