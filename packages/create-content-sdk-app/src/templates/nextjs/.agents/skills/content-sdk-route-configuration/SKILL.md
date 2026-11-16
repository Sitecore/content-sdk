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

- Single Sitecore entry: `src/pages/[[...path]].tsx`; `src/pages/_sctokens/[[...path]].tsx` is its per-request twin for dynamic content tokens (keep their page props in sync)
- Do not fetch Sitecore data in `_app.tsx`
- Use `extractPath(context)` and `context.locale`

## Stop

- Stop if adding another catch-all for Sitecore content (other than the existing `_sctokens` route)

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
