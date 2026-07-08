# Key concepts (App Router + Cache Components)

Optional, on-demand detail. The compact guide is [AGENTS.md](../../AGENTS.md).

## Cache Components and tag-based revalidation

- **`next.config.ts`** sets `cacheComponents: true`. This enables Next.js `use cache` and `cacheTag` so cached payloads can be invalidated by tag.
- **Cache helpers in `src/lib/cache/`** wrap the SDK client and attach Sitecore tags to each cached payload:
  - `getSitecorePage({ site, locale, path })` → page data with `sc:route:...` and `sc:item:...` tags. Personalization variants are isolated naturally by the URL path / Cache Components key.
  - `getSitecoreDictionary({ site, locale })` → dictionary phrases with a `sc:dict:...` tag.
  - `getSitecoreErrorPage({ site, locale, code })` → 404 / 500 Sitecore content with the same tag strategy as `getSitecorePage`.
- **`POST /api/revalidate`** is a single Sitecore-webhook endpoint. It accepts the Sitecore Experience Edge / Content Operations payload shape:
  - `updates[]` — Sitecore publish-event rows; the handler maps each row's `identifier` (with `-media` / `-layout` stripped) to `sc:item:<id>:<locale>:latest`.
  - `tags[]` — pass-through array. `sc:`-prefixed strings are revalidated verbatim (handy for ad-hoc, operational calls); bare item IDs are mapped to `sc:item:<id>:<defaultLocale>:latest`.
  - Dictionary tags from `sites` (`.sitecore/sites.json`; configured `defaultSite` from `generateSites` only when `NEXT_PUBLIC_DEFAULT_SITE_NAME` is set) are merged on every call so dictionary changes are covered.
- **Auth (optional):** leave `SITECORE_REVALIDATE_SECRET` empty to skip auth (no `x-revalidate-secret` header). When set, callers must send the same value in `x-revalidate-secret` (configure that header on your Sitecore webhook).
- **Dictionary cache:** `sitecore.config.ts` disables the SDK's in-process dictionary cache (`dictionary: { caching: { enabled: false } }`). The Cache Components helper is the only dictionary cache layer, so `revalidateTag` works end to end.

## Middleware (Edge proxy)

- **Where:** `src/proxy.ts`. Next.js runs middleware from `middleware.ts` at root or in `src/` — if the app only has `proxy.ts`, add `src/middleware.ts` that re-exports it.
- **What it does:** Runs on each request (respecting the `matcher`). Chain order is **fixed:** PreviewProxy → BotTrackingProxy → LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy. PreviewProxy authorizes preview requests first; locale must run before multisite for App Router.
- **Config:** Uses `sitecore.config.ts` (multisite, redirects, personalize), `.sitecore/sites.json`, and `src/i18n/routing.ts` (locales). **Do not change proxy order.** Keep the matcher excluding API, `_next/`, sitemap, robots, and static assets so the proxy stays lightweight.

## SitecoreClient

- **Where:** Single shared instance in `src/lib/sitecore-client.ts` — `new SitecoreClient({ ...scConfig })` with config from `sitecore.config.ts`.
- **Use directly for:** preview and editing (`getPreview`, `getDesignLibraryData`, internal editing routes), 500 page (`client.getErrorPage(ErrorPage.InternalServerError)` in `global-error.tsx`), and `getAppRouterStaticParams` when `generateStaticPaths` is true.
- **Build validation:** when `generateStaticPaths` is false, `generateStaticParams` returns `BUILD_VALIDATION_SITE` (`_DEFAULT_` from `src/lib/sitecore-build-validation.ts`); the page and `generateMetadata` skip Edge for that site; segment `not-found.tsx` skips Edge when site is `_DEFAULT_`. See SSG rules under [AGENTS-router-specifics.md](AGENTS-router-specifics.md#data-fetching-and-preview).
- **Use the cache helpers for everything else:** non-preview page reads go through `getSitecorePage`; dictionary reads through `getSitecoreDictionary`; 404 content through `getSitecoreErrorPage`. The cache helpers wrap the same client under `'use cache'` and attach the right tags.
- **Do not:** Create a second client or instantiate SitecoreClient elsewhere. Pass `site` and `locale` from route params (or `getCachedPageParams()` in the segment `not-found.tsx`, or `scConfig.defaultSite` / `scConfig.defaultLanguage` in the root `not-found.tsx`), not from global state.

## Catch-all route

- **Where:** `src/app/[site]/[locale]/[[...path]]/page.tsx`. This is the **only** page component that renders Sitecore content; the optional `[[...path]]` segment captures the content path.
- **Flow:** `params` is a Promise (Next.js 15+) — `await params` to get `{ site, locale, path? }`. When `draftMode().isEnabled`, use `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` from `searchParams` (preview is dynamic, not cached). Otherwise use `getSitecorePage({ site, locale, path: path ?? [] })`. Call `setRequestLocale(\`${site}_${locale}\`)` at the top of the page for next-intl.
- **`generateMetadata`** also goes through `getSitecorePage` so it shares the same cache entry as the page render.
- **Do not:** Add another catch-all or page at a different path for Sitecore pages; keep this single entry point.

## How locale works

- **In the URL:** All content routes are `/[site]/[locale]/...path` (e.g. `/default/en`, `/default/en/about`). Middleware (LocaleProxy, then AppRouterMultisiteProxy) rewrites incoming requests into this shape.
- **In the app:** next-intl uses a single `requestLocale` per request. This app encodes both site and locale as `requestLocale = \`${site}_${locale}\``. In the page, call `setRequestLocale(\`${site}_${locale}\`)` so next-intl and `src/i18n/request.ts` see it. In `request.ts`, parse `requestLocale` (e.g. `split('_')`) to get site and locale, then load the dictionary with `getSitecoreDictionary({ locale, site })`.
- **Config:** `src/i18n/routing.ts` defines `locales` and `defaultLocale`; align these with Sitecore languages (e.g. from `sitecore.config.ts`). **Do not** change the `{site}_{locale}` convention without updating request.ts and all pages that call `setRequestLocale`.

## Component maps, editing, env

- **Component maps:** `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client) — auto-generated from `src/components/`. Do not edit manually unless needed.
- **Editing/preview:** Use `draftMode()` in Server Components; when enabled, use `client.getPreview(searchParams)` or `client.getDesignLibraryData(searchParams)` **directly** (do not route preview through the cache helpers). Editing API routes live under `src/app/api/editing/`.
- **Env:** All config via environment variables in `sitecore.config.ts`. Document vars in `.env.example` (or `.env.remote.example` / `.env.container.example`); never commit `.env` or `.env.local`. `SITECORE_REVALIDATE_SECRET` is optional (see `.env.*.example` comments).
