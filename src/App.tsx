import Background3D from './components/Background3D';
import Header from './components/Header';
import Hero from './components/Hero';
import ExecutiveProfile from './components/ExecutiveProfile';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';

function App() {
  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <Background3D />
      <Header />

      <main>
        <Hero />
        <ExecutiveProfile />
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
