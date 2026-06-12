
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects } from '../data/projects';

// Only routed insight/agent pages take part in cross-navigation — external
// links and static .html artifacts stay out, matching the original hand-kept list.
const navProjects = projects.filter(
    (p) => (p.tier === 'insight' || p.tier === 'agent') && p.link.startsWith('/') && !p.link.endsWith('.html'),
);

interface ProjectNavigationProps {
    currentId: string;
}

const ProjectNavigation = ({ currentId }: ProjectNavigationProps) => {
    const currentProject = navProjects.find(p => p.id === currentId);

    // Recommend projects from the same tier, excluding the current one
    let recommendedProjects = navProjects
        .filter(p => p.id !== currentId && p.tier === currentProject?.tier)
        .slice(0, 3);

    // Fallback: If no tier found (or unusual case), just show first 3 others
    if (recommendedProjects.length === 0) {
        recommendedProjects = navProjects.filter(p => p.id !== currentId).slice(0, 3);
    }

    return (
        <section className="py-20 border-t border-white/[0.06]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-baseline justify-between mb-8 gap-6 flex-wrap">
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-violet-300/80">
                        Next / {currentProject?.tier === 'agent' ? 'Other agents' : 'Other insights'}
                    </span>
                    <Link
                        to="/"
                        className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        Full index <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="border-b border-white/[0.06]">
                    {recommendedProjects.map((project) => (
                        <Link
                            key={project.id}
                            to={project.link}
                            className="group grid grid-cols-12 gap-x-4 items-center border-t border-white/[0.06] py-4 px-2 -mx-2 transition-colors hover:bg-white/[0.025]"
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
                            <span className="col-span-7 sm:col-span-4 font-mono text-xs md:text-sm text-white/85 tracking-tight group-hover:text-white">
                                {project.navTitle ?? project.title}
                            </span>
                            <span className="hidden sm:block sm:col-span-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 truncate">
                                {project.tagline}
                            </span>
                            <span className="col-span-1 flex justify-end">
                                <project.icon className="w-3.5 h-3.5 text-white/25 transition-colors group-hover:text-white" aria-hidden="true" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectNavigation;
