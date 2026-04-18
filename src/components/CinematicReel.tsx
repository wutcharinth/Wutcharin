import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   CinematicReel — fast, AI-focused motion-graphic showreel.
   No name repetition. Pure visual storytelling about the work and AI expertise.
───────────────────────────────────────────────────────────────────────────── */

// ── Neural-network particle canvas ──────────────────────────────────────────
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
            // connections
            for (let i = 0; i < pts.length; i++) {
                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < MAX_DIST) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(139,92,246,${(1 - d / MAX_DIST) * 0.18})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.stroke();
                    }
                }
            }
            // nodes
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = cv.width; if (p.x > cv.width) p.x = 0;
                if (p.y < 0) p.y = cv.height; if (p.y > cv.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(139,92,246,0.45)';
                ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        };
        resize(); draw();
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, [ref]);
}

// ── Animated counter ─────────────────────────────────────────────────────────
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

// ── Variants ─────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const up: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
    exit: { opacity: 0, y: -14, transition: { duration: 0.3 } },
};
const stg: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
    exit: {},
};
const itm: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ── Scene config ─────────────────────────────────────────────────────────────
const SCENES = [
    { id: 0, dur: 3000 },   // Hook
    { id: 1, dur: 3800 },   // AI Agents
    { id: 2, dur: 3400 },   // Data Investigations
    { id: 3, dur: 3000 },   // Expertise
    { id: 4, dur: 5000 },   // CTA
];
const TOTAL = SCENES.reduce((s, sc) => s + sc.dur, 0);

// ── SCENE 0 — Hook ───────────────────────────────────────────────────────────
function S0() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-5 text-center">
            {/* Pulse rings */}
            <div className="relative flex items-center justify-center mb-2">
                {[0, 1, 2].map(i => (
                    <motion.div key={i}
                        className="absolute rounded-full border border-violet-500/30"
                        initial={{ width: 24, height: 24, opacity: 0.8 }}
                        animate={{ width: 24 + i * 52, height: 24 + i * 52, opacity: 0 }}
                        transition={{ duration: 2.2, delay: i * 0.55, repeat: Infinity, ease: 'easeOut' }} />
                ))}
                <div className="w-5 h-5 rounded-full bg-violet-500 blur-[2px] shadow-[0_0_18px_6px_rgba(139,92,246,0.6)]" />
            </div>
            <motion.div variants={itm}
                className="text-[10px] font-mono tracking-[0.22em] uppercase text-violet-400/70">
                What's being built here
            </motion.div>
            <motion.div variants={itm}
                className="text-[clamp(2.6rem,8vw,5.5rem)] font-black leading-none tracking-tight text-slate-100">
                Agentic AI
            </motion.div>
            <motion.div variants={itm}
                className="text-[clamp(1.1rem,3.5vw,2.2rem)] font-light leading-tight"
                style={{ background: 'linear-gradient(90deg,#a78bfa,#e879f9,#22d3ee)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                that actually works.
            </motion.div>
            <motion.p variants={itm}
                className="text-slate-500 text-sm max-w-sm font-light leading-relaxed tracking-wide">
                From autonomous agents to data investigations — everything on this page solves a real problem.
            </motion.p>
        </motion.div>
    );
}

// ── SCENE 1 — AI Agents (node network) ───────────────────────────────────────
const AGENTS = [
    { name: 'RiskGuard', sub: 'Audit & Control', color: '#f43f5e' },
    { name: 'ProjectFlow', sub: 'Scrum Automation', color: '#3b82f6' },
    { name: 'ReviewFlow', sub: 'Reputation Engine', color: '#f59e0b' },
    { name: 'QueryFlow', sub: 'NL → SQL', color: '#8b5cf6' },
    { name: 'Collections', sub: 'Dispute Resolution', color: '#10b981' },
    { name: 'SlipVerify', sub: 'Fraud Detection', color: '#a855f7' },
];

function AgentNodes() {
    // Hexagonal arrangement: 3 top, 3 bottom
    const positions = [
        { x: '15%', y: '20%' }, { x: '50%', y: '8%' }, { x: '85%', y: '20%' },
        { x: '15%', y: '75%' }, { x: '50%', y: '87%' }, { x: '85%', y: '75%' },
    ];
    // Lines between nodes
    const lines = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[1,3],[1,5]];

    return (
        <div className="relative w-full h-40 sm:h-52 mb-2">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {lines.map(([a, b], idx) => {
                    const pa = positions[a], pb = positions[b];
                    const x1 = parseFloat(pa.x), y1 = parseFloat(pa.y);
                    const x2 = parseFloat(pb.x), y2 = parseFloat(pb.y);
                    return (
                        <motion.line key={idx}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="rgba(139,92,246,0.2)" strokeWidth="0.4"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 + idx * 0.08 }} />
                    );
                })}
            </svg>
            {AGENTS.map((a, i) => (
                <motion.div key={a.name}
                    className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: positions[i].x, top: positions[i].y }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.45, delay: 0.15 + i * 0.12, ease: EASE }}>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full shadow-lg flex-shrink-0"
                        style={{ background: a.color, boxShadow: `0 0 12px 3px ${a.color}55` }} />
                    <div className="text-center hidden sm:block">
                        <div className="text-[9px] font-bold leading-tight" style={{ color: a.color }}>{a.name}</div>
                        <div className="text-[8px] text-slate-600 font-mono">{a.sub}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function S1() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-4 text-center w-full max-w-xl">
            <motion.div variants={itm} className="text-[10px] font-mono tracking-[0.2em] uppercase text-cyan-400/70">
                AI Agents · Autonomous · Enterprise-grade
            </motion.div>
            <AgentNodes />
            <motion.div variants={itm}
                className="text-[clamp(1.8rem,5.5vw,3.8rem)] font-black leading-tight tracking-tight text-slate-100">
                <Counter to={20} dur={1400} suffix="+" /> autonomous agents.<br />
                <span className="text-slate-500 font-light text-[clamp(1rem,3vw,1.8rem)]">Shipped. Running. Delivering.</span>
            </motion.div>
        </motion.div>
    );
}

// ── SCENE 2 — Data Investigations ────────────────────────────────────────────
const DATA_STORIES = [
    { label: 'Thailand Election 2026 — Statistical Investigation', pct: 91, color: '#ef4444', tag: '382 districts · Official ECT data' },
    { label: 'Agentic AI Deep Dive — Stanford CS230', pct: 78, color: '#a78bfa', tag: 'Interactive lecture insight' },
    { label: 'AI Evolution — Parameters to Context Revolution', pct: 85, color: '#e879f9', tag: 'Exponential data visualization' },
];

function S2() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-5 text-center w-full max-w-2xl">
            <motion.div variants={itm} className="text-[10px] font-mono tracking-[0.2em] uppercase text-orange-400/70">
                Data Journalism · Investigation · Storytelling
            </motion.div>
            <motion.div variants={itm}
                className="text-[clamp(1.8rem,5.5vw,3.5rem)] font-black leading-tight tracking-tight">
                <span style={{ background: 'linear-gradient(135deg,#f1f5f9 30%,#fb923c)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                    Complex data.<br />Unmissable stories.
                </span>
            </motion.div>
            <motion.div variants={stg} className="flex flex-col gap-3 w-full text-left">
                {DATA_STORIES.map((d, i) => (
                    <motion.div key={d.label} variants={itm} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400 font-medium truncate pr-4">{d.label}</span>
                            <span className="text-[10px] font-mono flex-shrink-0" style={{ color: d.color }}>{d.pct}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div className="h-full rounded-full"
                                style={{ background: d.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${d.pct}%` }}
                                transition={{ duration: 1.1, delay: 0.3 + i * 0.15, ease: EASE }} />
                        </div>
                        <div className="text-[9px] text-slate-600 font-mono">{d.tag}</div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

// ── SCENE 3 — Expertise tags ──────────────────────────────────────────────────
const TAGS = [
    { t: 'Agentic AI', c: '#a78bfa' }, { t: 'LangGraph', c: '#8b5cf6' }, { t: 'LLMs', c: '#e879f9' },
    { t: 'RAG Pipelines', c: '#22d3ee' }, { t: 'AI Strategy', c: '#38bdf8' },
    { t: 'Data Journalism', c: '#fb923c' }, { t: 'Prompt Engineering', c: '#f59e0b' },
    { t: 'Multi-Agent Systems', c: '#10b981' }, { t: 'Business Intelligence', c: '#34d399' },
    { t: 'Interactive Viz', c: '#f43f5e' }, { t: 'Executive Leadership', c: '#94a3b8' },
];

function S3() {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-6 text-center w-full max-w-xl">
            <motion.div variants={itm} className="text-[10px] font-mono tracking-[0.2em] uppercase text-violet-400/70">
                AI Strategy & Expertise
            </motion.div>
            <motion.div variants={itm}
                className="text-[clamp(2rem,6vw,4rem)] font-black leading-none tracking-tight text-slate-100">
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

// ── SCENE 4 — CTA ────────────────────────────────────────────────────────────
const CAPS = ['AI Strategy Advisory', 'Consulting', 'Speaking & Events'];

function S4({ onSkip }: { onSkip: () => void }) {
    return (
        <motion.div variants={stg} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-6 text-center">
            {/* Glow orb */}
            <motion.div
                className="w-20 h-20 rounded-full"
                style={{ background: 'radial-gradient(circle,#7c3aed,#4f46e5 50%,transparent 75%)', filter: 'blur(1px)', boxShadow: '0 0 60px 20px rgba(109,40,217,0.4)' }}
                animate={{ scale: [1, 1.08, 1] }}
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
                <button
                    onClick={() => { onSkip(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="group px-8 py-3 rounded-full bg-white text-slate-950 font-semibold text-sm tracking-wide hover:bg-slate-100 transition-colors flex items-center gap-2">
                    See the work
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
                <button
                    onClick={() => { onSkip(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="px-8 py-3 rounded-full border border-white/12 text-white/60 hover:text-white font-medium text-sm tracking-wide hover:bg-white/5 transition-colors">
                    Get in touch
                </button>
            </motion.div>
        </motion.div>
    );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function CinematicReel() {
    const cvRef = useRef<HTMLCanvasElement>(null);
    const secRef = useRef<HTMLElement>(null);
    const rafRef = useRef<number>(0);
    const t0Ref = useRef<number | null>(null);
    const [scene, setScene] = useState(-1);
    const [pct, setPct] = useState(0);
    const [done, setDone] = useState(false);

    useNeuralCanvas(cvRef);

    const tick = useCallback((ts: number) => {
        if (!t0Ref.current) t0Ref.current = ts;
        const el = ts - t0Ref.current;
        setPct(Math.min((el / TOTAL) * 100, 100));
        let acc = 0, idx = SCENES.length - 1;
        for (let i = 0; i < SCENES.length; i++) {
            acc += SCENES[i].dur;
            if (el < acc) { idx = i; break; }
        }
        setScene(idx);
        if (el >= TOTAL) { setDone(true); return; }
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    const skip = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        setDone(true); setPct(100); setScene(4);
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
                    {scene === 0 && <motion.div key="s0" className="w-full flex justify-center" {...{ variants: up, initial: 'hidden', animate: 'show', exit: 'exit' }}><S0 /></motion.div>}
                    {scene === 1 && <motion.div key="s1" className="w-full flex justify-center" {...{ variants: up, initial: 'hidden', animate: 'show', exit: 'exit' }}><S1 /></motion.div>}
                    {scene === 2 && <motion.div key="s2" className="w-full flex justify-center" {...{ variants: up, initial: 'hidden', animate: 'show', exit: 'exit' }}><S2 /></motion.div>}
                    {scene === 3 && <motion.div key="s3" className="w-full flex justify-center" {...{ variants: up, initial: 'hidden', animate: 'show', exit: 'exit' }}><S3 /></motion.div>}
                    {(scene === 4 || done) && <motion.div key="s4" className="w-full flex justify-center" {...{ variants: up, initial: 'hidden', animate: 'show', exit: 'exit' }}><S4 onSkip={skip} /></motion.div>}
                </AnimatePresence>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-2 z-20">
                {/* Scene dots */}
                <div className="flex items-center gap-1.5">
                    {SCENES.map((sc, i) => (
                        <motion.div key={sc.id}
                            className="rounded-full"
                            animate={{ width: i === scene ? 18 : 5, background: i <= scene ? '#a78bfa' : 'rgba(148,163,184,0.18)' }}
                            style={{ height: 5 }}
                            transition={{ duration: 0.35 }} />
                    ))}
                </div>
                {/* Progress bar */}
                <div className="w-full h-[2px] bg-white/5">
                    <motion.div className="h-full"
                        style={{ background: 'linear-gradient(90deg,#6d28d9,#a78bfa,#22d3ee)', width: `${pct}%` }} />
                </div>
            </div>

            {/* Skip */}
            {!done && (
                <button onClick={skip}
                    className="absolute top-4 right-5 z-20 text-[10px] font-mono tracking-[0.14em] uppercase text-slate-700 hover:text-slate-400 transition-colors border border-slate-800 hover:border-slate-600 rounded-full px-3 py-1.5">
                    SKIP ✕
                </button>
            )}
        </section>
    );
}
