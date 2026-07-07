# Project overview (App Router)

This is a **Sitecore Content SDK** application built with **Next.js (App Router)** and **TypeScript**. AI agents work as developer assistants within this scaffolded head application. The app integrates with Sitecore XM Cloud for content, uses **file-based routing with `[site]` and `[locale]`**, next-intl for i18n, and Edge middleware for multisite, redirects, and personalization.

**Scope:** This file applies to **this application only** (a scaffolded head app). It is **not** the Content SDK monorepo — for SDK package development use that repo's `AGENTS.md`. Here we edit app code and config (app router, components, API routes, i18n); we do not modify SDK packages or CI.

## Application structure

```
src/
  app/                           # Next.js App Router
    layout.tsx                    # Root layout
    [site]/                       # Site segment (multisite)
      layout.tsx                  # Site layout (Bootstrap, draftMode)
      [locale]/                   # Locale segment (i18n)
        [[...path]]/
          page.tsx                # Sitecore page
          not-found.tsx           # 404 with Sitecore error page
    not-found.tsx                 # Root not-found
    api/                          # Route handlers
      sitemap/route.ts, robots/route.ts, editing/config/route.ts, editing/render/route.ts
  components/                    # React components (Sitecore + app-specific)
  lib/                           # sitecore-client, component-props
  i18n/                          # next-intl
    routing.ts                    # locales, defaultLocale, localePrefix
    request.ts                    # getRequestConfig, getDictionary per site
  Layout.tsx, Providers.tsx, Bootstrap.tsx, Scripts.tsx
proxy.ts                         # Edge middleware (locale, multisite, redirects, personalize)
.sitecore/                       # component-map.ts, component-map.client.ts, import-map.*, sites.json, metadata.json
sitecore.config.ts               # Sitecore config (api, defaultSite, defaultLanguage, multisite, etc.)
next.config.ts                   # next-intl plugin, rewrites, images
```

**Component maps:** `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client) are auto-generated from `src/components/` during `npm run dev` (watch) and `npm run build`. No manual action needed; the generator scans `src/components/` and creates entries in the appropriate map (Server vs Client based on `'use client'`).
