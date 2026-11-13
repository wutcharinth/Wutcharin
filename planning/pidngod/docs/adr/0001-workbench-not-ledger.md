# ADR-0001: Sit above the books. Build a tax and close workbench, not a general ledger

**Status:** Accepted (v1)

## Context
Thai SMEs already keep books in Express (a desktop app, common in small firms), PEAK, FlowAccount or Excel. A Firm's Clients use a mix of these. PEAK and FlowAccount have accountant programmes, but each sees only the Clients on its own platform. The accountant's pain is the monthly VAT and WHT cycle *across all* Clients, not the lack of a ledger.

## Decision
v1 owns Document intake, Extraction, a **tax subledger** (Sales and Purchase Tax Reports, WHT payments), Obligations, the Deadline Board and the Close Checklist. It does **not** own the general ledger. It exports journal batches (generic Excel first, then whichever of Express, PEAK or FlowAccount design partners use most) and imports a monthly trial balance for tie-outs.

## Consequences
- We are software-agnostic: "one board for all your Clients, whatever software they use."
- No double-entry engine, chart-of-accounts migration or financial statements in v1.
- Tie-outs depend on trial balance imports, so their quality varies.
- Export formats are a maintenance cost.

## Revisit when
More than 40% of design-partner Clients have no software at all. Then add a minimal ledger for micro Clients.
