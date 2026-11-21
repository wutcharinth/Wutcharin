import { Brain, PlayCircle, Sparkles } from 'lucide-react';
import AIEvolution from '../components/ai-evolution/AIEvolution';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import { DemoStageFrame, SectionHeader } from '../components/shared/ShowcaseBlocks';
import SEO from '../components/SEO';
import { RevealOnScroll } from '../lib/motion';

const ACCENT = '#a78bfa';

const SECTIONS = [
    { id: 'story', label: 'Data story' },
    { id: 'horizon', label: 'Takeaway' },
];

const AIEvolutionPage = () => {
    return (
        <SubPageShell statusLabel="Live Data Story" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="AI Evolution: The Growth of Intelligence in Data"
                description="An interactive data story tracing how AI scales from model parameters and training compute to million-token context windows."
                url="https://wutcharin.com/ai-evolution"
            />
            <SubPageHero
                badgeLabel="Data Storytelling"
                BadgeIcon={Brain}
                titleLead="The Growth of"
                titleAccent="Intelligence."
                accentColor={ACCENT}
                description={
                    <>
                        AI scales on an exponential curve. Explore the progression in data: from{' '}
                        <span className="font-normal text-text-strong">parameter count</span> to{' '}
                        <span className="font-normal text-text-strong">context length</span>.
                    </>
                }
                primaryCta={{ label: 'Start story', href: '#story', icon: PlayCircle }}
            />

            {/* 01 · Main interactive data story */}
            <section id="story" className="mx-auto mb-24 max-w-6xl scroll-mt-24 px-6 md:mb-32 md:px-10">
                <SectionHeader
                    index="01"
                    eyebrow="Interactive telemetry"
                    title="Scaling laws,"
                    accent="visualized."
                    accentColor={ACCENT}
                    lead="Step through parameter density, context windows, and benchmark saturation across generations of frontier models."
                />
                <DemoStageFrame
                    label="Live Data Story · Frontier Scaling"
                    accentColor={ACCENT}
                    badges={['Parameters', 'Context Length', 'Reasoning']}
                >
                    <AIEvolution />
                </DemoStageFrame>
            </section>

            {/* 02 · Conclusion */}
            <section id="horizon" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <RevealOnScroll staggerChildren={0.1} duration={0.85}>
                    <div className="frame-ticks relative overflow-hidden rounded-lg border border-hairline bg-panel/60 p-8 md:p-12">
                        <div data-reveal-child className="mb-6 flex items-center gap-2.5">
                            <Sparkles className="h-4 w-4" style={{ color: ACCENT }} aria-hidden="true" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute">02 · Conclusion</span>
                        </div>
                        <h2
                            data-reveal-child
                            className="mb-8 text-3xl leading-[1.02] tracking-[-0.02em] text-text-strong md:text-5xl"
                        >
                            The singularity{' '}
                            <span className="font-serif font-normal italic" style={{ color: ACCENT }}>
                                horizon.
                            </span>
                        </h2>
                        <div className="grid gap-10 text-base font-light leading-relaxed text-text-mute md:grid-cols-2">
                            <p data-reveal-child>
                                The data tells a story of accelerating returns. We are not merely building faster computers; we are engineering a new
                                layer of cognition. The shift from <span className="font-normal text-text-strong">Narrow AI</span> to{' '}
                                <span className="font-normal text-text-strong">General Purpose Intelligence</span> is unfolding faster than every
                                linear forecast predicted.
                            </p>
                            <p data-reveal-child>
                                For operators and builders, the implication is clear:{' '}
                                <span className="font-normal text-text-strong">adaptability is the new IQ</span>. Understanding these curves is not
                                academic; it is the operating manual for the next decade of human-computer co-evolution.
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
