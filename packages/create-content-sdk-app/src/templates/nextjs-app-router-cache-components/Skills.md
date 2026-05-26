# Skills.md — Capability groupings for this app (Next.js App Router + Cache Components)

This file describes **this application** in terms of **capability-style groupings**: high-level areas that help AI tools and developers map tasks to the right part of the app. This is an App Router app with `[site]`/`[locale]` segments, next-intl, separate server/client component maps, **Next.js Cache Components** (`cacheComponents: true`), and **tag-based on-demand revalidation** via `POST /api/revalidate`. For concrete steps and patterns, see [AGENTS.md](AGENTS.md) and the [official Content SDK documentation](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).

**Agent Skills:** Each grouping is also available as a skill in [.agents/skills/](.agents/skills/) in the standard [Agent Skills](https://agentskills.io) format (`SKILL.md` per capability). Tools that support this standard load skills from `.agents/skills/`; Cursor's built-in skills use `.cursor/skills/` unless it also supports the Agent Skills standard. The skills here are tailored for **App Router + Cache Components** (e.g. setRequestLocale, draftMode(), component-map.ts + component-map.client.ts, the `src/lib/cache/` helpers, and the `POST /api/revalidate` route).

---

## Why capability grouping

Grouping related capabilities makes it easier to know which area of the app applies to a given task and to point to the right docs and patterns. Map the task to one or more of the groupings below; use AGENTS.md and the official docs for concrete steps.

---

## Capability groupings

### content-sdk-component-scaffold

Creating new Sitecore components: file structure, props interface, and placement under `src/components/`. Use when adding a new component from scratch. In App Router, decide Server vs Client and register in the appropriate map.

### content-sdk-component-registration

Registering components in `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client). Required so layout and editing can resolve and render components. App Router has separate server and client maps.

### content-sdk-editing-safe-rendering

Safe rendering in XM Cloud editing and preview: `draftMode()`, editing chromes, and design library. Use when ensuring components work in the Sitecore editor and preview. Use `client.getPreview(searchParams)` or `client.getDesignLibraryData(searchParams)` **directly** (uncached) when draft mode is enabled — never wrap preview data in `'use cache'`.

### content-sdk-field-usage-image-link-text

Using SDK field components: `<Text>`, `<RichText>`, `<Image>`, `<Link>`, with proper validation and fallbacks. Use when rendering Sitecore fields.

### content-sdk-graphql-data-fetching

Page and dictionary fetching via the cache helpers in `src/lib/cache/`. Use `getSitecorePage({ site, locale, path })`, `getSitecoreDictionary({ site, locale })`, `getSitecoreErrorPage({ site, locale, code })` for cached reads with Sitecore tags. Use `client.getPreview` / `client.getDesignLibraryData` directly for preview, and `client.getAppRouterStaticParams` for SSG.

### content-sdk-route-configuration

Routing: single catch-all at `src/app/[site]/[locale]/[[...path]]/page.tsx`. Layout: app/layout.tsx → app/[site]/layout.tsx → page. Call `setRequestLocale(\`${site}_${locale}\`)` at top of page. Root not-found uses `getSitecoreErrorPage`; root `global-error.tsx` uses `client.getErrorPage` directly (it's a Client Component).

### content-sdk-site-setup-and-env

Site and environment: `sitecore.config.ts`, environment variables, default site and language, `SITECORE_REVALIDATE_SECRET` for `POST /api/revalidate`. Document vars in `.env.example` only; never commit `.env` or `.env.local`. Keep the SDK's in-process dictionary cache disabled (`dictionary: { caching: { enabled: false } }`) so `revalidateTag` works for dictionary updates.

### content-sdk-multisite-management

Multisite: `.sitecore/sites.json`, proxy in `src/proxy.ts`. Chain order is **fixed:** PreviewProxy → BotTrackingProxy → LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy. Do not change proxy order.

### content-sdk-dictionary-and-i18n

Dictionary and i18n: next-intl with `src/i18n/routing.ts` and `src/i18n/request.ts`. Request locale is `${site}_${locale}`; call `setRequestLocale(\`${site}_${locale}\`)` in the page; in request.ts parse and load dictionary with `getSitecoreDictionary({ locale, site })` (the cache-aware helper, not `client.getDictionary` directly).

### content-sdk-sitemap-robots

Sitemap and robots: `src/app/api/sitemap/route.ts` and `src/app/api/robots/route.ts` with `createSitemapRouteHandler` and `createRobotsRouteHandler`. Rewrites in next.config.ts for /sitemap*.xml and /robots.txt. With `cacheComponents: true`, the explicit `dynamic = 'force-dynamic'` is not needed.

### content-sdk-component-variants

Component variants: different renderings or data-driven variants of the same component type. Use when one component has multiple presentations. Register in the appropriate component map (server or client).

### content-sdk-troubleshoot-editing

Troubleshooting XM Cloud editing, preview, and design library. Use when editing or preview does not behave as expected. Check draftMode(), getPreview/getDesignLibraryData from searchParams, and component maps. Also confirm preview is **not** going through the cache helpers — preview must remain dynamic.

### content-sdk-upgrade-assistant

Upgrading @sitecore-content-sdk/* packages: version bumps, breaking changes, migration steps. Use when moving to a newer SDK version. Check the Content SDK repo CHANGELOG and upgrade guides.

### content-sdk-component-data-strategy

Component data: layout data from `getSitecorePage` (or `client.getPreview` / `getDesignLibraryData` in draft mode). Pass site and locale from route params; Server Components use the cache helpers in server context; Client Components receive serializable props from parent. BYOC must be registered in the component map.

### content-sdk-cache-components-and-osr

Next.js Cache Components and tag-based on-demand revalidation: the `src/lib/cache/` helpers (`getSitecorePage`, `getSitecoreDictionary`, `getSitecoreErrorPage`), the Sitecore tag families (`sc:route`, `sc:item`, `sc:pvv`, `sc:dict`), and the `POST /api/revalidate` route (manual tags + Sitecore webhook payloads, authorized via `SITECORE_REVALIDATE_SECRET`). Use when adding cached reads, wiring webhooks, debugging stale content, or extending the tag strategy.

---

## How to use this

Map the task to one or more groupings above. Use [AGENTS.md](AGENTS.md) for app-level instructions and the [official documentation](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html) for APIs.

**If your tool supports Agent Skills:** Load skills from [.agents/skills/](.agents/skills/) (one folder per capability). They provide when-to-use, hard rules, and stop conditions tailored for this App Router + Cache Components app.
