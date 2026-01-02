import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import FishBackground from './FishBackground';

export default function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-4">
            <FishBackground />

            {/* Content - Z-Index 30 to sit above vignette */}
            <div className="relative z-30 max-w-5xl mx-auto w-full text-center">

                {/* Minimal Status Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mb-12 flex justify-center"
                >
                    <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 px-3 py-1.5 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] md:text-xs font-mono text-emerald-400 uppercase tracking-widest">
                            Constantly Evolving
                        </span>
                    </div>
                </motion.div>

                {/* Massive, Clean Typography */}
                <motion.div style={{ y: y1, opacity }} className="mb-16">
                    <h1 className="text-6xl sm:text-8xl md:text-9xl font-medium tracking-tighter text-white leading-none mb-2">
                        Wutcharin
                    </h1>
                    <h1 className="text-6xl sm:text-8xl md:text-9xl font-medium tracking-tighter text-slate-600 leading-none">
                        Thatan
                    </h1>
                </motion.div>

                {/* Minimal Role Descriptor */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 text-slate-400 font-light text-lg md:text-xl tracking-wide mb-16"
                >
                    <span className="text-white">AI</span>
                    <span className="hidden md:inline w-px h-6 bg-slate-800"></span>
                    <span className="text-white">Automation</span>
                    <span className="hidden md:inline w-px h-6 bg-slate-800"></span>
                    <span className="text-white">Analytics</span>
                </motion.div>

                {/* Ultra-Minimal Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex items-center justify-center gap-8"
                >
                    <a
                        href="#projects"
                        className="text-white border-b border-transparent hover:border-white transition-colors pb-1 flex items-center gap-2 group"
                    >
                        Projects <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </a>

                    <a
                        href="/Wutcharin_CV_2025.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-white transition-colors pb-1"
                    >
                        Resume
                    </a>
                </motion.div>

            </div>

            {/* Subtle Scroll Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-slate-800 to-transparent"></div>
            </motion.div>
        </section>
    );
}
