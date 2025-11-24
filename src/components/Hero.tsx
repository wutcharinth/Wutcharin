import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, FileText } from 'lucide-react';

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-20">
            <div className="max-w-5xl mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter uppercase">
                        <span className="text-black drop-shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                            Wutcharin Thatan
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="text-2xl md:text-4xl text-primary font-bold mb-4 h-[50px] uppercase tracking-tight">
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
                    <p className="text-xl md:text-2xl text-black font-bold mb-6 border-2 border-black inline-block px-4 py-1 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        AI, Automation and Analytics
                    </p>

                    <div className="flex items-center justify-center gap-2 text-black font-medium mb-8">
                        <MapPin className="w-5 h-5 text-black" />
                        <span>Bangkok, Thailand</span>
                    </div>

                    <p className="text-lg text-black max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                        Transforming businesses through AI-powered automation, advanced analytics,
                        and intelligent data solutions.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-4"
                >
                    <a
                        href="#projects"
                        className="px-8 py-3 bg-primary border-2 border-black text-white font-bold hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center gap-2"
                    >
                        View Projects <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-3 bg-white border-2 border-black text-black font-bold hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                    >
                        Let's Connect
                    </a>
                    <a
                        href="/Wutcharin_CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 bg-secondary border-2 border-black text-black font-bold hover:bg-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center gap-2"
                    >
                        <FileText className="w-4 h-4" /> Resume
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-16 flex flex-wrap justify-center gap-3"
                >
                    {['Data Strategy', 'Machine Learning', 'BI Architecture', 'Python & SQL', 'AI Automation', 'Team Leadership'].map((skill, index) => (
                        <span
                            key={index}
                            className="px-4 py-2 bg-white border-2 border-black text-sm font-bold text-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                            {skill}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
