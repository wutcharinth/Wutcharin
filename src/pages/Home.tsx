import { useEffect } from 'react';
import Lenis from 'lenis';

import Header from '../components/Header';
import Hero from '../components/Hero';
import ExecutiveProfile from '../components/ExecutiveProfile';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import SkillsMarquee from '../components/SkillsMarquee';

import SEO from '../components/SEO';

const Home = () => {
    useEffect(() => {
        // Skip Lenis on touch devices or when the user asks for reduced motion —
        // smooth-scroll libraries can feel sluggish on low-end phones and
        // conflict with native scroll assistance.
        const isTouch = window.matchMedia('(hover: none)').matches;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (isTouch || prefersReduced) return;

        const lenis = new Lenis();
        let raf = 0;
        const tick = (time: number) => {
            lenis.raf(time);
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-violet-500/30">
            <SEO
                title="Executive Leader & AI Innovator"
                description="Wutcharin Thatan is an Executive Leader and Data Strategist specializing in AI Automation, Machine Learning, and Business Intelligence."
            />
            <Header />

            <main id="main-content">
                <Hero />
                <ExecutiveProfile />

                <SkillsMarquee />

                <Projects />
                <Experience />
                <Contact />
            </main>

            <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-800 bg-[#020617]">
                <p>&copy; {new Date().getFullYear()} Wutcharin Thatan. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
