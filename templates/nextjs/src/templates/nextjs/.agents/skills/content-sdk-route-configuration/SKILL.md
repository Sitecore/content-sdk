---
name: content-sdk-route-configuration
description: Pages Router catch-all at src/pages/[[...path]].tsx; data via getStaticProps/getServerSideProps.
---

# Route configuration (Pages Router)

**Detail:** [AGENTS-router-specifics.md#routing-and-data-fetching](../../docs/AGENTS-router-specifics.md#routing-and-data-fetching)
**Read first:** `src/pages/[[...path]].tsx`

## When

- Changing routing, placeholders, or Layout
- Catch-all or _app data flow

## Rules

- Single Sitecore entry: `src/pages/[[...path]].tsx`
- Do not fetch Sitecore data in `_app.tsx`
- Use `extractPath(context)` and `context.locale`

## Stop

- Stop if adding a second catch-all for Sitecore content

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
