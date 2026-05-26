---
name: content-sdk-route-configuration
description: Configures routing and layout for App Router + Cache Components. Single catch-all at src/app/[site]/[locale]/[[...path]]/page.tsx; call setRequestLocale at top of page; use getSitecorePage for cached reads and root not-found.tsx for 404 (getSitecoreErrorPage). Use when changing routing, placeholders, or Layout.
---

# Content SDK Route Configuration (App Router + Cache Components)

Single catch-all route and layout hierarchy. Site and locale are **in the path**; proxy rewrites incoming requests to /[site]/[locale]/...path. The catch-all page uses the cache helper `getSitecorePage` for non-preview reads.

## When to Use

- User asks to change routing, add a route, or fix 404/not-found behavior.
- Task involves catch-all route, placeholders, root layout, or Layout.tsx.
- User mentions "[site]," "[locale]," "[[...path]]," "placeholder," or "layout hierarchy."

## How to perform

- Single Sitecore page: `src/app/[site]/[locale]/[[...path]]/page.tsx`. Use `await params` for `{ site, locale, path? }`; if `draftMode().isEnabled` use the client directly, otherwise call `getSitecorePage({ site, locale, path: path ?? [] })`. Call `setRequestLocale(\`${site}_${locale}\`)` at the top. Layout: app/layout.tsx → app/[site]/layout.tsx (Bootstrap, draftMode) → page. Root not-found: `src/app/not-found.tsx` calls `getSitecoreErrorPage`.

## Hard Rules

- **Single Sitecore page:** `src/app/[site]/[locale]/[[...path]]/page.tsx`. This is the **only** page that renders Sitecore content. Do not add another page or catch-all for Sitecore content.
- **Params:** Next.js 15+ — `params` is a Promise. Use `await params` to get `{ site, locale, path? }`. Pass `site`, `locale`, and `path ?? []` to `getSitecorePage`.
- **Data fetching:** In draft mode use `client.getPreview` / `client.getDesignLibraryData` directly; otherwise use `getSitecorePage` (cached, tag-aware). Both branches return the same `Page | null` shape; render the `Layout` from the returned page.
- **Locale for next-intl:** Call `setRequestLocale(\`${site}_${locale}\`)` at the **top** of the page so next-intl and `src/i18n/request.ts` see the correct locale. Do not omit when adding new page branches.
- **`generateMetadata`** in the same segment should also call `getSitecorePage` so it shares the cache entry with the page render — avoid duplicate fetches.
- **Layout hierarchy:** `app/layout.tsx` → `app/[site]/layout.tsx` (Bootstrap with `siteName={site}` and `draftMode()`) → page. Do not put site/locale-specific data fetching in the root layout.
- Placeholders are rendered by the layout (e.g. Placeholder component); do not change placeholder names or structure without aligning with Sitecore layout definition.
- **Not-found (404):** `src/app/not-found.tsx` (root). Resolve `{ site, locale }` (e.g. via `parseRewriteHeader` or sensible defaults) and call `getSitecoreErrorPage({ site, locale, code: ErrorPage.NotFound })` so the 404 content participates in the same tag-based revalidation as normal pages. There is no segment-level `not-found.tsx` in this template.
- **Server error (500):** `src/app/global-error.tsx` is a Client Component (`'use client'`) and calls `client.getErrorPage(ErrorPage.InternalServerError, …)` from the client side; it is not cached.

## Stop Conditions

- Stop if the user wants to add a second catch-all or a different URL shape for Sitecore pages; explain single-entry-point constraint.
- Stop if changing proxy/middleware order; order is fixed (PreviewProxy → BotTrackingProxy → LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy).
- Stop if the user wants to add per-segment `not-found.tsx` files that fetch directly via the client; prefer the root not-found using `getSitecoreErrorPage`.
- Do not move or rename the catch-all file without updating all references.

## References

- [AGENTS.md](../../../AGENTS.md) for exact paths, params, and layout hierarchy.
- content-sdk-graphql-data-fetching for which helper / API to call.
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
