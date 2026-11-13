# ADR-0006: AI extraction is always confirmed by a person and checked by deterministic validators

**Status:** Accepted

## Context
Thai receipts include faded thermal prints, handwritten cash bills (บิลเงินสด), mixed Thai and English, and Buddhist Era dates. A wrong Input VAT claim is the accountant's professional liability.

## Decision
- A vision LLM extracts fields to a strict JSON schema, behind a provider interface. Model choice comes from a bake-off on our own golden set.
- Deterministic validators run on every Extraction and create Findings: TIN check digit, VAT arithmetic against the Tax Rule Table rate, buyer equals this Client (name, TIN, Branch), full vs abbreviated invoice, 6-month claim window, duplicates, Disallowed Input VAT categories, BE/CE date sanity, and the WHT threshold and rate.
- **Only Confirmed values reach a form.** The Review Queue is built for speed: keyboard-first, image beside the fields, low-confidence fields highlighted.
- Client data is never used for training. Use vendors' zero-retention options, with DPAs in place.

## Consequences
The time saved comes from review being faster than typing, not from autopilot. Auto-confirm for trusted repeat vendors can come later, behind a per-Firm setting and with measured accuracy.
