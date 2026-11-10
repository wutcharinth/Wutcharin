import { createElement, Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * A heading whose words rise out of the baseline, one after another, the
 * first time it enters view. The words stay real text (no aria tricks), the
 * mask is a clip-path so mixed faces keep their shared baseline, and under
 * reduced motion the heading simply renders in place.
 */

export type RisePart =
    | string
    | {
          text: string;
          /** The serif-italic interrupt: one or two words per lockup. */
          accent?: boolean;
          /** Start this part on its own line. */
          line?: boolean;
          /** No space before this part (closing punctuation). */
          glue?: boolean;
      };

const ACCENT = 'font-serif font-normal italic text-signal';

export default function Rise({
    as = 'h2',
    parts,
    className = '',
    delay = 0,
}: {
    as?: 'h2' | 'h3' | 'p';
    parts: RisePart[];
    className?: string;
    /** Milliseconds before the first word moves. */
    delay?: number;
}) {
    const ref = useRef<HTMLElement>(null);
    const [shown, setShown] = useState(
        () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    useEffect(() => {
        const el = ref.current;
        if (shown || !el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    io.disconnect();
                }
            },
            { rootMargin: '0px 0px -10% 0px', threshold: 0.2 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [shown]);

    let n = 0;
    return createElement(
        as,
        { ref, className, 'data-shown': shown ? '' : undefined, style: { '--rise-delay': `${delay}ms` } as CSSProperties },
        parts.map((part, p) => {
            const { text, accent, line, glue } = typeof part === 'string' ? ({ text: part } as Exclude<RisePart, string>) : part;
            return (
                <Fragment key={p}>
                    {line && <br />}
                    {text.split(' ').map((word, w) => (
                        <Fragment key={w}>
                            {(w > 0 || (p > 0 && !glue && !line)) && ' '}
                            <span className="rise-word">
                                <span className={accent ? ACCENT : undefined} style={{ '--i': n++ } as CSSProperties}>
                                    {word}
                                </span>
                            </span>
                        </Fragment>
                    ))}
                </Fragment>
            );
        }),
    );
}
