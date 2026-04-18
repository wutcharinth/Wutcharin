import React, { useRef, type ReactNode, type MouseEvent } from 'react';
import { gsap } from './gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface MagneticButtonProps {
    children: ReactNode;
    className?: string;
    as?: keyof React.JSX.IntrinsicElements;
    strength?: number;
    /** Optional callback for clicks — also fires on the underlying element */
    onClick?: (e: MouseEvent) => void;
    href?: string;
    target?: string;
    rel?: string;
    type?: string;
    [key: string]: unknown;
}

/**
 * A button/anchor whose content subtly follows the cursor on hover.
 * Inner child also gets a secondary pull for a "magnetic label" feel.
 */
export default function MagneticButton({
    children,
    className = '',
    as,
    strength = 0.4,
    ...rest
}: MagneticButtonProps) {
    const wrapRef = useRef<HTMLElement | null>(null);
    const innerRef = useRef<HTMLSpanElement | null>(null);
    const prefersReduced = usePrefersReducedMotion();

    const handleMove = (e: MouseEvent) => {
        if (prefersReduced || !wrapRef.current || !innerRef.current) return;
        const rect = wrapRef.current.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        gsap.to(wrapRef.current, {
            x: relX * strength,
            y: relY * strength,
            duration: 0.5,
            ease: 'power3.out',
        });
        gsap.to(innerRef.current, {
            x: relX * strength * 0.4,
            y: relY * strength * 0.4,
            duration: 0.5,
            ease: 'power3.out',
        });
    };

    const handleLeave = () => {
        if (!wrapRef.current || !innerRef.current) return;
        gsap.to([wrapRef.current, innerRef.current], {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)',
        });
    };

    const Tag = as || (rest.href ? 'a' : 'button');

    return React.createElement(
        Tag,
        {
            ref: wrapRef,
            className: `inline-block cursor-hover ${className}`,
            onMouseMove: handleMove,
            onMouseLeave: handleLeave,
            ...rest,
        },
        <span ref={innerRef} className="inline-block">
            {children}
        </span>
    );
}
