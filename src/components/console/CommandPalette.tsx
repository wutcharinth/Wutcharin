import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, CornerDownLeft, Copy, Download, FileText, Github, Hash, Linkedin, Mail, Search, SunMoon } from 'lucide-react';
import { projects } from '../../data/projects';
import { CHAPTERS } from '../home/chapters';
import { EMAIL, LINKEDIN, GITHUB, RESUME, copyEmail } from '../home/contact';
import { openIntro } from '../intro/introBus';
import { toggleTheme } from '../../lib/theme';
import { useScrollTo } from '../home/useScrollTo';
import { onConsoleOpen } from './consoleBus';

/**
 * The console: ⌘K / Ctrl K / "/" from anywhere. Jump to a chapter, open any
 * project, or act (copy email, résumé, theme). One keyboard-first surface
 * that also serves as the mobile menu.
 *
 * Accessibility: modal dialog, focus held on the input, listbox with
 * aria-activedescendant, Escape and backdrop close, focus restored.
 */

type Item = {
    id: string;
    group: 'Jump to' | 'Projects' | 'Actions';
    label: string;
    hint?: string;
    keywords?: string;
    icon: ReactNode;
    run: () => void | Promise<void>;
};

/** Subsequence fuzzy score: contiguous and word-start hits rank higher. */
function score(query: string, text: string) {
    if (!query) return 1;
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    const direct = t.indexOf(q);
    if (direct >= 0) return 100 - direct + (direct === 0 || t[direct - 1] === ' ' ? 20 : 0);
    let ti = 0;
    let s = 0;
    for (const ch of q) {
        const found = t.indexOf(ch, ti);
        if (found < 0) return 0;
        s += found === ti ? 3 : 1;
        ti = found + 1;
    }
    return s;
}

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [cursor, setCursor] = useState(0);
    const [toast, setToast] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const restoreRef = useRef<HTMLElement | null>(null);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const scrollTo = useScrollTo();

    const close = useCallback(() => setOpen(false), []);
    const show = useCallback(() => {
        restoreRef.current = document.activeElement as HTMLElement | null;
        setQuery('');
        setCursor(0);
        setOpen(true);
    }, []);

    useEffect(() => onConsoleOpen(show), [show]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (open) close();
                else show();
                return;
            }
            const typing = (e.target as HTMLElement | null)?.closest('input, textarea, [contenteditable="true"]');
            if (!open && e.key === '/' && !typing) {
                e.preventDefault();
                show();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, show, close]);

    useEffect(() => {
        if (!open) {
            restoreRef.current?.focus?.();
            return;
        }
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => inputRef.current?.focus());
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    const flash = (msg: string) => {
        setToast(msg);
        window.setTimeout(() => setToast(''), 2000);
    };

    const items = useMemo<Item[]>(() => {
        const jump = (id: string) => () => {
            close();
            if (pathname !== '/') {
                navigate(`/#${id}`);
                window.setTimeout(() => scrollTo(id === 'top' ? 0 : `#${id}`, { immediate: true }), 400);
                return;
            }
            window.setTimeout(() => scrollTo(id === 'top' ? 0 : `#${id}`), 60);
        };
        const external = (url: string) => () => {
            close();
            window.open(url, '_blank', 'noopener,noreferrer');
        };
        return [
            ...CHAPTERS.map<Item>((c) => ({
                id: `ch-${c.id}`,
                group: 'Jump to',
                label: c.name,
                hint: c.index,
                keywords: c.id === 'path' ? 'experience career timeline' : c.id === 'contact' ? 'email hire' : c.id === 'proof' ? 'impact metrics numbers' : '',
                icon: <Hash className="h-4 w-4" />,
                run: jump(c.id),
            })),
            ...projects.map<Item>((p) => {
                const ext = p.link.startsWith('http') || p.link.endsWith('.html');
                const Icon = p.icon;
                return {
                    id: `p-${p.id}`,
                    group: 'Projects',
                    label: p.title,
                    hint: p.tagline ?? p.role,
                    keywords: `${p.tags.join(' ')} ${p.badge ?? ''} ${p.tier}`,
                    icon: <Icon className="h-4 w-4" style={{ color: p.accent }} />,
                    run: ext
                        ? external(p.link)
                        : () => {
                              close();
                              navigate(p.link);
                          },
                };
            }),
            {
                id: 'a-copy',
                group: 'Actions',
                label: 'Copy email address',
                hint: EMAIL,
                keywords: 'contact mail',
                icon: <Copy className="h-4 w-4" />,
                run: async () => flash((await copyEmail()) ? 'Email copied' : EMAIL),
            },
            {
                id: 'a-intro',
                group: 'Actions',
                label: 'Write an introduction',
                keywords: 'email contact hire',
                icon: <Mail className="h-4 w-4" />,
                run: () => {
                    close();
                    window.setTimeout(openIntro, 220);
                },
            },
            {
                id: 'a-cv',
                group: 'Actions',
                label: 'Download résumé',
                hint: 'PDF',
                keywords: 'cv resume',
                icon: <Download className="h-4 w-4" />,
                run: () => {
                    close();
                    const a = document.createElement('a');
                    a.href = RESUME;
                    a.download = 'Wutcharin_Thatan_Resume.pdf';
                    a.click();
                },
            },
            { id: 'a-in', group: 'Actions', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" />, run: external(LINKEDIN) },
            { id: 'a-gh', group: 'Actions', label: 'GitHub', icon: <Github className="h-4 w-4" />, run: external(GITHUB) },
            {
                id: 'a-theme',
                group: 'Actions',
                label: 'Toggle light / dark',
                keywords: 'theme mode',
                icon: <SunMoon className="h-4 w-4" />,
                run: () => toggleTheme(),
            },
        ];
    }, [close, navigate, pathname, scrollTo]);

    const results = useMemo(() => {
        const scored = items
            .map((it) => ({ it, s: Math.max(score(query, it.label) * 2, score(query, `${it.hint ?? ''} ${it.keywords ?? ''}`)) }))
            .filter((r) => r.s > 0);
        if (query) scored.sort((a, b) => b.s - a.s);
        return scored.map((r) => r.it);
    }, [items, query]);

    useEffect(() => {
        listRef.current?.querySelector(`[data-index="${cursor}"]`)?.scrollIntoView({ block: 'nearest' });
    }, [cursor]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setCursor((c) => Math.min(results.length - 1, c + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setCursor((c) => Math.max(0, c - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            void results[cursor]?.run();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            close();
        } else if (e.key === 'Tab') {
            // Focus stays on the input; Tab moves the selection instead.
            e.preventDefault();
            setCursor((c) => (e.shiftKey ? Math.max(0, c - 1) : Math.min(results.length - 1, c + 1)));
        }
    };

    let lastGroup = '';

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="console"
                    className="fixed inset-0 z-[9000] flex items-start justify-center px-4 pt-[12vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                >
                    <div className="absolute inset-0 bg-bg/80" onClick={close} aria-hidden="true" />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Console"
                        initial={{ y: -12, scale: 0.98 }}
                        animate={{ y: 0, scale: 1 }}
                        exit={{ y: -8, scale: 0.99 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-hairline-strong bg-bg text-text shadow-[0_0_18px_color-mix(in_srgb,var(--color-signal)_18%,transparent)]"
                        onKeyDown={onKeyDown}
                    >
                        <div className="flex items-center gap-3 border-b border-hairline px-4">
                            <Search className="h-4 w-4 shrink-0 text-text-mute" aria-hidden="true" />
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setCursor(0);
                                }}
                                placeholder="Search, jump to a chapter, or act"
                                className="h-14 w-full bg-transparent text-base text-text-strong outline-none placeholder:text-text-mute focus-visible:outline-none"
                                role="combobox"
                                aria-expanded="true"
                                aria-controls="console-list"
                                aria-activedescendant={results[cursor] ? `console-${results[cursor].id}` : undefined}
                                aria-autocomplete="list"
                                spellCheck={false}
                            />
                            <kbd className="hidden rounded border border-hairline px-1.5 py-0.5 font-mono text-[10px] text-text-mute sm:block">Esc</kbd>
                        </div>

                        <ul id="console-list" ref={listRef} role="listbox" aria-label="Results" className="max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-2">
                            {results.length === 0 && (
                                <li className="px-3 py-10 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-text-mute">No signal for “{query}”</li>
                            )}
                            {results.map((it, i) => {
                                const header = it.group !== lastGroup;
                                lastGroup = it.group;
                                const on = i === cursor;
                                return (
                                    <li key={it.id} role="presentation">
                                        {header && !query && (
                                            <div className="px-3 pb-1.5 pt-3 font-mono text-[9px] uppercase tracking-[0.28em] text-text-mute">{it.group}</div>
                                        )}
                                        <div
                                            id={`console-${it.id}`}
                                            role="option"
                                            aria-selected={on}
                                            data-index={i}
                                            onMouseMove={() => setCursor(i)}
                                            onClick={() => void it.run()}
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${on ? 'bg-signal/10 text-text-strong' : 'text-text'}`}
                                        >
                                            <span className={on ? 'text-signal' : 'text-text-mute'} aria-hidden="true">
                                                {it.icon}
                                            </span>
                                            <span className="min-w-0 flex-1 truncate text-sm">{it.label}</span>
                                            {it.hint && <span className="hidden max-w-[45%] truncate font-mono text-[10px] uppercase tracking-[0.18em] text-text-mute sm:block">{it.hint}</span>}
                                            {on && (
                                                <span className="text-text-mute" aria-hidden="true">
                                                    {it.group === 'Projects' && it.hint !== undefined ? <ArrowUpRight className="h-3.5 w-3.5" /> : <CornerDownLeft className="h-3.5 w-3.5" />}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.24em] text-text-mute">
                            <span className="flex items-center gap-1.5">
                                <FileText className="h-3 w-3" aria-hidden="true" /> {projects.length} projects · {CHAPTERS.length} chapters
                            </span>
                            <span aria-live="polite" className={toast ? 'text-signal' : ''}>
                                {toast || '↑↓ select · ↵ open'}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
