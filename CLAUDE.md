# Claude Code — Sitecore Content SDK

**Start here:** [`AGENTS.md`](AGENTS.md) — monorepo overview, commands, boundaries, and where to edit.

**Add detail only when needed:**

- **Coding rules:** [`.cursor/rules/`](.cursor/rules/) — open the relevant `.mdc` file for the task (e.g. `safety.mdc`, `sitecore.mdc`, `testing.mdc`). Do **not** load every rule file by default.
- **Capabilities:** [`Skills.md`](Skills.md) lists task → skill names. If your tool supports [Agent Skills](https://agentskills.io), read **one** matching skill under `.agents/skills/<name>/SKILL.md` (skills for scaffolded apps live in the Next.js templates under `packages/create-content-sdk-app/src/templates/`).

This repo is the **Content SDK monorepo**. For a **generated head app**, use that app’s `AGENTS.md` (not this file’s folder) as the primary guide.
