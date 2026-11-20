import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/motion';

/**
 * Per-letter kinetic text: each char animates in from below once `ready` is
 * true, then reacts to cursor proximity with cached geometry and gsap.quickTo.
 * Pointer tracking automatically pauses via IntersectionObserver once scrolled
 * out of view so it incurs zero CPU overhead on the rest of the page.
 */
export default function KineticWord({
    text,
    className = '',
    delay = 0,
    ready = true,
}: {
    text: string;
    className?: string;
    delay?: number;
    ready?: boolean;
}) {
    const ref = useRef<HTMLSpanElement | null>(null);
    const enteredRef = useRef(false);

    // Entrance choreography: waits for `ready` (synced with BootLoader).
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const letters = el.querySelectorAll<HTMLElement>('[data-letter]');

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set(letters, { yPercent: 0, opacity: 1, rotate: 0 });
            enteredRef.current = true;
            return;
        }

        if (!ready) {
            gsap.set(letters, { yPercent: 115, opacity: 0 });
            return;
        }

        enteredRef.current = true;
        const tween = gsap.fromTo(
            letters,
            { yPercent: 115, opacity: 0, rotate: () => gsap.utils.random(-8, 8) },
            {
                yPercent: 0,
                opacity: 1,
                rotate: 0,
                duration: 1.05,
                ease: 'expo.out',
                stagger: 0.04,
                delay,
            },
        );
        return () => {
            tween.kill();
        };
    }, [delay, ready, text]);

    // Viewport-gated proximity physics with cached centers + gsap.quickTo.
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            window.matchMedia('(hover: none)').matches
        ) {
            return;
        }

        const letters = Array.from(el.querySelectorAll<HTMLElement>('[data-letter]'));
        const setters = letters.map((letter) => ({
            el: letter,
            xTo: gsap.quickTo(letter, 'x', { duration: 0.45, ease: 'power2.out' }),
            yTo: gsap.quickTo(letter, 'y', { duration: 0.45, ease: 'power2.out' }),
            cx: 0,
            cy: 0,
            displaced: false,
        }));

        const measure = () => {
            setters.forEach((s) => {
                // Measure wrapper span so animated letter offsets don't skew centers.
                const rect = (s.el.parentElement ?? s.el).getBoundingClientRect();
                s.cx = rect.left + rect.width / 2;
                s.cy = rect.top + rect.height / 2;
            });
        };

        let inView = false;
        let attached = false;
        const radius = 190;

        const onMove = (e: MouseEvent) => {
            if (!enteredRef.current) return;
            for (const s of setters) {
                const dx = e.clientX - s.cx;
                const dy = e.clientY - s.cy;
                const dist = Math.hypot(dx, dy);
                if (dist < radius) {
                    const pull = (1 - dist / radius) * 0.32;
                    s.xTo(-dx * pull * 0.5);
                    s.yTo(-dy * pull * 0.5);
                    s.displaced = true;
                } else if (s.displaced) {
                    s.xTo(0);
                    s.yTo(0);
                    s.displaced = false;
                }
            }
        };

        const reset = () => {
            for (const s of setters) {
                if (s.displaced) {
                    s.xTo(0);
                    s.yTo(0);
                    s.displaced = false;
                }
            }
        };

        const attach = () => {
            if (attached) return;
            attached = true;
            measure();
            window.addEventListener('mousemove', onMove, { passive: true });
            window.addEventListener('resize', measure, { passive: true });
            window.addEventListener('scroll', measure, { passive: true });
            document.documentElement.addEventListener('mouseleave', reset);
        };

        const detach = () => {
            if (!attached) return;
            attached = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('resize', measure);
            window.removeEventListener('scroll', measure);
            document.documentElement.removeEventListener('mouseleave', reset);
            reset();
        };

        const io = new IntersectionObserver(
            ([entry]) => {
                inView = entry.isIntersecting;
                if (inView) attach();
                else detach();
            },
            { threshold: 0.01 },
        );
        io.observe(el);

        return () => {
            io.disconnect();
            detach();
        };
    }, [text]);

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
