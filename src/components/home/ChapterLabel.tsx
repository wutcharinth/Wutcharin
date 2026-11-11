/** Section eyebrow: "01 · Proof". Mono, tracked, a single violet dot. */
export default function ChapterLabel({ index, name, className = '' }: { index: string; name: string; className?: string }) {
    return (
        <div className={`inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1 ${className}`}>
            <span className="h-1 w-1 rounded-full bg-signal" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-text">
                {index} · {name}
            </span>
        </div>
    );
}
