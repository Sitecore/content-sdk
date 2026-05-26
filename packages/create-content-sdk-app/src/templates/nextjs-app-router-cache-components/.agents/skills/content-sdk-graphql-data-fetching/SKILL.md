---
name: content-sdk-graphql-data-fetching
description: Fetches page and dictionary data via the cache helpers in src/lib/cache (Cache Components + Sitecore tags). Use getSitecorePage, getSitecoreDictionary, getSitecoreErrorPage for cached reads; use client.getPreview / client.getDesignLibraryData directly for preview; use client.getAppRouterStaticParams for SSG. Use when fetching page or dictionary content.
---

# Content SDK GraphQL Data Fetching (App Router + Cache Components)

This template ships **tag-aware cache helpers** under `src/lib/cache/`. All non-preview Sitecore reads go through these helpers so cached payloads carry Sitecore tags (`sc:route`, `sc:item`, `sc:pvv`, `sc:dict`) and can be invalidated by `revalidateTag`. Preview and design library reads use the SDK client directly (they must remain dynamic).

## When to Use

- User asks how to fetch page data, layout, or dictionary phrases.
- Task involves getSitecorePage, getSitecoreDictionary, getSitecoreErrorPage, getPreview, getDesignLibraryData, or getAppRouterStaticParams.
- User mentions "sitecore client," "Layout Service," "page data," "dictionary," "use cache," or "cacheTag."

## How to perform

- For non-preview reads, import the cache helpers from `src/lib/cache/*`:
  - Page: `getSitecorePage({ site, locale, path })`
  - Dictionary: `getSitecoreDictionary({ site, locale })`
  - 404 / 500 Sitecore error content (Server context): `getSitecoreErrorPage({ site, locale, code })`
- For preview / draft, import the SDK client from `src/lib/sitecore-client.ts` and call `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` directly. Do **not** wrap these in `'use cache'`.
- For SSG params, call `client.getAppRouterStaticParams(siteNames, locales)` in `generateStaticParams`.

## Hard Rules

- **Cached reads (non-preview):** Use the helpers in `src/lib/cache/`. Do not call `client.getPage` / `client.getDictionary` / `client.getErrorPage` directly in pages, layouts, or i18n config — bypassing the helpers means the read is missing Sitecore cache tags and `revalidateTag` will not invalidate it.
- **Preview reads:** Use `client.getPreview(editingParams)` / `client.getDesignLibraryData(editingParams)` **directly**. Preview must stay dynamic; do not put it under `'use cache'`.
- **Catch-all page (`src/app/[site]/[locale]/[[...path]]/page.tsx`):** `await params` → check `draftMode().isEnabled`; if enabled, use the client directly with `searchParams`; otherwise call `getSitecorePage({ site, locale, path: path ?? [] })`.
- **`generateMetadata`** in the same segment should also call `getSitecorePage` so it shares the cache entry with the page render.
- **SSG:** `generateStaticParams` — use `client.getAppRouterStaticParams(siteNames, locales)` where site names come from `.sitecore/sites.json` (e.g. `sites.map((s) => s.name)`), locales from `src/i18n/routing.ts` (e.g. `routing.locales.slice()`). Return at least one default param when not generating full paths.
- **Single SitecoreClient instance** in `src/lib/sitecore-client.ts`. The cache helpers import this client; do not create a second client.
- Pass **site** and **locale** from route params (e.g. `await params` in the page). Do not rely on global state for site/locale in server code.
- Config for the client comes from `sitecore.config.ts`; use environment variables, never hardcode secrets.

## Adding a new cache helper

When you need a new cached Sitecore read, mirror the existing helpers:

```typescript
// src/lib/cache/get-something.ts
import { cacheTag } from 'next/cache';
import client from 'src/lib/sitecore-client';

export async function getSomething(params: { site: string; locale: string }) {
  'use cache';
  // Compute deterministic Sitecore tags (use SDK helpers when available)
  cacheTag(`sc:something:${params.site}:${params.locale}`);
  return client.getSomething(params);
}
```

Then make sure the corresponding tag is invalidated either by manual `POST /api/revalidate` calls or by a Sitecore webhook mapping in the revalidate handler.

## Stop Conditions

- Stop if the task requires moving the client to another folder without clear requirement; suggest keeping a single instance in lib.
- Do not add direct GraphQL or fetch to Layout Service bypassing the client unless the task explicitly requires it.
- Do not wrap preview / design library reads in `'use cache'`; preview must remain dynamic.
- Do not re-enable the SDK in-process dictionary cache; it breaks tag-based dictionary invalidation.

## References

- [AGENTS.md](../../../AGENTS.md) for SitecoreClient, cache helpers, and SSG.
- content-sdk-cache-components-and-osr for the full Cache Components + revalidation flow.
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
