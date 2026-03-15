# GitHub Copilot — Sitecore Content SDK

For AI agent instructions, commands, and coding rules in this repository, use:

- **`AGENTS.md`** (repo root) — Canonical source: project overview, quick commands, package structure, DO/DON'T, boundaries, git workflow. For scaffolded head apps under `samples/`, use that app’s `AGENTS.md`.
- **`.cursor/rules/`** — Detailed coding rules (code-style, safety, sitecore, testing, etc.). Security and secrets: see `safety.mdc`.
- **`Skills.md`** and **`.agents/skills/`** — Capability-level instructions (e.g. component registration, Sitecore client, editing) for tools that support the [Agent Skills](https://agentskills.io) standard.

Do not edit `dist/**`, commit `.env`/`.env.local`, or change CI/config without explicit instruction.
