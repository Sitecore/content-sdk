# AGENTS.md — AI Guidance for Sitecore Content SDK Next.js (App Router + Cache Components) App

## Project Overview

This is a **Sitecore Content SDK** application built with **Next.js (App Router)** and **TypeScript**, with **Next.js Cache Components** (`cacheComponents: true`) and **tag-based on-demand revalidation** wired in. AI agents work as developer assistants within this scaffolded head application. The app integrates with Sitecore XM Cloud for content, uses **file-based routing with `[site]` and `[locale]`**, next-intl for i18n, and Edge middleware for preview, multisite, redirects, and personalization.

**Scope:** This file applies to **this application only** (a scaffolded head app). It is **not** the Content SDK monorepo — for SDK package development use that repo's `AGENTS.md`. Here we edit app code and config (app router, components, API routes, cache helpers, i18n); we do not modify SDK packages or CI.

**How this template differs from `nextjs-app-router`:** This template enables **Cache Components** and ships **tag-aware data helpers** (`getSitecorePage`, `getSitecoreDictionary`, `getSitecoreErrorPage`) plus a single **`POST /api/revalidate`** route for on-demand cache invalidation. Use this template when you want deterministic tag-based revalidation; use `nextjs-app-router` when you don't need it.

---

## Quick Commands

```bash
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

**Environment:** Copy `.env.example` to `.env.local` and set Sitecore API endpoint, key, default site, language, and `SITECORE_REVALIDATE_SECRET` (used by `POST /api/revalidate`). Never commit `.env` or `.env.local`.

**Component maps:** `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client) are auto-generated from `src/components/` during `npm run dev` (watch) and `npm run build`. No manual action needed; the generator scans `src/components/` and creates entries in the appropriate map (Server vs Client based on `'use client'`).

---

## Application Structure (App Router + Cache Components)

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

---

## Key concepts for this app

These are the main head-app–specific concepts. Details are in the sections below.

### Cache Components and tag-based revalidation

- **`next.config.ts`** sets `cacheComponents: true`. This enables Next.js `use cache` and `cacheTag` so cached payloads can be invalidated by tag.
- **Cache helpers in `src/lib/cache/`** wrap the SDK client and attach Sitecore tags to each cached payload:
  - `getSitecorePage({ site, locale, path })` → page data with `sc:route:...` and `sc:item:...` tags. Personalization variants are isolated naturally by the URL path / Cache Components key.
  - `getSitecoreDictionary({ site, locale })` → dictionary phrases with a `sc:dict:...` tag.
  - `getSitecoreErrorPage({ site, locale, code })` → 404 / 500 Sitecore content with the same tag strategy as `getSitecorePage`.
- **`POST /api/revalidate`** is a single Sitecore-webhook endpoint. It accepts the Sitecore Experience Edge / Content Operations payload shape:
  - `updates[]` — Sitecore publish-event rows; the handler maps each row's `identifier` (with `-media` / `-layout` stripped) to `sc:item:<id>:<locale>:latest`.
  - `tags[]` — pass-through array. `sc:`-prefixed strings are revalidated verbatim (handy for ad-hoc, operational calls); bare item IDs are mapped to `sc:item:<id>:<defaultLocale>:latest`.
  - Dictionary tags from `sites` (`.sitecore/sites.json`, including the default site from `generateSites`) are merged on every call so dictionary changes are covered.
- **Auth (optional):** leave `SITECORE_REVALIDATE_SECRET` empty to skip auth (no `x-revalidate-secret` header). When set, callers must send the same value in `x-revalidate-secret` (configure that header on your Sitecore webhook).
- **Dictionary cache:** `sitecore.config.ts` disables the SDK's in-process dictionary cache (`dictionary: { caching: { enabled: false } }`). The Cache Components helper is the only dictionary cache layer, so `revalidateTag` works end to end.

### Middleware (Edge proxy)

- **Where:** `src/proxy.ts`. Next.js runs middleware from `middleware.ts` at root or in `src/` — if the app only has `proxy.ts`, add `src/middleware.ts` that re-exports it.
- **What it does:** Runs on each request (respecting the `matcher`). Chain order is **fixed:** PreviewProxy → BotTrackingProxy → LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy. PreviewProxy authorizes preview requests first; locale must run before multisite for App Router.
- **Config:** Uses `sitecore.config.ts` (multisite, redirects, personalize), `.sitecore/sites.json`, and `src/i18n/routing.ts` (locales). **Do not change proxy order.** Keep the matcher excluding API, `_next/`, sitemap, robots, and static assets so the proxy stays lightweight.

### SitecoreClient

- **Where:** Single shared instance in `src/lib/sitecore-client.ts` — `new SitecoreClient({ ...scConfig })` with config from `sitecore.config.ts`.
- **Use directly for:** preview and editing (`getPreview`, `getDesignLibraryData`, internal editing routes), 500 page (`client.getErrorPage(ErrorPage.InternalServerError)` in `global-error.tsx`), and `getAppRouterStaticParams`.
- **Use the cache helpers for everything else:** non-preview page reads go through `getSitecorePage`; dictionary reads through `getSitecoreDictionary`; 404 content through `getSitecoreErrorPage`. The cache helpers wrap the same client under `'use cache'` and attach the right tags.
- **Do not:** Create a second client or instantiate SitecoreClient elsewhere. Pass `site` and `locale` from route params (or `getCachedPageParams()` in the segment `not-found.tsx`, or `scConfig.defaultSite` / `scConfig.defaultLanguage` in the root `not-found.tsx`), not from global state.

### Catch-all route

- **Where:** `src/app/[site]/[locale]/[[...path]]/page.tsx`. This is the **only** page component that renders Sitecore content; the optional `[[...path]]` segment captures the content path.
- **Flow:** `params` is a Promise (Next.js 15+) — `await params` to get `{ site, locale, path? }`. When `draftMode().isEnabled`, use `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` from `searchParams` (preview is dynamic, not cached). Otherwise use `getSitecorePage({ site, locale, path: path ?? [] })`. Call `setRequestLocale(\`${site}_${locale}\`)` at the top of the page for next-intl.
- **`generateMetadata`** also goes through `getSitecorePage` so it shares the same cache entry as the page render.
- **Do not:** Add another catch-all or page at a different path for Sitecore pages; keep this single entry point.

### How locale works

- **In the URL:** All content routes are `/[site]/[locale]/...path` (e.g. `/default/en`, `/default/en/about`). Middleware (LocaleProxy, then AppRouterMultisiteProxy) rewrites incoming requests into this shape.
- **In the app:** next-intl uses a single `requestLocale` per request. This app encodes both site and locale as `requestLocale = \`${site}_${locale}\``. In the page, call `setRequestLocale(\`${site}_${locale}\`)` so next-intl and `src/i18n/request.ts` see it. In `request.ts`, parse `requestLocale` (e.g. `split('_')`) to get site and locale, then load the dictionary with `getSitecoreDictionary({ locale, site })`.
- **Config:** `src/i18n/routing.ts` defines `locales` and `defaultLocale`; align these with Sitecore languages (e.g. from `sitecore.config.ts`). **Do not** change the `{site}_{locale}` convention without updating request.ts and all pages that call `setRequestLocale`.

### More (component maps, editing, env)

- **Component maps:** `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client) — Lists every Sitecore component the layout can render, the maps are auto-generated from `src/components/`. Do not edit manually unless needed.
- **Editing/preview:** Use `draftMode()` in Server Components; when enabled, use `client.getPreview(searchParams)` or `client.getDesignLibraryData(searchParams)` **directly** (do not route preview through the cache helpers). Editing API routes live under `src/app/api/editing/`.
- **Env:** All config via environment variables in `sitecore.config.ts`. Document vars in `.env.example` (or `.env.remote.example` / `.env.container.example`); never commit `.env` or `.env.local`. `SITECORE_REVALIDATE_SECRET` is optional (see `.env.*.example` comments).

---

## Next.js App Router specifics

### Routing: `[site]` / `[locale]` / `[[...path]]`

- **URL shape:** `/[site]/[locale]/...path` (e.g. `/default/en`, `/default/en/about`). Site and locale are **in the path**; the Edge proxy rewrites incoming requests to this shape.
- **Page component:** `src/app/[site]/[locale]/[[...path]]/page.tsx`. Receives `params: Promise<{ site, locale, path? }>`. Use `await params`; in draft mode go through `client.getPreview` / `client.getDesignLibraryData`; otherwise call `getSitecorePage({ site, locale, path: path ?? [] })`.
- **Layout hierarchy:** `app/layout.tsx` → `app/[site]/layout.tsx` (per-site; runs Bootstrap with `siteName={site}` and `draftMode()`) → `app/[site]/[locale]/[[...path]]/layout.tsx` (calls `setCachedPageParams({ site, locale })` so segment `not-found.tsx` can resolve site/locale without `headers()`) → page. Do not put site/locale-specific data fetching in the root layout; use the `[site]` or segment layout.

### i18n (next-intl)

- **Config:** `src/i18n/routing.ts` — `defineRouting({ locales, defaultLocale, localePrefix })`. Align `locales` with Sitecore languages; often sourced from `sitecore.config.ts` (e.g. `defaultLanguage`).
- **Request config:** `src/i18n/request.ts` — `getRequestConfig` receives `requestLocale`. The app uses `{site}_{locale}` (e.g. set by `setRequestLocale(\`${site}_${locale}\`)` in the page). Parse with `requested?.split('_')` to get `parsedSite` and `parsedLocale`; load dictionary with `getSitecoreDictionary({ locale, site: parsedSite })` (Cache Components helper) and return `{ locale, messages }`.
- **In pages:** Call `setRequestLocale(\`${site}_${locale}\`)` at the top of the page so next-intl and request config see the correct locale.

### Multisite and Edge middleware (proxy)

- **Site list:** `.sitecore/sites.json` — typically generated by the Sitecore CLI or deployment. Used by middleware and API route handlers. Avoid hand-editing unless you know the format.
- **Edge middleware:** Implemented in **`src/proxy.ts`**. Next.js only runs middleware from a file named `middleware.ts` at root or in `src/`. If this app has only `proxy.ts`, add `src/middleware.ts` that re-exports it (e.g. `export { default } from './proxy';`) so the proxy runs.
- **Proxy chain (order is critical):** `defineProxy(preview, botTracking, locale, multisite, redirects, personalize).exec(req)`:
  - **PreviewProxy** — authorizes preview requests on the internal editing host; no-op elsewhere.
  - **BotTrackingProxy** — bot detection.
  - **LocaleProxy** — uses `sites` and `routing.locales` from `src/i18n/routing.ts`. Required for App Router so locale is set before multisite.
  - **AppRouterMultisiteProxy** — rewrites to `/[site]/[locale]/[...path]`; uses `scConfig.multisite`.
  - **RedirectsProxy** — redirects; uses `scConfig.redirects`, `scConfig.api.edge`, `scConfig.api.local`.
  - **PersonalizeProxy** — personalization; uses `scConfig.personalize`; often disabled in dev.
- **Matcher:** Exclude API routes (including `/api/revalidate`), `_next/`, sitemap, robots, healthz, Sitecore paths, and static assets so middleware does not run on every static request. The matcher is defined in `config` in `proxy.ts` (or in `middleware.ts` if it re-exports the proxy).
- **Config:** `sitecore.config.ts` → `multisite`, `redirects`, `personalize`; never commit secrets.

### Data fetching and preview

- **Page data:** In the page (or a Server Component), use `getSitecorePage({ site, locale, path: path ?? [] })` from `src/lib/cache/get-sitecore-page.ts`. For preview, use `draftMode()`; if `draft.isEnabled`, call `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` **directly on the SDK client** (preview must stay dynamic, not cached).
- **Dictionary:** Use `getSitecoreDictionary({ site, locale })` from `src/lib/cache/get-sitecore-dictionary.ts` (not `client.getDictionary` directly). This applies the `sc:dict:{site}:{locale}` tag so dictionary updates can be invalidated by webhook.
- **404 content:** Use `getSitecoreErrorPage({ site, locale, code: ErrorPage.NotFound })` from `src/lib/cache/get-sitecore-error-page.ts`. 500 content (in `global-error.tsx`) calls `client.getErrorPage(ErrorPage.InternalServerError, ...)` directly since `global-error.tsx` is a Client Component.
- **SSG:** `generateStaticParams` — use `client.getAppRouterStaticParams(sites, routing.locales)` (sites from `.sitecore/sites.json`). Return at least one default param when not generating full paths (e.g. dev or when `generateStaticPaths` is off).
- **Metadata:** `generateMetadata` in the same segment calls `getSitecorePage` so it hits the same cache entry as the page.

### On-demand revalidation (`POST /api/revalidate`)

- **Where:** `src/app/api/revalidate/route.ts`. Uses `createSitecoreRevalidateRouteHandler` from `@sitecore-content-sdk/nextjs/route-handler` — a single Sitecore-webhook endpoint.
- **Auth:** When `SITECORE_REVALIDATE_SECRET` is non-empty, callers must send the same value in `x-revalidate-secret`. When empty, revalidation works without that header.
- **Webhook payload (`updates[]`):** Send the Sitecore Experience Edge / Content Operations body (`updates`, `invocation_id`, `continues`). The handler maps each `identifier` (with `-media` / `-layout` stripped) to `sc:item:<id>:<locale>:latest` and revalidates it.
- **Ad-hoc invalidation (`tags[]`):** Reuse the same endpoint with `{ "tags": ["sc:route:...", "sc:item:..."] }` (`sc:`-prefixed strings are revalidated verbatim) or `{ "tags": ["<itemId>"] }` (bare item IDs are mapped to `sc:item:<id>:<defaultLocale>:latest`). Dictionary tags from `sites` are appended on **every** call.
- **Do not:** Bypass auth, expose the secret in client code, or call `revalidateTag` directly from components.

### Server vs Client components

- **Default:** Components are Server Components. Use `'use client'` only for interactivity (e.g. hooks, event handlers).
- **draftMode:** Used in layout and page; call `await draftMode()` in Server Components that need to know preview state.

### Not-found and error pages

This template ships **two** not-found components and a segment layout that ties them together while staying compatible with SSG and Cache Components:

- **Root not-found:** `src/app/not-found.tsx`. Used as the fallback when no segment handles the route (e.g. unknown site/locale). Falls back to `scConfig.defaultSite` / `scConfig.defaultLanguage` and calls `getSitecoreErrorPage({ site, locale, code: ErrorPage.NotFound })`, so 404 content gets the same Sitecore cache tags as a normal page.
- **Segment not-found:** `src/app/[site]/[locale]/[[...path]]/not-found.tsx`. Triggered when the catch-all page calls `notFound()` (e.g. the requested path resolves to no Sitecore page). Reads site/locale via `getCachedPageParams()` (set by the segment layout below) and calls `getSitecoreErrorPage(...)`. Wrapped in `NextIntlClientProvider` to keep i18n working in 404 markup.
- **Segment layout:** `src/app/[site]/[locale]/[[...path]]/layout.tsx`. Calls `setCachedPageParams({ site, locale })` on every request for this segment. This uses the SDK's React `cache()` based `set/getCachedPageParams` helpers (from `@sitecore-content-sdk/nextjs`) so the segment `not-found.tsx` can read `{ site, locale }` **without** calling `headers()` — which would opt the route out of SSG. **Do not** call `headers()` in the segment not-found; keep using `getCachedPageParams()`.
- **Root global error:** `src/app/global-error.tsx` is a Client Component (`'use client'`) that fetches `client.getErrorPage(ErrorPage.InternalServerError, ...)` on the client; it is not cached (the cache helpers are server-side).

### API route handlers

- **Sitemap:** `src/app/api/sitemap/route.ts` — `createSitemapRouteHandler({ client, sites })`. Export `{ GET }`; use `sites` from `.sitecore/sites.json`. With `cacheComponents: true`, the explicit `dynamic = 'force-dynamic'` is not needed (Next.js handles it automatically).
- **Robots:** `src/app/api/robots/route.ts` — `createRobotsRouteHandler({ client, sites })`. Same pattern.
- **Editing:** `src/app/api/editing/config/route.ts` and `editing/render/route.ts` — use `createEditingConfigRouteHandler` and `createEditingRenderRouteHandlers` with `components`, `clientComponents` (`.sitecore/component-map.client.ts`), `metadata`, and `client`.
- **Revalidate:** `src/app/api/revalidate/route.ts` — `createSitecoreRevalidateRouteHandler({ defaultLocale, sites })` with `sites` from `.sitecore/sites.json`. Export `{ POST }`.
- **Rewrites:** `next.config.ts` → rewrites for `/sitemap*.xml`, `/robots.txt` with `locale: false` so they are not localized.

### Sitecore client and config

- **Client:** `src/lib/sitecore-client.ts` — `new SitecoreClient({ ...scConfig })`. Used directly for editing/preview and indirectly (via cache helpers) for cached data.
- **Config:** `sitecore.config.ts` — `defineConfig({ api, defaultSite, defaultLanguage, editingSecret, dictionary: { caching: { enabled: false } }, redirects, multisite, personalize })`. The dictionary cache **must remain disabled** so `revalidateTag` invalidates dictionary data through the Cache Components layer only.

### Component maps and layout

- **Server/client components:** `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client) — Lists every Sitecore component the layout can render, the maps are auto-generated from `src/components/`. Do not edit manually unless needed.
- **Layout:** `Layout.tsx` renders page layout and placeholders; `Providers` wrap page and component context; `Bootstrap` in `[site]/layout.tsx` receives `siteName={site}` and preview state.

---

## Best practices

- **Quick checks:** If locale or dictionary is wrong, ensure `setRequestLocale(\`${site}_${locale}\`)` is called at the top of the page and `src/i18n/request.ts` parses `requestLocale` and calls `getSitecoreDictionary`. If a content change does not appear, verify the webhook posted to `POST /api/revalidate` with the right secret and check the tag families (`sc:route`, `sc:item`, `sc:dict`) returned by the cache helpers.
- **Security:** Use only environment variables in `sitecore.config.ts`; never hardcode API keys, editing secret, or `SITECORE_REVALIDATE_SECRET`. Do not expose secrets in client-side code or logs. Validate and sanitize user input at boundaries.
- **Performance:** Keep middleware lightweight; use the proxy `matcher` so it does not run on `/api/*`, `_next`, sitemap, robots, or static assets. Use Server Components for data fetching and the cache helpers under `'use cache'` so cached payloads carry the right tags. Use `generateStaticParams` and caching as in the existing page.
- **Sitecore patterns:** Use SDK field components (`<Text>`, `<RichText>`, `<Image>`) and validate field existence before render. Regenerate the component maps with `npm run sitecore-tools:generate-map` or `npm run sitecore-tools:generate-map:watch`; edit the maps manually only when the generator cannot handle the change. Use the cache helpers in `src/lib/cache/` for all non-preview Sitecore reads so tags stay consistent across the app.
- **Consistency:** Follow the existing patterns in `[site]/[locale]/[[...path]]/page.tsx`, `not-found.tsx`, `i18n/request.ts` (site_locale + `getSitecoreDictionary`), and API route handlers. When adding routes or rewrites, keep the middleware matcher and next-intl config in sync.

---

## DO & DON'T (app-level)

| DO | DON'T |
|----|-------|
| Use `params` as Promise and `await params` in pages and layouts | Use `params` synchronously (Next.js 15+) |
| Use the cache helpers in `src/lib/cache/` for non-preview reads | Call `client.getPage` / `client.getDictionary` directly in pages or i18n |
| Use `client.getPreview` / `client.getDesignLibraryData` for preview (uncached) | Wrap preview/draft data in `'use cache'` |
| Run PreviewProxy → BotTrackingProxy → LocaleProxy → … in middleware | Change proxy order (locale must run before multisite for App Router) |
| Call `setRequestLocale(\`${site}_${locale}\`)` in the page for next-intl | Omit setRequestLocale when adding new page branches |
| Document `SITECORE_REVALIDATE_SECRET` in `.env.*.example` only | Hardcode the revalidate secret or expose it client-side |
| Set `SITECORE_REVALIDATE_SECRET` and send `x-revalidate-secret` when you want the endpoint protected | Hardcode the revalidate secret or expose it client-side |
| Keep `sitecore.config.ts` dictionary cache disabled | Re-enable the SDK in-process dictionary cache (bypasses `revalidateTag`) |
| Use Server Components for async data fetching | Put async data fetching in client components when SSR is intended |
| Set site/locale via `setCachedPageParams` in `[site]/[locale]/[[...path]]/layout.tsx` and read with `getCachedPageParams()` in the segment `not-found.tsx` | Call `headers()` in not-found (opts out of SSG) or hardcode site/locale |
| Use createXRouteHandler and `.sitecore/sites.json` for sitemap/robots | Hardcode site list or commit `.env` |
| Use Sitecore field components and validate fields | Expose API keys or editing secret in client code |
| Document required env vars in `.env.example` only | Commit `.env` or `.env.local` |
| Run `npm run build` after changes to verify the app builds | Add npm dependencies without explicit user approval |

---

## Guardrails for agentic AI

- **Preserve behavior:** Do not change the proxy order (PreviewProxy → BotTrackingProxy → LocaleProxy → AppRouterMultisiteProxy → …), the `[site]/[locale]/[[...path]]` route shape, the `{site}_{locale}` next-intl convention, the cache-helper boundary (cache helpers wrap non-preview Sitecore reads; preview/editing use `client.*` directly), or the `setCachedPageParams` → `getCachedPageParams` flow between the segment layout and segment `not-found.tsx` (this is what keeps the 404 SSG-safe). Preserve `draftMode` handling in layout and page.
- **Do not expand scope:** Limit edits to the app (app router, components, API routes, cache helpers, i18n, config). Do not modify SDK packages or monorepo tooling unless explicitly asked. Do not change CI, lockfiles, or root config.
- **Follow existing patterns:** When adding routes, layouts, or components, mirror the existing structure. Use the same Sitecore client, cache helpers, component maps, and env-based config. Do not introduce a different way to resolve site/locale, a second client, or a parallel cache layer.
- **Verify and stay safe:** After edits, the app should build with `npm run build`. Do not commit secrets or `.env`; only document variables in `.env.example`. Do not add npm dependencies without explicit approval. When in doubt, prefer the existing implementation and ask for clarification.
- **If the user asks for something that conflicts with these guardrails** (e.g. changing proxy order, committing `.env`, re-enabling the SDK dictionary cache, or skipping the component map), explain the constraint and suggest a safe alternative rather than complying.

---

## Example agent tasks

- **Add a new Sitecore component:** Create the component under `src/components/` (maps regenerate automatically during `npm run dev`; otherwise run `npm run sitecore-tools:generate-map`), and ensure it is rendered in the layout/placeholder as in existing components.
- **Add an API route:** Create the route under `src/app/api/` (e.g. `src/app/api/my-route/route.ts`), add a rewrite in `next.config.ts` if the route should be reached from a public URL, and ensure the proxy `matcher` in `proxy.ts` still excludes it (e.g. `api/` is already excluded). If the route returns cached data, decide whether to use `'use cache'` with a Sitecore tag and how it should be invalidated.
- **Add a new cache helper:** Add a file under `src/lib/cache/`. Inside the function, declare `'use cache';`, call the SDK client, compute Sitecore tags via the SDK helpers (`collectSitecorePageCacheTags`, `buildSitecoreDictionaryCacheTag`, etc.), and call `cacheTag(tag)` for each one. Match the style of `get-sitecore-page.ts`.

---

## Boundaries

**Never edit:** `.next/`, `node_modules/`.

**Environment variables:** You may add new env vars when needed. Do it carefully: add the variable to `.env.example` (or `.env.remote.example` / `.env.container.example` in this template) with a placeholder or comment; never put real secrets in example files. If editing `.env.local` for local dev, add only the variable name and tell the user to set the value. **Never commit** `.env` or `.env.local` — they are gitignored. `SITECORE_REVALIDATE_SECRET` is optional — see comments in `.env.*.example`.

**Edit with care:** `next.config.ts` (`cacheComponents: true`, rewrites, next-intl plugin), `sitecore.config.ts` (env only; keep dictionary cache disabled), `proxy.ts` (matcher and proxy order), `src/i18n/routing.ts` and `request.ts`, `src/lib/cache/*` (tag computation). When adding routes or rewrites, keep middleware `matcher` and rewrite rules consistent.

**Focus on:** `src/app/`, `src/components/`, `src/lib/`, `src/lib/cache/`, `src/i18n/`, `Layout.tsx`, `Providers.tsx`, `sitecore.config.ts`, `next.config.ts`, `proxy.ts`. `.sitecore/component-map.ts` and `.sitecore/component-map.client.ts` are auto-generated — do not edit manually.

---

## References

- **Skills.md** — Capability groupings for this app; [.agents/skills/](.agents/skills/) provides each capability as an Agent Skill (when-to-use, hard rules, stop conditions) for tools that support the [Agent Skills](https://agentskills.io) standard.
- **CLAUDE.md** — Full coding standards and Sitecore patterns for this template.
- **.cursor/rules/** — App Router and Sitecore rules.
- [Sitecore Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html) — Official docs.
- [Next.js App Router](https://nextjs.org/docs/app) — Routing, Server Components, data fetching.
- [Next.js Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) — `use cache`, `cacheTag`, `revalidateTag`.
- [next-intl](https://next-intl.dev/docs) — i18n routing and request config.

**For head applications / empty starters:** If you use this template for your head application (e.g. App Router + Cache Components starter), keep this AGENTS.md as that head application's guide. Do not replace it with the Content SDK monorepo root AGENTS.md — that file describes the SDK source tree, not the head application. Adjust only what is specific to your project (e.g. custom layout or workflow). See the Content SDK README "AI Development Support" section for more on which AGENTS.md to use.

---

**Remember:** When in doubt, follow existing patterns in this app and refer to `CLAUDE.md` and `.cursor/rules/` for Sitecore and code standards.
