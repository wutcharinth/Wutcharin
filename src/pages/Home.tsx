import { useEffect } from 'react';
import Lenis from 'lenis';

import Header from '../components/Header';
import Hero from '../components/Hero';
import ExecutiveProfile from '../components/ExecutiveProfile';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import SkillsMarquee from '../components/SkillsMarquee';

const Home = () => {
    useEffect(() => {
        const lenis = new Lenis();

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        }
    }, []);

    return (
        <div className="relative min-h-screen text-black overflow-x-hidden selection:bg-primary selection:text-white">
            <Header />

            <main>
                <Hero />
                <ExecutiveProfile />

                <SkillsMarquee />

                <Projects />
                <Experience />
                <Contact />
            </main>

            <footer className="py-8 text-center text-black text-sm border-t-2 border-black bg-white font-bold uppercase tracking-widest">
                <p>&copy; {new Date().getFullYear()} Wutcharin Thatan. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
