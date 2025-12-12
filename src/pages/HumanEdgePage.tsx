import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Brain,
    Zap,
    Heart,
    Users,
    Target,
    RefreshCw,
    Trash2,
    ArrowLeft,
    Quote,
    Sparkles,
    Palette,
    ShieldAlert,
    Globe,
    CheckCircle2
} from 'lucide-react';
import ProjectNavigation from '../components/ProjectNavigation';

// --- Layout Components ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
    <div className="flex items-center justify-center gap-3 mb-10 mt-24 pb-4 px-4 text-center">
        {Icon && <Icon className="w-8 h-8 text-cyan-400" />}
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-100">{children}</h2>
    </div>
);

const Block = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`max-w-3xl mx-auto bg-slate-800/40 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 p-8 md:p-12 mb-12 transition-all hover:border-cyan-500/30 ${className}`}>
        {children}
    </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InteractiveWrapper = ({ children, title, icon: Icon }: { children: React.ReactNode, title: string, icon: any }) => (
    <div className="w-full my-20 bg-slate-900/80 border-y border-slate-800 py-20 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-blue-900/10 opacity-50 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubic-zeus.png')] opacity-5 sticky-bg pointer-events-none mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12 text-center">
                <div className="p-4 bg-cyan-950/50 rounded-2xl border border-cyan-800/50 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">{title}</h3>
            </div>
            {children}
        </div>
    </div>
);

const PullQuote = ({ children }: { children: React.ReactNode }) => (
    <div className="relative my-12 pl-8 md:pl-12 border-l-4 border-cyan-500 italic text-xl md:text-3xl text-slate-300 font-serif bg-gradient-to-r from-cyan-950/30 to-transparent py-8 pr-4 rounded-r-2xl">
        <Quote className="absolute -top-5 -left-4 w-10 h-10 text-cyan-500 fill-cyan-900 stroke-2" />
        "{children}"
    </div>
);

// --- Interactive Components ---

// 1. Mental Fitness Simulator
const MentalFitnessSim = () => {
    const [aiReliance, setAiReliance] = useState(50);

    // Calculate derived metrics
    const outputSpeed = Math.min(100, 20 + aiReliance * 0.8);
    const mentalGrowth = Math.max(0, 100 - aiReliance * 1.2);
    const longTermCapability = (mentalGrowth * 0.7) + (outputSpeed * 0.1);

    return (
        <InteractiveWrapper title='Interactive Model: The "Gym" Analogy' icon={Brain}>
            <div className="grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-4 space-y-8 text-center lg:text-left">
                    <p className="text-xl text-slate-300 leading-relaxed font-light">
                        Po-Shen Loh argues that using AI to bypass thinking is like <strong className="text-white font-bold text-2xl block mt-2">driving a car to the gym.</strong>
                    </p>
                    <p className="text-slate-400">
                        You get to the destination faster, but your "mental muscles" atrophy.
                    </p>

                    <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700 shadow-inner">
                        <label className="flex justify-between text-lg font-bold text-white mb-6">
                            <span>AI Assistance Level</span>
                            <span className="text-cyan-400 font-mono text-xl">{aiReliance}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={aiReliance}
                            onChange={(e) => setAiReliance(parseInt(e.target.value))}
                            className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all shadow-input"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-3 font-bold uppercase tracking-widest">
                            <span>Thinking Alone</span>
                            <span>Full Automation</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Metric 1 */}
                    <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 text-center transform transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-900/20 group">
                        <div className="text-xs text-slate-400 mb-3 uppercase tracking-widest font-bold">Immediate Speed</div>
                        <div className="text-6xl font-black text-green-400 mb-6 font-mono tracking-tighter group-hover:scale-110 transition-transform">{outputSpeed.toFixed(0)}%</div>
                        <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-green-400 h-full transition-all duration-500 ease-out" style={{ width: `${outputSpeed}%` }}></div>
                        </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 text-center relative overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-900/20 group">
                        <div className="text-xs text-slate-400 mb-3 uppercase tracking-widest font-bold">Cognitive Growth</div>
                        <div className={`text-6xl font-black mb-6 font-mono tracking-tighter group-hover:scale-110 transition-transform ${mentalGrowth < 30 ? 'text-red-500' : 'text-blue-500'}`}>
                            {mentalGrowth.toFixed(0)}%
                        </div>
                        <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ease-out ${mentalGrowth < 30 ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-blue-600 to-blue-400'}`} style={{ width: `${mentalGrowth}%` }}></div>
                        </div>
                        {mentalGrowth < 30 && (
                            <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center backdrop-blur-sm animate-pulse z-10">
                                <span className="text-xl font-bold text-red-100 border-4 border-red-500/50 px-6 py-3 rounded-xl shadow-2xl skew-x-[-10deg]">ATROPHY WARNING</span>
                            </div>
                        )}
                    </div>

                    {/* Metric 3 */}
                    <div className="bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-700 text-center transform transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/20 group">
                        <div className="text-xs text-slate-400 mb-3 uppercase tracking-widest font-bold">Career Value</div>
                        <div className="text-6xl font-black text-purple-400 mb-6 font-mono tracking-tighter group-hover:scale-110 transition-transform">{longTermCapability.toFixed(0)}%</div>
                        <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-full transition-all duration-500 ease-out" style={{ width: `${longTermCapability}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </InteractiveWrapper>
    );
};

// 2. Innovation Generator
const InnovationGame = () => {
    const [ideas, setIdeas] = useState<{ id: number, type: 'bad' | 'good', status: 'new' | 'destroyed' | 'diamond' }[]>([]);
    const [stats, setStats] = useState({ generated: 0, diamonds: 0 });

    const generateIdeas = () => {
        const newIdeas = Array.from({ length: 20 }).map((_, i) => ({
            id: Date.now() + i,
            type: (Math.random() > 0.9 ? 'good' : 'bad') as 'good' | 'bad',
            status: 'new' as const
        }));
        setIdeas(prev => [...prev, ...newIdeas]);
        setStats(prev => ({ ...prev, generated: prev.generated + 20 }));
    };

    const destroyIdeas = () => {
        setIdeas(prev => prev.map(idea => {
            if (idea.status !== 'new') return idea;
            return {
                ...idea,
                status: idea.type === 'good' ? 'diamond' : 'destroyed'
            };
        }));
    };

    const diamondCount = ideas.filter(i => i.status === 'diamond').length;

    return (
        <InteractiveWrapper title='The 1% Rule: Generate & Destroy' icon={RefreshCw}>
            <div className="grid lg:grid-cols-1 gap-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-md">
                    <div className="max-w-2xl text-center md:text-left">
                        <p className="text-slate-300 text-xl leading-relaxed">
                            Innovation requires volume. <span className="text-red-400 font-extrabold text-2xl px-2 bg-red-950/30 rounded">99% of new ideas</span> are fundamentally flawed.
                        </p>
                        <p className="text-slate-400 mt-2">Generate rapidly, destroy ruthlessly, find the diamonds.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                        <button
                            onClick={generateIdeas}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_4px_0_rgb(55,48,163)] hover:shadow-[0_2px_0_rgb(55,48,163)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] flex items-center justify-center gap-3 w-full sm:w-auto"
                        >
                            <Sparkles className="w-5 h-5" /> Generate 20 Ideas
                        </button>
                        <button
                            onClick={destroyIdeas}
                            disabled={ideas.filter(i => i.status === 'new').length === 0}
                            className="bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_4px_0_rgb(153,27,27)] hover:shadow-[0_2px_0_rgb(153,27,27)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3 w-full sm:w-auto"
                        >
                            <Trash2 className="w-5 h-5" /> Attempt to Destroy
                        </button>
                    </div>
                </div>

                <div className="bg-slate-950/80 rounded-3xl border border-slate-800 p-8 shadow-inner min-h-[400px] flex flex-col">
                    <div className="flex-grow relative overflow-y-auto overflow-x-hidden flex flex-wrap content-start gap-3 custom-scrollbar p-2">
                        {ideas.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 animate-pulse">
                                <RefreshCw className="w-24 h-24 mb-6 opacity-20" />
                                <p className="text-2xl font-bold">System Empty. Initialize Generation.</p>
                            </div>
                        )}
                        {ideas.map((idea) => (
                            <div
                                key={idea.id}
                                className={`
                                w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-700 ease-in-out
                                ${idea.status === 'new' ? 'bg-slate-700 text-slate-400 animate-bounce-short shadow-md' : ''}
                                ${idea.status === 'destroyed' ? 'bg-transparent border-2 border-dashed border-red-900/30 text-red-900/30 scale-50 opacity-30 grayscale' : ''}
                                ${idea.status === 'diamond' ? 'bg-gradient-to-tr from-cyan-400 to-blue-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-125 z-10 rotate-12 ring-2 ring-white/50' : ''}
                                `}
                            >
                                {idea.status === 'diamond' && '💎'}
                                {idea.status === 'destroyed' && '×'}
                                {idea.status === 'new' && '?'}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-slate-400">
                        <div className="font-mono uppercase tracking-widest text-sm">Total Generated: <span className="text-white text-xl font-bold ml-2">{stats.generated}</span></div>
                        <div className="flex items-center gap-4 bg-slate-900 px-6 py-3 rounded-xl border border-slate-700">
                            <span className="font-mono uppercase tracking-widest text-sm font-bold text-cyan-500">Diamonds Found</span>
                            <span className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">{diamondCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </InteractiveWrapper>
    );
};

// 3. Ecosystem Visualizer
const EcosystemViz = () => {
    const [activeNode, setActiveNode] = useState('platform');

    return (
        <InteractiveWrapper title='The Win-Win Ecosystem' icon={Users}>
            <div className="grid lg:grid-cols-3 gap-12 items-center">
                <div className="space-y-6 order-2 lg:order-1">
                    <p className="text-slate-300 text-xl leading-relaxed">
                        Social entrepreneurship works when <span className="text-white font-bold decoration-cyan-500 underline decoration-2">every participant gains value</span>.
                    </p>
                    <p className="text-slate-400">Hover over the groups on the right to reveal the circular value flow.</p>

                    <div className="p-8 bg-slate-800 rounded-2xl border-l-4 border-cyan-500 shadow-xl">
                        <div className="text-xs uppercase tracking-widest text-slate-500 mb-3 font-bold">Current Benefit</div>
                        <div className="text-xl font-medium text-white min-h-[80px] flex items-center">
                            {activeNode === 'math_stars' && "🧠 Receives empathy training & leadership skills not taught in schools."}
                            {activeNode === 'actors' && "🎭 Receives steady income & meaningful work in a gig economy."}
                            {activeNode === 'students' && "🎓 Receives engaging, high-energy math education that actually sticks."}
                            {activeNode === 'platform' && <span className="italic text-slate-500 flex items-center gap-2"><ArrowLeft className="w-4 h-4 animate-pulse" /> Hover over a node...</span>}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 relative h-[500px] w-full bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl order-1 lg:order-2">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>

                    {/* Connection Lines (Animated) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-current text-slate-700/50">
                        <defs>
                            <marker id="arrowhead" markerWidth="14" markerHeight="10" refX="35" refY="5" orient="auto">
                                <polygon points="0 0, 14 5, 0 10" fill="#64748b" />
                            </marker>
                        </defs>
                        <g className="animate-pulse duration-[3000ms]">
                            <line x1="25%" y1="25%" x2="50%" y2="75%" strokeWidth="4" markerEnd="url(#arrowhead)" />
                            <line x1="75%" y1="25%" x2="25%" y2="25%" strokeWidth="4" strokeDasharray="12,12" markerEnd="url(#arrowhead)" />
                            <line x1="50%" y1="75%" x2="75%" y2="25%" strokeWidth="4" markerEnd="url(#arrowhead)" />
                        </g>
                    </svg>

                    {/* Nodes */}
                    <div
                        className={`absolute top-12 left-8 md:left-24 w-56 p-6 rounded-2xl shadow-xl cursor-help transition-all duration-300 border-2 group ${activeNode === 'math_stars' ? 'scale-110 border-blue-400 bg-blue-900/90 z-10 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'bg-slate-900/80 border-slate-700 hover:border-blue-500/50'}`}
                        onMouseEnter={() => setActiveNode('math_stars')}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🧮</span>
                            <div className="font-bold text-blue-100 text-lg">Math Stars</div>
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-blue-400 group-hover:text-blue-200">The Talent</div>
                    </div>

                    <div
                        className={`absolute top-12 right-8 md:right-24 w-56 p-6 rounded-2xl shadow-xl cursor-help transition-all duration-300 border-2 group ${activeNode === 'actors' ? 'scale-110 border-purple-400 bg-purple-900/90 z-10 shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'bg-slate-900/80 border-slate-700 hover:border-purple-500/50'}`}
                        onMouseEnter={() => setActiveNode('actors')}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">🎭</span>
                            <div className="font-bold text-purple-100 text-lg">Pro Actors</div>
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-purple-400 group-hover:text-purple-200">The Coaches</div>
                    </div>

                    <div
                        className={`absolute bottom-12 left-1/2 -translate-x-1/2 w-64 p-6 rounded-2xl shadow-xl cursor-help transition-all duration-300 border-2 group ${activeNode === 'students' ? 'scale-110 border-green-400 bg-green-900/90 z-10 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-slate-900/80 border-slate-700 hover:border-green-500/50'}`}
                        onMouseEnter={() => setActiveNode('students')}
                    >
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <span className="text-2xl">🎒</span>
                            <div className="font-bold text-green-100 text-lg">Middle Schoolers</div>
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-green-400 group-hover:text-green-200 text-center">The Learners</div>
                    </div>
                </div>
            </div>
        </InteractiveWrapper>
    );
};

// 4. Perspectives Visualizer
const DOTS_DATA = Array.from({ length: 800 }).map((_, i) => ({
    color: `hsl(${Math.random() * 360}, 80%, 65%)`,
    x: Math.random() * 40 - 20,
    y: Math.random() * 40 - 20,
    opacity: Math.random() * 0.5 + 0.5,
    id: i
}));

const PerspectivesViz = () => {
    const [view, setView] = useState('ai');

    const dots = DOTS_DATA;

    return (
        <InteractiveWrapper title='Perspective Simulator: Bias vs. Humanity' icon={Globe}>
            <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-1/3 space-y-8">
                    <div className="p-2 bg-slate-800 rounded-2xl inline-flex w-full shadow-inner">
                        <button
                            onClick={() => setView('ai')}
                            className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all ${view === 'ai' ? 'bg-slate-100 text-slate-900 shadow-md ring-2 ring-white/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
                        >
                            AI View
                        </button>
                        <button
                            onClick={() => setView('human')}
                            className={`flex-1 py-4 text-sm font-bold rounded-xl transition-all ${view === 'human' ? 'bg-slate-100 text-slate-900 shadow-md ring-2 ring-white/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
                        >
                            Human View
                        </button>
                    </div>

                    <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                        <h4 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
                            {view === 'ai' ? <Zap className="text-yellow-400" /> : <Users className="text-cyan-400" />}
                            {view === 'ai' ? "The Bottleneck" : "The Human Cloud"}
                        </h4>
                        <p className="text-slate-300 text-base leading-relaxed">
                            {view === 'ai'
                                ? "When billions rely on 3-4 models, we efficiently propagate the same few biases globally. This creates a cultural bottleneck where 'truth' is centralized."
                                : "7.5 billion messy, chaotic starting points. This inefficiency is actually a feature—it creates a robust, distributed network of Truth and Taste that no single model can replicate."}
                        </p>
                    </div>
                </div>

                <div className="md:w-2/3 relative h-[600px] bg-black border border-slate-800 rounded-3xl overflow-hidden flex items-center justify-center p-4 shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-950 to-black"></div>

                    {view === 'ai' ? (
                        <div className="text-center animate-fadeIn relative z-10">
                            <div className="flex justify-center gap-8 mb-12">
                                <div className="w-32 h-32 rounded-full bg-blue-600/10 border-2 border-blue-500 flex flex-col items-center justify-center text-blue-300 font-bold shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-pulse hover:scale-110 transition-transform cursor-pointer">
                                    <span className="text-3xl">🤖</span>
                                    <span className="text-lg mt-2">Model A</span>
                                </div>
                                <div className="w-32 h-32 rounded-full bg-purple-600/10 border-2 border-purple-500 flex flex-col items-center justify-center text-purple-300 font-bold shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-pulse delay-75 hover:scale-110 transition-transform cursor-pointer">
                                    <span className="text-3xl">🧠</span>
                                    <span className="text-lg mt-2">Model B</span>
                                </div>
                                <div className="w-32 h-32 rounded-full bg-green-600/10 border-2 border-green-500 flex flex-col items-center justify-center text-green-300 font-bold shadow-[0_0_50px_rgba(34,197,94,0.3)] animate-pulse delay-150 hover:scale-110 transition-transform cursor-pointer">
                                    <span className="text-3xl">⚙️</span>
                                    <span className="text-lg mt-2">Model C</span>
                                </div>
                            </div>
                            <div className="inline-block bg-slate-900/80 backdrop-blur px-8 py-4 rounded-full border border-slate-700 text-slate-300 shadow-xl">
                                <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">Global Menu of Thought</p>
                                <span className="text-red-400 font-bold text-xl">Extremely Limited (&lt; 10 Variants)</span>
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full h-full animate-fadeIn group cursor-crosshair z-10">
                            <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-1 opacity-90 transition-opacity duration-1000">
                                {dots.map((dot) => (
                                    <div
                                        key={dot.id}
                                        className="w-1.5 h-1.5 rounded-full transition-transform duration-500 hover:scale-[4] hover:z-50 hover:bg-white hover:shadow-[0_0_10px_white]"
                                        style={{
                                            backgroundColor: dot.color,
                                            transform: `translate(${dot.x}px, ${dot.y}px)`,
                                            opacity: dot.opacity
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-950/90 backdrop-blur px-8 py-4 rounded-full border border-slate-700 shadow-2xl text-center z-10 pointer-events-none">
                                <p className="text-xl font-bold text-white mb-1">7.5 Billion Perspectives</p>
                                <p className="text-xs text-slate-400 uppercase tracking-widest">Distributed Truth & Taste</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </InteractiveWrapper>
    );
};


// --- Main Application ---

const HumanEdgePage = () => {
    // Scroll to top on mount
    useState(() => {
        window.scrollTo(0, 0);
    });

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-cyan-500/30 pb-20">

            {/* Header / Nav */}
            <header className="bg-[#020617]/80 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="font-serif font-bold text-xl text-slate-100 tracking-tight flex items-center gap-2">
                        <Brain className="w-6 h-6 text-cyan-500" />
                        Human<span className="text-cyan-500">Edge</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest hidden sm:block">
                        Philosophy of Po-Shen Loh
                    </div>
                </div>
            </header>

            <main className="w-full">

                {/* Hero Section */}
                <div className="relative py-32 text-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#020617] to-[#020617] z-0"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 max-w-4xl mx-auto px-6">
                        <div className="inline-flex items-center gap-2 bg-red-950/30 text-red-300 border border-red-900/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8 animate-fadeIn">
                            <ShieldAlert className="w-4 h-4" /> Warning: Mental Fitness at Risk
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-8 leading-tight tracking-tight drop-shadow-sm">
                            The Only Trait for <br className="hidden md:block" /> Success in the AI Era
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                            From students outsourcing homework to AI solving Olympiad math, our ability to think is under siege.
                        </p>
                    </div>
                </div>

                {/* Introduction */}
                <Block>
                    <div className="prose prose-lg prose-invert text-slate-300 max-w-none">
                        <p className="lead text-2xl font-serif text-white mb-8 leading-normal">
                            The paradigm has shifted. We used to believe that creativity and complex logic were the exclusive domain of the human mind. <span className="text-red-400 font-bold decoration-wavy underline decoration-red-900">We were wrong.</span>
                        </p>
                        <p>
                            Po-Shen Loh, a professor of mathematics at Carnegie Mellon University and coach of the US International Math Olympiad (IMO) team, recently had to update his own worldview. For years, he traveled the country assuring people: <em>"Learn to be creative, because that's the only thing AI can't do."</em>
                        </p>
                        <p>
                            He doesn't say that anymore.
                        </p>
                        <p>
                            Last year, Google's AI systems successfully solved <strong>four out of six</strong> problems at the International Math Olympiad. These are arguably the most original, difficult logic puzzles in the world. The AI didn't just regurgitate knowledge; it displayed what looks remarkably like <strong>creativity</strong>.
                        </p>
                        <p>
                            If AI can out-compute us and out-create us, what is left? Loh argues that our survival depends on cultivating <span className="text-cyan-400 font-bold">thoughtfulness</span>, <span className="text-cyan-400 font-bold">empathy</span>, and <span className="text-cyan-400 font-bold">human connection</span> to sustain civilization itself.
                        </p>
                    </div>
                </Block>

                {/* Section 1: The Trap of Convenience */}
                <SectionHeading icon={Zap}>The Trap of Convenience</SectionHeading>
                <Block>
                    <div className="prose prose-lg prose-invert text-slate-300 max-w-none">
                        <p className="text-lg">
                            The immediate threat of AI isn't a "Terminator" scenario; it's atrophy. In schools across the world, students are using Large Language Models (LLMs) to write their essays.
                        </p>
                    </div>
                </Block>

                <MentalFitnessSim />

                <Block>
                    <div className="prose prose-lg prose-invert text-slate-300 max-w-none">
                        <p>
                            If your goal is simply to arrive at the location (get the assignment done), the car is superior. But if your goal is to get physically fit (learn to think), the car renders the entire activity useless.
                        </p>
                        <p className="mt-6 text-xl font-serif italic text-slate-400 border-l-2 border-slate-700 pl-6">
                            The danger is subtle. By maximizing short-term output (grades), we minimize long-term capability (mental fitness).
                        </p>
                    </div>
                </Block>

                {/* Section 2: The Two Thefts */}
                <SectionHeading icon={ShieldAlert}>The Two Thefts: Taste & Truth</SectionHeading>
                <Block>
                    <div className="prose prose-lg prose-invert text-slate-300 max-w-none">
                        <p>
                            Beyond mental atrophy, Loh identifies two profound "thefts" that occur when we rely too heavily on AI: the theft of <strong>Taste</strong> and the theft of <strong>Truth</strong>.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 not-prose">
                            <div className="bg-rose-950/20 p-8 rounded-2xl border border-rose-900/30 hover:bg-rose-900/20 transition-colors">
                                <h4 className="flex items-center gap-3 font-bold text-2xl text-rose-400 mb-4">
                                    <Palette className="w-6 h-6" /> Theft #1: Taste
                                </h4>
                                <p className="text-base text-rose-200/80 leading-relaxed">
                                    "It's fun to have your own twist on things." If AI tells you how to dress, what to write, and how to draw, personal expression vanishes. We lose the "flavor" of humanity to efficient, homogenized output.
                                </p>
                            </div>
                            <div className="bg-amber-950/20 p-8 rounded-2xl border border-amber-900/30 hover:bg-amber-900/20 transition-colors">
                                <h4 className="flex items-center gap-3 font-bold text-2xl text-amber-400 mb-4">
                                    <ShieldAlert className="w-6 h-6" /> Theft #2: Truth
                                </h4>
                                <p className="text-base text-amber-200/80 leading-relaxed">
                                    AI makes it easy to generate statements that are technically true but emotionally deceptive. If we lose the ability to think critically, we become easy victims of manipulation.
                                </p>
                            </div>
                        </div>

                        <p className="text-lg">
                            This leads to a dangerous bottleneck in perspective. When billions of people rely on a handful of AI models (ChatGPT, Claude, Gemini), we shrink the "menu" of human thought.
                        </p>
                    </div>
                </Block>

                <PerspectivesViz />

                {/* Section 3: The New Superpower */}
                <SectionHeading icon={Heart}>The New Superpower: Thoughtfulness</SectionHeading>
                <Block>
                    <div className="prose prose-lg prose-invert text-slate-300 max-w-none">
                        <p>
                            Loh observes that high-achieving students often end up depressed. Why? Because they were taught that the point of life is <strong>"to prove you are better than everyone else."</strong>
                        </p>
                        <p>
                            In a world where AI will always be "better" at tasks, this philosophy is a dead end. The antidote is a shift in mindset: from <em>competition</em> to <em>delight</em>.
                        </p>
                        <PullQuote>
                            "If your philosophy in life is 'how do I outdo everyone else,' you'll never be satisfied. But if it is 'it is actually addictive to make other people happy,' that correlates with traditional success."
                        </PullQuote>
                        <p>
                            The defining skill of the future is the ability to <strong>"simulate the world"</strong> through the eyes of others. This is empathy weaponized as logic. To solve big problems, you must gather a team. People will only join your team if they feel you genuinely care about creating value for <em>them</em>.
                        </p>
                    </div>
                </Block>

                {/* Section 4: Innovation Framework */}
                <SectionHeading icon={Target}>The "Generate & Destroy" Method</SectionHeading>
                <Block>
                    <div className="prose prose-lg prose-invert text-slate-300 max-w-none">
                        <p>
                            Loh shares his personal algorithm for innovation. Most people fall in love with their first idea. He assumes his first idea is wrong.
                        </p>
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 my-6">
                            <ul className="list-none space-y-4 m-0 p-0">
                                <li className="flex items-start gap-3">
                                    <span className="bg-cyan-500 text-slate-900 font-bold w-6 h-6 flex items-center justify-center rounded-full mt-1 shrink-0">1</span>
                                    <div>
                                        <strong className="text-white block">Generate with Excitement.</strong>
                                        <span className="text-slate-400">Come up with a weird, novel way to solve a problem.</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-cyan-900 text-cyan-400 font-bold w-6 h-6 flex items-center justify-center rounded-full mt-1 shrink-0">2</span>
                                    <div>
                                        <strong className="text-white block">Destroy with Effort.</strong>
                                        <span className="text-slate-400">Immediately try to shoot it down. Ask "Why will this fail?"</span>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="bg-cyan-900 text-cyan-400 font-bold w-6 h-6 flex items-center justify-center rounded-full mt-1 shrink-0">3</span>
                                    <div>
                                        <strong className="text-white block">Repeat.</strong>
                                        <span className="text-slate-400">Do this constantly until one idea survives.</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Block>

                <InnovationGame />

                {/* Section 5: Ecosystem */}
                <SectionHeading icon={Users}>The Win-Win Ecosystem</SectionHeading>
                <Block>
                    <div className="prose prose-lg prose-invert text-slate-300 max-w-none">
                        <p>
                            Loh isn't just theorizing; he's building <strong>LIVE</strong>, a platform that scales critical thinking.
                        </p>
                        <p>
                            <strong>The Model:</strong> He hires professional comedians/actors to coach brilliant high school math students on empathy and charisma. These high schoolers then teach math to middle schoolers.
                        </p>
                    </div>
                </Block>

                <EcosystemViz />

                <Block>
                    <div className="prose prose-lg prose-invert text-slate-300 max-w-none">
                        <p className="mt-4">
                            This creates a network of "kind, clever people." The high schoolers gain the soft skills AI can't replace; the actors gain income; the students gain engagement. It is a system designed to sustain civilization by building thoughtful humans.
                        </p>
                    </div>
                </Block>

                {/* Key Insights Summary */}
                <div className="max-w-6xl mx-auto px-4 mb-24">
                    <div className="bg-gradient-to-br from-indigo-950 to-[#0f172a] text-white rounded-3xl p-8 md:p-16 shadow-2xl border border-indigo-900/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                        <h3 className="text-3xl md:text-4xl font-serif font-bold mb-12 flex items-center gap-4 relative z-10">
                            <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" /> Key Insights Checklist
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 relative z-10">
                            {[
                                "AI's #1 Target is schoolwork—outsourcing thinking destroys mental fitness.",
                                "Creativity and Logic are no longer uniquely human; AI can solve IMO problems.",
                                "The 'Theft of Taste': AI efficiency threatens individual human expression.",
                                "The 'Theft of Truth': Centralized AI reduces 7.5 billion viewpoints to a few biases.",
                                "Depression in high achievers comes from trying to 'outdo' others.",
                                "Success in the AI era comes from 'Simulating the World' (Empathy).",
                                "We need to build robust networks of kind, clever people to handle future challenges."
                            ].map((insight, i) => (
                                <div key={i} className="flex gap-4 items-start group">
                                    <div className="mt-1 bg-indigo-900/50 p-1 rounded-full group-hover:bg-yellow-400/20 transition-colors">
                                        <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                                    </div>
                                    <span className="text-indigo-100 text-lg leading-relaxed group-hover:text-white transition-colors">{insight}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-slate-800 py-16 text-center text-sm text-slate-500 bg-[#020617]">
                    <p className="mb-8 text-base">Based on the lecture <span className="text-slate-300 font-bold">"The Only Trait for Success in the AI Era"</span> by Po-Shen Loh.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6 mt-4">
                        <a href="https://poshenloh.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 font-bold hover:bg-slate-800 hover:text-cyan-300 transition-all hover:-translate-y-1">
                            Visit Po-Shen Loh's Website
                        </a>
                        <a href="https://www.youtube.com/watch?v=xWYb7tImErI" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-red-950/20 border border-red-900/50 text-red-400 font-bold hover:bg-red-900/30 hover:text-red-300 transition-all hover:-translate-y-1">
                            <span>Watch lecture on YouTube</span> <div className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded ml-1">▶</div>
                        </a>
                    </div>
                </footer>

            </main>

            <ProjectNavigation currentId="human-edge" />
        </div>
    );
};

export default HumanEdgePage;
