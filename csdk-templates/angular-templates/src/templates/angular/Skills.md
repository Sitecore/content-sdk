# Skills.md — Capability index

Angular head app: catch-all route behind `scLocaleMatcher`, Sitecore data through **loaders** in `src/content-sdk/loaders/`, Express SSR server in `src/server.ts`, single component map. Load **one** skill per task from [.agents/skills/](.agents/skills/). Full guidance: [AGENTS.md](AGENTS.md), [.agents/docs/](.agents/docs/).

| Skill | Use when |
|-------|----------|
| [content-sdk-loader-authoring](.agents/skills/content-sdk-loader-authoring/SKILL.md) | Writing or changing a loader — the no-Angular-DI rule and the `LOADERS` registry |
| [content-sdk-graphql-data-fetching](.agents/skills/content-sdk-graphql-data-fetching/SKILL.md) | Fetching page or dictionary data through `getClient()` |
| [content-sdk-route-configuration](.agents/skills/content-sdk-route-configuration/SKILL.md) | Routes, resolvers, and keeping `app.routes.server.ts` in sync |
| [content-sdk-ssr-express-middleware](.agents/skills/content-sdk-ssr-express-middleware/SKILL.md) | Express middleware order and the server-only bundle boundary |
| [content-sdk-loader-cache-and-revalidation](.agents/skills/content-sdk-loader-cache-and-revalidation/SKILL.md) | Caching, stale content, `POST /api/revalidate` |
| [content-sdk-component-scaffold](.agents/skills/content-sdk-component-scaffold/SKILL.md) | Creating a standalone Sitecore component under `src/app/components/` |
| [content-sdk-component-registration](.agents/skills/content-sdk-component-registration/SKILL.md) | Component map and the `SITECORE_COMPONENT_MAP` token |
| [content-sdk-component-variants](.agents/skills/content-sdk-component-variants/SKILL.md) | One component type with multiple presentations |
| [content-sdk-component-data-strategy](.agents/skills/content-sdk-component-data-strategy/SKILL.md) | How a component receives Sitecore data |
| [content-sdk-field-usage-image-link-text](.agents/skills/content-sdk-field-usage-image-link-text/SKILL.md) | Rendering fields with `*scText` / `*scRichText` / `*scImage` / `*scLink` |
| [content-sdk-editing-safe-rendering](.agents/skills/content-sdk-editing-safe-rendering/SKILL.md) | Metadata-mode editing, preview, and Design Library |
| [content-sdk-troubleshoot-editing](.agents/skills/content-sdk-troubleshoot-editing/SKILL.md) | Editing or preview misbehaving |
| [content-sdk-dictionary-and-i18n](.agents/skills/content-sdk-dictionary-and-i18n/SKILL.md) | URL locale segments, dictionary, translation |
| [content-sdk-multisite-management](.agents/skills/content-sdk-multisite-management/SKILL.md) | Site resolution and `.sitecore/sites.json` |
| [content-sdk-personalization-and-analytics](.agents/skills/content-sdk-personalization-and-analytics/SKILL.md) | Variants, CDP, analytics events, bot tracking |
| [content-sdk-site-setup-and-env](.agents/skills/content-sdk-site-setup-and-env/SKILL.md) | `sitecore.config.ts` and the `CSDK_PUBLIC_*` env split |
| [content-sdk-sitemap-robots](.agents/skills/content-sdk-sitemap-robots/SKILL.md) | Sitemap and robots middleware |
| [content-sdk-upgrade-assistant](.agents/skills/content-sdk-upgrade-assistant/SKILL.md) | Upgrading SDK or Angular packages |

Do **not** load every skill at session start. Open [AGENTS.md](AGENTS.md) first; add one skill when the task matches a row above.

Official docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
