import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowDown,
    Zap,
    GitFork,
    MessageSquare,
    Brain,
    Store,
    TrendingUp
} from 'lucide-react';
import Lenis from 'lenis';
import ReviewFlowDemo from '../components/review-flow/ReviewFlowDemo';
import ProjectNavigation from '../components/ProjectNavigation';

const ReviewFlowPage = () => {
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
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-amber-500 selection:text-white">

            {/* --- Navigation --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-[#020617]/80 backdrop-blur border-b border-slate-800">
                <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-amber-500 uppercase">System Online</span>
                </div>
            </nav>

            <main className="pt-32 pb-20">

                {/* --- Hero Section --- */}
                <section className="container mx-auto px-6 mb-32 relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] -z-10"></div>

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
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            Interactive Simulation
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                        >
                            ReviewFlow <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Reputation Engine</span>
                        </motion.h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed mb-10 border-l-4 border-amber-500 pl-6">
                            An autonomous agent that turns customer feedback into operational action. It monitors reviews, analyzes sentiment, and triggers real-time workflows for staff and kitchen teams.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center gap-2">
                                <Zap className="w-5 h-5" /> Live Simulation
                            </button>
                            <a href="#" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700 flex items-center gap-2">
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
                            <MessageSquare className="w-10 h-10 text-amber-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Feedback Overload</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Restaurants receive hundreds of reviews across platforms. Manually tracking them is impossible, leading to missed opportunities and risks.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <Store className="w-10 h-10 text-orange-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Operational Disconnect</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Reviews often contain critical operational data (e.g., "salty soup") that never reaches the kitchen team in time to fix the issue.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800">
                            <TrendingUp className="w-10 h-10 text-red-500 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-3">Brand Risk</h3>
                            <p className="text-slate-400 leading-relaxed">
                                A single unanswered food safety complaint can go viral. ReviewFlow detects critical risks instantly and escalates them to management.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- Architecture Explanation --- */}
                <section className="container mx-auto px-6 mb-32">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-white">
                                Powered by <span className="text-amber-500">NLP & Automation</span>
                            </h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                ReviewFlow isn't just a dashboard; it's an active agent. It connects to Google/Yelp APIs, uses LLMs for sentiment analysis, and routes actions to the right team members.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/30 transition-colors">
                                        <Brain className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">1. Sentiment Engine</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Classifies reviews not just by stars, but by specific topics (Food Quality, Service, Price, Safety).
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0 group-hover:bg-orange-500/30 transition-colors">
                                        <GitFork className="w-6 h-6 text-orange-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">2. Intelligent Routing</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Directs feedback to the relevant department: "Salty" → Kitchen, "Rude" → Manager, "Expensive" → Marketing.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0 group-hover:bg-red-500/30 transition-colors">
                                        <Zap className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">3. Automated Action</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            Drafts personalized replies for approval, updates staff leaderboards, and triggers SMS alerts for critical risks.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 blur-[100px] opacity-20"></div>
                            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                                <div className="flex gap-2 mb-4 border-b border-slate-800 pb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="ml-auto text-slate-500">router_logic.py</span>
                                </div>
                                <pre className="language-python">
                                    {`# Analyze Sentiment
analysis = llm.analyze(review.text)

if analysis.sentiment == "CRITICAL":
    # Trigger Emergency Workflow
    slack.send(channel="#management", msg=f"ALERT: {review.text}")
    jira.create_ticket(priority="P0", type="Safety")

elif "food" in analysis.topics and analysis.sentiment == "NEGATIVE":
    # Route to Kitchen Display System
    kds.push_alert(dish=analysis.entity, issue=analysis.summary)

elif analysis.sentiment == "POSITIVE" and "service" in analysis.topics:
    # Update Staff Leaderboard
    staff_db.add_points(employee=analysis.entity, points=10)`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- Interactive Demo --- */}
                <section id="demo" className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-slate-800 pb-12">
                        <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                            <Zap className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Interactive Demo</h2>
                            <p className="text-slate-400 max-w-2xl">
                                Simulate the agent processing live reviews. Watch how it handles compliments, food safety risks, and competitor intelligence.
                            </p>
                        </div>
                    </div>

                    <ReviewFlowDemo />
                </section>

            </main>

            {/* --- Navigation Footer --- */}
            <ProjectNavigation currentId="review-flow" />

            {/* --- Footer --- */}
            <footer className="py-12 border-t border-slate-800 bg-[#020617] text-center">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Wutcharin Thatan. Built with React & OpenAI.
                </p>
            </footer>

        </div>
    );
};

export default ReviewFlowPage;
