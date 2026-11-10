import { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { MagneticButton } from '../../lib/motion';
import { detectTier } from '../../scene/tier';
import { sceneBus } from '../../scene/sceneBus';
import KineticWord from './KineticWord';
import { portraitScene } from './scenes';
import { useBangkokTime } from './useBangkokTime';
import { openConsole, isMac } from '../console/consoleBus';
import { RESUME } from './contact';
import { useScrollTo } from './useScrollTo';


const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Chapter 00: Arrival. The name lands letter by letter while the field
 * resolves out of noise into the person behind it. Screen one carries the
 * full claim: who, what level, where, and how he thinks.
 */
export default function Arrival() {
    const sceneOff = useMemo(() => detectTier() === null, []);
    const time = useBangkokTime();
    const [mac] = useState(isMac);
    const [touch] = useState(() => window.matchMedia('(hover: none)').matches);

    const scrollTo = useScrollTo();

    const { scrollY } = useScroll();
    const lift = useTransform(scrollY, [0, 600], [0, -80]);
    const fade = useTransform(scrollY, [0, 420], [1, 0]);

    useEffect(() => {
        if (sceneOff) return;
        const atTop = () => window.scrollY < window.innerHeight * 0.5;
        // Hold the noise until the wordmark has landed, then resolve.
        const t = window.setTimeout(() => atTop() && sceneBus.apply(portraitScene()), 1300);
        let r = 0;
        const onResize = () => {
            window.clearTimeout(r);
            r = window.setTimeout(() => atTop() && sceneBus.apply(portraitScene()), 220);
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.clearTimeout(t);
            window.clearTimeout(r);
            window.removeEventListener('resize', onResize);
        };
    }, [sceneOff]);

    return (
        <section
            id="top"
            aria-label="Introduction"
            className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 md:px-10"
        >
            {/* Reading floor: the text side of the stage sits on a soft ramp of
                midnight so the type never fights the live field. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(0deg,var(--color-bg)_0%,transparent_55%)] md:bg-[linear-gradient(90deg,var(--color-bg)_0%,color-mix(in_srgb,var(--color-bg)_55%,transparent)_38%,transparent_62%)]"
            />

            <motion.div
                style={{ y: lift, opacity: fade }}
                className="relative z-30 mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 content-end gap-10 pb-20 pt-28 md:grid-cols-12 md:content-center md:pb-24"
            >
                <div className="md:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease }}
                        className="mb-8 hidden items-center gap-2 rounded-full border border-hairline px-3.5 py-1.5 sm:inline-flex"
                    >
                        <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60 [animation-duration:2.4s]" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-text">
                            Now · Agoda, Bangkok
                        </span>
                    </motion.div>

                    <h1 className="text-[clamp(3.4rem,10.5vw,9rem)] leading-[0.9] tracking-[-0.02em]">
                        <span className="block">
                            <KineticWord text="Wutcharin" className="text-text-strong" delay={0.5} />
                        </span>
                        <span className="block pl-[8vw] md:pl-[12vw]">
                            <KineticWord text="Thatan" className="text-text" delay={0.75} />
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.9, ease }}
                        className="mt-5 max-w-xl font-display text-lg font-medium leading-snug tracking-[-0.01em] text-text-strong md:mt-8 md:text-2xl"
                    >
                        Associate Director, FinTech Data &amp; Automation.
                        <span className="block text-text-mute">AI strategy that ships.</span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.9, ease }}
                        className="mt-4 max-w-xl font-serif text-xl italic leading-snug text-signal md:text-2xl"
                    >
                        Exceptions deserve people. Patterns deserve code.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                        className="mt-7 flex flex-wrap items-center gap-3 md:mt-10"
                    >
                        <MagneticButton
                            as="a"
                            href="#work"
                            onClick={(e: { preventDefault: () => void }) => {
                                e.preventDefault();
                                scrollTo('#work');
                            }}
                            className="group rounded-full bg-text-strong px-7 py-3 text-sm font-medium tracking-wide text-bg transition-colors hover:bg-signal"
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
                            className="rounded-full border border-signal/30 px-7 py-3 text-sm font-medium tracking-wide text-signal transition-colors hover:bg-signal/10 hover:text-text-strong"
                        >
                            Get in touch
                        </a>
                        <a
                            href={RESUME}
                            download="Wutcharin_Thatan_Resume.pdf"
                            className="group inline-flex items-center gap-1.5 px-3 py-3 text-sm font-medium text-text transition-colors hover:text-text-strong"
                        >
                            Résumé
                            <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                            <span className="sr-only">(PDF download)</span>
                        </a>
                    </motion.div>
                </div>

                {/* Without the live field, the portrait is a duotone plate. */}
                {sceneOff && (
                    <motion.figure
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 1.2, ease }}
                        className="relative order-first mx-auto w-48 md:order-none md:col-span-5 md:w-full md:max-w-md"
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
                            <div aria-hidden="true" className="absolute inset-0 bg-violet-400/30 mix-blend-color" />
                            <div aria-hidden="true" className="absolute inset-0 bg-bg/25 mix-blend-multiply" />
                        </div>
                    </motion.figure>
                )}
            </motion.div>

            {/* Live rail: a real person, right now. */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute inset-x-0 bottom-0 z-30 border-t border-hairline px-6 md:px-10"
            >
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.24em] text-text-mute">
                    <span className="flex items-center gap-2 tabular-nums">
                        <span className="h-1 w-1 rounded-full bg-violet-400" aria-hidden="true" />
                        Bangkok <span className="text-text-strong">{time}</span> ICT
                    </span>
                    <span className="hidden items-center gap-6 lg:flex">
                        <span><span className="text-text-strong">15,000+</span> hrs automated / yr</span>
                        <span><span className="text-text-strong">20+</span> agents live</span>
                        <span>Team of <span className="text-text-strong">12</span> analytics engineers</span>
                    </span>
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
