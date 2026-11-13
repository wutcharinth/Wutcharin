# ADR-0008: TypeScript modular monolith on Postgres; Thai PDFs rendered from HTML

**Status:** Accepted

## Context
The founder builds solo or with a tiny team and already ships React, Vite and Node (see the portfolio repo). Thai PDF output has to shape combining vowels and tone marks correctly, which low-level PDF libraries such as pdf-lib do not do.

## Decision
- **One deployable** with clear modules: intake, extraction, tax, obligations, close, firm, LINE, exports.
- React + Vite SPA for Firms. The LIFF pages are routes in the same app.
- Node API (Fastify or Hono).
- **Postgres** with RLS, and money as integer satang. Jobs run on Postgres too (pg-boss), so there is no extra queue service.
- S3 for Documents.
- **PDFs: HTML templates rendered in headless Chromium (Playwright)** with the Sarabun / TH Sarabun New fonts. This covers forms, 50 ทวิ and tax reports.
- LLM through a provider interface. Start the bake-off with Claude Sonnet 5.5 for vision extraction and Claude Haiku 5.5 for classification, alongside Gemini.

## Consequences
- Simple ops and one codebase.
- Chromium workers need memory, so run them as a separate process type.
- Split out services only when a module has a different scaling or compliance profile.
