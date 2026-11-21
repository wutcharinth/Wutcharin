import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Network,
    FileText,
    ScanFace,
    Search,
    Gavel,
    Play,
    RotateCcw,
    CheckCircle,
    Fingerprint,
    Radar,
    Check,
    X,
    ClipboardCheck,
    Code,
    Download,
    AlertTriangle,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../lib/motion/usePrefersReducedMotion';

type Role = 'risk' | 'audit' | 'tech';
type Scenario = 'standard' | 'coi';
type StepState = 'idle' | 'running' | 'pass' | 'risk';

const ACCENT = '#f43f5e';

interface AuditEntry {
    id: string;
    level: 'info' | 'alert' | 'action';
    text: string;
}

const STEPS = [
    {
        id: 'policy',
        title: 'Policy Check',
        desc: 'Validating PO limits, budget codes, and authorization levels.',
        icon: FileText,
    },
    {
        id: 'entity',
        title: 'Entity Resolution',
        desc: 'Cross-referencing Vendor Master Data vs. HR Employee DB.',
        icon: ScanFace,
    },
    {
        id: 'price',
        title: 'Market Benchmark',
        desc: 'Comparing unit pricing against historical averages.',
        icon: Search,
    },
    {
        id: 'decision',
        title: 'Control Decision',
        desc: 'Final risk score calculation and autonomous action.',
        icon: Gavel,
    },
] as const;

const RiskGuardDemo = () => {
    const reduced = usePrefersReducedMotion();
    const [role, setRole] = useState<Role>('risk');
    const [scenario, setScenario] = useState<Scenario>('standard');
    const [isRunning, setIsRunning] = useState(false);
    const [stepStatus, setStepStatus] = useState<StepState[]>(['idle', 'idle', 'idle', 'idle']);
    const [activeStepIdx, setActiveStepIdx] = useState<number>(-1);
    const [mobileTab, setMobileTab] = useState<'flow' | 'docs' | 'data'>('flow');

    const [riskScore, setRiskScore] = useState<number | null>(null);
    const [riskReason, setRiskReason] = useState<string>('Run a control check to inspect transaction risk.');
    const [checkBudget, setCheckBudget] = useState<string>('--');
    const [checkCoi, setCheckCoi] = useState<string>('--');
    const [checkPrice, setCheckPrice] = useState<string>('--');
    const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
    const [showDocContent, setShowDocContent] = useState(false);
    const [showDocSplit, setShowDocSplit] = useState(false);
    const [docId, setDocId] = useState('WAITING FOR INPUT...');
    const [showCoiAlert, setShowCoiAlert] = useState(false);
    const [exported, setExported] = useState(false);

    const runIdRef = useRef(0);

    const resetUI = () => {
        runIdRef.current += 1;
        setIsRunning(false);
        setActiveStepIdx(-1);
        setStepStatus(['idle', 'idle', 'idle', 'idle']);
        setRiskScore(null);
        setRiskReason('Run a control check to inspect transaction risk.');
        setCheckBudget('--');
        setCheckCoi('--');
        setCheckPrice('--');
        setShowDocContent(false);
        setShowDocSplit(false);
        setDocId('WAITING FOR INPUT...');
        setShowCoiAlert(false);
        setAuditLog([]);
        setExported(false);
    };

    const setStep = (index: number, state: StepState) => {
        setStepStatus((prev) => {
            const next = [...prev];
            next[index] = state;
            return next;
        });
    };

    const runSimulation = async (overrideScenario?: Scenario) => {
        const activeScenario = overrideScenario ?? scenario;
        if (overrideScenario) setScenario(overrideScenario);

        const myRun = runIdRef.current + 1;
        runIdRef.current = myRun;
        setIsRunning(true);
        setActiveStepIdx(0);
        setStepStatus(['running', 'idle', 'idle', 'idle']);
        setRiskScore(null);
        setRiskReason('Scanning PO and entity graph...');
        setCheckBudget('--');
        setCheckCoi('--');
        setCheckPrice('--');
        setShowDocContent(false);
        setShowDocSplit(false);
        setDocId('SCANNING EVIDENCE...');
        setShowCoiAlert(false);
        setAuditLog([]);
        setExported(false);

        const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 120) : ms));
        const cancelled = () => runIdRef.current !== myRun;

        // STEP 1: POLICY
        await wait(550);
        if (cancelled()) return;
        setStep(0, 'pass');
        setCheckBudget('Pass');
        setAuditLog([{ id: '1', level: 'info', text: '[INFO] Policy limits and budget authorization verified' }]);

        // STEP 2: ENTITY
        setActiveStepIdx(1);
        setStep(1, 'running');
        await wait(900);
        if (cancelled()) return;
        const isRisk = activeScenario === 'coi';
        setStep(1, isRisk ? 'risk' : 'pass');

        if (!isRisk) {
            setShowDocContent(true);
            setDocId('DOC-ID: PO-2025-8821');
            setCheckCoi('Clean');
            setAuditLog((prev) => [...prev, { id: '2', level: 'info', text: '[INFO] No vendor/employee graph overlap detected' }]);
        } else {
            setShowDocSplit(true);
            setDocId('ALERT: IDENTITY OVERLAP');
            setShowCoiAlert(true);
            setCheckCoi('FAIL');
            setAuditLog((prev) => [...prev, { id: '2', level: 'alert', text: '[ALERT] Address match: 128 Maple St, Apt 4B' }]);
        }

        // STEP 3: PRICE
        setActiveStepIdx(2);
        setStep(2, 'running');
        await wait(950);
        if (cancelled()) return;
        setStep(2, isRisk ? 'risk' : 'pass');
        setCheckPrice(isRisk ? '+25% Above Market' : 'Within 5% Range');

        // STEP 4: DECISION
        setActiveStepIdx(3);
        setStep(3, 'running');
        await wait(700);
        if (cancelled()) return;
        setStep(3, isRisk ? 'risk' : 'pass');

        if (!isRisk) {
            setRiskScore(15);
            setRiskReason('Low risk profile. Approved automatically.');
            setAuditLog((prev) => [...prev, { id: '3', level: 'action', text: 'ACTION: AUTO-APPROVE (PO-2025-8821)' }]);
        } else {
            setRiskScore(98);
            setRiskReason('CRITICAL: Conflict of Interest detected. Payment frozen.');
            setAuditLog((prev) => [...prev, { id: '3', level: 'alert', text: 'ACTION: BLOCK & ESCALATE TO INTERNAL AUDIT' }]);
        }

        setActiveStepIdx(-1);
        setIsRunning(false);
    };

    const handleExport = () => {
        setExported(true);
        setTimeout(() => setExported(false), 2000);
    };

    const gaugePct = riskScore !== null ? riskScore / 100 : 0;
    const isHighRisk = riskScore !== null && riskScore >= 70;
    const scoreColor = riskScore === null ? 'var(--color-text-mute)' : isHighRisk ? '#f43f5e' : '#10b981';

    return (
        <div className="min-h-[680px] lg:h-[740px] flex flex-col font-sans bg-bg text-text overflow-hidden">
            {/* Console Control Header */}
            <header className="border-b border-hairline bg-panel px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                        style={{ borderColor: `${ACCENT}44`, backgroundColor: `${ACCENT}14`, color: ACCENT }}
                    >
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-display font-medium text-sm leading-tight text-text-strong flex items-center gap-1.5">
                            RiskGuard <span className="font-serif italic" style={{ color: ACCENT }}>AI</span>
                        </div>
                        <div className="text-[10px] text-text-mute font-mono tracking-[0.18em] uppercase">
                            Internal Control Engine
                        </div>
                    </div>
                </div>

                {/* Role Switcher (Desktop) */}
                <div className="hidden md:flex items-center bg-bg border border-hairline rounded-full p-0.5">
                    {(['risk', 'audit', 'tech'] as Role[]).map((r) => {
                        const active = role === r;
                        return (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`relative px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.12em] transition-colors ${
                                    active ? 'text-bg font-medium' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="riskguard-role-pill"
                                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                        className="absolute inset-0 rounded-full bg-text-strong"
                                    />
                                )}
                                <span className="relative z-10">
                                    {r === 'risk' ? 'Risk Mgr' : r === 'audit' ? 'Audit' : 'IT Sec'}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Scenario Selector */}
                <div className="flex items-center bg-bg border border-hairline rounded-full p-0.5 gap-0.5">
                    <button
                        type="button"
                        onClick={() => runSimulation('standard')}
                        data-cursor="play"
                        className={`relative px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.12em] transition-colors flex items-center gap-1.5 ${
                            scenario === 'standard' ? 'text-emerald-500 font-medium' : 'text-text-mute hover:text-text-strong'
                        }`}
                    >
                        {scenario === 'standard' && (
                            <motion.span
                                layoutId="riskguard-scenario-pill"
                                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                className="absolute inset-0 rounded-full bg-emerald-500/12 border border-emerald-500/35"
                            />
                        )}
                        <CheckCircle className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10">Safe PO</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => runSimulation('coi')}
                        data-cursor="play"
                        className={`relative px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.12em] transition-colors flex items-center gap-1.5 ${
                            scenario === 'coi' ? 'text-rose-500 font-medium' : 'text-text-mute hover:text-text-strong'
                        }`}
                    >
                        {scenario === 'coi' && (
                            <motion.span
                                layoutId="riskguard-scenario-pill"
                                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                className="absolute inset-0 rounded-full bg-rose-500/12 border border-rose-500/35"
                            />
                        )}
                        <AlertTriangle className="w-3.5 h-3.5 relative z-10" />
                        <span className="relative z-10">COI Fraud</span>
                    </button>
                </div>
            </header>

            {/* Mobile Role Switcher */}
            <div className="md:hidden bg-panel border-b border-hairline px-4 py-2 flex justify-between items-center">
                <span className="text-[10px] text-text-mute font-mono uppercase tracking-[0.18em]">Role View</span>
                <div className="flex gap-1">
                    {(['risk', 'audit', 'tech'] as Role[]).map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase ${
                                role === r ? 'bg-text-strong text-bg' : 'text-text-mute border border-hairline'
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main 3-Pane Workspace */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* LEFT: Workflow Pipeline */}
                <section
                    className={`w-full md:w-[310px] lg:w-[340px] border-r border-hairline bg-panel/40 flex-col relative z-10 shrink-0 ${
                        mobileTab === 'flow' ? 'flex' : 'hidden md:flex'
                    }`}
                >
                    <div className="px-4 py-3 border-b border-hairline flex justify-between items-center shrink-0">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong flex items-center gap-2">
                            <Network className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                            Control Graph
                        </h3>
                        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-text-mute flex items-center gap-1.5">
                            <span
                                className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'animate-pulse' : ''}`}
                                style={{ backgroundColor: isRunning ? ACCENT : '#10b981' }}
                            />
                            {isRunning ? 'Scanning' : 'Armed'}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                        {STEPS.map((step, i) => {
                            const status = stepStatus[i];
                            const Icon = step.icon;
                            const isRiskNode = status === 'risk';
                            const isPassNode = status === 'pass';
                            const isRunningNode = status === 'running';
                            const showLine = i < STEPS.length - 1;
                            const lineActive = status !== 'idle';

                            return (
                                <div key={step.id} className="relative pl-11">
                                    {showLine && (
                                        <div className="absolute left-[15px] top-8 bottom-[-20px] w-[2px] bg-hairline overflow-hidden">
                                            <motion.div
                                                className="w-full origin-top"
                                                initial={{ scaleY: 0 }}
                                                animate={{ scaleY: lineActive ? 1 : 0 }}
                                                transition={{ duration: 0.35 }}
                                                style={{
                                                    height: '100%',
                                                    backgroundColor: isRiskNode ? '#f43f5e' : '#10b981',
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div className="absolute left-0 top-1 flex items-center justify-center">
                                        <div
                                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                                isRiskNode
                                                    ? 'bg-rose-500/15 border-rose-500 text-rose-500'
                                                    : isPassNode
                                                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500'
                                                      : isRunningNode
                                                        ? 'bg-bg border-text-strong text-text-strong'
                                                        : 'bg-bg border-hairline text-text-mute'
                                            }`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                        </div>
                                    </div>

                                    <motion.div
                                        animate={
                                            isRunningNode && !reduced
                                                ? { x: 2 }
                                                : { x: 0 }
                                        }
                                        className={`p-3.5 rounded-xl border transition-colors ${
                                            isRiskNode
                                                ? 'border-rose-500/45 bg-rose-500/[0.06]'
                                                : isPassNode
                                                  ? 'border-emerald-500/35 bg-emerald-500/[0.04]'
                                                  : isRunningNode
                                                    ? 'border-hairline-strong bg-panel-strong'
                                                    : 'border-hairline bg-bg/60'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center gap-2 mb-1">
                                            <span className="text-xs font-medium text-text-strong">{step.title}</span>
                                            <span
                                                className={`text-[9px] font-mono uppercase tracking-[0.14em] px-1.5 py-0.5 rounded border ${
                                                    isRiskNode
                                                        ? 'border-rose-500/40 text-rose-500 bg-rose-500/10'
                                                        : isPassNode
                                                          ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10'
                                                          : isRunningNode
                                                            ? 'border-hairline-strong text-text-strong bg-panel'
                                                            : 'border-hairline text-text-mute'
                                                }`}
                                            >
                                                {status === 'idle'
                                                    ? 'Idle'
                                                    : status === 'running'
                                                      ? 'Running'
                                                      : status === 'risk'
                                                        ? 'Flagged'
                                                        : 'Verified'}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-text-mute leading-relaxed">{step.desc}</p>

                                        {step.id === 'entity' && showCoiAlert && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-2.5 p-2 rounded-lg bg-rose-500/12 border border-rose-500/35 flex items-center gap-2"
                                            >
                                                <Fingerprint className="text-rose-500 w-3.5 h-3.5 shrink-0" />
                                                <span className="text-[11px] font-mono text-rose-500">
                                                    Address overlap detected
                                                </span>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-hairline bg-panel flex gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={() => runSimulation()}
                            disabled={isRunning}
                            data-cursor="play"
                            className="flex-1 py-2.5 px-4 rounded-lg text-xs font-mono uppercase tracking-[0.16em] bg-text-strong text-bg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-45"
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {isRunning ? 'Evaluating...' : 'Run Check'}
                        </button>
                        <button
                            type="button"
                            onClick={resetUI}
                            aria-label="Reset simulation"
                            className="px-3 py-2.5 rounded-lg border border-hairline text-text-mute hover:text-text-strong hover:border-hairline-strong transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </section>

                {/* CENTER: Evidence Investigator */}
                <section
                    className={`flex-1 bg-bg flex-col relative overflow-hidden ${
                        mobileTab === 'docs' ? 'flex' : 'hidden md:flex'
                    }`}
                >
                    <div className="h-10 bg-panel border-b border-hairline flex items-center justify-between px-4 z-10 shrink-0">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-mute">
                            Evidence Locker
                        </span>
                        <span
                            className={`text-[10px] font-mono tracking-[0.14em] ${
                                showDocSplit ? 'text-rose-500 font-semibold' : 'text-text-mute'
                            }`}
                        >
                            {docId}
                        </span>
                    </div>

                    <div className="flex-1 p-5 md:p-7 overflow-y-auto relative flex items-center justify-center">
                        {/* Subtle coordinate dot grid */}
                        <div
                            className="absolute inset-0 opacity-[0.14] pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-text-mute) 1px, transparent 0)',
                                backgroundSize: '24px 24px',
                            }}
                        />

                        {/* Laser sweep while scanning */}
                        {isRunning && activeStepIdx >= 0 && !reduced && (
                            <motion.div
                                aria-hidden="true"
                                className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
                                style={{
                                    background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
                                    boxShadow: `0 0 14px ${ACCENT}`,
                                }}
                                animate={{ top: ['8%', '92%', '8%'] }}
                                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        )}

                        <AnimatePresence mode="wait">
                            {!showDocContent && !showDocSplit && (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative z-10 text-center max-w-xs"
                                >
                                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl border border-hairline bg-panel flex items-center justify-center text-text-mute">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium text-text-strong mb-1">
                                        {isRunning ? 'Extracting vendor & HR records...' : 'Evidence viewer armed'}
                                    </p>
                                    <p className="text-xs text-text-mute font-mono">
                                        Click Run Check or pick Safe PO / COI Fraud above.
                                    </p>
                                </motion.div>
                            )}

                            {/* Single Doc View (Standard) */}
                            {showDocContent && (
                                <motion.div
                                    key="standard-doc"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    className="relative z-10 w-full max-w-lg rounded-xl border border-hairline-strong bg-panel p-6 md:p-7"
                                >
                                    <div className="flex justify-between items-start border-b border-hairline pb-4 mb-5">
                                        <div>
                                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-mute">
                                                Procurement Record
                                            </span>
                                            <h4 className="text-lg font-display font-medium text-text-strong mt-0.5">
                                                PURCHASE ORDER
                                            </h4>
                                        </div>
                                        <span className="text-xs font-mono px-2 py-1 rounded border border-hairline bg-bg text-text-mute">
                                            PO-2025-8821
                                        </span>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between border-b border-hairline/60 pb-2">
                                            <span className="text-text-mute">Vendor</span>
                                            <strong className="text-text-strong font-medium">TechSupply Corp.</strong>
                                        </div>
                                        <div className="flex justify-between border-b border-hairline/60 pb-2">
                                            <span className="text-text-mute">Line Item</span>
                                            <span className="text-text-strong">MacBook Pro M4 (x5)</span>
                                        </div>
                                        <div className="flex justify-between border-b border-hairline/60 pb-2">
                                            <span className="text-text-mute">Total Value</span>
                                            <span className="font-mono text-text-strong">$12,500.00</span>
                                        </div>
                                        <div className="flex justify-between pb-1">
                                            <span className="text-text-mute">Registered Address</span>
                                            <span className="font-mono text-xs text-text-mute">400 Commerce Way, Austin</span>
                                        </div>
                                    </div>

                                    <div className="mt-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/35 text-xs text-emerald-500 flex items-center gap-2 font-mono">
                                        <CheckCircle className="w-4 h-4 shrink-0" />
                                        Vendor verified against sanctions & HR directory. Zero flags.
                                    </div>
                                </motion.div>
                            )}

                            {/* Split View (COI DETECTED) */}
                            {showDocSplit && (
                                <motion.div
                                    key="coi-docs"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
                                >
                                    {/* Invoice */}
                                    <div className="rounded-xl border border-rose-500/45 bg-panel p-5 relative">
                                        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-rose-500 mb-3">
                                            Suspicious Invoice
                                        </div>
                                        <div className="space-y-1.5 text-xs">
                                            <div className="text-sm font-medium text-text-strong">Apex Consulting Ltd.</div>
                                            <div className="font-mono text-text-mute">Invoice #: INV-9921</div>
                                            <div className="font-mono text-text-strong">Amount: $45,000.00</div>
                                            <div className="mt-4 p-3 rounded-lg bg-rose-500/12 border border-rose-500/45 font-mono text-[11px] text-text-strong">
                                                <div className="text-[9px] uppercase tracking-[0.16em] text-rose-500 mb-1">
                                                    Billing Address
                                                </div>
                                                128 Maple Street, Apt 4B
                                                <br />
                                                Springfield, IL 62704
                                            </div>
                                        </div>
                                    </div>

                                    {/* HR Record */}
                                    <div className="rounded-xl border border-rose-500/45 bg-panel p-5 relative">
                                        <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-rose-500 mb-3">
                                            HR Employee Master
                                        </div>
                                        <div className="space-y-1.5 text-xs">
                                            <div className="text-sm font-medium text-text-strong">John Smith (Dir. Marketing)</div>
                                            <div className="font-mono text-text-mute">Employee ID: EMP-882910</div>
                                            <div className="font-mono text-text-mute">Tenure: 4.2 Years</div>
                                            <div className="mt-4 p-3 rounded-lg bg-rose-500/12 border border-rose-500/45 font-mono text-[11px] text-text-strong">
                                                <div className="text-[9px] uppercase tracking-[0.16em] text-rose-500 mb-1">
                                                    Home Address
                                                </div>
                                                128 Maple Street, Apt 4B
                                                <br />
                                                Springfield, IL 62704
                                            </div>
                                        </div>
                                    </div>

                                    {/* Overlap Banner */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.15 }}
                                        className="lg:col-span-2 p-3 rounded-lg bg-rose-500/12 border border-rose-500/45 flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-2 text-xs font-mono text-rose-500">
                                            <Fingerprint className="w-4 h-4 shrink-0" />
                                            <span>100% normalized address hash match between Vendor and Approver</span>
                                        </div>
                                        <span className="text-[10px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded bg-rose-500 text-white shrink-0">
                                            COI Match
                                        </span>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                {/* RIGHT: Role-Based Telemetry */}
                <section
                    className={`w-full md:w-[290px] lg:w-[320px] border-l border-hairline bg-panel/40 flex-col z-10 shrink-0 ${
                        mobileTab === 'data' ? 'flex' : 'hidden md:flex'
                    }`}
                >
                    <div className="px-4 py-3 border-b border-hairline flex justify-between items-center shrink-0">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong flex items-center gap-2">
                            {role === 'risk' && <><Radar className="w-3.5 h-3.5 text-amber-500" /> Risk Score</>}
                            {role === 'audit' && <><ClipboardCheck className="w-3.5 h-3.5 text-emerald-500" /> Audit Trail</>}
                            {role === 'tech' && <><Code className="w-3.5 h-3.5 text-sky-500" /> State JSON</>}
                        </h3>
                        <span className="text-[9px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border border-hairline text-text-mute">
                            {role}
                        </span>
                    </div>

                    <div className="flex-1 p-5 space-y-5 overflow-y-auto">
                        {role === 'risk' && (
                            <div className="space-y-5">
                                {/* Animated Radial Risk Score */}
                                <div className="rounded-xl p-4 border border-hairline bg-bg/70">
                                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute mb-3">
                                        Transaction Risk Index
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-16 h-16 shrink-0">
                                            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                                                <circle
                                                    cx="32"
                                                    cy="32"
                                                    r="26"
                                                    fill="none"
                                                    stroke="var(--color-hairline-strong)"
                                                    strokeWidth="5"
                                                />
                                                <motion.circle
                                                    cx="32"
                                                    cy="32"
                                                    r="26"
                                                    fill="none"
                                                    stroke={scoreColor}
                                                    strokeWidth="5"
                                                    strokeLinecap="round"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: gaugePct }}
                                                    transition={{ duration: reduced ? 0.1 : 0.7, ease: 'easeOut' }}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold text-text-strong">
                                                {riskScore ?? '--'}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-mono font-semibold text-text-strong leading-none">
                                                {riskScore ?? '--'}
                                                <span className="text-xs text-text-mute font-normal"> / 100</span>
                                            </div>
                                            <p
                                                className={`text-[11px] mt-1.5 leading-snug ${
                                                    isHighRisk ? 'text-rose-500 font-medium' : 'text-text-mute'
                                                }`}
                                            >
                                                {riskReason}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Control Indicators */}
                                <div className="space-y-2">
                                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute">
                                        Control Checks
                                    </div>
                                    {[
                                        { label: 'Budget Limit', val: checkBudget, ok: checkBudget === 'Pass', bad: false },
                                        { label: 'Conflict of Interest', val: checkCoi, ok: checkCoi === 'Clean', bad: checkCoi === 'FAIL' },
                                        { label: 'Price Variance', val: checkPrice, ok: checkPrice === 'Within 5% Range', bad: checkPrice.includes('25%') },
                                    ].map((row) => (
                                        <div
                                            key={row.label}
                                            className="flex justify-between items-center text-xs px-3 py-2.5 rounded-lg bg-bg/70 border border-hairline"
                                        >
                                            <span className="text-text-mute">{row.label}</span>
                                            <span
                                                className={`font-mono text-[11px] flex items-center gap-1 ${
                                                    row.bad
                                                        ? 'text-rose-500 font-semibold'
                                                        : row.ok
                                                          ? 'text-emerald-500'
                                                          : 'text-text-mute'
                                                }`}
                                            >
                                                {row.bad && <X className="w-3 h-3" />}
                                                {row.ok && <Check className="w-3 h-3" />}
                                                {row.val}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {role === 'audit' && (
                            <div className="space-y-4">
                                <div className="rounded-xl p-4 border border-hairline bg-bg/70 font-mono text-[11px]">
                                    <div className="text-[10px] uppercase tracking-[0.18em] text-text-mute mb-3 pb-2 border-b border-hairline">
                                        Immutable Audit Log
                                    </div>
                                    <div className="space-y-2">
                                        {auditLog.length === 0 ? (
                                            <div className="text-text-mute opacity-70">No events logged yet...</div>
                                        ) : (
                                            auditLog.map((entry) => (
                                                <div
                                                    key={entry.id}
                                                    className={
                                                        entry.level === 'alert'
                                                            ? 'text-rose-500 font-medium'
                                                            : entry.level === 'action'
                                                              ? 'text-text-strong font-medium'
                                                              : 'text-emerald-500'
                                                    }
                                                >
                                                    {entry.text}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleExport}
                                    className="w-full py-2.5 rounded-lg border border-hairline bg-panel hover:border-hairline-strong text-text-strong text-xs font-mono uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-colors"
                                >
                                    {exported ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                                            Evidence Pack Copied
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-3.5 h-3.5" />
                                            Export Evidence Pack
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {role === 'tech' && (
                            <div className="rounded-xl p-4 border border-hairline bg-bg font-mono text-[11px] leading-relaxed">
                                <div className="text-emerald-500 mb-2">{'// LangGraph State Snapshot'}</div>
                                <pre className="text-text whitespace-pre-wrap">
{JSON.stringify(
    {
        txn_id: scenario === 'coi' ? 'INV-9921' : 'PO-2025-8821',
        vendor_id: scenario === 'coi' ? 9921 : 8821,
        risk_score: riskScore,
        flags: scenario === 'coi' && stepStatus[1] === 'risk' ? ['COI_ADDRESS_MATCH', 'PRICE_OUTLIER'] : [],
        status:
            riskScore === null
                ? isRunning
                    ? 'EVALUATING'
                    : 'IDLE'
                : isHighRisk
                  ? 'BLOCKED_FOR_AUDIT'
                  : 'AUTO_APPROVED',
    },
    null,
    2
)}
                                </pre>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden h-13 bg-panel border-t border-hairline flex justify-around items-center shrink-0">
                {(
                    [
                        { id: 'flow', label: 'Flow', Icon: Network },
                        { id: 'docs', label: 'Evidence', Icon: FileText },
                        { id: 'data', label: 'Risk', Icon: Radar },
                    ] as const
                ).map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setMobileTab(id)}
                        className={`flex-1 h-full flex flex-col items-center justify-center text-[10px] font-mono uppercase tracking-[0.14em] border-t-2 transition-colors ${
                            mobileTab === id
                                ? 'border-rose-500 text-text-strong'
                                : 'border-transparent text-text-mute'
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

export default RiskGuardDemo;
