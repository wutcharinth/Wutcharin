import { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SignalChapter from '../components/SignalChapter';
import ExecutiveProfile from '../components/ExecutiveProfile';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import SkillsMarquee from '../components/SkillsMarquee';

import SEO from '../components/SEO';
import { ScrollTrigger, usePrefersReducedMotion } from '../lib/motion';
import { sceneBus } from '../scene/sceneBus';

/**
 * Scroll chapters: each home section re-organizes the particle world as it
 * enters. The SignalChapter scrubs its own formations; everything below it
 * flips on section boundaries.
 */
const CHAPTERS: Array<[string, Parameters<typeof sceneBus.apply>[0]]> = [
    ['#about', { formation: 'lattice', mode: 'ambient', chaos: 0.12, accent: '#a78bfa' }],
    ['#projects', { formation: 'network', mode: 'full', chaos: 0.16, accent: '#a78bfa' }],
    ['#experience', { formation: 'helix', mode: 'ambient', chaos: 0.1, accent: '#a78bfa' }],
    ['#contact', { formation: 'terminus', mode: 'full', chaos: 0.08, accent: '#a78bfa' }],
];

const Home = () => {
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (reduced) return;
        const triggers = CHAPTERS.map(([selector, config]) =>
            ScrollTrigger.create({
                trigger: selector,
                start: 'top 60%',
                end: 'bottom 60%',
                onEnter: () => sceneBus.apply(config),
                onEnterBack: () => sceneBus.apply(config),
            }),
        );
        return () => triggers.forEach((t) => t.kill());
    }, [reduced]);

    return (
        // Transparent root: the body paints midnight and the scene canvas
        // (z-0) lives between body and this content layer.
        <div className="relative min-h-screen text-slate-200 font-sans selection:bg-violet-500/30">
            <SEO
                title="Executive Leader & AI Innovator"
                description="Wutcharin Thatan is an Executive Leader and Data Strategist specializing in AI Automation, Machine Learning, and Business Intelligence."
            />
            <Header />

            <main id="main-content">
                <Hero />
                <SignalChapter />
                <ExecutiveProfile />

                <SkillsMarquee />

                <Projects />
                <Experience />
                <Contact />
            </main>
        </div>
    );
};

export default Home;
