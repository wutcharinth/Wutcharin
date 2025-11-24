import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, FileText } from 'lucide-react';

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-20 bg-bg">
            <div className="max-w-7xl mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter uppercase leading-[0.8]">
                        Wutcharin<br />
                        <span className="text-transparent bg-clip-text bg-black text-stroke-2 text-stroke-white">Thatan</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="text-2xl md:text-4xl text-primary font-black mb-8 uppercase tracking-widest border-y-4 border-black py-4 bg-white">
                        <Typewriter
                            options={{
                                strings: ['Executive Leader', 'Data Strategist', 'AI Innovator', 'Tech Visionary'],
                                autoStart: true,
                                loop: true,
                                delay: 50,
                                deleteSpeed: 30,
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-center gap-4 text-black font-bold mb-12 uppercase tracking-widest">
                        <MapPin className="w-6 h-6 text-black" />
                        <span>Bangkok, Thailand</span>
                    </div>

                    <p className="text-xl md:text-3xl text-black max-w-4xl mx-auto mb-12 font-bold leading-tight">
                        TRANSFORMING BUSINESSES THROUGH <span className="bg-primary text-white px-2">AI-POWERED AUTOMATION</span>, ADVANCED ANALYTICS, AND INTELLIGENT DATA SOLUTIONS.
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
                        className="px-10 py-4 bg-black text-white text-xl font-black hover:bg-primary hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center gap-2 uppercase tracking-widest border-4 border-black"
                    >
                        View Projects <ArrowRight className="w-6 h-6" />
                    </a>
                    <a
                        href="#contact"
                        className="px-10 py-4 bg-white text-black text-xl font-black hover:bg-black hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] uppercase tracking-widest border-4 border-black"
                    >
                        Let's Connect
                    </a>
                    <a
                        href="/Wutcharin_CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-10 py-4 bg-secondary text-black text-xl font-black hover:bg-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center gap-2 uppercase tracking-widest border-4 border-black"
                    >
                        <FileText className="w-6 h-6" /> Resume
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-20 flex flex-wrap justify-center gap-4"
                >
                    {['Data Strategy', 'Machine Learning', 'BI Architecture', 'Python & SQL', 'AI Automation', 'Team Leadership'].map((skill, index) => (
                        <span
                            key={index}
                            className="px-6 py-3 bg-white border-4 border-black text-lg font-bold text-black hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-tighter"
                        >
                            {skill}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
