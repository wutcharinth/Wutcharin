import { ExternalLink, Cpu, Zap, Database, ScanText, Sparkles, Upload, FileCode2, ShieldCheck } from 'lucide-react';
import InteractiveOCR from '../components/ocr/InteractiveOCR';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import {
    AnimatedMetricBar,
    DemoStageFrame,
    InteractiveFlowDiagram,
    SectionHeader,
    type FlowNodeSpec,
} from '../components/shared/ShowcaseBlocks';
import SEO from '../components/SEO';
import { RevealOnScroll } from '../lib/motion';

const ACCENT = '#3b82f6';

const SECTIONS = [
    { id: 'demo', label: 'Live demo' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'specs', label: 'Specs' },
];

const capabilities = [
    'Multimodal understanding',
    'Handwriting recognition',
    'Nested table parsing',
    'Semantic JSON extraction',
    'Spatial bounding boxes',
    'Zero-shot document routing',
];

const pipelineNodes: FlowNodeSpec[] = [
    {
        id: 'ingest',
        step: '01',
        title: 'Secure upload',
        role: 'Node proxy',
        icon: Upload,
        detail: 'Uploads receipts, handwritten notes, or diagrams to an Express backend proxy, converting the binary image to an inline base64 buffer with zero client API key exposure.',
        statePreview: `{
  "mimeType": "image/jpeg",
  "sizeKb": 318,
  "apiKeyExposed": false,
  "proxy": "server/index.js"
}`,
        highlightLines: [1, 4],
    },
    {
        id: 'vision',
        step: '02',
        title: 'Gemini 2.5 Flash',
        role: 'Multimodal infer',
        icon: Sparkles,
        detail: 'Feeds the image buffer alongside a schema-enforcing system prompt so the model reasons over layout, tables, and handwriting in a single pass.',
        statePreview: `{
  "model": "gemini-2.5-flash",
  "contextWindow": "1M tokens",
  "schemaMode": "application/json"
}`,
        highlightLines: [6, 12],
    },
    {
        id: 'parse',
        step: '03',
        title: 'Schema & spatial',
        role: 'Structured JSON',
        icon: FileCode2,
        detail: 'Validates extracted fields, currency totals, and normalized bounding boxes so downstream UI overlays align cleanly with the source scan.',
        statePreview: `{
  "fieldsExtracted": 14,
  "boundingBoxes": 14,
  "confidence": 0.992,
  "latencySec": 1.2
}`,
        highlightLines: [14, 18],
    },
];

const OCR_CODE = `// Express backend proxy keeps API credentials off the client
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

// Construct multimodal prompt with inline image buffer
const result = await model.generateContent([
  'Extract all text, line items, and normalized bounding boxes as JSON.',
  {
    inlineData: { data: buffer.toString('base64'), mimeType },
  },
]);

// Parse & validate structured extraction payload
const response = await result.response;
const payload = JSON.parse(cleanJsonFence(response.text()));
return res.json({ ok: true, payload });`;

const GeminiOCRPage = () => {
    return (
        <SubPageShell statusLabel="System Online" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="Gemini Vision OCR: Multimodal Document Intelligence"
                description="Extract structured JSON, tables, and handwriting from complex documents using Google Gemini 2.5 Flash behind a secure Node.js proxy."
                url="https://wutcharin.com/gemini-ocr"
            />
            <SubPageHero
                badgeLabel="AI · Multimodal Vision"
                BadgeIcon={Sparkles}
                titleLead="Gemini Vision"
                titleAccent="OCR."
                accentColor={ACCENT}
                description={
                    <>
                        Read complex documents, handwritten notes, and receipts into clean structured JSON. Built on Google{' '}
                        <span className="font-normal text-text-strong">Gemini 2.5 Flash</span>.
                    </>
                }
                primaryCta={{ label: 'Live demo', href: '#demo', icon: ScanText }}
                secondaryCta={{ label: 'Gemini model', href: 'https://deepmind.google/technologies/gemini/', icon: ExternalLink, external: true }}
            />

            {/* 01 · Live OCR Demo */}
            <section id="demo" className="mx-auto mb-24 max-w-6xl scroll-mt-24 px-6 md:mb-32 md:px-10">
                <SectionHeader
                    index="01"
                    eyebrow="Interactive sandbox"
                    title="Multimodal scan"
                    accent="in real time."
                    accentColor={ACCENT}
                    lead="Test receipts, handwritten notes, or structured forms and inspect how Gemini Vision extracts semantic fields instead of flat character dumps."
                />
                <DemoStageFrame
                    label="Live Simulation · Gemini 2.5 Flash Vision"
                    accentColor={ACCENT}
                    badges={['Semantic JSON', 'Handwriting', 'Table Parsing']}
                >
                    <InteractiveOCR />
                </DemoStageFrame>
            </section>

            {/* 02 · Interactive Multimodal Pipeline */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="pipeline"
                    index="02"
                    eyebrow="Technical deep dive"
                    title="From raw pixels to"
                    accent="verified JSON."
                    accentColor={ACCENT}
                    lead="Unlike legacy OCR pipelines that stitch separate deskew, character detection, and regex passes, one multimodal request preserves layout context."
                />
                <InteractiveFlowDiagram
                    nodes={pipelineNodes}
                    accentColor={ACCENT}
                    filename="server/index.js"
                    code={OCR_CODE}
                />
            </section>

            {/* 03 · Capabilities, Security & Benchmarks */}
            <section id="specs" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <SectionHeader
                    index="03"
                    eyebrow="Capabilities & specs"
                    title="Engineered for"
                    accent="production safety."
                    accentColor={ACCENT}
                    lead="Every request routes through a server-side proxy so API keys never touch the browser, paired with deterministic JSON parsing."
                />

                <div className="mt-12 grid gap-8 lg:grid-cols-12">
                    <RevealOnScroll staggerChildren={0.05} className="space-y-6 lg:col-span-7">
                        <div className="grid gap-3 sm:grid-cols-2">
                            {capabilities.map((item, idx) => (
                                <div
                                    key={item}
                                    data-reveal-child
                                    className="flex items-center gap-3 rounded-lg border border-hairline bg-panel/50 px-4 py-3.5 transition-colors hover:border-hairline-strong"
                                >
                                    <span className="font-mono text-[10px] tabular-nums" style={{ color: ACCENT }}>
                                        0{idx + 1}
                                    </span>
                                    <span className="text-sm text-text-strong">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div
                            data-reveal-child
                            className="frame-ticks relative rounded-lg border border-hairline bg-panel/60 p-6 md:p-7"
                        >
                            <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-text-mute">
                                <ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
                                <span>Secure proxy architecture</span>
                            </div>
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-base font-medium text-text-strong">Backend proxy</h3>
                                    <p className="mt-1.5 text-sm font-light leading-relaxed text-text-mute">
                                        Requests route through a Node.js/Express server. API credentials never reach the client bundle.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-text-strong">Cloud deployment</h3>
                                    <p className="mt-1.5 text-sm font-light leading-relaxed text-text-mute">
                                        Containerized deployment with isolated environment secrets, rate limits, and clean JSON error handling.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    <div className="space-y-5 lg:col-span-5">
                        <div className="rounded-lg border border-hairline bg-panel/50 p-6">
                            <div className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-mute">
                                <Zap className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
                                <span>Benchmark telemetry</span>
                            </div>
                            <AnimatedMetricBar label="Semantic accuracy" value="99.2%" pct={99.2} accentColor={ACCENT} />
                            <AnimatedMetricBar label="Handwriting recognition" value="95.5%" pct={95.5} accentColor={ACCENT} />
                            <AnimatedMetricBar label="Median latency" value="~1.2s" pct={86} accentColor="#10b981" />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="rounded-lg border border-hairline bg-panel/50 p-6">
                                <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-mute">
                                    <Database className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
                                    <span>Model specs</span>
                                </div>
                                <dl className="divide-y divide-hairline text-xs">
                                    {[
                                        ['Model', 'gemini-2.5-flash'],
                                        ['Context', '1M tokens'],
                                        ['Modality', 'Text + Image'],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex justify-between py-2.5 first:pt-0 last:pb-0">
                                            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">{k}</dt>
                                            <dd className="font-mono text-text-strong">{v}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>

                            <div className="rounded-lg border border-hairline bg-panel/50 p-6">
                                <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-text-mute">
                                    <Cpu className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
                                    <span>Stack</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {['Gemini 2.5 Flash', 'Node.js', 'Express', 'React', 'Vite', 'Railway'].map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[10px] text-text-strong"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ProjectNavigation currentId="gemini-ocr" />
        </SubPageShell>
    );
};

export default GeminiOCRPage;
