import { motion } from 'framer-motion';
import { AUTOMATION_MIX, HOURS_PER_YEAR } from './automation';

const ease = [0.16, 1, 0.3, 1] as const;

/** Ten cells, one per 10%: the reading of a small instrument, not a chart. */
function Cells({ pct }: { pct: number }) {
    const lit = Math.round(pct / 10);
    return (
        <span className="flex gap-[3px]" aria-hidden="true">
            {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={`h-3.5 w-[5px] rounded-[1px] ${i < lit ? 'bg-text-strong' : 'bg-text-mute/25'}`} />
            ))}
        </span>
    );
}

/**
 * Hero instrument: where the 15,000 hours a year come from, read like a
 * panel on a machine. Desktop only; the Proof chapter tells the same story
 * at full size.
 */
export default function HeroInstrument({ className = '' }: { className?: string }) {
    return (
        <motion.aside
            aria-label="Hours automated each year, by kind of automation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.9, ease }}
            className={`w-[336px] rounded-[4px] border border-hairline bg-veil p-5 ${className}`}
        >
            <div className="flex items-baseline justify-between gap-4">
                <p className="font-display text-[15px] font-medium tracking-[-0.01em] text-text-strong">Automated each year</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">Agoda</p>
            </div>
            <ul className="mt-5 space-y-4">
                {AUTOMATION_MIX.map(([label, pct, from]) => (
                    <li key={label} className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[13px] font-medium leading-tight text-text-strong">{label}</p>
                            <p className="mt-1.5 font-mono text-[10px] tabular-nums tracking-[0.08em] text-text-mute">
                                {from && `from ${from} · `}~{Math.round((HOURS_PER_YEAR * pct) / 100).toLocaleString('en-US')} hrs
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <Cells pct={pct} />
                            <span className="font-mono text-[10px] tabular-nums text-text-mute">{pct}%</span>
                        </div>
                    </li>
                ))}
            </ul>
            <p className="mt-5 border-t border-hairline pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-text-mute">
                <span className="tabular-nums text-text-strong">{HOURS_PER_YEAR.toLocaleString('en-US')}+</span> hrs · all running daily
            </p>
        </motion.aside>
    );
}
