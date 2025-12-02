import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    ArrowLeft,
    AlertTriangle,
    GitFork,
    Database,
    Zap,
    Lock,
    FileSearch,
    ArrowDown
} from 'lucide-react';
import Lenis from 'lenis';
import RiskGuardDemo from '../components/risk-guard/RiskGuardDemo';
import ProjectNavigation from '../components/ProjectNavigation';

const RiskGuardPage = () => {
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
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-rose-500 selection:text-white">

            {/* --- Navigation --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-[#020617]/80 backdrop-blur border-b border-slate-800">
                <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-rose-500 uppercase">System Online</span>
                </div>
            </nav>

            <main className="pt-32 pb-20">

                {/* --- Hero Section --- */}
                <section className="container mx-auto px-6 mb-32 relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[120px] -z-10"></div>

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
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            Interactive Simulation
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                        >
                            RiskGuard <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">AI Agent</span>
                        </motion.h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed mb-10 border-l-4 border-rose-500 pl-6">
                            An intelligent internal audit agent that autonomously validates purchase orders, detects conflicts of interest, and ensures compliance using <span className="text-white font-bold">LangGraph</span>.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] flex items-center gap-2">
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
                            <AlertTriangle className="w-10 h-10 text-rose-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Conflict of Interest</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Hidden relationships between employees and vendors often go undetected manually. RiskGuard cross-references HR and Vendor data instantly.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <Lock className="w-10 h-10 text-amber-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Policy Violations</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Complex procurement policies are hard to enforce consistently. The agent checks every PO against the latest policy documents.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <FileSearch className="w-10 h-10 text-blue-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Audit Fatigue</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Sampling-based audits miss 95% of transactions. RiskGuard audits 100% of transactions in real-time, flagging only high-risk cases.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- ChainGraph Explanation --- */}
                <section className="container mx-auto px-6 mb-32">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-white">
                                Powered by <span className="text-rose-500">ChainGraph</span>
                            </h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                RiskGuard uses a <strong>Cyclic State Graph</strong> to model the internal audit process. It allows for complex reasoning, data fetching, and human-in-the-loop escalation.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0 group-hover:bg-rose-500/30 transition-colors">
                                        <Database className="w-6 h-6 text-rose-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">1. Entity Resolution Node</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Connects to HR and Vendor databases to identify shared addresses, phone numbers, or bank accounts indicating a conflict of interest.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/30 transition-colors">
                                        <ShieldCheck className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">2. Policy Engine Node</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Uses OPA (Open Policy Agent) logic to validate budget limits, authorization levels, and spending categories.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/30 transition-colors">
                                        <GitFork className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">3. Risk Scoring & Routing</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Calculates a composite risk score. Low risk? <strong>Auto-Approve</strong>. High risk? <strong>Escalate to Audit Committee</strong>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-500 blur-[100px] opacity-20"></div>
                            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                                <div className="flex gap-2 mb-4 border-b border-slate-800 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="ml-auto text-slate-500">risk_graph.py</span>
                                </div>
                                <pre className="language-python">
                                    {`# Define the Risk Graph
workflow = StateGraph(AuditState)

# Add Nodes
workflow.add_node("policy_check", policy_node)
workflow.add_node("entity_resolution", entity_node)
workflow.add_node("risk_scoring", scoring_node)

# Add Edges
workflow.add_edge("policy_check", "entity_resolution")
workflow.add_edge("entity_resolution", "risk_scoring")

# Conditional Routing
workflow.add_conditional_edges(
    "risk_scoring",
    router_function,
    {
        "approve": END,
        "escalate": "human_review"
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
                        <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
                            <ShieldCheck className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Interactive Demo</h2>
                            <p className="text-slate-400 max-w-2xl">
                                Simulate a procurement workflow. Switch between roles to see how the agent protects the organization from different perspectives.
                            </p>
                        </div>
                    </div>

                    <RiskGuardDemo />
                </section>

            </main>

            {/* --- Navigation Footer --- */}
            <ProjectNavigation currentId="risk-guard" />

            {/* --- Footer --- */}
            <footer className="py-12 border-t border-slate-800 bg-[#020617] text-center">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Wutcharin Thatan. Built with React & LangGraph.
                </p>
            </footer>

        </div>
    );
};

export default RiskGuardPage;
