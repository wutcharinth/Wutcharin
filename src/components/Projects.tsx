import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SplitText, RevealOnScroll, TiltCard } from '../lib/motion';
import { projectSections, type Project } from '../data/projects';

const ALL = 'All Projects';

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const isExternal = project.link.startsWith('http') || project.link.endsWith('.html');
    const Icon = project.icon;

    const Inner = (
        <TiltCard max={7} lift={8} className="group relative h-full rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/15 transition-colors p-6 md:p-7 overflow-hidden" data-cursor="view">
            {/* Ambient glow that matches the project accent */}
            <div
                className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                style={{ backgroundColor: project.accent }}
                aria-hidden="true"
            />
            {/* Oversized ghost icon */}
            <div className="pointer-events-none absolute -bottom-6 -right-4 opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-500">
                <Icon className="w-44 h-44" style={{ color: project.accent }} />
            </div>
            {/* Subtle top highlight */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

            <div data-tilt-parallax data-tilt-depth="14" className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <div
                        className="w-11 h-11 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{
                            backgroundColor: `${project.accent}14`,
                            borderColor: `${project.accent}33`,
                        }}
                    >
                        <Icon className="w-5 h-5" style={{ color: project.accent }} />
                    </div>
                    {project.badge ? (
                        <span
                            className="px-2.5 py-1 rounded-md text-[9px] font-mono uppercase tracking-[0.2em] border"
                            style={{
                                color: project.accent,
                                backgroundColor: `${project.accent}14`,
                                borderColor: `${project.accent}33`,
                            }}
                        >
                            {project.badge}
                        </span>
                    ) : (
                        <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                            <span>Open</span>
                            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                    )}
                </div>

                <div className="mb-1 flex items-baseline gap-2">
                    <span className="font-mono text-[10px] text-slate-500">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-lg md:text-xl font-medium text-white tracking-[-0.01em]">{project.title}</h3>
                </div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.28em] mb-5">{project.role}</p>

                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 flex-grow mb-6">
                    {project.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 group-hover:border-white/20 transition-colors"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </TiltCard>
    );

    if (isExternal) {
        return (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                {Inner}
            </a>
        );
    }
    return (
        <Link to={project.link} className="block h-full">
            {Inner}
        </Link>
    );
}

export default function Projects() {
    const categories = useMemo(() => [ALL, ...projectSections.map((s) => s.category)], []);
    const [active, setActive] = useState(ALL);

    const visible = useMemo(() => {
        if (active === ALL) return projectSections;
        return projectSections.filter((s) => s.category === active);
    }, [active]);

    return (
        <section id="projects" className="relative py-32 px-4 overflow-hidden">
            {/* Background grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]"
                aria-hidden="true"
            />

            <div className="relative max-w-7xl mx-auto">
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-white/10"
                    >
                        <span className="h-1 w-1 rounded-full bg-violet-400" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-slate-300">03 · Work</span>
                    </motion.div>

                    <SplitText
                        as="h2"
                        mode="words"
                        stagger={0.06}
                        className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-0.03em] text-white leading-[0.92] block max-w-3xl"
                    >
                        Featured Projects
                    </SplitText>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-8 max-w-2xl text-base md:text-lg text-slate-400 font-light leading-relaxed"
                    >
                        Rapid AI prototypes (often shipped in days, not weeks) alongside scalable intelligent systems at enterprise scale.
                    </motion.p>

                    {/* Filter tabs — horizontally scrollable on mobile */}
                    <div className="mt-10 -mx-4 px-4 overflow-x-auto no-scrollbar">
                        <div className="flex gap-2 w-max pb-1">
                            {categories.map((c) => {
                                const isActive = c === active;
                                return (
                                    <button
                                        key={c}
                                        onClick={() => setActive(c)}
                                        className={`relative cursor-hover rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors whitespace-nowrap ${isActive ? 'text-slate-950' : 'text-slate-300 hover:text-white'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="projectFilterPill"
                                                className="absolute inset-0 rounded-full bg-white"
                                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10">{c}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-20"
                    >
                        {visible.map((section, si) => (
                            <div key={section.category}>
                                <RevealOnScroll staggerChildren={0.08} className="mb-10">
                                    <div data-reveal-child className="flex items-baseline gap-4 flex-wrap">
                                        <span className="font-mono text-xs text-violet-300/80 tracking-[0.28em] uppercase">
                                            Cat · 0{si + 1}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-medium text-white tracking-[-0.01em]">
                                            {section.category}
                                        </h3>
                                    </div>
                                    <div data-reveal-child className="mt-2 text-sm md:text-base text-slate-400 font-light max-w-2xl">
                                        {section.description}
                                    </div>
                                    <div data-reveal-child className="mt-4 h-px w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
                                </RevealOnScroll>

                                <RevealOnScroll staggerChildren={0.08} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {section.items.map((p, i) => (
                                        <motion.div
                                            key={p.title}
                                            data-reveal-child
                                            className="h-full"
                                            initial={{ opacity: 0, y: 20, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <ProjectCard project={p} index={i} />
                                        </motion.div>
                                    ))}
                                </RevealOnScroll>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
