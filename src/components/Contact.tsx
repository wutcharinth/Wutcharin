import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-violet-950/20 -z-10"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-slate-900/50 border border-slate-800 p-12 rounded-3xl backdrop-blur-sm"
                >
                    <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tight text-white">
                        Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">Connect</span>
                    </h2>
                    <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <a
                            href="mailto:wutcharin.th@gmail.com"
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-all group"
                        >
                            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform text-violet-400" />
                            <span className="font-bold text-lg">Email Me</span>
                        </a>

                        <a
                            href="https://linkedin.com/in/Wutcharin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-all shadow-lg shadow-blue-500/20"
                        >
                            <Linkedin className="w-5 h-5" />
                            <span className="font-bold text-lg">LinkedIn</span>
                        </a>

                        <a
                            href="https://github.com/wutcharinth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-white rounded-full transition-all"
                        >
                            <Github className="w-5 h-5" />
                            <span className="font-bold text-lg">GitHub</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
