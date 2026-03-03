---
name: content-sdk-route-configuration
description: Configures routing and layout for Pages Router. Single catch-all at src/pages/[[...path]].tsx; path from extractPath(context), locale from context.locale. Data flows via getStaticProps/getServerSideProps to _app and Layout. Use when changing routing, placeholders, or Layout.
---

# Content SDK Route Configuration (Pages Router)

Single catch-all route; no [site] or [locale] in the URL path. Site is resolved by middleware; locale from Next.js i18n (context.locale).

## When to Use

- User asks to change routing, add a route, or fix 404/500 behavior.
- Task involves catch-all route, placeholders, _app, or Layout.tsx.
- User mentions "[[...path]]," "placeholder," "layout," or "getStaticProps."

## How to perform

- Single Sitecore page: `src/pages/[[...path]].tsx`. Use `extractPath(context)` for path and `context.locale` for locale. Fetch all data in getStaticProps/getServerSideProps and pass to _app and Layout. Not-found/error: use getErrorPage in getStaticProps or 404.tsx / _error.tsx as appropriate.

## Hard Rules

- **Single Sitecore page:** `src/pages/[[...path]].tsx`. This is the **only** page that renders Sitecore content. Do not add another page or catch-all for Sitecore content.
- **Path:** Use `extractPath(context)` (from `@sitecore-content-sdk/nextjs/utils`) to get the path array. **Locale:** Use `context.locale` (Next.js i18n). Do not assume path or locale from headers or elsewhere.
- **Data flow:** All Sitecore data is fetched in getStaticProps/getServerSideProps in [[...path]].tsx and passed to _app and Layout. Do not fetch Sitecore data in _app.tsx.
- **Layout:** Layout.tsx renders page layout and placeholders; Providers wrap component props and page context; Bootstrap handles site name and preview mode.
- Placeholders are rendered by the layout; do not change placeholder names or structure without aligning with Sitecore layout definition.
- **404 / 500 / _error:** When the catch-all returns `notFound: true`, Next.js renders 404.tsx. For Sitecore-driven error content use `client.getErrorPage(ErrorPage.NotFound)` or `ErrorPage.InternalServerError` in getStaticProps when applicable. _error.tsx is the error boundary; it does not fetch from Sitecore.

## Stop Conditions

- Stop if the user wants to add a second catch-all or a different URL shape for Sitecore pages; explain single-entry-point constraint.
- Stop if changing proxy/middleware order; order is fixed (MultisiteProxy → RedirectsProxy → PersonalizeProxy).
- Do not move or rename the catch-all file without updating all references.

## References

- [AGENTS.md](../../../AGENTS.md) for exact paths, extractPath, and layout flow.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
