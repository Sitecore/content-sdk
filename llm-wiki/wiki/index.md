# LLM Wiki hub

Agent-maintained markdown under `llm-wiki/wiki/`, split by **head stack** and **shared** concepts.

| Folder | Scope | Start here |
|--------|--------|------------|
| **[content-sdk-nextjs/](content-sdk-nextjs/index.md)** | **Content SDK Next.js** — `@sitecore-content-sdk/nextjs`, templates, editing, routing, i18n, doc synthesis | [content-sdk-nextjs/index.md](content-sdk-nextjs/index.md) |
| **[common/](common/index.md)** | **Shared** — `SitecoreConfigInput`, env / `buildFallbackConfig`, `SitecoreClient` + GraphQL factory (`packages/content`) | [common/index.md](common/index.md) |
| **[content-sdk-angular/](content-sdk-angular/index.md)** | **Content SDK Angular** — `@sitecore-content-sdk/angular`, Angular template, loaders/SSR architecture (ingested design doc) | [content-sdk-angular/index.md](content-sdk-angular/index.md) |

## Repo-wide meta

| | |
|--|--|
| [log.md](log.md) | Append-only ingest / query / lint log for **all** wiki areas |
| [wiki-boundary-and-token-audit.md](wiki-boundary-and-token-audit.md) | Boundary rules (Next vs Angular vs **common**), LLM routing, conformance checklist |
| [plans/](plans/) | In-progress feature and wiki-change plans ([plans/README.md](plans/README.md)) |
| [AGENTS.md](../AGENTS.md) | LLM Wiki schema, workflows, truth hierarchy |

**Agents:** For Next-specific answers, open **`content-sdk-nextjs/index.md`** then the linked page. For **`sitecore.config`**, env fallbacks, or **`SitecoreClient`** / GraphQL behavior shared by all heads, start with **`common/index.md`**. For Angular integration (loaders, SSR), use **`content-sdk-angular/`**. For wiki structure and vague-language rules, read **`wiki-boundary-and-token-audit.md`** first when auditing docs. For **in-progress** wiki or feature notes, see **`plans/`**.
