import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface ScrambleTextProps {
    text: string;
    className?: string;
    /** Fire on hover instead of mount */
    onHover?: boolean;
    /** Loop the scramble continuously while idle */
    loop?: boolean;
    speed?: number;
    chars?: string;
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

/**
 * Scrambles characters letter-by-letter into the final string.
 * Stateless, no deps — uses a requestAnimationFrame loop.
 */
export default function ScrambleText({
    text,
    className = '',
    onHover = false,
    loop = false,
    speed = 35,
    chars = DEFAULT_CHARS,
}: ScrambleTextProps) {
    const [display, setDisplay] = useState(onHover ? text : '');
    const rafRef = useRef<number | null>(null);
    const prefersReduced = usePrefersReducedMotion();

    const scramble = () => {
        if (prefersReduced) {
            setDisplay(text);
            return;
        }
        let frame = 0;
        const queue: { from: string; to: string; start: number; end: number }[] = [];
        const oldText = display || '';
        const length = Math.max(oldText.length, text.length);
        for (let i = 0; i < length; i++) {
            queue.push({
                from: oldText[i] || '',
                to: text[i] || '',
                start: Math.floor(Math.random() * 20),
                end: Math.floor(Math.random() * 20) + 20,
            });
        }

        const update = () => {
            let output = '';
            let complete = 0;
            for (const q of queue) {
                if (frame >= q.end) {
                    complete++;
                    output += q.to;
                } else if (frame >= q.start) {
                    output += chars[Math.floor(Math.random() * chars.length)];
                } else {
                    output += q.from;
                }
            }
            setDisplay(output);
            if (complete === queue.length) {
                if (loop) {
                    setTimeout(() => scramble(), 2200);
                }
                return;
            }
            frame++;
            rafRef.current = window.setTimeout(update, speed) as unknown as number;
        };
        update();
    };

    useEffect(() => {
        if (!onHover) scramble();
        return () => {
            if (rafRef.current) clearTimeout(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEnter = () => {
        if (onHover) scramble();
    };

    return (
        <span className={className} onMouseEnter={handleEnter} aria-label={text}>
            <span aria-hidden="true" className="tabular-nums">{display}</span>
        </span>
    );
}
