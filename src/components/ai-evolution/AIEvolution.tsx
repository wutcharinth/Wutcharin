import type { ComponentType, ReactElement } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Cell,
    LineChart, Line, ScatterChart, Scatter, ReferenceLine
} from 'recharts';
import {
    Cpu, Coins, Rocket, Trophy, Brain, TrendingUp, Zap, Briefcase, GitBranch, Battery,
    Info, ExternalLink
} from 'lucide-react';
import { useTheme } from '../../lib/theme';

// --- Data Constants (Sourced & Verified) ---

const computeData = [
    { year: '2018', model: 'GPT-1', flops: 0.0001 },
    { year: '2019', model: 'GPT-2', flops: 0.0015 },
    { year: '2020', model: 'GPT-3', flops: 3.14 },
    { year: '2021', model: 'Gopher', flops: 60 },
    { year: '2022', model: 'PaLM', flops: 250 },
    { year: '2023', model: 'GPT-4', flops: 2100 },
    { year: '2024', model: 'Gemini Ultra', flops: 5000 },
];

const costData = [
    { model: 'GPT-3 (2020)', price: 20.00, category: 'Legacy' },
    { model: 'GPT-4 (2023)', price: 30.00, category: 'Flagship' },
    { model: 'GPT-4o (2024)', price: 5.00, category: 'Flagship' },
    { model: 'Claude 3.5', price: 3.00, category: 'Flagship' },
    { model: 'GPT-4o mini', price: 0.15, category: 'Efficiency' },
    { model: 'Gemini 1.5', price: 0.075, category: 'Efficiency' },
    { model: 'DeepSeek V3', price: 0.02, category: 'Efficiency' },
];

const adoptionData = [
    { app: 'Mobile Phone', months: 192 },
    { app: 'Internet', months: 84 },
    { app: 'Facebook', months: 54 },
    { app: 'TikTok', months: 9 },
    { app: 'ChatGPT', months: 2 },
];

const performanceData = [
    { subject: 'MMLU (General)', Human: 89.8, AI: 90.0, fullMark: 100 },
    { subject: 'Math (GSM8K)', Human: 90, AI: 95.0, fullMark: 100 },
    { subject: 'Code (HumanEval)', Human: 80, AI: 92.0, fullMark: 100 },
    { subject: 'Bar Exam', Human: 68, AI: 90.0, fullMark: 100 },
    { subject: 'Creativity', Human: 95, AI: 85.0, fullMark: 100 },
    { subject: 'Reasoning', Human: 92, AI: 96.0, fullMark: 100 },
];

const contextData = [
    { model: 'GPT-3', tokens: 4000 },
    { model: 'GPT-4', tokens: 32000 },
    { model: 'Claude 2', tokens: 100000 },
    { model: 'Gemini 1.5', tokens: 1000000 },
    { model: 'Gemini 1.5+', tokens: 2000000 },
];

const investmentData = [
    { sector: 'Generative AI', value: 25.2 },
    { sector: 'Fintech', value: 6.1 },
    { sector: 'Healthcare', value: 5.8 },
    { sector: 'Retail', value: 4.2 },
    { sector: 'Cybersecurity', value: 3.8 },
];

const latencyData = [
    { year: '2022', type: 'Text-to-Speech', ms: 2800 },
    { year: '2023', type: 'Pipeline Voice', ms: 1400 },
    { year: '2024', type: 'GPT-4o', ms: 320 },
    { year: 'Threshold', type: 'Human', ms: 250 },
];

const laborData = [
    { date: 'Q1 2022', index: 100 },
    { date: 'Q3 2022', index: 115 },
    { date: 'Q1 2023', index: 380 },
    { date: 'Q3 2023', index: 750 },
    { date: 'Q1 2024', index: 1400 },
    { date: 'Q3 2024', index: 2000 },
];

const openClosedData = [
    { name: 'GPT-4o', x: 100, y: 1287, type: 'Closed' },
    { name: 'Gemini 1.5 Pro', x: 90, y: 1261, type: 'Closed' },
    { name: 'Claude 3 Opus', x: 110, y: 1246, type: 'Closed' },
    { name: 'Llama 3 70B', x: 70, y: 1208, type: 'Open' },
    { name: 'Mixtral 8x22B', x: 60, y: 1150, type: 'Open' },
    { name: 'Qwen 1.5 72B', x: 72, y: 1160, type: 'Open' },
];

const energyData = [
    { entity: 'Bitcoin Mining', value: 140 },
    { entity: 'Data Centers', value: 460 },
    { entity: 'AI Training', value: 40 },
    { entity: 'Ireland', value: 32 },
];

const ACCENTS: Record<string, string> = {
    violet: '#8b5cf6',
    emerald: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6',
    rose: '#f43f5e',
};

function ChapterTitle({ number, title, subtitle }: { number: string; title: string; subtitle: string }) {
    return (
        <div className="mb-16 pt-12 border-t border-hairline first:border-t-0 first:pt-0">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-4"
            >
                <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-violet-500">
                    CHAPTER 0{number}
                </span>
                <span className="h-px w-8 bg-hairline-strong" />
            </motion.div>
            <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 }}
                className="font-display text-3xl md:text-5xl font-medium text-text-strong tracking-tight mb-4"
            >
                {title}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg text-text-mute max-w-2xl leading-relaxed font-light"
            >
                {subtitle}
            </motion.p>
        </div>
    );
}

interface StoryCardProps {
    icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
    title: string;
    description: string;
    children: ReactElement;
    align?: 'left' | 'right';
    color?: keyof typeof ACCENTS;
    metric?: string;
    metricLabel?: string;
    source: string;
    sourceLink: string;
    explanation: string;
}

function StoryCard({
    icon: Icon,
    title,
    description,
    children,
    align = 'left',
    color = 'violet',
    metric,
    metricLabel,
    source,
    sourceLink,
    explanation,
}: StoryCardProps) {
    const accent = ACCENTS[color] || '#8b5cf6';

    return (
        <div
            className={`flex flex-col lg:flex-row gap-10 lg:gap-12 items-start mb-24 ${
                align === 'right' ? 'lg:flex-row-reverse' : ''
            }`}
        >
            <motion.div
                className="flex-1 lg:sticky lg:top-28"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55 }}
            >
                <div
                    className="w-11 h-11 rounded-xl border flex items-center justify-center mb-6"
                    style={{ borderColor: `${accent}44`, backgroundColor: `${accent}14`, color: accent }}
                >
                    <Icon className="w-5 h-5" />
                </div>

                <h3 className="font-display text-2xl md:text-3xl font-medium text-text-strong mb-4 tracking-tight">
                    {title}
                </h3>

                <p className="text-text text-base leading-relaxed mb-5 font-light">{description}</p>

                <div className="bg-panel border border-hairline rounded-xl p-4 text-sm text-text-mute mb-6 leading-relaxed">
                    <div className="flex items-center gap-2 mb-1.5 text-text-strong text-xs font-mono uppercase tracking-[0.16em]">
                        <Info className="w-3.5 h-3.5" style={{ color: accent }} />
                        Why this metric matters
                    </div>
                    {explanation}
                </div>

                {metric && (
                    <div className="mb-6 flex items-baseline gap-4 border-l-2 pl-4" style={{ borderColor: accent }}>
                        <span className="font-display text-4xl md:text-5xl font-medium text-text-strong tracking-tight">
                            {metric}
                        </span>
                        <span className="text-xs font-mono text-text-mute uppercase tracking-[0.16em]">
                            {metricLabel}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-xs text-text-mute font-mono">
                    <ExternalLink className="w-3 h-3" />
                    <span>Source:</span>
                    <a
                        href={sourceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-strong underline decoration-hairline-strong underline-offset-4 hover:decoration-text-strong transition-colors"
                    >
                        {source}
                    </a>
                </div>
            </motion.div>

            <motion.div
                className="flex-1 w-full"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: 0.1 }}
            >
                <div className="frame-ticks relative bg-panel border border-hairline rounded-2xl p-5 md:p-7 h-[420px] md:h-[460px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {children}
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
}

interface TooltipPayloadItem {
    name?: string;
    value?: string | number;
    color?: string;
}

function CustomTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string | number;
}) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-bg border border-hairline-strong p-3.5 rounded-xl min-w-[180px]">
            <p className="text-text-mute font-mono text-[10px] uppercase tracking-[0.18em] border-b border-hairline pb-2 mb-2">
                {label}
            </p>
            {payload.map((entry, index) => (
                <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1 last:mb-0">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || '#8b5cf6' }} />
                        <span className="text-text-mute">{entry.name}:</span>
                    </div>
                    <span className="text-text-strong font-mono font-medium">{entry.value}</span>
                </div>
            ))}
        </div>
    );
}

export default function AIEvolution() {
    const theme = useTheme();
    const isLight = theme === 'light';
    const gridStroke = isLight ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.08)';
    const axisStroke = isLight ? '#525252' : '#8a8a8a';
    const neutralBar = isLight ? '#a3a3a3' : '#525252';

    return (
        <div className="max-w-7xl mx-auto">
            {/* CHAPTER 1 */}
            <ChapterTitle
                number="1"
                title="The Exponential Engine"
                subtitle="The raw physics of intelligence. Three compounding forces are reshaping capability simultaneously: Compute, Cost, and Adoption Velocity."
            />

            <StoryCard
                icon={Cpu}
                title="Moore's Law on Steroids"
                description="Training frontier models requires massive compute. While Moore's Law doubled transistor density every 2 years, AI training compute has doubled roughly every 3.4 months."
                explanation="FLOPs (Floating Point Operations) measure total calculation work. A logarithmic scale is required because 100x jumps would flatten early eras into a horizontal line."
                metric="50,000,000x"
                metricLabel="Compute Growth (2018-2024)"
                source="Epoch AI (2024)"
                sourceLink="https://epochai.org/blog/compute-trends"
                color="violet"
                align="left"
            >
                <LineChart data={computeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="year" stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <YAxis scale="log" domain={[0.0001, 10000]} allowDataOverflow stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="flops"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        isAnimationActive={false}
                        dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: isLight ? '#ffffff' : '#050505' }}
                        activeDot={{ r: 7 }}
                        name="Training FLOPs (Relative)"
                    />
                </LineChart>
            </StoryCard>

            <StoryCard
                icon={Coins}
                title="The Cost Collapse"
                description="Inference efficiency models like DeepSeek V3 and Gemini Flash have compressed intelligence pricing by 99.9% compared to the GPT-4 baseline of 2023."
                explanation="Comparing price per 1 Million input tokens: analyzing a full novel cost $30 in 2023 and now costs under 2 cents, unlocking high-volume production agent loops."
                metric="-99.9%"
                metricLabel="Price Drop (2023 vs 2025)"
                source="Dec 2025 Market Benchmarks"
                sourceLink="https://openai.com/api/pricing/"
                color="emerald"
                align="right"
            >
                <BarChart data={costData} layout="vertical" margin={{ left: 20, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                    <XAxis type="number" stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                    <YAxis dataKey="model" type="category" stroke={axisStroke} width={118} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={24} name="Price ($) / 1M Tokens">
                        {costData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.category === 'Efficiency' ? '#10b981' : entry.category === 'Flagship' ? '#f59e0b' : neutralBar}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </StoryCard>

            <StoryCard
                icon={Rocket}
                title="Viral Velocity"
                description="ChatGPT reached 100 million monthly users in 2 months, compressing a multi-year consumer adoption curve into a single quarter."
                explanation="Time to 100M users measures distribution friction. Reaching that milestone in 60 days signals horizontal utility across nearly every knowledge discipline."
                metric="2 Months"
                metricLabel="Time to 100M Users"
                source="UBS Study (2023)"
                sourceLink="https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/"
                color="blue"
                align="left"
            >
                <BarChart data={adoptionData} layout="vertical" margin={{ left: 10, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                    <XAxis type="number" stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <YAxis dataKey="app" type="category" stroke={axisStroke} width={96} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="months" radius={[0, 4, 4, 0]} barSize={30} name="Months to 100M">
                        {adoptionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.app === 'ChatGPT' ? '#ec4899' : '#3b82f6'} />
                        ))}
                    </Bar>
                </BarChart>
            </StoryCard>

            {/* CHAPTER 2 */}
            <ChapterTitle
                number="2"
                title="The Human Threshold"
                subtitle="Crossing the baseline. Models have moved past mimicry into high-percentile performance across reasoning, memory, and real-time latency."
            />

            <StoryCard
                icon={Trophy}
                title="The Benchmark Gap"
                description="Frontier models have surpassed average human baselines across standardized exams in law, math, and software engineering, now racing against domain experts."
                explanation="Benchmarks like MMLU span 57 academic subjects. Scoring at the 90th percentile on the Uniform Bar Exam reflects multi-step synthesis, not mere lookup."
                metric="90th %"
                metricLabel="Bar Exam Percentile (GPT-4)"
                source="OpenAI Technical Report"
                sourceLink="https://openai.com/research/gpt-4"
                color="amber"
                align="right"
            >
                <RadarChart cx="50%" cy="50%" outerRadius="68%" data={performanceData}>
                    <PolarGrid stroke={gridStroke} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: axisStroke, fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={gridStroke} tick={{ fill: axisStroke, fontSize: 10 }} />
                    <Radar name="Average Human" dataKey="Human" stroke={neutralBar} fill={neutralBar} fillOpacity={0.18} />
                    <Radar name="SOTA AI" dataKey="AI" stroke="#f59e0b" strokeWidth={2.5} fill="#f59e0b" fillOpacity={0.35} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </StoryCard>

            <StoryCard
                icon={Brain}
                title="Infinite Context"
                description="Active working memory has expanded from a few pages to entire codebases and multi-book libraries (2 Million+ tokens) held in a single forward pass."
                explanation="Context window defines how much source material an AI can reason over simultaneously without external chunking or retrieval loss."
                metric="2M+"
                metricLabel="Tokens (Gemini 1.5 Pro)"
                source="Google DeepMind"
                sourceLink="https://deepmind.google/technologies/gemini/pro/"
                color="violet"
                align="left"
            >
                <BarChart data={contextData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="model" stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <YAxis scale="log" domain={['auto', 'auto']} stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="tokens" radius={[4, 4, 0, 0]} name="Context Window">
                        {contextData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index >= 3 ? '#ec4899' : '#8b5cf6'} />
                        ))}
                    </Bar>
                </BarChart>
            </StoryCard>

            <StoryCard
                icon={Zap}
                title="Real-Time Interaction"
                description="Native audio-in/audio-out multimodal models cut conversational latency to ~320ms, matching natural human turn-taking cadence."
                explanation="Humans naturally pause ~250ms in dialogue. Dropping from 2.8s cascaded ASR+LLM+TTS pipelines to 320ms unlocks interruptible live voice agents."
                metric="320ms"
                metricLabel="Response Latency (GPT-4o)"
                source="OpenAI Spring Update 2024"
                sourceLink="https://openai.com/index/hello-gpt-4o/"
                color="blue"
                align="right"
            >
                <AreaChart data={latencyData}>
                    <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="year" stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <YAxis stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                        y={250}
                        label={{ value: 'Human Cadence (250ms)', fill: '#f43f5e', fontSize: 11 }}
                        stroke="#f43f5e"
                        strokeDasharray="3 3"
                    />
                    <Area type="monotone" dataKey="ms" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorLatency)" name="Latency (ms)" />
                </AreaChart>
            </StoryCard>

            {/* CHAPTER 3 */}
            <ChapterTitle
                number="3"
                title="The Societal Shockwave"
                subtitle="How compounding AI capability propagates into hiring demand, capital markets, open-weights parity, and grid-scale energy physics."
            />

            <StoryCard
                icon={Briefcase}
                title="The Skills Shift"
                description="Job postings requiring Generative AI and LLM engineering skills expanded 20x in 18 months as organizations retool core product teams."
                explanation="Hiring demand is a leading indicator of enterprise budget reallocation, shifting AI literacy from R&D labs into mainstream software engineering."
                metric="20x"
                metricLabel="AI Job Postings Index"
                source="Indeed Hiring Lab / LinkedIn"
                sourceLink="https://www.hiringlab.org/"
                color="emerald"
                align="left"
            >
                <LineChart data={laborData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="date" stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <YAxis stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="index" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} name="Job Postings Index" />
                </LineChart>
            </StoryCard>

            <StoryCard
                icon={TrendingUp}
                title="The Capital Surge"
                description="Generative AI captured over 4x the venture funding of Fintech or Healthcare, signaling a structural platform transition."
                explanation="Concentrated capital flows fund foundational GPU clusters, inference tooling, and vertical agent startups simultaneously."
                metric="$25.2B"
                metricLabel="GenAI Venture Capital (2023)"
                source="Stanford HAI Index 2024"
                sourceLink="https://aiindex.stanford.edu/report/"
                color="amber"
                align="right"
            >
                <BarChart data={investmentData} layout="vertical" margin={{ left: 14, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                    <XAxis type="number" stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <YAxis dataKey="sector" type="category" stroke={axisStroke} width={104} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={30} name="Investment ($B)" />
                </BarChart>
            </StoryCard>

            <StoryCard
                icon={GitBranch}
                title="Open vs. Closed Parity"
                description="Open-weights models (Llama 3, Qwen, Mixtral) have closed the Elo gap with proprietary frontier systems, turning raw model weights into commodity infrastructure."
                explanation="Chatbot Arena Elo reflects blind human preference rankings. High open-weight Elo means private on-premise deployments no longer sacrifice reasoning quality."
                metric="Closing"
                metricLabel="Arena Elo Delta"
                source="LMSYS Chatbot Arena"
                sourceLink="https://chat.lmsys.org/?leaderboard"
                color="violet"
                align="left"
            >
                <ScatterChart margin={{ top: 16, right: 16, bottom: 24, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis
                        type="number"
                        dataKey="x"
                        name="Params (B)"
                        stroke={axisStroke}
                        tick={{ fill: axisStroke, fontSize: 11 }}
                        label={{ value: 'Active Params (Billions)', position: 'insideBottom', offset: -12, fill: axisStroke, fontSize: 11 }}
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        name="Arena Elo"
                        stroke={axisStroke}
                        tick={{ fill: axisStroke, fontSize: 11 }}
                        domain={[1100, 1300]}
                    />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Scatter name="Closed Source" data={openClosedData.filter((d) => d.type === 'Closed')} fill="#8b5cf6" shape="circle" />
                    <Scatter name="Open Weights" data={openClosedData.filter((d) => d.type === 'Open')} fill="#f59e0b" shape="triangle" />
                </ScatterChart>
            </StoryCard>

            <StoryCard
                icon={Battery}
                title="The Physical Constraint"
                description="Compute now collides with electrical physics. Training and serving frontier AI already rivals the annual electricity footprint of entire European nations."
                explanation="Measured in Terawatt-hours (TWh) per year. Energy efficiency per token is becoming the primary bottleneck for next-generation scaling."
                metric="40 TWh"
                metricLabel="Est. Annual AI Training"
                source="IEA Electricity 2024"
                sourceLink="https://www.iea.org/reports/electricity-2024"
                color="rose"
                align="right"
            >
                <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="entity" stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <YAxis stroke={axisStroke} tick={{ fill: axisStroke, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Energy (TWh/Year)">
                        {energyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.entity.includes('AI') ? '#f43f5e' : neutralBar} />
                        ))}
                    </Bar>
                </BarChart>
            </StoryCard>
        </div>
    );
}
