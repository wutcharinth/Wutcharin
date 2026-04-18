import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   CinematicReel — AI-focused motion-graphic showreel.
   7 scenes, loops continuously, no name repetition.
───────────────────────────────────────────────────────────────────────────── */

// ── Neural-network particle canvas ───────────────────────────────────────────
function useNeuralCanvas(ref: React.RefObject<HTMLCanvasElement | null>) {
    useEffect(() => {
        const cv = ref.current; if (!cv) return;
        const ctx = cv.getContext('2d'); if (!ctx) return;
        type P = { x: number; y: number; vx: number; vy: number };
        let pts: P[] = []; let raf = 0;
        const MAX_DIST = 130;
        const resize = () => {
            cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
            pts = Array.from({ length: Math.floor((cv.width * cv.height) / 9000) }, () => ({
                x: Math.random() * cv.width, y: Math.random() * cv.height,
                vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
            }));
        };
        const draw = () => {
            ctx.clearRect(0, 0, cv.width, cv.height);
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < MAX_DIST) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(139,92,246,${(1 - d / MAX_DIST) * 0.18})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.stroke();
                    }
                }
            }
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = cv.width; if (p.x > cv.width) p.x = 0;
                if (p.y < 0) p.y = cv.height; if (p.y > cv.height) p.y = 0;
                ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(139,92,246,0.45)'; ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        };
        resize(); draw();
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, [ref]);
}

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ to, dur = 1600, suffix = '' }: { to: number; dur?: number; suffix?: string }) {
    const [v, setV] = useState(0);
    useEffect(() => {
        let s: number | null = null;
        const f = (t: number) => {
            if (!s) s = t;
            const p = Math.min((t - s) / dur, 1);
            setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
            if (p < 1) requestAnimationFrame(f);
        };
        const id = requestAnimationFrame(f);
        return () => cancelAnimationFrame(id);
    }, [to, dur]);
    return <>{v}{suffix}</>;
}

// ── Shared variants ───────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const up: Variants = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.35 } },
};
const stg: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } }, exit: {} };
const itm: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
    exit: { opacity: 0, transition: { duration: 0.25 } },
};

// ── Pill label ────────────────────────────────────────────────────────────────
function Pill({ children, color = '#a78bfa' }: { children: React.ReactNode; color?: string }) {
    return (
        <span className="inline-block text-[10px] font-mono tracking-[0.2em] uppercase px-3 py-0.5 rounded-full border"
            style={{ color, borderColor: `${color}35`, background: `${color}0d` }}>
            {children}
        </span>
    );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCENES
// ══════════════════════════════════════════════════════════════════════════════

// Scene 0 — Hook ──────────────────────────────────────────────────────────────
function S0() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-5 text-center">
            <div className="relative flex items-center justify-center mb-1">
                {[0, 1, 2].map(i => (
                    <motion.div key={i} className="absolute rounded-full border border-violet-500/30"
                        initial={{ width: 24, height: 24, opacity: 0.7 }}
                        animate={{ width: 24 + i * 56, height: 24 + i * 56, opacity: 0 }}
                        transition={{ duration: 2.4, delay: i * 0.6, repeat: Infinity, ease: 'easeOut' }} />
                ))}
                <div className="w-5 h-5 rounded-full bg-violet-500 blur-[2px] shadow-[0_0_18px_6px_rgba(139,92,246,0.6)]" />
            </div>
            <motion.div variants={itm}><Pill>What's being built here</Pill></motion.div>
            <motion.div variants={itm}
                className="text-[clamp(2.8rem,9vw,6rem)] font-black leading-none tracking-tight text-slate-100">
                Agentic AI
            </motion.div>
            <motion.div variants={itm}
                className="text-[clamp(1.1rem,3.5vw,2.2rem)] font-light leading-tight"
                style={{ background: 'linear-gradient(90deg,#a78bfa,#e879f9,#22d3ee)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                that actually works.
            </motion.div>
            <motion.p variants={itm} className="text-slate-500 text-sm max-w-sm leading-relaxed">
                From autonomous agents to data investigations — everything on this page solves a real problem.
            </motion.p>
        </motion.div>
    );
}

// Scene 1 — AI Agents (node graph) ────────────────────────────────────────────
const AGENTS = [
    { name: 'RiskGuard', sub: 'Audit & Control', color: '#f43f5e' },
    { name: 'ProjectFlow', sub: 'Scrum Automation', color: '#3b82f6' },
    { name: 'ReviewFlow', sub: 'Reputation Engine', color: '#f59e0b' },
    { name: 'QueryFlow', sub: 'NL → SQL', color: '#8b5cf6' },
    { name: 'Collections', sub: 'Dispute Resolution', color: '#10b981' },
    { name: 'SlipVerify', sub: 'Fraud Detection', color: '#a855f7' },
];
const POS = [
    { x: '15%', y: '20%' }, { x: '50%', y: '8%' }, { x: '85%', y: '20%' },
    { x: '15%', y: '78%' }, { x: '50%', y: '90%' }, { x: '85%', y: '78%' },
];
const LINES = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[1,3],[1,5]];

function S1() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-4 text-center w-full max-w-xl">
            <motion.div variants={itm}><Pill color="#22d3ee">AI Agents · Autonomous · Enterprise-grade</Pill></motion.div>
            <div className="relative w-full h-44 sm:h-56">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {LINES.map(([a, b], i) => {
                        const x1 = parseFloat(POS[a].x), y1 = parseFloat(POS[a].y);
                        const x2 = parseFloat(POS[b].x), y2 = parseFloat(POS[b].y);
                        return (
                            <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke="rgba(139,92,246,0.22)" strokeWidth="0.5"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 + i * 0.07 }} />
                        );
                    })}
                </svg>
                {AGENTS.map((a, i) => (
                    <motion.div key={a.name}
                        className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
                        style={{ left: POS[i].x, top: POS[i].y }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.15 + i * 0.11, ease: EASE }}>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex-shrink-0"
                            style={{ background: a.color, boxShadow: `0 0 14px 4px ${a.color}55` }} />
                        <div className="text-center hidden sm:block">
                            <div className="text-[9px] font-bold" style={{ color: a.color }}>{a.name}</div>
                            <div className="text-[8px] text-slate-600 font-mono">{a.sub}</div>
                        </div>
                    </motion.div>
                ))}
            </div>
            <motion.div variants={itm}
                className="text-[clamp(1.8rem,5.5vw,3.8rem)] font-black leading-tight tracking-tight text-slate-100">
                <Counter to={20} dur={1600} suffix="+" /> autonomous agents.<br />
                <span className="text-slate-500 font-light text-[clamp(.9rem,2.8vw,1.7rem)]">Shipped. Running. Delivering.</span>
            </motion.div>
        </motion.div>
    );
}

// Scene 2 — Data Investigations ───────────────────────────────────────────────
const DATA_STORIES = [
    { label: 'Thailand Election 2026 — Statistical Investigation', pct: 91, color: '#ef4444', tag: '382 districts · Official ECT data · 4 anomalies' },
    { label: 'Agentic AI Deep Dive — Stanford CS230', pct: 78, color: '#a78bfa', tag: 'Interactive lecture · Jagged frontier · ReAct patterns' },
    { label: 'AI Evolution — Parameters to Context Revolution', pct: 85, color: '#e879f9', tag: 'Exponential data visualization · Model ELO charts' },
];

function S2() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-5 text-center w-full max-w-2xl">
            <motion.div variants={itm}><Pill color="#fb923c">Data Journalism · Investigation · Storytelling</Pill></motion.div>
            <motion.div variants={itm}
                className="text-[clamp(1.8rem,5.5vw,3.5rem)] font-black leading-tight tracking-tight">
                <span style={{ background: 'linear-gradient(135deg,#f1f5f9 30%,#fb923c)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                    Complex data.<br />Unmissable stories.
                </span>
            </motion.div>
            <motion.div variants={stg} className="flex flex-col gap-3.5 w-full text-left">
                {DATA_STORIES.map((d, i) => (
                    <motion.div key={d.label} variants={itm} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-xs text-slate-400 font-medium truncate">{d.label}</span>
                            <span className="text-[10px] font-mono flex-shrink-0" style={{ color: d.color }}>{d.pct}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800/80 rounded-full overflow-hidden">
                            <motion.div className="h-full rounded-full" style={{ background: d.color }}
                                initial={{ width: 0 }} animate={{ width: `${d.pct}%` }}
                                transition={{ duration: 1.2, delay: 0.3 + i * 0.18, ease: EASE }} />
                        </div>
                        <div className="text-[9px] text-slate-600 font-mono">{d.tag}</div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

// Scene 3 — Expertise tags ────────────────────────────────────────────────────
const TAGS = [
    { t: 'Agentic AI', c: '#a78bfa' }, { t: 'LangGraph', c: '#8b5cf6' },
    { t: 'LLMs', c: '#e879f9' }, { t: 'RAG Pipelines', c: '#22d3ee' },
    { t: 'AI Strategy', c: '#38bdf8' }, { t: 'Prompt Engineering', c: '#f59e0b' },
    { t: 'Multi-Agent Systems', c: '#10b981' }, { t: 'Data Journalism', c: '#fb923c' },
    { t: 'Business Intelligence', c: '#34d399' }, { t: 'Interactive Viz', c: '#f43f5e' },
    { t: 'Executive Leadership', c: '#94a3b8' }, { t: 'AI Architecture', c: '#818cf8' },
];

function S3() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-6 text-center w-full max-w-xl">
            <motion.div variants={itm}><Pill>AI Strategy & Expertise</Pill></motion.div>
            <motion.div variants={itm}
                className="text-[clamp(2rem,6vw,4.2rem)] font-black leading-none tracking-tight text-slate-100">
                Strategy.<br />Architecture.<br />Execution.
            </motion.div>
            <motion.div variants={stg} className="flex flex-wrap justify-center gap-2">
                {TAGS.map(({ t, c }) => (
                    <motion.span key={t} variants={itm}
                        className="text-[11px] font-mono px-3 py-1 rounded-full border"
                        style={{ color: c, borderColor: `${c}35`, background: `${c}0d` }}>
                        {t}
                    </motion.span>
                ))}
            </motion.div>
        </motion.div>
    );
}

// Scene 4 — Analytics & Business Strategy ────────────────────────────────────
const STRAT_CAPS = [
    {
        title: 'Strategic AI Advisory',
        sub: 'Roadmaps · Digital transformation · Board-level alignment',
        color: '#22d3ee',
        icon: '◈',
    },
    {
        title: 'Business Intelligence',
        sub: 'Dashboards · KPIs · Executive reporting · Decision pipelines',
        color: '#34d399',
        icon: '◉',
    },
    {
        title: 'Predictive Analytics',
        sub: 'Forecasting · Pattern recognition · Data-driven risk modeling',
        color: '#38bdf8',
        icon: '◐',
    },
    {
        title: 'Organisational AI',
        sub: 'Team upskilling · AI literacy · Process redesign · Culture shift',
        color: '#a3e635',
        icon: '◍',
    },
];

function SStrat() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-5 text-center w-full max-w-2xl">
            <motion.div variants={itm}><Pill color="#22d3ee">Analytics · BI · Business Strategy</Pill></motion.div>
            <motion.div variants={itm}
                className="text-[clamp(1.9rem,5.5vw,3.6rem)] font-black leading-tight tracking-tight">
                <span style={{ background: 'linear-gradient(135deg,#f1f5f9 20%,#22d3ee 55%,#34d399 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                    AI meets<br />business reality.
                </span>
            </motion.div>
            <motion.p variants={itm} className="text-slate-500 text-sm max-w-md leading-relaxed">
                The technical side only matters when it moves the business forward — strategy, intelligence, and execution together.
            </motion.p>
            <motion.div variants={stg} className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {STRAT_CAPS.map(c => (
                    <motion.div key={c.title} variants={itm}
                        className="flex items-start gap-3 rounded-xl border px-4 py-3.5"
                        style={{ background: `${c.color}07`, borderColor: `${c.color}22` }}>
                        <span className="text-lg leading-none flex-shrink-0 mt-0.5" style={{ color: c.color }}>{c.icon}</span>
                        <div>
                            <div className="text-sm font-semibold mb-0.5" style={{ color: c.color }}>{c.title}</div>
                            <div className="text-[10px] text-slate-500 font-mono leading-relaxed">{c.sub}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

// Scene 5 — Interactive Lecture Insights ──────────────────────────────────────
const INSIGHTS = [
    { title: 'Karpathy LLM Guide', sub: 'Token visualizers · Model ELO', color: '#818cf8', icon: '🧠' },
    { title: 'Agentic AI Deep Dive', sub: 'Stanford CS230 · HyDE · ReAct', color: '#a78bfa', icon: '🤖' },
    { title: 'The Human Edge', sub: "Po-Shen Loh's philosophy · AI era", color: '#22d3ee', icon: '💡' },
    { title: 'AI Evolution Stats', sub: 'Parameter explosion · Context rev.', color: '#e879f9', icon: '📈' },
    { title: 'Future of Work', sub: 'Automation vs transformation', color: '#34d399', icon: '🌐' },
    { title: 'Thai Election 2566', sub: 'RAG chatbot · Data storytelling', color: '#fb923c', icon: '🗳' },
];

function S4() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-5 text-center w-full max-w-2xl">
            <motion.div variants={itm}><Pill color="#818cf8">Interactive Lecture Insights</Pill></motion.div>
            <motion.div variants={itm}
                className="text-[clamp(1.8rem,5.5vw,3.5rem)] font-black leading-tight tracking-tight">
                <span style={{ background: 'linear-gradient(135deg,#f1f5f9 20%,#818cf8 60%,#e879f9)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                    Profound ideas.<br />Made interactive.
                </span>
            </motion.div>
            <motion.div variants={stg} className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
                {INSIGHTS.map(ins => (
                    <motion.div key={ins.title} variants={itm}
                        className="flex items-start gap-2.5 border border-slate-800/70 rounded-xl px-3 py-3 text-left"
                        style={{ background: `${ins.color}08`, borderColor: `${ins.color}20` }}>
                        <span className="text-base leading-none mt-0.5">{ins.icon}</span>
                        <div>
                            <div className="text-[11px] font-semibold leading-tight mb-0.5" style={{ color: ins.color }}>{ins.title}</div>
                            <div className="text-[9px] text-slate-600 font-mono leading-tight">{ins.sub}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

// Scene 5 — Impact at Scale (NEW) ─────────────────────────────────────────────
const IMPACT = [
    { val: 20, suffix: '+', label: 'Autonomous AI\nSystems in Production', color: '#a78bfa', grad: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
    { val: 30, suffix: '+', label: 'AI-Powered\nProducts Built', color: '#22d3ee', grad: 'linear-gradient(135deg,#22d3ee,#0891b2)' },
    { val: 10, suffix: '+', label: 'Public Data\nInvestigations', color: '#e879f9', grad: 'linear-gradient(135deg,#e879f9,#a855f7)' },
    { val: 15, suffix: '+', label: 'Interactive AI\nExperiences Deployed', color: '#34d399', grad: 'linear-gradient(135deg,#34d399,#10b981)' },
];

function S5() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-6 text-center w-full max-w-2xl">
            <motion.div variants={itm}><Pill color="#34d399">What's been built</Pill></motion.div>
            <motion.div variants={itm}
                className="text-[clamp(1.8rem,5vw,3.2rem)] font-black leading-tight tracking-tight text-slate-100">
                Built. Deployed.<br />
                <span className="text-slate-500 font-light text-[clamp(.9rem,2.8vw,1.6rem)]">Running in the real world.</span>
            </motion.div>
            <motion.div variants={stg} className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                {IMPACT.map((s, i) => (
                    <motion.div key={s.label} variants={itm}
                        className="flex flex-col items-center gap-2 border border-slate-800/60 rounded-2xl py-5 px-3"
                        style={{ background: `${s.color}07` }}>
                        <div className="text-[clamp(2rem,6vw,3.2rem)] font-black leading-none"
                            style={{ backgroundImage: s.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                            <Counter to={s.val} dur={1400 + i * 100} suffix={s.suffix} />
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest leading-relaxed whitespace-pre-line">
                            {s.label}
                        </div>
                        <div className="w-full h-px rounded-full overflow-hidden bg-slate-800">
                            <motion.div className="h-full rounded-full" style={{ background: s.grad }}
                                initial={{ width: 0 }} animate={{ width: `${(s.val / (s.suffix === 'yrs' ? 25 : s.val)) * 80 + 20}%` }}
                                transition={{ duration: 1.4, delay: 0.3 + i * 0.12, ease: EASE }} />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

// Scene 6 — CTA ───────────────────────────────────────────────────────────────
const CAPS = ['AI Strategy Advisory', 'Consulting', 'Speaking & Events'];

function S6({ onSkip }: { onSkip: () => void }) {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-6 text-center">
            <motion.div
                className="w-20 h-20 rounded-full"
                style={{ background: 'radial-gradient(circle,#7c3aed,#4f46e5 50%,transparent 75%)', filter: 'blur(1px)', boxShadow: '0 0 60px 20px rgba(109,40,217,0.4)' }}
                animate={{ scale: [1, 1.09, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} />
            <motion.div variants={itm}
                className="text-[clamp(2.2rem,6.5vw,4.8rem)] font-black tracking-tight leading-none text-slate-100">
                Let's explore<br />
                <span style={{ background: 'linear-gradient(90deg,#a78bfa,#e879f9,#22d3ee)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                    what AI can unlock.
                </span>
            </motion.div>
            <motion.div variants={stg} className="flex flex-wrap justify-center gap-2">
                {CAPS.map(c => (
                    <motion.span key={c} variants={itm}
                        className="text-[11px] font-mono px-3.5 py-1.5 rounded-full border border-violet-500/25 text-violet-300/70 bg-violet-500/8 tracking-wide">
                        {c}
                    </motion.span>
                ))}
            </motion.div>
            <motion.div variants={itm} className="flex flex-col sm:flex-row items-center gap-3 mt-1">
                <button onClick={() => { onSkip(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="group px-8 py-3 rounded-full bg-white text-slate-950 font-semibold text-sm tracking-wide hover:bg-slate-100 transition-colors flex items-center gap-2">
                    See the work
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
                <button onClick={() => { onSkip(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="px-8 py-3 rounded-full border border-white/12 text-white/60 hover:text-white font-medium text-sm tracking-wide hover:bg-white/5 transition-colors">
                    Get in touch
                </button>
            </motion.div>
        </motion.div>
    );
}

// ── Scene config (durations in ms) ────────────────────────────────────────────
const SCENES = [
    { id: 0, dur: 4000 },   // Hook
    { id: 1, dur: 4800 },   // AI Agents
    { id: 2, dur: 4400 },   // Data Stories
    { id: 3, dur: 4000 },   // Expertise
    { id: 4, dur: 4200 },   // Analytics & Business Strategy
    { id: 5, dur: 4500 },   // Interactive Insights
    { id: 6, dur: 4500 },   // Impact
    { id: 7, dur: 6000 },   // CTA
];
const TOTAL = SCENES.reduce((s, sc) => s + sc.dur, 0);

// ── Main component ────────────────────────────────────────────────────────────
export default function CinematicReel() {
    const cvRef = useRef<HTMLCanvasElement>(null);
    const secRef = useRef<HTMLElement>(null);
    const rafRef = useRef<number>(0);
    const t0Ref = useRef<number | null>(null);
    const [scene, setScene] = useState(-1);
    const [pct, setPct] = useState(0);
    const [skipped, setSkipped] = useState(false); // true only if user manually skips

    useNeuralCanvas(cvRef);

    const tick = useCallback((ts: number) => {
        if (!t0Ref.current) t0Ref.current = ts;
        let el = ts - t0Ref.current;

        // Loop: when full cycle ends, restart from scene 0
        if (el >= TOTAL) {
            t0Ref.current = ts;
            el = 0;
        }

        setPct((el / TOTAL) * 100);

        let acc = 0, idx = SCENES.length - 1;
        for (let i = 0; i < SCENES.length; i++) {
            acc += SCENES[i].dur;
            if (el < acc) { idx = i; break; }
        }
        setScene(idx);
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    const skip = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        setSkipped(true);
        setScene(6);
        setPct(100);
    }, []);

    useEffect(() => {
        const el = secRef.current; if (!el) return;
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !t0Ref.current) {
                rafRef.current = requestAnimationFrame(tick);
                obs.disconnect();
            }
        }, { threshold: 0.2 });
        obs.observe(el);
        return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current); };
    }, [tick]);

    return (
        <section ref={secRef}
            className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
            style={{ background: '#020617' }}
            aria-label="AI expertise reel">

            {/* Neural net canvas */}
            <canvas ref={cvRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-60" />

            {/* Radial vignette */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%,transparent 20%,rgba(2,6,23,.95) 100%)' }} />

            {/* Scene stage */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-24 flex items-center justify-center min-h-[65vh]">
                <AnimatePresence mode="wait">
                    {scene === 0 && <motion.div key="s0" className="w-full flex justify-center" variants={up} initial="hidden" animate="show" exit="exit"><S0 /></motion.div>}
                    {scene === 1 && <motion.div key="s1" className="w-full flex justify-center" variants={up} initial="hidden" animate="show" exit="exit"><S1 /></motion.div>}
                    {scene === 2 && <motion.div key="s2" className="w-full flex justify-center" variants={up} initial="hidden" animate="show" exit="exit"><S2 /></motion.div>}
                    {scene === 3 && <motion.div key="s3" className="w-full flex justify-center" variants={up} initial="hidden" animate="show" exit="exit"><S3 /></motion.div>}
                    {scene === 4 && <motion.div key="s4" className="w-full flex justify-center" variants={up} initial="hidden" animate="show" exit="exit"><SStrat /></motion.div>}
                    {scene === 5 && <motion.div key="s5" className="w-full flex justify-center" variants={up} initial="hidden" animate="show" exit="exit"><S4 /></motion.div>}
                    {scene === 6 && <motion.div key="s6" className="w-full flex justify-center" variants={up} initial="hidden" animate="show" exit="exit"><S5 /></motion.div>}
                    {(scene === 7 || skipped) && <motion.div key="s7" className="w-full flex justify-center" variants={up} initial="hidden" animate="show" exit="exit"><S6 onSkip={skip} /></motion.div>}
                </AnimatePresence>
            </div>

            {/* Scene dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {SCENES.map((sc, i) => (
                    <motion.div key={sc.id} className="rounded-full"
                        animate={{ width: i === scene ? 18 : 5, background: i === scene ? '#a78bfa' : 'rgba(148,163,184,0.18)' }}
                        style={{ height: 5 }}
                        transition={{ duration: 0.3 }} />
                ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20">
                <motion.div className="h-full"
                    style={{ background: 'linear-gradient(90deg,#6d28d9,#a78bfa,#22d3ee)', width: `${pct}%` }} />
            </div>

            {/* Skip */}
            {!skipped && (
                <button onClick={skip}
                    className="absolute top-4 right-5 z-20 text-[10px] font-mono tracking-[0.14em] uppercase text-slate-700 hover:text-slate-400 transition-colors border border-slate-800 hover:border-slate-600 rounded-full px-3 py-1.5">
                    SKIP ✕
                </button>
            )}
        </section>
    );
}
