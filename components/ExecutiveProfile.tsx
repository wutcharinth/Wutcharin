import React from 'react';

const ExecutiveProfile: React.FC = () => {
    return (
        <section className="py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-2">Executive Profile</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-4"></div>
            </div>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">20+</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Years Experience</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">600+</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Users Empowered</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">100+</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Dashboards Built</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-400 mb-1">60%</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Process Reduction</div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="space-y-6">
                <div className="bg-gray-800/30 border-l-4 border-cyan-500 p-6 rounded-r-lg">
                    <p className="text-lg text-gray-300 leading-relaxed">
                        I am a data-driven executive who architects analytics functions as revenue-generating engines for the business. With a <span className="font-semibold text-cyan-400">20-year career</span> spanning high-stakes turnarounds in aviation to hyper-growth in travel tech, I specialize in building elite teams, deploying scalable data platforms, and translating complex insights into decisive C-suite strategies.
                    </p>
                </div>
                <div className="bg-gray-800/30 border-l-4 border-blue-500 p-6 rounded-r-lg">
                    <p className="text-lg text-gray-300 leading-relaxed">
                        My experience spans both <span className="font-semibold text-cyan-400">international tech companies</span> and organizations undergoing digital transformation. This diverse background enables me to understand different corporate cultures, adapt to varying business needs, and connect with people across all levels of organizations. I bring a unique perspective that bridges innovation-driven tech environments with traditional businesses embracing change, ensuring data strategies that resonate with every stakeholder.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ExecutiveProfile;
