# ADR-0003: Statutory values are effective-dated data, not code

**Status:** Accepted

## Context
Thai tax parameters change often and at short notice:
- The VAT rate is a reduced 7% against a statutory 10%. A royal decree extends it periodically, and an increase has been publicly debated.
- The extra e-Filing days are renewed periodically.
- The e-WHT reduced rates expire.
- The SSO wage ceiling is rising in steps from 2026.
- The cabinet adds special holidays, which shift Due Dates.
- The RD grants disaster-area extensions.

## Decision
Keep a **Tax Rule Table** and a **Holiday Calendar** with `effective_from`, `effective_to`, a source URL or citation, and the editor. All rates, thresholds and Due Dates are looked up by the relevant date: the invoice date for VAT, the payment date for WHT, the Tax Month for Due Dates. Every computed figure records the rule rows it used.

## Consequences
- A rule change is an admin edit plus a test run, not a deploy.
- Old periods recompute correctly.
- We need an internal "rules owner" process: monitor the RD, SSO and Royal Gazette, with two-person review of edits.
