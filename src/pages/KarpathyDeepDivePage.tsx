
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, Brain, Bot, Circle, Database,
    Eye, FileText, Globe, Layers, Mic, Rocket, Search, Shield, Zap
} from 'lucide-react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import ProjectNavigation from '../components/ProjectNavigation';

// --- SHARED TOOLTIP COMPONENT ---
const Tooltip = ({ content, visible, position }: { content: string, visible: boolean, position: { x: number, y: number } }) => {
    if (!visible) return null;
    return (
        <div
            className="fixed z-[100] bg-slate-900 text-slate-200 px-4 py-3 rounded-lg border border-slate-700 shadow-2xl text-xs max-w-xs pointer-events-none"
            style={{ left: position.x, top: position.y, transform: 'translate(10px, 10px)' }}
        >
            {content}
        </div>
    );
};

// --- INTERACTIVE COMPONENTS ---

interface ModelEloBarProps {
    name: string;
    score: string;
    color: string;
    bgColor: string;
    width: string;
    tip: string;
    onHover: (e: React.MouseEvent, content: string) => void;
    onLeave: () => void;
}

const ModelEloBar = ({ name, score, color, bgColor, width, tip, onHover, onLeave }: ModelEloBarProps) => (
    <div className="group cursor-help mb-4" onMouseEnter={(e) => onHover(e, tip)} onMouseLeave={onLeave} onMouseMove={(e) => onHover(e, tip)}>
        <div className="flex justify-between mb-1 items-end">
            <span className="text-sm font-bold text-slate-300">{name}</span>
            <span className={`text-xs font-mono font-bold ${color}`}>ELO {score}</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: width }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full ${bgColor}`}
            />
        </div>
    </div>
);

interface TokenChunkProps {
    text: string;
    id: string;
    color: string;
    onHover: (e: React.MouseEvent, content: string) => void;
    onLeave: () => void;
}

const TokenChunk = ({ text, id, color, onHover, onLeave }: TokenChunkProps) => (
    <span
        className={`inline-block px-1 rounded mx-[1px] font-mono transition-colors duration-200 hover:opacity-80 cursor-help ${color}`}
        onMouseEnter={(e) => onHover(e, `Token ID: ${id} ("${text.trim()}")`)}
        onMouseLeave={onLeave}
        onMouseMove={(e) => onHover(e, `Token ID: ${id} ("${text.trim()}")`)}
    >
        {text}
    </span>
);

const KarpathyDeepDivePage = () => {
    // Scroll handling
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

    // Tooltip State
    const [tooltip, setTooltip] = useState({ content: '', visible: false, position: { x: 0, y: 0 } });
    const handleHover = (e: React.MouseEvent, content: string) => {
        setTooltip({ content, visible: true, position: { x: e.clientX, y: e.clientY } });
    };
    const handleLeave = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-purple-500/30 overflow-x-hidden">
            <Tooltip content={tooltip.content} visible={tooltip.visible} position={tooltip.position} />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-[#020617]/80 backdrop-blur border-b border-slate-800 transition-all duration-300">
                <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
                <div className="flex items-center gap-4">
                    <a href="https://www.youtube.com/watch?v=EWvNQjAaOHw" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors">
                        <Rocket className="w-3 h-3" />
                        <span>Watch Original</span>
                    </a>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                        <span className="text-xs font-mono text-purple-500 uppercase">AK Deep Dive</span>
                    </div>
                </div>
            </nav>

            <header className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-purple-500" /></pattern></defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <Brain className="w-3 h-3" />
                        Technical Strategy
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Probabilistic Operating System</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                        A definitive technical and strategic synthesis of Andrej Karpathy's masterclass on professional LLM utilization in 2025.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <span className="bg-blue-900/20 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20">LLM Architecture</span>
                        <span className="bg-purple-900/20 text-purple-400 px-4 py-2 rounded-full border border-purple-500/20">Cognitive Workflows</span>
                    </div>
                </motion.div>
            </header>

            <main className="max-w-4xl mx-auto px-6">

                {/* Introduction */}
                <article className="prose prose-invert prose-lg max-w-none pt-10 mb-32 border-b border-slate-800 pb-20">
                    <h2 className="text-3xl font-bold text-white mb-8">Introduction: Crossing the Chasm of AI Utility</h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        For most of the public, Large Language Models (LLMs) are chatty assistants—entities that write emails, tell jokes, or summarize articles. But for the professional technologist, the LLM represents something far more profound. As Andrej Karpathy illustrates, we have entered the era of the <strong className="text-purple-400">"Probabilistic Operating System."</strong>
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        In this mental model, the LLM is the CPU. The "context window" is the RAM. The "pre-training data" is the hard drive. And the "tools" (Search, Code Interpreters, Vision) are the peripherals. This guide is designed to help you move from being a casual prompter to becoming a system architect of this new computing paradigm. We will explore the technical nuances that separate a "hallucination" from a "logical deduction" and the workflows that allow one human to achieve the output of an entire department.
                    </p>
                </article>

                {/* Chapter 1 */}
                <section className="relative mb-32">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">01</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">The LLM Zoo: The Ecosystem of Intelligence</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        The dominance of OpenAI's GPT series is no longer absolute. The ecosystem in 2025 is a vibrant, competitive "zoo" of models, each with distinct trade-offs in speed, intelligence, and cost. Professionals must distinguish between <strong className="text-white">Generalist Models</strong> (GPT-4o, Claude 3.5), <strong className="text-white">Reasoning Models</strong> (o1, R1), and <strong className="text-white">Open-Weights Models</strong> (Llama 3, Mistral).
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm min-h-[300px]">
                        <h4 className="text-center font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">Interactive: The Model ELO Hierarchy</h4>
                        <ModelEloBar
                            name="Frontier (Intelligence Max)"
                            score="1300+"
                            color="text-blue-400"
                            bgColor="bg-blue-400"
                            width="95%"
                            tip="Tier 1: SOTA Models (GPT-4o, Claude 3.5). Highest reasoning, most expensive. Use for architecture."
                            onHover={handleHover}
                            onLeave={handleLeave}
                        />
                        <ModelEloBar
                            name="Reasoning (Chain-of-Thought)"
                            score="1250+"
                            color="text-purple-400"
                            bgColor="bg-purple-400"
                            width="88%"
                            tip="Tier 2: Reasoning Models (o1-preview, DeepSeek R1). Slower, but solves math/logic perfectly."
                            onHover={handleHover}
                            onLeave={handleLeave}
                        />
                        <ModelEloBar
                            name="Technical / Coding"
                            score="1200+"
                            color="text-emerald-400"
                            bgColor="bg-emerald-400"
                            width="80%"
                            tip="Tier 3: Coding Specials (Claude 3.5 Sonnet, DeepSeek V3). High speed, low cost, code-heavy."
                            onHover={handleHover}
                            onLeave={handleLeave}
                        />
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        Karpathy emphasizes that ELO ratings (from LMSYS) are the "gold standard" for measuring model quality. A model's ELO represents its probability of winning a blind "battle" against another model in a chat arena. For high-stakes tasks, you should consult the <strong className="text-purple-400">"LLM Council"</strong>: prompting at least three high-ELO models and looking for convergence or divergence in their answers.
                    </p>
                </section>

                {/* Chapter 2 */}
                <section className="relative mb-32">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">02</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">Tokens: The Language of the Machine</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        The fundamental unit of AI is the <strong className="text-white">Token</strong>. LLMs do not read letters; they process chunks of text that have been mathematically mapped to specific IDs. For instance, the word "friendship" might be one token, while a complex technical term might be broken into three.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm">
                        <h4 className="text-center font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">Interactive: Byte-Pair Encoding (BPE) Visualizer</h4>
                        <div className="text-lg leading-loose font-mono text-center text-slate-300">
                            <TokenChunk text="The" id="4123" color="bg-blue-500/20 text-blue-200 border border-blue-500/30" onHover={handleHover} onLeave={handleLeave} />
                            <TokenChunk text="quick" id="981" color="bg-purple-500/20 text-purple-200 border border-purple-500/30" onHover={handleHover} onLeave={handleLeave} />
                            <TokenChunk text="brown" id="1542" color="bg-emerald-500/20 text-emerald-200 border border-emerald-500/30" onHover={handleHover} onLeave={handleLeave} />
                            <TokenChunk text="fox" id="77" color="bg-rose-500/20 text-rose-200 border border-rose-500/30" onHover={handleHover} onLeave={handleLeave} />
                            <TokenChunk text="jumps" id="12" color="bg-amber-500/20 text-amber-200 border border-amber-500/30" onHover={handleHover} onLeave={handleLeave} />
                            <TokenChunk text="over" id="554" color="bg-pink-500/20 text-pink-200 border border-pink-500/30" onHover={handleHover} onLeave={handleLeave} />
                            <TokenChunk text="the" id="5" color="bg-blue-500/20 text-blue-200 border border-blue-500/30" onHover={handleHover} onLeave={handleLeave} />
                            <TokenChunk text="lazy" id="881" color="bg-indigo-500/20 text-indigo-200 border border-indigo-500/30" onHover={handleHover} onLeave={handleLeave} />
                            <TokenChunk text="dog" id="221" color="bg-slate-700 text-slate-200 border border-slate-600" onHover={handleHover} onLeave={handleLeave} />
                        </div>
                        <p className="text-xs text-slate-600 mt-4 text-center italic">Hover over chunks to see the underlying token structure.</p>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        Understanding tokens is crucial for managing the <strong className="text-white">Context Window</strong>. Every token you send—and every token the AI responds with—fills up a finite "buffer." If you exceed this buffer, the AI "forgets" the beginning of the conversation. Professionals manage this by starting new chats aggressively, clearing the buffer to ensure the model remains focused and high-precision.
                    </p>
                </section>

                {/* Chapter 3 */}
                <section className="relative mb-32">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">03</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">Training vs. Inference: The Zip Analogy</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        Karpathy describes an LLM as a <strong className="text-purple-400">"lossy zip file of the internet."</strong> During the pre-training phase, the model compresses trillions of words into a few hundred gigabytes of "weights." This creates the model's static world knowledge.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row items-center justify-between text-center gap-6">
                            <div className="flex-1 px-4">
                                <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                    <Database className="w-8 h-8" />
                                </div>
                                <span className="block text-xs font-bold text-white tracking-widest mb-1">1. PRE-TRAINING</span>
                                <span className="text-[10px] text-slate-400">10 Trillion Words compressed into weights.</span>
                            </div>
                            <div className="hidden md:block text-slate-600">➜</div>
                            <div className="flex-1 px-4">
                                <div className="w-16 h-16 bg-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                                    <Layers className="w-8 h-8" />
                                </div>
                                <span className="block text-xs font-bold text-white tracking-widest mb-1">2. THE WEIGHTS</span>
                                <span className="text-[10px] text-slate-400">The "Zip File" snapshot of human knowledge.</span>
                            </div>
                            <div className="hidden md:block text-slate-600">➜</div>
                            <div className="flex-1 px-4">
                                <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                    <Bot className="w-8 h-8" />
                                </div>
                                <span className="block text-xs font-bold text-white tracking-widest mb-1">3. INFERENCE</span>
                                <span className="text-[10px] text-slate-400">Assistant persona attached via Post-training.</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        Because pre-training is a "frozen" event, the model has a <strong className="text-white">Knowledge Cutoff</strong>. It does not know about events that happened yesterday unless it has access to <strong className="text-white">Tools</strong>. It is essential to remember that the model is predicting the next most likely token based on its compressed knowledge, not "knowing" facts in the human sense.
                    </p>
                </section>

                {/* Chapter 4 */}
                <section className="relative mb-32">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">04</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">System 1 vs. System 2: Thinking Models</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        One of the most significant shifts in 2024-2025 is the move from "System 1" (Instant) to "System 2" (Deliberative) thinking. Models like <strong className="text-white">OpenAI o1</strong> and <strong className="text-white">DeepSeek R1</strong> spend time "thinking" before they output a single word of the answer.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm">
                        <h4 className="text-center font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">The "Chain of Thought" Pulse</h4>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-800/50 border rounded border-slate-700 flex items-center space-x-4">
                                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                                <div className="text-sm italic text-purple-200">Thinking: "Wait, the variable 'x' is undefined here..."</div>
                            </div>
                            <div className="p-4 bg-slate-800/30 border rounded border-slate-700/50 flex items-center space-x-4 opacity-70">
                                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                                <div className="text-sm italic text-purple-200">Thinking: "Recalculating derivative using chain rule..."</div>
                            </div>
                            <div className="p-4 bg-blue-900/20 border rounded border-blue-500/30 flex items-center space-x-4">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div className="text-sm font-bold text-blue-100">Output: "The answer is 42."</div>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        Standard models spend the same amount of compute on every token, whether it's saying "Hello" or solving a complex differential equation. Thinking models, however, use <strong className="text-white">Reinforcement Learning (RL)</strong> to discover internal strategies for self-correction. For the professional, this means that math, coding, and complex logic should always be offloaded to these specialized reasoning models.
                    </p>
                </section>

                {/* Chapter 5 */}
                <section className="relative mb-32">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">05</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">Search, Browse, and Fact-Checking</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        Search is no longer just finding links; it is <strong className="text-white">Deep Research</strong>. When an LLM searches the web, it emits a "Tool Call" token. It then reads the content of the search results and pulls them into its context window.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm flex flex-col items-center">
                        <div className="flex space-x-4 mb-6">
                            <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 animate-bounce" style={{ animationDelay: '0s' }}><Search className="w-4 h-4" /></div>
                            <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}><Search className="w-4 h-4" /></div>
                            <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}><Search className="w-4 h-4" /></div>
                        </div>
                        <div className="bg-black/50 px-8 py-5 rounded-lg text-xs font-mono text-center border border-slate-700/50">
                            <p className="mb-1 text-slate-400">READING: source_1.html (2,000 tokens)</p>
                            <p className="mb-2 text-slate-400">READING: source_2.pdf (1,500 tokens)</p>
                            <span className="text-emerald-400 font-bold animate-pulse">SYNTHESIZING FINAL REPORT...</span>
                        </div>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        Karpathy highlights that tools like <strong className="text-white">Perplexity</strong> or <strong className="text-white">OpenAI Deep Research</strong> can perform 20+ searches in a single session. This allows the AI to act as a research assistant that provides a first draft of a report with full citations. The professional's job is not to find the info, but to verify the citations.
                    </p>
                </section>

                {/* Chapter 6 */}
                <section className="relative mb-32">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">06</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">Document Analysis: Never Read Alone</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        One of Karpathy's most famous workflows is the <strong className="text-purple-400">"Co-Reading"</strong> strategy. By uploading large PDFs directly to models with high context windows (like Claude or Gemini), you essentially "load" the book into the model's RAM.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm flex justify-center items-center">
                        <svg viewBox="0 0 400 200" className="w-full max-w-sm">
                            <rect x="50" y="50" width="100" height="120" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                            <text x="100" y="115" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="bold">COMPLEX PDF</text>
                            <path d="M160,110 L240,110" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
                            <circle cx="280" cy="110" r="40" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="2" />
                            <text x="280" y="115" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">LLM MEMORY</text>
                        </svg>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        Instead of reading a 50-page technical paper cover-to-cover, you can ask: <em>"Find the section discussing edge-case error handling and explain it using a analogy about a baker."</em> This turns static information into a dynamic, queryable knowledge base.
                    </p>
                </section>

                {/* Chapter 7 */}
                <section className="relative mb-32">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">07</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">Vibe Coding: The Future of Software</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        <strong className="text-white">Vibe Coding</strong> is the ultimate expression of LLM utility in 2025. It is the transition from writing syntax to managing <em>intent</em>. With tools like <strong className="text-white">Cursor</strong>, <strong className="text-white">Replit</strong>, and <strong className="text-white">Windsurf</strong>, the human architect describes the "vibe" and the AI agent implements the technical details.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                                <Zap className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                                <span className="block text-xs font-bold text-white mb-1">HUMAN</span>
                                <span className="text-[10px] text-slate-400 italic">"Make it dark mode."</span>
                            </div>
                            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                                <Bot className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                                <span className="block text-xs font-bold text-white mb-1">AGENT</span>
                                <span className="text-[10px] text-slate-400 italic">Editing 14 CSS files...</span>
                            </div>
                            <div className="p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                                <Rocket className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                                <span className="block text-xs font-bold text-white mb-1">RESULT</span>
                                <span className="text-[10px] text-slate-400 italic">Deployed App.</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        In this workflow, the human doesn't write the code; they review it. The agent identifies the relevant files, applies the changes, and even runs the terminal commands to verify the build. This reduces the time to build a prototype from days to minutes.
                    </p>
                </section>

                {/* Chapter 8 */}
                <section className="relative mb-32">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">08</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">Multi-Modality: Seeing and Hearing</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        Early AI required separate models for vision and text. Today's <strong className="text-white">Omni</strong> models (like GPT-4o) process images, audio, and text in a single stream. This means the model understands the visual relationship between objects.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm">
                        <div className="flex justify-center space-x-12">
                            <div className="text-center group cursor-help transition-transform hover:scale-110" onMouseEnter={(e) => handleHover(e, 'Vision: Analyze diagrams, OCR handwriting, or debug physical circuits via camera.')} onMouseLeave={handleLeave} onMouseMove={(e) => handleHover(e, 'Vision: Analyze diagrams, OCR handwriting, or debug physical circuits via camera.')}>
                                <Eye className="w-10 h-10 mx-auto text-blue-400 group-hover:text-blue-300 mb-2" />
                                <span className="block text-xs font-bold text-slate-300">VISION</span>
                            </div>
                            <div className="text-center group cursor-help transition-transform hover:scale-110" onMouseEnter={(e) => handleHover(e, 'Audio: Understand emotion, pitch, and sarcasm in real-time conversations.')} onMouseLeave={handleLeave} onMouseMove={(e) => handleHover(e, 'Audio: Understand emotion, pitch, and sarcasm in real-time conversations.')}>
                                <Mic className="w-10 h-10 mx-auto text-red-400 group-hover:text-red-300 mb-2" />
                                <span className="block text-xs font-bold text-slate-300">AUDIO</span>
                            </div>
                            <div className="text-center group cursor-help transition-transform hover:scale-110" onMouseEnter={(e) => handleHover(e, 'Text: The core logical backbone that synthesizes all sensory inputs.')} onMouseLeave={handleLeave} onMouseMove={(e) => handleHover(e, 'Text: The core logical backbone that synthesizes all sensory inputs.')}>
                                <FileText className="w-10 h-10 mx-auto text-emerald-400 group-hover:text-emerald-300 mb-2" />
                                <span className="block text-xs font-bold text-slate-300">TEXT</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        Karpathy demonstrates using vision to debug a physical CO2 monitor or translate a handwritten menu. The <strong className="text-white">Advanced Voice Mode</strong> allows for real-time practice of skills like language learning or public speaking, with the AI providing instant feedback on tone and pronunciation.
                    </p>
                </section>

                {/* Chapter 9 */}
                <section className="relative mb-32">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">09</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">Personalization: Your Digital Twin</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        Custom Instructions and Memory allow you to "carve" the LLM into a specific persona. If you always want your code in TypeScript or your explanations to be "Socratic," you can bake these into the model's fundamental personality.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm">
                        <div className="relative h-20 w-full bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                            <div className="absolute inset-y-0 left-0 w-[35%] bg-blue-600 flex items-center px-4 text-white text-[10px] font-bold z-10">BASE MODEL</div>
                            <div className="absolute inset-y-0 left-[35%] w-[4px] bg-white z-20"></div>
                            <div className="absolute inset-y-0 left-[35%] right-0 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-end px-4 text-white text-[10px] font-bold">YOU (PERSONALIZED)</div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 text-center italic">The "Persona Layer" filters the base knowledge through your unique preferences.</p>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        Karpathy's "Korean Detailed Translator" is a prime example of a <strong className="text-white">Custom GPT</strong>. It takes the general capabilities of an LLM and applies a layer of specialized instructions that mandate a specific output format (parsing grammar, identifying politeness levels), making it far superior to a generic translation tool.
                    </p>
                </section>

                {/* Chapter 10 */}
                <section className="relative mb-32">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">10</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">The Rise of Autonomous Agents</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        The next frontier is <strong className="text-purple-400">Agentic AI</strong>. Unlike a chatbot that waits for you to reply, an agent is given a goal and works autonomously to achieve it. It can use a computer, browse the web, and even communicate with other agents.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm">
                        <div className="flex flex-col space-y-3">
                            <div className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800/50 transition-colors">
                                <Circle className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                                <span className="text-slate-300 text-sm font-mono"><span className="text-emerald-400 font-bold">Goal:</span> Book a flight to Paris.</span>
                            </div>
                            <div className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800/50 transition-colors">
                                <Rocket className="w-4 h-4 text-blue-500 animate-pulse" />
                                <span className="text-slate-300 text-sm font-mono"><span className="text-blue-400 font-bold">Action:</span> Browsing Google Flights...</span>
                            </div>
                            <div className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800/50 transition-colors opacity-60">
                                <Layers className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-300 text-sm font-mono"><span className="text-slate-500 font-bold">Action:</span> Checking personal calendar...</span>
                            </div>
                            <div className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800/50 transition-colors opacity-40">
                                <Layers className="w-4 h-4 text-slate-600" />
                                <span className="text-slate-300 text-sm font-mono"><span className="text-slate-600 font-bold">Action:</span> Sending confirmation email...</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        We are approaching a world of "Simulators" (like Sora) where the AI understands physics and human behavior well enough to predict outcomes. As Karpathy notes, once an AI can "act" reliably in the world, the definition of software changes from "apps we use" to "workers we manage."
                    </p>
                </section>

                {/* Conclusion */}
                <section className="relative mb-32 border-t border-slate-800 pt-10">
                    <span className="absolute -left-12 -top-8 text-[8rem] font-black text-slate-800/30 z-0">11</span>
                    <h2 className="text-4xl font-black text-white mb-8 relative z-10">Conclusion: The AI-Native Mindset</h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        The transition into an AI-first professional requires more than just new tools; it requires a new mindset. You must become comfortable with <strong className="text-white">probabilistic outcomes</strong>. You must learn to verify rather than create. You must treat the AI not as an oracle, but as a brilliant, incredibly fast, yet occasionally distracted intern.
                    </p>

                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 mb-8 backdrop-blur-sm">
                        <h4 className="text-center font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">The Skill Stack for 2025</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded text-center">
                                <Globe className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                                <span className="block text-xs font-bold text-white mb-1">INTENT DESIGN</span>
                                <span className="text-[10px] text-slate-400">Defining "what" to build.</span>
                            </div>
                            <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded text-center">
                                <Shield className="w-6 h-6 mx-auto text-purple-400 mb-2" />
                                <span className="block text-xs font-bold text-white mb-1">VERIFICATION</span>
                                <span className="text-[10px] text-slate-400">Checking the AI's math/code.</span>
                            </div>
                            <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded text-center">
                                <Layers className="w-6 h-6 mx-auto text-emerald-400 mb-2" />
                                <span className="block text-xs font-bold text-white mb-1">COMPOSITION</span>
                                <span className="text-[10px] text-slate-400">Stitching models together.</span>
                            </div>
                            <div className="p-4 bg-rose-900/10 border border-rose-500/20 rounded text-center">
                                <Zap className="w-6 h-6 mx-auto text-rose-400 mb-2" />
                                <span className="block text-xs font-bold text-white mb-1">ITERATION</span>
                                <span className="text-[10px] text-slate-400">Failing fast with prototypes.</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-300 text-lg leading-relaxed">
                        As Andrej Karpathy concludes, the barrier to creation has never been lower. Whether you are building a startup, learning a language, or writing a book, the LLM is your force-multiplier. The future belongs to those who learn to dance with the tokens.
                    </p>
                </section>

            </main>

            <ProjectNavigation currentId="karpathy-deep-dive" />

            <footer className="py-12 border-t border-slate-800 bg-[#020617] text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">AK // DEEP DIVE</span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8 mb-8">
                        <a href="https://www.youtube.com/watch?v=EWvNQjAaOHw" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-red-950/20 border border-red-900/50 text-red-400 font-bold hover:bg-red-900/30 hover:text-red-300 transition-all hover:-translate-y-1">
                            <span>Watch lecture on YouTube</span> <div className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded ml-1">▶</div>
                        </a>
                    </div>

                    <p className="text-slate-600 text-xs mt-2">
                        Adapted from "The Professional Guide to LLMs"
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default KarpathyDeepDivePage;
