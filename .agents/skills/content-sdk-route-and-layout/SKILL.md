---
name: content-sdk-route-and-layout
description: Configures routing (catch-all, site/locale segments) and layout (root layout, placeholders, Layout.tsx). Use when changing how pages are routed, how placeholders are rendered, or when the user mentions catch-all, [[...path]], placeholders, or Layout.
---

# Content SDK Route and Layout

Single catch-all route and layout hierarchy; App Router uses [site]/[locale]/[[...path]]; Pages Router uses [[...path]] and middleware for site.

## When to Use

- User asks to change routing, add a route, or fix 404/not-found behavior.
- Task involves catch-all route, placeholders, root layout, or Layout.tsx.
- User mentions "[site]," "[locale]," "[[...path]]," "placeholder," or "layout hierarchy."

## Hard Rules

- **App Router:** Single Sitecore page at `src/app/[site]/[locale]/[[...path]]/page.tsx`. All Sitecore content routes are /[site]/[locale]/...path. Do not add another page or catch-all for Sitecore content. Layout: app/layout.tsx → app/[site]/layout.tsx (Bootstrap, draftMode) → page. Call setRequestLocale(`${site}_${locale}`) at top of page for next-intl.
- **Pages Router:** Single catch-all at `src/pages/[[...path]].tsx`; no [site] or [locale] in path; site resolved by middleware, locale from context.locale. Do not add another page for Sitecore content. Layout and page data flow from this page (e.g. getStaticProps/getServerSideProps) to _app and Layout.
- Placeholders are rendered by the layout (e.g. Placeholder component); do not change placeholder names or structure without aligning with Sitecore layout definition.
- Not-found: App Router uses not-found.tsx and catch-all can return notFound: true; Pages Router uses 404.tsx/500.tsx and _error as error boundary. getErrorPage can be used for Sitecore-driven error page when applicable.

## Stop Conditions

- Stop if the user wants to add a second catch-all or a different URL shape for Sitecore pages; explain single-entry-point constraint and suggest alternatives (e.g. rewrites).
- Stop if changing proxy/middleware order; order is fixed (e.g. Locale then Multisite then Redirects then Personalize for App Router).
- Do not move or rename the catch-all file without updating all references and docs.

## References

- Template AGENTS.md (nextjs-app-router or nextjs) for exact paths, params (e.g. params as Promise in App Router), and layout hierarchy.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
