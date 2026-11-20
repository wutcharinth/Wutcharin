import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { MagneticButton } from '../../lib/motion';
import { detectTier, heroReelRequested, heroVariant, simsAllowed } from '../../scene/tier';
import { sceneBus } from '../../scene/sceneBus';
import { useTheme } from '../../lib/theme';
import KineticWord from './KineticWord';
import HeroReel from './HeroReel';
import { heroScene } from './scenes';
import { AGENT_COUNT, DOMAINS } from './agents';
import { useBootReady } from './bootBus';
import { useBangkokTime } from './useBangkokTime';
import { openConsole, isMac } from '../console/consoleBus';
import { RESUME } from './contact';
import { useScrollTo } from './useScrollTo';

const Constellation = lazy(() => import('./constellation/Constellation'));

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Chapter 00: Arrival. Synchronized with BootLoader so the wordmark rises
 * directly out of the lifting curtain while the interactive agent constellation
 * resolves beside it. Screen one carries the complete executive claim.
 */
export default function Arrival() {
    const bootReady = useBootReady();
    const tier = useMemo(() => detectTier(), []);
    const sceneOff = tier === null;
    const reel = useMemo(() => heroReelRequested(), []);
    const agents = useMemo(() => heroVariant() === 'agents' && simsAllowed(), []);
    const stageRef = useRef<HTMLDivElement>(null);
    const [stageOn, setStageOn] = useState(false);

    useEffect(() => {
        const el = stageRef.current;
        if (!agents || !el) return;
        const io = new IntersectionObserver(([e]) => setStageOn(e.isIntersecting), { threshold: 0.05 });
        io.observe(el);
        return () => io.disconnect();
    }, [agents]);

    const time = useBangkokTime();
    const [mac] = useState(isMac);
    const [touch] = useState(() => window.matchMedia('(hover: none)').matches);

    const scrollTo = useScrollTo();

    const { scrollY } = useScroll();
    const lift = useTransform(scrollY, [0, 600], [0, -72]);
    const fade = useTransform(scrollY, [0, 440], [1, 0]);

    // The portrait (?hero=portrait) has a map per theme: re-form it when the theme changes.
    const theme = useTheme();
    const firstTheme = useRef(theme);
    useEffect(() => {
        if (theme === firstTheme.current) return;
        firstTheme.current = theme;
        if (sceneOff || window.scrollY >= window.innerHeight * 0.5) return;
        sceneBus.apply(heroScene());
    }, [theme, sceneOff]);

    useEffect(() => {
        if (sceneOff || !bootReady) return;
        const atTop = () => window.scrollY < window.innerHeight * 0.5;
        const t = window.setTimeout(() => atTop() && sceneBus.apply(heroScene()), 650);
        let r = 0;
        const onResize = () => {
            window.clearTimeout(r);
            r = window.setTimeout(() => atTop() && sceneBus.apply(heroScene()), 220);
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.clearTimeout(t);
            window.clearTimeout(r);
            window.removeEventListener('resize', onResize);
        };
    }, [sceneOff, bootReady]);

    return (
        <section
            id="top"
            aria-label="Introduction"
            className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 md:px-10"
        >
            {reel && <HeroReel />}

            {/* Fig. 00: interactive agent constellation beside the name on desktop, above on phones. */}
            {agents && (
                <motion.div
                    ref={stageRef}
                    style={{ opacity: fade }}
                    className="absolute inset-x-0 top-16 z-10 h-[38svh] [mask-image:linear-gradient(to_bottom,#000_58%,transparent_96%)] md:inset-x-auto md:right-[5vw] md:top-1/2 md:z-20 md:h-[78svh] md:w-[45vw] md:max-w-[780px] md:-translate-y-1/2 md:[mask-image:none]"
                >
                    <motion.div
                        className="h-full w-full"
                        initial={{ opacity: 0 }}
                        animate={bootReady ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.35, duration: 1.2, ease }}
                    >
                        <Suspense fallback={null}>
                            <Constellation running={stageOn} />
                        </Suspense>
                    </motion.div>
                    <p className="sr-only">
                        An interactive constellation of {AGENT_COUNT} AI agents across {DOMAINS.map((d) => d.name).join(', ')}.
                    </p>
                </motion.div>
            )}

            {/* Reading floor: soft midnight ramp behind the type so copy never competes with WebGL. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(0deg,var(--color-bg)_0%,transparent_55%)] md:bg-[linear-gradient(90deg,var(--color-bg)_0%,color-mix(in_srgb,var(--color-bg)_62%,transparent)_40%,transparent_64%)]"
            />

            <motion.div
                style={{ y: lift, opacity: fade }}
                className="pointer-events-none relative z-30 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-end gap-10 pb-20 pt-28 md:grid-cols-12 md:content-center md:pb-24"
            >
                <div className="pointer-events-auto md:col-span-7">
                    {/* Crisp editorial dateline (no generic pulsing status pill). */}
                    <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={bootReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
                        transition={{ delay: 0.05, duration: 0.7, ease }}
                        className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.28em] text-text-mute"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                        <span className="tabular-nums text-text-strong">00</span>
                        <span>Agoda, Bangkok</span>
                        <span className="hidden text-hairline-strong sm:inline" aria-hidden="true">/</span>
                        <span className="hidden sm:inline">FinTech Data &amp; Automation</span>
                    </motion.p>

                    <h1 className="text-[clamp(3.4rem,10.5vw,9rem)] leading-[0.9] tracking-[-0.02em]">
                        <span className="block">
                            <KineticWord text="Wutcharin" className="text-text-strong" delay={0.08} ready={bootReady} />
                        </span>
                        <span className="block pl-[7vw] md:pl-[10vw]">
                            <KineticWord text="Thatan" className="text-text" delay={0.22} ready={bootReady} />
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={bootReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                        transition={{ delay: 0.48, duration: 0.85, ease }}
                        className="mt-5 max-w-xl font-display text-lg font-medium leading-snug tracking-[-0.01em] text-text-strong md:mt-7 md:text-2xl"
                    >
                        Associate Director, FinTech Data &amp; Automation.
                        <span className="block text-text-mute">AI strategy that ships.</span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={bootReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                        transition={{ delay: 0.62, duration: 0.85, ease }}
                        className="mt-3.5 max-w-xl font-serif text-xl italic leading-snug text-signal md:text-2xl"
                    >
                        Exceptions deserve people. Patterns deserve code.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={bootReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                        transition={{ delay: 0.78, duration: 0.8, ease }}
                        className="mt-7 flex flex-wrap items-center gap-3 md:mt-9"
                    >
                        <MagneticButton
                            as="a"
                            href="#work"
                            onClick={(e: { preventDefault: () => void }) => {
                                e.preventDefault();
                                scrollTo('#work');
                            }}
                            className="group rounded-full bg-text-strong px-7 py-3 text-sm font-medium tracking-wide text-bg transition-colors hover:bg-text"
                            data-cursor="view"
                        >
                            <span className="flex items-center gap-2">
                                See the work
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                            </span>
                        </MagneticButton>
                        <a
                            href="#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollTo('#contact');
                            }}
                            data-cursor="open"
                            className="rounded-full border border-signal/30 px-7 py-3 text-sm font-medium tracking-wide text-signal transition-colors hover:bg-signal/10 hover:text-text-strong"
                        >
                            Get in touch
                        </a>
                        <a
                            href={RESUME}
                            download="Wutcharin_Thatan_Resume.pdf"
                            data-cursor="open"
                            className="group inline-flex items-center gap-1.5 px-3 py-3 text-sm font-medium text-text transition-colors hover:text-text-strong"
                        >
                            Résumé
                            <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                            <span className="sr-only">(PDF download)</span>
                        </a>
                    </motion.div>
                </div>

                {/* Without the live field, the portrait is a black and white plate. */}
                {sceneOff && !reel && (
                    <motion.figure
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={bootReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
                        transition={{ delay: 0.25, duration: 1.0, ease }}
                        className="pointer-events-auto relative order-first mx-auto w-48 md:order-none md:col-span-5 md:w-full md:max-w-md"
                    >
                        <div className="relative aspect-square overflow-hidden [mask-image:radial-gradient(closest-side,#000_62%,transparent)]">
                            <img
                                src="/portrait.jpg"
                                alt="Portrait of Wutcharin Thatan"
                                width={600}
                                height={600}
                                fetchPriority="high"
                                className="block h-full w-full object-cover [filter:grayscale(1)_contrast(1.08)_brightness(0.92)]"
                            />
                            <div aria-hidden="true" className="absolute inset-0 bg-bg/25 mix-blend-multiply" />
                        </div>
                    </motion.figure>
                )}
            </motion.div>

            {/* Right margin figure caption mirroring the left chapter rail. */}
            {tier && (
                <motion.div
                    aria-hidden="true"
                    style={{ opacity: fade }}
                    className="pointer-events-none absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block [@media(max-height:739px)]:hidden"
                >
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={bootReady ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.0, duration: 1.0 }}
                        className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute [writing-mode:vertical-rl]"
                    >
                        {agents ? (
                            <>
                                <span className="text-text">Fig. 00 · Agents</span>
                                <span className="h-8 w-px bg-hairline-strong" />
                                <span>
                                    <span className="tabular-nums">{AGENT_COUNT}+</span> live · {DOMAINS.length} domains
                                </span>
                                {!touch && (
                                    <>
                                        <span className="h-8 w-px bg-hairline-strong" />
                                        <span>Click a node or domain</span>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <span className="text-text">Fig. 00 · Portrait</span>
                                <span className="h-8 w-px bg-hairline-strong" />
                                <span>
                                    <span className="tabular-nums">{(tier.texSize * tier.texSize).toLocaleString('en-US')}</span> live particles
                                </span>
                                {!touch && (
                                    <>
                                        <span className="h-8 w-px bg-hairline-strong" />
                                        <span>Move your cursor</span>
                                    </>
                                )}
                            </>
                        )}
                    </motion.p>
                </motion.div>
            )}

            {/* Live rail: Bangkok time, direct chapter-01 scroll cue, and console trigger. */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={bootReady ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.9, duration: 0.9 }}
                className="absolute inset-x-0 bottom-0 z-30 border-t border-hairline px-6 md:px-10"
            >
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.24em] text-text-mute">
                    <span className="flex items-center gap-2 tabular-nums">
                        <span className="h-1 w-1 rounded-full bg-signal" aria-hidden="true" />
                        Bangkok <span className="text-text-strong">{time}</span> ICT
                    </span>

                    <button
                        type="button"
                        onClick={() => scrollTo('#proof')}
                        data-cursor="view"
                        className="group hidden items-center gap-2.5 rounded-full px-3 py-1 transition-colors hover:text-text-strong sm:inline-flex"
                    >
                        <span>01 Proof</span>
                        <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        onClick={openConsole}
                        className="flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:text-text-strong"
                        data-cursor="open"
                    >
                        {!touch && (
                            <kbd className="rounded border border-hairline px-1.5 py-0.5 font-mono text-[11px] tracking-normal text-text">
                                {mac ? '⌘K' : 'Ctrl K'}
                            </kbd>
                        )}
                        {touch ? 'Search' : 'Console'}
                    </button>
                </div>
            </motion.div>
        </section>
    );
}
