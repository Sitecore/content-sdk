# Skills — Capability groupings for the Sitecore Content SDK

Capability groupings and Agent Skills are **maintained in the scaffolding templates**, not at the monorepo root. This keeps a single source of truth and avoids duplicating 14 skills across root and templates.

**Use the template that matches your app:**

| Template | Capability map & skills |
|----------|------------------------|
| **App Router** | [Skills.md](packages/create-content-sdk-app/src/templates/nextjs-app-router/Skills.md) · [.agents/skills/](packages/create-content-sdk-app/src/templates/nextjs-app-router/.agents/skills/) |
| **Pages Router** | [Skills.md](packages/create-content-sdk-app/src/templates/nextjs/Skills.md) · [.agents/skills/](packages/create-content-sdk-app/src/templates/nextjs/.agents/skills/) |

Each template’s `Skills.md` lists the same capability groupings (component scaffold, registration, data fetching, editing, i18n, etc.) with template-specific details. Each template’s `.agents/skills/` contains one folder per capability with a `SKILL.md` (when-to-use, how to perform, hard rules, stop conditions). Tools that support [Agent Skills](https://agentskills.io) can load skills from the template path when working in a generated app or in the template source.

For monorepo-level instructions (commands, structure, DO/DON’T), see [AGENTS.md](AGENTS.md). For official APIs and guides, see the [Content SDK documentation](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
