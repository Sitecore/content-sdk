# Claude Code — Sitecore Content SDK Angular App

**Start here:** [`AGENTS.md`](AGENTS.md) — compact guide (commands, structure, guardrails, DO/DON'T).

**Add detail only when needed:**

- **Layered docs:** [`.agents/docs/`](.agents/docs/) — open **one** file for the topic ([README](.agents/docs/README.md)).
- **Cursor rules:** [`.cursor/rules/`](.cursor/rules/) — applied by glob; open the rule that matches your task.
- **Capabilities:** [`Skills.md`](Skills.md) → **one** [`.agents/skills/<name>/SKILL.md`](.agents/skills/) per task ([Agent Skills](https://agentskills.io)).

Do **not** load every rule file or every skill at session start.

**Angular-specific rule you should know before editing anything:** code under `src/content-sdk/` (loaders and the Sitecore client) runs both inside Angular SSR and inside plain Express middleware. It must not use Angular dependency injection. Read [`.agents/docs/AGENTS-loaders-and-di.md`](.agents/docs/AGENTS-loaders-and-di.md) before touching loaders.

This scaffolded head app only. For the Content SDK monorepo (packages, CLI), use that repo's root `AGENTS.md`.
