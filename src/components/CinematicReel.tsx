import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   CinematicReel — an auto-playing video-like hero section that previews
   Wutcharin's identity, career stats, and featured projects.
───────────────────────────────────────────────────────────────────────────── */

// ── Particle canvas ──────────────────────────────────────────────────────────
function useParticleCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
    useEffect(() => {
        const cv = canvasRef.current;
        if (!cv) return;
        const ctx = cv.getContext('2d');
        if (!ctx) return;

        type Pt = { x: number; y: number; r: number; vx: number; vy: number; a: number };
        let pts: Pt[] = [];
        let raf = 0;

        const resize = () => {
            cv.width = cv.offsetWidth;
            cv.height = cv.offsetHeight;
            pts = Array.from({ length: Math.floor((cv.width * cv.height) / 12000) }, () => ({
                x: Math.random() * cv.width,
                y: Math.random() * cv.height,
                r: Math.random() * 1.3 + 0.3,
                vx: (Math.random() - 0.5) * 0.15,
                vy: (Math.random() - 0.5) * 0.15,
                a: Math.random() * 0.35 + 0.05,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, cv.width, cv.height);
            pts.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = cv.width;
                if (p.x > cv.width) p.x = 0;
                if (p.y < 0) p.y = cv.height;
                if (p.y > cv.height) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(148,163,184,${p.a})`;
                ctx.fill();
            });
            raf = requestAnimationFrame(draw);
        };

        resize();
        draw();
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
    }, [canvasRef]);
}

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ target, duration = 2000, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start: number | null = null;
        const step = (ts: number) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            setVal(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(step);
        };
        const id = requestAnimationFrame(step);
        return () => cancelAnimationFrame(id);
    }, [target, duration]);
    return <>{val.toLocaleString('en')}{suffix}</>;
}

// ── Scene variants ───────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
    exit: { opacity: 0, y: -18, transition: { duration: 0.45 } },
};
const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
    exit: {},
};
const item: Variants = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
};

// ── Label pill ───────────────────────────────────────────────────────────────
function Label({ children, color = 'violet' }: { children: React.ReactNode; color?: string }) {
    const colors: Record<string, string> = {
        violet: 'border-violet-500/25 text-violet-400 bg-violet-500/8',
        cyan: 'border-cyan-500/25 text-cyan-400 bg-cyan-500/8',
        fuchsia: 'border-fuchsia-500/25 text-fuchsia-400 bg-fuchsia-500/8',
        orange: 'border-orange-500/25 text-orange-400 bg-orange-500/8',
        red: 'border-red-500/25 text-red-400 bg-red-500/8',
        emerald: 'border-emerald-500/25 text-emerald-400 bg-emerald-500/8',
    };
    return (
        <span className={`inline-block border rounded-full px-3 py-0.5 text-[10px] font-mono font-semibold tracking-[0.18em] uppercase ${colors[color] ?? colors.violet}`}>
            {children}
        </span>
    );
}

// ── Big gradient text ────────────────────────────────────────────────────────
function BigText({ children, gradient }: { children: React.ReactNode; gradient?: string }) {
    return (
        <span
            className="font-extrabold leading-none tracking-tighter"
            style={gradient ? {
                backgroundImage: gradient,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
            } : { color: '#f1f5f9' }}
        >
            {children}
        </span>
    );
}

// ── SCENE DEFINITIONS ────────────────────────────────────────────────────────
type SceneDef = { id: number; dur: number; label: string };

const SCENES: SceneDef[] = [
    { id: 0, dur: 3200, label: 'Identity' },
    { id: 1, dur: 4000, label: 'By the Numbers' },
    { id: 2, dur: 3400, label: 'Expertise' },
    { id: 3, dur: 3800, label: 'Investigations' },
    { id: 4, dur: 3800, label: 'AI Agents' },
    { id: 5, dur: 5500, label: 'Explore' },
];
const TOTAL_MS = SCENES.reduce((s, sc) => s + sc.dur, 0);

// Scene 0 — Identity
function Scene0() {
    return (
        <motion.div variants={stagger} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-5 text-center">
            <motion.div variants={item}><Label color="violet">Executive Leader · AI Innovator</Label></motion.div>
            <motion.div variants={item} className="text-[clamp(4rem,14vw,9.5rem)] leading-none font-black tracking-tight">
                <BigText gradient="linear-gradient(135deg,#f1f5f9 20%,#a78bfa 55%,#e879f9 100%)">
                    Wutcharin
                </BigText>
            </motion.div>
            <motion.div variants={item} className="text-[clamp(1rem,3.5vw,2rem)] text-slate-500 font-light tracking-[0.2em] uppercase">
                AI &nbsp;·&nbsp; Automation &nbsp;·&nbsp; Analytics
            </motion.div>
            <motion.div variants={item} className="text-slate-600 text-sm font-mono tracking-widest">
                Aviation · Travel Tech · Media · 20 years building
            </motion.div>
        </motion.div>
    );
}

// Scene 1 — Stats
function Scene1() {
    const stats = [
        { val: 20, suffix: '+', label: 'Years\nExperience', color: '#a78bfa', grad: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
        { val: 50, suffix: '+', label: 'Data\nProfessionals Led', color: '#22d3ee', grad: 'linear-gradient(135deg,#22d3ee,#0891b2)' },
        { val: 20, suffix: '+', label: 'AI Agents\nShipped', color: '#e879f9', grad: 'linear-gradient(135deg,#e879f9,#a855f7)' },
    ];
    return (
        <motion.div variants={stagger} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-8 text-center w-full max-w-3xl">
            <motion.div variants={item}><Label color="cyan">Career at a Glance</Label></motion.div>
            <motion.div variants={item} className="grid grid-cols-3 gap-6 w-full">
                {stats.map(s => (
                    <div key={s.label} className="flex flex-col items-center gap-2">
                        <div className="text-[clamp(2.8rem,9vw,6rem)] font-black leading-none tracking-tight"
                            style={{ backgroundImage: s.grad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                            <Counter target={s.val} duration={1800} suffix={s.suffix} />
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-mono leading-relaxed whitespace-pre-line">
                            {s.label}
                        </div>
                        <div className="w-full h-px rounded-full overflow-hidden bg-slate-800">
                            <motion.div className="h-full rounded-full"
                                style={{ background: s.grad }}
                                initial={{ width: 0 }} animate={{ width: `${(s.val / 25) * 100}%` }}
                                transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} />
                        </div>
                    </div>
                ))}
            </motion.div>
            <motion.div variants={item} className="text-slate-600 text-xs font-mono tracking-widest uppercase">
                Aviation — Travel Tech — Media — Enterprise
            </motion.div>
        </motion.div>
    );
}

// Scene 2 — Expertise
function Scene2() {
    const domains = [
        { label: 'AI Automation', sub: 'LangGraph · Agentic Workflows', color: '#a78bfa' },
        { label: 'Data Analytics', sub: 'BI · Dashboards · Strategy', color: '#22d3ee' },
        { label: 'Business Intelligence', sub: 'Insight → Decision → Action', color: '#e879f9' },
        { label: 'Data Journalism', sub: 'Interactive Storytelling', color: '#fb923c' },
    ];
    return (
        <motion.div variants={stagger} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-7 text-center w-full max-w-2xl">
            <motion.div variants={item}><Label color="fuchsia">Domain Expertise</Label></motion.div>
            <motion.div variants={item} className="text-[clamp(2rem,6.5vw,4.5rem)] font-black tracking-tight leading-tight">
                <BigText gradient="linear-gradient(135deg,#f1f5f9 30%,#94a3b8 100%)">
                    Turning data<br />into decisions.
                </BigText>
            </motion.div>
            <motion.div variants={stagger} className="flex flex-wrap justify-center gap-3">
                {domains.map(d => (
                    <motion.div key={d.label} variants={item}
                        className="border border-slate-700/60 rounded-xl px-4 py-3 text-left min-w-[160px]"
                        style={{ background: `${d.color}08` }}>
                        <div className="text-sm font-semibold mb-0.5" style={{ color: d.color }}>{d.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{d.sub}</div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

// Scene 3 — Investigations / Data Stories
function Scene3() {
    const projects = [
        { label: 'Thailand 2026 Election', tag: 'Statistical Investigation', accent: '#ef4444', detail: '382 districts · Official ECT data · 4 anomalies uncovered' },
        { label: 'Thai Election 2566', tag: 'Data Story + RAG Chatbot', accent: '#fb923c', detail: 'AI chatbot · Interactive visualizations · Gemini AI' },
        { label: 'AI Evolution Stats', tag: 'Interactive Data Art', accent: '#e879f9', detail: 'Parameter explosions · Context revolution · Recharts' },
    ];
    return (
        <motion.div variants={stagger} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-7 text-center w-full max-w-2xl">
            <motion.div variants={item}><Label color="red">Data Investigations</Label></motion.div>
            <motion.div variants={item} className="text-[clamp(1.8rem,5.5vw,3.5rem)] font-black tracking-tight leading-tight">
                <BigText gradient="linear-gradient(135deg,#f1f5f9 20%,#fb923c 60%,#ef4444 100%)">
                    Data stories<br />that demand attention.
                </BigText>
            </motion.div>
            <motion.div variants={stagger} className="flex flex-col gap-3 w-full text-left">
                {projects.map(p => (
                    <motion.div key={p.label} variants={item}
                        className="flex items-start gap-3 border border-slate-800/80 rounded-xl px-4 py-3"
                        style={{ background: `${p.accent}06`, borderColor: `${p.accent}20` }}>
                        <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5"
                            style={{ background: p.accent }} />
                        <div>
                            <div className="text-sm font-semibold text-slate-200">{p.label}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{p.tag} · {p.detail}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

// Scene 4 — AI Agents
function Scene4() {
    const agents = [
        { name: 'RiskGuard AI', sub: 'Internal Control & Audit', color: '#f43f5e' },
        { name: 'ProjectFlow AI', sub: 'Autonomous Scrum Master', color: '#3b82f6' },
        { name: 'ReviewFlow AI', sub: 'Reputation Engine', color: '#f59e0b' },
        { name: 'QueryFlow AI', sub: 'Natural Language → SQL', color: '#8b5cf6' },
        { name: 'Collections AI', sub: 'Dispute Resolution Agent', color: '#10b981' },
        { name: 'SlipVerify AI', sub: 'Fraud Detection & OCR', color: '#a855f7' },
    ];
    return (
        <motion.div variants={stagger} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-7 text-center w-full max-w-2xl">
            <motion.div variants={item}><Label color="emerald">AI Agents & Agentic Simulations</Label></motion.div>
            <motion.div variants={item} className="text-[clamp(1.8rem,5.5vw,3.5rem)] font-black tracking-tight leading-tight">
                <BigText gradient="linear-gradient(135deg,#f1f5f9 20%,#10b981 60%,#22d3ee 100%)">
                    Autonomous agents<br />solving real problems.
                </BigText>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full">
                {agents.map(a => (
                    <motion.div key={a.name} variants={item}
                        className="border border-slate-800/70 rounded-xl px-3.5 py-3 text-left"
                        style={{ background: `${a.color}08`, borderColor: `${a.color}20` }}>
                        <div className="text-xs font-bold mb-0.5" style={{ color: a.color }}>{a.name}</div>
                        <div className="text-[10px] text-slate-600 font-mono leading-tight">{a.sub}</div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}

// Scene 5 — CTA
function Scene5({ onSkip }: { onSkip: () => void }) {
    return (
        <motion.div variants={stagger} initial="hidden" animate="show" exit="exit"
            className="flex flex-col items-center gap-8 text-center">
            <motion.div variants={item}>
                <Label color="violet">Independent · Curious · Building</Label>
            </motion.div>
            <motion.div variants={item} className="text-[clamp(2.2rem,7vw,5.5rem)] font-black tracking-tight leading-none">
                <BigText gradient="linear-gradient(135deg,#f1f5f9 0%,#a78bfa 40%,#e879f9 70%,#22d3ee 100%)">
                    Everything<br />is here.
                </BigText>
            </motion.div>
            <motion.p variants={item} className="text-slate-500 text-sm max-w-sm font-light tracking-wide">
                20 years of expertise · data investigations · AI agents · full-stack products. Scroll to explore.
            </motion.p>
            <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-3">
                <button
                    onClick={() => {
                        onSkip();
                        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group px-8 py-3.5 rounded-full bg-white text-slate-950 font-semibold text-sm tracking-wide hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                    View all projects
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>
                <button
                    onClick={() => {
                        onSkip();
                        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-8 py-3.5 rounded-full border border-white/10 text-white/60 hover:text-white/90 font-medium text-sm tracking-wide hover:bg-white/5 transition-colors"
                >
                    About me
                </button>
            </motion.div>
        </motion.div>
    );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function CinematicReel() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const rafRef = useRef<number>(0);
    const startRef = useRef<number | null>(null);
    const [scene, setScene] = useState(-1);
    const [barPct, setBarPct] = useState(0);
    const [done, setDone] = useState(false);
    const [started, setStarted] = useState(false);

    useParticleCanvas(canvasRef);

    // Advance scenes via rAF timeline
    const tick = useCallback((ts: number) => {
        if (!startRef.current) startRef.current = ts;
        const elapsed = ts - startRef.current;
        const pct = Math.min((elapsed / TOTAL_MS) * 100, 100);
        setBarPct(pct);

        let acc = 0;
        let idx = SCENES.length - 1;
        for (let i = 0; i < SCENES.length; i++) {
            acc += SCENES[i].dur;
            if (elapsed < acc) { idx = i; break; }
        }
        setScene(idx);

        if (elapsed >= TOTAL_MS) { setDone(true); return; }
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    // Start only when section enters viewport
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !started) {
                setStarted(true);
                setScene(0);
                rafRef.current = requestAnimationFrame(tick);
                obs.disconnect();
            }
        }, { threshold: 0.25 });
        obs.observe(el);
        return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current); };
    }, [started, tick]);

    const skip = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        setDone(true);
        setBarPct(100);
        setScene(5);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(to bottom, #020617, #030a1a 60%, #020617)' }}
            aria-label="Cinematic introduction reel"
        >
            {/* Particle canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

            {/* Subtle grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.6) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />

            {/* Radial vignette */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 25%, rgba(2,6,23,.9) 100%)' }} />

            {/* Ambient glows */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
                style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-15"
                style={{ background: 'radial-gradient(circle,#0891b2,transparent 70%)' }} />

            {/* Scene stage */}
            <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 flex items-center justify-center min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {scene === 0 && <motion.div key="s0" className="w-full flex justify-center" variants={fadeUp} initial="hidden" animate="show" exit="exit"><Scene0 /></motion.div>}
                    {scene === 1 && <motion.div key="s1" className="w-full flex justify-center" variants={fadeUp} initial="hidden" animate="show" exit="exit"><Scene1 /></motion.div>}
                    {scene === 2 && <motion.div key="s2" className="w-full flex justify-center" variants={fadeUp} initial="hidden" animate="show" exit="exit"><Scene2 /></motion.div>}
                    {scene === 3 && <motion.div key="s3" className="w-full flex justify-center" variants={fadeUp} initial="hidden" animate="show" exit="exit"><Scene3 /></motion.div>}
                    {scene === 4 && <motion.div key="s4" className="w-full flex justify-center" variants={fadeUp} initial="hidden" animate="show" exit="exit"><Scene4 /></motion.div>}
                    {(scene === 5 || done) && <motion.div key="s5" className="w-full flex justify-center" variants={fadeUp} initial="hidden" animate="show" exit="exit"><Scene5 onSkip={skip} /></motion.div>}
                </AnimatePresence>
            </div>

            {/* Scene dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {SCENES.map((sc, i) => (
                    <div key={sc.id}
                        className="rounded-full transition-all duration-500"
                        style={{
                            width: i === scene ? 20 : 5,
                            height: 5,
                            background: i <= scene ? '#a78bfa' : 'rgba(148,163,184,0.2)',
                        }} />
                ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20">
                <div className="h-full transition-none"
                    style={{
                        width: `${barPct}%`,
                        background: 'linear-gradient(90deg,#6d28d9,#a78bfa,#22d3ee)',
                        transition: 'width 0.1s linear',
                    }} />
            </div>

            {/* Skip button */}
            {!done && (
                <button onClick={skip}
                    className="absolute top-4 right-5 z-20 text-[10px] font-mono font-semibold tracking-[0.15em] uppercase text-slate-600 hover:text-slate-400 transition-colors border border-slate-800 hover:border-slate-600 rounded-full px-3 py-1.5 backdrop-blur-sm">
                    SKIP ✕
                </button>
            )}
        </section>
    );
}
