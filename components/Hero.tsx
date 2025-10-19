import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="h-screen flex flex-col justify-center items-center text-center relative bg-gray-900">
            <div 
                className="absolute inset-0 bg-grid-gray-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_50%)]"
                style={{ backgroundSize: '40px 40px' }}
            ></div>
            <div className="relative z-10 p-4">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tighter animate-fade-in-down">
                    Wutcharin Thatan
                </h1>
                <p className="mt-4 text-lg sm:text-2xl text-cyan-400 font-medium tracking-tight animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                    Executive Leader | Data & Analytics
                </p>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <a href="#profile" aria-label="Scroll to main content">
                    <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center items-start p-1 animate-bounce">
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