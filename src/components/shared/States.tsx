import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Shared loading / feedback primitives — all token-driven so they theme with
 * the Midnight Console (dark + light). One small surface reused across the
 * interactive tool demos instead of a heavy toast system.
 */

/** Branded loading ring — the RouteLoader pattern, tokenized. */
export function Spinner({ size = 18, className = '' }: { size?: number; className?: string }) {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={cn('relative inline-block shrink-0 align-[-0.2em]', className)}
            style={{ height: size, width: size }}
        >
            <span className="absolute inset-0 rounded-full border border-hairline" />
            <span className="absolute inset-0 rounded-full border-t border-signal animate-spin [animation-duration:0.9s]" />
        </span>
    );
}

/** Shimmer skeleton block — reuses the `animate-shimmer` keyframe in index.css. */
export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={cn('relative block overflow-hidden rounded-md bg-panel', className)}
        >
            <span className="absolute inset-0 animate-shimmer" />
        </span>
    );
}

/**
 * Brand-correct inline error. Defaults to Violet Signal (the system carries
 * status through signal + iconography, not a dedicated error-red token);
 * pass `accent` (a hex) to render in an identity lane's hue.
 */
export function InlineError({
    children,
    accent,
    className = '',
}: {
    children: ReactNode;
    accent?: string;
    className?: string;
}) {
    const accentStyle = accent
        ? { borderColor: `${accent}4d`, backgroundColor: `${accent}1a`, color: accent }
        : undefined;
    return (
        <div
            role="alert"
            style={accentStyle}
            className={cn(
                'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm',
                !accent && 'border-signal/30 bg-signal/10 text-signal',
                className,
            )}
        >
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span className="min-w-0 break-words">{children}</span>
        </div>
    );
}
