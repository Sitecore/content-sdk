---
name: content-sdk-graphql-data-fetching
description: Page/dictionary fetch via SitecoreClient in [[...path]].tsx getStaticProps/getServerSideProps.
---

# Data fetching (Pages Router)

**Detail:** [AGENTS-router-specifics.md#routing-and-data-fetching](../../docs/AGENTS-router-specifics.md#routing-and-data-fetching)
**Read first:** `src/pages/[[...path]].tsx`, `src/lib/sitecore-client.ts`

## When

- Fetching page or dictionary data
- SSG paths or preview data

## Rules

- Path from `extractPath(context)`; locale from `context.locale`
- `client.getPage(path, { locale })` then `getDictionary` and `getComponentData`
- SSG paths: `client.getPagePaths(sites, context?.locales)`

## Stop

- Stop if fetching in client components when SSR/SSG is intended

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
