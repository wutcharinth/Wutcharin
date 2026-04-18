import { Brain, PlayCircle, Sparkles } from 'lucide-react';
import AIEvolution from '../components/ai-evolution/AIEvolution';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import { RevealOnScroll } from '../lib/motion';

const ACCENT = '#a78bfa';

const AIEvolutionPage = () => {
    return (
        <SubPageShell statusLabel="Live Data Story" accentColor={ACCENT}>
            <SubPageHero
                badgeLabel="Data Storytelling"
                BadgeIcon={Brain}
                titleLead="The Evolution of"
                titleAccent="Intelligence."
                accentColor={ACCENT}
                accentColor2="#e879f9"
                index="01"
                description={
                    <>
                        Visualizing the exponential rise of Artificial Intelligence — from{' '}
                        <span className="text-white font-normal">parameter explosions</span> to the{' '}
                        <span className="text-white font-normal">context revolution</span>.
                    </>
                }
                primaryCta={{ label: 'Start story', href: '#story', icon: PlayCircle }}
            />

            {/* Main story */}
            <section id="story" className="container mx-auto px-6 mb-32">
                <AIEvolution />
            </section>

            {/* Conclusion */}
            <section className="container mx-auto px-6 mb-20">
                <RevealOnScroll staggerChildren={0.1} duration={0.9}>
                    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-sm p-8 md:p-12 overflow-hidden">
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl" style={{ backgroundColor: ACCENT, opacity: 0.1 }} aria-hidden="true" />
                        <div data-reveal-child className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">Conclusion</span>
                        </div>
                        <h2 data-reveal-child className="text-3xl md:text-4xl font-medium text-white tracking-[-0.02em] mb-8 leading-tight">
                            The singularity horizon.
                        </h2>
                        <div className="grid md:grid-cols-2 gap-10 text-slate-400 leading-relaxed font-light">
                            <p data-reveal-child>
                                The data tells a story of accelerating returns. We are not just building faster computers — we are engineering a new form of cognition. The shift from <span className="text-slate-200">Narrow AI</span> to <span className="text-slate-200">General Purpose Intelligence</span> is happening faster than any forecast predicted.
                            </p>
                            <p data-reveal-child>
                                For businesses and individuals, the implication is simple: <span className="text-slate-200">adaptability is the new IQ</span>. Understanding these trends isn't academic — it's the survival manual for the next decade of human-computer co-evolution.
                            </p>
                        </div>
                    </div>
                </RevealOnScroll>
            </section>

            <ProjectNavigation currentId="ai-evolution" />
        </SubPageShell>
    );
};

export default AIEvolutionPage;
