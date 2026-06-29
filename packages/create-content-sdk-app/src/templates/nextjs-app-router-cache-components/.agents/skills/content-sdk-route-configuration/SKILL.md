---
name: content-sdk-route-configuration
description: Configures routing and layout for App Router + Cache Components. Single catch-all at src/app/[site]/[locale]/[[...path]]/page.tsx; call setRequestLocale at top of page; use getSitecorePage for cached reads; segment not-found.tsx reads getCachedPageParams() (set by the segment layout) and calls getSitecoreErrorPage to keep 404 SSG-safe. Use when changing routing, placeholders, or Layout.
---

# Content SDK Route Configuration (App Router + Cache Components)

Single catch-all route and layout hierarchy. Site and locale are **in the path**; proxy rewrites incoming requests to /[site]/[locale]/...path. The catch-all page uses the cache helper `getSitecorePage` for non-preview reads. The segment under `[[...path]]` also ships its own `layout.tsx` and `not-found.tsx` that share site/locale via the SDK's React-`cache()` based `set/getCachedPageParams` helpers, so the 404 path stays compatible with SSG (it never calls `headers()`).

## When to Use

- User asks to change routing, add a route, or fix 404/not-found behavior.
- Task involves catch-all route, placeholders, root layout, segment layout, or Layout.tsx.
- User mentions "[site]," "[locale]," "[[...path]]," "placeholder," "layout hierarchy," "setCachedPageParams," or "getCachedPageParams."

## How to perform

- Single Sitecore page: `src/app/[site]/[locale]/[[...path]]/page.tsx`. Use `await params` for `{ site, locale, path? }`; if `isBuildValidationSite(site)` skip Edge (`setCachedPageParams`, `notFound()`); else if `draftMode().isEnabled` use the client directly; otherwise call `getSitecorePage({ site, locale, path: path ?? [] })`. Call `setCachedPageParams` before each `notFound()` on real routes. Layout chain: `app/layout.tsx` → `app/[site]/layout.tsx` (Bootstrap, draftMode) → `app/[site]/[locale]/[[...path]]/layout.tsx` (calls `setCachedPageParams({ site, locale })`) → page. Segment not-found: reads `getCachedPageParams()`; static HTML when site is empty or `isBuildValidationSite` matches site **or** locale; else `getSitecoreErrorPage`. Root not-found: `src/app/not-found.tsx` uses `scConfig.defaultSite` / `scConfig.defaultLanguage`.

## Hard Rules

- **Single Sitecore page:** `src/app/[site]/[locale]/[[...path]]/page.tsx`. This is the **only** page that renders Sitecore content. Do not add another page or catch-all for Sitecore content.
- **Params:** Next.js 15+ — `params` is a Promise. Use `await params` to get `{ site, locale, path? }`. Pass `site`, `locale`, and `path ?? []` to `getSitecorePage`.
- **Data fetching:** In draft mode use `client.getPreview` / `client.getDesignLibraryData` directly; otherwise use `getSitecorePage` (cached, tag-aware). Both branches return the same `Page | null` shape; render the `Layout` from the returned page.
- **Locale for next-intl:** Call `setRequestLocale(\`${site}_${locale}\`)` at the **top** of the page so next-intl and `src/i18n/request.ts` see the correct locale. Do not omit when adding new page branches.
- **`generateMetadata`** in the same segment should mirror the page's `draftMode` branching (preview → `client.getPreview` / `client.getDesignLibraryData`; otherwise `getSitecorePage`) so the `<title>` matches the rendered body and shares the same cache entry in the non-draft path.
- **Layout hierarchy:** `app/layout.tsx` → `app/[site]/layout.tsx` (Bootstrap with `siteName={site}` and `draftMode()`) → `app/[site]/[locale]/[[...path]]/layout.tsx` (calls `setCachedPageParams({ site, locale })`) → page. Do not put site/locale-specific data fetching in the root layout. **Keep the segment layout's `setCachedPageParams` call** — the segment `not-found.tsx` depends on it.
- Placeholders are rendered by the layout (e.g. Placeholder component); do not change placeholder names or structure without aligning with Sitecore layout definition.
- **Segment not-found (404):** `src/app/[site]/[locale]/[[...path]]/not-found.tsx`. Reads `{ site, locale }` via `getCachedPageParams()` (set by the segment layout and by the page before `notFound()`), with `scConfig.defaultSite` / `scConfig.defaultLanguage` as fallback. If `!resolvedSite?.trim()` or `isBuildValidationSite(resolvedSite)` or `isBuildValidationSite(resolvedLocale)` (`_DEFAULT_`), return static fallback HTML without Edge. Otherwise call `getSitecoreErrorPage({ site, locale, code: ErrorPage.NotFound })`. Wrap Sitecore 404 layout in `NextIntlClientProvider`. **Do not** call `headers()` here.
- **Root not-found (fallback 404):** `src/app/not-found.tsx`. Used when no segment claims the request (e.g. an unknown top-level path). Resolves site/locale from `scConfig.defaultSite` / `scConfig.defaultLanguage` and calls `getSitecoreErrorPage(...)` so 404 content gets the same Sitecore cache tags (`sc:route`, `sc:item`) as a normal page and can be invalidated by webhook.
- **Server error (500):** `src/app/global-error.tsx` is a Client Component (`'use client'`) and calls `client.getErrorPage(ErrorPage.InternalServerError, …)` from the client side. It is **not** cached — the cache helpers are server-only.

## Stop Conditions

- Stop if the user wants to add a second catch-all or a different URL shape for Sitecore pages; explain single-entry-point constraint.
- Stop if changing proxy/middleware order; order is fixed (PreviewProxy → BotTrackingProxy → LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy).
- Stop if the user wants to read site/locale in `not-found.tsx` via `headers()` (or any other dynamic API). It opts the catch-all out of SSG and undoes the Cache Components benefit; keep using `getCachedPageParams()` set by the segment layout.
- Stop if the user wants to remove the segment `layout.tsx` (`setCachedPageParams`) without also rewiring the segment `not-found.tsx`; the two are paired.
- Do not move or rename the catch-all file without updating all references.

## References

- [AGENTS.md](../../../AGENTS.md) for exact paths, params, and layout hierarchy.
- content-sdk-graphql-data-fetching for which helper / API to call.
- content-sdk-cache-components-and-osr for why `getCachedPageParams` matters (SSG + Cache Components).
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
