import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';

export default function Contact() {
    return (
        <section id="contact" className="py-20 px-4 relative overflow-hidden bg-white">
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white border-2 border-black p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    <h2 className="text-4xl font-bold mb-6 uppercase tracking-tighter">Let's <span className="text-white bg-black px-2">Connect</span></h2>
                    <p className="text-black text-lg mb-10 max-w-2xl mx-auto font-bold">
                        I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <a
                            href="mailto:wutcharin.th@gmail.com"
                            className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-black hover:bg-black hover:text-white transition-all group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                        >
                            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-bold">wutcharin.th@gmail.com</span>
                        </a>

                        <a
                            href="https://linkedin.com/in/Wutcharin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-black hover:bg-[#0077b5] hover:text-white text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                        >
                            <Linkedin className="w-5 h-5" />
                            <span className="font-bold">LinkedIn</span>
                        </a>

                        <a
                            href="https://github.com/wutcharinth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-black hover:bg-gray-800 hover:text-white text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                        >
                            <Github className="w-5 h-5" />
                            <span className="font-bold">GitHub</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
