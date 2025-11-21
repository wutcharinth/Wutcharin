import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            <div className="max-w-5xl mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-teal-400 animate-gradient">
                            Wutcharin Thatan
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <h2 className="text-2xl md:text-3xl text-primary font-semibold mb-4">
                        Executive Leader
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 mb-6">
                        AI, Automation and Analytics
                    </p>

                    <div className="flex items-center justify-center gap-2 text-gray-400 mb-8">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span>Bangkok, Thailand</span>
                    </div>

                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
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
                        className="px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-full text-white font-semibold hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-1 flex items-center gap-2"
                    >
                        View Projects <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-3 border border-primary/50 rounded-full text-white font-semibold hover:bg-primary/10 transition-all transform hover:-translate-y-1"
                    >
                        Let's Connect
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
                            className="px-4 py-2 bg-dark-lighter border border-primary/20 rounded-full text-sm text-gray-300 hover:border-primary/50 transition-colors"
                        >
                            {skill}
                        </span>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
