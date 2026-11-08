import { useEffect, useRef } from 'react';
import Header from '../components/Header';
import SEO from '../components/SEO';
import Arrival from '../components/home/Arrival';
import Proof from '../components/home/Proof';
import Principle from '../components/home/Principle';
import Work from '../components/home/Work';
import FlightLog from '../components/home/FlightLog';
import Terminus from '../components/home/Terminus';
import BootLoader from '../components/home/BootLoader';
import { portraitScene } from '../components/home/scenes';
import { useChapterScene } from '../components/home/useChapterScene';
import { useScrollTo } from '../components/home/useScrollTo';
import { ScrollTrigger } from '../lib/motion';

/**
 * Home: six chapters, one particle world that tells the story.
 *   00 Arrival   the field resolves into the person
 *   01 Proof     the field becomes each number
 *   02 Principle the field triages: patterns to code, exceptions to people
 *   03 Work      the field becomes each case study
 *   04 Path      the field draws the career as a flight route
 *   05 Connect   the field converges into the address
 * Each chapter owns its scene; this page only composes them.
 */
const Home = () => {
    const topRef = useRef<HTMLDivElement>(null);
    // Scrolling back up to the top re-resolves the portrait.
    useChapterScene(topRef, portraitScene);
    const scrollTo = useScrollTo();

    // Deep links (/#work from a project page or the console) land on the
    // chapter once pinned sections have measured themselves.
    useEffect(() => {
        const id = window.location.hash.slice(1);
        if (!id) return;
        const t = window.setTimeout(() => {
            ScrollTrigger.refresh();
            scrollTo(`#${id}`, { immediate: true });
        }, 350);
        return () => window.clearTimeout(t);
    }, [scrollTo]);

    return (
        // Transparent root: the body paints midnight and the scene canvas
        // (z-0) lives between body and this content layer.
        <div className="relative min-h-screen font-sans text-text selection:bg-violet-500/30">
            <SEO
                title="Associate Director, FinTech Data & Automation"
                description="Wutcharin Thatan leads FinTech Data & Automation at Agoda: a 12-person Analytics Engineering team, 15,000+ hours automated a year and 20+ AI agents in production."
            />
            <BootLoader />
            <Header />

            <main id="main-content">
                <div ref={topRef}>
                    <Arrival />
                </div>
                <Proof />
                <Principle />
                <Work />
                <FlightLog />
                <Terminus />
            </main>
        </div>
    );
};

export default Home;
