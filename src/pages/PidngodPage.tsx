import { BookCheck, Github, Play } from 'lucide-react';
import PidngodDemo from '../components/pidngod/PidngodDemo';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import SEO from '../components/SEO';
import { RevealOnScroll } from '../lib/motion';

/** Ledger green: the product's own mark, used here only as a signal. */
const ACCENT = '#43c190';
const REPO = 'https://github.com/wutcharinth/bancheesolution';

const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.28em] text-text-mute';

const pressures = [
    {
        title: 'Documents arrive from everywhere.',
        body: 'A photo in LINE, a row in Excel, a PDF by email, a folder on a shared drive. One client, one month, four channels.',
    },
    {
        title: 'Every document has rules.',
        body: 'The seller tax ID has a check digit. A full tax invoice needs the buyer tax ID. Input VAT can be claimed for six months. Withholding tax has a rate and a form.',
    },
    {
        title: 'The deadline does not move.',
        body: 'VAT and withholding returns each have their own due date, every month, for every client. One late document holds the whole return.',
    },
];

const order = [
    { step: 'Vendor history', body: 'What this client booked for this vendor before. Each confirmation makes the rule stronger.' },
    { step: 'Asset rule', body: "Above the client's own threshold, equipment is recorded as an asset, not an expense." },
    { step: 'Keywords', body: "Words in the line, matched against the client's own chart of accounts." },
    { step: 'Fallback', body: 'No clear pattern. The document goes to a person, with a low confidence score.' },
];

const checks = [
    'Seller tax ID check digit',
    'Buyer tax ID on a full tax invoice (section 86/4)',
    'Seller VAT registration',
    'VAT at 7% of the base amount',
    'Six-month window for input VAT',
    'Duplicates: same vendor and document number',
    'Disallowed input VAT, folded into the expense',
    'PP36 for services bought from abroad',
    'Withholding tax rate and form (PND3, PND53, PND54)',
    'A hint when withholding tax may have been missed',
];

const build = [
    ['Runtime', 'Cloudflare Workers. A Hono API and a static React app in one deploy.'],
    ['Data', 'D1 for the books, R2 for the original documents. Every query is scoped to the signed-in firm.'],
    ['AI', 'Gemini reads uploaded photos and PDFs, on the server only. The browser never sees the key.'],
    ['Money', 'Stored as whole satang everywhere. No floating point in the ledger.'],
    ['Control', 'The model suggests and a person confirms. Every action goes to an append-only audit log.'],
];

const PidngodPage = () => {
    return (
        <SubPageShell statusLabel="POC · Live demo" accentColor={ACCENT}>
            <SEO
                title="Pidngod (POC): month-end close for Thai bookkeepers"
                description="A proof of concept. Pidngod checks each document against the Thai Revenue Code, catches duplicates and suggests the account code. Try the real check engine on 18 sample documents."
                url="https://wutcharin.com/pidngod"
            />
            <SubPageHero
                badgeLabel="Proof of concept"
                BadgeIcon={BookCheck}
                titleLead="Pidngod"
                titleAccent="Close the month."
                accentColor={ACCENT}
                description={
                    <>
                        The monthly workbench for Thai bookkeepers and small accounting firms. It checks each document against the Revenue Code, catches
                        duplicates, suggests the account code from each client&rsquo;s own books and exports a file the accounting software can import.{' '}
                        <span className="text-text-mute">
                            The name is Thai: <span lang="th">ปิดงวด</span>, &ldquo;close the period&rdquo;.
                        </span>
                    </>
                }
                primaryCta={{ label: 'Try the review desk', href: '#demo', icon: Play }}
                secondaryCta={{ label: 'Source on GitHub', href: REPO, icon: Github, external: true }}
            />

            {/* Why it exists: a statement and three plain pressures, not a card grid. */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <div className="grid gap-10 border-t border-hairline pt-10 lg:grid-cols-12 lg:gap-16">
                    <RevealOnScroll className="lg:col-span-5">
                        <p className={eyebrow}>The month-end problem</p>
                        <h2 className="mt-5 text-3xl leading-[1] tracking-[-0.02em] text-text-strong md:text-5xl">
                            A small firm closes the books for dozens of clients, <span className="font-serif font-normal italic" style={{ color: ACCENT }}>every month</span>.
                        </h2>
                    </RevealOnScroll>
                    <RevealOnScroll staggerChildren={0.1} className="lg:col-span-7">
                        <ol>
                            {pressures.map((p, i) => (
                                <li key={p.title} data-reveal-child className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-b border-hairline py-6 first:pt-0 last:border-b-0">
                                    <span className="pt-1 font-mono text-[11px] tabular-nums tracking-[0.2em] text-text-mute">0{i + 1}</span>
                                    <div>
                                        <h3 className="text-xl font-medium leading-snug tracking-[-0.01em] text-text-strong">{p.title}</h3>
                                        <p className="mt-2 max-w-xl text-base font-light leading-relaxed text-text-mute">{p.body}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </RevealOnScroll>
                </div>
            </section>

            {/* The demo */}
            <section id="demo" className="mx-auto mb-24 max-w-7xl scroll-mt-24 px-4 md:mb-32 md:px-10">
                <RevealOnScroll className="mx-auto mb-8 max-w-6xl md:mb-10">
                    <p className={eyebrow}>The review desk</p>
                    <div className="mt-5 grid gap-6 lg:grid-cols-12 lg:gap-16">
                        <h2 className="text-3xl leading-[1] tracking-[-0.02em] text-text-strong md:text-5xl lg:col-span-5">
                            Not a recording. <span className="font-serif font-normal italic" style={{ color: ACCENT }}>The real engine.</span>
                        </h2>
                        <div className="lg:col-span-7">
                            <p className="max-w-xl text-base font-light leading-relaxed text-text md:text-lg">
                                The product&rsquo;s own check engine runs in your browser on 18 sample documents for one client. Every decision you make
                                changes the filing deadlines and the export below it.
                            </p>
                            <ul className="mt-5 space-y-2 text-sm leading-relaxed text-text-mute">
                                <li>
                                    <span className="font-mono tabular-nums text-text-strong">06</span> is the same invoice as 01. It is skipped, not posted twice.
                                </li>
                                <li>
                                    <span className="font-mono tabular-nums text-text-strong">17</span> matches no pattern. Give it an account, and the desk remembers that vendor.
                                </li>
                                <li>
                                    <span className="font-mono tabular-nums text-text-strong">12</span> and <span className="font-mono tabular-nums text-text-strong">13</span> cannot
                                    be used to claim VAT. Send them back, or post them as plain expenses.
                                </li>
                            </ul>
                        </div>
                    </div>
                </RevealOnScroll>
                <PidngodDemo />
                <p className="mx-auto mt-4 max-w-6xl text-xs leading-relaxed text-text-mute">
                    Sample data only: the companies, tax IDs and amounts are invented. Reading photos and PDFs with AI needs the server, so the demo starts after
                    that step.
                </p>
            </section>

            {/* How it decides */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <div className="grid gap-12 border-t border-hairline pt-10 lg:grid-cols-12 lg:gap-16">
                    <RevealOnScroll staggerChildren={0.08} className="lg:col-span-7">
                        <p data-reveal-child className={eyebrow}>
                            How it picks an account
                        </p>
                        <h2 data-reveal-child className="mt-5 max-w-lg text-3xl leading-[1] tracking-[-0.02em] text-text-strong md:text-4xl">
                            Four sources, in order. Each answer comes with a reason and a confidence.
                        </h2>
                        <ol className="mt-8">
                            {order.map((o, i) => (
                                <li key={o.step} data-reveal-child className="grid grid-cols-[2.5rem_9rem_minmax(0,1fr)] items-baseline gap-x-4 border-t border-hairline py-4 max-sm:grid-cols-[2.5rem_minmax(0,1fr)]">
                                    <span className="font-mono text-[11px] tabular-nums tracking-[0.2em]" style={{ color: ACCENT }}>
                                        0{i + 1}
                                    </span>
                                    <span className="text-base font-medium text-text-strong">{o.step}</span>
                                    <span className="text-sm font-light leading-relaxed text-text-mute max-sm:col-start-2 max-sm:mt-1">{o.body}</span>
                                </li>
                            ))}
                        </ol>
                        <p data-reveal-child className="mt-6 max-w-lg text-sm font-light leading-relaxed text-text-mute">
                            A correction is a lesson. Change a code once and it becomes that vendor&rsquo;s rule for that client. Clean documents at 90%
                            confidence or more can be confirmed in one step.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll staggerChildren={0.04} className="lg:col-span-5">
                        <p data-reveal-child className={eyebrow}>
                            What it checks
                        </p>
                        <ul className="mt-5">
                            {checks.map((c) => (
                                <li key={c} data-reveal-child className="flex items-baseline gap-3 border-b border-hairline py-2.5 text-sm text-text last:border-b-0">
                                    <span className="h-1 w-1 shrink-0 translate-y-[-0.2em] rounded-full" style={{ backgroundColor: ACCENT }} aria-hidden="true" />
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </RevealOnScroll>
                </div>
            </section>

            {/* How it is built, and where it stands */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <div className="grid gap-12 border-t border-hairline pt-10 lg:grid-cols-12 lg:gap-16">
                    <RevealOnScroll className="lg:col-span-5">
                        <p className={eyebrow}>How it is built</p>
                        <h2 className="mt-5 text-3xl leading-[1] tracking-[-0.02em] text-text-strong md:text-4xl">
                            Small, cheap to run, and <span className="font-serif font-normal italic" style={{ color: ACCENT }}>strict about money</span>.
                        </h2>
                        <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-text-mute">
                            Status: proof of concept (POC). The core loop works end to end and the check engine is unit-tested. It is not a released
                            product: payroll forms and bank reconciliation are not built yet.
                        </p>
                    </RevealOnScroll>
                    <RevealOnScroll staggerChildren={0.06} className="lg:col-span-7">
                        <dl>
                            {build.map(([k, v]) => (
                                <div key={k} data-reveal-child className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 border-b border-hairline py-4 first:pt-0 last:border-b-0">
                                    <dt className="pt-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text-mute">{k}</dt>
                                    <dd className="text-base font-light leading-relaxed text-text">{v}</dd>
                                </div>
                            ))}
                        </dl>
                    </RevealOnScroll>
                </div>
            </section>

            <ProjectNavigation currentId="pidngod" />
        </SubPageShell>
    );
};

export default PidngodPage;
