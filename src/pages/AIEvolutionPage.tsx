import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, PlayCircle, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import AIEvolution from '../components/ai-evolution/AIEvolution';
import ProjectNavigation from '../components/ProjectNavigation';

const AIEvolutionPage = () => {
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
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-violet-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-[#020617]/80 backdrop-blur border-b border-slate-800">
                <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-violet-500 uppercase">Live Data Story</span>
                </div>
            </nav>

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-6 mb-32 relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] -z-10"></div>

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
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <Brain className="w-3 h-3" />
                            Data Storytelling
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                        >
                            The Evolution of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                                Intelligence
                            </span>
                        </motion.h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed mb-10 border-l-4 border-violet-500 pl-6">
                            Visualizing the exponential rise of Artificial Intelligence: From <span className="text-white font-bold">Parameter Explosions</span> to the <span className="text-white font-bold">Context Revolution</span>.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center gap-2">
                                <PlayCircle className="w-5 h-5" /> Start Story
                            </button>
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

                {/* Main Story Content */}
                <section id="story" className="container mx-auto px-6 mb-32">
                    <AIEvolution />
                </section>

                {/* Context / Conclusion */}
                <section className="container mx-auto px-6 mb-20">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-6">The Singularity Horizon</h2>
                        <div className="grid md:grid-cols-2 gap-12 text-slate-400 leading-relaxed">
                            <p>
                                The data tells a story of accelerating returns. We are not just building faster computers; we are engineering a new form of cognition. The shift from "Narrow AI" to "General Purpose Intelligence" is happening faster than any forecast predicted.
                            </p>
                            <p>
                                For businesses and individuals, the implication is simple: Adaptability is the new IQ. Understanding these trends isn't just academic—it's the survival manual for the next decade of human-computer co-evolution.
                            </p>
                        </div>
                    </div>
                </section>

            </main>

            <ProjectNavigation currentId="ai-evolution" />

            <footer className="py-12 border-t border-slate-800 bg-[#020617] text-center">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Wutcharin Thatan. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default AIEvolutionPage;
