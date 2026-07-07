# GitHub Copilot — Sitecore Content SDK

For AI agent instructions, commands, and coding rules in this repository, use:

- **`AGENTS.md`** (repo root) — Canonical source: project overview, quick commands, package structure, DO/DON'T, boundaries, git workflow. For scaffolded head apps under `samples/`, use that app's `AGENTS.md`.
- **`CLAUDE.md`** — How to layer AI context for this monorepo (start with `AGENTS.md`; add detail only when needed).
- **`.cursor/rules/`** — Detailed coding rules (code-style, safety, sitecore, testing, etc.). Security and secrets: see `safety.mdc`.
- **`Skills.md`** and template **`.agents/skills/`** — Capability-level instructions for scaffolded apps (see `packages/create-content-sdk-app/src/templates/`).

Do not edit `dist/**`, commit `.env`/`.env.local`, or change CI/config without explicit instruction.

**Docs:** [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html)
