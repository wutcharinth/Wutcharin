import React, { useRef, useMemo, type ReactNode } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { gsap } from './gsap';

type SplitMode = 'words' | 'chars' | 'lines';

interface SplitTextProps {
    children: string;
    as?: keyof React.JSX.IntrinsicElements;
    className?: string;
    mode?: SplitMode;
    stagger?: number;
    duration?: number;
    delay?: number;
    trigger?: 'load' | 'scroll';
    start?: string;
    once?: boolean;
}

/**
 * Splits text into words/chars and animates each with a staggered entrance.
 * Defaults to scroll-triggered — flips to 'load' for above-fold hero text.
 */
export default function SplitText({
    children,
    as = 'span',
    className = '',
    mode = 'words',
    stagger = 0.04,
    duration = 0.9,
    delay = 0,
    trigger = 'scroll',
    start = 'top 85%',
    once = true,
}: SplitTextProps) {
    const ref = useRef<HTMLElement | null>(null);
    const prefersReduced = usePrefersReducedMotion();

    const tokens = useMemo(() => {
        if (mode === 'chars') {
            return Array.from(children).map((c, i) => ({ char: c === ' ' ? '\u00A0' : c, key: `${c}-${i}` }));
        }
        // words mode — preserve whitespace as separators
        return children.split(/(\s+)/).map((w, i) => ({ char: w, key: `${w}-${i}` }));
    }, [children, mode]);

    useIsomorphicLayoutEffect(() => {
        if (!ref.current || prefersReduced) return;
        const el = ref.current;
        const targets = el.querySelectorAll<HTMLElement>('[data-split-token]');
        if (targets.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.set(targets, { yPercent: 40, opacity: 0 });
        }, el);

        const to = {
            yPercent: 0,
            opacity: 1,
            duration,
            delay,
            ease: 'expo.out',
            stagger,
        };

        let played = false;
        const play = () => {
            if (played) return;
            played = true;
            gsap.to(targets, to);
        };

        if (trigger === 'load') {
            play();
            return () => ctx.revert();
        }

        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        play();
                        if (once) io.disconnect();
                    } else if (!once && played) {
                        // Reset for replay
                        played = false;
                        gsap.set(targets, { yPercent: 40, opacity: 0 });
                    }
                }
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
        );
        io.observe(el);

        return () => {
            io.disconnect();
            ctx.revert();
        };
    }, [prefersReduced, mode, stagger, duration, delay, trigger, start, once]);

    return React.createElement(
        as,
        { ref, className, 'aria-label': children },
        tokens.map((t, i) => {
            if (/^\s+$/.test(t.char)) {
                return <span key={i} aria-hidden="true">{t.char}</span>;
            }
            return (
                <span
                    key={t.key}
                    data-split-token
                    aria-hidden="true"
                    style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                >
                    {t.char}
                </span>
            );
        })
    );
}

export function SplitTextBlock({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
}
