# Pidngod prototype: check, classify, export to PEAK

A working front-end prototype with demo data. It runs entirely in the browser; there is no backend.

**Live:** https://claude.ai/artifact/E84GUcymXRxJkWyej5BwwS

## What works
- **3 demo clients**, each with its own chart of accounts and vendor history:
  - Siam Cleaning (PEAK)
  - Khrua Khun Yai (PEAK, 6-digit codes)
  - Chang Lek (Express)
- **Rule checks:**
  - tax ID check digit
  - buyer TIN matches the Client (s.86/4)
  - seller not VAT-registered
  - VAT = 7% of base
  - 6-month input VAT window
  - duplicates (same vendor + document number)
  - disallowed input VAT (entertainment, passenger cars), folded into the expense
  - PP36 for foreign services
  - WHT rate and form (PND3/53/54)
  - "WHT may be required" hints
- **Account-code suggestions** in this order: vendor history → client asset rule (capitalisation threshold) → keywords from the client's chart → fallback. Each shows a reason and a confidence.
  - Below 85%, or with any warning, the document goes to a person.
  - Changing a code teaches the vendor rule for that Client.
- **Review queue:**
  - filters
  - keyboard: ↑ ↓ and Enter
  - bulk-confirm everything with no warnings and ≥90% confidence
  - drawer with checks, top 3 alternatives and the resulting journal lines
  - "request new document" and "confirm as expense without input VAT"
- **Import:** paste from Excel or Google Sheets, or upload a CSV. Thai and English headers are auto-mapped; BE and CE dates are both accepted.
- **Chart of accounts:** import (`code,name`), capitalisation rule, learned vendor list with "forget".
- **Export:**
  - formats: a PEAK import-file layout (**sample columns; must be matched to the real PEAK template**) or a debit/credit journal
  - output: CSV download (inside Claude) or copy
  - exported rows are never exported twice
- **Ask AI** (only when opened in Claude): sends the document and the client's chart of accounts to Claude. Only accepts a code that exists in the chart.

## Not real yet
- No backend, login, LINE or OCR. Documents are already-extracted demo rows.
- State is kept in the viewer's browser (`localStorage`). Use "รีเซ็ตข้อมูลตัวอย่าง" (reset demo data) to start over.
- The PEAK column layout is a placeholder until we get a real template from a design partner (discovery log #1).
