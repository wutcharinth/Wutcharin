# ADR-0002: The Firm is the tenant, and Clients are portable

**Status:** Accepted

## Context
Accountants gain and lose Clients, and Clients switch Firms. One Owner may also own several Clients.

## Decision
- `firm_id` is on every row. Postgres row-level security enforces isolation, and the app's DB role cannot bypass it.
- A Client belongs to exactly one Firm at a time. A full export (Documents, Confirmed data, Filings and certificates) is one click, and a Client transfer between Firms is a supported flow from phase 3.
- Owners authenticate with LINE Login and are granted access per Client.
- Roles: Firm Owner, Bookkeeper, Reviewer (Firm side), Owner (Client side). A Bookkeeper sees only the Clients assigned to them.

## Consequences
RLS adds query discipline from day 1, and it is hard to add later. Cross-firm analytics need explicit, consented, aggregated jobs.
