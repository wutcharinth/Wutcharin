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

// --- Data Constants (Sourced & Verified) ---

// 1. Compute Explosion
// Source: Epoch AI (2024), "Compute Trends Across Three Eras of Machine Learning"
const computeData = [
    { year: '2018', model: 'GPT-1', flops: 0.0001 },
    { year: '2019', model: 'GPT-2', flops: 0.0015 },
    { year: '2020', model: 'GPT-3', flops: 3.14 }, // 3.14e23 FLOPs
    { year: '2021', model: 'Gopher', flops: 60 },
    { year: '2022', model: 'PaLM', flops: 250 },
    { year: '2023', model: 'GPT-4', flops: 2100 }, // Est. ~2e25 FLOPs
    { year: '2024', model: 'Gemini Ultra', flops: 5000 }, // Est. >5e25 FLOPs
];

// 2. Cost Collapse
// Source: Official Pricing Pages (OpenAI, Anthropic, Google, DeepSeek) - Dec 2025
const costData = [
    { model: 'GPT-3 (2020)', price: 20.00, category: 'Legacy' },
    { model: 'GPT-4 (2023)', price: 30.00, category: 'Flagship' },
    { model: 'GPT-4o (2024)', price: 5.00, category: 'Flagship' },
    { model: 'Claude 3.5', price: 3.00, category: 'Flagship' },
    { model: 'GPT-4o mini', price: 0.15, category: 'Efficiency' },
    { model: 'Gemini 1.5', price: 0.075, category: 'Efficiency' },
    { model: 'DeepSeek V3', price: 0.02, category: 'Efficiency' }, // The new floor
];

// 3. Adoption Velocity
// Source: UBS Study (2023), Sensor Tower
const adoptionData = [
    { app: 'Mobile Phone', months: 192 }, // ~16 years
    { app: 'Internet', months: 84 }, // ~7 years
    { app: 'Facebook', months: 54 }, // ~4.5 years
    { app: 'TikTok', months: 9 },
    { app: 'ChatGPT', months: 2 }, // The record breaker
];

// 4. Human Performance Gap
// Source: Technical Reports (OpenAI GPT-4, Google Gemini 1.5, Anthropic Claude 3)
const performanceData = [
    { subject: 'MMLU (General)', Human: 89.8, AI: 90.0, fullMark: 100 }, // Expert Human vs Gemini Ultra
    { subject: 'Math (GSM8K)', Human: 90, AI: 95.0, fullMark: 100 }, // Grade School Math
    { subject: 'Code (HumanEval)', Human: 80, AI: 92.0, fullMark: 100 }, // GPT-4o
    { subject: 'Bar Exam', Human: 68, AI: 90.0, fullMark: 100 }, // GPT-4 (90th percentile)
    { subject: 'Creativity', Human: 95, AI: 85.0, fullMark: 100 }, // Subjective/Proxy
    { subject: 'Reasoning', Human: 92, AI: 96.0, fullMark: 100 }, // Big-Bench Hard
];

// 5. Context Expansion
// Source: Model Cards
const contextData = [
    { model: 'GPT-3', tokens: 4000 }, // ~3,000 words
    { model: 'GPT-4', tokens: 32000 }, // ~24,000 words
    { model: 'Claude 2', tokens: 100000 }, // ~75,000 words
    { model: 'Gemini 1.5 Pro', tokens: 1000000 }, // ~750,000 words (Harry Potter series)
    { model: 'Gemini 1.5 Pro (Latest)', tokens: 2000000 }, // ~1.5M words
];

// 6. Corporate Investment
// Source: Stanford HAI AI Index Report 2024
const investmentData = [
    { sector: 'Generative AI', value: 25.2 }, // Massive spike
    { sector: 'Fintech', value: 6.1 },
    { sector: 'Healthcare', value: 5.8 },
    { sector: 'Retail', value: 4.2 },
    { sector: 'Cybersecurity', value: 3.8 },
];

// 7. Latency
// Source: OpenAI GPT-4o Demo, Google I/O 2024
const latencyData = [
    { year: '2022', type: 'Text-to-Speech', ms: 2800 }, // Old pipeline
    { year: '2023', type: 'Pipeline Voice', ms: 1400 }, // Optimized pipeline
    { year: '2024', type: 'GPT-4o', ms: 320 }, // Native multimodal
    { year: 'Threshold', type: 'Human', ms: 250 }, // Avg human gap
];

// 8. Labor Market
// Source: Indeed Hiring Lab, LinkedIn Future of Work Report 2023
const laborData = [
    { date: 'Q1 2022', index: 100 },
    { date: 'Q3 2022', index: 115 },
    { date: 'Q1 2023', index: 380 }, // Post-ChatGPT
    { date: 'Q3 2023', index: 750 },
    { date: 'Q1 2024', index: 1400 },
    { date: 'Q3 2024', index: 2000 }, // 20x growth
];

// 9. Open vs Closed
// Source: LMSYS Chatbot Arena Leaderboard (May 2024)
// X: Active Parameters (Billions) - Proxy for Cost/Size
// Y: Arena Elo Score - Proxy for Quality
const openClosedData = [
    { name: 'GPT-4o', x: 100, y: 1287, type: 'Closed' }, // High Elo
    { name: 'Gemini 1.5 Pro', x: 90, y: 1261, type: 'Closed' },
    { name: 'Claude 3 Opus', x: 110, y: 1246, type: 'Closed' },
    { name: 'Llama 3 70B', x: 70, y: 1208, type: 'Open' }, // Incredible efficiency
    { name: 'Mixtral 8x22B', x: 60, y: 1150, type: 'Open' },
    { name: 'Qwen 1.5 72B', x: 72, y: 1160, type: 'Open' },
];

// 10. Energy Consumption
// Source: IEA Electricity 2024 Report, Digiconomist
const energyData = [
    { entity: 'Bitcoin Mining', value: 140 },
    { entity: 'Data Centers (Total)', value: 460 },
    { entity: 'AI Training (Est)', value: 40 }, // Rapidly growing slice
    { entity: 'Ireland', value: 32 }, // Country benchmark
];

// --- Components ---

const ChapterTitle = ({ number, title, subtitle }: any) => (
    <div className="mb-24 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl -z-10"></div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-violet-400 text-sm font-mono mb-6 backdrop-blur-sm"
        >
            CHAPTER 0{number}
        </motion.div>
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tight"
        >
            {title}
        </motion.h2>
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light"
        >
            {subtitle}
        </motion.p>
    </div>
);

const StoryCard = ({ icon: Icon, title, description, children, align = 'left', color = 'violet', metric, metricLabel, source, sourceLink, explanation }: any) => {
    const colors: any = {
        violet: 'from-violet-500 to-fuchsia-500',
        emerald: 'from-emerald-500 to-teal-500',
        amber: 'from-amber-500 to-orange-500',
        blue: 'from-blue-500 to-cyan-500',
        rose: 'from-rose-500 to-pink-500',
    };

    const gradient = colors[color];

    return (
        <div className={`flex flex-col lg:flex-row gap-16 items-start mb-40 ${align === 'right' ? 'lg:flex-row-reverse' : ''}`}>
            <motion.div
                className="flex-1 lg:sticky lg:top-32"
                initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-8 shadow-lg shadow-${color}-500/20`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-4xl font-black text-white mb-6 tracking-tight">{title}</h3>

                <div className="mb-8">
                    <p className="text-slate-300 text-lg leading-relaxed mb-4">
                        {description}
                    </p>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2 mb-2 text-white font-bold">
                            <Info className="w-4 h-4 text-blue-400" />
                            Why this metric matters:
                        </div>
                        {explanation}
                    </div>
                </div>

                {metric && (
                    <div className="mb-8">
                        <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
                            {metric}
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">{metricLabel}</div>
                    </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono">
                    <ExternalLink className="w-3 h-3" />
                    Source: <a href={sourceLink} target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 underline decoration-slate-700 underline-offset-2 transition-colors">{source}</a>
                </div>
            </motion.div>

            <motion.div
                className="flex-1 w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur opacity-10 group-hover:opacity-30 transition duration-1000`}></div>
                    <div className="relative bg-[#0B1121] border border-slate-800 rounded-3xl p-6 md:p-8 h-[500px] shadow-2xl overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
                        <ResponsiveContainer width="100%" height="100%">
                            {children}
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-950/95 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl z-50 min-w-[200px]">
                <p className="text-slate-400 font-bold mb-3 font-mono text-xs uppercase tracking-wider border-b border-slate-800 pb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between gap-4 text-sm mb-1 last:mb-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                            <span className="text-slate-300">{entry.name}:</span>
                        </div>
                        <span className="text-white font-bold font-mono">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function AIEvolution() {
    return (
        <div className="max-w-7xl mx-auto px-4">

            {/* CHAPTER 1 */}
            <ChapterTitle
                number="1"
                title="The Exponential Engine"
                subtitle="The raw physics of intelligence. We are witnessing a 'Cambrian Explosion' of capability driven by three compounding forces: Compute, Cost, and Velocity."
            />

            <StoryCard
                icon={Cpu}
                title="Moore's Law on Steroids"
                description="Training state-of-the-art models requires massive computational power. While Moore's Law predicts a doubling every 2 years, AI compute requirements are doubling every 3.4 months."
                explanation="FLOPs (Floating Point Operations) measure the total calculation work done. A logarithmic scale is used here because the growth is so extreme (100x increases) that a normal chart would look like a flat line followed by a vertical wall."
                metric="50,000,000x"
                metricLabel="Increase in Compute (2018-2024)"
                source="Epoch AI (2024)"
                sourceLink="https://epochai.org/blog/compute-trends"
                color="violet"
                align="left"
            >
                <LineChart data={computeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#64748b" tick={{ fill: '#64748b' }} />
                    <YAxis scale="log" domain={['auto', 'auto']} stroke="#64748b" tick={{ fill: '#64748b' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="flops" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} name="Training FLOPs (Relative)" />
                </LineChart>
            </StoryCard>

            <StoryCard
                icon={Coins}
                title="The Cost Collapse"
                description="The 'Race to the Bottom' has accelerated in late 2025. New efficiency models like DeepSeek V3 and Gemini 1.5 Flash have driven the cost of intelligence down by 99.9% compared to the GPT-4 era of 2023."
                explanation="We are comparing Price per 1 Million Input Tokens. In 2023, processing a book cost $30. Today, with DeepSeek or Flash, it costs less than 2 cents. This 1500x reduction makes AI viable for high-volume, low-margin applications."
                metric="-99.9%"
                metricLabel="Price Drop (2023 vs 2025)"
                source="Dec 2025 Market Benchmarks"
                sourceLink="https://openai.com/api/pricing/"
                color="emerald"
                align="right"
            >
                <BarChart data={costData} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" tickFormatter={(value) => `$${value}`} />
                    <YAxis dataKey="model" type="category" stroke="#94a3b8" width={140} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="price" radius={[0, 4, 4, 0]} barSize={30} name="Price ($) / 1M Tokens">
                        {costData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.category === 'Efficiency' ? '#10b981' : entry.category === 'Flagship' ? '#f59e0b' : '#64748b'} />
                        ))}
                    </Bar>
                </BarChart>
            </StoryCard>

            <StoryCard
                icon={Rocket}
                title="Viral Velocity"
                description="ChatGPT set a world record by reaching 100 million users in just 2 months. This unprecedented adoption curve signals a fundamental shift in how humans interact with technology."
                explanation="Time to 100M users is a standard metric for product-market fit. The steepness of this curve indicates that AI solves a universal human need (information/creation) more effectively than any prior tool."
                metric="2 Months"
                metricLabel="Time to 100M Users"
                source="UBS Study (2023)"
                sourceLink="https://www.reuters.com/technology/chatgpt-sets-record-fastest-growing-user-base-analyst-note-2023-02-01/"
                color="blue"
                align="left"
            >
                <BarChart data={adoptionData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="app" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="months" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={40} name="Months to 100M">
                        {adoptionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.app === 'ChatGPT' ? '#ec4899' : '#3b82f6'} />
                        ))}
                    </Bar>
                </BarChart>
            </StoryCard>

            {/* CHAPTER 2 */}
            <div className="py-20"></div>
            <ChapterTitle
                number="2"
                title="The Human Threshold"
                subtitle="Crossing the line. AI is no longer just mimicking; it is surpassing human baselines in reasoning, creativity, and speed. The 'Human Baseline' is now the floor, not the ceiling."
            />

            <StoryCard
                icon={Trophy}
                title="The Benchmark Gap"
                description="AI has now surpassed the average human in standardized tests for law, medicine, and coding. We are now tracking how quickly it closes the gap with 'Expert' human performance."
                explanation="Benchmarks like MMLU (Massive Multitask Language Understanding) test knowledge across 57 subjects. Passing the 'Bar Exam' (Law) demonstrates high-level reasoning, not just memorization."
                metric="90th %"
                metricLabel="Bar Exam Percentile (GPT-4)"
                source="OpenAI Technical Report"
                sourceLink="https://openai.com/research/gpt-4"
                color="amber"
                align="right"
            >
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={performanceData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
                    <Radar name="Average Human" dataKey="Human" stroke="#64748b" fill="#64748b" fillOpacity={0.2} />
                    <Radar name="SOTA AI" dataKey="AI" stroke="#f59e0b" strokeWidth={3} fill="#f59e0b" fillOpacity={0.5} />
                    <Legend />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </StoryCard>

            <StoryCard
                icon={Brain}
                title="Infinite Context"
                description="Memory is the new RAM. We've gone from models that 'forget' after a few paragraphs to models that can hold entire libraries (2 Million+ tokens) in active memory."
                explanation="Context Window determines how much information an AI can process at once. 1 Million tokens is roughly equivalent to 700,000 words, or the entire Harry Potter series, enabling deep analysis of massive datasets."
                metric="2M+"
                metricLabel="Tokens (Gemini 1.5 Pro)"
                source="Google DeepMind"
                sourceLink="https://deepmind.google/technologies/gemini/pro/"
                color="violet"
                align="left"
            >
                <BarChart data={contextData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="model" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis scale="log" domain={['auto', 'auto']} stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="tokens" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Context Window">
                        {contextData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index >= 3 ? '#ec4899' : '#8b5cf6'} />
                        ))}
                    </Bar>
                </BarChart>
            </StoryCard>

            <StoryCard
                icon={Zap}
                title="Real-Time Interaction"
                description="Breaking the latency barrier. New multimodal models respond in ~320ms, matching human conversational cadence. This enables natural, interruptible voice conversations."
                explanation="Latency is the delay between you speaking and the AI responding. Humans naturally pause for ~250ms. Previous AI took 2-3 seconds, feeling robotic. We have now reached 'conversational real-time'."
                metric="320ms"
                metricLabel="Response Time (GPT-4o)"
                source="OpenAI Spring Update 2024"
                sourceLink="https://openai.com/index/hello-gpt-4o/"
                color="blue"
                align="right"
            >
                <AreaChart data={latencyData}>
                    <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={250} label={{ value: "Human Speed", fill: "#ef4444", fontSize: 12 }} stroke="#ef4444" strokeDasharray="3 3" />
                    <Area type="monotone" dataKey="ms" stroke="#3b82f6" strokeWidth={3} fill="url(#colorLatency)" name="Latency (ms)" />
                </AreaChart>
            </StoryCard>

            {/* CHAPTER 3 */}
            <div className="py-20"></div>
            <ChapterTitle
                number="3"
                title="The Societal Shockwave"
                subtitle="The ripple effects. How AI is reshaping labor markets, capital allocation, and the physical world. This is the 'Industrial Revolution' of the mind."
            />

            <StoryCard
                icon={Briefcase}
                title="The Skills Shift"
                description="The labor market is reacting instantly. Demand for AI skills (Generative AI, LLMs) has exploded 20x in 18 months. 'AI Literacy' is becoming a fundamental requirement for modern work."
                explanation="Job postings are a leading indicator of economic shifts. The vertical spike indicates that companies are aggressively retooling their workforce for an AI-first world."
                metric="20x"
                metricLabel="Growth in AI Job Postings"
                source="Indeed Hiring Lab / LinkedIn"
                sourceLink="https://www.hiringlab.org/"
                color="emerald"
                align="left"
            >
                <LineChart data={laborData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="index" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981' }} name="Job Postings Index" />
                </LineChart>
            </StoryCard>

            <StoryCard
                icon={TrendingUp}
                title="The Gold Rush"
                description="Follow the money. Generative AI is consuming the lion's share of global venture capital. Investors are betting that this is the next major platform shift, bigger than Mobile or Cloud."
                explanation="Investment volume signals market confidence. The disparity between Generative AI and other sectors shows that the market views this as the primary driver of future value."
                metric="$25.2B"
                metricLabel="GenAI Investment (2023)"
                source="Stanford HAI Index 2024"
                sourceLink="https://aiindex.stanford.edu/report/"
                color="amber"
                align="right"
            >
                <BarChart data={investmentData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                    <XAxis type="number" stroke="#64748b" />
                    <YAxis dataKey="sector" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#f59e0b" radius={[0, 6, 6, 0]} barSize={40} name="Investment ($B)" />
                </BarChart>
            </StoryCard>

            <StoryCard
                icon={GitBranch}
                title="Open vs. Closed"
                description="The gap is closing. Open weights models (Llama 3, Mistral) are now within striking distance of proprietary giants (GPT-4), driving rapid commoditization and accessibility."
                explanation="The 'Chatbot Arena Elo' is a crowdsourced leaderboard where humans vote on which model is better. High scores for 'Open' models mean powerful AI is becoming free and accessible to everyone, not just big tech."
                metric="Closing"
                metricLabel="Performance Gap"
                source="LMSYS Chatbot Arena"
                sourceLink="https://chat.lmsys.org/?leaderboard"
                color="violet"
                align="left"
            >
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis type="number" dataKey="x" name="Cost/Size" stroke="#64748b" label={{ value: 'Model Size (Billions of Params)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} />
                    <YAxis type="number" dataKey="y" name="Performance" stroke="#64748b" domain={[1100, 1300]} label={{ value: 'Arena Elo Score', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                    <Legend />
                    <Scatter name="Closed Source" data={openClosedData.filter(d => d.type === 'Closed')} fill="#8b5cf6" shape="circle" />
                    <Scatter name="Open Source" data={openClosedData.filter(d => d.type === 'Open')} fill="#f59e0b" shape="triangle" />
                </ScatterChart>
            </StoryCard>

            <StoryCard
                icon={Battery}
                title="The Physical Constraint"
                description="Intelligence requires energy. The computational hunger of AI is now rivaling the energy consumption of entire nations. Efficiency is the next frontier."
                explanation="TWh (Terawatt-hours) measures massive energy usage. Comparing AI to a country like Ireland puts the scale of this physical infrastructure into perspective."
                metric="40 TWh"
                metricLabel="Est. AI Energy Usage"
                source="IEA Electricity 2024"
                sourceLink="https://www.iea.org/reports/electricity-2024"
                color="rose"
                align="right"
            >
                <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="entity" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} name="Energy (TWh/Year)">
                        {energyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.entity.includes('AI') ? '#ef4444' : '#475569'} />
                        ))}
                    </Bar>
                </BarChart>
            </StoryCard>

        </div>
    );
}
