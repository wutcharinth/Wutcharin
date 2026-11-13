# ADR-0009: Two-sided, led by the accountant. SMEs get real value without channel conflict

**Status:** Accepted

## Context
SME owners also feel the monthly tax pain:
- surprise tax bills
- lost receipts that cost them Input VAT
- forgetting to issue 50 ทวิ at payment time
- not knowing what their accountant still needs

Two approaches each have a problem:
- Selling directly to SMEs as a "do your own books" tool puts us against FlowAccount and PEAK, and turns accountants (our channel) into competitors.
- Ignoring SMEs makes the Owner experience a chore, so documents still arrive late.

## Decision
Build an **Owner app** (LINE LIFF plus a light web view) that the Firm brings to its Clients. It is free while the Client has a Firm on Pidngod.

Owner features:
1. **Snap and forget**: send a receipt to LINE and get instant feedback such as "✓ valid tax invoice, ฿70 Input VAT saved" or "✗ abbreviated invoice, ask the seller for a full one", while the Owner can still get a proper one.
2. **Tax-this-month preview**: estimated PP30, PND3/53 and SSO as documents arrive. No surprise bills.
3. **Issue 50 ทวิ at payment time** from the phone (WHT rate suggested from the Tax Rule Table). This fixes a common compliance gap at the source, and the data flows straight into PND3/53.
4. **Calendar and approvals**: what's due, what's missing, approve amounts, upload the payment slip (with slip verification).
5. **Small-business pulse**: monthly sales, expenses and cash from Confirmed data, plus WHT Credits to reclaim at year-end.

**SMEs without an accountant** (phase 3): a paid "Owner Pro" tier that gives them the same capture, validation, 50 ทวิ and calendar, plus **"Find a Pidngod accountant"** to match them with a Firm for filing. Owners become a lead channel for Firms rather than a competing product. Still no general ledger (ADR-0001).

## Consequences
- More product surface: Owner UX quality matters as much as Bookkeeper UX.
- Owner-issued 50 ทวิ creates legal documents. Bookkeepers set which Owners may issue them and can review or void them, with a full audit trail.
- The marketplace needs Firm quality signals (on-time filing rate) and a fair lead fee or revenue share. Design it with design partners, not for them.
