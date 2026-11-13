# ADR-0004: Prepare filings; don't submit them or hold RD credentials

**Status:** Accepted (v1–v2)

## Context
RD e-Filing is done with each taxpayer's own username and password. There is no general third-party filing API for this use case. Storing Clients' RD passwords would be a large security and PDPA liability and would erode trust.

## Decision
Produce everything needed to file:
- the completed form figures
- a PDF for Owner approval
- RD-compatible attachment or upload files for PND1/3/53 (format to be verified against the current RD Prep / e-Filing spec)
- the Sales and Purchase Tax Reports

The Bookkeeper submits on the RD site and then records the Filing: an RD reference plus the uploaded acknowledgement. **Never store RD credentials.**

## Consequences
- The last mile stays manual, about 2–5 minutes per Obligation.
- We avoid credential custody and screen-scraping fragility.

## Revisit when
The RD offers an authorised software-provider filing API.
