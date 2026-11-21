import { useMemo, useState } from 'react';
import {
    Brain,
    Bot,
    Cpu,
    Database,
    Eye,
    FileText,
    Globe,
    HardDrive,
    Layers,
    Mic,
    Rocket,
    Search,
    Shield,
    Sparkles,
    Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import {
    AnimatedMetricBar,
    InteractiveFlowDiagram,
    SectionHeader,
    type FlowNodeSpec,
} from '../components/shared/ShowcaseBlocks';
import SEO from '../components/SEO';

const ACCENT = '#a855f7';
const EASE = [0.16, 1, 0.3, 1] as const;

const SECTIONS = [
    { id: 'os-model', label: 'LLM OS' },
    { id: 'zoo', label: 'Model Zoo' },
    { id: 'tokens', label: 'Tokenizer' },
    { id: 'reasoning', label: 'System 2' },
    { id: 'workflows', label: 'Workflows' },
];

const osNodes: FlowNodeSpec[] = [
    {
        id: 'disk',
        step: '01',
        title: 'Pre-training disk',
        role: 'Lossy zip',
        icon: HardDrive,
        detail: 'Trillions of internet tokens compressed into static neural weights. Gives the model broad world intuition, frozen at its knowledge cutoff.',
        statePreview: `{
  "corpus": "~15T web & code tokens",
  "weights": "Lossy knowledge snapshot",
  "mutableAtRuntime": false
}`,
        highlightLines: [1, 4],
    },
    {
        id: 'ram',
        step: '02',
        title: 'Context window RAM',
        role: 'Working memory',
        icon: Layers,
        detail: 'Every prompt, uploaded PDF, and prior turn sits in finite token RAM. Professionals start fresh threads aggressively so attention stays sharp.',
        statePreview: `{
  "bufferUsed": "48,200 / 200,000 tokens",
  "coReadingPdf": "architecture_spec.pdf",
  "signalToNoise": "HIGH"
}`,
        highlightLines: [6, 10],
    },
    {
        id: 'cpu',
        step: '03',
        title: 'LLM reasoning CPU',
        role: 'System 1 & 2',
        icon: Cpu,
        detail: 'Standard models answer in one forward pass (System 1). Reasoning models spend test-time RL compute verifying steps before speaking (System 2).',
        statePreview: `{
  "mode": "SYSTEM_2_RL",
  "thinkingTokens": 1840,
  "selfCorrections": 2
}`,
        highlightLines: [12, 16],
    },
    {
        id: 'tools',
        step: '04',
        title: 'Peripherals & tools',
        role: 'Search / Code / Vision',
        icon: Rocket,
        detail: 'Web search, Python interpreters, vision cameras, and file editors turn a passive text predictor into an autonomous agent that acts in the world.',
        statePreview: `{
  "toolsInvoked": ["web_search", "python_exec"],
  "citationsVerified": 8,
  "status": "DELIVERED"
}`,
        highlightLines: [18, 22],
    },
];

const OS_CODE = `# Andrej Karpathy's Probabilistic Operating System
weights = PretrainedWeights.load("internet_lossy_zip_v2025")
# Static compressed knowledge; frozen at cutoff

# Working RAM: keep context tight and high-signal
context_ram = ContextWindow(limit=200_000)
context_ram.load(system_persona, uploaded_pdf, user_intent)

# Select compute tier: instant System 1 vs deliberative System 2
cpu = select_model(task.complexity)
thought_trace = cpu.deliberate(context_ram, weights)

# Attach peripherals for live facts & verified execution
while thought_trace.needs_tool():
    obs = peripherals.execute(thought_trace.tool_call)
    context_ram.append(obs)
    thought_trace = cpu.deliberate(context_ram, weights)

return verify_and_ship(thought_trace.answer)`;

const ELO_TIERS = [
    {
        id: 'frontier',
        name: 'Frontier Generalist',
        score: '1300+ ELO',
        pct: 96,
        models: 'Claude, GPT-4o, Gemini Pro',
        guidance: 'Use for system architecture, nuanced synthesis, and high-stakes executive communication.',
    },
    {
        id: 'reasoning',
        name: 'System 2 Reasoning',
        score: '1260+ ELO',
        pct: 90,
        models: 'o1 / o3, DeepSeek R1, Extended Thinking',
        guidance: 'Trades latency for test-time RL deliberation. Ideal for proofs, root-cause debugging, and financial math.',
    },
    {
        id: 'coding',
        name: 'High-Speed Coding & Agentic',
        score: '1220+ ELO',
        pct: 84,
        models: 'Sonnet, Flash, DeepSeek V3',
        guidance: 'Fast tool-calling loops and multi-file vibe coding. Pair 3 models into an "LLM Council" for critical decisions.',
    },
];

const TOKEN_PRESETS = [
    'The quick brown fox jumps over the lazy dog.',
    'Probabilistic Operating System: CPU, RAM, and Tools.',
    'Verify the AI output; treat it like a brilliant intern.',
];

const TOKEN_TINTS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

/** Deterministic client-side BPE-style subword chunker for interactive visualization. */
function tokenizeDemo(text: string) {
    const raw = text.match(/([A-Za-z]{1,6}|[0-9]+|[^\sA-Za-z0-9]|\s+)/g) ?? [];
    return raw.map((piece, i) => {
        let hash = 2166136261;
        for (let k = 0; k < piece.length; k++) {
            hash ^= piece.charCodeAt(k);
            hash = Math.imul(hash, 16777619);
        }
        return {
            key: `${i}-${piece}`,
            text: piece,
            id: Math.abs(hash) % 98000 + 100,
            color: TOKEN_TINTS[i % TOKEN_TINTS.length],
        };
    });
}

const MODALITIES = [
    {
        id: 'vision',
        label: 'Vision',
        icon: Eye,
        headline: 'Point a camera at physical reality',
        detail: 'Debug a hardware readout, translate a handwritten Bangkok menu, or extract circuit layouts in one multimodal pass.',
    },
    {
        id: 'audio',
        label: 'Voice',
        icon: Mic,
        headline: 'Real-time spoken coaching',
        detail: 'Native audio models hear tone, cadence, and hesitation, enabling live interview drills and language practice.',
    },
    {
        id: 'text',
        label: 'Deep Research',
        icon: Search,
        headline: '20+ autonomous web hops per brief',
        detail: 'Tool-calling research agents read dozens of sources into context RAM and return cited drafts ready for human verification.',
    },
    {
        id: 'code',
        label: 'Vibe Coding',
        icon: FileText,
        headline: 'Direct intent, inspect diffs',
        detail: 'Architects specify intent and constraints while coding agents edit files, run builds, and verify regressions.',
    },
];

const SKILL_STACK = [
    { icon: Globe, title: 'Intent design', body: 'Defining crisp specifications, edge cases, and acceptance criteria.' },
    { icon: Shield, title: 'Verification', body: 'Checking math, citations, and diffs instead of trusting fluent prose.' },
    { icon: Layers, title: 'Composition', body: 'Chaining frontier, reasoning, and fast models into resilient workflows.' },
    { icon: Zap, title: 'Fast iteration', body: 'Testing five prototypes in an afternoon rather than debating one on paper.' },
];

const KarpathyDeepDivePage = () => {
    const [selectedTier, setSelectedTier] = useState(0);
    const [tokenInput, setTokenInput] = useState(TOKEN_PRESETS[0]);
    const [hoveredToken, setHoveredToken] = useState<{ text: string; id: number } | null>(null);
    const [thinkingMode, setThinkingMode] = useState<'system1' | 'system2'>('system2');
    const [modality, setModality] = useState(0);

    const tokens = useMemo(() => tokenizeDemo(tokenInput), [tokenInput]);
    const activeMod = MODALITIES[modality];

    return (
        <SubPageShell statusLabel="AK Deep Dive" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="The Probabilistic Operating System: Andrej Karpathy LLM Synthesis"
                description="Interactive technical synthesis of Andrej Karpathy's masterclass on professional LLM architecture, tokenization, System 2 reasoning, and agentic workflows."
                url="https://wutcharin.com/karpathy-deep-dive"
            />
            <SubPageHero
                badgeLabel="Technical Strategy"
                BadgeIcon={Brain}
                titleLead="The Probabilistic"
                titleAccent="Operating System."
                accentColor={ACCENT}
                description={
                    <>
                        A technical and strategic synthesis of Andrej Karpathy&rsquo;s masterclass on professional LLM engineering: treating models as
                        a <span className="font-normal text-text-strong">CPU + Context RAM + Tools</span> stack.
                    </>
                }
                primaryCta={{ label: 'Explore LLM OS', href: '#os-model', icon: Sparkles }}
                secondaryCta={{
                    label: 'Watch original lecture',
                    href: 'https://www.youtube.com/watch?v=EWvNQjAaOHw',
                    icon: Rocket,
                    external: true,
                }}
            />

            {/* 01 · Interactive Probabilistic OS Motion Graphic */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="os-model"
                    index="01"
                    eyebrow="Mental model"
                    title="Stop chatting."
                    accent="Architect the OS."
                    accentColor={ACCENT}
                    lead="In Karpathy's architecture, pre-training weights are the hard drive, the context window is RAM, the model is the CPU, and search/code/vision are peripherals."
                />
                <InteractiveFlowDiagram
                    nodes={osNodes}
                    accentColor={ACCENT}
                    filename="probabilistic_os.py"
                    code={OS_CODE}
                    cyclicLabel="Tool observations feed back into Context RAM"
                />
            </section>

            {/* 02 · Interactive Model Zoo & LLM Council */}
            <section id="zoo" className="mx-auto mb-24 max-w-6xl scroll-mt-24 px-6 md:mb-32 md:px-10">
                <SectionHeader
                    index="02"
                    eyebrow="The LLM Zoo"
                    title="Convene an"
                    accent="LLM Council."
                    accentColor={ACCENT}
                    lead="No single model wins every task. Professionals benchmark via ELO and prompt three distinct frontier models whenever the decision matters."
                />

                <div className="mt-12 grid gap-6 lg:grid-cols-12">
                    <div className="space-y-3 lg:col-span-7">
                        {ELO_TIERS.map((tier, idx) => {
                            const on = selectedTier === idx;
                            return (
                                <button
                                    key={tier.id}
                                    type="button"
                                    onClick={() => setSelectedTier(idx)}
                                    data-cursor="step"
                                    className={`w-full rounded-lg border p-5 text-left transition-colors ${
                                        on
                                            ? 'border-hairline-strong bg-panel'
                                            : 'border-hairline bg-panel/40 hover:border-hairline-strong'
                                    }`}
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="text-base font-medium text-text-strong">{tier.name}</span>
                                        <span className="font-mono text-[11px] tabular-nums" style={{ color: ACCENT }}>
                                            {tier.score}
                                        </span>
                                    </div>
                                    <AnimatedMetricBar label={tier.models} value={`${tier.pct}%`} pct={tier.pct} accentColor={ACCENT} />
                                </button>
                            );
                        })}
                    </div>

                    <div className="frame-ticks flex flex-col justify-between rounded-lg border border-hairline bg-panel/60 p-6 md:p-8 lg:col-span-5">
                        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-text-mute">Council playbook</p>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedTier}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className="my-6"
                            >
                                <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
                                    {ELO_TIERS[selectedTier].score}
                                </p>
                                <h3 className="mt-2 text-2xl font-medium text-text-strong">{ELO_TIERS[selectedTier].name}</h3>
                                <p className="mt-3 text-sm font-light leading-relaxed text-text-mute">
                                    {ELO_TIERS[selectedTier].guidance}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                        <p className="border-t border-hairline pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">
                            Models: <span className="text-text-strong">{ELO_TIERS[selectedTier].models}</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* 03 · Live Interactive BPE Tokenizer */}
            <section id="tokens" className="mx-auto mb-24 max-w-6xl scroll-mt-24 px-6 md:mb-32 md:px-10">
                <SectionHeader
                    index="03"
                    eyebrow="Machine language"
                    title="Inside the"
                    accent="token stream."
                    accentColor={ACCENT}
                    lead="Models do not see characters; they process subword token IDs. Type below or choose a sample to inspect how context RAM fills up."
                />

                <div className="frame-ticks mt-10 rounded-lg border border-hairline bg-panel/60 p-6 md:p-8">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                            {TOKEN_PRESETS.map((preset, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setTokenInput(preset)}
                                    data-cursor="step"
                                    className="rounded-full border border-hairline px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-mute transition-colors hover:border-hairline-strong hover:text-text-strong"
                                >
                                    Preset 0{i + 1}
                                </button>
                            ))}
                        </div>
                        <span className="font-mono text-[11px] tabular-nums text-text-strong">
                            {tokens.length} tokens · {tokenInput.length} chars
                        </span>
                    </div>

                    <input
                        type="text"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        aria-label="Prompt text to tokenize"
                        className="mb-6 w-full rounded-md border border-hairline bg-bg px-4 py-3 font-mono text-sm text-text-strong outline-none focus:border-signal"
                    />

                    <div className="min-h-[84px] rounded-md border border-hairline bg-bg/70 p-4 font-mono text-sm leading-loose">
                        {tokens.map((tok) => (
                            <span
                                key={tok.key}
                                onMouseEnter={() => setHoveredToken({ text: tok.text, id: tok.id })}
                                onMouseLeave={() => setHoveredToken(null)}
                                className="mx-0.5 inline-block cursor-crosshair rounded px-1.5 py-0.5 transition-transform hover:-translate-y-0.5"
                                style={{
                                    backgroundColor: `${tok.color}22`,
                                    border: `1px solid ${tok.color}55`,
                                    color: 'var(--color-text-strong)',
                                }}
                            >
                                {tok.text === ' ' ? '·' : tok.text}
                            </span>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">
                        <span>
                            {hoveredToken
                                ? `Token ID #${hoveredToken.id} · "${hoveredToken.text}"`
                                : 'Hover any colored chunk to inspect its numeric token ID'}
                        </span>
                        <span>BPE approximation</span>
                    </div>
                </div>
            </section>

            {/* 04 · Interactive System 1 vs. System 2 Switcher */}
            <section id="reasoning" className="mx-auto mb-24 max-w-6xl scroll-mt-24 px-6 md:mb-32 md:px-10">
                <SectionHeader
                    index="04"
                    eyebrow="Test-time compute"
                    title="System 1 vs."
                    accent="System 2."
                    accentColor={ACCENT}
                    lead="Standard models spend identical compute on every token. Reinforcement-learned reasoning models pause to verify logic before emitting an answer."
                />

                <div className="mt-10 rounded-lg border border-hairline bg-panel/50 p-6 md:p-8">
                    <div className="mb-6 inline-flex rounded-full border border-hairline bg-bg p-1">
                        {(['system1', 'system2'] as const).map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setThinkingMode(m)}
                                data-cursor="step"
                                className={`relative rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                                    thinkingMode === m ? 'text-bg' : 'text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {thinkingMode === m && (
                                    <motion.span
                                        layoutId="karpathy-sys-pill"
                                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        className="absolute inset-0 -z-10 rounded-full bg-text-strong"
                                    />
                                )}
                                {m === 'system1' ? 'System 1 · Instant' : 'System 2 · Deliberative'}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={thinkingMode}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="space-y-3 font-mono text-xs"
                        >
                            {thinkingMode === 'system1' ? (
                                <>
                                    <div className="rounded-md border border-hairline bg-bg p-4 text-text-mute">
                                        [0.3s] Single forward pass: predicts next plausible token immediately without backtracking.
                                    </div>
                                    <div className="rounded-md border border-rose-500/30 bg-rose-500/5 p-4 text-text-strong">
                                        Risk: confident arithmetic or edge-case hallucination when a step requires multi-hop verification.
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="rounded-md border border-hairline bg-bg p-4 text-text-mute">
                                        [Thought 01] Checking boundary conditions on variable x before differentiating...
                                    </div>
                                    <div className="rounded-md border border-hairline bg-bg p-4 text-text-mute">
                                        [Thought 02] Backtracking: chain rule term missed a negative sign; recomputing...
                                    </div>
                                    <div className="rounded-md border border-hairline-strong bg-bg p-4 text-text-strong">
                                        <span style={{ color: ACCENT }}>[Verified Output]</span> Exact solution confirmed with 0 algebraic contradictions.
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>

            {/* 05 · Multimodal & AI-Native Skill Stack */}
            <section id="workflows" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <SectionHeader
                    index="05"
                    eyebrow="Operator workflows"
                    title="Vision, voice,"
                    accent="and autonomous intent."
                    accentColor={ACCENT}
                    lead="As omni-models and coding agents converge, software shifts from apps you click to workers you direct and verify."
                />

                {/* Interactive Modality switcher */}
                <div className="mt-10 grid gap-6 lg:grid-cols-12">
                    <div className="grid grid-cols-2 gap-3 lg:col-span-5">
                        {MODALITIES.map((mod, i) => {
                            const on = modality === i;
                            return (
                                <button
                                    key={mod.id}
                                    type="button"
                                    onClick={() => setModality(i)}
                                    data-cursor="step"
                                    className={`flex flex-col items-start gap-3 rounded-lg border p-5 text-left transition-colors ${
                                        on ? 'border-hairline-strong bg-panel' : 'border-hairline bg-panel/40 hover:border-hairline-strong'
                                    }`}
                                >
                                    <mod.icon className="h-5 w-5" style={{ color: on ? ACCENT : 'var(--color-text-mute)' }} aria-hidden="true" />
                                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-strong">{mod.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="frame-ticks flex flex-col justify-between rounded-lg border border-hairline bg-panel/60 p-6 md:p-8 lg:col-span-7">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: ACCENT }}>
                            Active modality · {activeMod.label}
                        </span>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeMod.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className="my-6"
                            >
                                <h3 className="text-2xl font-medium text-text-strong">{activeMod.headline}</h3>
                                <p className="mt-3 text-base font-light leading-relaxed text-text-mute">{activeMod.detail}</p>
                            </motion.div>
                        </AnimatePresence>
                        <div className="flex items-center justify-between border-t border-hairline pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">
                            <span className="flex items-center gap-2">
                                <Bot className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
                                Single unified stream
                            </span>
                            <span className="flex items-center gap-2">
                                <Database className="h-3.5 w-3.5" aria-hidden="true" />
                                Co-Reading &amp; Personalization
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4-Pillar AI-Native Skill Ledger */}
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {SKILL_STACK.map((s, idx) => (
                        <div key={s.title} className="rounded-lg border border-hairline bg-panel/40 p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <s.icon className="h-4 w-4" style={{ color: ACCENT }} aria-hidden="true" />
                                <span className="font-mono text-[10px] tabular-nums text-text-mute">0{idx + 1}</span>
                            </div>
                            <h3 className="text-base font-medium text-text-strong">{s.title}</h3>
                            <p className="mt-2 text-sm font-light leading-relaxed text-text-mute">{s.body}</p>
                        </div>
                    ))}
                </div>
            </section>

            <ProjectNavigation currentId="karpathy-deep-dive" />
        </SubPageShell>
    );
};

export default KarpathyDeepDivePage;
