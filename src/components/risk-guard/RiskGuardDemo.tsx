import { useState } from 'react';
import {
    ShieldCheck,
    Network,
    FileText,
    ScanFace,
    Search,
    Gavel,
    Play,
    CheckCircle,
    Fingerprint,
    Radar,
    Thermometer,
    Check,
    X,
    ClipboardCheck,
    Code,
    Download,
    AlertTriangle
} from 'lucide-react';
import './RiskGuardDemo.css';

type Role = 'risk' | 'audit' | 'tech';
type Scenario = 'standard' | 'coi';

const RiskGuardDemo = () => {
    const [role, setRole] = useState<Role>('risk');
    const [scenario, setScenario] = useState<Scenario>('standard');
    const [isRunning, setIsRunning] = useState(false);
    const [stepStatus, setStepStatus] = useState<('idle' | 'active' | 'risk')[]>(['idle', 'idle', 'idle', 'idle']);
    const [mobileTab, setMobileTab] = useState<'flow' | 'docs' | 'data'>('flow');

    // Data States
    const [riskScore, setRiskScore] = useState<string>("--");
    const [riskReason, setRiskReason] = useState<string>("Waiting for analysis...");
    const [checkCoi, setCheckCoi] = useState<string>("--");
    const [checkPrice, setCheckPrice] = useState<string>("--");
    const [auditLog, setAuditLog] = useState<React.ReactNode[]>([]);
    const [showDocContent, setShowDocContent] = useState(false);
    const [showDocSplit, setShowDocSplit] = useState(false);
    const [docId, setDocId] = useState("WAITING FOR INPUT...");
    const [showCoiAlert, setShowCoiAlert] = useState(false);

    const resetUI = () => {
        setStepStatus(['idle', 'idle', 'idle', 'idle']);
        setRiskScore("--");
        setRiskReason("Waiting for analysis...");
        setCheckCoi("--");
        setCheckPrice("--");
        setShowDocContent(false);
        setShowDocSplit(false);
        setDocId("WAITING FOR INPUT...");
        setShowCoiAlert(false);
        setAuditLog([<div key="init" className="opacity-50">Log empty...</div>]);
    };

    const runSimulation = async () => {
        if (isRunning) return;
        setIsRunning(true);
        resetUI();

        if (window.innerWidth < 768) setMobileTab('flow');

        // STEP 1: POLICY
        await new Promise(r => setTimeout(r, 500));
        updateStep(0, false);

        // STEP 2: ENTITY
        await new Promise(r => setTimeout(r, 1200));
        const isRisk = scenario === 'coi';
        updateStep(1, isRisk);

        if (scenario === 'standard') {
            setShowDocContent(true);
            setDocId("DOC-ID: PO-2025-8821");
        } else {
            setShowDocSplit(true);
            setDocId("ALERT: IDENTITY OVERLAP");
            setShowCoiAlert(true);
        }

        // STEP 3: PRICE
        await new Promise(r => setTimeout(r, 1500));
        updateStep(2, false);

        // STEP 4: DECISION
        await new Promise(r => setTimeout(r, 1000));
        updateStep(3, isRisk);

        // Update Data
        if (scenario === 'standard') {
            setRiskScore("15");
            setRiskReason("Low Risk. Approved automatically.");
            setCheckCoi("Clean");
            setCheckPrice("Within 5% Range");
                            setAuditLog([
                                <div key="1" className="text-xs text-green-700">[INFO] Policy Check Passed</div>,
                                <div key="2" className="text-xs text-green-700">[INFO] No Entity Match</div>,
                                <div key="3" className="text-xs font-bold text-slate-800">ACTION: AUTO-APPROVE</div>
                            ]);
        } else {
            setRiskScore("98");
            setRiskReason("CRITICAL: Conflict of Interest Detected.");
            setCheckCoi("FAIL");
            setCheckPrice("25% Above Market");
                            setAuditLog([
                                <div key="1" className="text-xs text-green-700">[INFO] Policy Check Passed</div>,
                                <div key="2" className="text-xs text-red-600 font-bold">[ALERT] Address Match: 128 Maple St</div>,
                                <div key="3" className="text-xs font-bold text-red-700">ACTION: BLOCK & ESCALATE</div>
                            ]);
        }

        setIsRunning(false);
    };

    const updateStep = (index: number, isRisk: boolean) => {
        setStepStatus(prev => {
            const newStatus = [...prev];
            newStatus[index] = isRisk ? 'risk' : 'active';
            return newStatus;
        });
    };

    return (
        <div className="h-[800px] flex flex-col font-sans bg-[#0F172A] text-slate-200 overflow-hidden border border-slate-700 rounded-xl shadow-2xl">

            {/* Header */}
            <header className="h-14 md:h-16 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4 md:px-6 z-50 shrink-0 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-600 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-rose-500/20">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-base md:text-lg leading-tight tracking-tight text-white">RiskGuard <span className="text-rose-400">AI</span></h1>
                        <div className="hidden md:block text-[10px] text-slate-400 font-mono tracking-widest uppercase">Internal Control System</div>
                    </div>
                </div>

                {/* Role Switcher (Desktop) */}
                <div className="hidden md:flex bg-slate-800 rounded-lg p-1 border border-slate-700 gap-1">
                    {(['risk', 'audit', 'tech'] as Role[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`role-btn px-3 py-1.5 rounded-md text-xs font-bold transition-all hover:text-white ${role === r ? 'active' : 'text-slate-400'}`}
                        >
                            {r === 'risk' ? 'Risk Manager' : r === 'audit' ? 'Internal Audit' : 'IT Security'}
                        </button>
                    ))}
                </div>

                {/* Scenario Selector */}
                <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 gap-2">
                    <button
                        onClick={() => { setScenario('standard'); resetUI(); }}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${scenario === 'standard' ? 'bg-green-600 text-white border-green-500 shadow-[0_0_15px_rgba(22,163,74,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
                    >
                        <CheckCircle className="w-3.5 h-3.5" /> Safe Transaction
                    </button>
                    <button
                        onClick={() => { setScenario('coi'); resetUI(); }}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${scenario === 'coi' ? 'bg-rose-600 text-white border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
                    >
                        <AlertTriangle className={`w-3.5 h-3.5 ${scenario === 'coi' ? 'animate-pulse' : ''}`} /> High Risk (COI)
                    </button>
                </div>
            </header>

            {/* Role Switcher (Mobile Dropdown) */}
            <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-2 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-bold uppercase">View Mode:</span>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="bg-slate-800 text-white text-xs border border-slate-700 rounded px-2 py-1 outline-none"
                >
                    <option value="risk">Risk Manager</option>
                    <option value="audit">Internal Audit</option>
                    <option value="tech">IT Security</option>
                </select>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden relative">

                {/* LEFT: Workflow Visualizer */}
                <section className={`w-full md:w-[350px] lg:w-[400px] border-r border-slate-700 bg-[#0B1120] flex-col relative z-20 ${mobileTab === 'flow' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur shrink-0 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                            <Network className="w-4 h-4" /> Control Framework
                        </h2>
                        <span className="text-[9px] font-mono text-slate-500">MONITORING</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-2 relative risk-guard-scroll">
                        {/* Node 1 */}
                        <div className="relative pl-12 group">
                            <div className={`flow-line ${stepStatus[0] !== 'idle' ? 'active' : ''}`}></div>
                            <div className="absolute left-0 top-0 w-12 h-full flex justify-center">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-colors icon-wrapper ${stepStatus[0] !== 'idle' ? (stepStatus[0] === 'risk' ? 'bg-rose-600 border-rose-400 text-white' : 'bg-rose-500 border-rose-400 text-white') : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    <FileText className="w-3 h-3" />
                                </div>
                            </div>
                            <div className={`node-card p-4 rounded-xl ${stepStatus[0] === 'active' ? 'node-active' : stepStatus[0] === 'risk' ? 'node-risk' : ''}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold text-white">Policy Check</h3>
                                    <span className="text-[9px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 status-badge">
                                        {stepStatus[0] === 'idle' ? 'Idle' : stepStatus[0] === 'risk' ? 'Risk' : 'Active'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 node-desc">Validating PO limits, budget codes, and authorization levels.</p>
                            </div>
                        </div>

                        {/* Node 2 */}
                        <div className="relative pl-12 group mt-6">
                            <div className={`flow-line ${stepStatus[1] !== 'idle' ? 'active' : ''}`}></div>
                            <div className="absolute left-0 top-0 w-12 h-full flex justify-center">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-colors icon-wrapper ${stepStatus[1] !== 'idle' ? (stepStatus[1] === 'risk' ? 'bg-rose-600 border-rose-400 text-white' : 'bg-rose-500 border-rose-400 text-white') : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    <ScanFace className="w-3 h-3" />
                                </div>
                            </div>
                            <div className={`node-card p-4 rounded-xl ${stepStatus[1] === 'active' ? 'node-active' : stepStatus[1] === 'risk' ? 'node-risk' : ''}`}>
                                <h3 className="text-sm font-bold text-white mb-1">Entity Resolution</h3>
                                <p className="text-xs text-slate-400 node-desc">Cross-referencing Vendor Master Data vs. HR Employee DB.</p>
                                {showCoiAlert && (
                                    <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded flex items-center gap-2">
                                        <Fingerprint className="text-red-400 w-4 h-4" />
                                        <span className="text-xs text-red-200">Identity Match Found</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Node 3 */}
                        <div className="relative pl-12 group mt-6">
                            <div className={`flow-line ${stepStatus[2] !== 'idle' ? 'active' : ''}`}></div>
                            <div className="absolute left-0 top-0 w-12 h-full flex justify-center">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-colors icon-wrapper ${stepStatus[2] !== 'idle' ? (stepStatus[2] === 'risk' ? 'bg-rose-600 border-rose-400 text-white' : 'bg-rose-500 border-rose-400 text-white') : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    <Search className="w-3 h-3" />
                                </div>
                            </div>
                            <div className={`node-card p-4 rounded-xl ${stepStatus[2] === 'active' ? 'node-active' : stepStatus[2] === 'risk' ? 'node-risk' : ''}`}>
                                <h3 className="text-sm font-bold text-white mb-1">Market Benchmark</h3>
                                <p className="text-xs text-slate-400 node-desc">Comparing unit pricing against historical averages.</p>
                            </div>
                        </div>

                        {/* Node 4 */}
                        <div className="relative pl-12 group mt-6">
                            <div className="absolute left-0 top-0 w-12 h-full flex justify-center">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-colors icon-wrapper ${stepStatus[3] !== 'idle' ? (stepStatus[3] === 'risk' ? 'bg-rose-600 border-rose-400 text-white' : 'bg-rose-500 border-rose-400 text-white') : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    <Gavel className="w-3 h-3" />
                                </div>
                            </div>
                            <div className={`node-card p-4 rounded-xl ${stepStatus[3] === 'active' ? 'node-active' : stepStatus[3] === 'risk' ? 'node-risk' : ''}`}>
                                <h3 className="text-sm font-bold text-white mb-1">Control Decision</h3>
                                <p className="text-xs text-slate-400 node-desc">Final Risk Score Calculation & Action.</p>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-slate-700 bg-slate-900 shrink-0">
                        <button
                            onClick={runSimulation}
                            disabled={isRunning}
                            className={`w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Play className="w-4 h-4" /> Run Control Check
                        </button>
                    </div>
                </section>

                {/* CENTER: Evidence Investigator */}
                <section className={`flex-1 bg-slate-100 flex-col relative overflow-hidden ${mobileTab === 'docs' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-slate-300 font-display text-4xl font-bold opacity-20 transform -rotate-12">CONFIDENTIAL</div>
                    </div>

                    <div className="h-10 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-sm z-10 shrink-0">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Evidence Locker</span>
                        <span className="text-[10px] font-mono text-slate-400">{docId}</span>
                    </div>

                    {/* The PDF View */}
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto relative risk-guard-scroll">
                        {!showDocContent && !showDocSplit && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                                <FileText className="w-16 h-16 mb-4" />
                                <p className="text-sm">Agent is scanning documents...</p>
                            </div>
                        )}

                        {/* Single Doc View (Standard) */}
                        {showDocContent && (
                            <div className="bg-white shadow-xl min-h-[500px] w-full max-w-2xl mx-auto p-8 doc-preview relative border border-slate-200">
                                <div className="flex justify-between items-center border-b pb-4 mb-4">
                                    <h1 className="text-xl font-bold text-slate-800">PURCHASE ORDER</h1>
                                    <span className="text-xs font-mono text-slate-500">PO-2025-8821</span>
                                </div>
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between"><span>Vendor:</span> <strong>TechSupply Corp.</strong></div>
                                    <div className="flex justify-between"><span>Item:</span> <span>MacBook Pro M4 (x5)</span></div>
                                    <div className="flex justify-between"><span>Total:</span> <span>$12,500.00</span></div>
                                    <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700 flex items-center">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Vendor Verified. No flags.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Split View (COI DETECTED) */}
                        {showDocSplit && (
                            <div className="w-full h-full flex flex-col md:flex-row gap-4">
                                {/* Invoice */}
                                <div className="flex-1 bg-white shadow-lg p-6 doc-preview overflow-y-auto border-t-4 border-rose-500 relative">
                                    <div className="text-[10px] font-bold text-rose-600 mb-2 uppercase">Suspicious Invoice</div>
                                    <div className="text-xs space-y-2">
                                        <div className="font-bold">Apex Consulting Ltd.</div>
                                        <div>Inv #: 9921</div>
                                        <div>Amount: $45,000</div>
                                        <div className="mt-4 p-2 highlight-risk">
                                            <strong>Address:</strong><br />
                                            128 Maple Street, Apt 4B<br />
                                            Springfield, IL 62704
                                        </div>
                                    </div>
                                </div>

                                {/* HR Record */}
                                <div className="flex-1 bg-white shadow-lg p-6 doc-preview overflow-y-auto border-t-4 border-rose-500 relative">
                                    <div className="text-[10px] font-bold text-rose-600 mb-2 uppercase">HR Employee Record</div>
                                    <div className="text-xs space-y-2">
                                        <div className="font-bold">John Smith (Director of Marketing)</div>
                                        <div>Emp ID: 882910</div>
                                        <div>Tenure: 4 Years</div>
                                        <div className="mt-4 p-2 highlight-risk">
                                            <strong>Home Address:</strong><br />
                                            128 Maple Street, Apt 4B<br />
                                            Springfield, IL 62704
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl z-20">
                                        MATCH FOUND
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* RIGHT: Data Dashboard (Role Based) */}
                <section className={`w-full md:w-[320px] lg:w-[350px] border-l border-slate-700 bg-[#0B1120] flex-col z-20 shadow-2xl ${mobileTab === 'data' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur shrink-0">
                        <h2 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center justify-between">
                            <span>
                                {role === 'risk' && <><Radar className="inline w-4 h-4 mr-2" />Risk Assessment</>}
                                {role === 'audit' && <><ClipboardCheck className="inline w-4 h-4 mr-2" />Audit Trail</>}
                                {role === 'tech' && <><Code className="inline w-4 h-4 mr-2" />System Logs</>}
                            </span>
                            <span className="text-[9px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">{role.toUpperCase()} MGR</span>
                        </h2>
                    </div>

                    <div className="flex-1 p-6 space-y-6 overflow-y-auto risk-guard-scroll">

                        {/* RISK MANAGER VIEW */}
                        {role === 'risk' && (
                            <div className="role-view">
                                {/* Score Card */}
                                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 relative overflow-hidden mb-6">
                                    <div className="absolute top-0 right-0 p-2 opacity-20"><Thermometer className="w-16 h-16 text-white" /></div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Transaction Risk Score</div>
                                    <div className={`text-4xl font-mono font-bold flex items-end gap-2 ${scenario === 'coi' && stepStatus[3] !== 'idle' ? 'text-rose-500 animate-pulse' : scenario === 'standard' && stepStatus[3] !== 'idle' ? 'text-green-400' : 'text-white'}`}>
                                        <span>{riskScore}</span><span className="text-lg text-slate-500 mb-1">/100</span>
                                    </div>
                                    <div className={`text-[10px] mt-2 ${scenario === 'coi' && stepStatus[3] !== 'idle' ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                                        {riskReason}
                                    </div>
                                </div>

                                {/* Risk Indicators */}
                                <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Control Checks</div>
                                    <div className="flex justify-between items-center text-xs p-2 bg-slate-800 rounded border border-slate-700">
                                        <span className="text-slate-300">Budget Limit</span>
                                        <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Pass</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs p-2 bg-slate-800 rounded border border-slate-700">
                                        <span className="text-slate-300">Conflict of Interest</span>
                                        <span className={`${checkCoi === 'FAIL' ? 'text-rose-500 font-bold flex items-center gap-1' : checkCoi === 'Clean' ? 'text-green-400 flex items-center gap-1' : 'text-slate-500'}`}>
                                            {checkCoi === 'FAIL' ? <X className="w-3 h-3" /> : checkCoi === 'Clean' ? <Check className="w-3 h-3" /> : ''} {checkCoi}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs p-2 bg-slate-800 rounded border border-slate-700">
                                        <span className="text-slate-300">Price Variance</span>
                                        <span className="text-slate-500">{checkPrice}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AUDIT VIEW */}
                        {role === 'audit' && (
                            <div className="role-view space-y-4">
                                <div className="bg-white text-slate-900 rounded-lg p-3 border border-slate-300 shadow-sm font-mono text-[10px]">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 border-b pb-1">Immutable Audit Log</div>
                                    <div className="space-y-2">
                                        {auditLog}
                                    </div>
                                </div>
                                <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded border border-slate-600 flex items-center justify-center gap-1">
                                    <Download className="w-3 h-3" /> Export Evidence Pack
                                </button>
                            </div>
                        )}

                        {/* TECH VIEW */}
                        {role === 'tech' && (
                            <div className="role-view space-y-4">
                                <div className="bg-black rounded-lg p-3 border border-slate-700 font-mono text-[10px]">
                                    <div className="text-green-400 mb-2">// LangGraph State Snapshot</div>
                                    <div className="space-y-1">
                                        <div><span className="json-key">"txn_id"</span>: <span className="json-str">"PO-8821"</span>,</div>
                                        <div><span className="json-key">"vendor_id"</span>: <span className="json-num">9921</span>,</div>
                                        <div><span className="json-key">"flags"</span>: [
                                            {scenario === 'coi' && stepStatus[1] !== 'idle' ? <span className="json-str">"COI_DETECTED"</span> : ''}
                                            ]</div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </section>

            </main>

            {/* MOBILE BOTTOM NAV */}
            <nav className="md:hidden h-14 bg-slate-900 border-t border-slate-800 flex justify-around items-center shrink-0 z-50 relative">
                <button
                    onClick={() => setMobileTab('flow')}
                    className={`mobile-tab flex-1 h-full flex flex-col items-center justify-center text-[10px] ${mobileTab === 'flow' ? 'active' : 'text-slate-400'}`}
                >
                    <Network className="w-4 h-4 mb-1" /> Flow
                </button>
                <button
                    onClick={() => setMobileTab('docs')}
                    className={`mobile-tab flex-1 h-full flex flex-col items-center justify-center text-[10px] ${mobileTab === 'docs' ? 'active' : 'text-slate-400'}`}
                >
                    <FileText className="w-4 h-4 mb-1" /> Evidence
                </button>
                <button
                    onClick={() => setMobileTab('data')}
                    className={`mobile-tab flex-1 h-full flex flex-col items-center justify-center text-[10px] ${mobileTab === 'data' ? 'active' : 'text-slate-400'}`}
                >
                    <Radar className="w-4 h-4 mb-1" /> Risk
                </button>
            </nav>
        </div>
    );
};

export default RiskGuardDemo;
