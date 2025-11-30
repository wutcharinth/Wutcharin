import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Terminal, Cpu, Layers, Zap, Database, ScanText, Sparkles } from 'lucide-react';
import Lenis from 'lenis';
import InteractiveOCR from '../components/ocr/InteractiveOCR';

const PaddleOCRPage = () => {
    useEffect(() => {
        const lenis = new Lenis();
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-white font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-bg border-b-4 border-border">
                <Link to="/" className="flex items-center gap-2 text-lg font-bold uppercase tracking-widest hover:text-primary transition-colors group">
                    <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>
            </nav>

            <main className="pt-32 px-6 pb-20 max-w-7xl mx-auto">
                {/* Hero Section */}
                <header className="mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-border bg-white text-sm font-bold mb-6 shadow-[4px_4px_0px_0px_var(--shadow-color)]">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        AI / Multimodal Vision
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                        Gemini Vision <br />
                        <span className="text-primary">
                            Intelligence
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl max-w-2xl font-bold leading-relaxed border-l-4 border-primary pl-6">
                        Next-generation optical character recognition and document understanding powered by Google's Gemini 2.5 Flash multimodal model.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-inverse text-inverse-text border-2 border-transparent hover:bg-bg hover:text-text hover:border-border font-bold transition-all shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px]">
                            <Sparkles size={20} />
                            Gemini Model
                        </a>
                        <button className="flex items-center gap-2 px-6 py-3 bg-bg text-text border-2 border-border font-bold hover:bg-primary hover:text-white transition-all shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:shadow-[2px_2px_0px_0px_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px]">
                            <ExternalLink size={20} />
                            Live Demo Below
                        </button>
                    </div>
                </header>

                {/* Interactive Demo Section */}
                <section className="mb-24">
                    <div className="flex items-center gap-3 mb-8 border-b-4 border-border pb-4">
                        <ScanText className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold uppercase tracking-tight">Interactive Simulation</h2>
                    </div>
                    <p className="text-lg font-medium mb-8 max-w-3xl">
                        Experience the power of multimodal AI. Upload any image—receipts, handwritten notes, or complex diagrams—and watch Gemini analyze it in real-time.
                    </p>
                    <InteractiveOCR />
                </section>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Left Column - Details */}
                    <div className="md:col-span-8 space-y-16">

                        {/* Overview */}
                        <section>
                            <h2 className="text-3xl font-bold uppercase tracking-tight mb-6 flex items-center gap-3 border-b-4 border-border pb-2">
                                <Layers className="text-primary" />
                                Project Overview
                            </h2>
                            <p className="text-lg font-medium leading-relaxed mb-6">
                                This project demonstrates the integration of <strong>Large Multimodal Models (LMMs)</strong> into web applications.
                                Unlike traditional OCR which simply detects characters, Gemini Vision understands the <em>context</em> and <em>structure</em> of the document, allowing for semantic extraction and reasoning.
                            </p>
                            <div className="bg-bg p-6 border-2 border-border shadow-[8px_8px_0px_0px_var(--shadow-color)]">
                                <h3 className="font-bold mb-4 uppercase tracking-wider border-b-2 border-border pb-2 inline-block">Key Capabilities</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {['Multimodal Understanding', 'Handwriting Recognition', 'Table Parsing', 'Semantic Extraction', 'Spatial Reasoning', 'Zero-shot Classification'].map((item) => (
                                        <li key={item} className="flex items-center gap-2 font-bold">
                                            <div className="w-2 h-2 bg-primary"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Architecture Advantages */}
                            <div className="mt-8 bg-gray-900 p-6 border-l-4 border-green-500 shadow-lg">
                                <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                                    <Database size={20} />
                                    SECURE ARCHITECTURE
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <h4 className="font-bold text-white mb-1">BACKEND PROXY</h4>
                                        <p className="text-gray-400">Requests are routed through a secure Node.js/Express server. API keys are never exposed to the client.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">RAILWAY DEPLOYMENT</h4>
                                        <p className="text-gray-400">Full-stack deployment on Railway ensures scalability and environment variable protection.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* Technical Implementation */}
                        <section>
                            <h2 className="text-3xl font-bold uppercase tracking-tight mb-6 flex items-center gap-3 border-b-4 border-border pb-2">
                                <Terminal className="text-primary" />
                                Technical Deep Dive
                            </h2>
                            <div className="prose prose-lg max-w-none text-text">
                                <p className="font-medium">
                                    The application leverages the <strong>Gemini 2.5 Flash</strong> model via the Google Generative AI SDK.
                                    The pipeline handles image encoding, prompt engineering for structured JSON output, and response parsing.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                                    <div className="p-4 bg-white border-2 border-border shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:-translate-y-1 transition-transform">
                                        <div className="font-black text-xl mb-2">1. Input</div>
                                        <p className="text-sm font-medium">Image is uploaded and converted to base64 buffer on the backend.</p>
                                    </div>
                                    <div className="p-4 bg-white border-2 border-border shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:-translate-y-1 transition-transform">
                                        <div className="font-black text-xl mb-2">2. Prompting</div>
                                        <p className="text-sm font-medium">System prompt instructs the model to extract text and estimate bounding boxes.</p>
                                    </div>
                                    <div className="p-4 bg-white border-2 border-border shadow-[4px_4px_0px_0px_var(--shadow-color)] hover:-translate-y-1 transition-transform">
                                        <div className="font-black text-xl mb-2">3. Parsing</div>
                                        <p className="text-sm font-medium">Raw text response is cleaned and parsed into structured JSON for the UI.</p>
                                    </div>
                                </div>

                                <div className="mockup-code bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto font-mono text-sm my-6 shadow-xl">
                                    <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span className="ml-2 text-gray-500">server/index.js</span>
                                    </div>
                                    <pre><code><span className="text-pink-400">const</span> model = genAI.getGenerativeModel({`{ model: `}<span className="text-green-400">'gemini-2.5-flash'</span>{` }`});</code></pre>
                                    <pre><code></code></pre>
                                    <pre><code><span className="text-gray-500">// Construct multimodal prompt</span></code></pre>
                                    <pre><code><span className="text-pink-400">const</span> result = <span className="text-pink-400">await</span> model.generateContent([</code></pre>
                                    <pre><code>  <span className="text-green-400">"Extract all text and return as JSON with bounding boxes..."</span>,</code></pre>
                                    <pre><code>  {`{ inlineData: { data: buffer, mimeType: mimetype } }`}</code></pre>
                                    <pre><code>]);</code></pre>
                                    <pre><code></code></pre>
                                    <pre><code><span className="text-gray-500">// Parse response</span></code></pre>
                                    <pre><code><span className="text-pink-400">const</span> response = <span className="text-pink-400">await</span> result.response;</code></pre>
                                    <pre><code><span className="text-pink-400">const</span> text = response.text();</code></pre>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="md:col-span-4 space-y-8">
                        <div className="sticky top-32">
                            <div className="p-6 bg-inverse text-inverse-text border-2 border-border shadow-[8px_8px_0px_0px_var(--shadow-color)]">
                                <h3 className="text-xl font-black mb-4 flex items-center gap-2 uppercase tracking-tighter">
                                    <Cpu size={24} />
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Gemini 2.5 Flash', 'Node.js', 'Express', 'React', 'Vite', 'Railway'].map((tag) => (
                                        <span key={tag} className="px-3 py-1 bg-bg text-text border-2 border-transparent hover:border-white font-bold text-sm transition-colors cursor-default">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-bg border-2 border-border shadow-[8px_8px_0px_0px_var(--shadow-color)]">
                                <h3 className="text-xl font-black mb-4 flex items-center gap-2 uppercase tracking-tighter">
                                    <Zap size={24} className="text-primary" />
                                    Performance
                                </h3>
                                <div className="space-y-6 mt-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1 font-bold">
                                            <span>Semantic Accuracy</span>
                                            <span>99.2%</span>
                                        </div>
                                        <div className="w-full bg-white border-2 border-border h-4">
                                            <div className="bg-primary h-full" style={{ width: '99.2%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1 font-bold">
                                            <span>Handwriting Rec.</span>
                                            <span>95.5%</span>
                                        </div>
                                        <div className="w-full bg-white border-2 border-border h-4">
                                            <div className="bg-primary h-full" style={{ width: '95.5%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1 font-bold">
                                            <span>Latency</span>
                                            <span>~1.2s</span>
                                        </div>
                                        <div className="w-full bg-white border-2 border-border h-4">
                                            <div className="bg-black h-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white border-2 border-border shadow-[8px_8px_0px_0px_var(--shadow-color)]">
                                <h3 className="text-xl font-black mb-4 flex items-center gap-2 uppercase tracking-tighter">
                                    <Database size={24} className="text-primary" />
                                    Model Specs
                                </h3>
                                <ul className="space-y-3 text-sm font-bold">
                                    <li className="flex justify-between border-b border-border pb-2">
                                        <span className="opacity-70">Model</span>
                                        <span className="font-mono">gemini-2.5-flash</span>
                                    </li>
                                    <li className="flex justify-between border-b border-border pb-2">
                                        <span className="opacity-70">Context Window</span>
                                        <span className="font-mono">1M Tokens</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="opacity-70">Input</span>
                                        <span className="font-mono">Text + Image</span>
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-text text-sm border-t-4 border-border bg-bg font-bold uppercase tracking-widest">
                <p>&copy; {new Date().getFullYear()} Wutcharin Thatan. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PaddleOCRPage;
