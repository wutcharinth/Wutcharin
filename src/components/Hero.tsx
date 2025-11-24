import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, FileText } from 'lucide-react';

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 pt-32 bg-bg">
            <div className="max-w-7xl mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-[10vw] md:text-[8vw] font-black mb-6 tracking-tighter uppercase leading-[0.8] text-black">
                        Wutcharin<br />
                        <span className="text-primary">Thatan</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="text-3xl md:text-5xl text-white bg-black font-black mb-12 uppercase tracking-widest inline-block px-6 py-2 transform -rotate-2">
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

                    <div className="flex items-center justify-center gap-4 text-black font-black mb-12 uppercase tracking-widest text-xl">
                        <MapPin className="w-8 h-8 text-primary" />
                        <span>Bangkok, Thailand</span>
                    </div>

                    <p className="text-2xl md:text-4xl text-black max-w-5xl mx-auto mb-16 font-black leading-tight uppercase">
                        Transforming businesses through <span className="bg-primary text-white px-2">AI-Powered Automation</span> and <span className="underline decoration-4 decoration-primary underline-offset-4">Intelligent Data</span>.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-8"
                >
                    <a
                        href="#projects"
                        className="px-12 py-5 bg-black text-white text-2xl font-black hover:bg-primary hover:text-white transition-all shadow-[8px_8px_0px_0px_#FF1E1E] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center gap-2 uppercase tracking-widest border-4 border-black"
                    >
                        View Projects <ArrowRight className="w-8 h-8" />
                    </a>
                    <a
                        href="#contact"
                        className="px-12 py-5 bg-white text-black text-2xl font-black hover:bg-black hover:text-white transition-all shadow-[8px_8px_0px_0px_#000000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] uppercase tracking-widest border-4 border-black"
                    >
                        Let's Connect
                    </a>
                    <a
                        href="/Wutcharin_CV.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-12 py-5 bg-primary text-white text-2xl font-black hover:bg-black transition-all shadow-[8px_8px_0px_0px_#000000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] flex items-center gap-2 uppercase tracking-widest border-4 border-black"
                    >
                        <FileText className="w-8 h-8" /> Resume
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-24 flex flex-wrap justify-center gap-4"
                >
                    {['Data Strategy', 'Machine Learning', 'BI Architecture', 'Python & SQL', 'AI Automation', 'Team Leadership'].map((skill, index) => (
                        <span
                            key={index}
                            className="px-6 py-3 bg-white border-4 border-black text-xl font-black text-black hover:bg-primary hover:text-white transition-colors shadow-[4px_4px_0px_0px_#000000] uppercase tracking-tighter transform hover:-rotate-2"
                        >
                            {skill}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
