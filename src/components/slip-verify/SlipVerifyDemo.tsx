import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone,
    Store,
    Building2,
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
    X,
    Code,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../lib/motion/usePrefersReducedMotion';

type NodeType = 'ocr' | 'fraud' | 'db' | 'router' | 'success' | 'human';
type ScenarioType = 'clean' | 'blurry' | 'fraud';
type LogType = { id: string; msg: string; type: 'info' | 'success' | 'error' | 'warn'; time: string };

const CODE_SNIPPETS = {
    ocr: `def ocr_extraction_node(state: PaymentState):
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
    exists = db.query("SELECT * FROM txns WHERE id = %s", (state["txn_id"],))
    if exists:
        return {"is_fraud": True, "risk_score": 1.0}

    if state["sender"] in BLACKLIST:
        return {"is_fraud": True, "risk_score": 0.9}

    return {"is_fraud": False, "risk_score": 0.0}`,
    db: `class BankDatabase:
    def lookup_txn(self, txn_id: str):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM payments WHERE id = %s", (txn_id,))
            return cur.fetchone()`,
};

/** Self-contained crisp PromptPay QR SVG (no external network dependency) */
function PromptPayQrSvg() {
    const cells = [
        [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0],
        [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1],
    ];
    return (
        <svg viewBox="0 0 13 13" className="w-20 h-20 mx-auto" shapeRendering="crispEdges" aria-hidden="true">
            {cells.map((row, y) =>
                row.map((v, x) =>
                    v ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0a0a0a" /> : null
                )
            )}
        </svg>
    );
}

const SlipVerifyDemo = () => {
    const reduced = usePrefersReducedMotion();
    const [nodeStatus, setNodeStatus] = useState<Record<NodeType, 'idle' | 'active' | 'success' | 'error'>>({
        ocr: 'idle',
        fraud: 'idle',
        db: 'idle',
        router: 'idle',
        success: 'idle',
        human: 'idle',
    });
    const [logs, setLogs] = useState<LogType[]>([]);
    const [jsonState, setJsonState] = useState<Record<string, unknown>>({ status: 'IDLE', txn_id: null });
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalReason, setModalReason] = useState('');
    const [slipVisible, setSlipVisible] = useState(false);
    const [slipBlurry, setSlipBlurry] = useState(false);
    const [laserActive, setLaserActive] = useState(false);
    const [currentCode, setCurrentCode] = useState<{ title: string; content: string } | null>(null);

    const terminalRef = useRef<HTMLDivElement>(null);
    const runIdRef = useRef(0);

    const addLog = (msg: string, type: LogType['type'] = 'info') => {
        const time = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        setLogs((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, msg, type, time }]);
    };

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

    const runScenario = async (type: ScenarioType) => {
        const myRun = runIdRef.current + 1;
        runIdRef.current = myRun;
        const cancelled = () => runIdRef.current !== myRun;
        const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 90) : ms));

        setIsSimulationRunning(true);
        setNodeStatus({ ocr: 'idle', fraud: 'idle', db: 'idle', router: 'idle', success: 'idle', human: 'idle' });
        setSlipVisible(false);
        setSlipBlurry(false);
        setLaserActive(false);
        setShowModal(false);
        setLogs([]);
        setJsonState({ status: 'UPLOADING', txn_id: null });

        addLog('Customer attaching PromptPay slip in LINE OA...', 'info');
        await wait(400);
        if (cancelled()) return;

        setSlipVisible(true);
        if (type === 'blurry') setSlipBlurry(true);

        addLog('Webhook received. Triggering LangGraph state machine.', 'info');
        setJsonState({ status: 'PROCESSING', slip_id: 'SLIP_992', txn_id: null });

        // OCR Node
        await wait(500);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, ocr: 'active' }));
        addLog('Node [ocr]: extracting Thai bank fields & QR payload...', 'warn');
        setLaserActive(true);
        await wait(1100);
        if (cancelled()) return;
        setLaserActive(false);

        if (type === 'blurry') {
            setNodeStatus((p) => ({ ...p, ocr: 'error' }));
            addLog('OCR Low Confidence (0.42). Flagged for review.', 'error');
            setJsonState((p) => ({ ...p, ocr_confidence: 0.42, extracted: null }));
        } else {
            setNodeStatus((p) => ({ ...p, ocr: 'success' }));
            addLog('OCR Verified: 500.00 THB · TXN-882910 (0.99 conf)', 'success');
            setJsonState((p) => ({ ...p, ocr_confidence: 0.99, amount: 500.0, txn_id: '882910' }));
        }

        // Fraud Node + DB Lookup
        await wait(550);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, fraud: 'active', db: 'active' }));
        addLog('Node [fraud_guard]: querying Bank Records for replay hash...', 'info');
        await wait(800);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, db: 'idle' }));

        if (type === 'fraud') {
            setNodeStatus((p) => ({ ...p, fraud: 'error' }));
            addLog('FRAUD ALERT: Duplicate Slip TXN-882910 already settled!', 'error');
            setJsonState((p) => ({ ...p, risk_score: 1.0, flag: 'DUPLICATE_REPLAY' }));
        } else {
            setNodeStatus((p) => ({ ...p, fraud: 'success' }));
            addLog('Fraud Guard passed: unique reference & clean sender.', 'success');
            setJsonState((p) => ({ ...p, risk_score: 0.01, flag: 'CLEAN' }));
        }

        // Router
        await wait(500);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, router: 'active' }));
        await wait(500);
        if (cancelled()) return;
        setNodeStatus((p) => ({ ...p, router: 'idle' }));

        if (type === 'clean') {
            addLog('Router -> AUTO_APPROVE. Updating POS & CRM ledger.', 'success');
            setNodeStatus((p) => ({ ...p, success: 'success' }));
            setJsonState((p) => ({ ...p, status: 'APPROVED', final: true }));
            setIsSimulationRunning(false);
        } else {
            addLog('Router -> HITL_INTERRUPT. Pausing graph state.', 'error');
            setNodeStatus((p) => ({ ...p, human: 'active' }));
            setJsonState((p) => ({ ...p, status: 'PAUSED', interrupt: 'human_review' }));
            setModalReason(
                type === 'fraud'
                    ? 'Duplicate transaction hash detected in Bank Records'
                    : 'OCR confidence (42%) below auto-approval threshold (85%)'
            );
            setShowModal(true);
        }
    };

    const resolveHumanReview = (approved: boolean) => {
        setShowModal(false);
        addLog(`Admin override: ${approved ? 'APPROVED' : 'REJECTED'}`, approved ? 'success' : 'error');
        if (approved) {
            setNodeStatus((p) => ({ ...p, success: 'success', human: 'idle' }));
            setJsonState((p) => ({ ...p, status: 'APPROVED_BY_ADMIN', final: true }));
        } else {
            setNodeStatus((p) => ({ ...p, human: 'idle' }));
            setJsonState((p) => ({ ...p, status: 'REJECTED', final: true }));
        }
        setIsSimulationRunning(false);
    };

    const openCode = (node: keyof typeof CODE_SNIPPETS) => {
        setCurrentCode({ title: `${node}_node.py`, content: CODE_SNIPPETS[node] });
    };

    const nodeTone = (state: 'idle' | 'active' | 'success' | 'error') =>
        state === 'active'
            ? 'border-sky-500/70 bg-sky-500/[0.08]'
            : state === 'success'
              ? 'border-emerald-500/60 bg-emerald-500/[0.08]'
              : state === 'error'
                ? 'border-rose-500/60 bg-rose-500/[0.08]'
                : 'border-hairline bg-panel/70 hover:border-hairline-strong';

    return (
        <div className="flex flex-col lg:flex-row min-h-[700px] lg:h-[740px] bg-bg text-text overflow-hidden font-sans">
            {/* LEFT: Mobile LINE OA Simulator */}
            <section className="w-full lg:w-[310px] border-b lg:border-b-0 lg:border-r border-hairline bg-panel/40 flex flex-col items-center p-5 justify-between shrink-0">
                <div className="w-full flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-mute flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                        Customer LINE OA
                    </span>
                    <span className="text-[9px] font-mono text-text-mute">PromptPay</span>
                </div>

                {/* Phone Frame */}
                <div className="w-[248px] rounded-[2rem] border-4 border-hairline-strong bg-bg overflow-hidden flex flex-col">
                    <div className="bg-emerald-600 text-white px-4 py-3 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                            <Store className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-semibold truncate">Coffee Beans Co.</div>
                            <div className="text-[9px] opacity-85">Official Account</div>
                        </div>
                    </div>

                    <div className="p-3 space-y-2.5 bg-panel min-h-[340px] flex flex-col">
                        <div className="bg-bg border border-hairline rounded-xl rounded-tl-none p-2.5 text-[11px] text-text max-w-[88%]">
                            Order #992 confirmed.
                            <br />
                            Total: <strong className="text-text-strong">500.00 THB</strong>
                        </div>

                        <div className="bg-white rounded-xl p-2.5 w-32 border border-hairline text-center">
                            <PromptPayQrSvg />
                            <div className="text-[9px] font-mono text-neutral-600 mt-1.5">SCB · ฿500.00</div>
                        </div>

                        <AnimatePresence>
                            {slipVisible && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="self-end w-32"
                                >
                                    <div className="bg-white rounded-xl p-2 border border-hairline relative overflow-hidden">
                                        {laserActive && !reduced && (
                                            <motion.div
                                                className="absolute left-0 right-0 h-[2px] bg-emerald-500 z-20"
                                                style={{ boxShadow: '0 0 10px #10b981' }}
                                                animate={{ top: ['5%', '95%', '5%'] }}
                                                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                                            />
                                        )}
                                        <div
                                            className={`py-3 flex flex-col items-center justify-center transition-all ${
                                                slipBlurry ? 'blur-[3px]' : ''
                                            }`}
                                        >
                                            <Building2 className="w-4 h-4 text-neutral-500 mb-1.5" />
                                            <div className="font-mono text-xs font-bold text-neutral-900">฿ 500.00</div>
                                            <div className="text-[8px] font-mono text-neutral-500 mt-1">TXN: 882910</div>
                                        </div>
                                    </div>
                                    <div className="text-[9px] font-mono text-text-mute text-right mt-1">Read 14:32</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Scenario Buttons */}
                <div className="w-full mt-4 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute text-center">
                        Send Test Slip
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                        <button
                            type="button"
                            onClick={() => runScenario('clean')}
                            disabled={isSimulationRunning}
                            data-cursor="play"
                            className="py-2 px-2 rounded-lg border border-hairline bg-bg hover:border-emerald-500/50 text-[11px] font-mono text-text-strong flex items-center justify-center gap-1 disabled:opacity-45 transition-colors"
                        >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            Clean
                        </button>
                        <button
                            type="button"
                            onClick={() => runScenario('blurry')}
                            disabled={isSimulationRunning}
                            data-cursor="play"
                            className="py-2 px-2 rounded-lg border border-hairline bg-bg hover:border-amber-500/50 text-[11px] font-mono text-text-strong flex items-center justify-center gap-1 disabled:opacity-45 transition-colors"
                        >
                            <EyeOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            Blurry
                        </button>
                        <button
                            type="button"
                            onClick={() => runScenario('fraud')}
                            disabled={isSimulationRunning}
                            data-cursor="play"
                            className="py-2 px-2 rounded-lg border border-hairline bg-bg hover:border-rose-500/50 text-[11px] font-mono text-text-strong flex items-center justify-center gap-1 disabled:opacity-45 transition-colors"
                        >
                            <TriangleAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            Fraud
                        </button>
                    </div>
                </div>
            </section>

            {/* CENTER: Responsive LangGraph Topology */}
            <section className="flex-1 bg-bg relative flex flex-col overflow-hidden p-5">
                <div
                    className="absolute inset-0 opacity-[0.12] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-text-mute) 1px, transparent 0)',
                        backgroundSize: '26px 26px',
                    }}
                />

                <div className="relative z-10 flex items-center justify-between mb-5 pb-3 border-b border-hairline">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong">
                        Verification Graph
                    </span>
                    <span className="text-[10px] font-mono text-text-mute flex items-center gap-1.5">
                        <Code className="w-3 h-3" /> Click nodes to inspect Python source
                    </span>
                </div>

                {/* Clean structured graph layout that never clips */}
                <div className="relative z-10 flex-1 flex flex-col justify-center gap-5 max-w-xl mx-auto w-full">
                    {/* Primary horizontal pipeline row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-stretch">
                        {/* OCR */}
                        <button
                            type="button"
                            onClick={() => openCode('ocr')}
                            className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${nodeTone(nodeStatus.ocr)}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-xl border border-hairline bg-bg flex items-center justify-center text-sky-500">
                                    <Expand className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded border border-hairline bg-bg text-text-mute">
                                    {nodeStatus.ocr === 'success' ? '99% CONF' : nodeStatus.ocr === 'error' ? '42% CONF' : 'OCR'}
                                </span>
                            </div>
                            <div className="text-sm font-medium text-text-strong">Vision OCR</div>
                            <div className="text-[11px] text-text-mute mt-0.5">Thai slip &amp; QR parser</div>
                        </button>

                        {/* Fraud Guard */}
                        <button
                            type="button"
                            onClick={() => openCode('fraud')}
                            className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${nodeTone(nodeStatus.fraud)}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-xl border border-hairline bg-bg flex items-center justify-center text-violet-500">
                                    <ShieldAlert className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded border border-hairline bg-bg text-text-mute">
                                    {nodeStatus.fraud === 'success' ? 'CLEAN' : nodeStatus.fraud === 'error' ? 'REPLAY' : 'GUARD'}
                                </span>
                            </div>
                            <div className="text-sm font-medium text-text-strong">Fraud Guard</div>
                            <div className="text-[11px] text-text-mute mt-0.5">Dedup &amp; replay check</div>
                        </button>

                        {/* Conditional Router */}
                        <div className={`rounded-2xl border p-4 transition-all ${nodeTone(nodeStatus.router)}`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 rounded-xl border border-hairline bg-bg flex items-center justify-center text-amber-500">
                                    <GitFork className="w-4 h-4" />
                                </div>
                                <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded border border-hairline bg-bg text-text-mute">
                                    EDGE
                                </span>
                            </div>
                            <div className="text-sm font-medium text-text-strong">Policy Router</div>
                            <div className="text-[11px] text-text-mute mt-0.5">Auto-approve vs HITL</div>
                        </div>
                    </div>

                    {/* Bank DB Lookup Bar */}
                    <button
                        type="button"
                        onClick={() => openCode('db')}
                        className={`rounded-xl border p-3.5 flex items-center justify-between transition-all cursor-pointer ${nodeTone(nodeStatus.db)}`}
                    >
                        <div className="flex items-center gap-3">
                            <Database className="w-4 h-4 text-sky-500" />
                            <div className="text-left">
                                <div className="text-xs font-medium text-text-strong">Bank Records Replica (PostgreSQL)</div>
                                <div className="text-[10px] font-mono text-text-mute">SELECT * FROM payments WHERE txn_id = $1</div>
                            </div>
                        </div>
                        <span className="text-[9px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border border-hairline bg-bg text-text-mute">
                            {nodeStatus.db === 'active' ? 'QUERYING' : 'CLICK CODE'}
                        </span>
                    </button>

                    {/* Terminal Branches */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                            className={`rounded-2xl border p-4 flex items-center gap-3.5 transition-all ${
                                nodeStatus.success === 'success'
                                    ? 'border-emerald-500/60 bg-emerald-500/10 opacity-100'
                                    : 'border-hairline bg-panel/40 opacity-50'
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full border border-emerald-500/40 bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                                <Check className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-text-strong">Approved &amp; Settled</div>
                                <div className="text-[11px] font-mono text-text-mute">POS &amp; CRM ledger updated</div>
                            </div>
                        </div>

                        <div
                            className={`rounded-2xl border p-4 flex items-center gap-3.5 transition-all ${
                                nodeStatus.human === 'active'
                                    ? 'border-amber-500/60 bg-amber-500/10 opacity-100'
                                    : 'border-hairline bg-panel/40 opacity-50'
                            }`}
                        >
                            <div className="w-10 h-10 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                                {nodeStatus.human === 'active' ? (
                                    <TriangleAlert className="w-5 h-5" />
                                ) : (
                                    <UserCog className="w-5 h-5" />
                                )}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-text-strong">HITL Escalation</div>
                                <div className="text-[11px] font-mono text-text-mute">Paused for finance ops</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Human Intervention Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-bg/85 backdrop-blur-sm z-40 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-panel border border-hairline-strong p-6 rounded-2xl w-full max-w-sm"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-500 flex items-center justify-center shrink-0">
                                        <Hand className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-display font-medium text-text-strong">
                                            Human Review Required
                                        </h4>
                                        <p className="text-xs text-text-mute">{modalReason}</p>
                                    </div>
                                </div>

                                <div className="bg-bg p-3 rounded-xl border border-hairline mb-4 space-y-1 text-xs font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-text-mute">Amount</span>
                                        <span className="text-text-strong">500.00 THB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-mute">Sender</span>
                                        <span className="text-text-strong">Sombat Jai-dee</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => resolveHumanReview(false)}
                                        className="py-2 rounded-lg border border-rose-500/45 text-rose-500 hover:bg-rose-500/10 text-xs font-mono uppercase tracking-[0.12em]"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => resolveHumanReview(true)}
                                        className="py-2 rounded-lg bg-text-strong text-bg hover:opacity-90 text-xs font-mono uppercase tracking-[0.12em]"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Code Inspector Overlay */}
                <AnimatePresence>
                    {currentCode && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-bg/90 backdrop-blur-sm z-40 flex items-center justify-center p-6"
                        >
                            <div className="w-full max-w-xl bg-panel rounded-2xl border border-hairline-strong overflow-hidden font-mono text-xs">
                                <div className="px-4 py-2.5 flex justify-between items-center border-b border-hairline bg-bg">
                                    <span className="text-text-strong">{currentCode.title}</span>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentCode(null)}
                                        aria-label="Close code inspector"
                                        className="text-text-mute hover:text-text-strong"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <pre className="p-5 text-text overflow-x-auto leading-relaxed">{currentCode.content}</pre>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* RIGHT: Live Telemetry Terminal */}
            <section className="w-full lg:w-[290px] border-t lg:border-t-0 lg:border-l border-hairline bg-panel/40 flex flex-col font-mono text-xs shrink-0">
                <div className="px-4 py-3 border-b border-hairline flex justify-between items-center shrink-0">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-text-strong flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-500" />
                        Live Logs
                    </span>
                    <span className="text-[9px] text-emerald-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        ONLINE
                    </span>
                </div>

                <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto space-y-2.5 max-h-[260px] lg:max-h-none">
                    <div className="text-text-mute text-[11px]">&gt; LangGraph verifier armed...</div>
                    {logs.map((log) => (
                        <div
                            key={log.id}
                            className={`border-l pl-2 text-[11px] leading-snug ${
                                log.type === 'success'
                                    ? 'border-emerald-500 text-emerald-500'
                                    : log.type === 'error'
                                      ? 'border-rose-500 text-rose-500'
                                      : log.type === 'warn'
                                        ? 'border-amber-500 text-amber-500'
                                        : 'border-hairline-strong text-text'
                            }`}
                        >
                            <span className="text-text-mute text-[9px] mr-1.5">{log.time}</span>
                            {log.msg}
                        </div>
                    ))}
                </div>

                <div className="border-t border-hairline bg-panel p-4 shrink-0">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-text-mute mb-2">
                        State Snapshot (JSON)
                    </div>
                    <pre className="text-[10px] text-text bg-bg border border-hairline rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(jsonState, null, 2)}
                    </pre>
                </div>
            </section>
        </div>
    );
};

export default SlipVerifyDemo;
