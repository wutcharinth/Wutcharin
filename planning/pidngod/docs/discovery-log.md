# Pidngod: discovery log

Notes from conversations with accountants. Keep quotes exact, and keep names out unless the person agrees to be named.

---

## #1: Accountant using PEAK (via pitch, Nov 2026)

**Quote:**
> ใช้ PEAK อยู่ค่ะ ปกติจะใช้วิธี Import ข้อมูลเข้าไปบันทึกบัญชี แต่ยังไม่เคยใช้ AI ช่วยทำเลย ถ้า AI ช่วยตรวจเอกสาร เช็กข้อมูลซ้ำ แล้วจัดประเภทค่าใช้จ่ายพร้อมเสนอรหัสบัญชีก่อน Export ข้อมูลไป Import เข้า PEAK ได้ก็น่าสนใจมากเลย

(Translation: "I use PEAK and usually import data to record the books. I've never used AI for it. If AI could check documents, catch duplicates, classify expenses and suggest account codes before I export a file to import into PEAK, that would be very interesting.")

**What we learned**
- Her workflow is already **batch import into PEAK**, not keying entries in PEAK one by one. The pain is preparing the import file.
- She has **not used AI yet**. Trust has to be earned, so reasons and confidence on every suggestion matter.
- She names four jobs, in her own order:
  1. check documents
  2. catch duplicates
  3. classify expenses
  4. suggest account codes, then export to PEAK

  That is exactly the ADR-0001 shape: sit above the books and export to them.

**Product response**
- New demo on the pitch site: **Day 6 · จัดประเภท เสนอรหัสบัญชี ส่งเข้า PEAK** (classify, suggest account codes, send to PEAK).
- [ADR-0011](adr/0011-account-code-suggestions-peak-first.md): account-code suggestions from the client's own chart of accounts, and the **PEAK import file as the first export target**.

**Follow-ups to ask her**
1. Can she share a **blank PEAK import template** she uses (expense or purchase import), plus one anonymised filled example?
2. Can she share **one client's chart of accounts exported from PEAK**?
3. Roughly how many documents per client per month, and how many clients are on PEAK?
4. How does she classify today: memory, a vendor list in Excel, or a rule sheet?
5. What would make her trust an AI suggestion: a reason, its history with that vendor, or a confidence score?
6. Which PEAK package do her clients use? From 1 Aug 2569, Excel imports above the monthly quota use credits, so our export volume could cost her or her clients money.
7. Would she join a 2–3-client shadow pilot?

**Status:** reply drafted (see the chat). Waiting for the template and chart of accounts.
