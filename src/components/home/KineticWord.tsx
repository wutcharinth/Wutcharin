import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/motion';

/**
 * Per-letter kinetic text: each char animates in from below with a random
 * rotation, then reacts to cursor proximity with a magnetic pull.
 */
export default function KineticWord({
    text,
    className = '',
    delay = 0,
}: {
    text: string;
    className?: string;
    delay?: number;
}) {
    const ref = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        const letters = el.querySelectorAll<HTMLElement>('[data-letter]');

        // GSAP ignores the global CSS reduced-motion kill — gate explicitly.
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(letters, { yPercent: 0, opacity: 1, rotate: 0 });
            return;
        }

        // Use gsap.fromTo so the start state is enforced even if a previous
        // ctx.revert() cleared the inline transform/opacity. Avoids the
        // StrictMode / HMR race where letters could otherwise strand at 0 opacity.
        const tween = gsap.fromTo(
            letters,
            { yPercent: 120, opacity: 0, rotate: () => gsap.utils.random(-10, 10) },
            {
                yPercent: 0,
                opacity: 1,
                rotate: 0,
                duration: 1.2,
                ease: 'expo.out',
                stagger: 0.05,
                delay,
            }
        );

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
            tween.kill();
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
                        }}
                    >
                        {c}
                    </span>
                </span>
            ))}
        </span>
    );
}
