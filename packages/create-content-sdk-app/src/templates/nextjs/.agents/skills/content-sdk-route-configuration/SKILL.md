---
name: content-sdk-route-configuration
description: Configures routing and layout for Pages Router. Single catch-all at src/pages/[[...path]].tsx; path from extractPath(context), locale from context.locale. Data flows via getStaticProps/getServerSideProps to _app and Layout. Use when changing routing, placeholders, or Layout.
---

# Routing (Pages Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — Catch-all route, `_app`, Layout, 404/500.

## When

- Changing `[[...path]]`, placeholders, layout, or data-fetch contract for Sitecore pages.

## Rules

- **Only** `src/pages/[[...path]].tsx` renders Sitecore pages; `extractPath` + `context.locale`; no duplicate catch-alls.
- All Sitecore data loads in that page’s `getStaticProps`/`getServerSideProps`, not `_app`.
- Do not change multisite proxy order (Multisite → Redirects → Personalize).

## Stop

- If the user wants a second Sitecore entry route, explain the single-entry constraint.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
