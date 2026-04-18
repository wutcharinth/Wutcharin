import React, { useRef, type ReactNode } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { gsap } from './gsap';

interface RevealOnScrollProps {
    children: ReactNode;
    className?: string;
    /** Stagger children that have [data-reveal-child] */
    staggerChildren?: number;
    delay?: number;
    duration?: number;
    y?: number;
    start?: string;
    once?: boolean;
    as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Reveals a block (and optionally staggers children with [data-reveal-child])
 * when it enters the viewport.
 */
export default function RevealOnScroll({
    children,
    className = '',
    staggerChildren = 0,
    delay = 0,
    duration = 0.9,
    y = 40,
    start = 'top 85%',
    once = true,
    as = 'div',
}: RevealOnScrollProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const prefersReduced = usePrefersReducedMotion();

    useIsomorphicLayoutEffect(() => {
        if (!ref.current || prefersReduced) return;
        const el = ref.current;
        const children = el.querySelectorAll<HTMLElement>('[data-reveal-child]');
        const targets = children.length > 0 ? children : [el];

        const ctx = gsap.context(() => {
            gsap.set(targets, { y, opacity: 0 });
            gsap.to(targets, {
                y: 0,
                opacity: 1,
                duration,
                delay,
                ease: 'expo.out',
                stagger: staggerChildren,
                scrollTrigger: {
                    trigger: el,
                    start,
                    toggleActions: once ? 'play none none none' : 'play reverse play reverse',
                },
            });
        }, el);

        return () => ctx.revert();
    }, [prefersReduced, staggerChildren, delay, duration, y, start, once]);

    return React.createElement(as, { ref, className }, children);
}
