---
name: content-sdk-graphql-data-fetching
description: Page/dictionary via SitecoreClient; SSG via getAppRouterStaticParams.
---

# Data fetching (App Router)

**Detail:** [AGENTS-router-specifics.md#data-fetching-and-preview](../../docs/AGENTS-router-specifics.md#data-fetching-and-preview)
**Read first:** `src/app/[site]/[locale]/[[...path]]/page.tsx`, `src/lib/sitecore-client.ts`

## When

- Page or dictionary fetch
- generateStaticParams / SSG

## Rules

- `client.getPage(path ?? [], { site, locale })` in page Server Components
- `client.getDictionary({ locale, site })` in `src/i18n/request.ts`
- SSG: `getAppRouterStaticParams` when `generateStaticPaths` true; else `return []`
- Preview: `draftMode()` + `client.getPreviewData(await headers())` then `getPreview` / `getDesignLibraryData`

## Stop

- Stop if fetching in client components

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
