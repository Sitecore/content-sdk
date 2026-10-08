# Project overview (App Router + Cache Components)

This is a **Sitecore Content SDK** application built with **Next.js (App Router)** and **TypeScript**, with **Next.js Cache Components** (`cacheComponents: true`) and **tag-based on-demand revalidation** wired in. AI agents work as developer assistants within this scaffolded head application. The app integrates with Sitecore XM Cloud for content, uses **file-based routing with `[site]` and `[locale]`**, next-intl for i18n, and Edge middleware for preview, multisite, redirects, and personalization.

**Scope:** This file applies to **this application only** (a scaffolded head app). It is **not** the Content SDK monorepo — for SDK package development use that repo's `AGENTS.md`. Here we edit app code and config (app router, components, API routes, cache helpers, i18n); we do not modify SDK packages or CI.

**How this template differs from `nextjs-app-router`:** This template enables **Cache Components** and ships **tag-aware data helpers** (`getSitecorePage`, `getSitecoreDictionary`, `getSitecoreErrorPage`) plus a single **`POST /api/revalidate`** route for on-demand cache invalidation. Use this template when you want deterministic tag-based revalidation; use `nextjs-app-router` when you don't need it.

## Application structure

```
src/
  app/                           # Next.js App Router
    layout.tsx                    # Root layout
    not-found.tsx                 # Root 404 (uses getSitecoreErrorPage with scConfig defaults)
    global-error.tsx              # Root 500 (uses client.getErrorPage; Client Component)
    [site]/                       # Site segment (multisite)
      layout.tsx                  # Site layout (Bootstrap, draftMode)
      [locale]/                   # Locale segment (i18n)
        [[...path]]/
          layout.tsx              # Segment layout: setCachedPageParams({ site, locale }) (SSG-safe)
          page.tsx                # Sitecore page (uses getSitecorePage)
          not-found.tsx           # Segment 404: getCachedPageParams() + getSitecoreErrorPage
    api/                          # Route handlers
      sitemap/route.ts, robots/route.ts
      editing/config/route.ts, editing/render/route.ts
      revalidate/route.ts         # POST /api/revalidate (OSR)
  components/                    # React components (Sitecore + app-specific)
  lib/
    sitecore-client.ts            # Single SitecoreClient instance
    cache/                        # Tag-aware data helpers (this template)
      get-sitecore-page.ts        # `use cache` + sc:route/sc:item tags
      get-sitecore-dictionary.ts  # `use cache` + sc:dict tag
      get-sitecore-error-page.ts  # `use cache` + tags for 404 / 500 content
  i18n/                          # next-intl
    routing.ts                    # locales, defaultLocale, localePrefix
    request.ts                    # getRequestConfig, getSitecoreDictionary per site
  Layout.tsx, Providers.tsx, Bootstrap.tsx, Scripts.tsx
proxy.ts                         # Edge middleware (preview, bot-tracking, locale, multisite, redirects, personalize)
.sitecore/                       # component-map.ts, component-map.client.ts, import-map.*, sites.json, metadata.json
sitecore.config.ts               # Sitecore config (api, defaultSite, defaultLanguage, dictionary cache off)
next.config.ts                   # cacheComponents: true, next-intl plugin, rewrites, images
```

**Component maps:** `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client) are auto-generated from `src/components/` during `npm run dev` (watch) and `npm run build`. No manual action needed; the generator scans `src/components/` and creates entries in the appropriate map (Server vs Client based on `'use client'`).
