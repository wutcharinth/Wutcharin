import { useState, useRef, type ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SquareKanban,
    Network,
    ListTodo,
    Brain,
    UserCog,
    Scale,
    Bot,
    Play,
    RotateCcw,
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
    FileText,
} from 'lucide-react';
import { usePrefersReducedMotion } from '../../lib/motion/usePrefersReducedMotion';

type Role = 'product' | 'devops' | 'team';
type Scenario = 'groom' | 'creep' | 'close';
type StepState = 'idle' | 'active' | 'warning' | 'hitl';

interface KanbanCard {
    id: string;
    title: string;
    tag: string;
    icon: ComponentType<{ className?: string }>;
    accent: string;
    user: string;
    pts?: string;
    type?: 'normal' | 'creep';
    action?: 'close' | 'block';
    skill?: string;
    name?: string;
}

interface LogLine {
    id: string;
    text: string;
    tone: 'neutral' | 'ok' | 'warn' | 'err' | 'accent';
}

const ACCENT = '#3b82f6';

const RAW_CARDS: Record<string, KanbanCard> = {
    '102': { id: '102', title: 'API: Optimize Rate Limiting', tag: 'backend', icon: Github, accent: '#3b82f6', user: 'S', name: 'Sarah', skill: 'Backend' },
    '103': { id: '103', title: 'UI: Dark Mode Toggle', tag: 'frontend', icon: Palette, accent: '#10b981', user: 'M', name: 'Mike', skill: 'Frontend' },
    '104': { id: '104', title: 'Infra: Docker Build Fix', tag: 'devops', icon: Database, accent: '#f59e0b', user: 'A', name: 'Alex', skill: 'DevOps' },
    '105': { id: '105', title: 'Make it pop', tag: 'design', icon: FileText, accent: '#ef4444', type: 'creep', user: '?', name: 'Unknown', skill: 'Design' },
    '99': { id: '99', title: 'DB Migration', tag: 'backend', icon: Database, accent: '#8b5cf6', user: 'S', pts: '5 pts', action: 'close' },
    '100': { id: '100', title: 'Auth: Refresh Token', tag: 'security', icon: Key, accent: '#ef4444', user: 'S', pts: '3 pts', action: 'close' },
    '101': { id: '101', title: 'Landing Page V2', tag: 'frontend', icon: Globe, accent: '#10b981', user: 'M', pts: '5 pts', action: 'block' },
};

function initialBoard(s: Scenario) {
    if (s === 'close') {
        return {
            backlog: [] as KanbanCard[],
            progress: [RAW_CARDS['99'], RAW_CARDS['101'], RAW_CARDS['100']],
            done: [] as KanbanCard[],
        };
    }
    const cards = [RAW_CARDS['102'], RAW_CARDS['103'], RAW_CARDS['104']];
    if (s === 'creep') cards.splice(1, 0, RAW_CARDS['105']);
    return {
        backlog: cards,
        progress: [{ ...RAW_CARDS['99'], pts: '5 pts' }],
        done: [] as KanbanCard[],
    };
}

const ProjectFlowDemo = () => {
    const reduced = usePrefersReducedMotion();
    const [role, setRole] = useState<Role>('product');
    const [scenario, setScenario] = useState<Scenario>('groom');
    const [isRunning, setIsRunning] = useState(false);
    const [stepStatus, setStepStatus] = useState<StepState[]>(['idle', 'idle', 'idle', 'idle', 'idle']);
    const [mobileTab, setMobileTab] = useState<'flow' | 'board' | 'data'>('board');

    const init = initialBoard('groom');
    const [backlog, setBacklog] = useState<KanbanCard[]>(init.backlog);
    const [progress, setProgress] = useState<KanbanCard[]>(init.progress);
    const [done, setDone] = useState<KanbanCard[]>(init.done);

    const [logs, setLogs] = useState<LogLine[]>([]);
    const [velocity, setVelocity] = useState(32);
    const [jsonPayload, setJsonPayload] = useState<Record<string, unknown>>({ status: 'IDLE' });
    const [showHitl, setShowHitl] = useState(false);

    const runIdRef = useRef(0);

    const addLog = (text: string, tone: LogLine['tone'] = 'neutral') => {
        setLogs((prev) => [{ id: `${Date.now()}-${Math.random()}`, text, tone }, ...prev]);
    };

    const setStep = (index: number, status: StepState) => {
        setStepStatus((prev) => {
            const next = [...prev];
            next[index] = status;
            return next;
        });
    };

    const applyScenario = (nextScenario: Scenario) => {
        runIdRef.current += 1;
        setScenario(nextScenario);
        setIsRunning(false);
        setStepStatus(['idle', 'idle', 'idle', 'idle', 'idle']);
        setLogs([]);
        setVelocity(32);
        setJsonPayload({ status: 'IDLE', scenario: nextScenario });
        setShowHitl(false);
        const board = initialBoard(nextScenario);
        setBacklog(board.backlog);
        setProgress(board.progress);
        setDone(board.done);
    };

    const runSimulation = async () => {
        if (isRunning) return;
        const myRun = runIdRef.current + 1;
        runIdRef.current = myRun;
        const cancelled = () => runIdRef.current !== myRun;
        const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 100) : ms));

        setIsRunning(true);
        setStepStatus(['idle', 'idle', 'idle', 'idle', 'idle']);
        setLogs([]);
        setShowHitl(false);
        const board = initialBoard(scenario);
        setBacklog(board.backlog);
        setProgress(board.progress);
        setDone(board.done);

        const queue =
            scenario === 'close'
                ? [RAW_CARDS['99'], RAW_CARDS['101'], RAW_CARDS['100']]
                : scenario === 'groom'
                  ? [RAW_CARDS['102'], RAW_CARDS['103'], RAW_CARDS['104']]
                  : [RAW_CARDS['102'], RAW_CARDS['105'], RAW_CARDS['103']];

        await wait(350);
        if (cancelled()) return;
        setStep(0, 'active');
        addLog(scenario === 'close' ? 'Scanner: polling In-Progress PRs...' : 'Scanner: found unassigned backlog issues.', 'accent');

        for (const item of queue) {
            await wait(600);
            if (cancelled()) return;
            setStep(1, 'active');

            if (scenario === 'close') {
                if (item.action === 'block') {
                    addLog(`PROJ-${item.id}: CI checks FAILED.`, 'err');
                    await wait(450);
                    if (cancelled()) return;
                    setStep(3, 'warning');
                    await wait(450);
                    if (cancelled()) return;
                    setStep(4, 'active');
                    setProgress((prev) => prev.map((c) => (c.id === item.id ? { ...c, accent: '#ef4444', action: 'block' } : c)));
                    setJsonPayload({ key: `PROJ-${item.id}`, block: true, reason: 'CI_TESTS_FAILED' });
                } else {
                    addLog(`PROJ-${item.id}: PR merged & CI passed.`, 'ok');
                    await wait(450);
                    if (cancelled()) return;
                    setStep(3, 'active');
                    await wait(450);
                    if (cancelled()) return;
                    setStep(4, 'active');
                    setProgress((prev) => prev.filter((c) => c.id !== item.id));
                    setDone((prev) => [...prev, item]);
                    setVelocity((v) => v + 4);
                    setJsonPayload({ key: `PROJ-${item.id}`, status: 'DONE', pr_merged: true });
                }
                continue;
            }

            if (item.type === 'creep') {
                setStep(1, 'warning');
                addLog(`PROJ-${item.id}: ambiguity score 88% (missing AC).`, 'warn');
                setStep(2, 'hitl');
                setShowHitl(true);
                setJsonPayload({ key: `PROJ-${item.id}`, interrupt: 'HUMAN_REVIEW', ambiguity: 0.88 });
                return;
            }

            addLog(`Analyzing PROJ-${item.id} (${item.tag})...`, 'neutral');
            await wait(450);
            if (cancelled()) return;
            setStep(3, 'active');
            addLog(`Matched ${item.name} (${item.skill}) within capacity.`, 'accent');

            await wait(450);
            if (cancelled()) return;
            setStep(4, 'active');
            setBacklog((prev) => prev.filter((c) => c.id !== item.id));
            setProgress((prev) => [...prev, { ...item, pts: '3 pts' }]);
            setJsonPayload({ key: `PROJ-${item.id}`, assignee: item.name, story_points: 3 });
            addLog(`Assigned PROJ-${item.id} -> ${item.name}`, 'ok');
        }

        if (cancelled()) return;
        setIsRunning(false);
        addLog('BATCH COMPLETE', 'ok');
    };

    const resolveHitl = async (action: 'fix' | 'reject') => {
        const myRun = runIdRef.current;
        const cancelled = () => runIdRef.current !== myRun;
        const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 100) : ms));

        setShowHitl(false);
        setStep(2, 'active');

        if (action === 'fix') {
            addLog('PO Action: Auto-generate acceptance criteria.', 'accent');
            setStep(4, 'active');
            const fixedCard: KanbanCard = {
                ...RAW_CARDS['105'],
                title: 'Update Landing Hero Typography & Spacing',
                user: 'M',
                name: 'Mike',
                accent: '#10b981',
                pts: '2 pts',
            };
            setBacklog((prev) => prev.filter((c) => c.id !== '105'));
            setProgress((prev) => [...prev, fixedCard]);
            setJsonPayload({ key: 'PROJ-105', action: 'AUTO_SPEC_FIXED', assignee: 'Mike' });
            addLog('PROJ-105 rewritten & assigned -> Mike', 'ok');
        } else {
            addLog('PO Action: Rejected to Backlog.', 'err');
            setBacklog((prev) => prev.map((c) => (c.id === '105' ? { ...c, action: 'block' } : c)));
            setJsonPayload({ key: 'PROJ-105', action: 'REJECTED_AMBIGUOUS' });
        }

        await wait(600);
        if (cancelled()) return;
        const rem = RAW_CARDS['103'];
        setStep(3, 'active');
        addLog(`Matched ${rem.name} (${rem.skill}).`, 'accent');
        await wait(500);
        if (cancelled()) return;
        setStep(4, 'active');
        setBacklog((prev) => prev.filter((c) => c.id !== rem.id));
        setProgress((prev) => [...prev, { ...rem, pts: '3 pts' }]);
        addLog(`Assigned PROJ-${rem.id} -> ${rem.name}`, 'ok');
        addLog('BATCH COMPLETE', 'ok');
        setIsRunning(false);
    };

    const pipelineNodes = [
        { title: 'Board Scanner', desc: 'Polling sprint backlog & open PRs.', icon: ListTodo, tag: 'Jira API' },
        { title: 'Context Engine', desc: 'Scoring acceptance criteria & CI state.', icon: Brain, tag: 'LLM' },
        { title: 'Human Review', desc: 'Interrupts when ambiguity exceeds threshold.', icon: UserCog, tag: 'HITL' },
        {
            title: scenario === 'close' ? 'Definition of Done' : 'Load Balancer',
            desc: scenario === 'close' ? 'Verifying GitHub merge & CI status.' : 'Matching skill tags to sprint capacity.',
            icon: Scale,
            tag: 'Policy',
        },
        { title: 'Jira Action', desc: 'Committing assignee, points, and column move.', icon: Bot, tag: 'Write' },
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
                        <SquareKanban className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="font-display font-medium text-sm leading-tight text-text-strong flex items-center gap-1.5">
                            ProjectFlow <span className="font-serif italic" style={{ color: ACCENT }}>AI</span>
                        </div>
                        <div className="text-[10px] text-text-mute font-mono tracking-[0.18em] uppercase">
                            Autonomous Scrum Master
                        </div>
                    </div>
                </div>

                {/* Role Switcher */}
                <div className="hidden md:flex items-center bg-bg border border-hairline rounded-full p-0.5">
                    {(['product', 'devops', 'team'] as Role[]).map((r) => {
                        const active = role === r;
                        return (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRole(r)}
                                className={`relative px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.14em] transition-colors ${
                                    active ? 'text-bg font-medium' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="projectflow-role-pill"
                                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                        className="absolute inset-0 rounded-full bg-text-strong"
                                    />
                                )}
                                <span className="relative z-10">{r === 'product' ? 'Product' : r === 'devops' ? 'DevOps' : 'Team'}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Scenario Selector */}
                <div className="flex flex-wrap items-center bg-bg border border-hairline rounded-full p-0.5 gap-0.5">
                    {(
                        [
                            { id: 'groom', label: 'Batch Groom', Icon: ListTodo },
                            { id: 'creep', label: 'Scope Creep', Icon: Ghost },
                            { id: 'close', label: 'Auto-Close', Icon: CheckCheck },
                        ] as const
                    ).map(({ id, label, Icon }) => {
                        const active = scenario === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => applyScenario(id)}
                                className={`relative px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.1em] transition-colors flex items-center gap-1.5 ${
                                    active ? 'text-text-strong font-medium' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {active && (
                                    <motion.span
                                        layoutId="projectflow-scenario-pill"
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
            </header>

            {/* Main 3-Pane Workspace */}
            <main className="flex-1 flex overflow-hidden relative">
                {/* LEFT: Agent Graph */}
                <section
                    className={`w-full md:w-[290px] lg:w-[310px] border-r border-hairline bg-panel/40 flex-col shrink-0 ${
                        mobileTab === 'flow' ? 'flex' : 'hidden md:flex'
                    }`}
                >
                    <div className="px-4 py-3 border-b border-hairline flex justify-between items-center shrink-0">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong flex items-center gap-2">
                            <Network className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                            Agent Graph
                        </h3>
                        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-text-mute">
                            {isRunning ? 'Running' : 'Idle'}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {pipelineNodes.map((node, i) => {
                            const status = stepStatus[i];
                            const Icon = node.icon;
                            const isWarn = status === 'warning' || status === 'hitl';
                            const isActive = status === 'active';
                            return (
                                <div key={node.title} className="relative pl-10">
                                    {i < pipelineNodes.length - 1 && (
                                        <div className="absolute left-[13px] top-7 bottom-[-14px] w-[2px] bg-hairline overflow-hidden">
                                            <motion.div
                                                className="w-full h-full origin-top"
                                                initial={{ scaleY: 0 }}
                                                animate={{ scaleY: status !== 'idle' ? 1 : 0 }}
                                                style={{ backgroundColor: isWarn ? '#f59e0b' : ACCENT }}
                                            />
                                        </div>
                                    )}
                                    <div
                                        className={`absolute left-0 top-1 w-7 h-7 rounded-full border flex items-center justify-center transition-colors ${
                                            isWarn
                                                ? 'border-amber-500 bg-amber-500/15 text-amber-500'
                                                : isActive
                                                  ? 'border-sky-500 bg-sky-500/15 text-sky-500'
                                                  : 'border-hairline bg-bg text-text-mute'
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div
                                        className={`p-3 rounded-xl border transition-colors ${
                                            isWarn
                                                ? 'border-amber-500/50 bg-amber-500/[0.08]'
                                                : isActive
                                                  ? 'border-sky-500/45 bg-sky-500/[0.06]'
                                                  : 'border-hairline bg-bg/60'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-0.5">
                                            <span className="text-xs font-medium text-text-strong">{node.title}</span>
                                            <span className="text-[9px] font-mono uppercase tracking-[0.14em] px-1.5 py-0.5 rounded border border-hairline text-text-mute">
                                                {status === 'hitl' ? 'INTERRUPT' : node.tag}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-text-mute leading-snug">{node.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-hairline bg-panel flex gap-2 shrink-0">
                        <button
                            type="button"
                            onClick={runSimulation}
                            disabled={isRunning}
                            data-cursor="play"
                            className="flex-1 py-2.5 px-4 rounded-lg text-xs font-mono uppercase tracking-[0.16em] bg-text-strong text-bg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-45"
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            {isRunning ? 'Executing...' : 'Run Workflow'}
                        </button>
                        <button
                            type="button"
                            onClick={() => applyScenario(scenario)}
                            aria-label="Reset sprint board"
                            className="px-3 py-2.5 rounded-lg border border-hairline text-text-mute hover:text-text-strong hover:border-hairline-strong transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </section>

                {/* CENTER: Animated Kanban Board */}
                <section
                    className={`flex-1 bg-bg flex-col relative overflow-hidden ${
                        mobileTab === 'board' ? 'flex' : 'hidden md:flex'
                    }`}
                >
                    <div className="h-10 bg-panel border-b border-hairline flex items-center justify-between px-4 z-10 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong">SPRINT 24</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/35 bg-emerald-500/10 text-emerald-500">
                                ACTIVE
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-mute">
                            <span className="w-5 h-5 rounded-full border border-hairline bg-panel-strong flex items-center justify-center text-text-strong" title="Sarah">S</span>
                            <span className="w-5 h-5 rounded-full border border-hairline bg-panel-strong flex items-center justify-center text-text-strong" title="Mike">M</span>
                            <span className="w-5 h-5 rounded-full border border-hairline bg-panel-strong flex items-center justify-center text-text-strong" title="Alex">A</span>
                        </div>
                    </div>

                    <div className="flex-1 p-4 overflow-x-auto grid grid-cols-1 lg:grid-cols-3 gap-3">
                        {(
                            [
                                { label: 'Backlog', items: backlog, dashed: false, faded: false },
                                { label: 'In Progress', items: progress, dashed: false, faded: false },
                                { label: 'Done', items: done, dashed: true, faded: true },
                            ] as const
                        ).map((col) => (
                            <div key={col.label} className="flex flex-col min-w-[180px]">
                                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute mb-2 flex justify-between items-center px-1">
                                    <span>{col.label}</span>
                                    <span className="px-1.5 py-0.5 rounded border border-hairline bg-panel text-text-strong">
                                        {col.items.length}
                                    </span>
                                </div>
                                <div
                                    className={`flex-1 rounded-xl p-2 space-y-2 border ${
                                        col.dashed ? 'border-dashed border-hairline bg-panel/30' : 'border-hairline bg-panel/50'
                                    }`}
                                >
                                    <AnimatePresence>
                                        {col.items.map((c) => {
                                            const CardIcon = c.icon;
                                            return (
                                                <motion.div
                                                    key={c.id}
                                                    layout={!reduced}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: col.faded ? 0.65 : 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.94 }}
                                                    transition={{ duration: 0.28 }}
                                                    className={`relative rounded-lg p-3 border bg-bg transition-colors ${
                                                        c.action === 'block'
                                                            ? 'border-rose-500/60 bg-rose-500/[0.07]'
                                                            : 'border-hairline hover:border-hairline-strong'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <span className="text-[10px] font-mono" style={{ color: c.accent }}>
                                                            PROJ-{c.id}
                                                        </span>
                                                        {c.action === 'block' && <Ban className="w-3.5 h-3.5 text-rose-500" />}
                                                    </div>
                                                    <div className="text-xs font-medium text-text-strong leading-snug">{c.title}</div>
                                                    <div className="flex justify-between items-center mt-2.5">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-mute">
                                                            <CardIcon className="w-3 h-3" />
                                                            <span>{c.pts || c.tag}</span>
                                                        </div>
                                                        <span className="w-5 h-5 rounded-full border border-hairline bg-panel flex items-center justify-center text-[10px] font-mono text-text-strong">
                                                            {c.user}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* HITL Modal */}
                    <AnimatePresence>
                        {showHitl && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-bg/85 backdrop-blur-sm z-40 flex items-center justify-center p-4"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-panel border border-hairline-strong w-full max-w-md rounded-2xl p-6"
                                >
                                    <div className="flex items-start gap-3.5 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-500 flex items-center justify-center shrink-0">
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-base font-display font-medium text-text-strong">
                                                Scope Ambiguity Interrupt
                                            </h4>
                                            <p className="text-xs font-mono text-text-mute mt-0.5">PROJ-105: &quot;Make it pop&quot;</p>
                                        </div>
                                    </div>

                                    <div className="bg-bg rounded-xl p-3.5 text-[11px] font-mono text-text mb-5 border border-hairline space-y-1">
                                        <div className="text-amber-500">ANALYSIS_LOG:</div>
                                        <div>&gt; Ambiguity Score: 88% (HIGH)</div>
                                        <div>&gt; Missing: Acceptance Criteria</div>
                                        <div>&gt; State: Paused for Product Owner</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => resolveHitl('reject')}
                                            className="py-2.5 rounded-lg border border-rose-500/45 text-rose-500 hover:bg-rose-500/10 font-mono uppercase tracking-[0.12em] text-[11px] transition-colors"
                                        >
                                            Reject Ticket
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => resolveHitl('fix')}
                                            className="py-2.5 rounded-lg bg-text-strong text-bg hover:opacity-90 font-mono uppercase tracking-[0.12em] text-[11px] transition-opacity flex items-center justify-center gap-1.5"
                                        >
                                            <Wand2 className="w-3.5 h-3.5" /> Auto-Fix Spec
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* RIGHT: Role Telemetry */}
                <section
                    className={`w-full md:w-[270px] lg:w-[290px] border-l border-hairline bg-panel/40 flex-col shrink-0 ${
                        mobileTab === 'data' ? 'flex' : 'hidden md:flex'
                    }`}
                >
                    <div className="px-4 py-3 border-b border-hairline flex justify-between items-center shrink-0">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-strong flex items-center gap-2">
                            {role === 'product' && <><TrendingUp className="w-3.5 h-3.5" style={{ color: ACCENT }} /> Rationale</>}
                            {role === 'devops' && <><Code className="w-3.5 h-3.5" style={{ color: ACCENT }} /> Jira Payload</>}
                            {role === 'team' && <><Users className="w-3.5 h-3.5" style={{ color: ACCENT }} /> Capacity</>}
                        </h3>
                        <span className="text-[9px] font-mono uppercase tracking-[0.16em] px-2 py-0.5 rounded border border-hairline text-text-mute">
                            {role}
                        </span>
                    </div>

                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {role === 'product' && (
                            <>
                                <div>
                                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute mb-2">
                                        Decision Stream
                                    </div>
                                    <div className="bg-bg rounded-xl p-3 border border-hairline h-[260px] overflow-y-auto font-mono text-[10px] space-y-2">
                                        {logs.length === 0 ? (
                                            <div className="text-text-mute opacity-70">Run workflow to trace ticket routing...</div>
                                        ) : (
                                            logs.map((l) => (
                                                <div
                                                    key={l.id}
                                                    className={`border-l pl-2 ${
                                                        l.tone === 'ok'
                                                            ? 'border-emerald-500 text-emerald-500'
                                                            : l.tone === 'err'
                                                              ? 'border-rose-500 text-rose-500'
                                                              : l.tone === 'warn'
                                                                ? 'border-amber-500 text-amber-500'
                                                                : l.tone === 'accent'
                                                                  ? 'border-sky-500 text-text-strong'
                                                                  : 'border-hairline-strong text-text-mute'
                                                    }`}
                                                >
                                                    {l.text}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="bg-bg rounded-xl p-4 border border-hairline">
                                    <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute mb-1">
                                        Sprint Velocity
                                    </div>
                                    <div className="text-3xl font-mono font-semibold text-text-strong flex items-baseline gap-1.5">
                                        <span>{velocity}</span>
                                        <span className="text-xs font-normal text-text-mute">pts</span>
                                    </div>
                                    <div className="text-[11px] font-mono text-emerald-500 mt-1.5 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> +12% grooming efficiency
                                    </div>
                                </div>
                            </>
                        )}

                        {role === 'devops' && (
                            <div className="bg-bg rounded-xl p-4 border border-hairline font-mono text-[11px]">
                                <div className="text-emerald-500 mb-2">{'// Last Jira REST Payload'}</div>
                                <pre className="text-text whitespace-pre-wrap">{JSON.stringify(jsonPayload, null, 2)}</pre>
                            </div>
                        )}

                        {role === 'team' && (
                            <div className="bg-bg rounded-xl p-4 border border-hairline space-y-4">
                                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-mute">
                                    Active Sprint Capacity
                                </div>
                                {[
                                    { name: 'Sarah (Backend)', pct: 85, color: '#f59e0b' },
                                    { name: 'Mike (Frontend)', pct: 45, color: '#10b981' },
                                    { name: 'Alex (DevOps)', pct: 25, color: '#10b981' },
                                ].map((m) => (
                                    <div key={m.name}>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-text-strong">{m.name}</span>
                                            <span className="font-mono text-text-mute">{m.pct}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-panel-strong rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${m.pct}%` }}
                                                transition={{ duration: reduced ? 0.1 : 0.6 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: m.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Mobile Nav */}
            <nav className="md:hidden h-12 bg-panel border-t border-hairline flex justify-around items-center shrink-0">
                {(
                    [
                        { id: 'flow', label: 'Flow', Icon: Network },
                        { id: 'board', label: 'Board', Icon: Layout },
                        { id: 'data', label: 'Stats', Icon: TrendingUp },
                    ] as const
                ).map(({ id, label, Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setMobileTab(id)}
                        className={`flex-1 h-full flex flex-col items-center justify-center text-[10px] font-mono uppercase tracking-[0.14em] border-t-2 ${
                            mobileTab === id ? 'border-sky-500 text-text-strong' : 'border-transparent text-text-mute'
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

export default ProjectFlowDemo;
