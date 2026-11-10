# Pidngod prototype: a firm's monthly tax workbench

A working front-end prototype with demo data. It runs entirely in the browser; there is no backend.

**Live:** https://claude.ai/artifact/E84GUcymXRxJkWyej5BwwS

## Areas

| Area | What works |
|---|---|
| **Deadline board** (all clients) | Every client × PP30, PND1, PND3, PND53, PND54, PP36, SSO. Due dates are computed for online or paper filing and moved off weekends. Each status comes from that client's real data: waiting for documents → in review → ready → filed → paid. Clicking a status opens the work. |
| **Overview + close** | KPIs and expense by account code. A 6-step close checklist: documents processed, all confirmed or requested, bank reconciled, 50 ทวิ issued, forms filed, exported. Closing locks the period; it can be reopened. |
| **Check & classify** | Rule checks (tax ID check digit, buyer TIN, seller VAT registration, VAT 7%, 6-month window, duplicates, disallowed input VAT, PP36, WHT rate and form). Account-code suggestions from vendor history, the client's asset rule and keywords, each with a reason and confidence. Learns per vendor. Keyboard review, bulk-confirm of clean high-confidence documents, and an "Ask AI" button inside Claude. |
| **Bank reconciliation** | Matches statement lines on net payable (incl. VAT, less WHT), date and payee name. Each line is auto-matched, suggested for confirmation, matched by hand, a customer receipt, a bank-fee rule, or has no document (request it). Also lists documents with no payment found. |
| **Purchase VAT · PP30 · PP36** | Purchase tax report from confirmed, claimable documents (CSV). PP30 with editable sales lines and carry-forward credit, showing tax to pay or a refund, with a warning for unconfirmed input VAT. PP36 for foreign services. File and pay status. |
| **WHT · 50 ทวิ** | PND3/53/54 grouped, with income type and rate. Numbered 50 ทวิ certificates with the amount in Thai words. Attachment CSV per form. Payroll status for PND1 and SSO, with a request or import of the payroll summary. |
| **Client requests** | Built automatically from blocked documents, bank lines with no document, and missing payroll. A LINE message preview with no personal data. Send one or all, with timestamps (demo). |
| **Import** | Paste from Excel/Sheets or upload a CSV, with Thai/English header auto-mapping. Add a document by hand. Receipt photo → Claude reads it, inside Claude only. |
| **Chart of accounts & rules** | Import a chart, set the capitalisation rule, see the tax rule table, and manage learned vendors. |
| **Export** | A PEAK import-file layout (**sample columns; must be matched to the real template**) or a debit/credit journal. CSV download inside Claude, otherwise copied. Rows are never exported twice. |
| **Activity log** | Every action, per client. |

## Not real yet
- No backend, login, real LINE or e-Filing.
- Documents start as extracted rows.
- Sales figures and bank statements are demo data.
- State is kept in the viewer's browser. Use "รีเซ็ตข้อมูลตัวอย่าง" (reset demo data) to start over.
