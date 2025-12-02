import { useState, useEffect } from 'react';
import {
    SquareKanban,
    Network,
    ListTodo,
    Brain,
    UserCog,
    Scale,
    Bot,
    Play,
    Ghost,
    CheckCheck,
    AlertTriangle,
    Wand2,
    Ban,
    TrendingUp,
    Code,
    Users,
    Layout,
    Github,
    Palette,
    Database,
    Key,
    Globe,
    FileText
} from 'lucide-react';
import './ProjectFlowDemo.css';

type Role = 'product' | 'devops' | 'team';
type Scenario = 'groom' | 'creep' | 'close';
type CardType = 'normal' | 'creep';

interface Card {
    id: string;
    title: string;
    tag: string;
    icon: any;
    border: string;
    user?: string;
    pts?: string;
    type?: CardType;
    action?: 'close' | 'block';
    reason?: string;
    skill?: string;
    name?: string;
    color?: string;
}

const ProjectFlowDemo = () => {
    const [role, setRole] = useState<Role>('product');
    const [scenario, setScenario] = useState<Scenario>('groom');
    const [isRunning, setIsRunning] = useState(false);
    const [stepStatus, setStepStatus] = useState<('idle' | 'active' | 'warning' | 'hitl')[]>(['idle', 'idle', 'idle', 'idle', 'idle']);
    const [mobileTab, setMobileTab] = useState<'flow' | 'board' | 'data'>('flow');

    // Board State
    const [backlog, setBacklog] = useState<Card[]>([]);
    const [progress, setProgress] = useState<Card[]>([]);
    const [done, setDone] = useState<Card[]>([]);

    // Data State
    const [logs, setLogs] = useState<React.ReactNode[]>([]);
    const [velocity] = useState(32);
    const [jsonPayload, setJsonPayload] = useState<React.ReactNode>(<div className="opacity-50">Waiting for action...</div>);
    const [showHitl, setShowHitl] = useState(false);

    // Raw Data
    const rawCards: Record<string, Card> = {
        '102': { id: '102', title: "API: Optimize Rate Limiting", tag: "backend", icon: Github, border: "border-l-blue-500", color: 'bg-purple-500', user: 'S', name: 'Sarah', skill: 'Backend' },
        '103': { id: '103', title: "UI: Dark Mode Toggle", tag: "frontend", icon: Palette, border: "border-l-green-500", color: 'bg-green-500', user: 'M', name: 'Mike', skill: 'Frontend' },
        '104': { id: '104', title: "Infra: Docker Build Fix", tag: "devops", icon: Database, border: "border-l-yellow-500", color: 'bg-blue-500', user: 'A', name: 'Alex', skill: 'DevOps' },
        '105': { id: '105', title: "Make it pop", tag: "design", icon: FileText, border: "border-l-red-500", type: 'creep', color: 'bg-slate-600', user: '?', name: 'Unknown', skill: 'Design' },
        '99': { id: '99', title: "DB Migration", tag: "backend", icon: Database, border: "border-l-purple-500", user: 'S', pts: '5 pts', action: 'close', reason: 'PR Merged & Tests Passed' },
        '100': { id: '100', title: "Auth: Refresh Token", tag: "security", icon: Key, border: "border-l-red-500", user: 'S', pts: '3 pts', action: 'close', reason: 'PR Merged' },
        '101': { id: '101', title: "Landing Page V2", tag: "frontend", icon: Globe, border: "border-l-green-500", user: 'M', pts: '5 pts', action: 'block', reason: 'Tests Failed (CI)' }
    };

    const resetUI = () => {
        setStepStatus(['idle', 'idle', 'idle', 'idle', 'idle']);
        setLogs([<div key="init" className="text-slate-600 italic">Waiting for analysis...</div>]);
        setJsonPayload(<div className="opacity-50">Waiting for action...</div>);
        setShowHitl(false);

        if (scenario === 'close') {
            setBacklog([]);
            setProgress([rawCards['99'], rawCards['101'], rawCards['100']]);
            setDone([]);
        } else {
            const cards = [rawCards['102'], rawCards['103'], rawCards['104']];
            if (scenario === 'creep') cards.splice(1, 0, rawCards['105']);
            setBacklog(cards);
            setProgress([{ ...rawCards['99'], user: 'S', pts: '5 pts' }]); // Sample in progress
            setDone([]);
        }
    };

    useEffect(() => {
        resetUI();
    }, [scenario]);

    const addLog = (text: string, color: string = "text-slate-400") => {
        setLogs(prev => [<div key={Date.now() + Math.random()} className={`${color} border-l-2 border-slate-700 pl-2 animate-pulse mb-1`}>{text}</div>, ...prev]);
    };

    const updateStep = (index: number, status: 'idle' | 'active' | 'warning' | 'hitl') => {
        setStepStatus(prev => {
            const next = [...prev];
            next[index] = status;
            return next;
        });
    };

    const runSimulation = async () => {
        if (isRunning) return;
        setIsRunning(true);
        resetUI();

        if (window.innerWidth < 768) setMobileTab('flow');

        // Queue setup
        let queue: Card[] = [];
        if (scenario === 'close') {
            queue = [rawCards['99'], rawCards['101'], rawCards['100']];
        } else if (scenario === 'groom') {
            queue = [rawCards['102'], rawCards['103'], rawCards['104']];
        } else {
            queue = [rawCards['102'], rawCards['105'], rawCards['103']];
        }

        // STEP 1: SCAN
        await new Promise(r => setTimeout(r, 500));
        updateStep(0, 'active');
        addLog(scenario === 'close' ? "Scanner: Monitoring In-Progress..." : "Scanner: Found unassigned tickets.", "text-white");

        for (const item of queue) {
            // STEP 2: CONTEXT
            await new Promise(r => setTimeout(r, 800));
            updateStep(1, 'active');

            if (scenario === 'close') {
                if (item.action === 'block') {
                    addLog(`PROJ-${item.id}: CI Checks FAILED.`, "text-red-400");

                    // Step 3 (DoD)
                    await new Promise(r => setTimeout(r, 600));
                    updateStep(3, 'warning');

                    // Step 4 (Action)
                    await new Promise(r => setTimeout(r, 600));
                    updateStep(4, 'active');

                    // Update Card Visual
                    setProgress(prev => prev.map(c => c.id === item.id ? { ...c, border: 'border-l-red-500', action: 'block' } : c));
                    setJsonPayload(<div><span className="json-key">"key"</span>: "PROJ-{item.id}", <span className="json-num">"block"</span>: true</div>);
                } else {
                    addLog(`PROJ-${item.id}: All Checks Passed.`, "text-green-400");

                    // Step 3 & 4
                    await new Promise(r => setTimeout(r, 600));
                    updateStep(3, 'active');
                    await new Promise(r => setTimeout(r, 600));
                    updateStep(4, 'active');

                    // Move Card
                    setProgress(prev => prev.filter(c => c.id !== item.id));
                    setDone(prev => [...prev, item]);
                    setJsonPayload(<div><span className="json-key">"key"</span>: "PROJ-{item.id}", <span className="json-str">"status"</span>: "DONE"</div>);
                }
                continue;
            }

            // GROOM / CREEP
            if (item.type === 'creep') {
                updateStep(1, 'warning');
                addLog(`PROJ-${item.id}: Ambiguity Detected.`, "text-yellow-400 font-bold");

                updateStep(2, 'hitl');
                setShowHitl(true);
                return; // Pause for interaction
            } else {
                addLog(`Analyzing PROJ-${item.id}...`, "text-slate-500");

                await new Promise(r => setTimeout(r, 600));
                updateStep(3, 'active');
                addLog(`[${item.name}] Matched ${item.skill}.`, "text-blue-300");

                await new Promise(r => setTimeout(r, 600));
                updateStep(4, 'active');

                // Move Card
                setBacklog(prev => prev.filter(c => c.id !== item.id));
                setProgress(prev => [...prev, { ...item, user: item.user, pts: '3 pts' }]); // Assign pts/user
                addLog(`Assigned PROJ-${item.id} -> ${item.name}`, "text-green-400");
            }
        }

        setIsRunning(false);
        addLog("BATCH COMPLETE", "text-white font-bold bg-slate-700 p-1 rounded text-center mt-4");
    };

    const resolveHitl = async (action: 'fix' | 'reject') => {
        setShowHitl(false);
        updateStep(2, 'active'); // Reset HITL node

        if (action === 'fix') {
            addLog("User: Auto-Fix Specs", "text-blue-300");
            addLog("LLM Generating scenarios...", "text-slate-500");

            updateStep(4, 'active');

            // Fix the creep card
            const fixedCard = { ...rawCards['105'], title: "Update Landing Hero CSS", user: 'M', name: 'Mike', color: 'bg-green-500' };
            setBacklog(prev => prev.filter(c => c.id !== '105'));
            setProgress(prev => [...prev, fixedCard]);

            addLog(`PROJ-105 Assigned -> Mike`, "text-green-400");
        } else {
            addLog("User: REJECT", "text-red-400");
            setBacklog(prev => prev.map(c => c.id === '105' ? { ...c, border: 'border-l-red-500', action: 'block' } : c)); // Mark as rejected visually
            addLog("PROJ-105 Rejected.", "text-red-300");
        }

        addLog("Resuming...", "text-white italic mt-2");
        setTimeout(() => {
            // Finish the queue (hardcoded for demo simplicity since we know it's the middle item)
            const remaining = [rawCards['103']];
            finishQueue(remaining);
        }, 1000);
    };

    const finishQueue = async (queue: Card[]) => {
        for (const item of queue) {
            addLog(`Analyzing PROJ-${item.id}...`, "text-slate-500");
            await new Promise(r => setTimeout(r, 600));
            updateStep(3, 'active');
            addLog(`[${item.name}] Matched ${item.skill}.`, "text-blue-300");
            await new Promise(r => setTimeout(r, 600));
            updateStep(4, 'active');
            setBacklog(prev => prev.filter(c => c.id !== item.id));
            setProgress(prev => [...prev, { ...item, user: item.user, pts: '3 pts' }]);
            addLog(`Assigned PROJ-${item.id} -> ${item.name}`, "text-green-400");
        }
        setIsRunning(false);
        addLog("BATCH COMPLETE", "text-white font-bold bg-slate-700 p-1 rounded text-center mt-4");
    };

    return (
        <div className="h-[800px] flex flex-col font-sans bg-[#0F172A] text-slate-200 overflow-hidden border border-slate-700 rounded-xl shadow-2xl">

            {/* Header */}
            <header className="h-14 md:h-16 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4 md:px-6 z-50 shrink-0 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                        <SquareKanban className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-base md:text-lg leading-tight tracking-tight text-white">ProjectFlow <span className="text-blue-400">AI</span></h1>
                        <div className="hidden md:block text-[10px] text-slate-400 font-mono tracking-widest uppercase">Intelligent Scrum Master</div>
                    </div>
                </div>

                {/* Role Switcher */}
                <div className="hidden md:flex bg-slate-800 rounded-lg p-1 border border-slate-700 gap-1">
                    {(['product', 'devops', 'team'] as Role[]).map(r => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`role-btn px-3 py-1.5 rounded-md text-xs font-bold transition-all hover:text-white ${role === r ? 'active' : 'text-slate-400'}`}
                        >
                            {r === 'product' ? 'Product Owner' : r === 'devops' ? 'DevOps' : 'Team View'}
                        </button>
                    ))}
                </div>

                {/* Scenario Selector */}
                <div className="flex bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 gap-2">
                    <button
                        onClick={() => { setScenario('groom'); resetUI(); }}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${scenario === 'groom' ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
                    >
                        <ListTodo className="w-3.5 h-3.5" /> Batch Groom
                    </button>
                    <button
                        onClick={() => { setScenario('creep'); resetUI(); }}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${scenario === 'creep' ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
                    >
                        <Ghost className={`w-3.5 h-3.5 ${scenario === 'creep' ? 'animate-bounce' : ''}`} /> Scope Creep
                    </button>
                    <button
                        onClick={() => { setScenario('close'); resetUI(); }}
                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all flex items-center gap-2 border ${scenario === 'close' ? 'bg-green-600 text-white border-green-500 shadow-[0_0_15px_rgba(22,163,74,0.4)] scale-105' : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'}`}
                    >
                        <CheckCheck className={`w-3.5 h-3.5 ${scenario === 'close' ? 'animate-pulse' : ''}`} /> Auto-Close
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden relative">

                {/* LEFT: Workflow Visualizer */}
                <section className={`w-full md:w-[350px] lg:w-[400px] border-r border-slate-700 bg-[#0B1120] flex-col relative z-20 ${mobileTab === 'flow' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur shrink-0 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                            <Network className="w-4 h-4" /> Agent Thought Process
                        </h2>
                        <span className="text-[9px] font-mono text-slate-500">{isRunning ? 'RUNNING' : 'IDLE'}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-2 relative project-flow-scroll">
                        {/* Node 1 */}
                        <div className="relative pl-12 group">
                            <div className={`flow-line ${stepStatus[0] !== 'idle' ? 'active' : ''}`}></div>
                            <div className="absolute left-0 top-0 w-12 h-full flex justify-center">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-colors icon-wrapper ${stepStatus[0] !== 'idle' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    <ListTodo className="w-3 h-3" />
                                </div>
                            </div>
                            <div className={`node-card p-4 rounded-xl ${stepStatus[0] === 'active' ? 'node-active' : ''}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold text-white">Board Scanner</h3>
                                    <span className="text-[9px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 status-badge">Jira API</span>
                                </div>
                                <p className="text-[11px] text-slate-400 node-desc">Reading current board state.</p>
                            </div>
                        </div>

                        {/* Node 2 */}
                        <div className="relative pl-12 group mt-6">
                            <div className={`flow-line ${stepStatus[1] !== 'idle' ? 'active' : ''}`}></div>
                            <div className="absolute left-0 top-0 w-12 h-full flex justify-center">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-colors icon-wrapper ${stepStatus[1] !== 'idle' ? (stepStatus[1] === 'warning' ? 'bg-orange-600 border-orange-400 text-white' : 'bg-blue-600 border-blue-400 text-white') : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    <Brain className="w-3 h-3" />
                                </div>
                            </div>
                            <div className={`node-card p-4 rounded-xl ${stepStatus[1] === 'active' ? 'node-active' : stepStatus[1] === 'warning' ? 'node-warning' : ''}`}>
                                <h3 className="text-sm font-bold text-white mb-1">Context Engine</h3>
                                <p className="text-[11px] text-slate-400 node-desc">Analyzing Specs or PR Status.</p>
                            </div>
                        </div>

                        {/* Node 2.5 HITL */}
                        <div className="relative pl-12 group mt-6">
                            <div className={`flow-line ${stepStatus[2] !== 'idle' ? 'active' : ''}`}></div>
                            <div className="absolute left-0 top-0 w-12 h-full flex justify-center">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-colors icon-wrapper ${stepStatus[2] !== 'idle' ? 'bg-orange-600 border-orange-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    <UserCog className="w-3 h-3" />
                                </div>
                            </div>
                            <div className={`node-card p-4 rounded-xl ${stepStatus[2] === 'hitl' ? 'node-hitl' : stepStatus[2] === 'active' ? 'node-active' : ''}`}>
                                <h3 className="text-sm font-bold text-white mb-1">Human Review</h3>
                                <p className="text-[11px] text-slate-400 node-desc">Waiting for Product Owner decision.</p>
                                {stepStatus[2] === 'hitl' && (
                                    <div className="mt-2 flex gap-1">
                                        <span className="text-[9px] bg-yellow-900/50 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30">INTERRUPT</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Node 3 */}
                        <div className="relative pl-12 group mt-6">
                            <div className={`flow-line ${stepStatus[3] !== 'idle' ? 'active' : ''}`}></div>
                            <div className="absolute left-0 top-0 w-12 h-full flex justify-center">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-colors icon-wrapper ${stepStatus[3] !== 'idle' ? (stepStatus[3] === 'warning' ? 'bg-orange-600 border-orange-400 text-white' : 'bg-blue-600 border-blue-400 text-white') : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    <Scale className="w-3 h-3" />
                                </div>
                            </div>
                            <div className={`node-card p-4 rounded-xl ${stepStatus[3] === 'active' ? 'node-active' : stepStatus[3] === 'warning' ? 'node-warning' : ''}`}>
                                <h3 className="text-sm font-bold text-white mb-1">{scenario === 'close' ? 'Definition of Done' : 'Load Balancer'}</h3>
                                <p className="text-[11px] text-slate-400 node-desc">{scenario === 'close' ? 'Verifying GitHub & CI Status.' : 'Calculating Team Capacity.'}</p>
                            </div>
                        </div>

                        {/* Node 4 */}
                        <div className="relative pl-12 group mt-6">
                            <div className="absolute left-0 top-0 w-12 h-full flex justify-center">
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 transition-colors icon-wrapper ${stepStatus[4] !== 'idle' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-400'}`}>
                                    <Bot className="w-3 h-3" />
                                </div>
                            </div>
                            <div className={`node-card p-4 rounded-xl ${stepStatus[4] === 'active' ? 'node-active' : ''}`}>
                                <h3 className="text-sm font-bold text-white mb-1">Jira Action</h3>
                                <p className="text-[11px] text-slate-400 node-desc">Updating Assignee, Points, and Sprint.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-700 bg-slate-900 shrink-0">
                        <button
                            onClick={runSimulation}
                            disabled={isRunning}
                            className={`w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Play className="w-4 h-4" /> Initiate Workflow
                        </button>
                    </div>
                </section>

                {/* CENTER: Jira Board */}
                <section className={`flex-1 bg-slate-900 flex-col relative overflow-hidden ${mobileTab === 'board' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="h-10 bg-[#1E293B] border-b border-slate-700 flex items-center justify-between px-4 shadow-sm z-10 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">SPRINT 24</span>
                            <span className="text-[10px] bg-slate-700 px-2 rounded text-slate-300">Active</span>
                        </div>
                        <div className="flex -space-x-1">
                            <div className="w-6 h-6 rounded-full bg-purple-500 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-white" title="Sarah">S</div>
                            <div className="w-6 h-6 rounded-full bg-green-500 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-white" title="Mike">M</div>
                            <div className="w-6 h-6 rounded-full bg-blue-500 border border-slate-800 flex items-center justify-center text-[10px] font-bold text-white" title="Alex">A</div>
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-x-auto flex gap-4">
                        {/* Backlog */}
                        <div className="flex-1 min-w-[200px] flex flex-col">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex justify-between">
                                <span>Backlog</span>
                                <span className="bg-slate-800 px-1.5 rounded">{backlog.length}</span>
                            </div>
                            <div className="kanban-col p-2 space-y-2">
                                {backlog.map(c => (
                                    <div key={c.id} className={`kanban-card ${c.border}`}>
                                        <div className={`text-[10px] ${c.border.replace('border-l-', 'text-').replace('500', '400')} font-mono mb-1`}>PROJ-{c.id}</div>
                                        <div className="text-sm text-white font-medium">{c.title}</div>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="flex gap-1 text-[10px] text-slate-400 items-center">
                                                <c.icon className="w-3 h-3" />
                                                <span>{c.tag}</span>
                                            </div>
                                            <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center text-[10px] text-white font-bold">{c.user}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* In Progress */}
                        <div className="flex-1 min-w-[200px] flex flex-col">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex justify-between">
                                <span>In Progress</span>
                                <span className="bg-slate-800 px-1.5 rounded">{progress.length}</span>
                            </div>
                            <div className="kanban-col p-2 space-y-2">
                                {progress.map(c => (
                                    <div key={c.id} className={`kanban-card ${c.border} ${c.action === 'block' ? 'bg-red-500/10 border-red-500' : ''}`}>
                                        <div className={`text-[10px] ${c.border.replace('border-l-', 'text-').replace('500', '400')} font-mono mb-1`}>PROJ-{c.id}</div>
                                        <div className="text-sm text-white font-medium">{c.title}</div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[9px] bg-slate-700 px-1 rounded text-slate-300">{c.pts || '5 pts'}</span>
                                            <div className={`w-5 h-5 rounded-full ${c.color || 'bg-slate-600'} flex items-center justify-center text-[10px] text-white font-bold`}>{c.user}</div>
                                        </div>
                                        {c.action === 'block' && <Ban className="absolute top-2 right-2 w-4 h-4 text-red-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Done */}
                        <div className="flex-1 min-w-[200px] flex flex-col">
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex justify-between">
                                <span>Done</span>
                                <span className="bg-slate-800 px-1.5 rounded">{done.length}</span>
                            </div>
                            <div className="kanban-col p-2 bg-slate-900/50 border border-slate-800 border-dashed space-y-2">
                                {done.map(c => (
                                    <div key={c.id} className={`kanban-card ${c.border} opacity-50`}>
                                        <div className={`text-[10px] ${c.border.replace('border-l-', 'text-').replace('500', '400')} font-mono mb-1`}>PROJ-{c.id}</div>
                                        <div className="text-sm text-white font-medium">{c.title}</div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[9px] bg-slate-700 px-1 rounded text-slate-300">{c.pts}</span>
                                            <div className={`w-5 h-5 rounded-full ${c.color} flex items-center justify-center text-[10px] text-white font-bold`}>{c.user}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* HITL Modal */}
                    {showHitl && (
                        <div className="absolute inset-0 bg-slate-900/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                            <div className="bg-[#1E293B] border border-slate-600 w-full max-w-md rounded-xl p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Scope Ambiguity Detected</h3>
                                        <p className="text-sm text-slate-400">PROJ-105: "Make it pop"</p>
                                    </div>
                                </div>

                                <div className="bg-black/30 rounded p-3 text-xs font-mono text-slate-300 mb-6 border border-slate-700">
                                    ANALYSIS_LOG:<br />
                                    &gt; Ambiguity Score: 88% (HIGH)<br />
                                    &gt; Missing: Acceptance Criteria<br />
                                    &gt; Recommendation: Human Intervention
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => resolveHitl('reject')} className="py-2.5 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 font-bold text-xs transition-all">
                                        Reject to Backlog
                                    </button>
                                    <button onClick={() => resolveHitl('fix')} className="py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                                        <Wand2 className="w-3 h-3" /> Auto-Fix Specs
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* RIGHT: Data Dashboard */}
                <section className={`w-full md:w-[320px] lg:w-[350px] border-l border-slate-700 bg-[#0B1120] flex-col z-20 shadow-2xl ${mobileTab === 'data' ? 'flex' : 'hidden md:flex'}`}>
                    <div className="p-4 border-b border-slate-700 bg-slate-900/50 backdrop-blur shrink-0">
                        <h2 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
                            <span>
                                {role === 'product' && <><TrendingUp className="inline w-4 h-4 mr-2" />AI Rationale</>}
                                {role === 'devops' && <><Code className="inline w-4 h-4 mr-2" />API Logs</>}
                                {role === 'team' && <><Users className="inline w-4 h-4 mr-2" />Capacity View</>}
                            </span>
                            <span className="text-[9px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">{role.toUpperCase()} VIEW</span>
                        </h2>
                    </div>

                    <div className="flex-1 p-6 space-y-6 overflow-y-auto project-flow-scroll">
                        {/* Product Owner View */}
                        {role === 'product' && (
                            <div className="role-view">
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Decision Log</div>
                                <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 h-[300px] overflow-y-auto font-mono text-[10px] space-y-2">
                                    {logs}
                                </div>

                                <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-700 relative overflow-hidden">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Sprint Velocity</div>
                                    <div className="text-4xl font-mono font-bold text-white flex items-end gap-2">
                                        <span>{velocity}</span><span className="text-lg text-slate-500 mb-1">pts</span>
                                    </div>
                                    <div className="text-[10px] text-green-400 mt-2 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> +12% Efficiency
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DevOps View */}
                        {role === 'devops' && (
                            <div className="role-view space-y-4">
                                <div className="bg-black rounded-lg p-3 border border-slate-700 font-mono text-[10px]">
                                    <div className="text-green-400 mb-2">// Payload to Jira API</div>
                                    <div className="space-y-1">
                                        {jsonPayload}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Team View */}
                        {role === 'team' && (
                            <div className="role-view space-y-4">
                                <div className="bg-slate-800 rounded p-3 border border-slate-700">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Team Capacity</div>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs text-slate-300 mb-1"><span>Sarah (Backend)</span> <span>85%</span></div>
                                            <div className="w-full h-1.5 bg-slate-700 rounded-full"><div className="w-[85%] h-full bg-yellow-500 rounded-full"></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-slate-300 mb-1"><span>Mike (Frontend)</span> <span>40%</span></div>
                                            <div className="w-full h-1.5 bg-slate-700 rounded-full"><div className="w-[40%] h-full bg-green-500 rounded-full"></div></div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs text-slate-300 mb-1"><span>Alex (DevOps)</span> <span>20%</span></div>
                                            <div className="w-full h-1.5 bg-slate-700 rounded-full"><div className="w-[20%] h-full bg-green-500 rounded-full"></div></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Mobile Nav */}
            <nav className="md:hidden h-14 bg-slate-900 border-t border-slate-800 flex justify-around items-center shrink-0 z-50 relative">
                <button
                    onClick={() => setMobileTab('flow')}
                    className={`mobile-tab flex-1 h-full flex flex-col items-center justify-center text-[10px] ${mobileTab === 'flow' ? 'active' : 'text-slate-400'}`}
                >
                    <Network className="w-4 h-4 mb-1" /> Flow
                </button>
                <button
                    onClick={() => setMobileTab('board')}
                    className={`mobile-tab flex-1 h-full flex flex-col items-center justify-center text-[10px] ${mobileTab === 'board' ? 'active' : 'text-slate-400'}`}
                >
                    <Layout className="w-4 h-4 mb-1" /> Board
                </button>
                <button
                    onClick={() => setMobileTab('data')}
                    className={`mobile-tab flex-1 h-full flex flex-col items-center justify-center text-[10px] ${mobileTab === 'data' ? 'active' : 'text-slate-400'}`}
                >
                    <TrendingUp className="w-4 h-4 mb-1" /> Stats
                </button>
            </nav>
        </div>
    );
};

export default ProjectFlowDemo;
