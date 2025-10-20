import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ExecutiveProfile from './components/ExecutiveProfile';
import CareerHighlights from './components/CareerHighlights';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AnimatedSection from './components/AnimatedSection';
import Hero from './components/Hero';

const App: React.FC = () => {
    const [activeSection, setActiveSection] = useState('profile');
    
    const sectionRefs = {
        profile: useRef<HTMLDivElement>(null),
        highlights: useRef<HTMLDivElement>(null),
        experience: useRef<HTMLDivElement>(null),
        projects: useRef<HTMLDivElement>(null),
        contact: useRef<HTMLDivElement>(null),
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of the viewport
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        const currentRefs = Object.values(sectionRefs)
          .map(ref => ref.current)
          .filter(ref => ref !== null);
        
        currentRefs.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentRefs.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 selection:bg-cyan-500 selection:text-white">
            <Header activeSection={activeSection} />
            <Hero />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                <main>
                    <div id="profile" ref={sectionRefs.profile} className="py-16">
                        <AnimatedSection>
                            <ExecutiveProfile />
                        </AnimatedSection>
                    </div>
                    
                    <div id="highlights" ref={sectionRefs.highlights} className="py-16">
                        <AnimatedSection>
                            <CareerHighlights />
                        </AnimatedSection>
                    </div>

                    <div id="experience" ref={sectionRefs.experience} className="py-16">
                        <AnimatedSection>
                            <Experience />
                        </AnimatedSection>
                    </div>

                    <div id="projects" ref={sectionRefs.projects} className="py-16">
                        <AnimatedSection>
                            <Projects />
                        </AnimatedSection>
                    </div>
                    
                    <div id="contact" ref={sectionRefs.contact} className="py-16">
                        <AnimatedSection>
                            <Contact />
                        </AnimatedSection>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default App;
