import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-20 px-4 relative overflow-hidden bg-bg border-t-4 border-border">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-bg border-4 border-border p-12 shadow-[12px_12px_0px_0px_var(--shadow-color)]"
                >
                    <h2 className="text-6xl font-black mb-8 uppercase tracking-tighter text-text">Let's <span className="text-inverse-text bg-inverse px-4">Connect</span></h2>
                    <p className="text-text text-2xl mb-12 max-w-2xl mx-auto font-bold uppercase leading-tight">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <a
                            href="mailto:wutcharin.th@gmail.com"
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-bg border-4 border-border text-text hover:bg-inverse hover:text-inverse-text transition-all group shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                        >
                            <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span className="font-black text-xl uppercase tracking-widest">Email Me</span>
                        </a>

                        <a
                            href="https://linkedin.com/in/Wutcharin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-primary border-4 border-border hover:bg-bg hover:text-text text-white transition-all shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                        >
                            <Linkedin className="w-6 h-6" />
                            <span className="font-black text-xl uppercase tracking-widest">LinkedIn</span>
                        </a>

                        <a
                            href="https://github.com/wutcharinth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 px-8 py-4 bg-secondary border-4 border-border hover:bg-bg hover:text-text text-inverse-text transition-all shadow-[8px_8px_0px_0px_var(--shadow-color)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                        >
                            <Github className="w-6 h-6" />
                            <span className="font-black text-xl uppercase tracking-widest">GitHub</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
