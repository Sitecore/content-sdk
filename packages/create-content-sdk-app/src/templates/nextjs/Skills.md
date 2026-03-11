# Skills.md — Capability groupings for this app (Next.js Pages Router)

This file describes **this application** in terms of **capability-style groupings**: high-level areas that help AI tools and developers map tasks to the right part of the app. This is a Pages Router app with `pages/[[...path]].tsx`, Next.js i18n, and a single component map. For concrete steps and patterns, see [AGENTS.md](AGENTS.md) and the [official Content SDK documentation](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).

**Agent Skills:** Each grouping is also available as a skill in [.agents/skills/](.agents/skills/) in the standard [Agent Skills](https://agentskills.io) format (`SKILL.md` per capability). Tools that support this standard load skills from `.agents/skills/`; Cursor's built-in skills use `.cursor/skills/` unless it also supports the Agent Skills standard. The skills here are tailored for **Pages Router** (e.g. extractPath, context.locale, getComponentData, single component-map.ts).

---

## Why capability grouping

Grouping related capabilities makes it easier to know which area of the app applies to a given task and to point to the right docs and patterns. Map the task to one or more of the groupings below; use AGENTS.md and the official docs for concrete steps.

---

## Capability groupings

### content-sdk-component-scaffold

Creating new Sitecore components: file structure, props interface, and placement under `src/components/`. Use when adding a new component from scratch. Register in `.sitecore/component-map.ts`.

### content-sdk-component-registration

Registering components in `.sitecore/component-map.ts` only. Required so layout and editing can resolve and render components. Used by getComponentData and editing API routes. Pages Router has a single map.

### content-sdk-editing-safe-rendering

Safe rendering in XM Cloud editing and preview: `context.preview` and `context.previewData`, editing chromes, and design library. Use when ensuring components work in the Sitecore editor and preview. Use `client.getPreview(context.previewData)` or `client.getDesignLibraryData(context.previewData)` when in preview.

### content-sdk-field-usage-image-link-text

Using SDK field components: `<Text>`, `<RichText>`, `<Image>`, `<Link>`, with proper validation and fallbacks. Use when rendering Sitecore fields.

### content-sdk-graphql-data-fetching

Page, dictionary, and component data via the single Sitecore client in `src/lib/sitecore-client.ts`. Use `getPage(path, { locale: context.locale })`, then `getDictionary({ site: page.siteName, locale: page.locale })` and `getComponentData(page.layout, context, components)`. For SSG use `getPagePaths(sites, context?.locales)`.

### content-sdk-route-configuration

Routing: single catch-all at `src/pages/[[...path]].tsx`. Path from `extractPath(context)`; locale from `context.locale`. Layout and page data flow via getStaticProps/getServerSideProps to _app and Layout.tsx. No [site]/[locale] in path; site resolved by middleware.

### content-sdk-site-setup-and-env

Site and environment: `sitecore.config.ts`, environment variables, default site and language. Document vars in `.env.example` only; never commit `.env` or `.env.local`.

### content-sdk-multisite-management

Multisite: `.sitecore/sites.json`, proxy in `src/proxy.ts`. Chain order is **fixed:** MultisiteProxy → RedirectsProxy → PersonalizeProxy. Do not change proxy order.

### content-sdk-dictionary-and-i18n

Dictionary and i18n: Next.js i18n in `next.config.js` (i18n.locales, defaultLocale). Per-request locale is `context.locale` in getStaticProps/getServerSideProps. Fetch dictionary with `client.getDictionary({ site: page.siteName, locale: page.locale })` after getPage.

### content-sdk-sitemap-robots

Sitemap and robots: `src/pages/api/sitemap.ts` and `src/pages/api/robots.ts` with `SitemapMiddleware(scClient, sites).getHandler()` and `RobotsMiddleware(scClient, sites).getHandler()`. Rewrites in next.config.js for /sitemap*.xml and /robots.txt.

### content-sdk-component-variants

Component variants: different renderings or data-driven variants of the same component type. Use when one component has multiple presentations. Register in `.sitecore/component-map.ts`; getComponentData resolves props.

### content-sdk-troubleshoot-editing

Troubleshooting XM Cloud editing, preview, and design library. Use when editing or preview does not behave as expected. Check context.preview, context.previewData, and editing API routes (config, render, feaas/render).

### content-sdk-upgrade-assistant

Upgrading @sitecore-content-sdk/* packages: version bumps, breaking changes, migration steps. Use when moving to a newer SDK version. Check the Content SDK repo CHANGELOG and upgrade guides.

### content-sdk-component-data-strategy

Component data: after getPage, use `client.getComponentData(page.layout, context, components)` to resolve component props; pass result to layout renderer. All Sitecore-driven component data goes through this flow. BYOC must be registered in `.sitecore/component-map.ts`.

---

## How to use this

Map the task to one or more groupings above. Use [AGENTS.md](AGENTS.md) for app-level instructions and the [official documentation](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html) for APIs.

**If your tool supports Agent Skills:** Load skills from [.agents/skills/](.agents/skills/) (one folder per capability). They provide when-to-use, hard rules, and stop conditions tailored for this Pages Router app.
