import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowDown,
    Zap,
    GitFork,
    Layout,
    Brain,
    Bot,
    Users
} from 'lucide-react';
import Lenis from 'lenis';
import ProjectFlowDemo from '../components/project-flow/ProjectFlowDemo';
import ProjectNavigation from '../components/ProjectNavigation';

const ProjectFlowPage = () => {
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
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-blue-500 uppercase">System Online</span>
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
                            ProjectFlow <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AI Scrum Master</span>
                        </motion.h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed mb-10 border-l-4 border-blue-500 pl-6">
                            An autonomous project management agent that grooms backlogs, assigns tickets based on developer velocity, and enforces Definition of Done using <span className="text-white font-bold">LangChain</span>.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-2">
                                <Zap className="w-5 h-5" /> Live Simulation
                            </button>
                            <a href="https://github.com/langchain-ai/langchain" target="_blank" rel="noreferrer" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700 flex items-center gap-2">
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
                            <Layout className="w-10 h-10 text-blue-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Backlog Chaos</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Product backlogs often become dumping grounds for vague ideas. ProjectFlow forces clear acceptance criteria before a ticket enters a sprint.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <Users className="w-10 h-10 text-purple-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Uneven Workloads</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Manual assignment leads to burnout. The agent analyzes historical velocity and current capacity to balance the load dynamically.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <Bot className="w-10 h-10 text-cyan-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Scope Creep</h3>
                            <p className="text-slate-400 leading-relaxed">
                                "Just one small change" can derail a sprint. The agent detects scope creep in real-time and triggers a Human-in-the-Loop review.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- Architecture Explanation --- */}
                <section className="container mx-auto px-6 mb-32">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-white">
                                Powered by <span className="text-blue-500">LangChain</span>
                            </h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                ProjectFlow orchestrates multiple LLM tools to manage the software development lifecycle. It connects directly to Jira and GitHub APIs to perform actions autonomously.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/30 transition-colors">
                                        <Brain className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">1. Context Engine</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Analyzes ticket descriptions for ambiguity and completeness. Uses RAG to check against existing documentation.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/30 transition-colors">
                                        <Users className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">2. Load Balancer</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Calculates optimal ticket assignment based on developer skill sets (Frontend/Backend) and current sprint load.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/30 transition-colors">
                                        <Bot className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">3. Jira Action Agent</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Executes the final decision by updating Jira tickets, moving them to sprints, or flagging them for review.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-[100px] opacity-20"></div>
                            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                                <div className="flex gap-2 mb-4 border-b border-slate-800 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="ml-auto text-slate-500">agent_logic.py</span>
                                </div>
                                <pre className="language-python">
                                    {`# Initialize the Agent
tools = [JiraTool(), GitHubTool()]
agent = initialize_agent(
    tools, 
    llm=ChatOpenAI(temperature=0), 
    agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION
)

# Define the Prompt Template
template = """
You are an autonomous Scrum Master.
Your goal is to optimize the sprint backlog.

Current Velocity: {velocity}
Team Capacity: {capacity}

Rules:
1. Reject tickets with ambiguity score > 0.7
2. Assign frontend tasks to Mike, backend to Sarah
3. Do not exceed individual capacity
"""

# Run the Agent
agent.run(template.format(velocity=32, capacity=team_stats))`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Interactive Demo --- */}
                <section id="demo" className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-slate-800 pb-12">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                            <Layout className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Interactive Demo</h2>
                            <p className="text-slate-400 max-w-2xl">
                                Simulate a sprint planning session. Watch the AI groom the backlog, handle scope creep, and auto-close completed tickets.
                            </p>
                        </div>
                    </div>

                    <ProjectFlowDemo />
                </section>

            </main>

            {/* --- Navigation Footer --- */}
            <ProjectNavigation currentId="project-flow" />

            {/* --- Footer --- */}
            <footer className="py-12 border-t border-slate-800 bg-[#020617] text-center">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Wutcharin Thatan. Built with React & LangChain.
                </p>
            </footer>

        </div>
    );
};

export default ProjectFlowPage;
