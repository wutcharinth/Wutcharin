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

        const ctx = gsap.context(() => {
            gsap.set(targets, { yPercent: 110, opacity: 0 });

            const to = {
                yPercent: 0,
                opacity: 1,
                duration,
                delay,
                ease: 'expo.out',
                stagger,
            };

            if (trigger === 'load') {
                gsap.to(targets, to);
            } else {
                gsap.to(targets, {
                    ...to,
                    scrollTrigger: {
                        trigger: el,
                        start,
                        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
                    },
                });
            }
        }, el);

        return () => ctx.revert();
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
                    aria-hidden="true"
                    style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
                >
                    <span data-split-token style={{ display: 'inline-block', willChange: 'transform, opacity' }}>
                        {t.char}
                    </span>
                </span>
            );
        })
    );
}

export function SplitTextBlock({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={className}>{children}</div>;
}
