# Skills.md — Capability index

App Router with `[site]`/`[locale]`, next-intl, server/client component maps. Load **one** skill per task from [.agents/skills/](.agents/skills/). Full guidance: [AGENTS.md](AGENTS.md), [.agents/docs/](.agents/docs/).

| Skill | Use when |
|-------|----------|
| [content-sdk-component-scaffold](.agents/skills/content-sdk-component-scaffold/SKILL.md) | Creates Sitecore components under src/components/ |
| [content-sdk-component-registration](.agents/skills/content-sdk-component-registration/SKILL.md) | Registers components in  |
| [content-sdk-editing-safe-rendering](.agents/skills/content-sdk-editing-safe-rendering/SKILL.md) | Preview/editing via draftMode() and getPreview/getDesignLibraryData in App Router pages |
| [content-sdk-field-usage-image-link-text](.agents/skills/content-sdk-field-usage-image-link-text/SKILL.md) | Renders Sitecore fields with SDK Text, RichText, Image, Link components |
| [content-sdk-graphql-data-fetching](.agents/skills/content-sdk-graphql-data-fetching/SKILL.md) | Page/dictionary via SitecoreClient; SSG via getAppRouterStaticParams |
| [content-sdk-route-configuration](.agents/skills/content-sdk-route-configuration/SKILL.md) | App Router catch-all at src/app/[site]/[locale]/[[ |
| [content-sdk-site-setup-and-env](.agents/skills/content-sdk-site-setup-and-env/SKILL.md) | sitecore |
| [content-sdk-multisite-management](.agents/skills/content-sdk-multisite-management/SKILL.md) | Proxy: PreviewProxy → BotTracking → Locale → Multisite → Redirects → Personalize |
| [content-sdk-dictionary-and-i18n](.agents/skills/content-sdk-dictionary-and-i18n/SKILL.md) | next-intl with requestLocale = `${site}_${locale}`; routing |
| [content-sdk-sitemap-robots](.agents/skills/content-sdk-sitemap-robots/SKILL.md) | Route handlers under src/app/api/ with createSitemapRouteHandler / createRobotsRouteHandler |
| [content-sdk-component-variants](.agents/skills/content-sdk-component-variants/SKILL.md) | Multiple presentations per component; regenerate maps after changes |
| [content-sdk-troubleshoot-editing](.agents/skills/content-sdk-troubleshoot-editing/SKILL.md) | Check draftMode, getPreviewData(headers), setRequestLocale, getCachedPageParams, maps |
| [content-sdk-upgrade-assistant](.agents/skills/content-sdk-upgrade-assistant/SKILL.md) | Upgrade @sitecore-content-sdk/*; follow CHANGELOG and migration guides |
| [content-sdk-component-data-strategy](.agents/skills/content-sdk-component-data-strategy/SKILL.md) | Layout from getPage; site/locale from route params; serializable client props |
| [content-sdk-atoms-setup](.agents/skills/content-sdk-atoms-setup/SKILL.md) | Starter atoms wiring: src/atoms, Providers atomsConfig, CLI validate/update, first lock file |
| [content-sdk-atoms-create](.agents/skills/content-sdk-atoms-create/SKILL.md) | Define catalog + registry (props, field schemas, slots, actions); not component-map |
| [content-sdk-atoms-maintain](.agents/skills/content-sdk-atoms-maintain/SKILL.md) | Atom versioning and atoms.lock.json: validate, update, breakOnError, schema drift |

Do **not** load every skill at session start. Open [AGENTS.md](AGENTS.md) first; add one skill when the task matches a row above.

Official docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
