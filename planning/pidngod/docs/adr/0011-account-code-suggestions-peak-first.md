# ADR-0011: Suggest account codes from each Client's own chart of accounts; PEAK import file is the first export

**Status:** Accepted, based on discovery log #1

## Context
- The first accountant feedback (discovery log #1) says her workflow is a batch import into PEAK. She wants AI to check documents, catch duplicates, classify expenses and suggest account codes *before* exporting.
- Every Client's chart of accounts differs. Generic codes would need re-mapping on every import, which defeats the point.
- PEAK runs Excel imports on a monthly quota with paid credits from 1 Aug 2569 (see the competitive landscape doc).

## Decision
- Import each Client's **chart of accounts from their accounting software** (a PEAK export first). Suggestions only ever use codes that exist in that chart.
- Suggest codes in this order of evidence:
  1. this vendor's past Confirmed codes for this Client
  2. the document's line text and the vendor's business type
  3. the Client's own rules (for example, a capitalisation threshold of ฿10,000 → asset account)
  4. the model's classification

  Always show **the reason and a confidence**. Anything below 85% goes to the Bookkeeper to review.
- A Bookkeeper's correction becomes the rule for that vendor and Client (learning per Client, never across Firms).
- Tax treatment comes before the code:
  - Disallowed Input VAT is folded into the expense amount.
  - Foreign services are flagged for PP36.
  - WHT is carried into the export.
- **The first export target is the PEAK import template**, matched column for column against a real template from a design partner. Express and FlowAccount follow, then a generic Excel journal.
- Exports are batched per Client per month and **never contain duplicates**. Rows already exported are tracked, so re-exporting never double-posts.

## Consequences
- We need a chart-of-accounts import and a per-Client vendor rule store. Both are small.
- The PEAK template must be verified with real files, and then whenever PEAK changes it. Treat it like the Tax Rule Table: versioned and tested.
- If Firms export a lot, PEAK import credits become a cost for them or their Clients. Show the expected row count before export.

## Revisit when
PEAK offers an import API with partner terms that suit us. Then push directly instead of producing files.
