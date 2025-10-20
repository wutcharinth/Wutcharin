import React from 'react';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { CogIcon } from './icons/CogIcon';

const highlights = [
    {
        icon: <BrainCircuitIcon />,
        title: "AI-Powered Automation",
        text: "Implemented n8n workflows and LLM-based solutions reducing manual processes by 60% and accelerating decision-making."
    },
    {
        icon: <CogIcon />,
        title: "End-to-End Analytics Platform",
        text: "Deployed 100+ Tableau dashboards and central data warehouse empowering 600+ users with real-time insights."
    },
    {
        icon: <ChartBarIcon />,
        title: "Machine Learning Models",
        text: "Built predictive models for ROI forecasting, churn prediction, and time series analysis driving 15% operational efficiency."
    },
    {
        icon: <DollarSignIcon />,
        title: "Secured 200M THB Funding",
        text: "Led commercial vision and investor pitch deck for aviation startup, successfully raising seed funding."
    },
    {
        icon: <ChartBarIcon />,
        title: "Data-Driven Turnaround",
        text: "Increased aircraft utilization by 15% and boosted cabin factor by +3 p.p. through analytics-driven strategy."
    },
    {
        icon: <UsersIcon />,
        title: "Built Elite Teams",
        text: "Scaled analytics and commercial divisions from zero to 11 professionals, fostering data-first culture."
    }
];


const CareerHighlights: React.FC = () => {
    return (
        <section className="py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-2">Career Highlights</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400 max-w-2xl mx-auto">Key achievements demonstrating impact across AI, automation, and analytics</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {highlights.map((highlight, index) => (
                    <div key={index} className="group relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl border border-gray-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1">
                        {/* Icon with animated background */}
                        <div className="flex items-start gap-4">
                            <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-cyan-500/20 rounded-lg blur-xl group-hover:bg-cyan-500/30 transition-all duration-300"></div>
                                <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-3 rounded-lg border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300">
                                    {React.cloneElement(highlight.icon as React.ReactElement<{ className?: string }>, { className: 'w-7 h-7 text-cyan-400' })}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                    {highlight.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {highlight.text}
                                </p>
                            </div>
                        </div>
                        {/* Decorative corner accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-bl-full"></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CareerHighlights;
