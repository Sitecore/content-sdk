# Skills.md — Capability index

Pages Router app with `[[...path]].tsx`, Next.js i18n (`context.locale`), single component map. Load **one** skill per task from [.agents/skills/](.agents/skills/). Full guidance: [AGENTS.md](AGENTS.md), [.agents/docs/](.agents/docs/).

| Skill | Use when |
|-------|----------|
| [content-sdk-component-scaffold](.agents/skills/content-sdk-component-scaffold/SKILL.md) | Creates new Sitecore components under src/components/ |
| [content-sdk-component-registration](.agents/skills/content-sdk-component-registration/SKILL.md) | Registers components in  |
| [content-sdk-editing-safe-rendering](.agents/skills/content-sdk-editing-safe-rendering/SKILL.md) | Preview/editing for Pages Router via context |
| [content-sdk-field-usage-image-link-text](.agents/skills/content-sdk-field-usage-image-link-text/SKILL.md) | Renders Sitecore fields with SDK components Text, RichText, Image, Link |
| [content-sdk-graphql-data-fetching](.agents/skills/content-sdk-graphql-data-fetching/SKILL.md) | Page/dictionary fetch via SitecoreClient in [[ |
| [content-sdk-route-configuration](.agents/skills/content-sdk-route-configuration/SKILL.md) | Pages Router catch-all at src/pages/[[ |
| [content-sdk-site-setup-and-env](.agents/skills/content-sdk-site-setup-and-env/SKILL.md) | sitecore |
| [content-sdk-multisite-management](.agents/skills/content-sdk-multisite-management/SKILL.md) | Multisite via proxy |
| [content-sdk-dictionary-and-i18n](.agents/skills/content-sdk-dictionary-and-i18n/SKILL.md) | Next |
| [content-sdk-sitemap-robots](.agents/skills/content-sdk-sitemap-robots/SKILL.md) | API routes src/pages/api/sitemap |
| [content-sdk-component-variants](.agents/skills/content-sdk-component-variants/SKILL.md) | Multiple renderings of one component type; regenerate component map after changes |
| [content-sdk-troubleshoot-editing](.agents/skills/content-sdk-troubleshoot-editing/SKILL.md) | Debug Pages Router preview: context |
| [content-sdk-upgrade-assistant](.agents/skills/content-sdk-upgrade-assistant/SKILL.md) | Upgrade @sitecore-content-sdk/* packages; check CHANGELOG and migration guides |
| [content-sdk-component-data-strategy](.agents/skills/content-sdk-component-data-strategy/SKILL.md) | Layout data from getPage/getComponentData; path/locale from extractPath/context |
| [content-sdk-atoms-setup](.agents/skills/content-sdk-atoms-setup/SKILL.md) | Starter atoms wiring: src/atoms, Providers atomsConfig, CLI validate/update, first lock file |
| [content-sdk-atoms-create](.agents/skills/content-sdk-atoms-create/SKILL.md) | Define catalog + registry (props, field schemas, slots, actions); not component-map |
| [content-sdk-atoms-maintain](.agents/skills/content-sdk-atoms-maintain/SKILL.md) | Atom versioning and atoms.lock.json: validate, update, breakOnError, schema drift |

Do **not** load every skill at session start. Open [AGENTS.md](AGENTS.md) first; add one skill when the task matches a row above.

Official docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
