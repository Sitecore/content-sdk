# Claude Code — Sitecore Content SDK

At the start of every session, read these files for full project guidance:

1. **`AGENTS.md`** — Canonical source of truth: project overview, commands, package structure, boundaries, DO/DON'T rules, example tasks, git workflow
2. **`.cursor/rules/`** — Detailed coding rules (not auto-loaded by Claude Code):
   - `code-style.mdc` — Vibe-coding principles, code quality, error handling, imports, lint
   - `javascript.mdc` — Naming conventions, code layout, security, performance, JSDoc
   - `sitecore.mdc` — XM Cloud integration, component development, content management
   - `general.mdc` — DRY, SOLID, architecture patterns, development standards
   - `testing.mdc` — Mocha/Sinon/Chai, test commands
   - `safety.mdc` — Safety rules for compiled artifacts and secrets
   - `cli.mdc` — CLI behavior, init flow, backwards compatibility
   - `project-context.mdc` — Project-wide context and constraints
   - `repo-structure.mdc` — Repository structure and templates policy
   - `agent-tasks.mdc` — Example workflows (add utility, fix test, change template)
3. **`Skills.md`** and **`.agents/skills/`** — For capability-specific guidance (component registration, data fetching, editing, i18n, etc.), when your tool supports the [Agent Skills](https://agentskills.io) standard.
