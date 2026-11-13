# ADR-0007: Data residency, retention and immutability

**Status:** Proposed. Confirm region service availability first.

## Context
- PDPA (B.E. 2562) applies: Documents include payees' national IDs, salaries and addresses.
- The Revenue Code and the Accounting Act require keeping documents for at least 5 years, and the authorities can extend that.
- Firms need to prove what was filed and from which Documents.

## Decision
- Primary region: AWS Asia Pacific (Bangkok), if RDS Postgres, S3 Object Lock and KMS cover our needs there. Otherwise use Singapore and document the cross-border transfer basis in the privacy notice and DPA.
- Keep original Documents in object storage with **Object Lock (compliance mode)** and a SHA-256 hash in the DB. Retention defaults to 7 years after the Tax Month.
- Use an append-only event log for every Obligation state change and for every edit to Confirmed values.
- The Firm is the processor for its Clients, and we are a sub-processor. Publish a DPA template and a sub-processor list (cloud, LLM, LINE).

## Consequences
- Deletion requests are limited by the legal retention period. We need clear wording for that.
- Object Lock makes test data cleanup harder, so use separate buckets per environment.
