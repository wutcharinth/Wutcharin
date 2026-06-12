
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
        <section className="py-20 border-t border-slate-800 bg-[#020617]">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                        {currentProject?.tier === 'agent' ? 'Explore Other Agents' : 'More Interactive Insights'}
                    </h2>
                    <Link to="/" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendedProjects.map((project) => (
                        <Link
                            key={project.id}
                            to={project.link}
                            className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-600 transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity" style={{ color: project.accent }}>
                                <project.icon className="w-24 h-24 -mr-4 -mt-4 transform rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div
                                    className="w-10 h-10 rounded-lg border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: `${project.accent}1A`, borderColor: `${project.accent}33` }}
                                >
                                    <project.icon className="w-5 h-5" style={{ color: project.accent }} />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                    {project.navTitle ?? project.title}
                                </h3>
                                <p className="text-sm text-slate-400 font-medium">
                                    {project.tagline}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectNavigation;
