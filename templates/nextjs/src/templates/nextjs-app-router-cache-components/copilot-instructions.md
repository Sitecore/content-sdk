# GitHub Copilot — Sitecore Content SDK Next.js (App Router + Cache Components) App

For AI agent instructions, commands, and coding rules in this application, use:

- **`AGENTS.md`** — Canonical source: overview, commands, App Router + Cache Components structure, cache helpers (`src/lib/cache/`), `POST /api/revalidate`, DO/DON'T, guardrails, boundaries.
- **`CLAUDE.md`** — How to layer AI context for this template (start with `AGENTS.md`; add detail only when needed).
- **`Skills.md`** and **`.agents/skills/`** — Capability index and per-task skills ([Agent Skills](https://agentskills.io)); load **one** matching skill per task.
- **`.cursor/rules/`** — Editor rules (applied by glob; open the rule that matches your task).

**Commands:** `npm install`, `npm run dev`, `npm run build`, `npm run lint`, `npm run type-check`. Copy `.env.example` → `.env.local` (include `SITECORE_REVALIDATE_SECRET` when using on-demand revalidation); never commit secrets or `.env` files.

Do not edit `node_modules/` or `.next/`, commit `.env`/`.env.local`, or modify SDK packages unless explicitly asked.

**Docs:** [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html)
