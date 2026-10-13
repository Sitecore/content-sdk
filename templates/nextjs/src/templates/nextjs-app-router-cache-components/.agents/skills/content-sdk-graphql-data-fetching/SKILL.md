---
name: content-sdk-graphql-data-fetching
description: Cached reads via src/lib/cache helpers; preview via client directly.
---

# Data fetching (App Router + Cache Components)

**Detail:** [AGENTS-router-specifics.md#data-fetching-and-preview](../../docs/AGENTS-router-specifics.md#data-fetching-and-preview)
**Read first:** `src/lib/cache/get-sitecore-page.ts`, `src/lib/sitecore-client.ts`

## When

- Page or dictionary fetch
- generateStaticParams / SSG

## Rules

- Non-preview reads: `getSitecorePage` / `getSitecoreDictionary` from `src/lib/cache/`
- Dictionary via `getSitecoreDictionary` in `src/i18n/request.ts`
- SSG: `getAppRouterStaticParams` when `generateStaticPaths` true; else `BUILD_VALIDATION_SITE` placeholder — never `return []`
- Preview: `draftMode()` + `client.getPreview` / `getDesignLibraryData` directly — never wrap in `use cache`

## Stop

- Stop if calling `client.getPage` directly in pages/i18n

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
