import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowLeft, FileText, Sparkles, Download, Layout, Wand2, CheckCircle2, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResumeBuilderPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    const features = [
        {
            icon: <Wand2 className="w-8 h-8 text-purple-400" />,
            title: "AI-Powered Writing",
            desc: "Generate professional summaries and bullet points tailored to your job role using advanced LLMs."
        },
        {
            icon: <Layout className="w-8 h-8 text-blue-400" />,
            title: "Smart Templates",
            desc: "Choose from ATS-friendly templates that automatically adjust layout and formatting."
        },
        {
            icon: <Download className="w-8 h-8 text-green-400" />,
            title: "Instant PDF Export",
            desc: "Download high-quality, print-ready PDFs with a single click. No watermarks."
        },
        {
            icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
            title: "Real-time Preview",
            desc: "See changes instantly as you type. What you see is exactly what you get."
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center mix-blend-difference">
                <Link to="/" className="flex items-center gap-2 text-purple-400 font-bold uppercase tracking-widest hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Portfolio
                </Link>
                <div className="text-sm font-mono text-gray-400">PRO RESUME BUILDER // 2024</div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10"></div>
                    {/* Abstract Background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.15),transparent_50%)]"></div>
                </div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">Next-Gen Career Tools</span>
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6 leading-none">
                            Pro <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Resume</span><br />Builder
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light mb-10">
                            Craft the perfect resume in minutes with AI assistance and beautiful, ATS-ready templates.
                        </p>

                        <div className="flex justify-center gap-4">
                            <a
                                href="https://github.com/wutcharinth/Pro-Resume-Builder"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <Github className="w-5 h-5" /> View on GitHub
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-black relative z-10 border-t border-white/10">
                <div className="container mx-auto px-4">
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
                            <FileText className="w-12 h-12 text-purple-400" />
                            Core Features
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gray-900/50 border border-white/10 p-8 rounded-3xl hover:bg-white/5 transition-colors group"
                            >
                                <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-32 bg-black border-t border-white/10">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        <div className="lg:w-1/3">
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Tech Stack</h2>
                            <p className="text-gray-400">
                                Built with modern web technologies for performance, scalability, and developer experience.
                            </p>
                        </div>
                        <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                "React 18", "TypeScript", "Tailwind CSS",
                                "Vite", "OpenAI API", "React-PDF",
                                "Zustand", "Framer Motion", "Radix UI"
                            ].map((tech, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 border border-white/10 rounded-xl bg-white/5">
                                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                                    <span className="font-mono text-sm">{tech}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
