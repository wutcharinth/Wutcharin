import React from 'react';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';

const highlights = [
    {
        icon: <DollarSignIcon />,
        title: "Secured 200M THB",
        text: "in seed funding by authoring the commercial vision and investor pitch deck."
    },
    {
        icon: <ChartBarIcon />,
        title: "Increased Aircraft Utilization by 15%",
        text: "and boosted cabin factor by +3 p.p. in a corporate turnaround."
    },
    {
        icon: <UsersIcon />,
        title: "Empowered 600+ Users",
        text: "by deploying over 100 Tableau dashboards and a central data warehouse."
    },
    {
        icon: <BriefcaseIcon />,
        title: "Built Teams from Zero",
        text: "scaling analytics and commercial divisions of up to 11 professionals."
    }
];


const CareerHighlights: React.FC = () => {
    return (
        <section className="py-16 md:py-24">
            <h2 className="text-3xl font-bold text-white mb-2">Career Highlights</h2>
             <div className="w-20 h-1 bg-cyan-500 mb-10"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {highlights.map((highlight, index) => (
                    <div key={index} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex items-start gap-4 hover:border-cyan-500 transition-colors duration-300">
                        <div className="text-cyan-400 mt-1 flex-shrink-0">
                           {/* FIX: The type of `highlight.icon` was being inferred as a generic JSX.Element, losing its specific prop types. 
                               Casting it to a ReactElement that accepts a className prop allows TypeScript to correctly type-check the props passed to cloneElement. */}
                           {React.cloneElement(highlight.icon as React.ReactElement<{ className?: string }>, { className: 'w-8 h-8' })}
                        </div>
                        <div>
                            <p className="text-gray-300">
                                <span className="font-bold text-white">{highlight.title}</span> {highlight.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CareerHighlights;
