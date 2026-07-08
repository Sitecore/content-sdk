# Claude Code — Sitecore Content SDK

**Start here:** [`AGENTS.md`](AGENTS.md) — monorepo overview, commands, guardrails, and where to edit.

**Add detail only when needed:**

- **Depth docs:** [`.agents/docs/`](.agents/docs/) — code style, safety, Sitecore patterns, workflows (open **one** file per task)
- **Coding rules:** [`.cursor/rules/`](.cursor/rules/) — glob-scoped; e.g. `safety.mdc`, `sitecore.mdc`, `testing.mdc`. Do **not** load every rule by default
- **Head-app capabilities:** [`Skills.md`](Skills.md) → template `.agents/skills/` (load **one** skill per task)

This repo is the **Content SDK monorepo**. For a **generated head app**, use that app's `AGENTS.md` as the primary guide.
