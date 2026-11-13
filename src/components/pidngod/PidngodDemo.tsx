import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Check, CornerDownLeft, Download, RotateCcw } from 'lucide-react';
import {
    analyze,
    baht,
    exportRows,
    FORM_EN,
    learn,
    maskTin,
    obligations,
    toCsv,
    type Analysis,
    type Say,
    type Severity,
    type VendorRule,
} from './engine';
import { ACCOUNT_NAME, ACCOUNTS, baseCtx, CLIENT, CTRL, initialDocs, initialRules, TAX_MONTH, TYPE_LABEL, type DemoDoc } from './data';

/**
 * The Pidngod review desk, running in the browser. Nothing here is scripted:
 * the product's own check engine analyses the 18 sample documents on every
 * change, so confirming, correcting a code or requesting a new document
 * moves the deadline board and the export exactly as it would in the app.
 */

type Lang = 'en' | 'th';
type Filter = 'all' | 'attention' | 'ready' | 'confirmed';
type State = 'dup' | 'confirmed' | 'requested' | 'blocked' | 'review' | 'clean';

const TONE: Record<Severity | State, string> = {
    ok: 'var(--pg-ok)',
    clean: 'var(--pg-ok)',
    confirmed: 'var(--pg-ok)',
    info: 'var(--pg-info)',
    warn: 'var(--pg-warn)',
    review: 'var(--pg-warn)',
    requested: 'var(--pg-warn)',
    block: 'var(--pg-block)',
    blocked: 'var(--pg-block)',
    dup: 'var(--color-text-mute)',
};
const STATE_LABEL: Record<State, Say> = {
    dup: { en: 'Duplicate, skipped', th: 'ซ้ำ · ข้าม' },
    confirmed: { en: 'Confirmed', th: 'ยืนยันแล้ว' },
    requested: { en: 'New document requested', th: 'ขอเอกสารใหม่แล้ว' },
    blocked: { en: 'Blocked', th: 'ติดปัญหา' },
    review: { en: 'Needs a person', th: 'ให้คนตรวจ' },
    clean: { en: 'Ready to confirm', th: 'รอยืนยัน' },
};
const SEV_LABEL: Record<Severity, Say> = {
    ok: { en: 'Pass', th: 'ผ่าน' },
    info: { en: 'Note', th: 'ข้อมูล' },
    warn: { en: 'Warning', th: 'เตือน' },
    block: { en: 'Blocked', th: 'ติด' },
};
const TH_M = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const EN_M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** Thai documents carry Buddhist Era years (CE + 543). */
const fmtDate = (iso: string, lang: Lang) => {
    const [y, m, d] = iso.split('-').map(Number);
    return lang === 'th' ? `${d} ${TH_M[m - 1]} ${y + 543}` : `${d} ${EN_M[m - 1]} ${y}`;
};

const stateOf = (d: DemoDoc, a: Analysis): State =>
    a.dupOf ? 'dup' : d.status === 'confirmed' ? 'confirmed' : d.status === 'requested' ? 'requested' : a.blocks ? 'blocked' : a.review ? 'review' : 'clean';

const label = 'font-mono text-[11px] uppercase tracking-[0.2em] text-text-mute';

function Pill({ tone, children }: { tone: string; children: ReactNode }) {
    return (
        <span
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ color: tone, backgroundColor: `color-mix(in srgb, ${tone} 14%, transparent)` }}
        >
            {children}
        </span>
    );
}

function Segmented<T extends string>({ value, onChange, options, name }: { value: T; onChange: (v: T) => void; options: Array<[T, string]>; name: string }) {
    return (
        <div role="group" aria-label={name} className="inline-flex rounded-full border border-hairline p-0.5">
            {options.map(([v, text]) => (
                <button
                    key={v}
                    type="button"
                    aria-pressed={value === v}
                    onClick={() => onChange(v)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${value === v ? 'bg-text-strong text-bg' : 'text-text-mute hover:text-text-strong'}`}
                >
                    {text}
                </button>
            ))}
        </div>
    );
}

export default function PidngodDemo() {
    const [docs, setDocs] = useState<DemoDoc[]>(initialDocs);
    const [rules, setRules] = useState<Record<string, VendorRule>>(initialRules);
    const [lang, setLang] = useState<Lang>('en');
    const [filter, setFilter] = useState<Filter>('all');
    const [sel, setSel] = useState('d1');
    const [format, setFormat] = useState<'peak' | 'jv'>('peak');
    const [channel, setChannel] = useState<'e' | 'p'>('e');
    const [log, setLog] = useState<Say[]>([]);
    const listRef = useRef<HTMLOListElement>(null);

    const L = (s: Say) => s[lang];
    const t = (en: string, th: string) => (lang === 'en' ? en : th);
    const form = (f: string) => (lang === 'en' ? FORM_EN[f] ?? f : f);
    const vendorOf = (d: DemoDoc) => (lang === 'en' ? d.vendorEn : d.vendor);
    const accountOf = (code: string) => (ACCOUNT_NAME[code] ? L(ACCOUNT_NAME[code]) : '');

    // The engine: every document, re-analysed whenever anything changes.
    const an = useMemo(() => {
        const ctx = baseCtx(rules);
        return Object.fromEntries(docs.map((d) => [d.id, analyze(ctx, d, docs, TAX_MONTH)])) as Record<string, Analysis>;
    }, [docs, rules]);

    const counts = useMemo(() => {
        const c = { all: docs.length, attention: 0, ready: 0, confirmed: 0, dup: 0, high: 0 };
        for (const d of docs) {
            const s = stateOf(d, an[d.id]);
            if (s === 'dup') c.dup++;
            else if (s === 'confirmed') c.confirmed++;
            else if (s === 'clean') {
                c.ready++;
                if (an[d.id].conf >= 90) c.high++;
            } else c.attention++;
        }
        return c;
    }, [docs, an]);
    const live = counts.all - counts.dup;
    const handled = docs.filter((d) => !an[d.id].dupOf && d.status !== 'ready').length;

    const list = docs.filter((d) => {
        const s = stateOf(d, an[d.id]);
        if (filter === 'attention') return s === 'blocked' || s === 'review' || s === 'requested';
        if (filter === 'ready') return s === 'clean';
        if (filter === 'confirmed') return s === 'confirmed';
        return true;
    });
    const cur = list.find((d) => d.id === sel) ?? list[0];
    const board = useMemo(() => obligations(docs, an, TAX_MONTH, channel), [docs, an, channel]);
    const exportable = docs.filter((d) => d.status === 'confirmed' && !an[d.id].dupOf);
    const table = useMemo(() => exportRows(format, exportable, an, ACCOUNTS, CTRL), [format, exportable, an]);

    const note = (s: Say) => setLog((l) => [s, ...l].slice(0, 4));
    const patch = (id: string, p: Partial<DemoDoc>) => setDocs((ds) => ds.map((d) => (d.id === id ? { ...d, ...p } : d)));

    const confirm = (d: DemoDoc) => {
        const a = an[d.id];
        if (a.dupOf || !a.code || d.status === 'confirmed') return;
        const code = d.code || a.code;
        setRules((r) => learn(r, d.vendor, code, d.codeEdited));
        patch(d.id, { status: 'confirmed', code });
        note({ en: `Confirmed ${d.vendorEn} to ${code}. The vendor rule is stronger now.`, th: `ยืนยัน ${d.vendor} → ${code}` });
        // Move on to the next document that still needs a decision.
        const i = list.findIndex((x) => x.id === d.id);
        const next = [...list.slice(i + 1), ...list.slice(0, i)].find((x) => x.status === 'ready' && !an[x.id].dupOf);
        if (next) setSel(next.id);
    };
    const pickCode = (d: DemoDoc, code: string) => {
        if (d.status === 'confirmed') return;
        setRules((r) => learn(r, d.vendor, code, true));
        patch(d.id, { code, codeEdited: true });
        note({ en: `Remembered: ${d.vendorEn} goes to ${code} from now on.`, th: `จำไว้แล้ว: ${d.vendor} → ${code}` });
    };
    const request = (d: DemoDoc) => {
        patch(d.id, { status: 'requested' });
        note({ en: `Asked the client for a new document from ${d.vendorEn}.`, th: `ขอเอกสารใหม่: ${d.vendor} ${d.no}` });
    };
    const unconfirm = (d: DemoDoc) => {
        patch(d.id, { status: 'ready' });
        note({ en: `Reopened ${d.vendorEn}.`, th: `ยกเลิกการยืนยัน ${d.vendor} ${d.no}` });
    };
    const confirmHigh = () => {
        const todo = docs.filter((d) => d.status === 'ready' && !an[d.id].review && !an[d.id].dupOf && an[d.id].conf >= 90);
        if (!todo.length) return;
        let r = rules;
        for (const d of todo) r = learn(r, d.vendor, d.code || an[d.id].code!, d.codeEdited);
        setRules(r);
        const ids = new Set(todo.map((d) => d.id));
        setDocs((ds) => ds.map((d) => (ids.has(d.id) ? { ...d, status: 'confirmed', code: d.code || an[d.id].code } : d)));
        note({ en: `Confirmed ${todo.length} clean documents at 90% confidence or more.`, th: `ยืนยันรายการที่ไม่มีคำเตือนและมั่นใจ 90% ขึ้นไป ${todo.length} รายการ` });
    };
    const reset = () => {
        setDocs(initialDocs());
        setRules(initialRules());
        setFilter('all');
        setSel('d1');
        setLog([]);
    };
    const download = () => {
        const url = URL.createObjectURL(new Blob([toCsv(table)], { type: 'text/csv;charset=utf-8' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = format === 'peak' ? 'pidngod-peak-import-2026-10.csv' : 'pidngod-journal-2026-10.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // Arrow keys walk the queue and Enter confirms, as in the product. Scoped
    // to the list so the page keeps its own keys.
    const onKey = (e: KeyboardEvent) => {
        if (!cur) return;
        const i = list.findIndex((d) => d.id === cur.id);
        const go = (d?: DemoDoc) => {
            if (!d) return;
            e.preventDefault();
            setSel(d.id);
            listRef.current?.querySelector<HTMLElement>(`[data-doc="${d.id}"]`)?.focus();
        };
        if (e.key === 'ArrowDown') go(list[i + 1]);
        else if (e.key === 'ArrowUp') go(list[i - 1]);
        else if (e.key === 'Enter' && cur.status === 'ready' && !an[cur.id].dupOf && !an[cur.id].blocks) {
            e.preventDefault();
            confirm(cur);
        }
    };

    const detail = (d: DemoDoc) => <Detail d={d} a={an[d.id]} lang={lang} dupSeq={docs.find((x) => x.id === an[d.id].dupOf)?.seq} onConfirm={confirm} onCode={pickCode} onRequest={request} onUnconfirm={unconfirm} />;

    return (
        <div className="pidngod overflow-hidden rounded-xl border border-hairline bg-bg" lang={lang}>
            {/* Desk header: whose books, which month, which language. */}
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-hairline px-4 py-3 md:px-6">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-strong">{L(CLIENT.name)}</p>
                    <p className="mt-0.5 truncate text-xs text-text-mute">
                        {L(CLIENT.biz)} · {t('Tax month', 'เดือนภาษี')} {t('October 2026', 'ต.ค. 2569')} · {t('books in', 'โปรแกรมบัญชี')} {CLIENT.software}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Segmented
                        name={t('Language', 'ภาษา')}
                        value={lang}
                        onChange={setLang}
                        options={[
                            ['en', 'English'],
                            ['th', 'ไทย'],
                        ]}
                    />
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs font-medium text-text-mute transition-colors hover:border-hairline-strong hover:text-text-strong"
                    >
                        <RotateCcw className="h-3 w-3" aria-hidden="true" />
                        {t('Reset', 'เริ่มใหม่')}
                    </button>
                </div>
            </div>

            {/* Progress: how much of the month is decided. */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-hairline px-4 py-3 md:px-6">
                <div className="min-w-[12rem] flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                        <span className={label}>{t('Month decided', 'ความคืบหน้าของเดือน')}</span>
                        <span className="font-mono text-xs tabular-nums text-text-strong">
                            {handled} / {live}
                        </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-panel-strong" aria-hidden="true">
                        <div className="h-full origin-left rounded-full transition-transform duration-500" style={{ backgroundColor: 'var(--pg-ok)', transform: `scaleX(${handled / live})` }} />
                    </div>
                </div>
                <button
                    type="button"
                    disabled={!counts.high}
                    onClick={confirmHigh}
                    className="inline-flex items-center gap-2 rounded-full bg-text-strong px-4 py-2 text-xs font-medium text-bg transition-colors hover:bg-signal disabled:cursor-default disabled:bg-panel-strong disabled:text-text-mute"
                >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    {counts.high ? t(`Confirm the ${counts.high} clean ones (90%+)`, `ยืนยันที่มั่นใจ 90% ขึ้นไป (${counts.high})`) : t('Clean ones are confirmed', 'ยืนยันรายการที่มั่นใจแล้ว')}
                </button>
            </div>

            {/* On desktop the desk is one window: the queue and the open document
                scroll inside it, side by side. Lenis leaves these two alone. */}
            <div className="grid lg:h-[min(46rem,calc(100svh-13rem))] lg:min-h-[32rem] lg:grid-cols-12">
                {/* Queue */}
                <div className="flex min-h-0 min-w-0 flex-col border-hairline lg:col-span-7 lg:border-r">
                    <div className="flex flex-wrap items-center gap-2 px-4 py-3 md:px-6">
                        {(
                            [
                                ['all', t('All', 'ทั้งหมด'), counts.all],
                                ['attention', t('Needs a person', 'ต้องดู'), counts.attention],
                                ['ready', t('Ready', 'รอยืนยัน'), counts.ready],
                                ['confirmed', t('Confirmed', 'ยืนยันแล้ว'), counts.confirmed],
                            ] as const
                        ).map(([f, text, n]) => (
                            <button
                                key={f}
                                type="button"
                                aria-pressed={filter === f}
                                onClick={() => setFilter(f)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                                    filter === f ? 'border-text-strong bg-text-strong text-bg' : 'border-hairline text-text-mute hover:text-text-strong'
                                }`}
                            >
                                {text} <span className="tabular-nums opacity-70">{n}</span>
                            </button>
                        ))}
                        <span className="ml-auto hidden items-center gap-1.5 text-xs text-text-mute lg:inline-flex">
                            ↑ ↓ {t('to move,', 'เลื่อน')} <CornerDownLeft className="h-3 w-3" aria-hidden="true" /> {t('to confirm', 'ยืนยัน')}
                        </span>
                    </div>

                    <ol ref={listRef} onKeyDown={onKey} data-lenis-prevent className="min-h-0 flex-1 border-t border-hairline lg:overflow-y-auto" aria-label={t('Documents', 'เอกสาร')}>
                        {list.length === 0 && <li className="px-6 py-10 text-center text-sm text-text-mute">{t('Nothing in this view.', 'ไม่มีเอกสารในมุมมองนี้')}</li>}
                        {list.map((d) => {
                            const a = an[d.id];
                            const s = stateOf(d, a);
                            const on = cur?.id === d.id;
                            return (
                                <li key={d.id} className="border-b border-hairline last:border-b-0">
                                    <button
                                        type="button"
                                        data-doc={d.id}
                                        aria-current={on ? 'true' : undefined}
                                        onClick={() => setSel(d.id)}
                                        className={`grid w-full grid-cols-[1.5rem_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 px-4 py-3 text-left transition-colors focus-visible:outline-offset-[-2px] md:px-6 ${
                                            on ? 'bg-panel-strong' : 'hover:bg-panel'
                                        } ${s === 'dup' ? 'opacity-55' : ''}`}
                                    >
                                        <span className="pt-0.5 font-mono text-xs tabular-nums text-text-mute">{String(d.seq).padStart(2, '0')}</span>
                                        <span className="min-w-0">
                                            <span className="block truncate text-sm font-medium text-text-strong">{vendorOf(d)}</span>
                                            <span className="mt-0.5 block truncate text-xs text-text-mute">
                                                {lang === 'en' ? d.descEn : d.desc} · {d.no}
                                            </span>
                                        </span>
                                        <span className="text-right font-mono text-sm tabular-nums text-text-strong">{baht(d.base + d.vat)}</span>
                                        <span className="col-start-2 flex min-w-0 flex-wrap items-center gap-2">
                                            <Pill tone={TONE[s]}>
                                                {s === 'confirmed' && <Check className="h-3 w-3" aria-hidden="true" />}
                                                {L(STATE_LABEL[s])}
                                            </Pill>
                                            {s !== 'dup' && a.code && (
                                                <span className="truncate text-xs text-text">
                                                    <span className="font-mono tabular-nums text-text-strong">{a.code}</span> {accountOf(a.code)}
                                                </span>
                                            )}
                                        </span>
                                        {s !== 'dup' && (
                                            <span className="flex items-center justify-end gap-2" title={t('Confidence in the account code', 'ความมั่นใจในรหัสบัญชี')}>
                                                <span className="h-1 w-10 overflow-hidden rounded-full bg-panel-strong" aria-hidden="true">
                                                    <span className="block h-full rounded-full" style={{ width: `${a.conf}%`, backgroundColor: a.conf >= 85 ? 'var(--pg-ok)' : 'var(--pg-warn)' }} />
                                                </span>
                                                <span className="w-9 text-right font-mono text-xs tabular-nums text-text-mute">{a.conf}%</span>
                                            </span>
                                        )}
                                    </button>
                                    {/* Phones: the document opens in place, under its row. */}
                                    {on && <div className="border-t border-hairline bg-panel lg:hidden">{detail(d)}</div>}
                                </li>
                            );
                        })}
                    </ol>
                </div>

                {/* Detail: desktop keeps it beside the queue. */}
                <div data-lenis-prevent className="hidden min-h-0 min-w-0 lg:col-span-5 lg:block lg:overflow-y-auto">{cur ? detail(cur) : <p className="p-10 text-center text-sm text-text-mute">{t('Pick a document.', 'เลือกเอกสาร')}</p>}</div>
            </div>

            {/* Consequences: what the decisions above do to the month. */}
            <div className="grid border-t border-hairline lg:grid-cols-12">
                <section className="min-w-0 border-hairline px-4 py-5 md:px-6 lg:col-span-5 lg:border-r" aria-label={t('Filing deadlines', 'กำหนดยื่นแบบ')}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className={label}>{t('Filing deadlines', 'กระดานกำหนดยื่น')}</h3>
                        <Segmented
                            name={t('Filing channel', 'ช่องทางยื่น')}
                            value={channel}
                            onChange={setChannel}
                            options={[
                                ['e', t('Online', 'ออนไลน์')],
                                ['p', t('Paper', 'กระดาษ')],
                            ]}
                        />
                    </div>
                    <ul className="mt-4 divide-y divide-hairline">
                        {board.map((o) => (
                            <li key={o.form} className="flex items-center justify-between gap-3 py-2.5">
                                <span className="min-w-0">
                                    <span className="font-mono text-sm tabular-nums text-text-strong">{form(o.form)}</span>
                                    <span className="ml-2 text-xs text-text-mute">
                                        {t('due', 'ครบกำหนด')} {fmtDate(o.due, lang)}
                                        {o.moved && ` · ${t(`moved from ${o.moved}`, `เลื่อนจาก${o.moved === 'Sunday' ? 'อาทิตย์' : 'เสาร์'}`)}`}
                                    </span>
                                </span>
                                <Pill tone={o.status === 'ready' ? 'var(--pg-ok)' : 'var(--pg-warn)'}>{o.status === 'ready' ? t('Ready to file', 'พร้อมยื่น') : t('In review', 'กำลังตรวจ')}</Pill>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-xs leading-relaxed text-text-mute">
                        {t(
                            'Each status is worked out from the documents above. A form turns ready when every document behind it is confirmed or sent back.',
                            'สถานะคำนวณจากเอกสารจริง แบบจะพร้อมยื่นเมื่อเอกสารทุกใบยืนยันแล้วหรือขอเอกสารใหม่แล้ว',
                        )}
                    </p>

                    <div className="mt-6" aria-live="polite">
                        <h3 className={label}>{t('Activity', 'ประวัติการทำงาน')}</h3>
                        {log.length === 0 ? (
                            <p className="mt-3 text-xs text-text-mute">{t('Nothing yet. Confirm a document to start the log.', 'ยังไม่มีรายการ')}</p>
                        ) : (
                            <ul className="mt-3 space-y-1.5">
                                {log.map((l, i) => (
                                    <li key={`${log.length - i}`} className={`text-xs leading-relaxed ${i === 0 ? 'text-text-strong' : 'text-text-mute'}`}>
                                        {L(l)}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                <section className="min-w-0 px-4 py-5 md:px-6 lg:col-span-7" aria-label={t('Export', 'ส่งออก')}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className={label}>
                            {t('Export', 'ส่งออก')} · {exportable.length} {t('confirmed', 'รายการที่ยืนยันแล้ว')}
                        </h3>
                        <div className="flex items-center gap-2">
                            <Segmented
                                name={t('Export format', 'รูปแบบไฟล์')}
                                value={format}
                                onChange={setFormat}
                                options={[
                                    ['peak', t('PEAK import', 'ไฟล์นำเข้า PEAK')],
                                    ['jv', t('Journal', 'สมุดรายวัน')],
                                ]}
                            />
                            <button
                                type="button"
                                disabled={!exportable.length}
                                onClick={download}
                                className="inline-flex items-center gap-1.5 rounded-full border border-hairline-strong px-3 py-1.5 text-xs font-medium text-text-strong transition-colors hover:bg-text-strong hover:text-bg disabled:cursor-default disabled:border-hairline disabled:text-text-mute disabled:hover:bg-transparent"
                            >
                                <Download className="h-3 w-3" aria-hidden="true" />
                                CSV
                            </button>
                        </div>
                    </div>
                    {exportable.length === 0 ? (
                        <p className="mt-4 rounded-lg border border-dashed border-hairline px-4 py-8 text-center text-sm text-text-mute">
                            {t('Confirmed documents appear here as rows your accounting software can import.', 'เอกสารที่ยืนยันแล้วจะแสดงที่นี่เป็นแถวที่นำเข้าโปรแกรมบัญชีได้')}
                        </p>
                    ) : (
                        // The file itself is Thai, because the accounting software reads Thai headers.
                        <div data-lenis-prevent className="mt-4 max-h-64 overflow-auto rounded-lg border border-hairline" tabIndex={0} role="region" aria-label={t('Export preview', 'ตัวอย่างไฟล์ส่งออก')} lang="th">
                            <table className="w-full border-collapse text-left text-xs">
                                <thead>
                                    <tr>
                                        {table[0].map((h) => (
                                            <th key={h} className="sticky top-0 whitespace-nowrap border-b border-hairline bg-bg px-3 py-2 font-medium text-text-mute">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.slice(1).map((row, r) => (
                                        <tr key={r} className="border-b border-hairline last:border-b-0">
                                            {row.map((v, c) => (
                                                <td key={c} className={`max-w-[14rem] truncate whitespace-nowrap px-3 py-1.5 ${/^-?\d[\d.,/]*$/.test(v) ? 'font-mono tabular-nums text-text-strong' : 'text-text'}`}>
                                                    {v}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function Detail({
    d,
    a,
    lang,
    dupSeq,
    onConfirm,
    onCode,
    onRequest,
    onUnconfirm,
}: {
    d: DemoDoc;
    a: Analysis;
    lang: Lang;
    dupSeq?: number;
    onConfirm: (d: DemoDoc) => void;
    onCode: (d: DemoDoc, code: string) => void;
    onRequest: (d: DemoDoc) => void;
    onUnconfirm: (d: DemoDoc) => void;
}) {
    const L = (s: Say) => s[lang];
    const t = (en: string, th: string) => (lang === 'en' ? en : th);
    const name = (code: string) => (ACCOUNT_NAME[code] ? L(ACCOUNT_NAME[code]) : '');
    const locked = d.status === 'confirmed';
    const vat = a.claimVat ? d.vat : 0;
    const fact = 'grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-3 py-1.5 text-sm';

    return (
        <div className="px-4 py-5 md:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="text-lg font-medium leading-snug tracking-[-0.01em] text-text-strong">{lang === 'en' ? d.vendorEn : d.vendor}</h3>
                    {lang === 'en' && d.vendorEn !== d.vendor && (
                        <p className="mt-0.5 text-xs text-text-mute" lang="th">
                            {d.vendor}
                        </p>
                    )}
                </div>
                <Pill tone="var(--color-text)">{L(TYPE_LABEL[d.type])}</Pill>
            </div>

            <dl className="mt-4 divide-y divide-hairline border-y border-hairline">
                <div className={fact}>
                    <dt className="text-text-mute">{t('Document', 'เลขที่')}</dt>
                    <dd className="truncate text-text-strong">
                        {d.no} · {fmtDate(d.date, lang)} · {t('via', 'ที่มา')} {d.src}
                    </dd>
                </div>
                <div className={fact}>
                    <dt className="text-text-mute">{t('Seller tax ID', 'เลขผู้เสียภาษี')}</dt>
                    <dd className="font-mono tabular-nums text-text-strong">{d.tin ? maskTin(d.tin) : '—'}</dd>
                </div>
                <div className={fact}>
                    <dt className="text-text-mute">{t('Line', 'รายการ')}</dt>
                    <dd className="text-text-strong">
                        {lang === 'en' ? d.descEn : d.desc}
                        {lang === 'en' && (
                            <span className="mt-0.5 block text-xs text-text-mute" lang="th">
                                {d.desc}
                            </span>
                        )}
                    </dd>
                </div>
                <div className={fact}>
                    <dt className="text-text-mute">{t('Amount · VAT', 'มูลค่า · VAT')}</dt>
                    <dd className="font-mono tabular-nums text-text-strong">
                        {baht(d.base)} · {baht(d.vat)}
                    </dd>
                </div>
                {d.wht > 0 && (
                    <div className={fact}>
                        <dt className="text-text-mute">{t('Withholding', 'หัก ณ ที่จ่าย')}</dt>
                        <dd className="font-mono tabular-nums text-text-strong">
                            {baht(d.wht)} · {lang === 'en' ? FORM_EN[a.whtForm] : a.whtForm}
                        </dd>
                    </div>
                )}
            </dl>

            <h4 className={`mt-6 ${label}`}>{t('Checks', 'ผลตรวจ')}</h4>
            <ul className="mt-3 space-y-2">
                {a.findings.map((f, i) => (
                    <li key={i} className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-x-3 text-sm">
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: TONE[f.sev] }}>
                            {L(SEV_LABEL[f.sev])}
                        </span>
                        <span className="leading-relaxed text-text">
                            {L(f.text)}
                            {f === a.findings[0] && a.dupOf && dupSeq ? ` (${t('see document', 'ดูเอกสาร')} ${String(dupSeq).padStart(2, '0')})` : ''}
                        </span>
                    </li>
                ))}
            </ul>

            {!a.dupOf && (
                <>
                    <h4 className={`mt-6 ${label}`}>{t('Account code', 'รหัสบัญชีที่เสนอ')}</h4>
                    <div className="mt-3 space-y-2">
                        {a.sugg.slice(0, 3).map((s) => {
                            const on = s.code === a.code;
                            return (
                                <button
                                    key={s.code}
                                    type="button"
                                    aria-pressed={on}
                                    disabled={locked}
                                    onClick={() => onCode(d, s.code)}
                                    className={`block w-full rounded-lg border px-3 py-2.5 text-left transition-colors disabled:cursor-default ${
                                        on ? 'border-[var(--pg-ok)] bg-[color-mix(in_srgb,var(--pg-ok)_8%,transparent)]' : 'border-hairline hover:border-hairline-strong'
                                    }`}
                                >
                                    <span className="flex items-baseline justify-between gap-3">
                                        <span className="min-w-0 truncate text-sm text-text-strong">
                                            <span className="font-mono tabular-nums">{s.code}</span> {name(s.code)}
                                        </span>
                                        <span className="font-mono text-xs tabular-nums text-text-mute">{on && d.codeEdited ? t('set by you', 'แก้โดยผู้ทำบัญชี') : `${s.score}%`}</span>
                                    </span>
                                    <span className="mt-1 block text-xs leading-relaxed text-text-mute">{L(s.why)}</span>
                                </button>
                            );
                        })}
                        {!locked && (
                            <label className="flex items-center gap-3 pt-1 text-xs text-text-mute">
                                <span className="shrink-0">{t('Or choose another', 'หรือเลือกรหัสอื่น')}</span>
                                <select
                                    value=""
                                    onChange={(e) => e.target.value && onCode(d, e.target.value)}
                                    className="min-w-0 flex-1 rounded-lg border border-hairline bg-bg px-2 py-1.5 text-sm text-text-strong"
                                >
                                    <option value="">{t('Chart of accounts', 'ผังบัญชี')}</option>
                                    {ACCOUNTS.map((x) => (
                                        <option key={x.code} value={x.code}>
                                            {x.code} {name(x.code)}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                    </div>

                    <h4 className={`mt-6 ${label}`}>{t('What gets posted', 'ผลต่อการบันทึก')}</h4>
                    <dl className="mt-3 font-mono text-xs tabular-nums">
                        {(
                            [
                                [`Dr ${a.code ?? ''} ${a.code ? name(a.code) : ''}`, a.expense, true],
                                [t('Dr Input VAT', 'Dr ภาษีซื้อ'), vat, vat > 0],
                                [t('Cr Withholding tax payable', 'Cr ภาษีหัก ณ ที่จ่ายค้างจ่าย'), d.wht, d.wht > 0],
                                [t('Cr Accounts payable', 'Cr เจ้าหนี้'), a.expense + vat - d.wht, true],
                            ] as const
                        )
                            .filter(([, , show]) => show)
                            .map(([k, v]) => (
                                <div key={k} className="flex items-baseline justify-between gap-4 py-1">
                                    <dt className="min-w-0 truncate font-sans text-sm text-text">{k}</dt>
                                    <dd className="text-sm text-text-strong">{baht(v)}</dd>
                                </div>
                            ))}
                    </dl>
                </>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
                {d.status === 'ready' && !a.dupOf && a.blocks === 0 && (
                    <button
                        type="button"
                        onClick={() => onConfirm(d)}
                        className="inline-flex items-center gap-2 rounded-full bg-text-strong px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-signal"
                    >
                        <Check className="h-4 w-4" aria-hidden="true" />
                        {t('Confirm', 'ยืนยัน')}
                    </button>
                )}
                {d.status === 'ready' && !a.dupOf && a.blocks > 0 && (
                    <>
                        <button
                            type="button"
                            onClick={() => onRequest(d)}
                            className="inline-flex items-center gap-2 rounded-full bg-text-strong px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-signal"
                        >
                            {t('Ask for a new document', 'ขอเอกสารใหม่')}
                        </button>
                        <button
                            type="button"
                            onClick={() => onConfirm(d)}
                            className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-2.5 text-sm font-medium text-text-strong transition-colors hover:bg-panel-strong"
                        >
                            {t('Post as expense, no input VAT', 'ยืนยันเป็นค่าใช้จ่าย ไม่หักภาษีซื้อ')}
                        </button>
                    </>
                )}
                {d.status !== 'ready' && !a.dupOf && (
                    <button
                        type="button"
                        onClick={() => onUnconfirm(d)}
                        className="inline-flex items-center gap-2 rounded-full border border-hairline-strong px-5 py-2.5 text-sm font-medium text-text-strong transition-colors hover:bg-panel-strong"
                    >
                        {t('Reopen', 'ยกเลิกการยืนยัน')}
                    </button>
                )}
                {a.dupOf && <p className="text-sm text-text-mute">{t('Nothing to do. A duplicate is never posted or exported.', 'ไม่ต้องทำอะไร เอกสารซ้ำจะไม่ถูกบันทึกหรือส่งออก')}</p>}
            </div>
        </div>
    );
}
