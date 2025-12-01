import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone,
    Signal,
    Wifi,
    BatteryFull,
    ChevronLeft,
    Menu,
    Store,
    Building2,
    Plus,
    Mic,
    CheckCircle,
    EyeOff,
    TriangleAlert,
    Expand,
    ShieldAlert,
    Database,
    GitFork,
    Check,
    UserCog,
    Terminal,
    Hand,
    X
} from 'lucide-react';

// --- Types ---
type NodeType = 'ocr' | 'fraud' | 'db' | 'router' | 'success' | 'human';
type ScenarioType = 'clean' | 'blurry' | 'fraud';
type LogType = { id: number; msg: string; type: 'info' | 'success' | 'error' | 'warn'; time: string };

// --- Code Snippets ---
const CODE_SNIPPETS = {
    ocr: `def ocr_extraction_node(state: PaymentState):
    # Extract text from Thai Bank Slip
    image = load_image(state["slip_url"])
    result = ocr_model.predict(image)
    
    if result.confidence < 0.85:
        return {
            "extraction_confidence": result.confidence,
            "is_readable": False
        }
    
    return {
        "amount": result.amount,
        "sender": result.sender_name,
        "is_readable": True
    }`,
    fraud: `def fraud_check_node(state: PaymentState):
    # Check for duplicate transaction IDs (Replay Attack)
    exists = db.query(f"SELECT * FROM txns WHERE id = '{state['txn_id']}'")
    
    if exists:
        return { "is_fraud": True, "risk_score": 1.0 }
        
    # Check sender blacklist
    if state["sender"] in BLACKLIST:
         return { "is_fraud": True, "risk_score": 0.9 }
         
    return { "is_fraud": False, "risk_score": 0.0 }`,
    db: `class BankDatabase:
    def lookup_txn(self, txn_id):
        # Connect to secure replica
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM payments WHERE id=%s", (txn_id,))
            return cur.fetchone()`
};

const SlipVerifyDemo = () => {
    // --- State ---
    const [nodeStatus, setNodeStatus] = useState<Record<NodeType, 'idle' | 'active' | 'success' | 'error'>>({
        ocr: 'idle', fraud: 'idle', db: 'idle', router: 'idle', success: 'idle', human: 'idle'
    });
    const [logs, setLogs] = useState<LogType[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [jsonState, setJsonState] = useState<any>({ status: "IDLE", txn_id: null });
    const [packetPos, setPacketPos] = useState({ x: '0%', y: '50%', opacity: 0 });
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalReason, setModalReason] = useState("");
    const [slipVisible, setSlipVisible] = useState(false);
    const [slipBlurry, setSlipBlurry] = useState(false);
    const [laserActive, setLaserActive] = useState(false);
    const [showCodeOverlay, setShowCodeOverlay] = useState(false);
    const [currentCode, setCurrentCode] = useState<{ title: string, content: string } | null>(null);

    const terminalRef = useRef<HTMLDivElement>(null);

    // --- Helpers ---
    const addLog = (msg: string, type: LogType['type'] = 'info') => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev, { id: Date.now(), msg, type, time }]);
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    const resetSimulation = () => {
        setNodeStatus(prev => ({ ...prev, ocr: 'idle', fraud: 'idle', db: 'idle', router: 'idle', success: 'idle', human: 'idle' }));
        setPacketPos({ x: '0%', y: '50%', opacity: 0 });
        setSlipVisible(false);
        setSlipBlurry(false);
        setLaserActive(false);
        setShowModal(false);
    };

    const movePacket = async (x: string, y: string, duration = 800) => {
        setPacketPos({ x, y, opacity: 1 });
        await new Promise(r => setTimeout(r, duration));
    };

    const runScenario = async (type: ScenarioType) => {
        if (isSimulationRunning) return;
        setIsSimulationRunning(true);
        resetSimulation();

        // Initial State
        setJsonState({ status: "IDLE", txn_id: null });
        addLog("User uploading slip...", "info");

        // 1. Upload Animation
        await new Promise(r => setTimeout(r, 500));
        setSlipVisible(true);
        if (type === 'blurry') setSlipBlurry(true);

        // 2. Start Workflow
        addLog("Webhook received. Triggering LangGraph.", "info");
        setJsonState({ status: "PROCESSING", slip_id: "SLIP_992", txn_id: null });

        // Move to OCR
        await movePacket('10%', '50%');
        setNodeStatus(prev => ({ ...prev, ocr: 'active' }));

        addLog("Node: OCR Extractor running...", "warn");
        setLaserActive(true);
        await new Promise(r => setTimeout(r, 1500));
        setLaserActive(false);

        if (type === 'blurry') {
            setNodeStatus(prev => ({ ...prev, ocr: 'error' }));
            addLog("OCR Failed: Low Confidence (0.42)", "error");
            setJsonState((prev: any) => ({ ...prev, ocr_confidence: 0.42, extracted: null }));
        } else {
            setNodeStatus(prev => ({ ...prev, ocr: 'success' }));
            addLog("OCR Success: Amount 500.00", "success");
            setJsonState((prev: any) => ({ ...prev, ocr_confidence: 0.99, amount: 500.00 }));
        }

        // Move to Fraud
        await movePacket('30%', '50%');
        setNodeStatus(prev => ({ ...prev, fraud: 'active' }));
        addLog("Node: Fraud Check running...", "warn");

        // DB Query Sim
        await movePacket('30%', '75%', 600);
        setNodeStatus(prev => ({ ...prev, db: 'active' }));
        addLog("DB: Querying txns table...", "info");
        await new Promise(r => setTimeout(r, 500));
        setNodeStatus(prev => ({ ...prev, db: 'idle' }));
        await movePacket('30%', '50%', 600); // Back to Fraud

        if (type === 'fraud') {
            setNodeStatus(prev => ({ ...prev, fraud: 'error' }));
            addLog("Fraud Alert: Duplicate Slip ID found in DB", "error");
            setJsonState((prev: any) => ({ ...prev, risk_score: 1.0, flag: "DUPLICATE" }));
        } else {
            setNodeStatus(prev => ({ ...prev, fraud: 'success' }));
            addLog("Fraud Check Passed.", "success");
            setJsonState((prev: any) => ({ ...prev, risk_score: 0.01, flag: "CLEAN" }));
        }

        // Move to Router
        await movePacket('55%', '50%');
        setNodeStatus(prev => ({ ...prev, router: 'active' }));
        await new Promise(r => setTimeout(r, 500));
        setNodeStatus(prev => ({ ...prev, router: 'idle' }));

        // Final Routing
        if (type === 'clean') {
            addLog("Router: Auto-Approving...", "info");
            await movePacket('75%', '25%');
            setNodeStatus(prev => ({ ...prev, success: 'success' }));
            addLog("Transaction FINALIZED.", "success");
            setJsonState((prev: any) => ({ ...prev, status: "APPROVED", final: true }));
            setIsSimulationRunning(false);
        } else {
            // HITL Scenario
            addLog("Router: Escalating to Human...", "error");
            await movePacket('75%', '75%');
            setNodeStatus(prev => ({ ...prev, human: 'active' }));
            addLog("INTERRUPT: Workflow Paused.", "error");
            setJsonState((prev: any) => ({ ...prev, status: "PAUSED", interrupt: "human_review" }));

            setModalReason(type === 'fraud' ? "Reason: Duplicate Transaction Detected" : "Reason: OCR Confidence Low (Image Blurry)");
            setTimeout(() => setShowModal(true), 500);
        }
    };

    const resolveHumanReview = async (approved: boolean) => {
        setShowModal(false);
        addLog(`Admin Action: ${approved ? 'APPROVED' : 'REJECTED'}`, approved ? 'success' : 'error');

        if (approved) {
            await movePacket('75%', '25%');
            setNodeStatus(prev => ({ ...prev, success: 'success', human: 'idle' }));
            setJsonState((prev: any) => ({ ...prev, status: "APPROVED_BY_ADMIN", final: true }));
        } else {
            setPacketPos(prev => ({ ...prev, opacity: 0 }));
            setNodeStatus(prev => ({ ...prev, human: 'idle' }));
            setJsonState((prev: any) => ({ ...prev, status: "REJECTED", final: true }));
        }
        setIsSimulationRunning(false);
    };

    const openCode = (node: keyof typeof CODE_SNIPPETS) => {
        setCurrentCode({ title: `${node}_node.py`, content: CODE_SNIPPETS[node] });
        setShowCodeOverlay(true);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[800px] bg-[#020617] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Left: Phone UI */}
            <section className="w-full lg:w-[350px] border-r border-slate-800 bg-[#050B14] relative flex flex-col items-center pt-8 z-10 shadow-2xl shrink-0">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center">
                    <Smartphone className="w-3 h-3 mr-2" /> User Experience
                </h2>

                <div className="relative w-[280px] h-[550px] bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-slate-700">
                    {/* Status Bar */}
                    <div className="absolute top-0 w-full h-6 bg-slate-900/90 z-20 flex justify-between px-4 items-center text-[10px] text-white">
                        <span>14:30</span>
                        <div className="flex gap-1"><Signal className="w-3 h-3" /><Wifi className="w-3 h-3" /><BatteryFull className="w-3 h-3" /></div>
                    </div>

                    {/* App Header */}
                    <div className="h-16 bg-[#00C300] flex items-center px-4 pt-4 text-white gap-3 shadow-md relative z-10">
                        <ChevronLeft className="w-5 h-5" />
                        <div className="flex-1">
                            <div className="font-bold text-sm">Coffee Beans Co.</div>
                            <div className="text-[10px] opacity-90">Official Account</div>
                        </div>
                        <Menu className="w-5 h-5" />
                    </div>

                    {/* Chat Area */}
                    <div className="bg-[#8c9eff] h-full flex flex-col p-3 space-y-3 pt-4">
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00C300]"><Store className="w-4 h-4" /></div>
                            <div className="bg-white p-2 rounded-xl rounded-tl-none shadow text-xs text-slate-800 max-w-[80%] leading-relaxed">
                                Order #992 confirmed.<br />Total: <strong>500 THB</strong><br />Please attach slip.
                            </div>
                        </div>

                        <div className="self-start ml-10 bg-white p-2 rounded-lg shadow-sm w-32">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PromptPay-500THB" className="w-full opacity-90" alt="QR" />
                            <div className="text-[8px] text-center text-slate-500 mt-1 font-mono">SCB • 500.00</div>
                        </div>

                        <AnimatePresence>
                            {slipVisible && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="self-end"
                                >
                                    <div className="bg-white p-1 rounded-lg shadow-md border border-slate-200 w-32 relative overflow-hidden group">
                                        {laserActive && (
                                            <motion.div
                                                className="absolute w-full h-[2px] bg-green-500 shadow-[0_0_10px_#10B981] z-20"
                                                animate={{ top: ['0%', '100%'] }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            />
                                        )}

                                        <div className={`h-40 bg-slate-50 flex flex-col items-center justify-center relative p-2 transition-all duration-500 ${slipBlurry ? 'blur-[4px]' : ''}`}>
                                            <div className="w-8 h-8 rounded-full bg-slate-200 mb-2 flex items-center justify-center"><Building2 className="text-slate-400 w-4 h-4" /></div>
                                            <div className="w-20 h-2 bg-slate-200 rounded mb-1"></div>
                                            <div className="w-16 h-2 bg-slate-200 rounded mb-3"></div>
                                            <div className="font-mono text-sm font-bold text-slate-800">฿ 500.00</div>
                                            <div className="text-[8px] text-slate-400 mt-2 font-mono">TXN: 882910</div>
                                        </div>
                                    </div>
                                    <div className="text-[9px] text-slate-500 text-right mt-1">Read 14:32</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Bottom Input */}
                    <div className="absolute bottom-0 w-full h-14 bg-white border-t border-slate-200 flex items-center px-3 justify-between z-20">
                        <Plus className="text-slate-400 w-5 h-5" />
                        <div className="flex-1 mx-2 h-8 bg-slate-100 rounded-full px-3 flex items-center text-xs text-slate-400">Message...</div>
                        <Mic className="text-slate-400 w-5 h-5" />
                    </div>
                </div>

                <div className="absolute bottom-8 flex gap-2 w-full px-6 justify-center">
                    <button
                        onClick={() => runScenario('clean')}
                        disabled={isSimulationRunning}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all hover:-translate-y-1 shadow-lg flex items-center justify-center"
                    >
                        <CheckCircle className="text-green-500 w-4 h-4 mr-1" /> Perfect
                    </button>
                    <button
                        onClick={() => runScenario('blurry')}
                        disabled={isSimulationRunning}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all hover:-translate-y-1 shadow-lg flex items-center justify-center"
                    >
                        <EyeOff className="text-yellow-500 w-4 h-4 mr-1" /> Blurry
                    </button>
                    <button
                        onClick={() => runScenario('fraud')}
                        disabled={isSimulationRunning}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all hover:-translate-y-1 shadow-lg flex items-center justify-center"
                    >
                        <TriangleAlert className="text-red-500 w-4 h-4 mr-1" /> Fraud
                    </button>
                </div>
            </section>

            {/* Center: Graph */}
            <section className="flex-1 bg-[#020617] relative flex flex-col overflow-hidden">
                {/* Modern Grid Background */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/50"></div>

                {/* Animated SVG Lines - Straight & Aligned */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>

                    {/* OCR -> Fraud */}
                    <motion.path
                        d="M 5 50 L 30 50"
                        stroke="url(#lineGradient)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Fraud -> DB */}
                    <motion.path
                        d="M 30 50 L 30 75"
                        stroke="url(#lineGradient)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                    />

                    {/* DB -> Fraud (Return path) */}
                    <motion.path
                        d="M 30 75 L 30 50"
                        stroke="url(#lineGradient)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                    />

                    {/* Fraud -> Router */}
                    <motion.path
                        d="M 30 50 L 55 50"
                        stroke="url(#lineGradient)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.6, ease: "easeInOut" }}
                    />

                    {/* Router -> Success */}
                    <motion.path
                        d="M 55 50 L 75 25"
                        stroke="url(#lineGradient)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                    />

                    {/* Router -> Human */}
                    <motion.path
                        d="M 55 50 L 75 75"
                        stroke="url(#lineGradient)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
                    />
                </svg>

                {/* Data Packet */}
                <motion.div
                    className="absolute w-6 h-6 z-30"
                    animate={{ left: packetPos.x, top: packetPos.y, opacity: packetPos.opacity }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <div className="relative w-full h-full">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-md animate-pulse"></div>
                        <div className="absolute inset-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
                    </div>
                </motion.div>

                {/* Nodes */}
                <div className="relative w-full h-full flex items-center justify-center">

                    {/* OCR Node */}
                    <div
                        className={`absolute left-[5%] top-1/2 -translate-y-1/2 w-36 h-36 rounded-3xl border backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center cursor-pointer group z-20
            ${nodeStatus.ocr === 'active' ? 'border-blue-400/50 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-110' :
                                nodeStatus.ocr === 'error' ? 'border-red-500/50 bg-red-900/20 shadow-[0_0_40px_rgba(239,68,68,0.3)]' :
                                    nodeStatus.ocr === 'success' ? 'border-green-500/50 bg-green-900/20 shadow-[0_0_40px_rgba(34,197,94,0.3)]' : 'border-slate-700/50 bg-slate-900/40 hover:border-slate-600'}`}
                        onClick={() => openCode('ocr')}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${nodeStatus.ocr === 'active' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            <Expand className="w-7 h-7" />
                        </div>
                        <span className="text-sm font-bold text-slate-200 tracking-wide">OCR</span>
                        <span className={`text-[10px] mt-1 font-mono px-2 py-0.5 rounded-full ${nodeStatus.ocr === 'success' ? 'bg-green-500/20 text-green-400' :
                            nodeStatus.ocr === 'error' ? 'bg-red-500/20 text-red-400' :
                                'bg-slate-800 text-slate-500'
                            }`}>
                            {nodeStatus.ocr === 'success' ? '99% CONF' : nodeStatus.ocr === 'error' ? '42% CONF' : 'IDLE'}
                        </span>
                    </div>

                    {/* Fraud Node */}
                    <div
                        className={`absolute left-[30%] top-1/2 -translate-y-1/2 w-36 h-36 rounded-3xl border backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center cursor-pointer group z-20
            ${nodeStatus.fraud === 'active' ? 'border-purple-400/50 bg-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.3)] scale-110' :
                                nodeStatus.fraud === 'error' ? 'border-red-500/50 bg-red-900/20 shadow-[0_0_40px_rgba(239,68,68,0.3)]' :
                                    nodeStatus.fraud === 'success' ? 'border-green-500/50 bg-green-900/20 shadow-[0_0_40px_rgba(34,197,94,0.3)]' : 'border-slate-700/50 bg-slate-900/40 hover:border-slate-600'}`}
                        onClick={() => openCode('fraud')}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${nodeStatus.fraud === 'active' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            <ShieldAlert className="w-7 h-7" />
                        </div>
                        <span className="text-sm font-bold text-slate-200 tracking-wide">Fraud Guard</span>
                        <span className={`text-[10px] mt-1 font-mono px-2 py-0.5 rounded-full ${nodeStatus.fraud === 'success' ? 'bg-green-500/20 text-green-400' :
                            nodeStatus.fraud === 'error' ? 'bg-red-500/20 text-red-400' :
                                'bg-slate-800 text-slate-500'
                            }`}>
                            {nodeStatus.fraud === 'success' ? 'LOW RISK' : nodeStatus.fraud === 'error' ? 'HIGH RISK' : 'IDLE'}
                        </span>
                    </div>

                    {/* DB Node */}
                    <div
                        className={`absolute left-[30%] top-[75%] -translate-y-1/2 w-36 h-24 rounded-2xl border backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center cursor-pointer z-10
            ${nodeStatus.db === 'active' ? 'border-blue-400/50 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] scale-110' : 'border-slate-700/50 bg-slate-900/40 hover:border-slate-600'}`}
                        onClick={() => openCode('db')}
                    >
                        <Database className={`w-6 h-6 mb-2 ${nodeStatus.db === 'active' ? 'text-blue-400' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold text-slate-300">Bank Records</span>
                        <div className="flex gap-1 mt-2">
                            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                            <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                        </div>
                    </div>

                    {/* Router Node */}
                    <div
                        className={`absolute left-[55%] top-1/2 -translate-y-1/2 w-28 h-28 rotate-45 border backdrop-blur-xl transition-all duration-500 flex items-center justify-center z-10
            ${nodeStatus.router === 'active' ? 'border-yellow-400/50 bg-yellow-500/10 shadow-[0_0_40px_rgba(250,204,21,0.3)] scale-110' : 'border-slate-700/50 bg-slate-900/40'}`}
                    >
                        <div className="-rotate-45 flex flex-col items-center">
                            <GitFork className={`w-10 h-10 ${nodeStatus.router === 'active' ? 'text-yellow-400' : 'text-slate-600'}`} />
                        </div>
                    </div>

                    {/* Success Node */}
                    <div className={`absolute left-[75%] top-[25%] w-48 h-24 rounded-2xl border backdrop-blur-xl flex items-center p-5 gap-4 transition-all duration-500 ${nodeStatus.success === 'success' ? 'opacity-100 border-green-500/50 bg-green-900/20 shadow-[0_0_40px_rgba(34,197,94,0.2)]' : 'opacity-40 border-slate-800 bg-slate-900/20'}`}>
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 shrink-0">
                            <Check className="text-green-400 w-6 h-6" />
                        </div>
                        <div>
                            <div className="font-bold text-green-400 text-base">Approved</div>
                            <div className="text-xs text-slate-500">CRM Updated</div>
                        </div>
                    </div>

                    {/* Human Node */}
                    <div className={`absolute left-[75%] bottom-[25%] w-48 h-24 rounded-2xl border backdrop-blur-xl flex items-center p-5 gap-4 transition-all duration-500 ${nodeStatus.human === 'active' ? 'opacity-100 border-yellow-500/50 bg-yellow-900/20 shadow-[0_0_40px_rgba(234,179,8,0.2)]' : 'opacity-40 border-slate-800 bg-slate-900/20'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 ${nodeStatus.human === 'active' ? 'bg-yellow-500/20 border-yellow-500/30 animate-pulse' : 'bg-slate-800 border-slate-700'}`}>
                            {nodeStatus.human === 'active' ? <TriangleAlert className="text-yellow-400 w-6 h-6" /> : <UserCog className="text-slate-400 w-6 h-6" />}
                        </div>
                        <div>
                            <div className="font-bold text-yellow-400 text-base">Review</div>
                            <div className="text-xs text-slate-500">HITL Queue</div>
                        </div>
                    </div>

                </div>

                {/* Admin Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1e293b] border border-slate-600 p-6 rounded-2xl shadow-2xl z-50 w-96 text-center"
                        >
                            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto -mt-12 border-4 border-[#020617] mb-4">
                                <Hand className="text-[#020617] w-6 h-6" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-1">Human Intervention Required</h3>
                            <p className="text-slate-400 text-xs mb-4">{modalReason}</p>

                            <div className="bg-black/30 p-3 rounded-lg mb-4 text-left">
                                <div className="text-[10px] text-slate-500 uppercase font-bold">Slip Details</div>
                                <div className="flex justify-between text-xs text-slate-300 mt-1">
                                    <span>Amount:</span> <span className="font-mono text-white">500.00 THB</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-300">
                                    <span>Sender:</span> <span className="font-mono text-white">Sombat Jai-dee</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button onClick={() => resolveHumanReview(true)} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg text-xs font-bold transition-colors">Approve</button>
                                <button onClick={() => resolveHumanReview(false)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-xs font-bold transition-colors">Reject</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Code Overlay */}
                <AnimatePresence>
                    {showCodeOverlay && currentCode && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#020617]/95 backdrop-blur-sm z-40 flex items-center justify-center p-10"
                        >
                            <div className="w-full max-w-4xl bg-[#1e1e1e] rounded-xl border border-slate-700 shadow-2xl overflow-hidden font-mono text-xs md:text-sm">
                                <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-black">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <span className="text-slate-400">{currentCode.title}</span>
                                    <button onClick={() => setShowCodeOverlay(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                                </div>
                                <div className="p-6 text-slate-300 overflow-y-auto max-h-[60vh]">
                                    <pre>{currentCode.content}</pre>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </section>

            {/* Right: Terminal */}
            <section className="w-full lg:w-[300px] border-l border-slate-800 bg-[#050B14] flex flex-col font-mono text-xs z-10 shrink-0">
                <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <Terminal className="w-3 h-3 mr-2" /> Live Logs
                    </span>
                    <div className="flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-[10px] text-green-500">ONLINE</span>
                    </div>
                </div>

                <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto space-y-3 scroll-smooth h-[300px] lg:h-auto">
                    <div className="text-slate-600 italic">{'>'} Agent system initialized...</div>
                    <div className="text-slate-600 italic">{'>'} Waiting for webhook...</div>
                    {logs.map(log => (
                        <div key={log.id} className={`border-l-2 pl-2 animate-pulse ${log.type === 'success' ? 'border-green-500 text-green-400' :
                            log.type === 'error' ? 'border-red-500 text-red-400' :
                                log.type === 'warn' ? 'border-yellow-400 text-yellow-400' :
                                    'border-slate-800 text-slate-300'
                            }`}>
                            <span className="text-slate-600 text-[10px] mr-2">{log.time}</span>
                            {log.msg}
                        </div>
                    ))}
                </div>

                <div className="h-1/3 border-t border-slate-800 bg-slate-900/50 p-4">
                    <div className="text-[10px] text-blue-400 font-bold mb-2 uppercase">Current State (JSON)</div>
                    <pre className="text-[10px] text-slate-400 overflow-hidden whitespace-pre-wrap">
                        {JSON.stringify(jsonState, null, 2)}
                    </pre>
                </div>
            </section>
        </div>
    );
};

export default SlipVerifyDemo;
