# Pidngod: PII and data security

How Pidngod handles personal data and keeps Client data safe. The decisions that are hard to reverse are in [ADR-0007](adr/0007-residency-retention.md) and [ADR-0010](adr/0010-pii-handling.md).

> This is a design plan, not legal advice. Before onboarding the first paying Firm, have a Thai PDPA lawyer review the role split, the DPA template, the cross-border basis and the privacy notices (budget: a few paid hours).

---

## 1. What personal data we hold

Most Pidngod data is about companies, which PDPA does not cover. But personal data sits inside almost every Document.

| Data | Where it shows up | Sensitivity |
|---|---|---|
| National ID numbers (13 digits) of individual Payees and employees | PND3, PND1, 50 ทวิ, SSO, Counterparty records | **High.** It is the key to identity fraud in Thailand |
| Salaries, bonuses, SSO contributions | Payroll import, PND1, สปส.1-10 | High |
| Names, addresses, phone numbers | Invoices, 50 ทวิ, Owner profiles | Medium |
| Bank account numbers, balances, transfer counterparties | Bank statements, Payment Slips | High |
| ID card copies (สำเนาบัตรประชาชน) that Owners send "just in case" | LINE uploads | **Sensitive.** Older cards show religion and blood type, which are sensitive data under PDPA s.26 |
| Health information | Receipts of a clinic or pharmacy Client that name patients | **Sensitive** (s.26) |
| LINE user IDs, display names, profile photos | LINE OA and LIFF | Medium |
| Login data, IP addresses, audit events | All users | Low to medium |

**Rule:** collect what a filing needs and nothing more. Do not extract or index a field unless a form or a validator uses it.

## 2. Roles under PDPA

| Party | PDPA role | What it means for us |
|---|---|---|
| **Client** (the SME) | Data controller for its employees', payees' and customers' data | Decides purposes. Data subjects' requests go to the Client |
| **Firm** | Processor for the Client (it keeps the books on the Client's behalf) | Signs a DPA with each Client, which most Firms don't have yet. We give them a template |
| **Pidngod** | Sub-processor for the Firm. Controller only for our own account data (Firm users' logins and billing) | DPA with each Firm, a record of processing (PDPA s.40), breach notice to the Firm "without delay" |
| Cloud, LLM, LINE, email providers | Our sub-processors | Listed publicly; Firms are told before any change |

Deliverables before the pilot:
- a Firm DPA
- a Firm-to-Client DPA template (Thai)
- a privacy notice for Owners in the LIFF app
- the record of processing
- the sub-processor list

## 3. The design decisions

### 3.1 Isolation
- Each Firm is a tenant, isolated by Postgres row-level security keyed on `firm_id` (ADR-0002). The app's database role cannot bypass it, and a CI test tries to read across tenants and must fail.
- A Bookkeeper sees only the Clients assigned to them. An Owner sees only the Clients their LINE account was invited to, through a one-time invite code from the Firm, never by searching.

### 3.2 Encryption
- TLS 1.2+ everywhere, and HSTS on the web app.
- At rest: database and object storage are encrypted with cloud KMS keys, **one data key per Firm** (envelope encryption). Destroying a departed Firm's key after its export window makes any leftover copies, including backups, unreadable.
- **Field-level encryption for national ID and bank account numbers.** Ciphertext sits in the row, and a keyed hash (HMAC) "blind index" allows exact-match lookups such as "find this Payee" without storing the number in plain text.

### 3.3 Masking by default
- The UI shows `1-2345-xxxxx-12-1` and `xxx-x-x4567-x`. "Show full number" is a deliberate click, and it is logged.
- Full numbers appear only where the law requires them: on the 50 ทวิ, in the RD upload files, and on the PND forms.
- Exports and reports mask by default. A full-data export needs the Firm Owner role and is watermarked with the user and time.

### 3.4 LINE
- **Never put personal data in push messages.** They appear on phone lock screens and in chat history. A push says "เอกสาร ต.ค. ยังขาด 2 รายการ" ("2 documents for October are still missing"). Details open in LIFF, behind LINE Login.
- Files sent in chat are copied from LINE's content API into our storage straight away. Tell Owners in the privacy notice that LINE also keeps chat content under its own policy.
- **ID card detection.** When the classifier sees an ID card copy, we keep it only if the Bookkeeper says it is needed. Otherwise we delete it and tell the Owner, by default.

### 3.5 AI (Extraction)
- **Call the model in-region where possible.** Use a cloud provider's managed model endpoint (for example Claude on AWS Bedrock or Google Vertex AI) in Bangkok or Singapore, under our existing cloud DPA. That keeps Document images inside the same provider and region as our storage.
  - Check which models each region offers at build time.
  - If we must use a US endpoint, document the cross-border transfer basis (PDPA s.28–29 and the PDPC's 2023 cross-border notifications) and list it as a sub-processor.
- Zero data retention and no training on our inputs, in contract, from every model vendor.
- Send the minimum: one Document at a time, no other Client context, no names of other Clients.
- **Prompt injection.** Text inside a Document is data, never instructions. Extraction returns a strict JSON schema, the deterministic validators (ADR-0006) catch impossible values, and a person confirms every value. A receipt that says "ignore previous instructions" cannot change anything.

### 3.6 Access
- MFA is required for every Firm user, with passkeys or TOTP. Sessions time out after 12 hours of inactivity, and Firm Owners can revoke any device.
- Roles: Firm Owner, Bookkeeper, Reviewer, Owner (ADR-0002). Least privilege by default.
- **Pidngod staff have no standing access to Client data.** Support access is break-glass: the Firm grants it for one Client for a limited time, every view is logged, and the Firm can see the log.

### 3.7 Logging and audit
- An append-only audit log records who received, viewed, revealed, edited, approved, filed and exported, and when (ADR-0007). Firms can see their own log.
- Application logs and error tracking scrub personal data, with a test that fails if a 13-digit ID pattern reaches the logs.

### 3.8 Retention and deletion

| Data | Kept for |
|---|---|
| Original Documents and filings | 7 years after the Tax Month, in Object Lock (law: at least 5 years, extendable) |
| Extraction drafts never Confirmed | 90 days |
| Rejected or out-of-scope uploads (ID cards not needed, personal photos) | Deleted within 30 days |
| A Firm that leaves | 60-day export window. Then we delete, except the legally retained set, which is kept read-only for the rest of its retention period, or handed to the Firm if it chooses |
| Audit logs | 7 years |

Data subject requests (access, correction, deletion) go to the Client as controller, through the Firm. We give the Firm a "find everything about this person" search, using the blind index, to answer them.

### 3.9 Breach response
- We notify affected Firms **within 24 hours** of confirming a breach, so that Clients can meet their PDPA duty to notify the PDPC within 72 hours.
- Keep a written runbook, an on-call owner, and a contact list of Firm Owners.
- Rehearse once a year with a tabletop exercise.

### 3.10 Engineering basics
- Separate cloud accounts for dev, staging and prod. **Never put real Client documents in dev.** The golden set used for AI evaluation is anonymised and kept apart.
- Infrastructure as code, secrets in a managed secret store, dependency scanning, and least-privilege service roles.
- Encrypted backups, with a restore tested every quarter.
- An external **penetration test before the first paid Firm**, then every year. Run a light bug bounty once there are 50 or more Firms.
- **ISO/IEC 27001** is a 2028 goal, once larger Firms ask for it. The controls above are chosen to map onto it.

## 4. What the pitch site promises

The pitch site (`site/index.html`) promises only what this plan delivers:
- no RD e-Filing passwords
- a person confirms every number
- immutable originals for 7 years
- PDPA DPAs
- no training on Client data
- a full audit trail
- national ID numbers encrypted and masked
- no personal data in LINE notifications
- Firm notified within 24 hours of a breach

All the IDs on the pitch site are deliberately fictional: they start with `0-9999` or are `1-2345-67890-12-1`. A checksum-valid but invented number could belong to a real person or company, so never demo with one.

## 5. Open items to verify

- [ ] PDPA lawyer review: roles, DPA templates, cross-border basis, notices.
- [ ] Whether we need a DPO (PDPA s.41): likely, if we process sensitive data at scale.
- [ ] Which in-region managed model endpoints offer the chosen model in Bangkok or Singapore.
- [ ] LINE Messaging API data-retention terms for content fetched by our bot.
- [ ] TFAC ethics rules on confidentiality when Bookkeepers use cloud tools: wording for the Firm DPA.
