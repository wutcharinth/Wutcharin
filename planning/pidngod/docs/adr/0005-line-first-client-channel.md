# ADR-0005: LINE first for Owners

**Status:** Accepted

## Context
Thai SME owners already send receipts to their accountant as photos in LINE chat. Today those photos get lost in chat history. Owners will not install another app.

## Decision
Each Firm connects its own **LINE Official Account**. Owners use:
- chat upload: photos and PDFs are filed automatically to their Client and the current Tax Month
- **LIFF** pages for "What's missing", "Approve tax amounts" and "Upload payment slip"
- LINE Login for identity

Web upload and a per-Client email-in address are fallbacks. e-Tax Invoice XML arrives by email.

## Consequences
- We depend on LINE platform terms and messaging costs. Design around reply messages and LIFF pages; use push messages sparingly.
- One Owner with several Clients needs a Client picker in LIFF.
