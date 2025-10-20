import React from 'react';

const topSkills = [
    "Data Strategy",
    "Machine Learning", 
    "BI Architecture",
    "Python & SQL",
    "Tableau & Power BI",
    "Team Leadership",
    "AI Automation (n8n)",
    "Fast App Prototyping (LLM)"
];

const Hero: React.FC = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center text-center relative bg-gray-900 px-4 py-24">
            <div 
                className="absolute inset-0 bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_50%)]"
                style={{ backgroundSize: '40px 40px' }}
            ></div>
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="mb-8 animate-fade-in-down">
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tighter mb-6">
                        Wutcharin Thatan
                    </h1>
                    <p className="text-2xl sm:text-3xl lg:text-4xl text-cyan-400 font-bold tracking-tight mb-4">
                        Executive Leader
                    </p>
                    <p className="text-xl sm:text-2xl text-gray-300 font-medium mb-3">
                        AI, Automation and Analytics
                    </p>
                    <p className="text-base sm:text-lg text-gray-500 font-medium flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Bangkok, Thailand
                    </p>
                </div>

                <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Transforming businesses through AI-powered automation, advanced analytics, 
                        and intelligent data solutions
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    {topSkills.map((skill) => (
                        <span 
                            key={skill}
                            className="px-4 py-2 bg-gray-800/80 border border-gray-700/50 text-gray-300 text-sm font-medium rounded-full hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-200"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <a href="#profile" aria-label="Scroll to main content">
                    <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center items-start p-1">
                        <div className="w-1 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                </a>
            </div>

            <style>{`
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-up {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down { animation: fade-in-down 1s ease-out forwards; }
                .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
            `}</style>
        </section>
    );
};

export default Hero;