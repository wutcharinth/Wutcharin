import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowDown, Brain, TrendingUp, CheckCircle2, AlertTriangle,
    User, FileText,
    Search, Bot, Play, Hammer, Eye, MessageSquare, Youtube, BookOpen,
    Layers, Target, Zap, Terminal, Database,
    Lightbulb, Clock, Thermometer, Lock, Network, BarChart,
    X
} from 'lucide-react';
import Lenis from 'lenis';
import ProjectNavigation from '../components/ProjectNavigation';

// ==========================================
// VISUALIZATION 1: THE AUTONOMY SPECTRUM
// ==========================================
const AutonomySpectrumViz = () => {
    const [level, setLevel] = useState(0);
    
    const levels = [
        {
            title: "Zero-Shot",
            desc: "Raw Intelligence",
            detail: "The model responds immediately based on training data. Fast but hallucination-prone.",
            prompt: "Write code for Snake game.",
            response: "Here is the Python code for Snake...",
            stats: { time: "0.5s", cost: "$", reliability: "Low" },
            icon: Zap,
            color: "blue"
        },
        {
            title: "Chain of Thought",
            desc: "Reasoning",
            detail: "The model 'thinks out loud', breaking problems down step-by-step before answering.",
            prompt: "Write Snake game.",
            response: "Thinking Process:\n1. Define grid size\n2. Handle input loop\n3. Collision detection\n\nCode: ...",
            stats: { time: "2.0s", cost: "$$", reliability: "Medium" },
            icon: Brain,
            color: "purple"
        },
        {
            title: "RAG",
            desc: "Context Awareness",
            detail: "The model retrieves external knowledge to ground its answer in reality.",
            prompt: "Fix error 404 in API v2.1",
            response: "Searching docs... Found 'v2.1 Routing Changes'.\n\nAnswer: Update endpoint to...",
            stats: { time: "1.5s", cost: "$$", reliability: "High (Factual)" },
            icon: Search,
            color: "yellow"
        },
        {
            title: "Agentic",
            desc: "Tool Use & Loops",
            detail: "The model plans, executes tools, observes results, and iterates until success.",
            prompt: "Find undervalued tech stock and buy it.",
            response: "1. Tool: MarketSearch('tech', 'undervalued')\n2. Obs: Found 'InnoCorp' (PE: 12)\n3. Tool: NewsSearch('InnoCorp')\n4. Action: Buy('InnoCorp')",
            stats: { time: "15.0s", cost: "$$$$", reliability: "High (Actionable)" },
            icon: Bot,
            color: "emerald"
        }
    ];

    const Icon = levels[level].icon;

    return (
        <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800/50 backdrop-blur-sm overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-50"></div>
            
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <TrendingUp className="text-blue-400" /> The Spectrum of Autonomy
                </h3>
                <p className="text-slate-400 mt-2">See how AI evolves from a chatbot to an autonomous agent.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Controls */}
                <div className="flex-1 space-y-3">
                    {levels.map((l, i) => {
                        const LevelIcon = l.icon;
                        return (
                        <button
                            key={i}
                            onClick={() => setLevel(i)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group relative overflow-hidden ${
                                level === i 
                                ? 'bg-slate-800 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] translate-x-2' 
                                : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${level === i ? 'bg-blue-500' : 'bg-transparent'} transition-all`}></div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${level === i ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}`}>
                                <LevelIcon size={24} />
                            </div>
                            <div>
                                <div className={`font-bold text-lg ${level === i ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{l.title}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">{l.desc}</div>
                            </div>
                            {level === i && <div className="ml-auto text-blue-400 font-mono text-xs">ACTIVE</div>}
                        </button>
                    )})}
                </div>

                {/* Display */}
                <div className="flex-[1.5] bg-black/40 rounded-2xl border border-slate-800 p-0 flex flex-col shadow-inner relative overflow-hidden min-h-[300px]">
                    <div className="bg-slate-900/80 border-b border-slate-800 p-4 flex justify-between items-center">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="font-mono text-xs text-slate-500">Output Console</div>
                    </div>

                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={level}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 p-6 flex flex-col"
                        >
                            <div className="flex gap-4 mb-6">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                                    <User size={16} className="text-slate-300" />
                                </div>
                                <div className="bg-slate-800/50 rounded-lg rounded-tl-none p-3 border border-slate-700 text-slate-300 text-sm">
                                    {levels[level].prompt}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                                    <Icon size={16} className="text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="bg-blue-900/10 rounded-lg rounded-tl-none p-4 border border-blue-500/20 font-mono text-sm text-blue-100 relative overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }} 
                                            animate={{ width: "100%" }} 
                                            transition={{ duration: 1, ease: "linear" }}
                                            className="whitespace-pre-wrap"
                                        >
                                            {levels[level].response}
                                        </motion.div>
                                        <motion.span 
                                            animate={{ opacity: [0, 1, 0] }} 
                                            transition={{ duration: 0.8, repeat: Infinity }}
                                            className="inline-block w-2 h-4 bg-blue-400 ml-1 align-middle"
                                        />
                                    </div>
                                    
                                    <div className="flex gap-6 mt-3 px-2">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock size={12} /> Time: <span className="text-slate-300">{levels[level].stats.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="font-bold">$</span> Cost: <span className="text-slate-300">{levels[level].stats.cost}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <CheckCircle2 size={12} /> Reliability: <span className="text-slate-300">{levels[level].stats.reliability}</span>
                                        </div>
                                    </div>
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
const SimplifiedJaggedFrontierViz = () => {
    const [selectedTask, setSelectedTask] = useState<string | null>(null);

    const tasks = [
        { 
            name: "Summarize Paper", 
            difficulty: "Medium", 
            aiCapable: true, 
            zone: "inside",
            result: "✅ AI excels at summarization tasks. Consultants trained in prompting significantly outperformed those who weren't.",
            color: "green"
        },
        { 
            name: "Extract Issues", 
            difficulty: "Medium", 
            aiCapable: true, 
            zone: "inside",
            result: "✅ AI can break down complex tasks when properly prompted with Chain of Thought.",
            color: "green"
        },
        { 
            name: "Medical Diagnosis", 
            difficulty: "High Precision", 
            aiCapable: false, 
            zone: "outside",
            result: "❌ Generalist models may fail at high-precision tasks where specific style and formatting are non-negotiable.",
            color: "red"
        },
        { 
            name: "Legal Contract Review", 
            difficulty: "High Precision", 
            aiCapable: false, 
            zone: "outside",
            result: "❌ Requires domain-specific knowledge and precision that base models lack without RAG or fine-tuning.",
            color: "red"
        }
    ];

    return (
        <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <AlertTriangle className="text-yellow-400" /> The Challenge: Knowledge Gaps & Control Issues
            </h3>
            <p className="text-slate-400 text-sm mb-6">
                Base models have limitations: Knowledge Gaps (lack domain-specific data), Control Issues (difficult to steer), Performance on Narrow Tasks (may fail at high-precision tasks), and Context Limitations (finite context windows).
            </p>

            {/* Visual Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {tasks.map((task, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedTask(selectedTask === task.name ? null : task.name)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                            task.zone === 'inside' 
                            ? 'bg-green-900/20 border-green-500/30 hover:border-green-500/50' 
                            : 'bg-red-900/20 border-red-500/30 hover:border-red-500/50'
                        } ${selectedTask === task.name ? 'ring-2 ring-offset-2 ring-offset-slate-900' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className={`w-3 h-3 rounded-full ${task.zone === 'inside' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs text-slate-500">{task.difficulty}</span>
                        </div>
                        <div className="font-bold text-white text-sm mb-1">{task.name}</div>
                        <div className={`text-xs ${task.zone === 'inside' ? 'text-green-400' : 'text-red-400'}`}>
                            {task.zone === 'inside' ? '✅ AI Zone' : '❌ Human Zone'}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
                {selectedTask && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-6 bg-slate-800/50 rounded-xl border border-slate-700"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${tasks.find(t => t.name === selectedTask)?.zone === 'inside' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                {tasks.find(t => t.name === selectedTask)?.zone === 'inside' ? (
                                    <CheckCircle2 className="text-green-400 w-6 h-6" />
                                ) : (
                                    <AlertTriangle className="text-red-400 w-6 h-6" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-2">{selectedTask}</h4>
                                <p className="text-slate-300 text-sm">
                                    {tasks.find(t => t.name === selectedTask)?.result}
                                </p>
                                <p className="text-slate-400 text-xs mt-2">
                                    This demonstrates why base models need augmentation strategies like RAG, prompting, or fine-tuning for specialized applications.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                <p className="text-sm text-blue-200">
                    <strong className="text-white">Key Insight:</strong> Base models need augmentation (RAG, prompting, fine-tuning) to handle domain-specific or high-precision tasks. The solution is engineering the system around the model, not just using it as-is.
                </p>
            </div>
        </div>
    );
};

// ==========================================
// VISUALIZATION 4: TOOL USE PATTERN (NEW)
// ==========================================
const ToolUseViz = () => {
    const [step, setStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const steps = [
        { type: 'thought', text: "User wants to know the weather. I need to use a tool.", icon: Brain },
        { type: 'action', text: "CALL: WeatherAPI(location='Tokyo')", icon: Hammer },
        { type: 'observation', text: "RETURN: {temp: '14°C', condition: 'Rainy'}", icon: Eye },
        { type: 'response', text: "It's 14°C and rainy in Tokyo. Bring an umbrella!", icon: MessageSquare }
    ];

    const runSimulation = () => {
        setIsRunning(true);
        setStep(0);
        steps.forEach((_, i) => {
            setTimeout(() => {
                setStep(i);
                if (i === steps.length - 1) setIsRunning(false);
            }, i * 1500);
        });
    };

    return (
        <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800/50 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <Hammer size={150} className="text-blue-500" />
            </div>

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg"><Hammer className="text-blue-400" size={20} /></div>
                    Pattern 2: Tool Use
                </h3>
                <button
                    onClick={runSimulation}
                    disabled={isRunning}
                    className={`px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isRunning ? 'opacity-50' : ''}`}
                >
                    <Play size={16} /> Run Demo
                </button>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 font-mono text-sm min-h-[200px] relative z-10">
                {step === 0 && !isRunning && (
                    <div className="text-slate-600 text-center mt-10 italic">Click 'Run Demo' to see how an agent uses tools...</div>
                )}

                <AnimatePresence>
                    {steps.map((s, i) => {
                        if (i > step) return null;
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`mb-4 flex gap-3 ${
                                    s.type === 'thought' ? 'text-slate-400' :
                                    s.type === 'action' ? 'text-yellow-400 bg-yellow-900/20 p-3 rounded border border-yellow-900/50' :
                                    s.type === 'observation' ? 'text-blue-300 pl-8' :
                                    'text-green-400 border-t border-slate-800 pt-4'
                                }`}
                            >
                                <Icon size={18} className="mt-1 flex-shrink-0" />
                                <span className="text-xs">
                                    <span className="uppercase text-slate-500 font-bold tracking-wider block mb-1">{s.type}</span>
                                    {s.text}
                                </span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <p className="mt-4 text-sm text-slate-400 relative z-10">
                Agents can call external APIs (calculators, web search, databases) to get real-time information and take actions.
            </p>
        </div>
    );
};

// ==========================================
// VISUALIZATION 6: MULTI-AGENT SMART HOME (FROM LECTURE)
// ==========================================
const MultiAgentViz = () => {
    const [activeAgent, setActiveAgent] = useState<string | null>(null);
    const [trigger, setTrigger] = useState<string | null>(null);

    const agents = [
        { id: 'orch', name: 'Orchestrator', icon: Bot, color: 'emerald', pos: 'top-4 left-1/2 -translate-x-1/2', desc: 'Handles user communication' },
        { id: 'sec', name: 'Security', icon: Lock, color: 'red', pos: 'bottom-8 left-1/4 -translate-x-1/2', desc: 'Manages access/biometrics' },
        { id: 'climate', name: 'Climate/Energy', icon: Thermometer, color: 'yellow', pos: 'bottom-8 left-1/2 -translate-x-1/2', desc: 'Optimizes temperature via weather APIs' },
        { id: 'inventory', name: 'Inventory', icon: Database, color: 'blue', pos: 'bottom-8 right-1/4 translate-x-1/2', desc: 'Checks fridge via camera, orders groceries' }
    ];

    const handleTrigger = (event: string) => {
        setTrigger(event);
        if (event === 'cold') {
            setActiveAgent('orch');
            setTimeout(() => setActiveAgent('climate'), 1000);
            setTimeout(() => setActiveAgent(null), 3000);
        } else if (event === 'night') {
            setActiveAgent('orch');
            setTimeout(() => setActiveAgent('sec'), 1000);
            setTimeout(() => setActiveAgent(null), 3000);
        } else if (event === 'groceries') {
            setActiveAgent('orch');
            setTimeout(() => setActiveAgent('inventory'), 1000);
            setTimeout(() => setActiveAgent(null), 3000);
        }
    };

    return (
        <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800/50 hover:border-slate-700 transition-colors relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <Layers size={150} className="text-emerald-500" />
            </div>

            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2 relative z-10">
                <div className="p-2 bg-emerald-500/20 rounded-lg"><Layers className="text-emerald-400" size={20} /></div>
                Multi-Agent System: Smart Home Example
            </h3>

            <div className="relative h-[500px] w-full max-w-4xl mx-auto relative z-10 mb-6 bg-slate-950/30 rounded-xl p-12">
                {agents.map(a => {
                    const Icon = a.icon;
                    const colorClasses: Record<string, string> = {
                        'emerald': 'bg-emerald-600 ring-emerald-900/50',
                        'red': 'bg-red-600 ring-red-900/50',
                        'yellow': 'bg-yellow-600 ring-yellow-900/50',
                        'blue': 'bg-blue-600 ring-blue-900/50'
                    };
                    const pingClasses: Record<string, string> = {
                        'emerald': 'bg-emerald-500',
                        'red': 'bg-red-500',
                        'yellow': 'bg-yellow-500',
                        'blue': 'bg-blue-500'
                    };
                    return (
                        <motion.div
                            key={a.id}
                            animate={{
                                scale: activeAgent === a.id ? 1.2 : 1,
                                opacity: activeAgent === a.id ? 1 : activeAgent ? 0.3 : 1
                            }}
                            className={`absolute ${a.pos} w-40 text-center z-20 transition-all`}
                        >
                            <div className={`w-24 h-24 ${colorClasses[a.color]} rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl ring-4 relative`}>
                                <Icon size={48} className="text-white" />
                                {activeAgent === a.id && (
                                    <div className={`absolute inset-0 ${pingClasses[a.color]} rounded-2xl animate-ping opacity-40`}></div>
                                )}
                            </div>
                            <div className="font-bold text-white text-base bg-slate-900 px-4 py-2 rounded-full border border-slate-700 inline-block mb-2 whitespace-nowrap">{a.name}</div>
                            <div className="text-xs text-slate-300 leading-relaxed max-w-[140px] mx-auto">{a.desc}</div>
                        </motion.div>
                    );
                })}

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-30">
                    {/* Orchestrator to Security */}
                    <line x1="50%" y1="12%" x2="25%" y2="88%" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
                    {/* Orchestrator to Climate */}
                    <line x1="50%" y1="12%" x2="50%" y2="88%" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
                    {/* Orchestrator to Inventory */}
                    <line x1="50%" y1="12%" x2="75%" y2="88%" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />
                </svg>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-4 max-w-4xl mx-auto">
                <button onClick={() => handleTrigger('night')} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-sm transition-all flex-1 min-w-[140px] max-w-[200px]">
                    Event: "Goodnight"
                </button>
                <button onClick={() => handleTrigger('cold')} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-lg text-sm transition-all flex-1 min-w-[140px] max-w-[200px]">
                    Event: "I'm cold"
                </button>
                <button onClick={() => handleTrigger('groceries')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition-all flex-1 min-w-[140px] max-w-[200px]">
                    Event: "Check groceries"
                </button>
            </div>

            <div className="text-center text-sm text-slate-400 relative z-10 min-h-[24px] mb-6">
                {trigger === 'cold' && <span className="text-yellow-400 font-bold">Orchestrator → Climate Agent: Adjusting temperature...</span>}
                {trigger === 'night' && <span className="text-red-400 font-bold">Orchestrator → Security Agent: Locking all systems...</span>}
                {trigger === 'groceries' && <span className="text-blue-400 font-bold">Orchestrator → Inventory Agent: Checking fridge...</span>}
                {!trigger && <span>Click events to see agent interactions</span>}
            </div>

            <div className="bg-emerald-900/20 p-6 rounded-xl border border-emerald-500/30 relative z-10">
                <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Lightbulb className="text-emerald-400" size={20} /> How This Visualization Works
                </h5>
                <ul className="text-sm text-slate-300 space-y-2 list-none">
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>The <strong className="text-white">Orchestrator</strong> (green, top center) is like a manager—it receives your requests and decides which specialist agent should handle them.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>Each <strong className="text-white">specialist agent</strong> (Security, Climate/Energy, Inventory) has a specific job. They only activate when the Orchestrator delegates a task to them.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>Click the event buttons below to see how the Orchestrator routes different requests. When you click "I'm cold," watch how the Orchestrator activates and then delegates to the Climate Agent.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        <span>The <strong className="text-white">dotted lines</strong> show the communication paths between agents. This is a hierarchical system—all communication flows through the Orchestrator.</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

// ==========================================
// VISUALIZATION 7: VECTOR EMBEDDINGS / RAG (NEW)
// ==========================================
const VectorEmbeddingsViz = () => {
    const [queryPos, setQueryPos] = useState({ x: 50, y: 80 });
    const [closest, setClosest] = useState<number | null>(null);

    const docs = [
        { id: 1, x: 20, y: 20, topic: "Finance", text: "AAPL Q3 Report" },
        { id: 2, x: 30, y: 30, topic: "Finance", text: "Stock Market Trends" },
        { id: 3, x: 80, y: 20, topic: "Biology", text: "Cell Mitosis" },
        { id: 4, x: 70, y: 30, topic: "Biology", text: "DNA Sequencing" },
        { id: 5, x: 50, y: 50, topic: "Cooking", text: "Pasta Recipe" },
    ];

    useEffect(() => {
        let minDist = 1000;
        let closestDoc = null;
        docs.forEach(doc => {
            const dist = Math.sqrt(Math.pow(doc.x - queryPos.x, 2) + Math.pow(doc.y - queryPos.y, 2));
            if (dist < minDist) {
                minDist = dist;
                closestDoc = doc.id;
            }
        });
        setClosest(minDist < 25 ? closestDoc : null);
    }, [queryPos]);

    return (
        <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800/50 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <Database size={150} className="text-yellow-500" />
            </div>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <div className="p-2 bg-yellow-500/20 rounded-lg"><Database className="text-yellow-400" size={20} /></div>
                How RAG Works: Vector Embeddings
            </h3>

            <div className="flex flex-col gap-4 relative z-10">
                <div className="mb-4">
                    <h4 className="font-bold text-white mb-2">The "Semantic Space" (Vector Database)</h4>
                    <p className="text-sm text-slate-400 mb-2">
                        This visualization shows how RAG finds documents by meaning, not keywords. Each colored dot represents a document stored in the database. The red dot is your question. <strong className="text-white">Move your mouse over the visualization</strong> to see how the system finds the closest matching document.
                    </p>
                    <p className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded inline-block">💡 Tip: Drag your mouse to move the red query dot</p>
                </div>

                <div 
                    className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-inner cursor-crosshair"
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setQueryPos({
                            x: ((e.clientX - rect.left) / rect.width) * 100,
                            y: ((e.clientY - rect.top) / rect.height) * 100
                        });
                    }}
                >
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
                        {[...Array(16)].map((_, i) => <div key={i} className="border-slate-800 border-r border-b"></div>)}
                    </div>

                    {docs.map(doc => (
                        <div 
                            key={doc.id} 
                            className={`absolute w-3 h-3 rounded-full transition-all duration-300 ${
                                closest === doc.id ? 'bg-yellow-500 scale-150 ring-4 ring-yellow-500/30' : 'bg-slate-600'
                            }`}
                            style={{ left: `${doc.x}%`, top: `${doc.y}%` }}
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 whitespace-nowrap bg-slate-900/90 px-1 rounded">
                                {doc.text}
                            </div>
                        </div>
                    ))}

                    <div 
                        className="absolute w-4 h-4 bg-red-500 rounded-full shadow-lg ring-4 ring-red-500/30 transition-all duration-75 flex items-center justify-center"
                        style={{ left: `${queryPos.x}%`, top: `${queryPos.y}%` }}
                    >
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap z-10">
                            Query Vector
                        </div>
                    </div>

                    {closest && (
                        <svg className="absolute inset-0 pointer-events-none w-full h-full">
                            <line 
                                x1={`${queryPos.x}%`} 
                                y1={`${queryPos.y}%`} 
                                x2={`${docs.find(d => d.id === closest)?.x}%`} 
                                y2={`${docs.find(d => d.id === closest)?.y}%`} 
                                stroke="#eab308" 
                                strokeWidth="2" 
                                strokeDasharray="4 4" 
                            />
                        </svg>
                    )}
                </div>

                <div className="text-center h-8">
                    {closest ? (
                        <span className="text-yellow-400 font-bold animate-pulse">
                            Match Found: "{docs.find(d => d.id === closest)?.text}" (Topic: {docs.find(d => d.id === closest)?.topic})
                        </span>
                    ) : (
                        <span className="text-slate-400 italic">Move closer to a document to retrieve it...</span>
                    )}
                </div>

                <div className="mt-6 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                    <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Lightbulb className="text-blue-400" size={20} /> How This Visualization Works
                    </h5>
                    <ul className="text-sm text-blue-200 space-y-2 list-none">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Each <strong className="text-white">colored dot</strong> represents a document stored in the database (like "AAPL Q3 Report" or "Cell Mitosis").</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>The <strong className="text-white">red dot</strong> represents your question, converted into the same type of "fingerprint."</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>When you <strong className="text-white">move the red dot close to a document</strong>, the system finds a match (shown by the yellow line connecting them).</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span>Notice how documents about similar topics (like "Finance" documents) are grouped together, even though they use different words. This is semantic search—finding by meaning, not keywords!</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// VISUALIZATION 8: EVAL MATRIX & HUMAN LOOP (NEW)
// ==========================================
const EvalMatrixViz = () => {
    const [hover, setHover] = useState<string | null>(null);

    const cells = [
        { id: 'q-obj', title: "Hard Metrics", subtitle: "Quantitative + Objective", ex: "Code Execution, JSON Validity", color: "blue" },
        { id: 'q-sub', title: "User Ratings", subtitle: "Quantitative + Subjective", ex: "Star Ratings, NPS Score", color: "purple" },
        { id: 'l-obj', title: "Fact Checks", subtitle: "Qualitative + Objective", ex: "Retrieving correct Order ID", color: "green" },
        { id: 'l-sub', title: "Vibes Check", subtitle: "Qualitative + Subjective", ex: "Tone, Empathy, Style", color: "orange" }
    ];

    return (
        <div className="p-8 bg-slate-900/50 rounded-3xl border border-slate-800/50 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                <BarChart size={150} className="text-indigo-500" />
            </div>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <div className="p-2 bg-indigo-500/20 rounded-lg"><BarChart className="text-indigo-400" size={20} /></div>
                Evaluation Matrix
            </h3>

            <div className="grid grid-cols-2 gap-4 h-64 relative z-10">
                {cells.map(c => (
                    <div 
                        key={c.id}
                        onMouseEnter={() => setHover(c.id)}
                        onMouseLeave={() => setHover(null)}
                        className={`rounded-xl border-2 p-4 flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-300 ${
                            hover === c.id 
                            ? `bg-${c.color}-900/30 border-${c.color}-500 scale-[1.02] shadow-lg` 
                            : 'bg-slate-800/50 border-slate-700 text-slate-400'
                        }`}
                    >
                        <h5 className="font-bold text-base mb-1 text-white">{c.title}</h5>
                        <span className="text-[10px] uppercase tracking-wider opacity-70 mb-2">{c.subtitle}</span>
                        {hover === c.id ? (
                            <p className="text-xs font-bold animate-in fade-in text-slate-300">{c.ex}</p>
                        ) : (
                            <Search className="w-4 h-4 opacity-10 mt-2" />
                        )}
                    </div>
                ))}
            </div>

            <p className="mt-4 text-sm text-slate-400 relative z-10">
                Hover over each quadrant to see examples. We test AI systems using both hard metrics (does it work?) and soft metrics (does it feel right?).
            </p>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const AgenticAIPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-[#020617]/80 backdrop-blur border-b border-slate-800">
                <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-blue-500 uppercase">Stanford CS230 • Lecture 7 • Nov 21, 2025</span>
                </div>
            </nav>

            <main className="pt-32 pb-20">

                {/* --- Hero Section --- */}
                <section className="container mx-auto px-6 mb-32 relative max-w-7xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex-1"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8">
                                <BookOpen className="w-3 h-3" />
                                Lecturer: Kian Katanforoosh • Nov 21, 2025
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tight leading-[0.9]">
                                Beyond the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
                                    Model
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-400 max-w-xl font-light leading-relaxed mb-10 border-l-4 border-blue-500 pl-6">
                                We've spent a decade building bigger brains. Now, we're building the <span className="text-white font-bold">hands, eyes, and memory</span> to make them useful.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <a href="#article" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] flex items-center gap-2">
                                    <Zap className="w-5 h-5" /> Start Reading
                                </a>
                                <a href="https://www.youtube.com/watch?v=k1njvbBmfsw" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] flex items-center gap-2">
                                    <Youtube className="w-5 h-5" /> Watch Lecture
                                </a>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex-1 w-full"
                        >
                            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="grid grid-cols-2 gap-6 p-10 w-full h-full">
                                        {[
                                            { icon: Brain, title: "Reasoning", color: "blue" },
                                            { icon: Hammer, title: "Tools", color: "purple" },
                                            { icon: Target, title: "Planning", color: "emerald" },
                                            { icon: Database, title: "Memory", color: "orange" }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-slate-950/50 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between hover:border-blue-500/50 transition-all group hover:-translate-y-1">
                                                <item.icon className="w-10 h-10 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                                <div className="text-lg font-bold text-slate-400 group-hover:text-white">{item.title}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 hidden lg:block"
                    >
                        <div className="text-slate-600 font-mono text-xs flex flex-col items-center gap-2 animate-bounce">
                            SCROLL TO EXPLORE <ArrowDown className="w-4 h-4" />
                        </div>
                    </motion.div>
                </section>

                {/* --- Article Content --- */}
                <div id="article" className="container mx-auto px-6 max-w-6xl">
                    
                    {/* SECTION 1: THE SHIFT */}
                    <section className="mb-40">
                        <div className="flex items-end gap-6 mb-12 border-b border-slate-800 pb-6">
                            <div className="text-8xl font-black text-slate-800 leading-[0.8]">01</div>
                            <div>
                                <h2 className="text-4xl font-bold text-white">The Shift: From Chatbots to Agents</h2>
                                <div className="text-slate-500 uppercase tracking-widest text-sm mt-1 font-bold">Understanding the Evolution</div>
                            </div>
                        </div>
                        
                        <div className="prose prose-invert prose-xl max-w-4xl mx-auto mb-16 space-y-6">
                            <p className="text-xl text-slate-300 leading-relaxed">
                                This lecture focuses on <strong className="text-white">"Beyond LLMs"</strong>—enhancing large language model applications for practical, real-world deployment. While previous lectures covered the fundamentals of deep learning (neurons, layers, deep networks), this session transitions into building <strong className="text-blue-400">agentic AI systems</strong>.
                            </p>
                            
                            <p className="text-lg text-slate-400 leading-relaxed">
                                The goal is to explore how AI engineers maximize the performance of base models through <strong className="text-white">prompting, fine-tuning, retrieval-augmented generation (RAG), and agentic workflows</strong>. Engineers work on a vertical axis of optimization: keeping the base model constant while engineering the system around it to improve performance.
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed mb-4">
                                <strong className="text-white">Challenges with Base Models:</strong> Using a vanilla pre-trained model (like GPT-4 or Claude 3) has significant limitations:
                            </p>
                            <ul className="text-lg text-slate-400 leading-relaxed space-y-3 mb-6 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">1.</span>
                                    <span><strong className="text-yellow-400">Knowledge Gaps:</strong> Lack domain-specific data (e.g., private agricultural datasets) or recent information (cutoff dates).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">2.</span>
                                    <span><strong className="text-yellow-400">Control Issues:</strong> LLMs can be difficult to steer. Historical examples include Microsoft's "Tay" bot (2016), which became offensive quickly, and more recent controversies regarding political bias in models like Grok or ChatGPT.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">3.</span>
                                    <span><strong className="text-yellow-400">Performance on Narrow Tasks:</strong> Generalist models may fail at high-precision tasks like medical diagnosis or legal contract review where specific style and formatting are non-negotiable.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">4.</span>
                                    <span><strong className="text-yellow-400">Context Limitations:</strong> While context windows are growing (200k+ tokens), they are still finite. Handling massive databases or long video files requires augmentation strategies like RAG.</span>
                                </li>
                            </ul>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                The visualization below shows the spectrum of optimization techniques—from Zero-Shot (immediate response) to Agentic (iterative reasoning with tools). Each level represents a different approach to problem-solving, with trade-offs in speed, cost, and reliability.
                            </p>
                        </div>
                        <AutonomySpectrumViz />
                    </section>

                    {/* SECTION 2: THE JAGGED FRONTIER */}
                    <section className="mb-40">
                        <div className="flex items-end gap-6 mb-12 border-b border-slate-800 pb-6">
                            <div className="text-8xl font-black text-slate-800 leading-[0.8]">02</div>
                            <div>
                                <h2 className="text-4xl font-bold text-white">The Reality: The Jagged Frontier</h2>
                                <div className="text-slate-500 uppercase tracking-widest text-sm mt-1 font-bold">Why AI Isn't Uniformly Better</div>
                            </div>
                        </div>
                        
                        <div className="prose prose-invert prose-xl max-w-4xl mx-auto mb-16 space-y-6">
                            <p className="text-xl text-slate-300 leading-relaxed">
                                <strong className="text-white">Prompt engineering</strong> is the most accessible and immediate way to improve model output. The lecture cites a study involving <strong className="text-white">BCG consultants</strong>, showing that those trained in prompting significantly outperformed those who weren't.
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                The study identified two dominant user behaviors: <strong className="text-purple-400">Centaurs</strong> (users who delegate tasks to AI—divide and conquer) and <strong className="text-blue-400">Cyborgs</strong> (users who work in a tight loop with AI, intertwining their efforts continuously).
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                <strong className="text-white">Key Techniques:</strong> Moving from generic prompts like "Summarize this" to specific ones like "Act as a renewable energy expert and summarize this 10-page paper for policymakers in 5 bullet points." <strong className="text-white">Chain of Thought (CoT)</strong> encourages the model to "think step-by-step," empirically proven to improve reasoning by preventing the model from rushing to an incorrect conclusion.
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                <strong className="text-white">Chaining</strong> breaks complex tasks into a sequence of prompts. Instead of one massive prompt asking to "Read review, extract issues, and write email," you split it: (1) Extract key issues, (2) Draft an outline based on issues, (3) Write final email based on the outline. This makes debugging easier—if the email is bad, you can check if the error originated in extraction, outlining, or drafting.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-16 mb-16">
                            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 h-fit">
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2 text-xl">
                                    <User className="text-purple-400" /> The Cyborg vs. Centaur
                                </h4>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    The study identified two distinct approaches consultants took when working with AI:
                                </p>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-bold h-fit w-20 text-center shrink-0">CYBORG</div>
                                        <div>
                                            <span className="text-base text-slate-300 font-semibold block mb-1">Tight Loop Integration</span>
                                            <span className="text-sm text-slate-400">Users work in a tight loop with AI, intertwining their efforts continuously. AI suggestions are woven throughout every step of the work process.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold h-fit w-20 text-center shrink-0">CENTAUR</div>
                                        <div>
                                            <span className="text-base text-slate-300 font-semibold block mb-1">Delegation Strategy</span>
                                            <span className="text-sm text-slate-400">Users delegate tasks to AI—divide and conquer. Clear separation: "I do this part, AI does that part."</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                                <h4 className="font-bold text-white mb-6 flex items-center gap-2 text-xl">
                                    <AlertTriangle className="text-yellow-400" /> Key Implications
                                </h4>
                                <ul className="space-y-4 text-slate-300">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} />
                                        <span>We cannot blindly trust AI. We must understand where it excels and where it fails.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} />
                                        <span>The frontier is "jagged"—not smooth. Simple tasks can be harder for AI than complex ones.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle2 className="text-green-400 mt-1 shrink-0" size={20} />
                                        <span>Both Cyborg and Centaur approaches can work, but Centaur (strategic division) tends to be safer for high-stakes work.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <SimplifiedJaggedFrontierViz />
                        
                        <div className="mt-8 bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <h4 className="text-xl font-bold text-white mb-4">Historical Examples of Control Issues</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
                                    <h5 className="font-bold text-red-400 mb-2">Microsoft's "Tay" Bot (2016)</h5>
                                    <p className="text-sm text-slate-300">Became offensive quickly, demonstrating how LLMs can be difficult to steer without proper guardrails.</p>
                                </div>
                                <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-500/30">
                                    <h5 className="font-bold text-yellow-400 mb-2">Recent Controversies</h5>
                                    <p className="text-sm text-slate-300">Models like Grok or ChatGPT have faced issues regarding political bias, showing the importance of control mechanisms.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: FINE-TUNING */}
                    <section className="mb-40">
                        <div className="flex items-end gap-6 mb-12 border-b border-slate-800 pb-6">
                            <div className="text-8xl font-black text-slate-800 leading-[0.8]">03</div>
                            <div>
                                <h2 className="text-4xl font-bold text-white">Fine-Tuning: When and Why (Not) to Use It</h2>
                                <div className="text-slate-500 uppercase tracking-widest text-sm mt-1 font-bold">Avoid When Possible</div>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-xl max-w-4xl mx-auto mb-16 space-y-6">
                            <p className="text-xl text-slate-300 leading-relaxed">
                                <strong className="text-white">Fine-tuning</strong> involves retraining the model's weights on a specific dataset. The lecturer advises <strong className="text-red-400">avoiding fine-tuning whenever possible</strong> for several reasons: <strong className="text-white">Cost & Time</strong> (resource-intensive), <strong className="text-white">Obsolescence</strong> (by the time a model is fine-tuned, a better base model often releases), and <strong className="text-white">Overfitting</strong> (fine-tuned models can lose their general-purpose utility or "catastrophically forget" instructions).
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                <strong className="text-white">Example:</strong> A developer tried to fine-tune a model on Slack messages to mimic their team's style. When asked to write a blog post, the model simply replied, <em className="text-yellow-400">"I'll do it in the morning,"</em> mimicking the behavior of the team rather than performing the task.
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                <strong className="text-white">Use Cases for Fine-Tuning:</strong> It is reserved for niche tasks where prompting fails, such as learning a very specific new language or dialect (e.g., medical or legal code), or tasks requiring extremely high consistency in format that few-shot prompting cannot achieve.
                            </p>
                        </div>

                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                                        <AlertTriangle /> Why Avoid Fine-Tuning
                                    </h4>
                                    <ul className="space-y-4 text-slate-300">
                                        <li className="flex items-start gap-3">
                                            <X className="text-red-400 mt-1 shrink-0" size={20} />
                                            <span><strong>Cost & Time:</strong> Resource-intensive process</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <X className="text-red-400 mt-1 shrink-0" size={20} />
                                            <span><strong>Obsolescence:</strong> Better base models release frequently</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <X className="text-red-400 mt-1 shrink-0" size={20} />
                                            <span><strong>Overfitting:</strong> Can lose general-purpose utility</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                                        <FileText /> Real Example
                                    </h4>
                                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-sm">
                                        <div className="text-slate-500 mb-2">Developer fine-tuned model on Slack messages...</div>
                                        <div className="text-green-400">User: "Write a blog post"</div>
                                        <div className="text-red-400 mt-2">Model: "I'll do it in the morning"</div>
                                        <div className="text-slate-500 text-xs mt-4 italic">Model mimicked team behavior instead of performing task</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 4: AGENTIC WORKFLOWS */}
                    <section className="mb-40">
                        <div className="flex items-end gap-6 mb-12 border-b border-slate-800 pb-6">
                            <div className="text-8xl font-black text-slate-800 leading-[0.8]">04</div>
                            <div>
                                <h2 className="text-4xl font-bold text-white">Agentic AI Workflows</h2>
                                <div className="text-slate-500 uppercase tracking-widest text-sm mt-1 font-bold">From Static to Autonomous</div>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-xl max-w-4xl mx-auto mb-16 space-y-6">
                            <p className="text-xl text-slate-300 leading-relaxed">
                                <strong className="text-white">Agentic AI Workflows</strong> mark the shift from static question-answering to autonomous agents. Andrew Ng defines "agentic workflows" as iterative, multi-step processes where the AI uses tools to complete tasks. Unlike Reinforcement Learning (RL) agents, these are typically LLM-driven loops.
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed mb-4">
                                <strong className="text-white">Core Components of an Agent:</strong>
                            </p>
                            <ul className="text-lg text-slate-400 leading-relaxed space-y-4 mb-6 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-400 font-bold mt-1">1.</span>
                                    <div>
                                        <strong className="text-blue-400">Prompts:</strong> The instructions that define the agent's behavior. Think of it as the agent's "personality" and "job description"—telling it how to act and what to do.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold mt-1">2.</span>
                                    <div>
                                        <strong className="text-purple-400">Memory:</strong> Agents have two types of memory:
                                        <ul className="mt-2 ml-4 space-y-2 text-sm">
                                            <li>• <strong>Working Memory:</strong> Immediate context (like the user's name in the current conversation)</li>
                                            <li>• <strong>Archival Memory:</strong> Long-term storage (like the user's birthday), retrieved only when necessary to save latency and costs</li>
                                        </ul>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">3.</span>
                                    <div>
                                        <strong className="text-yellow-400">Tools:</strong> APIs (Flight search, Weather, Calculator) or Resources (CRMs, Databases). These are the agent's "hands"—ways it can interact with the world beyond just generating text.
                                    </div>
                                </li>
                            </ul>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                <strong className="text-white">The Paradigm Shift:</strong> Building agents requires a mindset shift. Traditional software is deterministic (Input A always leads to Output B, structured data like JSON/SQL). AI engineering is fuzzy—inputs are natural language; outputs are probabilistic. Engineers must manage "fuzzy" components (the LLM) alongside deterministic ones (the API calls).
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                <strong className="text-white">Model Context Protocol (MCP):</strong> Introduced by Anthropic, MCP is a standard to streamline how agents connect to data sources. Instead of hardcoding API definitions for every tool, MCP allows agents to query a server to understand what data is available and how to fetch it, promoting scalability.
                            </p>
                        </div>

                        <ToolUseViz />
                    </section>

                    {/* SECTION 5: EVALS */}
                    <section className="mb-40">
                        <div className="flex items-end gap-6 mb-12 border-b border-slate-800 pb-6">
                            <div className="text-8xl font-black text-slate-800 leading-[0.8]">05</div>
                            <div>
                                <h2 className="text-4xl font-bold text-white">Evals: Measuring Success</h2>
                                <div className="text-slate-500 uppercase tracking-widest text-sm mt-1 font-bold">How Do You Know If An Agent Works?</div>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-xl max-w-4xl mx-auto mb-16 space-y-6">
                            <p className="text-xl text-slate-300 leading-relaxed">
                                <strong className="text-white">Evals: Measuring Success</strong>—How do you know if an agent works?
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                <strong className="text-white">Traces:</strong> Essential for debugging. You must be able to see the full chain of prompts and tool calls.
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                <strong className="text-white">Metrics:</strong> <strong className="text-blue-400">Quantitative</strong> (Latency, success rate, cost) and <strong className="text-purple-400">Qualitative</strong> (Tone, helpfulness, hallucination rate).
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed mb-4">
                                <strong className="text-white">Methodology:</strong>
                            </p>
                            <ul className="text-lg text-slate-400 leading-relaxed space-y-4 mb-6 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">1.</span>
                                    <div>
                                        <strong className="text-yellow-400">Task Decomposition:</strong> Break the workflow into steps (Extract Info → Lookup DB → Draft Email). This makes it easier to test and debug each part separately.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-400 font-bold mt-1">2.</span>
                                    <div>
                                        <strong className="text-green-400">Component-wise Eval:</strong> Test each step individually. Did it extract the right Order ID? (Objective/Deterministic—either right or wrong). Did it write a polite email? (Subjective/Fuzzy—depends on interpretation).
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-400 font-bold mt-1">3.</span>
                                    <div>
                                        <strong className="text-orange-400">End-to-End Eval:</strong> Did the user get their refund? This tests the entire system working together, not just individual components.
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <Eye className="text-blue-400" /> Traces
                                </h4>
                                <p className="text-slate-400 text-sm">Essential for debugging. You must be able to see the full chain of prompts and tool calls.</p>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <BarChart className="text-purple-400" /> Metrics
                                </h4>
                                <p className="text-slate-400 text-sm"><strong className="text-purple-400">Quantitative:</strong> Latency, success rate, cost<br/><strong className="text-purple-400">Qualitative:</strong> Tone, helpfulness, hallucination rate</p>
                            </div>
                            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <Target className="text-green-400" /> Methodology
                                </h4>
                                <p className="text-slate-400 text-sm">Task Decomposition → Component-wise Eval → End-to-End Eval</p>
                            </div>
                        </div>
                        <EvalMatrixViz />
                    </section>

                    {/* SECTION 6: MULTI-AGENT */}
                    <section className="mb-40">
                        <div className="flex items-end gap-6 mb-12 border-b border-slate-800 pb-6">
                            <div className="text-8xl font-black text-slate-800 leading-[0.8]">06</div>
                            <div>
                                <h2 className="text-4xl font-bold text-white">Multi-Agent Workflows</h2>
                                <div className="text-slate-500 uppercase tracking-widest text-sm mt-1 font-bold">Smart Home Example</div>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-xl max-w-4xl mx-auto mb-16 space-y-6">
                            <p className="text-xl text-slate-300 leading-relaxed">
                                <strong className="text-white">Multi-Agent Workflows</strong> involve multiple specialized agents working together.
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed mb-4">
                                <strong className="text-white">Why Multi-Agent?</strong>
                            </p>
                            <ul className="text-lg text-slate-400 leading-relaxed space-y-4 mb-6 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-400 font-bold mt-1">1.</span>
                                    <div>
                                        <strong className="text-blue-400">Parallelism:</strong> Agents can work simultaneously on different parts of a problem. Like a team of workers, each agent tackles their specialty at the same time, making the whole process faster.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold mt-1">2.</span>
                                    <div>
                                        <strong className="text-purple-400">Specialization:</strong> An agent trained for "Legal Review" can be reused across Marketing and Sales departments. Instead of one generalist trying to do everything, specialized agents excel at their specific domain.
                                    </div>
                                </li>
                            </ul>

                            <p className="text-lg text-slate-400 leading-relaxed mb-4">
                                <strong className="text-white">Example: Smart Home Automation</strong>—The class brainstormed a multi-agent system for a home:
                            </p>
                            <ul className="text-lg text-slate-400 leading-relaxed space-y-3 mb-6 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400 font-bold mt-1">1.</span>
                                    <span><strong className="text-emerald-400">Orchestrator:</strong> Handles user communication—the "manager" that receives requests and delegates to specialists.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400 font-bold mt-1">2.</span>
                                    <span><strong className="text-red-400">Security Agent:</strong> Manages access/biometrics—specialized in keeping the home secure.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">3.</span>
                                    <span><strong className="text-yellow-400">Climate/Energy Agent:</strong> Optimizes temperature based on weather APIs and efficiency goals—specialized in comfort and energy savings.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-400 font-bold mt-1">4.</span>
                                    <span><strong className="text-blue-400">Inventory Agent:</strong> Checks the fridge via camera and orders groceries—specialized in managing supplies.</span>
                                </li>
                            </ul>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                These agents interact hierarchically (User → Orchestrator → Sub-agents) or flat (Agent-to-Agent). The visualization below demonstrates this Smart Home system in action.
                            </p>
                        </div>

                        <MultiAgentViz />
                    </section>

                    {/* SECTION 7: RAG */}
                    <section className="mb-40">
                        <div className="flex items-end gap-6 mb-12 border-b border-slate-800 pb-6">
                            <div className="text-8xl font-black text-slate-800 leading-[0.8]">07</div>
                            <div>
                                <h2 className="text-4xl font-bold text-white">Retrieval Augmented Generation (RAG)</h2>
                                <div className="text-slate-500 uppercase tracking-widest text-sm mt-1 font-bold">Connecting LLM to External Data</div>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-xl max-w-4xl mx-auto mb-16 space-y-6">
                            <p className="text-xl text-slate-300 leading-relaxed">
                                <strong className="text-white">Retrieval Augmented Generation (RAG)</strong> addresses the knowledge gap and hallucination problems by connecting the LLM to external, private data (e.g., a company's Google Drive or legal database).
                            </p>

                            <p className="text-lg text-slate-400 leading-relaxed mb-4">
                                <strong className="text-white">How RAG Works (Simple Explanation):</strong>
                            </p>
                            <p className="text-base text-slate-300 leading-relaxed mb-6">
                                Imagine you have a library with thousands of books, but you can only remember a few pages at a time. RAG is like having a smart librarian who:
                            </p>
                            <ul className="text-lg text-slate-400 leading-relaxed space-y-4 mb-6 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">1.</span>
                                    <div>
                                        <strong className="text-yellow-400">Ingestion:</strong> Reads all your documents and creates a "map" of what each document is about. Instead of storing the full text, it creates a numerical "fingerprint" (called an embedding) that captures the meaning. Think of it like creating a library card catalog, but instead of just titles, it captures the concepts and ideas.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">2.</span>
                                    <div>
                                        <strong className="text-yellow-400">Storage:</strong> Stores these "fingerprints" in a special database (Vector Database) where similar concepts are placed close together. Documents about "plumbing" will be near documents about "pipes" and "water systems," even if they use different words.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">3.</span>
                                    <div>
                                        <strong className="text-yellow-400">Retrieval:</strong> When you ask a question, the system converts your question into the same type of "fingerprint" and searches the database for the closest matching documents. This is semantic search—it finds meaning, not just keywords. So if you ask "leaky pipe," it will find documents about "plumbing repair" even though the words don't match exactly.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-yellow-400 font-bold mt-1">4.</span>
                                    <div>
                                        <strong className="text-yellow-400">Generation:</strong> The AI reads the relevant documents it found and uses them to answer your question. It's like the librarian bringing you the right books and then summarizing them for you.
                                    </div>
                                </li>
                            </ul>

                            <p className="text-lg text-slate-400 leading-relaxed mb-4">
                                <strong className="text-white">Advanced RAG Techniques:</strong>
                            </p>
                            <ul className="text-lg text-slate-400 leading-relaxed space-y-4 mb-6 list-none">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-400 font-bold mt-1">•</span>
                                    <div>
                                        <strong className="text-blue-400">Chunking:</strong> Documents are split into smaller pieces (sentences, paragraphs, or chapters) to preserve semantic meaning. Think of it like breaking a long book into chapters—each chapter keeps its context and meaning intact.
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-purple-400 font-bold mt-1">•</span>
                                    <div>
                                        <strong className="text-purple-400">HyDE (Hypothetical Document Embeddings):</strong> When your question is too short or vague (like "leaky pipe"), the AI first imagines what a perfect answer document would look like. Then it searches for real documents that match this imaginary "perfect answer." It's like asking "What would a plumbing manual say?" and then finding actual plumbing manuals that match that description. This works better than searching for just "leaky pipe" because the imagined answer uses technical language similar to the real documents.
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <VectorEmbeddingsViz />
                    </section>

                    {/* SECTION 8: FUTURE TRENDS */}
                    <section className="mb-32">
                        <div className="flex items-end gap-6 mb-12 border-b border-slate-800 pb-6">
                            <div className="text-8xl font-black text-slate-800 leading-[0.8]">08</div>
                            <div>
                                <h2 className="text-4xl font-bold text-white">Future Trends & Conclusion</h2>
                                <div className="text-slate-500 uppercase tracking-widest text-sm mt-1 font-bold">The Trajectory of AI</div>
                            </div>
                        </div>

                        <div className="prose prose-invert prose-xl max-w-4xl mx-auto mb-16 space-y-6">
                            <p className="text-xl text-slate-300 leading-relaxed">
                                The lecture concludes with thoughts on the trajectory of AI:
                            </p>

                            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 space-y-6">
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                        <TrendingUp className="text-blue-400" /> Plateauing?
                                    </h4>
                                    <p className="text-slate-400">
                                        While scaling laws (adding more compute/data) might yield diminishing returns eventually, architecture search (finding better models than Transformers) will likely drive the next jump.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                        <Layers className="text-purple-400" /> Multimodality
                                    </h4>
                                    <p className="text-slate-400">
                                        Improvements in image/audio understanding transfer to text performance. A model that "sees" a cat understands the concept of a cat better.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                        <Network className="text-green-400" /> Convergence
                                    </h4>
                                    <p className="text-slate-400">
                                        The future lies in combining Supervised Learning, RL, Unsupervised Learning, and RAG—mirroring how human babies learn (observation, parental correction, trial and error).
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                        <Zap className="text-yellow-400" /> Velocity
                                    </h4>
                                    <p className="text-slate-400">
                                        The field moves so fast that specific hacks taught today may be obsolete in two years. The goal of the course is to provide "breath" (a wide understanding of available tools) so engineers can "dive deep" when necessary.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 border border-slate-800 shadow-2xl">
                            <div className="flex flex-col md:flex-row gap-16 items-center">
                                <div className="flex-1">
                                    <h3 className="text-3xl font-bold text-white mb-6">The Paradigm Shift: Deterministic vs. Fuzzy Engineering</h3>
                                    <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                        Building agents requires a mindset shift. Traditional software is deterministic (Input A always leads to Output B, structured data like JSON/SQL). AI engineering is fuzzy—inputs are natural language; outputs are probabilistic. Engineers must manage "fuzzy" components (the LLM) alongside deterministic ones (the API calls).
                                    </p>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        A major challenge is building guardrails and "human-in-the-loop" systems to catch errors in fuzzy logic.
                                    </p>
                                </div>
                                <div className="flex-1 w-full bg-[#0d1117] rounded-xl p-8 border border-slate-800 font-mono text-sm shadow-xl">
                                    <div className="flex items-center gap-2 text-slate-500 mb-6 border-b border-slate-800 pb-4">
                                        <Terminal size={16} /> agent_system.py
                                        <div className="ml-auto flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-blue-400"># Deterministic Component</div>
                                        <div className="text-slate-300">api_result = call_api(params)</div>
                                        <div className="text-slate-500 italic mt-4"># Fuzzy Component</div>
                                        <div className="text-slate-300">llm_response = llm.generate(prompt)</div>
                                        <div className="text-slate-500 italic mt-4"># Guardrail</div>
                                        <div className="text-emerald-400">if human_approval_required(llm_response):</div>
                                        <div className="pl-4 text-slate-300">await human_review()</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* KEY TAKEAWAYS SUMMARY */}
                    <section className="container mx-auto px-6 mb-32 relative max-w-7xl">
                        <div className="bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-emerald-900/20 rounded-3xl p-12 border border-slate-800/50 shadow-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                    <Lightbulb className="text-blue-400" size={32} />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold text-white">Key Takeaways</h2>
                                    <p className="text-slate-400 mt-1">Essential insights from Stanford CS230 Lecture 7</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-blue-400">1.</span> Beyond Base Models
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        Base LLMs have limitations: knowledge gaps, control issues, performance on narrow tasks, and context constraints. The solution isn't always "train a better model"—it's engineering the system around the model through prompting, RAG, and agentic workflows.
                                    </p>
                                </div>

                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-purple-400">2.</span> Prompt Engineering First
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        Prompt engineering is the most accessible optimization. BCG consultants trained in prompting significantly outperformed those who weren't. Techniques like Chain of Thought, chaining, and specificity dramatically improve outputs without changing model weights.
                                    </p>
                                </div>

                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-yellow-400">3.</span> Avoid Fine-Tuning When Possible
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        Fine-tuning is expensive, time-consuming, and often obsolete by the time it's done. It can cause catastrophic forgetting. Reserve it for niche tasks where prompting fails, like learning very specific languages or requiring extreme format consistency.
                                    </p>
                                </div>

                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-green-400">4.</span> RAG Solves Knowledge Gaps
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        Retrieval Augmented Generation connects LLMs to external, private data. Documents are converted to embeddings, stored in vector databases, and retrieved semantically. Advanced techniques like HyDE generate hypothetical answers to improve search quality.
                                    </p>
                                </div>

                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-emerald-400">5.</span> Agentic Workflows Enable Autonomy
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        Agents combine prompts, memory (working + archival), and tools to create iterative, multi-step processes. Unlike static Q&A, agents can reason, act, observe, and repeat—using APIs and resources to complete complex tasks autonomously.
                                    </p>
                                </div>

                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-orange-400">6.</span> Multi-Agent Systems Scale Better
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        Specialized agents working together outperform generalist models. They enable parallelism and reusability. The Smart Home example shows how an Orchestrator delegates to specialists (Security, Climate/Energy, Inventory) for better results.
                                    </p>
                                </div>

                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-red-400">7.</span> Evaluation Requires Both Metrics
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        Measure success with quantitative metrics (latency, cost, success rate) and qualitative metrics (tone, helpfulness, hallucination rate). Use traces for debugging, component-wise evals for individual steps, and end-to-end evals for the full system.
                                    </p>
                                </div>

                                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-pink-400">8.</span> Mindset Shift: Deterministic → Fuzzy
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        Traditional software is deterministic (Input A → Output B). AI engineering is fuzzy—inputs are natural language, outputs are probabilistic. Engineers must manage "fuzzy" LLM components alongside deterministic API calls, building guardrails and human-in-the-loop systems.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                                <p className="text-lg text-slate-200 leading-relaxed text-center">
                                    <strong className="text-white">The Future:</strong> The field moves fast—specific techniques may be obsolete in two years. The goal is to provide "breath" (wide understanding) so engineers can "dive deep" when needed. Convergence of Supervised Learning, RL, Unsupervised Learning, and RAG will drive the next breakthroughs.
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <ProjectNavigation currentId="agentic-ai" />

            <footer className="py-12 border-t border-slate-800 bg-[#020617] text-center">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Wutcharin Thatan. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default AgenticAIPage;
