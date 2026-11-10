# Pidngod: competitive landscape (Nov 2026)

Who else serves Thai accountants and SMEs, what they do well, and where Pidngod should and should not compete.

> **How this was researched:** web search on 10 Nov 2026. Vendor pages could not be fetched directly from this environment, so details come from search-result summaries of vendor sites, help centres and press. Most claims are the vendors' own. Treat prices as indicative, and check each one (a trial account and a sales call) before quoting it to anyone. Sources are at the end.

---

## 1. The market in one picture

| Category | Players | Built for | Threat to Pidngod |
|---|---|---|---|
| **SME cloud accounting** (the ledger) | FlowAccount, PEAK | SME owners; accountants join through partner programmes | **Medium.** They own the books and the distribution, but each sees only its own customers |
| **Desktop accounting** | Express (and Formula, WINSpeed) | Accounting firms and in-house teams | Low as a competitor. **High as something we must export into** |
| **LINE + AI receipt capture** | **Paypers** (has a dedicated accounting-firm offer), FlowAccount AI-OCR, PEAK LINE Connect | Firms and SMEs | **High. This is now table stakes** |
| **AI bookkeeping and tax-form agents** | **A3 (Osmozai)** | Thai businesses and accountants | **High and rising.** Claims PND53 and PP30 generation |
| **e-Tax invoice issuing** | Leceipt, E-Tax Center and others | SMEs issuing e-Tax invoices | Low. Adjacent, a possible source of XML |
| **Thai OCR APIs** | TurboLens and others | Developers | Not a competitor. A possible supplier, or a benchmark for our extraction |
| **ERP localisations** | Odoo and ERPNext Thai packs (PND3/53 export for RD Prep) | Mid-size companies | Low. Shows that RD Prep CSV export is a known pattern |
| **Global practice management** | Karbon, TaxDome; Dext (capture) | Firms in the US, UK and Australia | Low in Thailand: no LINE, no Thai tax. But they prove the category, at **US$59–89 per user per month** for Karbon |
| **The status quo** | Excel + LINE chats + desktop software | Everyone | **The real competitor** |

## 2. Head-to-head feature matrix

✓ = offered (vendor claim) · ◐ = partial or unclear · — = not found · ? = could not verify

| Capability | Excel + LINE | FlowAccount | PEAK | Express | Paypers | A3 (Osmozai) | **Pidngod (plan)** |
|---|---|---|---|---|---|---|---|
| Built mainly for | — | SME owner | SME owner | Firm / company | SME + firm | Business / accountant | **Firm, plus a free Owner app** |
| Client documents via LINE | ◐ manual chat | ? | ✓ LINE Connect | — | ✓ one LINE group per client | ? | ✓ Firm's own OA + LIFF |
| AI reads receipts | — | ✓ AI-OCR (quota by plan) | ? | — | ✓ checks counterparty against a Thai company database | ✓ Thai/English, splits batch PDFs | ✓ with confidence scores |
| Rule checks on tax-invoice validity (s.86/4, buyer TIN/Branch, 6-month window, disallowed input VAT, duplicates) | — | ? | ? | — | ◐ counterparty check | ? | **✓ 14-rule catalogue, Block/Warn** |
| One deadline board for **all** clients, whatever software each uses | — | ◐ Partner Center, FlowAccount clients only | ◐ PEAK clients only | — | ◐ per-client folders | ? | **✓ Obligations + Deadline Board** |
| Prepares PP30 | — | ✓ in its own books | ✓ in its own books | ✓ | — | ✓ claimed | ✓ from Confirmed data, any software |
| Prepares PND3 / PND53 + 50 ทวิ | — | ✓ | ✓ | ✓ | — | ✓ PND53 claimed | ✓ with Thai baht-text and numbering |
| Owner approves amounts + payment slip verified | — | — | — | — | — | — | **✓** |
| Google Sheets / Drive / email sync | ◐ | ◐ API, MCP | ◐ API, Excel import (credit quota from Aug 2569) | — | ✓ Drive/Sheets; email scan | ◐ posts to accounting system | ✓ Sheets, Excel, email, Drive, bank, POS |
| Payroll → PND1 + SSO | ◐ | ✓ higher tiers | ✓ | ✓ | — | ? | ✓ (v1.5, from an import) |
| Firm team: assignment, reviewer sign-off, fee billing | — | ◐ | ? | ◐ | ◐ onboarding for 30+ companies | ? | ✓ |
| Audit trail, PDPA masking, no RD passwords | — | ? | ? | ? | ? | ? | ✓ (ADR-0004, 0007, 0010) |
| Indicative price | free | Free; ฿165 / ฿249 / ฿457 per business per month | Subscription; credits for API/Excel beyond quota | Licence, price not published | Plans by receipt quota (e.g. 100 or 1,000 per month); trial 7–14 days | Not published | ฿249 per Active Client per month (hypothesis) |

## 3. What each one means for us

**FlowAccount.** The biggest distribution engine. It claims 130,000–160,000+ businesses, 5,800+ partner firms, and a free partner programme with four tiers. It already has AI-OCR, payroll, an API and an MCP "AI connector".
- *Implication:* never ask a firm to move clients off FlowAccount. Read from it, export to it, and position Pidngod as the layer that covers **all** of a firm's clients, including the ones on Express and Excel.

**PEAK.** Strong VAT/WHT tooling and LINE Connect. It ran a 2026 workshop **with Paypers**, so it partners with AI capture tools instead of building everything itself. From 1 Aug 2569, API and Excel imports run on a credit quota.
- *Implication:* there's a partnership path. Also watch import costs if we push data into PEAK at volume.

**Express.** The desktop incumbent in many small firms. It has no cloud and no LINE.
- *Implication:* a reliable Express import file is a **must-have** for the first design partners. Verify the format in Phase 0.

**Paypers. The closest competitor on intake.** Its firm offer is "ดูแลลูกค้า 100 บริษัท เหมือนดูแลบริษัทเดียว" ("look after 100 companies like one"), with one LINE group per client, AI reading and Google Drive/Sheets output.
- *Implication:* "LINE + AI reads receipts" is **no longer a differentiator**. Lead with compliance correctness and the filing loop, which Paypers doesn't appear to cover: validation rules, Obligations, PP30, PND, 50 ทวิ, owner approval and payment, close tie-outs.
- Also consider whether Paypers is a **channel or integration partner** (it fills folders; we file) or a competitor that will move down the workflow.

**A3 (Osmozai). The closest competitor on "AI + Thai tax forms".** It claims invoice reading, VAT/WHT calculation, PND53 and PP30 generation, and posting to accounting systems.
- *Implication:* the AI-forms story is contested. Differentiate on:
  - the multi-client firm workflow
  - deterministic validators plus a person confirming every figure (trust)
  - the Owner app
  - audit and PDPA

  Do a hands-on test in Phase 0.

**Global practice management (Karbon, TaxDome, Dext).** Proof that firms pay for workflow software, and for a lot. But nothing is localised for Thai tax or LINE.
- *Implication:* borrow their patterns (client tasks, reviewer queues, client portals) and price for Thailand.

## 4. Positioning (updated)

**Don't lead with:** "We read receipts from LINE with AI." Paypers, FlowAccount and PEAK can all say something similar.

**Lead with:** *"The only place where every client, whatever software they use, goes from documents to filed and paid VAT and WHT, with every number checked against the Revenue Code and traceable to its source."*

The four things to prove in every demo:
1. **The validation catalogue** catches Input VAT problems *before* filing (฿ protected).
2. **One deadline board** across FlowAccount, PEAK, Express and Excel clients.
3. **The filing loop:** PP30/PND/50 ทวิ → Owner approval in LINE → slip verified → *Paid*.
4. **Trust:** a person confirms everything, there's an audit trail, ID numbers are masked, and we never hold RD passwords.

## 5. Changes to the plan

- PLAN.md I3 is updated: competitors now include Paypers and A3, and the positioning moves from intake to compliance and the filing loop.
- **Phase 0 additions:**
  1. Run a hands-on trial of Paypers, A3, FlowAccount Partner Center and PEAK. Use the same 50 golden-set documents and record what each catches.
  2. Ask design partners which of these they already pay for.
  3. Get the Express import format.
- **Partnership hypotheses to test:**
  - PEAK and FlowAccount partner programmes (listing as a tool)
  - a Paypers integration (their folders become our input)
  - an OCR vendor such as TurboLens as a fallback extractor

## 6. Verify before quoting externally

- [ ] FlowAccount current plan prices and Partner Center features (trial account).
- [ ] PEAK prices, credit rates from 1 Aug 2569, and firm-side features.
- [ ] Paypers firm pricing and whether it prepares any tax forms.
- [ ] A3 pricing and stage, and how its PND53/PP30 output is validated.
- [ ] Express licence price and import formats.
- [ ] AccRevo's current status (Thai platform since 2016; nothing current was found).

---

## Sources

- FlowAccount: [pricing](https://flowaccount.com/th/pricing/Basic) · [features for accountants](https://flowaccount.com/th/functions/accounting) · [become a partner](https://flowaccount.com/en/accountingfirm/become-our-partner) · [Partner Center guide](https://flowaccount.com/en/help-center/category/partner-center/partner-center-user-guide) · [Partner Connect Chiang Mai 2026](https://flowaccount.com/blog/flowaccount-partner-connect-chiangmai-2026/) · [about](https://flowaccount.com/en/about-us) · [product update 2025](https://flowaccount.com/blog/flowaccount-product-update-2025/)
- PEAK: [partner firm directory](https://intercom.help/peak/en/articles/6344404-ค-นหาสำนักงานบัญชี-partner-peak) · [API/Excel quota from 1 Aug 2569](https://intercom.help/peak/en/articles/15883477-แพ-กเกจ-pro-plus-และ-premium-สำหรับการใช-งาน-api-และการนำเข-าไฟล-excel-เริ-ม-1-สิงหาคม-2569) · [credit packages](https://intercom.help/peak/en/articles/15691306-อัตราค-าบริการแพ-กเกจเครดิตเสริม-credit-package-ns104) · [package FAQ](https://intercom.help/peak/en/articles/8696581-คำถามที-พบบ-อย-faq-แพ-กเกจและราคา) · [PEAK x Paypers workshop](https://www.peakaccount.com/blog/news/pr/peak-bizsphere2026-workshop-peak-x-paypers-ai) · [feature page](https://app-peak-landing-page-sit.azurewebsites.net/feature-accounting-program)
- Paypers: [for accounting firms](https://paypers.ai/solutions/accounting-firm) · [home](https://paypers.ai/) · [features guide](https://paypers.ai/guide/features) · [LINE OA](https://page.line.me/314fpvkl) · [PEESAMAC startup profile](https://www.peesamac.com/news/startup-ai-%E0%B9%84%E0%B8%97%E0%B8%A2-%E0%B8%95%E0%B8%AD%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88-15-paypers-bc9dea) · [Lemon8 review](https://www.lemon8-app.com/@anunyapalearn/7616261716218380807?region=th)
- A3 (Osmozai): [a3.osmozai.io](https://a3.osmozai.io/)
- Others: [Leceipt](https://www.leceipt.com/en) · [TurboLens Thai invoice OCR](https://www.turbolens.io/capabilities/thai-invoice-ocr-processing) · [AccRevo (NIA listing)](https://ecosystemstartupthailand.nia.or.th/startup/AccRevo-|-Digital-Accounting-Platform-for-SMEs) · [Odoo Thailand localisation (RD Prep CSV export)](https://www.odoo.com/documentation/20.0/applications/finance/fiscal_localizations/thailand.html) · [Simplico: firm software built for clients, not firms](https://www.simplico.net/2026/04/28/the-accounting-software-your-firm-uses-is-built-for-your-clients-not-for-you-th/) · [NSSOL: Thai accounting software overview](https://global.nssol.nipponsteel.com/th/column/fundamentals-of-thai-accounting-and-tax-for-system-managers-1.html)
- Global: [Karbon vs TaxDome](https://karbonhq.com/why-karbon/compare/karbon-vs-taxdome) · [Karbon pricing analysis](https://financial-cents.com/resources/articles/karbon-pricing/) · [Dext pricing (Capterra)](https://www.capterra.com/p/160189/Dext/pricing/)
