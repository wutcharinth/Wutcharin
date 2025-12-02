import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Receipt,
    ArrowLeft,
    ShieldAlert,
    GitFork,
    Database,
    Zap,
    Lock,
    Cpu,
    ArrowDown
} from 'lucide-react';
import Lenis from 'lenis';
import SlipVerifyDemo from '../components/slip-verify/SlipVerifyDemo';
import ProjectNavigation from '../components/ProjectNavigation';

const SlipVerifyPage = () => {
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
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500 selection:text-white">

            {/* --- Navigation --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-[#020617]/80 backdrop-blur border-b border-slate-800">
                <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-green-500 uppercase">System Online</span>
                </div>
            </nav>

            <main className="pt-32 pb-20">

                {/* --- Hero Section --- */}
                <section className="container mx-auto px-6 mb-32 relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Interactive Simulation
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                        >
                            SlipVerify <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AI Agent</span>
                        </motion.h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed mb-10 border-l-4 border-blue-500 pl-6">
                            An intelligent revenue protection agent that autonomously verifies bank slips, detects fraud, and manages transaction lifecycles using <span className="text-white font-bold">LangGraph</span>.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-2">
                                <Zap className="w-5 h-5" /> Live Simulation
                            </button>
                            <a href="https://github.com/langchain-ai/langgraph" target="_blank" rel="noreferrer" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700 flex items-center gap-2">
                                <GitFork className="w-5 h-5" /> View Architecture
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-0 right-10 hidden lg:block"
                    >
                        <div className="text-slate-600 font-mono text-xs rotate-90 origin-right flex items-center gap-2">
                            SCROLL TO EXPLORE <ArrowDown className="w-4 h-4 -rotate-90" />
                        </div>
                    </motion.div>
                </section>

                {/* --- The Problem Section --- */}
                <section className="container mx-auto px-6 mb-32">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <ShieldAlert className="w-10 h-10 text-red-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">The Fake Slip Epidemic</h3>
                            <p className="text-slate-400 leading-relaxed">
                                E-commerce businesses lose millions to "Slip Plom" (fake transfer slips). Simple regex checks are easily bypassed by modern editing tools.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <Lock className="w-10 h-10 text-yellow-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Replay Attacks</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Fraudsters reuse valid slips across multiple orders. Without a centralized transaction ledger, these duplicates go unnoticed.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <Cpu className="w-10 h-10 text-blue-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Manual Bottlenecks</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Human review is slow and error-prone. Businesses need an automated system that only escalates truly ambiguous cases.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- ChainGraph Explanation --- */}
                <section className="container mx-auto px-6 mb-32">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-white">
                                Powered by <span className="text-blue-500">ChainGraph</span>
                            </h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                Unlike linear chatbots, SlipVerify uses a <strong>Cyclic State Graph</strong>. This allows the agent to loop, retry, and maintain state across complex workflows.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/30 transition-colors">
                                        <Database className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">1. Shared State Memory</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            A persistent JSON object tracks the entire transaction lifecycle. It stores the slip image, extracted data, fraud risk scores, and human review decisions.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/30 transition-colors">
                                        <Cpu className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">2. Specialized Agent Nodes</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Modular functions perform specific tasks:
                                            <br /><span className="text-blue-400">• OCR Node:</span> Extracts amount, date, and sender using Vision AI.
                                            <br /><span className="text-purple-400">• Fraud Node:</span> Checks for duplicate transaction IDs and blacklisted accounts.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0 group-hover:bg-yellow-500/30 transition-colors">
                                        <GitFork className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">3. Intelligent Routing</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Conditional edges decide the next step based on confidence scores. High confidence? <strong>Auto-Approve</strong>. Suspicious? <strong>Escalate to Human</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-[100px] opacity-20"></div>
                            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                                <div className="flex gap-2 mb-4 border-b border-slate-800 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="ml-auto text-slate-500">graph_definition.py</span>
                                </div>
                                <pre className="language-python">
                                    {`# Define the Graph
workflow = StateGraph(PaymentState)

# Add Nodes
workflow.add_node("ocr", ocr_node)
workflow.add_node("fraud_check", fraud_node)
workflow.add_node("human_review", human_node)

# Add Edges
workflow.add_edge("ocr", "fraud_check")

# Conditional Logic
workflow.add_conditional_edges(
    "fraud_check",
    router_function,
    {
        "approve": END,
        "reject": END,
        "flagged": "human_review"
    }
)

app = workflow.compile()`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Interactive Demo --- */}
                <section id="demo" className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-slate-800 pb-12">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                            <Receipt className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Interactive Demo</h2>
                            <p className="text-slate-400 max-w-2xl">
                                Simulate real-world scenarios to see the agent in action. Watch how the data packet travels through the graph and how the agent handles different edge cases.
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4 text-xs font-mono text-slate-500">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Perfect Slip</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-500 rounded-full"></span> Blurry Image (Low Confidence)</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Duplicate Slip (Fraud)</span>
                            </div>
                        </div>
                    </div>

                    <SlipVerifyDemo />
                </section>

            </main>

            {/* --- Navigation Footer --- */}
            <ProjectNavigation currentId="slip-verify" />

            {/* --- Footer --- */}
            <footer className="py-12 border-t border-slate-800 bg-[#020617] text-center">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Wutcharin Thatan. Built with React & LangGraph.
                </p>
            </footer>

        </div>
    );
};

export default SlipVerifyPage;
