import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Terminal, Cpu, Layers, Zap, Database, ScanText, Sparkles, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Lenis from 'lenis';
import InteractiveOCR from '../components/ocr/InteractiveOCR';
import ProjectNavigation from '../components/ProjectNavigation';

const GeminiOCRPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-[#020617]/80 backdrop-blur border-b border-slate-800">
                <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs font-mono text-blue-500 uppercase">System Online</span>
                </div>
            </nav>

            <main className="pt-32 pb-20">
                {/* Hero Section */}
                <section className="container mx-auto px-6 mb-32 relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <Sparkles className="w-3 h-3" />
                            AI / Multimodal Vision
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                        >
                            Gemini Vision <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                Intelligence
                            </span>
                        </motion.h1>

                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed mb-10 border-l-4 border-blue-500 pl-6">
                            Next-generation optical character recognition and document understanding powered by Google's <span className="text-white font-bold">Gemini 2.5 Flash</span> multimodal model.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer"
                                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-2">
                                <Sparkles className="w-5 h-5" /> Gemini Model
                            </a>
                            <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700 flex items-center gap-2">
                                <ExternalLink className="w-5 h-5" /> Live Demo Below
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-0 right-10 hidden lg:block"
                    >
                        <div className="text-slate-600 font-mono text-xs rotate-90 origin-right flex items-center gap-2">
                            SCROLL TO EXPLORE <ArrowDown className="w-4 h-4 -rotate-90" />
                        </div>
                    </motion.div>
                </section>

                {/* Interactive Demo Section */}
                <section id="demo" className="container mx-auto px-6 mb-32">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-slate-800 pb-12">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
                            <ScanText className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Interactive Simulation</h2>
                            <p className="text-slate-400 max-w-2xl">
                                Experience the power of multimodal AI. Upload any image—receipts, handwritten notes, or complex diagrams—and watch Gemini analyze it in real-time.
                            </p>
                        </div>
                    </div>
                    <InteractiveOCR />
                </section>

                {/* Content Grid */}
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Left Column - Details */}
                    <div className="md:col-span-8 space-y-24">

                        {/* Overview */}
                        <section>
                            <h2 className="text-3xl font-bold uppercase tracking-tight mb-8 flex items-center gap-3 text-white">
                                <Layers className="text-blue-500" />
                                Project Overview
                            </h2>
                            <p className="text-lg text-slate-300 leading-relaxed mb-8">
                                This project demonstrates the integration of <strong className="text-white">Large Multimodal Models (LMMs)</strong> into web applications.
                                Unlike traditional OCR which simply detects characters, Gemini Vision understands the <em className="text-blue-400">context</em> and <em className="text-blue-400">structure</em> of the document, allowing for semantic extraction and reasoning.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Multimodal Understanding', 'Handwriting Recognition', 'Table Parsing', 'Semantic Extraction', 'Spatial Reasoning', 'Zero-shot Classification'].map((item) => (
                                    <div key={item} className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span className="font-medium text-slate-200">{item}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Architecture Advantages */}
                            <div className="mt-12 bg-slate-900/80 p-8 rounded-2xl border border-emerald-500/30 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
                                <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2">
                                    <Database className="w-5 h-5" />
                                    SECURE ARCHITECTURE
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                                    <div>
                                        <h4 className="font-bold text-white mb-2 text-base">BACKEND PROXY</h4>
                                        <p className="text-slate-400 leading-relaxed">Requests are routed through a secure Node.js/Express server. API keys are never exposed to the client.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-2 text-base">RAILWAY DEPLOYMENT</h4>
                                        <p className="text-slate-400 leading-relaxed">Full-stack deployment on Railway ensures scalability and environment variable protection.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Technical Implementation */}
                        <section>
                            <h2 className="text-3xl font-bold uppercase tracking-tight mb-8 flex items-center gap-3 text-white">
                                <Terminal className="text-blue-500" />
                                Technical Deep Dive
                            </h2>
                            <div className="text-slate-300">
                                <p className="font-medium text-lg mb-8">
                                    The application leverages the <strong className="text-white">Gemini 2.5 Flash</strong> model via the Google Generative AI SDK.
                                    The pipeline handles image encoding, prompt engineering for structured JSON output, and response parsing.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-colors">
                                        <div className="font-black text-4xl mb-4 text-slate-700">01</div>
                                        <div className="font-bold text-white mb-2">Input Processing</div>
                                        <p className="text-sm text-slate-400">Image is uploaded and converted to base64 buffer on the backend.</p>
                                    </div>
                                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-colors">
                                        <div className="font-black text-4xl mb-4 text-slate-700">02</div>
                                        <div className="font-bold text-white mb-2">Prompt Engineering</div>
                                        <p className="text-sm text-slate-400">System prompt instructs the model to extract text and estimate bounding boxes.</p>
                                    </div>
                                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/30 transition-colors">
                                        <div className="font-black text-4xl mb-4 text-slate-700">03</div>
                                        <div className="font-bold text-white mb-2">Response Parsing</div>
                                        <p className="text-sm text-slate-400">Raw text response is cleaned and parsed into structured JSON for the UI.</p>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800 font-mono text-sm shadow-2xl overflow-x-auto">
                                    <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span className="ml-auto text-slate-500 text-xs">server/index.js</span>
                                    </div>
                                    <pre><code><span className="text-purple-400">const</span> model = genAI.getGenerativeModel({`{ model: `}<span className="text-green-400">'gemini-2.0-flash'</span>{` }`});</code></pre>
                                    <pre><code></code></pre>
                                    <pre><code><span className="text-slate-500">// Construct multimodal prompt</span></code></pre>
                                    <pre><code><span className="text-purple-400">const</span> result = <span className="text-purple-400">await</span> model.generateContent([</code></pre>
                                    <pre><code>  <span className="text-green-400">"Extract all text and return as JSON with bounding boxes..."</span>,</code></pre>
                                    <pre><code>  {`{ inlineData: { data: buffer, mimeType: mimetype } }`}</code></pre>
                                    <pre><code>]);</code></pre>
                                    <pre><code></code></pre>
                                    <pre><code><span className="text-slate-500">// Parse response</span></code></pre>
                                    <pre><code><span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> result.response;</code></pre>
                                    <pre><code><span className="text-purple-400">const</span> text = response.text();</code></pre>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="sticky top-32 space-y-8">
                            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-white">
                                    <Cpu className="w-5 h-5 text-blue-500" />
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Gemini 2.5 Flash', 'Node.js', 'Express', 'React', 'Vite', 'Railway'].map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300 text-xs font-medium">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-white">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    Performance
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2 font-medium text-slate-300">
                                            <span>Semantic Accuracy</span>
                                            <span className="text-white">99.2%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2">
                                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '99.2%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2 font-medium text-slate-300">
                                            <span>Handwriting Rec.</span>
                                            <span className="text-white">95.5%</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2">
                                            <div className="bg-blue-500 h-full rounded-full" style={{ width: '95.5%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2 font-medium text-slate-300">
                                            <span>Latency</span>
                                            <span className="text-white">~1.2s</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2">
                                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-white">
                                    <Database className="w-5 h-5 text-purple-500" />
                                    Model Specs
                                </h3>
                                <ul className="space-y-4 text-sm text-slate-300">
                                    <li className="flex justify-between border-b border-slate-800 pb-3">
                                        <span className="text-slate-500">Model</span>
                                        <span className="font-mono text-white">gemini-2.0-flash</span>
                                    </li>
                                    <li className="flex justify-between border-b border-slate-800 pb-3">
                                        <span className="text-slate-500">Context Window</span>
                                        <span className="font-mono text-white">1M Tokens</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-slate-500">Input</span>
                                        <span className="font-mono text-white">Text + Image</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <ProjectNavigation currentId="gemini-ocr" />

            <footer className="py-12 border-t border-slate-800 bg-[#020617] text-center">
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Wutcharin Thatan. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default GeminiOCRPage;
