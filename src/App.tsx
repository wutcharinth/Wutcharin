import { useEffect } from 'react';
import Lenis from 'lenis';
import { Canvas } from '@react-three/fiber';
import Background3D from './components/Background3D';
import Header from './components/Header';
import Hero from './components/Hero';
import ExecutiveProfile from './components/ExecutiveProfile';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import SkillsCloud from './components/SkillsCloud';

function App() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden selection:bg-primary/30">
      <Background3D />
      <Header />

      <main>
        <Hero />
        <ExecutiveProfile />

        {/* Skills Cloud Section */}
        <section className="h-[600px] w-full relative flex items-center justify-center bg-dark-lighter/20">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-20">
            <h2 className="text-[10rem] font-bold text-white/5">SKILLS</h2>
          </div>
          <div className="w-full h-full max-w-4xl mx-auto z-10">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 35], fov: 90 }}>
              <fog attach="fog" args={['#202025', 0, 80]} />
              <SkillsCloud />
            </Canvas>
          </div>
        </section>

        <Projects />
        <Experience />
        <Contact />
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-800 bg-dark/50 backdrop-blur-sm">
        <p>&copy; {new Date().getFullYear()} Wutcharin Thatan. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
