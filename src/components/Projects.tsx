import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SplitText, RevealOnScroll, ScrambleText } from '../lib/motion';
import { projects, type Project } from '../data/projects';
import { sceneBus } from '../scene/sceneBus';

/**
 * The work index, three acts:
 *   01 — five case studies as full-width editorial rows; attention on a row
 *        morphs the entire background field into that project's formation.
 *   02 — the agent fleet as a console manifest.
 *   03 — the lab: everything else, tight index rows.
 */

const featured = projects
    .filter((p) => p.featured !== undefined)
    .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
const fleet = projects.filter((p) => p.tier === 'agent' && p.featured === undefined);
const lab = projects.filter((p) => p.featured === undefined && p.tier !== 'agent');

/** The chapter's resting scene — restored when attention leaves a row. */
const WORK_SCENE = { formation: 'network', mode: 'full', chaos: 0.16, accent: '#a78bfa' } as const;

function ProjectLink({
    project,
    className,
    children,
    ...handlers
}: {
    project: Project;
    className?: string;
    children: ReactNode;
    onMouseEnter?: () => void;
    onFocus?: () => void;
}) {
    const isExternal = project.link.startsWith('http') || project.link.endsWith('.html');
    if (isExternal) {
        return (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className={className} {...handlers}>
                {children}
            </a>
        );
    }
    return (
        <Link to={project.link} className={className} {...handlers}>
            {children}
        </Link>
    );
}

function ActLabel({ index, title, note }: { index: string; title: string; note: string }) {
    return (
        <RevealOnScroll className="mb-10 mt-24 first:mt-0">
            <div data-reveal-child className="flex items-baseline justify-between gap-6 flex-wrap">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-signal/80">
                    Act {index} / {title}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-strong/30">{note}</span>
            </div>
            <div data-reveal-child className="mt-4 h-px w-full bg-gradient-to-r from-text-strong/20 via-text-strong/5 to-transparent" />
        </RevealOnScroll>
    );
}

/** Act 1 — editorial case-study row. Hover/focus floods the world. */
function CaseStudyRow({ project, index }: { project: Project; index: number }) {
    const takeAttention = () => {
        sceneBus.apply({
            formation: project.formation ?? 'network',
            accent: project.accent,
            chaos: 0.12,
            mode: 'full',
        });
    };

    return (
        <ProjectLink
            project={project}
            onMouseEnter={takeAttention}
            onFocus={takeAttention}
            className="group block border-t border-text-strong/[0.08] py-10 md:py-12 px-2 -mx-2 rounded-lg transition-colors hover:border-text-strong/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-signal/70 focus-visible:bg-panel"
        >
            <div className="grid grid-cols-12 gap-x-6 gap-y-4 items-baseline">
                <span className="col-span-2 md:col-span-1 font-mono text-[10px] md:text-xs text-text-strong/30 tracking-[0.28em] tabular-nums">
                    0{index + 1}
                </span>

                <div className="col-span-10 md:col-span-7">
                    <h3 className="text-3xl md:text-5xl lg:text-6xl tracking-[-0.02em] leading-[0.95] text-text-strong transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                        {project.title}
                    </h3>
                    <p className="mt-3 text-sm md:text-base text-text-strong/45 font-light max-w-xl">
                        {project.tagline ?? project.desc}
                    </p>
                    <span
                        aria-hidden="true"
                        className="mt-4 block h-px w-24 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                        style={{ backgroundColor: project.accent }}
                    />
                </div>

                <div className="col-span-10 col-start-3 md:col-span-4 md:col-start-9 flex md:flex-col md:items-end justify-between gap-2">
                    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-strong/40">
                        {project.badge ?? project.role}
                    </div>
                    <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.2em] text-text-strong/25 text-right">
                        {project.tags.slice(0, 3).join(' · ')}
                    </div>
                    <ArrowUpRight
                        className="w-5 h-5 text-text-strong/30 transition-all duration-500 group-hover:text-text-strong group-hover:translate-x-1 group-hover:-translate-y-1"
                        aria-hidden="true"
                    />
                </div>
            </div>
        </ProjectLink>
    );
}

/** Act 2 — agent manifest row: infrastructure, not cards. */
function FleetRow({ project }: { project: Project }) {
    return (
        <ProjectLink
            project={project}
            className="group grid grid-cols-12 gap-x-4 items-center border-t border-text-strong/[0.06] py-4 px-2 -mx-2 rounded-lg transition-colors hover:bg-text-strong/[0.025] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-signal/70 focus-visible:bg-text-strong/[0.025]"
        >
            <span className="col-span-1 flex justify-center" aria-hidden="true">
                <span className="relative flex h-1.5 w-1.5">
                    <span
                        className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping [animation-duration:2.4s]"
                        style={{ backgroundColor: project.accent }}
                    />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.accent }} />
                </span>
            </span>
            <span className="col-span-7 sm:col-span-4 font-mono text-xs md:text-sm text-text-strong/85 tracking-tight group-hover:text-text-strong">
                {project.navTitle ?? project.title}
            </span>
            <span className="hidden sm:block sm:col-span-4 font-mono text-[10px] uppercase tracking-[0.18em] text-text-strong/35 truncate">
                {project.tagline}
            </span>
            <span className="col-span-3 sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-strong/25 truncate text-right">
                {project.tags[0]}
            </span>
            <span className="col-span-1 flex justify-end">
                <ArrowUpRight className="w-3.5 h-3.5 text-text-strong/25 transition-all group-hover:text-text-strong group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </span>
        </ProjectLink>
    );
}

/** Act 3 — lab index item. */
function LabItem({ project }: { project: Project }) {
    return (
        <ProjectLink
            project={project}
            className="group flex items-baseline justify-between gap-4 border-t border-text-strong/[0.06] py-5 px-2 -mx-2 rounded-lg transition-colors hover:border-text-strong/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-signal/70 focus-visible:bg-panel"
        >
            <div className="min-w-0">
                <ScrambleText
                    text={project.title}
                    onHover
                    className="text-base md:text-lg text-text-strong/85 tracking-tight group-hover:text-text-strong font-medium"
                />
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-text-strong/30 truncate">
                    {project.role}
                </p>
            </div>
            <ArrowUpRight className="w-4 h-4 shrink-0 text-text-strong/25 transition-all group-hover:text-text-strong group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </ProjectLink>
    );
}

export default function Projects() {
    const restoreScene = () => sceneBus.apply(WORK_SCENE);

    return (
        <section id="projects" className="relative py-chapter px-4 overflow-hidden">
            <div className="relative max-w-6xl mx-auto">
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-text-strong/10"
                    >
                        <span className="h-1 w-1 rounded-full bg-violet-400" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-text">03 · Work</span>
                    </motion.div>

                    <SplitText
                        as="h2"
                        mode="words"
                        stagger={0.06}
                        className="text-5xl md:text-7xl lg:text-8xl tracking-[-0.02em] text-text-strong leading-[0.92] block max-w-3xl"
                    >
                        Selected work
                    </SplitText>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-8 max-w-2xl text-base md:text-lg text-text-mute font-light leading-relaxed"
                    >
                        Rapid AI prototypes, often shipped in days, alongside intelligent systems running at enterprise scale.
                        <span className="hidden md:inline text-text-strong/35"> Rest on a case study and the field behind it reorganizes.</span>
                    </motion.p>
                </div>

                {/* Act 1 — case studies */}
                <ActLabel index="01" title="Case studies" note="05 selected" />
                <div onMouseLeave={restoreScene} onBlur={restoreScene} className="border-b border-text-strong/[0.08]">
                    {featured.map((p, i) => (
                        <CaseStudyRow key={p.id} project={p} index={i} />
                    ))}
                </div>

                {/* Act 2 — agent fleet manifest */}
                <ActLabel index="02" title="Agent fleet" note={`${String(fleet.length).padStart(2, '0')} in production`} />
                <div className="border-b border-text-strong/[0.06]">
                    {fleet.map((p) => (
                        <FleetRow key={p.id} project={p} />
                    ))}
                </div>

                {/* Act 3 — the lab */}
                <ActLabel index="03" title="Lab" note={`${String(lab.length).padStart(2, '0')} experiments`} />
                <div className="grid md:grid-cols-2 gap-x-12 border-b border-text-strong/[0.06]">
                    {lab.map((p) => (
                        <LabItem key={p.id} project={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
