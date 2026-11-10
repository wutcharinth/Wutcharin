/**
 * Pidngod tax engine, as it runs in the product (github.com/wutcharinth/bancheesolution,
 * src/engine). Pure functions; money is always integer satang (1 baht = 100 satang).
 *
 * The rules and the arithmetic are the product's. This copy differs only
 * where a browser demo has to:
 *   - every message carries an English reading next to the Thai original
 *   - `learn` returns a new rule map (React state) and does not mutate
 *   - the deadline board keeps the two statuses a demo can reach
 */

export type DocType = 'full' | 'abb' | 'cash' | 'etax' | 'foreign';
export type DocStatus = 'ready' | 'confirmed' | 'requested';
export type Severity = 'ok' | 'info' | 'warn' | 'block';
/** A message in both languages. */
export type Say = { th: string; en: string };

export interface Doc {
    id: string;
    date: string; // ISO yyyy-mm-dd (Gregorian)
    no: string;
    vendor: string;
    tin: string;
    buyerTin: string;
    vatReg: boolean;
    desc: string;
    base: number; // satang
    vat: number; // satang
    wht: number; // satang
    type: DocType;
    status: DocStatus;
    code: string | null;
    codeEdited: boolean;
}
export interface Account {
    code: string;
    name: string;
    keywords: string;
}
export interface VendorRule {
    code: string;
    n: number;
    src: 'hist' | 'edit';
}
export interface ClientCtx {
    tin: string;
    capThreshold: number; // satang
    assetCode: string;
    miscCode: string;
    vatxCodes: string[];
    accounts: Account[];
    vendorRules: Record<string, VendorRule>;
}
export interface Finding {
    sev: Severity;
    text: Say;
}
export interface Suggestion {
    code: string;
    score: number;
    why: Say;
}
export type WhtForm = '' | 'ภ.ง.ด.3' | 'ภ.ง.ด.53' | 'ภ.ง.ด.54';
export interface Analysis {
    findings: Finding[];
    dupOf: string | null;
    sugg: Suggestion[];
    code: string | null;
    conf: number;
    blocks: number;
    warns: number;
    claimVat: boolean;
    vatx: boolean;
    expense: number; // satang posted to the expense / asset account
    whtForm: WhtForm;
    whtRate: number;
    pp36: number; // satang
    review: boolean;
}

/** Statutory values. Effective-dated in the real system; verified with the Revenue Department before production. */
export const RULES = {
    vatRatePct: 7,
    inputVatWindowMonths: 6,
    whtThreshold: 100000, // 1,000 baht in satang
    foreignWhtPct: 15,
    whtRateHints: [
        [/ขนส่ง/, 1],
        [/เช่า/, 5],
        [/โฆษณา|advertis/i, 2],
    ] as [RegExp, number][],
    defaultServiceWhtPct: 3,
};

/** Form names as an English reader would look them up. */
export const FORM_EN: Record<string, string> = {
    'ภ.พ.30': 'PP30',
    'ภ.พ.36': 'PP36',
    'ภ.ง.ด.3': 'PND3',
    'ภ.ง.ด.53': 'PND53',
    'ภ.ง.ด.54': 'PND54',
};

export const vatOf = (baseSatang: number) => Math.round((baseSatang * RULES.vatRatePct) / 100);
export const baht = (s: number) => (s / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const toSatang = (v: number) => Math.round(v * 100);

export function tinValid(t: string): boolean {
    if (!/^\d{13}$/.test(t)) return false;
    let s = 0;
    for (let i = 0; i < 12; i++) s += +t[i] * (13 - i);
    return (11 - (s % 11)) % 10 === +t[12];
}
export const withCheckDigit = (s12: string) => {
    let t = 0;
    for (let i = 0; i < 12; i++) t += +s12[i] * (13 - i);
    return s12 + ((11 - (t % 11)) % 10);
};
/** Individuals' national ID numbers are masked on screen (PDPA). Juristic tax IDs start with 0 and stay visible. */
export const maskTin = (t: string) => (/^\d{13}$/.test(t) && t[0] !== '0' ? `${t[0]}-${t.slice(1, 5)}-xxxxx-xx-${t[12]}` : t);

export const monthsBetween = (isoDate: string, taxMonth: string) => {
    const [y, m] = isoDate.split('-').map(Number);
    const [ty, tm] = taxMonth.split('-').map(Number);
    return (ty - y) * 12 + (tm - m);
};
export const vendorKey = (v: string) => v.trim().replace(/\s+/g, ' ');

export function suggest(c: ClientCtx, d: Doc): Suggestion[] {
    const cand: Record<string, Suggestion> = {};
    const has = (code: string) => c.accounts.some((a) => a.code === code);
    const add = (code: string, score: number, why: Say) => {
        if (!has(code)) return;
        if (!cand[code] || cand[code].score < score) cand[code] = { code, score, why };
    };
    const vr = c.vendorRules[vendorKey(d.vendor)];
    if (vr) {
        add(
            vr.code,
            Math.min(99, 86 + vr.n * 2),
            vr.src === 'edit'
                ? { th: 'ผู้ทำบัญชีกำหนดไว้สำหรับผู้ขายรายนี้', en: 'Set by the bookkeeper for this vendor.' }
                : {
                      th: `ผู้ขายรายนี้เคยบันทึกเป็น ${vr.code} มาแล้ว ${vr.n} ครั้ง`,
                      en: `This vendor was coded to ${vr.code} ${vr.n} ${vr.n === 1 ? 'time' : 'times'} before.`,
                  },
        );
    }
    const text = `${d.desc} ${d.vendor}`.toLowerCase();
    const asset = c.accounts.find((a) => a.code === c.assetCode);
    if (asset && asset.keywords && d.base >= c.capThreshold && new RegExp(asset.keywords).test(text)) {
        add(c.assetCode, 80, {
            th: `ราคาเกิน ${baht(c.capThreshold)} บาทตามนโยบายบันทึกสินทรัพย์ของลูกค้า`,
            en: `Price is over ${baht(c.capThreshold)} baht, the client's threshold for recording an asset.`,
        });
    }
    for (const a of c.accounts) {
        if (!a.keywords || a.code === c.assetCode) continue;
        const hits = a.keywords.split('|').filter((k) => k && text.includes(k.toLowerCase()));
        if (hits.length) {
            add(a.code, Math.min(93, 70 + hits.length * 10 + (hits[0].length > 4 ? 6 : 0)), {
                th: `พบคำว่า "${hits.join('", "')}" ในรายการ`,
                en: `Found "${hits.join('", "')}" in the line.`,
            });
        }
    }
    add(c.miscCode, 38, { th: 'ไม่พบรูปแบบที่ชัดเจน ควรให้คนตรวจ', en: 'No clear pattern. A person should review.' });
    const list = Object.values(cand).sort((a, b) => b.score - a.score);
    if (list.length > 1 && list[0].score - list[1].score < 6 && list[0].score < 95) {
        list[0] = {
            ...list[0],
            score: list[0].score - 8,
            why: { th: list[0].why.th + ' · มีรหัสอื่นใกล้เคียง', en: list[0].why.en + ' Another code is close.' },
        };
    }
    return list;
}

export function whtFormOf(d: Pick<Doc, 'type' | 'tin'>): WhtForm {
    return d.type === 'foreign' ? 'ภ.ง.ด.54' : d.tin && d.tin[0] === '0' ? 'ภ.ง.ด.53' : 'ภ.ง.ด.3';
}

/** Analyse one document in the context of its client and the client's other documents for the same tax month. */
export function analyze(c: ClientCtx, d: Doc, all: Doc[], taxMonth: string): Analysis {
    const F: Finding[] = [];
    const add = (sev: Severity, th: string, en: string) => F.push({ sev, text: { th, en } });
    const calc = vatOf(d.base);
    let dupOf: string | null = null;
    for (const o of all) {
        if (o.id === d.id) break;
        if (vendorKey(o.vendor) === vendorKey(d.vendor) && o.no === d.no && o.no !== '-' && o.no !== '') {
            dupOf = o.id;
            break;
        }
    }
    if (dupOf) add('block', 'ซ้ำกับเอกสารที่บันทึกแล้ว (ผู้ขายและเลขที่เดียวกัน) ไม่บันทึกซ้ำ', 'Duplicate of a document already recorded (same vendor and number). Not posted twice.');
    const sugg = suggest(c, d);
    const code = d.code || (sugg[0] ? sugg[0].code : null);
    const conf = d.code ? 100 : sugg[0] ? sugg[0].score : 0;

    if (d.type === 'full' || d.type === 'etax') {
        if (d.type === 'etax') add('ok', 'e-Tax Invoice ลายมือชื่อดิจิทัลถูกต้อง', 'e-Tax Invoice: the digital signature is valid.');
        if (!d.tin) add('block', 'ไม่มีเลขผู้เสียภาษีผู้ขาย', 'The seller tax ID is missing.');
        else if (!tinValid(d.tin)) add('block', 'เลขผู้เสียภาษีผู้ขายผิดหลักตรวจสอบ', 'The seller tax ID fails its check digit.');
        else add('ok', 'เลขผู้เสียภาษีผู้ขายถูกต้อง', 'The seller tax ID is valid.');
        if (d.buyerTin !== c.tin) add('block', 'ไม่มีหรือไม่ตรงเลขผู้เสียภาษีของผู้ซื้อ รายการไม่ครบตามมาตรา 86/4', 'The buyer tax ID is missing or does not match. The invoice is incomplete under section 86/4.');
        if (!d.vatReg) add('block', 'ผู้ขายไม่ได้จดทะเบียน VAT ใบกำกับภาษีใช้ไม่ได้', 'The seller is not VAT registered. This tax invoice cannot be used.');
        if (Math.abs(calc - d.vat) > 1) add('warn', `VAT ควรเป็น ${baht(calc)} แต่เอกสารระบุ ${baht(d.vat)}`, `VAT should be ${baht(calc)} but the document shows ${baht(d.vat)}.`);
        const mb = monthsBetween(d.date, taxMonth);
        if (mb > RULES.inputVatWindowMonths) {
            add('block', `เกินกำหนดใช้ภาษีซื้อ ${RULES.inputVatWindowMonths} เดือน (ห่าง ${mb} เดือน)`, `Past the ${RULES.inputVatWindowMonths}-month window to claim input VAT (${mb} months old).`);
        }
    } else if (d.type === 'abb') add('info', 'ใบกำกับภาษีอย่างย่อ ภาษีซื้อรวมเข้าค่าใช้จ่าย', 'Abbreviated tax invoice. The input VAT goes into the expense.');
    else if (d.type === 'cash') add('info', 'ไม่มี VAT · เป็นหลักฐานค่าใช้จ่าย', 'No VAT. Counts as proof of expense.');
    else if (d.type === 'foreign') add('info', `บริการจากต่างประเทศ ต้องยื่น ภ.พ.36 นำส่ง VAT ${baht(calc)} แยกต่างหาก`, `Service from abroad. File PP36 and remit VAT of ${baht(calc)} separately.`);

    const vatx = (code !== null && c.vatxCodes.includes(code)) || /รถยนต์นั่ง/.test(d.desc);
    if (vatx && d.vat > 0 && (d.type === 'full' || d.type === 'etax')) {
        add('info', 'ภาษีซื้อต้องห้าม (มาตรา 82/5) รวมเข้าค่าใช้จ่ายให้แล้ว', 'Disallowed input VAT (section 82/5). Already added to the expense.');
    }

    let whtForm: WhtForm = '';
    let whtRate = 0;
    if (d.wht > 0) {
        whtForm = whtFormOf(d);
        whtRate = d.type === 'foreign' ? RULES.foreignWhtPct : (RULES.whtRateHints.find(([re]) => re.test(d.desc)) || [null, RULES.defaultServiceWhtPct])[1];
        const expect = Math.round((d.base * whtRate) / 100);
        if (Math.abs(d.wht - expect) > 100) add('warn', `หัก ณ ที่จ่ายควรเป็น ${whtRate}% = ${baht(expect)}`, `Withholding tax should be ${whtRate}% = ${baht(expect)}.`);
        else add('ok', `หัก ณ ที่จ่าย ${whtRate}% ถูกต้อง · ${whtForm}`, `Withholding tax of ${whtRate}% is correct. Form ${FORM_EN[whtForm]}.`);
    } else if (d.base >= RULES.whtThreshold && /จ้าง|บริการ|ขนส่ง|เช่า|โฆษณา|ค่าแรง/.test(d.desc) && d.type !== 'foreign' && !/ไฟฟ้า|ประปา|อินเทอร์เน็ต/.test(d.desc)) {
        add('warn', 'รายการนี้อาจต้องหัก ณ ที่จ่าย ตรวจสอบกับลูกค้า', 'This item may need withholding tax. Check with the client.');
    }

    const blocks = F.filter((f) => f.sev === 'block').length;
    const warns = F.filter((f) => f.sev === 'warn').length;
    const claimVat = !blocks && !vatx && d.vat > 0 && (d.type === 'full' || d.type === 'etax');
    const expense = d.base + (claimVat || d.type === 'foreign' ? 0 : d.vat);
    const review = !dupOf && (blocks > 0 || warns > 0 || (!d.code && conf < 85));
    return { findings: F, dupOf, sugg, code, conf, blocks, warns, claimVat, vatx, expense, whtForm, whtRate, pp36: d.type === 'foreign' ? calc : 0, review };
}

/** Learn from a bookkeeper's confirmation: the same code again strengthens the rule; a new code replaces it. */
export function learn(rules: Record<string, VendorRule>, vendor: string, code: string, edited: boolean): Record<string, VendorRule> {
    const k = vendorKey(vendor);
    const r = rules[k];
    const next: VendorRule = { code, n: r && r.code === code ? r.n + 1 : 1, src: edited ? 'edit' : r && r.code === code ? r.src : 'hist' };
    return { ...rules, [k]: next };
}

/* ---------- Deadlines ---------- */
export type ObStatus = 'review' | 'ready';
export interface Obligation {
    form: string;
    due: string;
    moved: '' | 'Saturday' | 'Sunday';
    status: ObStatus;
    docs: number;
}
/** Due date for tax month M is in M+1 on `day`; weekends move to the next business day. */
export function dueDate(taxMonth: string, day: number): { iso: string; moved: Obligation['moved'] } {
    const [y, m] = taxMonth.split('-').map(Number);
    let d = new Date(Date.UTC(y, m, day)); // month index m = next month
    let moved: Obligation['moved'] = '';
    while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
        moved = moved || (d.getUTCDay() === 0 ? 'Sunday' : 'Saturday');
        d = new Date(d.getTime() + 864e5);
    }
    return { iso: d.toISOString().slice(0, 10), moved };
}
export function obligations(docs: Doc[], an: Record<string, Analysis>, taxMonth: string, channel: 'e' | 'p'): Obligation[] {
    const live = docs.filter((d) => !an[d.id]?.dupOf);
    const stOf = (ds: Doc[]): ObStatus => (ds.some((d) => d.status !== 'confirmed' && d.status !== 'requested') ? 'review' : 'ready');
    const out: Obligation[] = [];
    const mk = (form: string, paper: number, efile: number, ds: Doc[]) => {
        const due = dueDate(taxMonth, channel === 'e' ? efile : paper);
        out.push({ form, due: due.iso, moved: due.moved, status: stOf(ds), docs: ds.length });
    };
    mk('ภ.พ.30', 15, 23, live);
    for (const f of ['ภ.ง.ด.3', 'ภ.ง.ด.53', 'ภ.ง.ด.54'] as const) {
        const ds = live.filter((d) => d.wht > 0 && whtFormOf(d) === f);
        if (ds.length) mk(f, 7, 15, ds);
    }
    const fore = live.filter((d) => d.type === 'foreign');
    if (fore.length) mk('ภ.พ.36', 7, 15, fore);
    return out;
}

/* ---------- Exports ---------- */
export interface Ctrl {
    vat: string;
    ap: string;
    wht: string;
}
const beSlash = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${+y + 543}`;
};
const s2 = (s: number) => (s / 100).toFixed(2);
export function exportRows(format: 'peak' | 'jv', docs: Doc[], an: Record<string, Analysis>, accounts: Account[], ctrl: Ctrl): string[][] {
    const name = (code: string) => accounts.find((a) => a.code === code)?.name || '';
    const out: string[][] = [];
    if (format === 'peak') {
        out.push(['วันที่เอกสาร', 'เลขที่เอกสาร', 'ชื่อผู้ขาย', 'เลขประจำตัวผู้เสียภาษี', 'รหัสบัญชี', 'ชื่อบัญชี', 'รายละเอียด', 'มูลค่า', 'ภาษีซื้อ', 'ภาษีหัก ณ ที่จ่าย', 'ยอดชำระ']);
        for (const d of docs) {
            const a = an[d.id];
            const code = d.code || a.code || '';
            const v = a.claimVat ? d.vat : 0;
            out.push([beSlash(d.date), d.no, d.vendor, d.tin, code, name(code), d.desc, s2(a.expense), s2(v), s2(d.wht), s2(a.expense + v - d.wht)]);
        }
    } else {
        out.push(['วันที่', 'เลขที่', 'รหัสบัญชี', 'ชื่อบัญชี', 'เดบิต', 'เครดิต', 'คำอธิบาย']);
        for (const d of docs) {
            const a = an[d.id];
            const code = d.code || a.code || '';
            const v = a.claimVat ? d.vat : 0;
            const dt = beSlash(d.date);
            out.push([dt, d.no, code, name(code), s2(a.expense), '', `${d.vendor} ${d.desc}`]);
            if (v) out.push([dt, d.no, ctrl.vat, 'ภาษีซื้อ', s2(v), '', '']);
            if (d.wht) out.push([dt, d.no, ctrl.wht, 'ภาษีหัก ณ ที่จ่ายค้างจ่าย', '', s2(d.wht), a.whtForm]);
            out.push([dt, d.no, ctrl.ap, 'เจ้าหนี้', '', s2(a.expense + v - d.wht), d.vendor]);
        }
    }
    return out;
}
/** UTF-8 with a byte-order mark, so Excel opens the Thai text correctly. */
export const toCsv = (rows: string[][]) => '﻿' + rows.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
