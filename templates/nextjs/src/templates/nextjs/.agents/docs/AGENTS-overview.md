# Project overview (Pages Router)

This is a **Sitecore Content SDK** application built with **Next.js (Pages Router)** and **TypeScript**. AI agents work as developer assistants within this scaffolded head application. The app integrates with Sitecore XM Cloud for content, supports multisite and i18n, and uses Next.js API routes and Edge middleware for routing and SEO.

**Scope:** This file applies to **this application only** (a scaffolded head app). It is **not** the Content SDK monorepo — for SDK package development use that repo's `AGENTS.md`. Here we edit app code and config (pages, components, API routes, config); we do not modify SDK packages or CI.

## Application structure

```
src/
  pages/             # Next.js Pages Router
    [[...path]].tsx  # Catch-all Sitecore page (SSG or SSR)
    _app.tsx
    404.tsx, 500.tsx, _error.tsx
    api/             # API routes (sitemap, robots, editing, healthz)
  components/        # React components (Sitecore + app-specific)
  lib/               # sitecore-client, component-props
  Layout.tsx, Providers.tsx, Bootstrap.tsx, Scripts.tsx
proxy.ts             # Edge middleware (multisite, redirects, personalize)
.sitecore/           # component-map.ts, import-map.ts, sites.json, metadata.json
sitecore.config.ts   # Sitecore config (api, defaultSite, defaultLanguage, multisite, etc.)
next.config.js       # i18n (locales, defaultLocale), rewrites, images
```

**Component map:** `.sitecore/component-map.ts` is auto-generated from `src/components/` during `npm run dev` (watch) and `npm run build`. No manual action needed; the generator scans `src/components/` and creates entries for all Sitecore-registered components.
