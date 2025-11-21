import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-20 px-4 relative overflow-hidden">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-dark-lighter to-dark border border-primary/20 rounded-3xl p-12 shadow-[0_0_50px_rgba(6,182,212,0.1)]"
                >
                    <h2 className="text-4xl font-bold mb-6">Let's <span className="text-primary">Connect</span></h2>
                    <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <a
                            href="mailto:wutcharin.th@gmail.com"
                            className="flex items-center gap-3 px-6 py-3 bg-dark border border-gray-700 rounded-xl hover:border-primary hover:text-primary transition-all group"
                        >
                            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>wutcharin.th@gmail.com</span>
                        </a>

                        <a
                            href="https://linkedin.com/in/Wutcharin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-3 bg-[#0077b5]/10 border border-[#0077b5]/20 rounded-xl hover:bg-[#0077b5]/20 text-[#0077b5] transition-all"
                        >
                            <Linkedin className="w-5 h-5" />
                            <span>LinkedIn</span>
                        </a>

                        <a
                            href="https://github.com/wutcharinth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-3 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-800 hover:text-white transition-all"
                        >
                            <Github className="w-5 h-5" />
                            <span>GitHub</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
