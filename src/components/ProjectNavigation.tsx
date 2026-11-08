import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';

// Only routed insight/agent pages take part in cross-navigation: external
// links and static .html artifacts stay out.
const navProjects = projects.filter(
    (p) => (p.tier === 'insight' || p.tier === 'agent') && p.link.startsWith('/') && !p.link.endsWith('.html'),
);

interface ProjectNavigationProps {
    currentId: string;
}

/**
 * End of every project page: one large "next case" link (the strongest
 * reason to keep reading), then a short list of related work.
 */
const ProjectNavigation = ({ currentId }: ProjectNavigationProps) => {
    const i = navProjects.findIndex((p) => p.id === currentId);
    const current = navProjects[i];
    const next = navProjects[(i + 1) % navProjects.length];

    let related = navProjects.filter((p) => p.id !== currentId && p.id !== next.id && p.tier === current?.tier).slice(0, 3);
    if (related.length === 0) related = navProjects.filter((p) => p.id !== currentId && p.id !== next.id).slice(0, 3);

    return (
        <section aria-label="More work" className="border-t border-hairline">
            <div className="mx-auto max-w-6xl px-6 md:px-10">
                <Link
                    to={next.link}
                    className="group block py-20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-signal/70 md:py-28"
                    data-cursor="view"
                >
                    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: next.accent }} aria-hidden="true" />
                        Next case
                    </span>
                    <span className="mt-6 flex items-end justify-between gap-6">
                        <span className="min-w-0">
                            <span className="block font-display text-5xl font-semibold leading-[0.92] tracking-[-0.02em] text-text-strong transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-3 md:text-8xl">
                                {next.title}
                            </span>
                            {next.tagline && <span className="mt-4 block font-serif text-xl italic text-text md:text-2xl">{next.tagline}</span>}
                        </span>
                        <ArrowUpRight
                            className="h-10 w-10 shrink-0 text-text-mute transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-text-strong md:h-16 md:w-16"
                            strokeWidth={1}
                            aria-hidden="true"
                        />
                    </span>
                </Link>

                <div className="pb-20">
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-6">
                        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-signal">
                            {current?.tier === 'agent' ? 'More agents' : 'More insights'}
                        </span>
                        <Link
                            to="/#index"
                            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute transition-colors hover:text-text-strong"
                        >
                            All projects <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="border-b border-hairline">
                        {related.map((project) => (
                            <Link
                                key={project.id}
                                to={project.link}
                                className="group -mx-2 grid grid-cols-12 items-center gap-x-4 rounded-md border-t border-hairline px-2 py-4 transition-colors hover:bg-panel"
                            >
                                <span className="col-span-1 flex justify-center" aria-hidden="true">
                                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: project.accent }} />
                                </span>
                                <span className="col-span-9 text-base font-medium tracking-tight text-text-strong sm:col-span-4">
                                    {project.navTitle ?? project.title}
                                </span>
                                <span className="hidden truncate font-mono text-[10px] uppercase tracking-[0.18em] text-text-mute sm:col-span-6 sm:block">
                                    {project.tagline}
                                </span>
                                <span className="col-span-2 flex justify-end sm:col-span-1">
                                    <ArrowUpRight className="h-4 w-4 text-text-mute transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-strong" aria-hidden="true" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectNavigation;
