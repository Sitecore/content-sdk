---
name: content-sdk-route-configuration
description: Configures routing and layout for App Router. Single catch-all at src/app/[site]/[locale]/[[...path]]/page.tsx; call setRequestLocale at top of page. Use when changing routing, placeholders, or Layout.
---

# Content SDK Route Configuration (App Router)

Single catch-all route and layout hierarchy. Site and locale are **in the path**; proxy rewrites incoming requests to /[site]/[locale]/...path.

## When to Use

- User asks to change routing, add a route, or fix 404/not-found behavior.
- Task involves catch-all route, placeholders, root layout, or Layout.tsx.
- User mentions "[site]," "[locale]," "[[...path]]," "placeholder," or "layout hierarchy."

## How to perform

- Single Sitecore page: `src/app/[site]/[locale]/[[...path]]/page.tsx`. Use `await params` for `{ site, locale, path? }`; pass to getPage and call `setRequestLocale(\`${site}_${locale}\`)` at the top. Layout: app/layout.tsx → app/[site]/layout.tsx (Bootstrap, draftMode) → page. Not-found: use getCachedPageParams and getErrorPage in the route's not-found.tsx.

## Hard Rules

- **Single Sitecore page:** `src/app/[site]/[locale]/[[...path]]/page.tsx`. This is the **only** page that renders Sitecore content. Do not add another page or catch-all for Sitecore content.
- **Params:** Next.js 15+ — `params` is a Promise. Use `await params` to get `{ site, locale, path? }`. Pass `site` and `locale` to `client.getPage(path ?? [], { site, locale })`.
- **Locale for next-intl:** Call `setRequestLocale(\`${site}_${locale}\`)` at the **top** of the page so next-intl and `src/i18n/request.ts` see the correct locale. Do not omit when adding new page branches.
- **Layout hierarchy:** `app/layout.tsx` → `app/[site]/layout.tsx` (Bootstrap with `siteName={site}` and `draftMode()`) → page. Do not put site/locale-specific data fetching in the root layout.
- Placeholders are rendered by the layout (e.g. Placeholder component); do not change placeholder names or structure without aligning with Sitecore layout definition.
- **Not-found:** `src/app/[site]/[locale]/[[...path]]/not-found.tsx`. For Sitecore-driven 404 use `getCachedPageParams()` from `@sitecore-content-sdk/nextjs` for site/locale, then `client.getErrorPage(ErrorPage.NotFound, { site, locale })`.

## Stop Conditions

- Stop if the user wants to add a second catch-all or a different URL shape for Sitecore pages; explain single-entry-point constraint.
- Stop if changing proxy/middleware order; order is fixed (LocaleProxy → AppRouterMultisiteProxy → RedirectsProxy → PersonalizeProxy).
- Do not move or rename the catch-all file without updating all references.

## References

- [AGENTS.md](../../../AGENTS.md) for exact paths, params, and layout hierarchy.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
