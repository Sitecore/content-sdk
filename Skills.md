# Skills — Capability groupings for the Sitecore Content SDK

Capability groupings and Agent Skills are **maintained in the scaffolding templates**, not at the monorepo root.

| Template | Capability index & skills |
|----------|---------------------------|
| **App Router** | [Skills.md](templates/nextjs/src/templates/nextjs-app-router/Skills.md) · [.agents/skills/](templates/nextjs/src/templates/nextjs-app-router/.agents/skills/) |
| **App Router + Cache Components** | [Skills.md](templates/nextjs/src/templates/nextjs-app-router-cache-components/Skills.md) · [.agents/skills/](templates/nextjs/src/templates/nextjs-app-router-cache-components/.agents/skills/) |
| **Pages Router** | [Skills.md](templates/nextjs/src/templates/nextjs/Skills.md) · [.agents/skills/](templates/nextjs/src/templates/nextjs/.agents/skills/) |
| **Angular** | [Skills.md](templates/angular/src/templates/angular/Skills.md) · [.agents/skills/](templates/angular/src/templates/angular/.agents/skills/) |

Each template's `Skills.md` is a compact index. Each `.agents/skills/<name>/SKILL.md` is a short task card that points to that template's `AGENTS.md` and `.agents/docs/` for depth. Load **one** skill per task.

Monorepo instructions: [AGENTS.md](AGENTS.md). Official docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
