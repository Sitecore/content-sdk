# Key concepts (App Router)

Optional, on-demand detail. The compact guide is [AGENTS.md](../../AGENTS.md).

## Middleware (Edge proxy)

- **Where:** `src/proxy.ts`. Next.js runs middleware from `middleware.ts` at root or in `src/` — if the app only has `proxy.ts`, add `src/middleware.ts` that re-exports it.
- **What it does:** Runs on each request (respecting the `matcher`). Chain order is **fixed:** PreviewProxy → BotTrackingProxy → LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy. PreviewProxy authorizes preview requests first; locale must run before multisite for App Router.
- **Config:** Uses `sitecore.config.ts` (multisite, redirects, personalize), `.sitecore/sites.json`, and `src/i18n/routing.ts` (locales). **Do not change proxy order.** Keep the matcher excluding API, `_next/`, sitemap, robots, and static assets so the proxy stays lightweight.

## SitecoreClient

- **Where:** Single shared instance in `src/lib/sitecore-client.ts` — `new SitecoreClient({ ...scConfig })` with config from `sitecore.config.ts`.
- **Use for:** `getPage`, `getDictionary`, `getErrorPage`, `getPreview`, `getDesignLibraryData`, `getAppRouterStaticParams`. All Sitecore data fetching in the app goes through this client.
- **Do not:** Create a second client or instantiate SitecoreClient elsewhere. Pass `site` and `locale` from route params (or `getCachedPageParams()` in segment `not-found.tsx`), not from global state.

## Catch-all route

- **Where:** `src/app/[site]/[locale]/[[...path]]/page.tsx`. This is the **only** page component that renders Sitecore content; the optional `[[...path]]` segment captures the content path.
- **Flow:** `params` is a Promise (Next.js 15+) — `await params` to get `{ site, locale, path? }`. Call `setRequestLocale(\`${site}_${locale}\`)` at the top of the page for next-intl. For published content use `client.getPage(path ?? [], { site, locale })`. For preview, use `draftMode()`; when enabled, `const previewData = client.getPreviewData(await headers())`, then `client.getPreview(previewData)` or `client.getDesignLibraryData(previewData)`.
- **Do not:** Add another catch-all or page at a different path for Sitecore pages; keep this single entry point.

## How locale works

- **In the URL:** All content routes are `/[site]/[locale]/...path` (e.g. `/default/en`, `/default/en/about`). Middleware (LocaleProxy, then AppRouterMultisiteProxy) rewrites incoming requests into this shape.
- **In the app:** next-intl uses a single `requestLocale` per request. This app encodes both site and locale as `requestLocale = \`${site}_${locale}\``. In the page, call `setRequestLocale(\`${site}_${locale}\`)` so next-intl and `src/i18n/request.ts` see it. In `request.ts`, parse `requestLocale` (e.g. `split('_')`) to get site and locale, then load the dictionary with `client.getDictionary({ locale, site })`.
- **Config:** `src/i18n/routing.ts` defines `locales` and `defaultLocale`; align these with Sitecore languages (e.g. from `sitecore.config.ts`). **Do not** change the `{site}_{locale}` convention without updating request.ts and all pages that call `setRequestLocale`.

## Component maps, editing, env

- **Component maps:** `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client) — auto-generated from `src/components/` during `npm run dev` (watch) and `npm run build` (Server vs Client based on `'use client'`). Do not edit manually unless needed.
- **Editing/preview:** Use `draftMode()` in Server Components; when enabled, use `client.getPreviewData(headers)` then `client.getPreview(previewData)` or `client.getDesignLibraryData(previewData)`. Editing API routes live under `src/app/api/editing/`.
- **Env:** All config via environment variables in `sitecore.config.ts`. Document vars in `.env.example` (or `.env.remote.example` / `.env.container.example`); never commit `.env` or `.env.local`.
