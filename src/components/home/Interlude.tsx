import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../../lib/motion';

/**
 * A breath between the project index and the career path: the four things
 * the work is made of, set very large and moved only by the scroll itself
 * (two lines, opposite directions). No autoplay, so it adds no motion layer
 * of its own; under reduced motion it is a still lockup. Ghost words are a
 * low-alpha fill, not an outline: stroked variable type shows its seams.
 */

const ROWS = [
    ['Agents', 'Automation', 'Analytics', 'Strategy'],
    ['Strategy', 'Analytics', 'Automation', 'Agents'],
] as const;

function Row({ words, lit }: { words: readonly string[]; lit: 0 | 1 }) {
    // Three passes of the row: enough type to cover any travel on any width.
    // Every other word is lit and the rest are ghosts; the two rows are
    // offset, so the band reads as a checkerboard sliding against itself.
    return (
        <>
            {[0, 1, 2].map((pass) => (
                <span key={pass} className="flex shrink-0 items-center">
                    {words.map((w, i) => (
                        <span key={w} className="flex items-center">
                            <span className={i % 2 === lit ? 'text-text-strong' : 'text-text-strong/[0.09]'}>{w}</span>
                            <span className="mx-[0.3em] inline-block h-[0.08em] w-[0.08em] shrink-0 rounded-full bg-signal" />
                        </span>
                    ))}
                </span>
            ))}
        </>
    );
}

export default function Interlude() {
    const ref = useRef<HTMLDivElement>(null);
    const reduced = usePrefersReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const left = useTransform(scrollYProgress, [0, 1], ['-2%', '-26%']);
    const right = useTransform(scrollYProgress, [0, 1], ['-30%', '-6%']);

    return (
        <div
            ref={ref}
            role="img"
            aria-label="Agents, automation, analytics, strategy."
            className="relative overflow-hidden border-y border-hairline py-10 md:py-16"
        >
            <div className="font-display text-[clamp(3rem,9.5vw,8.75rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
                <motion.div style={reduced ? undefined : { x: left }} className="flex w-max whitespace-nowrap will-change-transform">
                    <Row words={ROWS[0]} lit={0} />
                </motion.div>
                <motion.div style={reduced ? undefined : { x: right }} className="flex w-max whitespace-nowrap will-change-transform">
                    <Row words={ROWS[1]} lit={1} />
                </motion.div>
            </div>
        </div>
    );
}
