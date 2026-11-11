import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Linkedin, Mail, X } from 'lucide-react';
import { EMAIL, INTRO_GMAIL, INTRO_MAILTO, INTRO_OUTLOOK, LINKEDIN, copyEmail } from '../home/contact';
import { onIntroOpen } from './introBus';
import { useBangkokTime } from '../home/useBangkokTime';

/**
 * "Request an intro" panel. A bare mailto: link does nothing on machines
 * with no default mail app (common on desktops that use web mail), so the
 * request always lands here: copy the address, or open a pre-filled draft
 * in Gmail, Outlook or the mail app, or message on LinkedIn.
 *
 * Modal dialog: focus moves in and is trapped, Escape and the backdrop
 * close it, focus returns to the control that opened it.
 */
export default function IntroDialog() {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const restoreRef = useRef<HTMLElement | null>(null);
    const time = useBangkokTime();

    const close = useCallback(() => setOpen(false), []);

    useEffect(
        () =>
            onIntroOpen(() => {
                restoreRef.current = document.activeElement as HTMLElement | null;
                setCopied(false);
                setOpen(true);
            }),
        [],
    );

    useEffect(() => {
        if (!open) {
            restoreRef.current?.focus?.();
            return;
        }
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus());
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
                return;
            }
            if (e.key !== 'Tab' || !panelRef.current) return;
            const items = [...panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')];
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [open, close]);

    const onCopy = async () => {
        if (await copyEmail()) {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2200);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="intro"
                    className="fixed inset-0 z-[9000] flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                >
                    <div className="absolute inset-0 bg-bg/80" onClick={close} aria-hidden="true" />
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="intro-title"
                        aria-describedby="intro-desc"
                        initial={{ y: 16, scale: 0.98 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: 8, scale: 0.99 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-md overflow-hidden rounded-xl border border-hairline-strong bg-bg text-text shadow-[0_0_18px_color-mix(in_srgb,var(--color-signal)_18%,transparent)]"
                    >
                        <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
                            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-text">
                                <span className="h-1 w-1 rounded-full bg-signal" aria-hidden="true" />
                                Request an intro
                            </span>
                            <button
                                type="button"
                                onClick={close}
                                className="rounded-full p-1.5 text-text-mute transition-colors hover:bg-text-strong/10 hover:text-text-strong"
                                aria-label="Close"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>

                        <div className="px-5 pb-5 pt-6">
                            <h2 id="intro-title" className="text-3xl leading-none tracking-[-0.02em] text-text-strong">
                                Say <span className="font-serif font-normal italic text-signal">hello</span>.
                            </h2>
                            <p id="intro-desc" className="mt-3 text-sm leading-relaxed text-text-mute">
                                Pick the way that works for you. Each draft has a short template to fill in.
                            </p>

                            {/* Fastest path: the address itself. */}
                            <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-hairline py-2 pl-4 pr-2">
                                <span className="min-w-0 truncate font-mono text-xs tracking-[0.04em] text-text-strong">{EMAIL}</span>
                                <button
                                    type="button"
                                    data-autofocus
                                    onClick={onCopy}
                                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-text-strong px-4 py-2 text-xs font-medium text-bg transition-colors hover:bg-signal"
                                >
                                    {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                                    {copied ? 'Copied' : 'Copy email'}
                                </button>
                            </div>
                            <span role="status" className="sr-only">
                                {copied ? 'Email address copied to clipboard' : ''}
                            </span>

                            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute">Or open a draft in</p>
                            <ul className="mt-3 grid grid-cols-2 gap-2">
                                <Option href={INTRO_GMAIL} external onDone={close} icon={<Mail className="h-4 w-4" />}>
                                    Gmail
                                </Option>
                                <Option href={INTRO_OUTLOOK} external onDone={close} icon={<Mail className="h-4 w-4" />}>
                                    Outlook
                                </Option>
                                <Option href={INTRO_MAILTO} onDone={close} icon={<Mail className="h-4 w-4" />}>
                                    Mail app
                                </Option>
                                <Option href={LINKEDIN} external onDone={close} icon={<Linkedin className="h-4 w-4" />}>
                                    LinkedIn
                                </Option>
                            </ul>
                        </div>

                        <div className="border-t border-hairline px-5 py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-text-mute tabular-nums">
                            Bangkok <span className="text-text-strong">{time}</span> · ICT (UTC+7)
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function Option({ href, external, onDone, icon, children }: { href: string; external?: boolean; onDone: () => void; icon: ReactNode; children: ReactNode }) {
    return (
        <li>
            <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                onClick={onDone}
                className="group flex items-center justify-between gap-2 rounded-lg border border-hairline px-3.5 py-3 text-sm text-text-strong transition-colors hover:border-hairline-strong hover:bg-panel"
            >
                <span className="flex items-center gap-2.5">
                    <span className="text-text-mute transition-colors group-hover:text-signal" aria-hidden="true">
                        {icon}
                    </span>
                    {children}
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-text-mute transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
        </li>
    );
}
