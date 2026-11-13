# Pidngod (ปิดงวด): domain context

Working title. The shared language for the product. Use these words in UI copy, code, tickets and conversations with accountants, in the exact sense defined here. When a word on the **Avoid** list shows up in a spec, replace it.

Display language is Thai first, English second. Store dates as Gregorian ISO dates. Display years in the Buddhist Era (พ.ศ. = ค.ศ. + 543, so 2026 = 2569).

---

## People and organisations

**Firm** (สำนักงานบัญชี)
The accounting practice that subscribes to the product. It can be one person. It is the tenant: everything belongs to a Firm.

**Bookkeeper** (ผู้ทำบัญชี)
The registered person responsible for a Client's books. One Bookkeeper can take on only a limited number of Clients per year (DBD rule, currently understood as 100; verify). A Firm has one or more Bookkeepers.
_Avoid:_ "user" when you mean this role.

**Client** (ลูกค้าของสำนักงาน / กิจการ)
A business whose books a Firm keeps: a company, partnership or sole proprietor. In this product, Client always means the SME the Firm serves.
_Avoid:_ "customer". That is ambiguous; see Counterparty.

**Owner** (เจ้าของกิจการ)
A person at the Client who sends Documents, answers questions and approves tax amounts, usually through LINE.

**Counterparty** (คู่ค้า)
A vendor or customer of the Client that appears on a Document. Identified by TIN and Branch. Its role (vendor or customer) is set per Document.
_Avoid:_ "customer" or "supplier" as entity names.

**Payee** (ผู้ถูกหักภาษี ณ ที่จ่าย)
A Counterparty that receives a payment from the Client from which the Client withheld tax.

**CPA** (ผู้สอบบัญชีรับอนุญาต) / **Tax Auditor, TA** (ผู้สอบบัญชีภาษีอากร)
External auditors who sign annual financial statements. A TA may audit only small registered partnerships. They are not product users in v1.

## Identifiers

**TIN** (เลขประจำตัวผู้เสียภาษีอากร)
13 digits with a mod-11 check digit. A juristic person's TIN is its DBD registration number, which starts with `0`. An individual's TIN is their national ID number.

**Branch** (สาขา)
A 5-digit branch number. `00000` is the head office (สำนักงานใหญ่). A Branch is part of a VAT identity: Tax Invoices must show it, and VAT is filed per Branch unless the Client is approved for combined filing (ยื่นรวม).

## Time

**Tax Month** (เดือนภาษี)
The calendar month a tax relates to, written `YYYY-MM`. Filings for Tax Month M fall due in month M+1.

**Fiscal Year** (รอบระยะเวลาบัญชี)
A Client's 12-month accounting period. It is often, but not always, the calendar year. It drives PND51, PND50 and Year-end.

**Due Date**
The last day to file an Obligation. It is computed from the Tax Rule Table, the Filing Channel and the Holiday Calendar. It is never typed in by hand.

**Holiday Calendar**
Thai public holidays plus special holidays the cabinet adds at short notice, and any deadline extensions the RD announces. It is data, editable by admins.

## Work

**Obligation**
One filing a Client owes for one Tax Month, for example *ACME Co. / PP30 / 2026-11*. **This is the unit of work.** Its states are:
`Not started → Waiting for documents → In review → Ready for approval → Approved → Filed → Paid → Certificates sent`
(Certificates sent applies only to WHT forms.)

**Filing Channel**
Paper or RD e-Filing. The channel changes the Due Date.

**Filing** (การยื่นแบบ)
The act of submitting a form to the RD. It produces an RD acknowledgement. Filing and Payment are separate states.
_Avoid:_ using "ยื่นภาษี" to mean both filing and payment.

**Payment** (การชำระภาษี)
The Client pays the tax due on a Filing. Evidence is the RD receipt or a bank Payment Slip.

**Amended Filing** (ยื่นเพิ่มเติม)
A correction made after Filing. It creates a new Obligation version and may trigger a Surcharge or Penalty.

**Surcharge** (เงินเพิ่ม) / **Penalty** (เบี้ยปรับ)
Statutory charges for filing or paying late or short. The Surcharge is 1.5% per month of the unpaid tax.

**Request for Documents**
A tracked ask to an Owner, such as "send the October KBank statement" or "re-send receipt #12, it's blurred". The Obligation it blocks stays in *Waiting for documents* until the request is fulfilled.

**Review Queue**
Extracted Documents waiting for a Bookkeeper to confirm them.

**Deadline Board**
The home screen. It shows every Client against every Obligation for the current cycle, coloured by state and Due Date.

**Close** (ปิดงวด)
The monthly process of finishing a Client's month: Documents complete, VAT and WHT tied out, bank statement in, journal exported. A Close Checklist tracks it.
_Avoid:_ "ปิดงบ" for this. That means Year-end.

**Year-end** (ปิดงบ / ปิดบัญชีประจำปี)
The annual process: financial statements, audit, AGM, DBD e-Filing, PND50. It is out of v1 scope.

## Documents

**Document**
Any source file received from an Owner: photo, PDF, XML or spreadsheet. The original file is immutable and hash-stamped. Extracted fields live beside it, never inside it.

**Tax Invoice** (ใบกำกับภาษีเต็มรูป)
An invoice that meets Revenue Code s.86/4. It is the only Document that supports an Input VAT claim.

**Abbreviated Tax Invoice** (ใบกำกับภาษีอย่างย่อ)
A short-form tax invoice, typical of retail and POS. It **cannot** support an Input VAT claim.

**Receipt** (ใบเสร็จรับเงิน) / **Cash Bill** (บิลเงินสด)
Evidence of an expense without a claimable VAT. Many Documents are titled "ใบเสร็จรับเงิน/ใบกำกับภาษี", so **classify a Document by its content, not by its title**.

**e-Tax Invoice**
A signed XML tax invoice in the ETDA standard. It is read directly, with no OCR.

**Payment Slip** (สลิปโอนเงิน)
A bank transfer confirmation image, verified against the amount and reference.

**WHT Certificate** (หนังสือรับรองการหักภาษี ณ ที่จ่าย, "50 ทวิ")
Issued by the Client to a Payee at the time of payment. It is numbered per Client.

**Extraction**
Field values proposed by the model for a Document. An Extraction becomes **Confirmed** only after a Bookkeeper accepts or edits it. Only Confirmed values reach a form.

**Finding**
The result of one validation rule on one Document or Obligation, with severity `Block`, `Warn` or `Info`. An Obligation with an open `Block` Finding cannot move to *Ready for approval*.

## Taxes and forms

**Output VAT** (ภาษีขาย) / **Input VAT** (ภาษีซื้อ)
VAT charged on the Client's sales and VAT paid on its purchases. **Disallowed Input VAT** (ภาษีซื้อต้องห้าม) is Input VAT the law forbids claiming, such as entertainment, passenger cars, or an invoice that is defective or out of the claim window.

**Sales Tax Report** (รายงานภาษีขาย) / **Purchase Tax Report** (รายงานภาษีซื้อ)
Statutory monthly registers of Output VAT and Input VAT. They feed PP30.

**PP30** (ภ.พ.30)
The monthly VAT return.

**PP36** (ภ.พ.36)
Reverse-charge VAT the Client pays on services bought from abroad.

**WHT** (ภาษีหัก ณ ที่จ่าย)
Tax the Client withholds from payments it makes and remits on these forms:
- **PND1** (ภ.ง.ด.1): employee salaries. **PND1Kor** (ภ.ง.ด.1ก) is its annual summary.
- **PND3** (ภ.ง.ด.3): payments to individuals.
- **PND53** (ภ.ง.ด.53): payments to juristic persons.
- **PND54** (ภ.ง.ด.54): payments abroad.

**WHT Credit** (ภาษีถูกหัก ณ ที่จ่าย)
Tax the Client's customers withheld from the Client, evidenced by 50 ทวิ the Client receives. It offsets corporate income tax. Track it; don't lose it.

**SSO Contribution** (เงินสมทบประกันสังคม, form สปส.1-10)
Employer and employee social security contributions, filed monthly.

**PND51 / PND50** (ภ.ง.ด.51 / ภ.ง.ด.50)
Half-year and annual corporate income tax returns. They are part of Year-end and out of v1.

## Rules

**Tax Rule Table**
Effective-dated statutory values: VAT rate, WHT rates by income type, thresholds, Due Date offsets, e-Filing extensions and the SSO wage ceiling. Each row has `effective_from`, `effective_to` and a source citation. See ADR-0003.

## Commercial

**Active Client**
A Client with at least one Obligation in the month. It is the unit of pricing.

**Owner App**
The LINE LIFF experience for Owners: receipt feedback, a tax-this-month preview, 50 ทวิ issuing, approvals, payment slips and the monthly pulse. It is free while the Client's Firm subscribes. See ADR-0009.

**Owner Pro**
A paid tier for SMEs with no Firm. It has the same Owner App features plus "Find an accountant". It has no general ledger.

---

## Relationships

```
Firm 1──* Bookkeeper
Firm 1──* Client 1──* Branch
Client 1──* Obligation (one per form per Tax Month [per Branch for VAT])
Client 1──* Document *──1 Counterparty
Document 1──* Extraction ──> Confirmed lines ──* Obligation
Document / Obligation 1──* Finding
Obligation 1──* WHT Certificate (PND3 / PND53)
Obligation ── uses ── Tax Rule Table + Holiday Calendar (for Due Date and rates)
Client 1──1 Close Checklist per Tax Month
```

## Ambiguities resolved

| Heard | Means in this product |
|---|---|
| "ลูกค้า" from an accountant | **Client** |
| "ลูกค้า" on a Client's invoice | **Counterparty** (customer role) |
| "ปิดงวด" | monthly **Close** |
| "ปิดงบ" | **Year-end** |
| "ยื่นภาษีแล้ว" | ask: **Filed** or **Paid**? They are separate states |
| "ใบเสร็จ" | any Document. Classify as Tax Invoice, Abbreviated Tax Invoice or Receipt by its content |
| "ใบ 50 ทวิ" | **WHT Certificate**. Say whether it was *issued* (Client withheld) or *received* (a WHT Credit) |
