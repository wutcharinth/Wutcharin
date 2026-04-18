import { Mail, Linkedin, Github, ArrowRight } from 'lucide-react';
import { SplitText, MagneticButton, RevealOnScroll } from '../lib/motion';

export default function Contact() {
    return (
        <section id="contact" className="relative py-32 px-4 overflow-hidden">
            {/* Aurora wash */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/30 to-slate-950" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[50rem] w-[50rem] rounded-full bg-violet-600/15 blur-[140px] animate-aurora" />
                <div className="absolute right-[10%] top-[30%] h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/15 blur-[140px] animate-float-slow" />
                <div className="absolute inset-0 bg-noise opacity-[0.05]" />
            </div>

            <div className="relative max-w-5xl mx-auto text-center">
                <RevealOnScroll staggerChildren={0.1} duration={1}>
                    <div data-reveal-child className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                        <span className="h-1 w-1 rounded-full bg-violet-400" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-300">05 · Connect</span>
                    </div>
                    <div data-reveal-child>
                        <SplitText
                            as="h2"
                            mode="words"
                            stagger={0.07}
                            className="text-5xl md:text-7xl lg:text-[7.5rem] font-medium tracking-[-0.04em] text-white leading-[0.9] block"
                        >
                            Let's build
                        </SplitText>
                        <SplitText
                            as="h2"
                            mode="words"
                            stagger={0.07}
                            delay={0.2}
                            className="text-5xl md:text-7xl lg:text-[7.5rem] font-medium tracking-[-0.04em] leading-[0.9] block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-violet-300 animate-gradient-x"
                        >
                            something together.
                        </SplitText>
                    </div>

                    <p data-reveal-child className="mt-10 mx-auto max-w-xl text-base md:text-lg text-slate-400 font-light leading-relaxed">
                        Open to discussing new projects, bold ideas, and ambitious visions — whether it's an enterprise AI initiative, a startup bet, or a weekend prototype.
                    </p>

                    <div data-reveal-child className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <MagneticButton
                            as="a"
                            href="mailto:wutcharin.th@gmail.com"
                            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-950 font-medium text-sm tracking-wide"
                            data-cursor="email"
                        >
                            <Mail className="w-4 h-4" />
                            <span>Email me</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </MagneticButton>

                        <MagneticButton
                            as="a"
                            href="https://linkedin.com/in/Wutcharin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white font-medium text-sm tracking-wide hover:bg-white/5 transition-colors"
                            data-cursor="linkedin"
                        >
                            <Linkedin className="w-4 h-4" />
                            <span>LinkedIn</span>
                        </MagneticButton>

                        <MagneticButton
                            as="a"
                            href="https://github.com/wutcharinth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white font-medium text-sm tracking-wide hover:bg-white/5 transition-colors"
                            data-cursor="github"
                        >
                            <Github className="w-4 h-4" />
                            <span>GitHub</span>
                        </MagneticButton>
                    </div>

                    {/* Decorative email plate */}
                    <div data-reveal-child className="mt-20 inline-flex items-center gap-3 font-mono text-xs text-slate-500 tracking-widest">
                        <span className="h-px w-12 bg-white/10" />
                        <a
                            href="mailto:wutcharin.th@gmail.com"
                            className="hover:text-white transition-colors"
                            data-cursor="copy"
                        >
                            WUTCHARIN.TH@GMAIL.COM
                        </a>
                        <span className="h-px w-12 bg-white/10" />
                    </div>
                </RevealOnScroll>
            </div>
        </section>
    );
}
