# ADR-0010: Encrypt and mask national ID and bank numbers; keep AI calls in-region; no personal data in LINE pushes

**Status:** Accepted

## Context
Documents carry national ID numbers, salaries, bank details, and sometimes sensitive data (ID card copies, patient names). A leak would end a Firm's business and ours. Some of these choices are expensive to add after launch: field encryption, blind indexes, per-Firm keys, and the model endpoint region.

## Decision
- **Field-level encryption** for national ID and bank account numbers, with an HMAC blind index for exact lookups. **Per-Firm data keys** through KMS envelope encryption.
- **Masked display by default.** Revealing a full number is a logged action. Full numbers appear only on statutory outputs.
- **AI extraction runs on a managed model endpoint in the same cloud provider and region as our storage** (Bangkok or Singapore) where the chosen model is available there. Vendors must contract for zero retention and no training. Document text is treated as data, never as instructions.
- **LINE push messages carry no personal data.** Details open only in LIFF behind LINE Login.
- **No standing staff access** to Client data. Support uses time-boxed break-glass access that the Firm grants and can see.
- Notify affected Firms **within 24 hours** of a confirmed breach.

## Consequences
- More schema work on day 1. For example, Payee search uses the blind index instead of `LIKE`.
- Model choice is limited to what is offered in-region. Revisit if a much better model is only available out of region, with a documented cross-border transfer basis.
- Support takes longer when a Firm must grant access first. That trade is intended.

See [../security-privacy.md](../security-privacy.md) for the full plan.
