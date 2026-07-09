---
name: content-sdk-cache-components-and-osr
description: Tag-based caching in src/lib/cache/ and POST /api/revalidate webhook for on-demand invalidation.
---

# Cache Components and OSR (App Router + Cache Components)

**Detail:** [AGENTS-router-specifics.md#on-demand-revalidation-post-apirevalidate](../../docs/AGENTS-router-specifics.md#on-demand-revalidation-post-apirevalidate)
**Read first:** `src/lib/cache/`, `src/app/api/revalidate/route.ts`

## When

- Stale content
- Adding cache helper
- Webhook / revalidation setup

## Rules

- Cache helpers use `'use cache'` + `cacheTag` with `sc:route` / `sc:item` / `sc:dict` tags
- `POST /api/revalidate` accepts `updates[]` and `tags[]`
- Optional `SITECORE_REVALIDATE_SECRET` + `x-revalidate-secret` header
- Do not call `revalidateTag` from components

## Stop

- Stop if re-enabling SDK in-process dictionary cache

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
