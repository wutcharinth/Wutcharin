import { useEffect, useRef, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

// Three.js + fiber weighs ~300KB gzip. Lazy-loading keeps the hero text
// interactive immediately; fish fade in once the bundle arrives.
const FishBackground = lazy(() => import('./FishBackground'));
import { MagneticButton, gsap } from '../lib/motion';

/**
 * Per-letter kinetic text: each char animates in from below with a random
 * rotation, then reacts to cursor proximity with a magnetic pull.
 */
function KineticWord({
    text,
    className = '',
    delay = 0,
    gradient = false,
}: {
    text: string;
    className?: string;
    delay?: number;
    gradient?: boolean;
}) {
    const ref = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        const letters = el.querySelectorAll<HTMLElement>('[data-letter]');

        const ctx = gsap.context(() => {
            gsap.set(letters, { yPercent: 120, opacity: 0, rotate: () => gsap.utils.random(-10, 10) });
            gsap.to(letters, {
                yPercent: 0,
                opacity: 1,
                rotate: 0,
                duration: 1.2,
                ease: 'expo.out',
                stagger: 0.05,
                delay,
            });
        }, el);

        const onMove = (e: MouseEvent) => {
            letters.forEach((letter) => {
                const lr = letter.getBoundingClientRect();
                const cx = lr.left + lr.width / 2;
                const cy = lr.top + lr.height / 2;
                const dx = e.clientX - cx;
                const dy = e.clientY - cy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const radius = 200;
                if (dist < radius) {
                    const pull = (1 - dist / radius) * 0.35;
                    gsap.to(letter, {
                        x: -dx * pull * 0.5,
                        y: -dy * pull * 0.5,
                        duration: 0.45,
                        ease: 'power2.out',
                    });
                } else {
                    gsap.to(letter, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
                }
            });
        };
        const onLeave = () => {
            gsap.to(letters, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        el.addEventListener('mouseleave', onLeave);
        return () => {
            window.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
            ctx.revert();
        };
    }, [delay, text]);

    return (
        <span ref={ref} className={`inline-flex overflow-visible ${className}`} aria-label={text}>
            {Array.from(text).map((c, i) => (
                <span key={`${c}-${i}`} aria-hidden="true" style={{ display: 'inline-block', overflow: 'visible' }}>
                    <span
                        data-letter
                        style={{
                            display: 'inline-block',
                            willChange: 'transform, opacity',
                            backgroundImage: gradient
                                ? 'linear-gradient(110deg, #ffffff 10%, #cbd5e1 40%, #ffffff 55%, #94a3b8 70%, #ffffff 100%)'
                                : undefined,
                            WebkitBackgroundClip: gradient ? 'text' : undefined,
                            backgroundClip: gradient ? 'text' : undefined,
                            color: gradient ? 'transparent' : undefined,
                            backgroundSize: gradient ? '220% 100%' : undefined,
                            animation: gradient ? 'shimmer 3.4s linear infinite' : undefined,
                        }}
                    >
                        {c}
                    </span>
                </span>
            ))}
        </span>
    );
}

export default function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 120]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 500], [1, 0.92]);

    const auroraRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = auroraRef.current;
        if (!el) return;
        const onMove = (e: MouseEvent) => {
            const nx = (e.clientX / window.innerWidth - 0.5) * 2;
            const ny = (e.clientY / window.innerHeight - 0.5) * 2;
            el.style.transform = `translate3d(${nx * 10}px, ${ny * 10}px, 0)`;
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-4">
            <Suspense fallback={null}>
                <FishBackground />
            </Suspense>

            {/* Aurora wash */}
            <div
                ref={auroraRef}
                className="pointer-events-none absolute inset-0 z-10 transition-transform duration-300 will-change-transform"
                aria-hidden="true"
            >
                <div className="absolute left-[15%] top-[20%] h-[36rem] w-[36rem] rounded-full bg-violet-600/20 blur-[120px] animate-aurora" />
                <div className="absolute right-[10%] top-[30%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/15 blur-[120px] animate-float-slow" />
            </div>

            <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_35%,#020617_92%)]" aria-hidden="true" />

            <div className="relative z-30 max-w-5xl mx-auto w-full text-center">
                {/* Minimal pill */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="mb-10 flex justify-center"
                >
                    <div className="flex items-center gap-2 border border-white/10 px-3 py-1 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em]">
                            Available for work
                        </span>
                    </div>
                </motion.div>

                {/* Kinetic wordmark */}
                <motion.div
                    style={{ y: y1, opacity, scale }}
                    className="mb-6 will-change-transform"
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] font-medium tracking-[-0.035em] leading-[0.9] block">
                        <KineticWord text="Wutcharin" className="text-white" delay={0.6} />
                    </h1>
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] font-medium tracking-[-0.035em] leading-[0.9] block mt-1">
                        <KineticWord text="Thatan" gradient delay={0.85} />
                    </h1>
                </motion.div>

                {/* Role — clean, minimal */}
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="mb-12 text-sm md:text-base text-white/50 font-light tracking-[0.15em] uppercase"
                >
                    AI · Automation · Analytics
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7, duration: 0.8 }}
                    className="flex items-center justify-center gap-3 flex-wrap"
                >
                    <MagneticButton
                        as="a"
                        href="#projects"
                        className="group relative px-7 py-3 rounded-full bg-white text-slate-950 font-medium text-sm tracking-wide"
                        data-cursor="view"
                    >
                        <span className="flex items-center gap-2">
                            View projects
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </MagneticButton>
                    <MagneticButton
                        as="a"
                        href="#contact"
                        className="group px-7 py-3 rounded-full border border-white/15 text-white/80 hover:text-white font-medium text-sm tracking-wide hover:bg-white/5 transition-colors"
                        data-cursor="contact"
                    >
                        <span className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Get in touch
                        </span>
                    </MagneticButton>
                </motion.div>
            </div>

            {/* Scroll hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
            >
                <div className="relative w-[1px] h-10 overflow-hidden bg-white/10">
                    <motion.div
                        className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent via-white/60 to-transparent"
                        animate={{ y: ['-100%', '400%'] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </div>
            </motion.div>
        </section>
    );
}
