import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    TrendingUp,
    CheckCircle2,
    AlertTriangle,
    User,
    FileText,
    Search,
    Bot,
    Play,
    RotateCcw,
    Hammer,
    Eye,
    MessageSquare,
    Youtube,
    BookOpen,
    Layers,
    Target,
    Zap,
    Terminal,
    Database,
    Lightbulb,
    Clock,
    Thermometer,
    Lock,
    Network,
    BarChart,
    X,
} from 'lucide-react';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import { SectionHeader } from '../components/shared/ShowcaseBlocks';
import SEO from '../components/SEO';
import { usePrefersReducedMotion } from '../lib/motion/usePrefersReducedMotion';

const AGENTIC_ACCENT = '#3b82f6';
const AGENTIC_SECTIONS = [
    { id: 'sec-shift', label: 'Spectrum' },
    { id: 'sec-frontier', label: 'Frontier' },
    { id: 'sec-loop', label: 'Loop' },
    { id: 'sec-evals', label: 'Evals' },
    { id: 'sec-multi', label: 'Multi' },
    { id: 'sec-rag', label: 'RAG' },
];

// ==========================================
// VISUALIZATION 1: THE AUTONOMY SPECTRUM
// ==========================================
const AUTONOMY_LEVELS = [
    {
        title: 'Zero-Shot',
        desc: 'Raw Intelligence',
        detail: 'Responds immediately from pre-trained weights. Fast, cheap, but hallucination-prone on private or multi-step tasks.',
        prompt: 'Write code for a Snake game.',
        response: 'Here is the Python code for Snake...\n[single forward pass, no verification]',
        stats: { time: '0.5s', cost: '$', reliability: 'Low' },
        icon: Zap,
        accent: '#3b82f6',
    },
    {
        title: 'Chain of Thought',
        desc: 'Deliberate Reasoning',
        detail: 'Allocates test-time tokens to decompose the problem step-by-step before emitting a final answer.',
        prompt: 'Write a Snake game with collision rules.',
        response: 'Reasoning Trace:\n1. Define grid & frame clock\n2. Queue directional inputs\n3. Check wall & self collision\n\nOutput: Verified game loop...',
        stats: { time: '2.0s', cost: '$$', reliability: 'Medium' },
        icon: Brain,
        accent: '#8b5cf6',
    },
    {
        title: 'RAG',
        desc: 'Grounded Retrieval',
        detail: 'Retrieves external domain documents into context before answering, closing private knowledge gaps.',
        prompt: 'Fix error 404 in internal API v2.1',
        response: "Querying vector index...\nMatched: 'v2.1 Routing Migration Guide'\n\nAnswer: Migrate /v2/orders to /v2.1/fulfillment/orders.",
        stats: { time: '1.5s', cost: '$$', reliability: 'High (Factual)' },
        icon: Search,
        accent: '#f59e0b',
    },
    {
        title: 'Agentic Loop',
        desc: 'Tool Use & Iteration',
        detail: 'Plans, invokes external APIs, inspects live observations, and iterates until verification succeeds.',
        prompt: 'Screen undervalued tech stocks and draft an order.',
        response: "1. Tool: MarketSearch(sector='tech', pe_max=15)\n2. Obs: Found 'InnoCorp' (PE: 12.1)\n3. Tool: FilingsCheck('InnoCorp')\n4. Action: DraftLimitOrder('InnoCorp', hitl=True)",
        stats: { time: '15.0s', cost: '$$$$', reliability: 'High (Actionable)' },
        icon: Bot,
        accent: '#10b981',
    },
] as const;

const AutonomySpectrumViz = () => {
    const [level, setLevel] = useState(0);
    const active = AUTONOMY_LEVELS[level];
    const ActiveIcon = active.icon;

    return (
        <div className="frame-ticks rounded-2xl border border-hairline bg-panel/60 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-hairline">
                <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-text-mute mb-1">
                        Interactive Module · 01
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-medium text-text-strong flex items-center gap-2.5">
                        <TrendingUp className="w-5 h-5 text-sky-500" />
                        The Spectrum of Autonomy
                    </h3>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-hairline bg-bg text-text-mute">
                    Level 0{level + 1} / 04
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Level Selector */}
                <div className="lg:col-span-5 space-y-2.5">
                    {AUTONOMY_LEVELS.map((l, i) => {
                        const LevelIcon = l.icon;
                        const isSelected = level === i;
                        return (
                            <button
                                key={l.title}
                                type="button"
                                onClick={() => setLevel(i)}
                                data-cursor="step"
                                className={`relative w-full text-left p-4 rounded-xl border transition-colors flex items-center gap-3.5 ${
                                    isSelected
                                        ? 'border-hairline-strong bg-bg'
                                        : 'border-hairline bg-panel/40 hover:bg-bg/70'
                                }`}
                            >
                                {isSelected && (
                                    <motion.span
                                        layoutId="autonomy-active-rail"
                                        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                                        style={{ backgroundColor: l.accent }}
                                    />
                                )}
                                <div
                                    className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-colors"
                                    style={
                                        isSelected
                                            ? { borderColor: `${l.accent}55`, backgroundColor: `${l.accent}18`, color: l.accent }
                                            : { borderColor: 'var(--color-hairline)', backgroundColor: 'var(--color-panel)', color: 'var(--color-text-mute)' }
                                    }
                                >
                                    <LevelIcon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm font-medium text-text-strong">{l.title}</div>
                                    <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-text-mute">
                                        {l.desc}
                                    </div>
                                </div>
                                {isSelected && (
                                    <span className="text-[9px] font-mono uppercase tracking-[0.16em]" style={{ color: l.accent }}>
                                        Active
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Output Console */}
                <div className="lg:col-span-7 bg-bg rounded-2xl border border-hairline flex flex-col overflow-hidden min-h-[300px]">
                    <div className="px-4 py-3 border-b border-hairline bg-panel flex justify-between items-center">
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-mute">
                            <Terminal className="w-3.5 h-3.5" style={{ color: active.accent }} />
                            Execution Trace
                        </div>
                        <span className="font-mono text-[10px] text-text-mute">{active.title}</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={level}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.22 }}
                            className="flex-1 p-5 flex flex-col justify-between gap-5"
                        >
                            <div className="space-y-4">
                                <p className="text-xs text-text-mute leading-relaxed">{active.detail}</p>

                                <div className="flex gap-3">
                                    <div className="w-7 h-7 rounded-full border border-hairline bg-panel flex items-center justify-center shrink-0">
                                        <User className="w-3.5 h-3.5 text-text-mute" />
                                    </div>
                                    <div className="bg-panel rounded-xl rounded-tl-none px-3.5 py-2.5 border border-hairline text-text-strong text-xs">
                                        {active.prompt}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div
                                        className="w-7 h-7 rounded-full border flex items-center justify-center shrink-0"
                                        style={{ borderColor: `${active.accent}55`, backgroundColor: `${active.accent}18`, color: active.accent }}
                                    >
                                        <ActiveIcon className="w-3.5 h-3.5" />
                                    </div>
                                    <div
                                        className="flex-1 rounded-xl rounded-tl-none p-3.5 border font-mono text-xs text-text-strong whitespace-pre-wrap leading-relaxed"
                                        style={{ borderColor: `${active.accent}35`, backgroundColor: `${active.accent}0b` }}
                                    >
                                        {active.response}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-hairline font-mono text-[11px]">
                                <div className="bg-panel rounded-lg px-3 py-2 border border-hairline">
                                    <span className="text-[9px] text-text-mute uppercase block">Latency</span>
                                    <span className="text-text-strong flex items-center gap-1 mt-0.5">
                                        <Clock className="w-3 h-3 text-text-mute" /> {active.stats.time}
                                    </span>
                                </div>
                                <div className="bg-panel rounded-lg px-3 py-2 border border-hairline">
                                    <span className="text-[9px] text-text-mute uppercase block">Cost</span>
                                    <span className="text-text-strong block mt-0.5">{active.stats.cost}</span>
                                </div>
                                <div className="bg-panel rounded-lg px-3 py-2 border border-hairline">
                                    <span className="text-[9px] text-text-mute uppercase block">Reliability</span>
                                    <span className="text-text-strong block mt-0.5">{active.stats.reliability}</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// VISUALIZATION 2: SIMPLIFIED JAGGED FRONTIER
// ==========================================
const FRONTIER_TASKS = [
    {
        name: 'Summarize Paper',
        difficulty: 'Medium',
        zone: 'inside' as const,
        result: 'AI excels at synthesis and summarization. BCG consultants trained in structured prompting significantly outperformed control groups.',
    },
    {
        name: 'Extract Issues',
        difficulty: 'Medium',
        zone: 'inside' as const,
        result: 'Decomposing messy customer feedback into structured issue lists works reliably when paired with Chain-of-Thought prompting.',
    },
    {
        name: 'Medical Diagnosis',
        difficulty: 'High Precision',
        zone: 'outside' as const,
        result: 'Generalist base models hallucinate subtle contraindications when clinical grounding and strict verification rules are absent.',
    },
    {
        name: 'Legal Contract Review',
        difficulty: 'High Precision',
        zone: 'outside' as const,
        result: 'Requires jurisdiction-specific precedent and clause-level traceability that vanilla models lack without RAG and eval harnesses.',
    },
];

const SimplifiedJaggedFrontierViz = () => {
    const [selectedTask, setSelectedTask] = useState<string>(FRONTIER_TASKS[0].name);
    const active = FRONTIER_TASKS.find((t) => t.name === selectedTask) ?? FRONTIER_TASKS[0];

    return (
        <div className="frame-ticks rounded-2xl border border-hairline bg-panel/60 p-6 md:p-8">
            <div className="mb-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-text-mute mb-1">
                    Interactive Module · 02
                </div>
                <h3 className="font-display text-xl md:text-2xl font-medium text-text-strong flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Inspecting the Jagged Frontier
                </h3>
                <p className="text-sm text-text-mute mt-1.5 max-w-2xl">
                    Click any task to inspect whether vanilla base models operate safely inside the frontier or require retrieval, tools, and human sign-off.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                {FRONTIER_TASKS.map((task) => {
                    const isInside = task.zone === 'inside';
                    const isSelected = selectedTask === task.name;
                    return (
                        <button
                            key={task.name}
                            type="button"
                            onClick={() => setSelectedTask(task.name)}
                            data-cursor="step"
                            className={`p-4 rounded-xl border text-left transition-all ${
                                isSelected
                                    ? isInside
                                        ? 'border-emerald-500/60 bg-emerald-500/[0.08]'
                                        : 'border-rose-500/60 bg-rose-500/[0.08]'
                                    : 'border-hairline bg-bg hover:border-hairline-strong'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2.5">
                                <span
                                    className={`w-2 h-2 rounded-full ${isInside ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                />
                                <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-text-mute">
                                    {task.difficulty}
                                </span>
                            </div>
                            <div className="text-sm font-medium text-text-strong mb-1">{task.name}</div>
                            <div
                                className={`text-[11px] font-mono flex items-center gap-1 ${
                                    isInside ? 'text-emerald-500' : 'text-rose-500'
                                }`}
                            >
                                {isInside ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                {isInside ? 'Inside Frontier' : 'Outside Frontier'}
                            </div>
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={active.name}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-5 bg-bg rounded-xl border border-hairline flex items-start gap-4"
                >
                    <div
                        className={`p-2.5 rounded-lg border shrink-0 ${
                            active.zone === 'inside'
                                ? 'bg-emerald-500/12 border-emerald-500/35 text-emerald-500'
                                : 'bg-rose-500/12 border-rose-500/35 text-rose-500'
                        }`}
                    >
                        {active.zone === 'inside' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-text-strong mb-1">{active.name}</h4>
                        <p className="text-sm text-text leading-relaxed">{active.result}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// ==========================================
// VISUALIZATION 3: TOOL USE (ReAct LOOP)
// ==========================================
const TOOL_STEPS = [
    { type: 'thought', text: 'User asks for live Tokyo weather. Pre-trained weights cannot see today. Call weather API.', icon: Brain },
    { type: 'action', text: "CALL: WeatherAPI(location='Tokyo', units='metric')", icon: Hammer },
    { type: 'observation', text: "RETURN: { temp_c: 14, condition: 'Rainy', wind_kph: 18 }", icon: Eye },
    { type: 'response', text: "It's currently 14°C and rainy in Tokyo with light wind. Bring an umbrella.", icon: MessageSquare },
] as const;

const ToolUseViz = () => {
    const reduced = usePrefersReducedMotion();
    const [step, setStep] = useState(-1);
    const [isRunning, setIsRunning] = useState(false);
    const runRef = useRef(0);

    const runSimulation = async () => {
        const myRun = runRef.current + 1;
        runRef.current = myRun;
        setIsRunning(true);
        setStep(0);

        for (let i = 1; i < TOOL_STEPS.length; i++) {
            await new Promise((r) => setTimeout(r, reduced ? 120 : 850));
            if (runRef.current !== myRun) return;
            setStep(i);
        }
        setIsRunning(false);
    };

    const reset = () => {
        runRef.current += 1;
        setIsRunning(false);
        setStep(-1);
    };

    return (
        <div className="frame-ticks rounded-2xl border border-hairline bg-panel/60 p-6 md:p-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-hairline">
                <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-text-mute mb-1">
                        Interactive Module · 03
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-medium text-text-strong flex items-center gap-2.5">
                        <Hammer className="w-5 h-5 text-sky-500" />
                        ReAct Tool-Use Loop
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={runSimulation}
                        disabled={isRunning}
                        data-cursor="play"
                        className="px-4 py-2 rounded-lg bg-text-strong text-bg hover:opacity-90 font-mono text-[11px] uppercase tracking-[0.16em] flex items-center gap-2 transition-opacity disabled:opacity-45"
                    >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {isRunning ? 'Running...' : 'Run Trace'}
                    </button>
                    {step >= 0 && (
                        <button
                            type="button"
                            onClick={reset}
                            aria-label="Reset trace"
                            className="p-2 rounded-lg border border-hairline bg-bg text-text-mute hover:text-text-strong"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-bg rounded-xl border border-hairline p-5 font-mono text-xs min-h-[210px] space-y-3">
                {step < 0 && (
                    <div className="h-[160px] flex items-center justify-center text-text-mute">
                        Click Run Trace to watch Thought -&gt; Action -&gt; Observation -&gt; Response execute.
                    </div>
                )}

                <AnimatePresence>
                    {TOOL_STEPS.map((s, i) => {
                        if (i > step) return null;
                        const Icon = s.icon;
                        const styles =
                            s.type === 'action'
                                ? 'border-amber-500/45 bg-amber-500/[0.08] text-amber-500'
                                : s.type === 'observation'
                                  ? 'border-sky-500/45 bg-sky-500/[0.08] text-sky-500'
                                  : s.type === 'response'
                                    ? 'border-emerald-500/45 bg-emerald-500/[0.08] text-emerald-500'
                                    : 'border-hairline bg-panel text-text';
                        return (
                            <motion.div
                                key={s.type}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-3.5 rounded-xl border flex items-start gap-3 ${styles}`}
                            >
                                <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                                <div>
                                    <span className="text-[9px] uppercase tracking-[0.2em] opacity-75 block mb-1">
                                        {s.type}
                                    </span>
                                    <span className="text-text-strong leading-relaxed">{s.text}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ==========================================
// VISUALIZATION 4: EVAL MATRIX
// ==========================================
const EVAL_CELLS = [
    {
        id: 'q-obj',
        title: 'Hard Metrics',
        subtitle: 'Quantitative · Objective',
        ex: 'Unit test pass rate, JSON schema validity, exact SQL match.',
        accent: '#3b82f6',
    },
    {
        id: 'q-sub',
        title: 'User Ratings',
        subtitle: 'Quantitative · Subjective',
        ex: 'Thumbs-up rate, CSAT, pairwise Arena Elo preference.',
        accent: '#8b5cf6',
    },
    {
        id: 'l-obj',
        title: 'Fact Checks',
        subtitle: 'Qualitative · Objective',
        ex: 'Verifying cited Order ID, contract clause, or policy citation.',
        accent: '#10b981',
    },
    {
        id: 'l-sub',
        title: 'Rubric & Tone',
        subtitle: 'Qualitative · Subjective',
        ex: 'Brand voice, empathy, clarity graded by domain rubric or LLM-as-Judge.',
        accent: '#f59e0b',
    },
] as const;

const EvalMatrixViz = () => {
    const [selected, setSelected] = useState<string>(EVAL_CELLS[0].id);

    return (
        <div className="frame-ticks rounded-2xl border border-hairline bg-panel/60 p-6 md:p-8">
            <div className="mb-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-text-mute mb-1">
                    Interactive Module · 04
                </div>
                <h3 className="font-display text-xl md:text-2xl font-medium text-text-strong flex items-center gap-2.5">
                    <BarChart className="w-5 h-5 text-violet-500" />
                    Evaluation Matrix
                </h3>
                <p className="text-sm text-text-mute mt-1">
                    Select any quadrant to inspect how production teams combine deterministic checks with qualitative rubrics.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {EVAL_CELLS.map((c) => {
                    const active = selected === c.id;
                    return (
                        <button
                            key={c.id}
                            type="button"
                            onMouseEnter={() => setSelected(c.id)}
                            onClick={() => setSelected(c.id)}
                            data-cursor="step"
                            className={`rounded-xl border p-5 text-left transition-all ${
                                active ? 'bg-bg' : 'bg-panel/40 border-hairline hover:border-hairline-strong'
                            }`}
                            style={active ? { borderColor: `${c.accent}70`, backgroundColor: `${c.accent}0e` } : undefined}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-mono uppercase tracking-[0.16em]" style={{ color: c.accent }}>
                                    {c.subtitle}
                                </span>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.accent }} />
                            </div>
                            <h4 className="font-display text-lg font-medium text-text-strong mb-1.5">{c.title}</h4>
                            <p className="text-xs text-text leading-relaxed">{c.ex}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ==========================================
// VISUALIZATION 5: MULTI-AGENT SMART HOME
// ==========================================
const MultiAgentViz = () => {
    const reduced = usePrefersReducedMotion();
    const [activeAgent, setActiveAgent] = useState<'orch' | 'sec' | 'climate' | 'inventory' | null>(null);
    const [trigger, setTrigger] = useState<'night' | 'cold' | 'groceries' | null>(null);
    const timerRef = useRef<number[]>([]);

    const specialists = [
        { id: 'sec' as const, name: 'Security Agent', icon: Lock, accent: '#f43f5e', desc: 'Biometrics, perimeter locks, cameras' },
        { id: 'climate' as const, name: 'Climate Agent', icon: Thermometer, accent: '#f59e0b', desc: 'HVAC schedules & weather APIs' },
        { id: 'inventory' as const, name: 'Inventory Agent', icon: Database, accent: '#3b82f6', desc: 'Pantry vision & automated grocery orders' },
    ];

    const handleTrigger = (event: 'night' | 'cold' | 'groceries') => {
        timerRef.current.forEach((id) => window.clearTimeout(id));
        timerRef.current = [];
        setTrigger(event);
        setActiveAgent('orch');

        const target = event === 'cold' ? 'climate' : event === 'night' ? 'sec' : 'inventory';
        const t1 = window.setTimeout(() => setActiveAgent(target), reduced ? 120 : 650);
        timerRef.current.push(t1);
    };

    const statusLine =
        trigger === 'cold'
            ? 'Orchestrator -> Climate Agent: Raising living-room setpoint to 22°C.'
            : trigger === 'night'
              ? 'Orchestrator -> Security Agent: Engaging deadbolts & arming perimeter sensors.'
              : trigger === 'groceries'
                ? 'Orchestrator -> Inventory Agent: Scanning fridge camera & queueing milk + eggs.'
                : 'Select a household event below to watch hierarchical delegation.';

    return (
        <div className="frame-ticks rounded-2xl border border-hairline bg-panel/60 p-6 md:p-8">
            <div className="mb-6">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-text-mute mb-1">
                    Interactive Module · 05
                </div>
                <h3 className="font-display text-xl md:text-2xl font-medium text-text-strong flex items-center gap-2.5">
                    <Layers className="w-5 h-5 text-emerald-500" />
                    Hierarchical Multi-Agent Routing
                </h3>
            </div>

            {/* Clean Hub & Spoke Grid */}
            <div className="bg-bg rounded-2xl border border-hairline p-6 mb-5">
                <div className="flex flex-col items-center">
                    {/* Orchestrator */}
                    <motion.div
                        animate={activeAgent === 'orch' && !reduced ? { scale: 1.04 } : { scale: 1 }}
                        className={`w-full max-w-xs rounded-xl border p-4 flex items-center gap-3.5 transition-colors ${
                            activeAgent === 'orch'
                                ? 'border-emerald-500 bg-emerald-500/12'
                                : 'border-hairline-strong bg-panel'
                        }`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-text-strong">Orchestrator</div>
                            <div className="text-[11px] font-mono text-text-mute">Intent router &amp; synthesizer</div>
                        </div>
                    </motion.div>

                    {/* Connector Spine */}
                    <div className="w-px h-7 bg-hairline-strong" />
                    <div className="hidden sm:block w-2/3 h-px bg-hairline-strong" />

                    {/* Specialists */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mt-4">
                        {specialists.map((s) => {
                            const Icon = s.icon;
                            const isActive = activeAgent === s.id;
                            return (
                                <motion.div
                                    key={s.id}
                                    animate={isActive && !reduced ? { y: -3 } : { y: 0 }}
                                    className="rounded-xl border p-4 transition-colors"
                                    style={
                                        isActive
                                            ? { borderColor: s.accent, backgroundColor: `${s.accent}12` }
                                            : { borderColor: 'var(--color-hairline)', backgroundColor: 'var(--color-panel)' }
                                    }
                                >
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <div
                                            className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                                            style={{ borderColor: `${s.accent}44`, backgroundColor: `${s.accent}14`, color: s.accent }}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-medium text-text-strong">{s.name}</span>
                                    </div>
                                    <p className="text-[11px] text-text-mute leading-relaxed">{s.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center mb-4">
                {(
                    [
                        { id: 'night', label: 'Event: "Goodnight"', accent: '#f43f5e' },
                        { id: 'cold', label: 'Event: "I am cold"', accent: '#f59e0b' },
                        { id: 'groceries', label: 'Event: "Check groceries"', accent: '#3b82f6' },
                    ] as const
                ).map((btn) => (
                    <button
                        key={btn.id}
                        type="button"
                        onClick={() => handleTrigger(btn.id)}
                        data-cursor="play"
                        className={`px-4 py-2 rounded-full border text-xs font-mono transition-colors ${
                            trigger === btn.id
                                ? 'bg-text-strong text-bg border-text-strong'
                                : 'bg-bg border-hairline text-text-strong hover:border-hairline-strong'
                        }`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            <div className="text-center font-mono text-xs text-text-strong bg-bg border border-hairline rounded-lg px-4 py-2.5">
                {statusLine}
            </div>
        </div>
    );
};

// ==========================================
// VISUALIZATION 6: VECTOR EMBEDDINGS / RAG
// ==========================================
const VECTOR_DOCS = [
    { id: 1, x: 22, y: 24, topic: 'Finance', text: 'AAPL Q3 Report' },
    { id: 2, x: 34, y: 36, topic: 'Finance', text: 'Stock Market Trends' },
    { id: 3, x: 78, y: 24, topic: 'Biology', text: 'Cell Mitosis' },
    { id: 4, x: 68, y: 38, topic: 'Biology', text: 'DNA Sequencing' },
    { id: 5, x: 50, y: 66, topic: 'Culinary', text: 'Pasta Carbonara Recipe' },
];

const QUERY_PRESETS = [
    { label: '"Q3 Earnings"', x: 26, y: 29 },
    { label: '"Genetics"', x: 72, y: 32 },
    { label: '"Dinner Ideas"', x: 52, y: 61 },
];

const VectorEmbeddingsViz = () => {
    const [queryPos, setQueryPos] = useState({ x: 26, y: 29 });

    const nearest = useMemo(() => {
        let bestDoc = VECTOR_DOCS[0];
        let minDist = Infinity;
        for (const doc of VECTOR_DOCS) {
            const d = Math.hypot(doc.x - queryPos.x, doc.y - queryPos.y);
            if (d < minDist) {
                minDist = d;
                bestDoc = doc;
            }
        }
        const similarity = Math.max(0, Math.min(0.99, 1 - minDist / 90));
        return minDist < 32 ? { doc: bestDoc, similarity } : null;
    }, [queryPos]);

    return (
        <div className="frame-ticks rounded-2xl border border-hairline bg-panel/60 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-text-mute mb-1">
                        Interactive Module · 06
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-medium text-text-strong flex items-center gap-2.5">
                        <Database className="w-5 h-5 text-amber-500" />
                        Semantic Vector Space (RAG)
                    </h3>
                </div>

                {/* Preset query probes for click/touch */}
                <div className="flex flex-wrap gap-1.5">
                    {QUERY_PRESETS.map((p) => (
                        <button
                            key={p.label}
                            type="button"
                            onClick={() => setQueryPos({ x: p.x, y: p.y })}
                            data-cursor="step"
                            className="px-2.5 py-1 rounded-full border border-hairline bg-bg hover:border-hairline-strong text-[11px] font-mono text-text-strong transition-colors"
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <p className="text-sm text-text-mute mb-4">
                Move your pointer across the embedding plane (or click a query preset) to retrieve the semantically closest document chunk.
            </p>

            <div
                className="relative h-64 bg-bg rounded-xl border border-hairline overflow-hidden cursor-crosshair select-none"
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setQueryPos({
                        x: Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100)),
                        y: Math.max(8, Math.min(92, ((e.clientY - rect.top) / rect.height) * 100)),
                    });
                }}
            >
                <div
                    className="absolute inset-0 opacity-[0.14] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-text-mute) 1px, transparent 0)',
                        backgroundSize: '24px 24px',
                    }}
                />

                {nearest && (
                    <svg className="absolute inset-0 pointer-events-none w-full h-full">
                        <line
                            x1={`${queryPos.x}%`}
                            y1={`${queryPos.y}%`}
                            x2={`${nearest.doc.x}%`}
                            y2={`${nearest.doc.y}%`}
                            stroke="#f59e0b"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                        />
                    </svg>
                )}

                {VECTOR_DOCS.map((doc) => {
                    const isMatch = nearest?.doc.id === doc.id;
                    return (
                        <div
                            key={doc.id}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${
                                isMatch ? 'scale-125 z-20' : 'z-10'
                            }`}
                            style={{ left: `${doc.x}%`, top: `${doc.y}%` }}
                        >
                            <div
                                className={`w-3.5 h-3.5 rounded-full border-2 ${
                                    isMatch
                                        ? 'bg-amber-500 border-amber-300'
                                        : 'bg-panel-strong border-text-mute'
                                }`}
                            />
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-strong whitespace-nowrap bg-panel border border-hairline px-1.5 py-0.5 rounded">
                                {doc.text}
                            </div>
                        </div>
                    );
                })}

                <div
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-rose-500 rounded-full ring-4 ring-rose-500/25 z-30 pointer-events-none"
                    style={{ left: `${queryPos.x}%`, top: `${queryPos.y}%` }}
                >
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[10px] font-mono px-2 py-0.5 rounded whitespace-nowrap">
                        Query Vector
                    </div>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 bg-bg border border-hairline rounded-lg px-4 py-2.5 font-mono text-xs">
                {nearest ? (
                    <>
                        <span className="text-text-strong">
                            Retrieved: <span className="text-amber-500">&quot;{nearest.doc.text}&quot;</span> ({nearest.doc.topic})
                        </span>
                        <span className="text-emerald-500">cos_sim = {nearest.similarity.toFixed(2)}</span>
                    </>
                ) : (
                    <span className="text-text-mute">Move closer to a document cluster to trigger top-1 retrieval...</span>
                )}
            </div>
        </div>
    );
};

// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
const AgenticAIPage = () => {
    return (
        <SubPageShell statusLabel="CS230 · Lec 7" accentColor={AGENTIC_ACCENT} sections={AGENTIC_SECTIONS}>
            <SEO
                title="Beyond the Model: Agentic AI Systems (Stanford CS230)"
                description="Interactive synthesis of Stanford CS230 Lecture 7: Autonomy Spectrum, Jagged Frontier, ReAct loops, Evals, Multi-Agent orchestration, and RAG."
                url="https://wutcharin.com/agentic-ai"
            />
            <SubPageHero
                badgeLabel="Stanford CS230 · Kian Katanforoosh"
                BadgeIcon={BookOpen}
                titleLead="Beyond the"
                titleAccent="Model."
                accentColor={AGENTIC_ACCENT}
                description={
                    <>
                        We spent a decade building bigger brains. Now we engineer the{' '}
                        <span className="font-normal text-text-strong">hands, eyes, memory, and guardrails</span> that make them reliable in
                        production.
                    </>
                }
                primaryCta={{ label: 'Explore interactive modules', href: '#sec-shift', icon: Zap }}
                secondaryCta={{
                    label: 'Watch lecture',
                    href: 'https://www.youtube.com/watch?v=k1njvbBmfsw',
                    icon: Youtube,
                    external: true,
                }}
            />

            <div id="article" className="mx-auto max-w-5xl px-6 space-y-24 pb-20">
                {/* 01 · THE SHIFT */}
                <section id="sec-shift" className="scroll-mt-28">
                    <SectionHeader
                        index="01"
                        eyebrow="The Vertical Axis of Optimization"
                        title="From chatbots to"
                        accent="autonomous agents."
                        accentColor={AGENTIC_ACCENT}
                        className="mb-10"
                        lead="Hold the base model constant and engineer the surrounding system: prompting, retrieval, tool loops, and verification guardrails."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {[
                            {
                                n: '01',
                                title: 'Knowledge Gaps',
                                desc: 'Vanilla pre-trained weights lack private company datasets and live post-cutoff operational facts.',
                            },
                            {
                                n: '02',
                                title: 'Control & Steering',
                                desc: 'Raw models drift without explicit system constraints, structured schemas, and refusal guardrails.',
                            },
                            {
                                n: '03',
                                title: 'High-Precision Narrow Tasks',
                                desc: 'Medical, legal, and financial workflows demand deterministic accuracy that generalist weights cannot guarantee alone.',
                            },
                            {
                                n: '04',
                                title: 'Finite Context Windows',
                                desc: 'Even 200k+ token windows degrade in retrieval precision; indexing and chunked RAG remain essential at scale.',
                            },
                        ].map((item) => (
                            <div key={item.n} className="rounded-xl border border-hairline bg-panel/50 p-5">
                                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-500 mb-2">
                                    Limitation {item.n}
                                </div>
                                <h3 className="text-base font-medium text-text-strong mb-1.5">{item.title}</h3>
                                <p className="text-sm text-text-mute leading-relaxed font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <AutonomySpectrumViz />
                </section>

                {/* 02 · JAGGED FRONTIER */}
                <section id="sec-frontier" className="scroll-mt-28">
                    <SectionHeader
                        index="02"
                        eyebrow="Prompt Engineering & Human Modes"
                        title="Navigating the"
                        accent="Jagged Frontier."
                        accentColor={AGENTIC_ACCENT}
                        className="mb-10"
                        lead="BCG consultant research shows AI capabilities form an uneven boundary: simple tasks can fail while complex synthesis succeeds."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="rounded-xl border border-hairline bg-panel/50 p-6">
                            <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-500 mb-3">
                                Cyborg Mode
                            </span>
                            <h3 className="text-lg font-medium text-text-strong mb-2">Tight Loop Integration</h3>
                            <p className="text-sm text-text-mute leading-relaxed font-light">
                                Human and model iterate continuously in the same workspace, intertwining drafts, critiques, and edits step by step.
                            </p>
                        </div>
                        <div className="rounded-xl border border-hairline bg-panel/50 p-6">
                            <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-500 mb-3">
                                Centaur Mode
                            </span>
                            <h3 className="text-lg font-medium text-text-strong mb-2">Strategic Delegation</h3>
                            <p className="text-sm text-text-mute leading-relaxed font-light">
                                Clear boundary between human judgment and delegated AI subtasks, reducing silent failure risk in high-stakes pipelines.
                            </p>
                        </div>
                    </div>

                    <SimplifiedJaggedFrontierViz />
                </section>

                {/* 03 · FINE-TUNING */}
                <section id="sec-finetune" className="scroll-mt-28">
                    <SectionHeader
                        index="03"
                        eyebrow="Weight Modification Trade-Offs"
                        title="Fine-tuning: when"
                        accent="(not) to use it."
                        accentColor={AGENTIC_ACCENT}
                        className="mb-10"
                        lead="Reserve fine-tuning for narrow formatting or dialect niches where prompting and RAG provably plateau."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-hairline bg-panel/50 p-6 space-y-3.5">
                            <h3 className="text-base font-medium text-text-strong flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-rose-500" />
                                Why teams avoid premature fine-tuning
                            </h3>
                            {[
                                { k: 'Cost & Maintenance', v: 'Curating clean datasets, training GPUs, and hosting custom weights adds recurring overhead.' },
                                { k: 'Rapid Obsolescence', v: 'A stronger frontier base model often ships before a fine-tuned checkpoint pays back its cost.' },
                                { k: 'Catastrophic Forgetting', v: 'Overfitting narrow examples degrades general instruction-following behavior.' },
                            ].map((row) => (
                                <div key={row.k} className="flex items-start gap-2.5 text-sm text-text-mute">
                                    <X className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                                    <span>
                                        <strong className="text-text-strong font-medium">{row.k}:</strong> {row.v}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-hairline bg-bg p-6 font-mono text-xs flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-amber-500 uppercase tracking-[0.16em] text-[10px] mb-3">
                                    <FileText className="w-3.5 h-3.5" /> Lecture Cautionary Tale
                                </div>
                                <div className="text-text-mute mb-3">
                                    # Developer fine-tuned an LLM on internal Slack logs
                                </div>
                                <div className="text-emerald-500">User: &quot;Write a technical blog post.&quot;</div>
                                <div className="text-rose-500 mt-2">Model: &quot;I&apos;ll do it in the morning.&quot;</div>
                            </div>
                            <p className="text-[11px] text-text-mute mt-4 pt-3 border-t border-hairline font-sans">
                                Fine-tuning shifts behavioral priors, not just factual knowledge. The model learned team procrastination habits instead of writing skill.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 04 · AGENTIC WORKFLOWS */}
                <section id="sec-loop" className="scroll-mt-28">
                    <SectionHeader
                        index="04"
                        eyebrow="Prompts · Memory · Tools · MCP"
                        title="Engineering the"
                        accent="Agentic Loop."
                        accentColor={AGENTIC_ACCENT}
                        className="mb-10"
                        lead="Agents pair probabilistic language reasoning with deterministic tool calls, split across working context and archival memory."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            {
                                title: 'Prompts & Policies',
                                desc: 'Defines persona, strict schemas, escalation rules, and stopping conditions.',
                                icon: MessageSquare,
                            },
                            {
                                title: 'Working + Archival Memory',
                                desc: 'Immediate session context paired with long-term vector recall fetched only when needed.',
                                icon: Brain,
                            },
                            {
                                title: 'Tools & MCP Servers',
                                desc: 'Standardized Model Context Protocol endpoints let agents discover APIs without hardcoded glue.',
                                icon: Hammer,
                            },
                        ].map((card) => (
                            <div key={card.title} className="rounded-xl border border-hairline bg-panel/50 p-5">
                                <card.icon className="w-4 h-4 text-sky-500 mb-3" />
                                <h3 className="text-sm font-medium text-text-strong mb-1.5">{card.title}</h3>
                                <p className="text-xs text-text-mute leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </div>

                    <ToolUseViz />
                </section>

                {/* 05 · EVALS */}
                <section id="sec-evals" className="scroll-mt-28">
                    <SectionHeader
                        index="05"
                        eyebrow="Observability & Verification"
                        title="Evals: measuring"
                        accent="what actually works."
                        accentColor={AGENTIC_ACCENT}
                        className="mb-10"
                        lead="Decompose workflows into traces, score every step with component-wise evals, and verify end-to-end business outcomes."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            { icon: Eye, title: 'Full Traces', desc: 'Capture every prompt, retrieved chunk, and tool payload to pinpoint failure origins.' },
                            { icon: BarChart, title: 'Dual Metrics', desc: 'Track latency, token cost, and pass rate alongside tone and hallucination rubrics.' },
                            { icon: Target, title: 'Staged Evals', desc: 'Task decomposition -> Component-wise assertions -> End-to-end outcome tests.' },
                        ].map((c) => (
                            <div key={c.title} className="rounded-xl border border-hairline bg-panel/50 p-5">
                                <c.icon className="w-4 h-4 text-violet-500 mb-3" />
                                <h3 className="text-sm font-medium text-text-strong mb-1">{c.title}</h3>
                                <p className="text-xs text-text-mute leading-relaxed">{c.desc}</p>
                            </div>
                        ))}
                    </div>

                    <EvalMatrixViz />
                </section>

                {/* 06 · MULTI-AGENT */}
                <section id="sec-multi" className="scroll-mt-28">
                    <SectionHeader
                        index="06"
                        eyebrow="Parallelism & Specialization"
                        title="Multi-agent"
                        accent="orchestration."
                        accentColor={AGENTIC_ACCENT}
                        className="mb-10"
                        lead="Specialized agents with narrow tool permissions outperform monolithic prompts and scale horizontally across departments."
                    />

                    <MultiAgentViz />
                </section>

                {/* 07 · RAG */}
                <section id="sec-rag" className="scroll-mt-28">
                    <SectionHeader
                        index="07"
                        eyebrow="Semantic Grounding"
                        title="Retrieval Augmented"
                        accent="Generation (RAG)."
                        accentColor={AGENTIC_ACCENT}
                        className="mb-10"
                        lead="Convert private documents into dense vector embeddings, chunk by meaning, and amplify vague queries with HyDE."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                        {[
                            { step: '01', title: 'Chunk & Embed', desc: 'Split documents by semantic boundary and map each chunk into vector space.' },
                            { step: '02', title: 'Vector Index', desc: 'Store embeddings so conceptually related passages cluster together.' },
                            { step: '03', title: 'Semantic Recall', desc: 'Retrieve top-k passages by cosine similarity or HyDE hypothetical answers.' },
                            { step: '04', title: 'Grounded Gen', desc: 'Synthesize answers strictly cited from retrieved source chunks.' },
                        ].map((s) => (
                            <div key={s.step} className="rounded-xl border border-hairline bg-panel/50 p-4">
                                <span className="font-mono text-[10px] text-amber-500 tracking-[0.2em]">STEP {s.step}</span>
                                <h3 className="text-sm font-medium text-text-strong mt-1 mb-1">{s.title}</h3>
                                <p className="text-xs text-text-mute leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>

                    <VectorEmbeddingsViz />
                </section>

                {/* 08 · FUTURE TRAJECTORY */}
                <section id="sec-future" className="scroll-mt-28">
                    <SectionHeader
                        index="08"
                        eyebrow="Deterministic + Fuzzy Engineering"
                        title="The engineering"
                        accent="mindset shift."
                        accentColor={AGENTIC_ACCENT}
                        className="mb-10"
                        lead="Modern AI systems pair deterministic API contracts with probabilistic LLM reasoning, guarded by human-in-the-loop interrupts."
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {[
                                { icon: TrendingUp, title: 'Architecture Search', desc: 'New model families and test-time compute extend progress beyond pure pre-training scale.' },
                                { icon: Layers, title: 'Native Multimodality', desc: 'Vision and audio grounding directly strengthen world-model reasoning in text.' },
                                { icon: Network, title: 'Paradigm Convergence', desc: 'Supervised learning, RL, retrieval, and tool loops converge into unified agents.' },
                                { icon: Lightbulb, title: 'Breadth Then Depth', desc: 'Hacks expire fast; durable value lies in systems intuition across evals, RAG, and guardrails.' },
                            ].map((item) => (
                                <div key={item.title} className="rounded-xl border border-hairline bg-panel/50 p-5">
                                    <item.icon className="w-4 h-4 text-sky-500 mb-2.5" />
                                    <h3 className="text-sm font-medium text-text-strong mb-1">{item.title}</h3>
                                    <p className="text-xs text-text-mute leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-6 rounded-2xl border border-hairline bg-bg p-6 font-mono text-xs flex flex-col justify-between">
                            <div className="flex items-center justify-between text-text-mute border-b border-hairline pb-3 mb-4">
                                <span className="flex items-center gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-sky-500" />
                                    agent_system.py
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.16em]">Hybrid Runtime</span>
                            </div>
                            <pre className="text-text leading-relaxed overflow-x-auto">{`# 1. Deterministic Infrastructure
record = db.fetch_order(order_id)

# 2. Fuzzy Reasoning Layer
proposal = llm.synthesize_resolution(
    policy=rag.retrieve(record.category),
    context=record,
)

# 3. Deterministic Guardrail & HITL
if proposal.refund_amount > 500 or proposal.confidence < 0.90:
    await escalate_to_human(proposal)
else:
    stripe.issue_refund(record.charge_id, proposal.refund_amount)`}</pre>
                        </div>
                    </div>
                </section>
            </div>

            <ProjectNavigation currentId="agentic-ai" />
        </SubPageShell>
    );
};

export default AgenticAIPage;
