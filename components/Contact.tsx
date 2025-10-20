import React from 'react';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { GithubIcon } from './icons/GithubIcon';
import { MailIcon } from './icons/MailIcon';

const Contact: React.FC = () => {
    return (
        <section className="py-16 md:py-24 text-center">
             <div className="max-w-2xl mx-auto bg-gray-800 [background:radial-gradient(125%_125%_at_50%_10%,#1f2937_40%,#0891b2_100%)] rounded-2xl p-8 sm:p-12 shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-white mb-4">Let's Connect</h2>
                <p className="text-gray-300 mb-8 max-w-md mx-auto">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision.
                </p>
                <a
                    href="https://www.linkedin.com/in/wutcharin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all transform hover:scale-105 duration-300 text-lg mb-8"
                >
                    Message me on LinkedIn
                </a>
                
                {/* Social Links */}
                <div className="flex justify-center gap-6 pt-6 border-t border-gray-700/50">
                    <a
                        href="mailto:wutcharin.th@gmail.com"
                        className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-gray-700 transition-all hover:scale-110"
                        aria-label="Email"
                        title="Email"
                    >
                        <MailIcon className="w-6 h-6" />
                    </a>
                    <a
                        href="https://linkedin.com/in/Wutcharin"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-gray-700 transition-all hover:scale-110"
                        aria-label="LinkedIn"
                        title="LinkedIn"
                    >
                        <LinkedinIcon className="w-6 h-6" />
                    </a>
                    <a
                        href="https://github.com/wutcharinth"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-gray-700 transition-all hover:scale-110"
                        aria-label="GitHub"
                        title="GitHub"
                    >
                        <GithubIcon className="w-6 h-6" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Contact;