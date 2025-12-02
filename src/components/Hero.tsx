import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Download } from 'lucide-react';

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-20">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-7xl mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest mb-8">
                        <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                        Available for Hire
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight text-white">
                        Wutcharin<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Thatan</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="text-2xl md:text-4xl text-slate-400 font-light mb-8 h-12">
                        <Typewriter
                            options={{
                                strings: ['Executive Leader', 'Data Strategist', 'AI Innovator'],
                                autoStart: true,
                                loop: true,
                                delay: 50,
                                deleteSpeed: 30,
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-slate-500 font-mono text-sm mb-12 uppercase tracking-widest">
                        <MapPin className="w-4 h-4 text-violet-500" />
                        <span>Bangkok, Thailand</span>
                    </div>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        Transforming businesses through <span className="text-white font-bold">AI-Powered Automation</span> and <span className="text-white font-bold">Intelligent Data Strategy</span>.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-6"
                >
                    <a
                        href="#projects"
                        className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center gap-2"
                    >
                        View Projects <ArrowRight className="w-5 h-5" />
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full transition-all border border-slate-700 flex items-center gap-2"
                    >
                        Let's Connect
                    </a>
                    <a
                        href="/Wutcharin_CV_2025.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full transition-all border border-slate-700 flex items-center gap-2"
                    >
                        <Download className="w-5 h-5" /> Resume
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-24 flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
                >
                    {['Data Strategy', 'Machine Learning', 'BI Architecture', 'Python & SQL', 'AI Automation', 'Team Leadership'].map((skill, index) => (
                        <span
                            key={index}
                            className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-sm font-medium text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-colors"
                        >
                            {skill}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
