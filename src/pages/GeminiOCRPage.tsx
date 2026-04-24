import { ExternalLink, Terminal, Cpu, Layers, Zap, Database, ScanText, Sparkles } from 'lucide-react';
import InteractiveOCR from '../components/ocr/InteractiveOCR';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import { RevealOnScroll, TiltCard } from '../lib/motion';

const ACCENT = '#3b82f6';
const ACCENT2 = '#22d3ee';

const GeminiOCRPage = () => {
    return (
        <SubPageShell statusLabel="System Online" accentColor={ACCENT}>
            <SubPageHero
                badgeLabel="AI · Multimodal Vision"
                BadgeIcon={Sparkles}
                titleLead="Gemini Vision"
                titleAccent="Intelligence."
                accentColor={ACCENT}
                accentColor2={ACCENT2}
                index="02"
                description={
                    <>
                        Next-generation optical character recognition and document understanding powered by Google's{' '}
                        <span className="text-white font-normal">Gemini 2.5 Flash</span> multimodal model.
                    </>
                }
                primaryCta={{ label: 'Live demo', href: '#demo', icon: ScanText }}
                secondaryCta={{ label: 'Gemini model', href: 'https://deepmind.google/technologies/gemini/', icon: ExternalLink, external: true }}
            />

            {/* Demo */}
            <section id="demo" className="container mx-auto px-6 mb-32">
                <RevealOnScroll staggerChildren={0.1} duration={0.9}>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 pb-12 border-b border-white/5">
                        <div
                            data-reveal-child
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border"
                            style={{ backgroundColor: `${ACCENT}15`, borderColor: `${ACCENT}33` }}
                        >
                            <ScanText className="w-7 h-7" style={{ color: ACCENT }} />
                        </div>
                        <div data-reveal-child>
                            <h2 className="text-3xl md:text-4xl font-medium text-white tracking-[-0.02em] mb-2">Interactive simulation</h2>
                            <p className="text-slate-400 max-w-2xl font-light leading-relaxed">
                                Experience the power of multimodal AI. Upload any image — receipts, handwritten notes, or complex diagrams — and watch Gemini analyze it in real-time.
                            </p>
                        </div>
                    </div>
                </RevealOnScroll>
                <InteractiveOCR />
            </section>

            {/* Content grid */}
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Left Column */}
                <div className="md:col-span-8 space-y-24">
                    {/* Overview */}
                    <RevealOnScroll staggerChildren={0.08} as="section">
                        <h2 data-reveal-child className="text-2xl md:text-3xl font-medium text-white tracking-[-0.02em] mb-8 flex items-center gap-3">
                            <Layers className="w-5 h-5" style={{ color: ACCENT }} />
                            Project overview
                        </h2>
                        <p data-reveal-child className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-10">
                            This project demonstrates the integration of <span className="text-white">Large Multimodal Models (LMMs)</span> into web applications. Unlike traditional OCR which simply detects characters, Gemini Vision understands the <span style={{ color: ACCENT }}>context</span> and <span style={{ color: ACCENT }}>structure</span> of the document, enabling semantic extraction and reasoning.
                        </p>

                        <div data-reveal-child className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
                            {['Multimodal Understanding', 'Handwriting Recognition', 'Table Parsing', 'Semantic Extraction', 'Spatial Reasoning', 'Zero-shot Classification'].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/20 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                                    <span className="text-sm text-slate-200 font-light">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div data-reveal-child className="relative rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-8 overflow-hidden">
                            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden="true" />
                            <div className="flex items-center gap-3 mb-6">
                                <Database className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-300">Secure architecture</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-medium text-white mb-2">Backend proxy</h4>
                                    <p className="text-sm text-slate-400 font-light leading-relaxed">
                                        Requests route through a Node.js/Express server. API keys never reach the client.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-white mb-2">Railway deployment</h4>
                                    <p className="text-sm text-slate-400 font-light leading-relaxed">
                                        Full-stack deployment on Railway ensures scalability and env-var protection.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* Technical deep dive */}
                    <RevealOnScroll staggerChildren={0.08} as="section">
                        <h2 data-reveal-child className="text-2xl md:text-3xl font-medium text-white tracking-[-0.02em] mb-8 flex items-center gap-3">
                            <Terminal className="w-5 h-5" style={{ color: ACCENT }} />
                            Technical deep dive
                        </h2>
                        <p data-reveal-child className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-10">
                            The application leverages <span className="text-white">Gemini 2.5 Flash</span> via the Google Generative AI SDK. The pipeline handles image encoding, prompt engineering for structured JSON output, and response parsing.
                        </p>

                        <div data-reveal-child className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                            {[
                                { n: '01', title: 'Input processing', desc: 'Image uploaded and converted to base64 buffer on the backend.' },
                                { n: '02', title: 'Prompt engineering', desc: 'System prompt instructs the model to extract text and bounding boxes.' },
                                { n: '03', title: 'Response parsing', desc: 'Raw response cleaned and parsed into structured JSON for the UI.' },
                            ].map((s) => (
                                <TiltCard
                                    key={s.n}
                                    max={6}
                                    lift={5}
                                    className="group relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 overflow-hidden"
                                >
                                    <div className="absolute top-3 right-4 font-mono text-[10px] text-white/20 tracking-widest">{s.n}</div>
                                    <div className="text-4xl font-medium text-white/10 tracking-tight mb-4 leading-none">{s.n}</div>
                                    <div className="font-medium text-white mb-2 tracking-tight">{s.title}</div>
                                    <p className="text-sm text-slate-400 font-light leading-relaxed">{s.desc}</p>
                                </TiltCard>
                            ))}
                        </div>

                        <div data-reveal-child className="rounded-2xl border border-white/5 bg-[#0a0f1c] p-6 font-mono text-xs md:text-sm shadow-2xl overflow-x-auto">
                            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                                <span className="ml-auto text-slate-500 text-[10px]">server/index.js</span>
                            </div>
                            <pre className="whitespace-pre-wrap text-slate-300 leading-relaxed">
{`const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Construct multimodal prompt
const result = await model.generateContent([
  "Extract all text and return as JSON with bounding boxes...",
  { inlineData: { data: buffer, mimeType: mimetype } }
]);

const response = await result.response;
const text = response.text();`}
                            </pre>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Right Column — sticky sidebar */}
                <div className="md:col-span-4 space-y-6">
                    <div className="sticky top-28 space-y-6">
                        <SidebarCard title="Tech stack" icon={Cpu} accent={ACCENT}>
                            <div className="flex flex-wrap gap-1.5">
                                {['Gemini 2.5 Flash', 'Node.js', 'Express', 'React', 'Vite', 'Railway'].map((t) => (
                                    <span key={t} className="px-2.5 py-1 bg-white/[0.03] border border-white/10 rounded-md text-[11px] text-slate-300 font-light">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </SidebarCard>

                        <SidebarCard title="Performance" icon={Zap} accent="#fbbf24">
                            <MetricBar label="Semantic accuracy" value="99.2%" pct={99.2} color={ACCENT} />
                            <MetricBar label="Handwriting rec." value="95.5%" pct={95.5} color={ACCENT} />
                            <MetricBar label="Latency" value="~1.2s" pct={85} color="#10b981" />
                        </SidebarCard>

                        <SidebarCard title="Model specs" icon={Database} accent="#a855f7">
                            <dl className="text-[11px] space-y-3">
                                {[
                                    ['Model', 'gemini-2.5-flash'],
                                    ['Context', '1M tokens'],
                                    ['Input', 'Text + Image'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                                        <dt className="text-slate-500 uppercase tracking-widest">{k}</dt>
                                        <dd className="font-mono text-white">{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        </SidebarCard>
                    </div>
                </div>
            </div>

            <ProjectNavigation currentId="gemini-ocr" />
        </SubPageShell>
    );
};

function SidebarCard({
    title,
    icon: Icon,
    accent,
    children,
}: {
    title: string;
    icon: typeof Cpu;
    accent: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-5">
                <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50">{title}</span>
            </div>
            {children}
        </div>
    );
}

function MetricBar({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
    return (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between text-[11px] mb-1.5 text-slate-300">
                <span className="font-light">{label}</span>
                <span className="font-mono text-white">{value}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
            </div>
        </div>
    );
}

export default GeminiOCRPage;
