import { type ReactNode, Children } from 'react';

interface MarqueeProps {
    children: ReactNode;
    /** Speed in seconds for one full loop */
    speed?: number;
    direction?: 'left' | 'right';
    /** Pause animation while the user hovers */
    pauseOnHover?: boolean;
    /** Gap between repeated content in px */
    gap?: number;
    className?: string;
}

/**
 * CSS-driven infinite marquee. Duplicates children so the track is seamless
 * and uses translateX keyframes animated via inline styles — no JS per frame.
 */
export default function Marquee({
    children,
    speed = 40,
    direction = 'left',
    pauseOnHover = true,
    gap = 48,
    className = '',
}: MarqueeProps) {
    const count = Children.count(children);
    const keyframeName = `marquee-${direction}-${count}`;

    return (
        <div
            className={`group relative flex overflow-hidden ${className}`}
            style={{
                maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)',
            }}
        >
            <style>{`
                @keyframes ${keyframeName} {
                    from { transform: translateX(${direction === 'left' ? '0' : '-50%'}); }
                    to   { transform: translateX(${direction === 'left' ? '-50%' : '0'}); }
                }
            `}</style>
            <div
                className="flex shrink-0 items-center"
                style={{
                    gap: `${gap}px`,
                    paddingRight: `${gap}px`,
                    animation: `${keyframeName} ${speed}s linear infinite`,
                    animationPlayState: pauseOnHover ? undefined : 'running',
                }}
                onMouseEnter={(e) => {
                    if (pauseOnHover) (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
                }}
                onMouseLeave={(e) => {
                    if (pauseOnHover) (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
                }}
            >
                {children}
                {children}
            </div>
        </div>
    );
}
