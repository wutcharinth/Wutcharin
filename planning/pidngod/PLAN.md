# Pidngod (ปิดงวด): product plan

> **One line:** a cloud workbench for Thai freelance bookkeepers and small accounting firms. It turns each Client's monthly pile of LINE photos and PDFs into checked VAT and WHT filings, 50 ทวิ certificates and a closed month, for every Client, from one Deadline Board. SME owners get a LINE app that shows what's due, catches bad receipts on the spot, and lets them issue 50 ทวิ at payment time.

- Company / repo / cloud environment: `bancheesolution`.
- Domain language: [CONTEXT.md](CONTEXT.md).
- Decisions: [docs/adr/](docs/adr/).

**Format.** This is a grilling session. Each question has the **recommended answer** (taken as decided unless you overrule it), the **reason**, and **what would change it**. Decisions that are hard to reverse are recorded as ADRs.

---

## Decisions at a glance

| # | Decision | ADR |
|---|---|---|
| 1 | Sit above the books: a tax and close workbench, not a general ledger | [0001](docs/adr/0001-workbench-not-ledger.md) |
| 2 | The Firm is the tenant; Clients are portable; Postgres RLS | [0002](docs/adr/0002-firm-tenant-portable-client.md) |
| 3 | Rates, thresholds, deadlines and holidays are effective-dated data | [0003](docs/adr/0003-statutory-rules-as-data.md) |
| 4 | Prepare filings; never submit them or hold RD passwords | [0004](docs/adr/0004-prepare-dont-submit.md) |
| 5 | LINE OA + LIFF first for Owners | [0005](docs/adr/0005-line-first-client-channel.md) |
| 6 | AI extraction is always confirmed by a person and checked by deterministic validators | [0006](docs/adr/0006-ai-extraction-human-confirmed.md) |
| 7 | Thai-region data, 7-year immutable originals, append-only audit trail | [0007](docs/adr/0007-residency-retention.md) |
| 8 | TypeScript modular monolith, Postgres, PDFs rendered from HTML in Chromium | [0008](docs/adr/0008-stack.md) |
| 9 | Two-sided and led by the accountant: an Owner app for SMEs and a later marketplace for SMEs without an accountant | [0009](docs/adr/0009-two-sided-accountant-led.md) |
| 10 | Encrypt and mask national ID and bank numbers; keep AI calls in-region; no personal data in LINE pushes. See [security-privacy.md](docs/security-privacy.md) | [0010](docs/adr/0010-pii-handling.md) |
| 11 | Suggest account codes from each Client's own chart of accounts; the PEAK import file is the first export target (from discovery log #1) | [0011](docs/adr/0011-account-code-suggestions-peak-first.md) |

---

## The grilling log

### A. Customer and problem

**A1. Who pays?**
**Recommended:** Freelance ผู้ทำบัญชี and firms of 1–10 people keeping books for 15–100 SME Clients each. Owners use the product free while their Firm subscribes (ADR-0009).
**Why:** The accountant feels the pain N times a month and picks the tool for all N Clients, so one sale onboards many companies. The per-Bookkeeper client cap makes firm size bounded and predictable.
**Change if:** firms of 10–30 people show clearly higher willingness to pay with the same workflow.

**A2. What pain makes them switch?**
**Recommended:** The day 1–23 crunch. That means chasing documents, keying them, checking tax invoices, and preparing PND1/3/53, SSO and PP30 for every Client before the 7th, 15th and 23rd. Optimise one number: **Bookkeeper minutes per Client per Tax Month on VAT + WHT.**
**Why:** It is monthly, it has a hard deadline, late filing brings Surcharge and Penalty that Clients blame on the accountant, and it grows linearly with Clients. Year-end matters too, but it is seasonal and already served by existing tools.
**Change if:** the time study (Next 30 days, step 2) shows bank reconciliation or payroll dominating.

**A3. Should we build a ledger or sit above one?**
**Recommended:** Sit above it (ADR-0001).

**A4. What is the unit of work?**
**Recommended:** The **Obligation**: Client × form × Tax Month (× Branch for VAT), with the state machine defined in CONTEXT.md. Every screen is a view of Obligations.
**Why:** It matches how accountants think ("ยื่น ภ.พ.30 ของร้าน A แล้วหรือยัง", "Has shop A's PP30 been filed yet?") and makes due dates and progress computable.

### B. MVP scope

**B1. Which forms come first?**
**Recommended:**
- **v1:** PP30, PND3, PND53, the Sales and Purchase Tax Reports, and 50 ทวิ.
- **v1.5:** PND1 and SSO, from a payroll Excel import.
- **Later:** PP36, PND54, PND1Kor, PND51/50 support packs, and a DBD e-Filing pack.
**Why:** VAT, PND3 and PND53 hit almost every VAT-registered Client every month, which is the biggest volume of hours.

**B2. Do we file with the RD?**
**Recommended:** No. Prepare everything for filing, and let the Bookkeeper submit (ADR-0004).

**B3. Do we run payroll?**
**Recommended:** No engine. Import a payroll summary and produce the PND1 and SSO worksheets. Payroll engines are a different product with different liability.

**B4. How much of the month-end close is in v1?**
**Recommended:** A Close Checklist per Client per month, with the tie-outs we can compute:
- Documents complete
- tax subledger vs the trial balance import (Output VAT, Input VAT and WHT payable accounts)
- bank statement received
- journal exported
Full bank reconciliation comes in phase 3.

**B5. Do we issue sales invoices for Clients?**
**Recommended:** No. Clients issue invoices in their POS, FlowAccount or PEAK. We ingest sales data from export files and e-Tax XML. The one exception is **50 ทวิ**, which Owners can issue from LINE (ADR-0009), because it is the compliance gap we're best placed to close.

### C. Documents and AI

**C1. How do Documents arrive?**
**Recommended:** LINE chat to the Firm's OA, LIFF upload, web drag-and-drop, a per-Client email-in address, and e-Tax Invoice XML (ADR-0005).

**C2. How do we extract data?**
**Recommended:** A vision LLM fills a strict schema, deterministic validators check it, and a person confirms it (ADR-0006).

**C3. What do we check on each Document?**
**Recommended:** This validation catalogue. A Block Finding stops the Obligation; a Warn Finding needs acknowledgement.

| Code | Check | Severity |
|---|---|---|
| V1 | Full Tax Invoice vs Abbreviated Tax Invoice. Abbreviated → Input VAT not claimable | Block (for claim) |
| V2 | The s.86/4 fields are present: "ใบกำกับภาษี", seller name/address/TIN/Branch, buyer name/address (+ TIN/Branch for a VAT-registered buyer), serial no., description, VAT shown separately, date | Block |
| V3 | The buyer is this Client: name, TIN and Branch match the Client record | Block |
| V4 | Seller TIN check digit is valid; seller is VAT-registered (RD lookup) | Block / Warn |
| V5 | VAT ≈ rate from the Tax Rule Table at the invoice date × base, within rounding | Warn |
| V6 | Invoice month is within the 6-month Input VAT claim window for this Tax Month | Block |
| V7 | Duplicate check: same seller TIN + invoice no. already claimed | Block |
| V8 | Disallowed categories: entertainment, passenger cars, personal expenses | Warn → reclassify |
| V9 | Date sanity: BE vs CE confusion (2569 vs 2026); future dates | Warn |
| W1 | Payee type from the TIN (starts with `0` → juristic → PND53, otherwise PND3) | Info |
| W2 | Payment ≥ WHT threshold for its income type | Warn |
| W3 | WHT rate matches the income type in the Tax Rule Table | Block |
| W4 | WHT was withheld but no 50 ทวิ was issued | Warn |
| R1 | 50 ทวิ received by the Client: record it as a WHT Credit | Info |

**C4. How is the WHT rate decided?**
**Recommended:** Suggest it from the expense category, the Payee type and the Tax Rule Table. The Bookkeeper confirms it. Typical rates to load (verify): services and professional fees 3%, rent 5%, advertising 2%, transport 1%, prizes 5%, payments abroad 15% via PND54.

**C5. What happens with a bad photo?**
**Recommended:** One tap sends a Request for Documents to the Owner in LINE ("รูปไม่ชัด ส่งใหม่ได้ไหมคะ", "The photo isn't clear, could you send it again?"). The Obligation shows *Waiting for documents* until it is fulfilled. Never let the Bookkeeper guess an amount.

**C6. Which model?**
**Recommended:** Pick by bake-off, not brand. Run Claude Sonnet 5.5 (vision extraction) and Claude Haiku 5.5 (classification) against Gemini (which your portfolio already uses) on a golden set of 300+ real anonymised Thai documents. Score field-level accuracy *after* the validators run, plus cost per Document.

### D. Domain model and data

**D1. How do we isolate tenants?**
**Recommended:** Firm-level tenancy with RLS; Clients are portable (ADR-0002).

**D2. How do we store money?**
**Recommended:** Integer satang; never floats. Store the VAT **as printed** on the Document and flag any mismatch with the computed VAT (V5). Never silently "correct" a vendor's invoice.

**D3. How do we handle dates?**
**Recommended:** Store ISO CE dates; show BE in the UI and on outputs. Store a Tax Month as `YYYY-MM`.

**D4. Do we model Branches in v1?**
**Recommended:** Yes, from day 1. Branch is part of VAT identity and of V2/V3. Retrofitting it later is painful.

**D5. Where do rates and deadlines live?**
**Recommended:** In the Tax Rule Table and Holiday Calendar (ADR-0003).

**D6. What happens after a Filing?**
**Recommended:** The Obligation locks at *Filed*. Any change opens an **Amended Filing** draft. Phase 2 adds Surcharge and Penalty estimates.

### E. The SME / Owner side (ADR-0009)

**E1. What do Owners get that's worth opening?**
**Recommended:** Five things:
- instant receipt feedback with the VAT it saved or lost
- a running preview of this month's taxes
- 50 ทวิ at payment time
- a "what's missing / approve / pay" flow
- a monthly business pulse plus WHT Credits to reclaim
**Why:** Owners who see "฿420 VAT saved this month" send documents early. That's how the Firm's crunch shrinks.

**E2. Who pays the tax, and how do we know it was paid?**
**Recommended:** The Client pays from its own bank through RD e-Payment. The Owner uploads the slip or receipt, slip verification (reuse your portfolio's slip-verify work) checks the amount and reference, and the Obligation moves to *Paid*.

**E3. What about SMEs with no accountant?**
**Recommended:** A phase 3 "Owner Pro" paid tier with capture, validation, 50 ทวิ and a calendar, plus "Find a Pidngod accountant". It feeds Firms leads instead of competing with them. Still no general ledger.
**Change if:** Owner Pro demand outgrows Firm demand by more than 3×. Then reconsider ADR-0001 for micro businesses only.

**E4. Do we need a native mobile app?**
**Recommended:** No. Owners use LINE LIFF. Bookkeepers use a responsive web app; they work at desks with two monitors.

### F. Integrations

**F1. Which accounting software first?**
**Recommended:** **The PEAK import file first.** The first accountant feedback ([discovery log #1](docs/discovery-log.md)) describes a batch-import-into-PEAK workflow and asks for AI to check, dedupe, classify and suggest account codes before export (ADR-0011). Match the template column for column against a real file from her. Then Express (file import; verify its format), then FlowAccount, plus a generic Excel journal from day 1.

**F2. How do we get bank data?**
**Recommended:** Statement upload (PDF/CSV/Excel) parsers for KBank, SCB, Bangkok Bank, Krungthai, Krungsri and ttb in phases 2–3. No bank APIs in v1.

**F3. Which government lookups?**
**Recommended:**
- TIN check digit, computed locally
- RD VAT registrant lookup for Counterparties (verify the current service and its terms)
- DBD juristic person data to prefill Client onboarding: name, address, registered capital, directors

### G. Trust, law and security

**G1. What is our PDPA role?**
**Recommended:** The Client is the controller, the Firm is the processor, and we are a sub-processor. Publish a DPA template and a sub-processor list. We never train on Client data.

**G2. Where is data stored, and for how long?**
**Recommended:** In-region, 7-year Object Lock (ADR-0007).

**G3. Who can see what?**
**Recommended:**
- Roles: Firm Owner, Bookkeeper, Reviewer, Owner.
- Clients are assigned per Bookkeeper.
- Optional maker-checker: the preparer ≠ the approver, for Firms with 2+ people.
- MFA for Firm users; LINE Login for Owners.

**G4. How does the audit trail work?**
**Recommended:** Every number on a prepared form clicks through to the Confirmed lines and the original Documents. Every state change and every edit is an append-only event. **This is the trust feature. Demo it first.**

### H. Technology

**H1. Which stack?**
**Recommended:** A TypeScript modular monolith on Postgres with pg-boss jobs and S3 (ADR-0008).

**H2. How do we make Thai PDFs?**
**Recommended:** HTML templates rendered in headless Chromium with the Sarabun / TH Sarabun New fonts. Spike this in week 2. pdf-lib-style libraries mis-position Thai vowels and tone marks.

**H3. Which environments do we need?**
**Recommended:** `local` (docker compose: Postgres + MinIO), `staging` and `prod`, with separate LINE channels and buckets per environment. The cloud dev environment is `bancheesolution`. Add hosts to it (api.line.me, the LLM API, the RD lookup) as the code starts needing them.

### I. Business

**I1. How do we price?**
**Recommended:** Per **Active Client** (a Client with at least one Obligation in the month) per month. Hypothesis: free for up to 5 Clients, then ฿199–299 per Client per month. The Owner app is free; Owner Pro (phase 3) is ฿299–499 per month. Test the prices with design partners.
**Why:** It mirrors how Firms bill their own Clients (a monthly retainer per Client), so they can pass the cost through.

**I2. How do we reach accountants?**
**Recommended:**
1. Thai accountant Facebook groups and LINE OpenChats, with useful content such as "10 reasons Input VAT gets disallowed".
2. Free webinars on VAT/WHT pitfalls; check whether they can earn TFAC CPD hours.
3. Referrals from design partners.
Firms then bring their Clients (Owners) for free, and Owner Pro later brings Firms leads.

**I3. Who are the competitors, and how do we position?**
**Recommended:**
- **Competitors:**
  - PEAK and FlowAccount accountant programmes: strong, but each covers only its own platform.
  - The Express desktop app: the incumbent.
  - **Paypers**: LINE group per client plus AI receipt reading, with a dedicated accounting-firm offer. The closest competitor on intake.
  - **A3 (Osmozai)**: an AI agent claiming PND53 and PP30 generation. The closest on AI + forms.
  - Excel plus LINE: the real competitor.
  - Full comparison: [docs/competitive-landscape.md](docs/competitive-landscape.md).
- **Positioning:** *"The only place where every client, whatever software they use, goes from documents to filed and paid VAT and WHT, with every number checked against the Revenue Code and traceable to its source."*
  - LINE + AI capture is now table stakes, so don't lead with it.
  - Lead with the validation catalogue, the cross-software deadline board, the filing loop with Owner approval and payment, and trust.

**I4. What name do we use?**
**Recommended:** Brand the product **Pidngod / ปิดงวด**. Use `bancheesolution` as the company, repo and environment name. Check DBD names, trademark and domains before printing anything.

---

## The monthly cycle the product runs (Tax Month M)

| When | What happens | Who |
|---|---|---|
| Last days of M | LINE nudge: "send M's documents", with a checklist per Client | Product → Owner |
| M+1, days 1–5 | Intake, Extraction, Review Queue; Requests for Documents | Bookkeeper, Owner |
| By ~day 5 | PND1/3/53 + SSO ready → Owner approves in LIFF | Bookkeeper → Owner |
| 7th (paper) / 15th (e-Filing) | PND1/3/53 filed; 50 ทวิ sent to Payees | Bookkeeper |
| 15th | SSO filed and paid | Bookkeeper / Owner |
| By ~day 10 | PP30 ready with the Sales and Purchase Tax Reports → Owner approves | Bookkeeper → Owner |
| 15th (paper) / 23rd (e-Filing) | PP30 filed; slip verified → *Paid* | Bookkeeper / Owner |
| Days 15–25 | Close Checklist, trial balance tie-out, journal export, Owner's monthly pulse | Bookkeeper |

Due Dates are always computed (ADR-0003). The dates above are the current rules; see "Facts to verify".

---

## Roadmap

**Phase 0: Discovery (Nov–Dec 2026, 6 weeks).** See "Next 30 days".
*Exit:* ≥5 Firms commit to a shadow pilot, and the time study shows ≥20 min per Client per month on VAT + WHT.

**Phase 1: MVP (Dec 2026 – Mar 2027).**
- Firm and Client setup with DBD prefill, Branches, and the Tax Rule Table and Holiday Calendar
- LINE OA intake plus web upload
- Extraction, Review Queue and validators V1–V9, W1–W4
- Sales and Purchase Tax Reports, PP30 worksheet and PDF
- PND3/53 worksheets, 50 ทวิ PDFs and RD upload files
- Deadline Board, Owner LIFF (missing / approve / slip), Excel journal export, audit trail

*Pilot:* shadow-run alongside each partner's current process on 2–3 Clients for the Mar 2027 Tax Month (filed in April). Partners are busy Jan–May with Year-end, so keep the ask small.

**Phase 2: Pilot → paid (Apr–Jul 2027).**
- PND1 + SSO from a payroll import
- Owner-issued 50 ทวิ, the tax-this-month preview and the pulse
- Amended Filings with Surcharge estimates
- An integration with whichever software partners use most
- Bank statement parsing
- Billing
*Exit:* 10 paying Firms, 300 Active Clients, −50% minutes per Client.

**Phase 3: Expand (Aug–Dec 2027).**
- Bank reconciliation and a full Close
- PP36 / PND54, PND1Kor, and PND50/51 and DBD e-Filing packs
- e-Tax XML ingestion at scale
- Team features: capacity per Bookkeeper, reviewer queues
- Owner Pro + "Find an accountant"

---

## Metrics

- **North star:** Obligations filed on time through Pidngod per month.
- **Efficiency:** median Bookkeeper minutes per Client per Tax Month (VAT + WHT), against the Phase 0 baseline.
- **Extraction:** % of Documents Confirmed with no edits (target ≥80% by pilot month 3); amount and TIN accuracy after validators ≥99.5%.
- **Value caught:** ฿ of Input VAT protected by Findings before Filing (great marketing copy too).
- **Owner engagement:** % of Documents arriving before day 3 of M+1; % of Owners approving through LIFF.
- **Business:** Active Clients per Firm, % of a Firm's Clients on the board within 60 days, logo retention.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| PEAK or FlowAccount build cross-platform accountant boards | Stay software-agnostic, move faster on LINE + Owner value, and lock in partners early |
| Paypers or A3 move down the workflow into filings | Win on compliance depth (validators, Obligations, 50 ทวิ, Owner approval and payment, tie-outs) and trust. Test them hands-on in Phase 0; consider integrating with Paypers as an input source |
| Extraction is poor on thermal or handwritten receipts | Golden set, validators, human confirmation (ADR-0006), one-tap re-request |
| Rules change (VAT rate, e-Filing extensions, e-Tax mandates) | ADR-0003, with a rules owner monitoring the RD, SSO and Royal Gazette |
| A data leak would end a Firm's business | ADR-0007, RLS, MFA, a pen test before going paid, no RD credentials (ADR-0004) |
| Solo bookkeepers are price-sensitive | Per-Client pricing they can pass through; show hours and ฿ VAT saved |
| LINE platform terms or costs change | Reply-token messages + LIFF; email and web fallbacks |
| Owner-issued 50 ทวิ errors | Bookkeeper permissions, rate suggestions from rules, void + reissue with an audit trail |
| Founder time | If you're building alongside a full-time role, check your employment contract's outside-work and IP clauses before writing code |

## Facts to verify before building

These values change. Confirm each one with the RD (call centre 1161 or rd.go.th), the SSO and DBD, and record the source in the Tax Rule Table.

| Item | Value assumed in this plan |
|---|---|
| VAT rate | 7% (statutory 10%, reduced by royal decree in periodic extensions). Confirm the current end date |
| PP30 due date | 15th of M+1; e-Filing extension to the 23rd (time-limited, renewed periodically) |
| PND1/3/53/54 and PP36 due date | 7th of M+1; 15th via e-Filing |
| SSO | 5% employee + 5% employer, due the 15th; wage ceiling 17,500 THB from 2026, rising in steps |
| Input VAT claim window | 6 months after the month on the Tax Invoice |
| WHT threshold | ≥1,000 THB per payment for most service payments |
| WHT rates | services 3%, rent 5%, advertising 2%, transport 1%, abroad 15%; e-WHT reduced rates and their expiry |
| Bookkeeper capacity | Max 100 Clients per Bookkeeper per year (DBD) |
| Filing formats | Current RD e-Filing / RD Prep attachment file spec for PND1/3/53 |
| Lookups | Current RD VAT registrant lookup service and its terms of use |
| Integrations | Express import format; PEAK and FlowAccount API partner terms |
| LINE | LINE OA pricing and message quotas in Thailand |
| Region | AWS Bangkok region support for RDS Postgres, S3 Object Lock and KMS |

---

## Your next 30 days

1. **Week 1. Recruit.** Post in 3 Thai accountant Facebook groups and LINE OpenChats. Book 15 interviews and aim for 5–10 design partners. Ask:
   - How many Clients do you have, and which software does each use?
   - Walk me through last month from day 1 to day 23.
   - Where did the time go?
   - What got disallowed or filed late in the last year, and why?
   - What would you pay per Client to cut that time in half?
2. **Weeks 1–4. Time study.** Three partners log minutes per Client for the **November 2026 Tax Month cycle (1–23 Dec)**. That number is your baseline and your sales pitch.
3. **Weeks 1–2. Golden set.** Collect 300+ anonymised Documents with consent: tax invoices, abbreviated invoices, cash bills, 50 ทวิ, bank statements, payroll sheets.
4. **Week 2. Extraction spike.** Bake off the models on 100 Documents with validators V1–W4, and measure accuracy and cost.
5. **Week 2. Thai PDF spike.** Render a 50 ทวิ and a PP30 summary from HTML in Chromium with Sarabun, and compare them to the RD forms.
6. **Week 3. Verify the facts.** Work through the table above, and pay a Thai CPA or tax advisor for one hour to review CONTEXT.md and the validation catalogue.
7. **Weeks 3–4. Prototype.** Build a clickable Deadline Board and Owner LIFF flow (missing → approve → slip) and test it with partners.
8. **Week 4. Go / no-go** against the Phase 0 exit criteria.
9. **In parallel. Legal and naming.** PDPA privacy notice and DPA template; employment-contract check; DBD name and trademark search for ปิดงวด / Pidngod; register the domains.
