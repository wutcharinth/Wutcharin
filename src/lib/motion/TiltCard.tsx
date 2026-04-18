import { useRef, type ReactNode, type MouseEvent } from 'react';
import { gsap } from './gsap';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    /** Max tilt in degrees */
    max?: number;
    /** Lift on hover in px */
    lift?: number;
    /** Enable parallax for descendants with [data-tilt-parallax] */
    parallax?: boolean;
    /** Show a soft sheen that follows the cursor */
    sheen?: boolean;
}

/**
 * Tilts and lifts the card on hover, with optional inner parallax and a
 * cursor-tracking radial sheen. GPU-accelerated via transform3d.
 */
export default function TiltCard({
    children,
    className = '',
    max = 8,
    lift = 10,
    parallax = true,
    sheen = true,
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const sheenRef = useRef<HTMLDivElement | null>(null);
    const prefersReduced = usePrefersReducedMotion();

    const handleMove = (e: MouseEvent<HTMLDivElement>) => {
        if (prefersReduced || !ref.current) return;
        const el = ref.current;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width; // 0..1
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * -2 * max;
        const ry = (px - 0.5) * 2 * max;

        gsap.to(el, {
            rotateX: rx,
            rotateY: ry,
            y: -lift,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 900,
            transformOrigin: 'center',
        });

        if (parallax) {
            const layers = el.querySelectorAll<HTMLElement>('[data-tilt-parallax]');
            layers.forEach((layer) => {
                const depth = parseFloat(layer.dataset.tiltDepth || '20');
                gsap.to(layer, {
                    x: (px - 0.5) * depth,
                    y: (py - 0.5) * depth,
                    duration: 0.4,
                    ease: 'power2.out',
                });
            });
        }

        if (sheen && sheenRef.current) {
            sheenRef.current.style.background = `radial-gradient(600px circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.08), transparent 40%)`;
        }
    };

    const handleLeave = () => {
        if (!ref.current) return;
        gsap.to(ref.current, {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.5)',
        });
        if (parallax) {
            const layers = ref.current.querySelectorAll<HTMLElement>('[data-tilt-parallax]');
            layers.forEach((layer) => {
                gsap.to(layer, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
            });
        }
        if (sheen && sheenRef.current) {
            sheenRef.current.style.background = 'transparent';
        }
    };

    return (
        <div
            ref={ref}
            className={`relative [transform-style:preserve-3d] ${className}`}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
        >
            {children}
            {sheen && (
                <div
                    ref={sheenRef}
                    className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
                    aria-hidden="true"
                />
            )}
        </div>
    );
}
