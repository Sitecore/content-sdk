---
name: content-sdk-loader-cache-and-revalidation
description: Server-only loader cache (unstorage), SWR behaviour, cache keys and POST /api/revalidate.
---

# Loader cache and revalidation (Angular)

**Detail:** [AGENTS-loaders-and-di.md#loader-cache](../../docs/AGENTS-loaders-and-di.md#loader-cache)
**Read first:** `src/server.ts`, `sitecore.config.ts`

## When

- Stale or missing content after a publish
- Tuning caching, revalidation, or the storage driver

## Rules

- Angular has no framework ISR — this app caches **loader results** via `createLoaderCache` on top of `unstorage`
- One cache instance shared by `createSitecoreRevalidateMiddleware`, `createLoaderDataServiceMiddleware`, and `angularApp.handle(req, { cache, req, res })`
- Configure by editing **`sitecore.config.ts`** and passing the values in the **first argument** of `defineConfig`: `defineConfig({ angular: { loadersCache: { enabled: true, revalidate: 300 } } }, environment)`. `scConfig.angular.loadersCache` is the resolved read path used by `src/server.ts` — do not assign to it
- Both fields default when omitted (`enabled: true`, `revalidate: 300`); per-route overrides via `loaderResolver('page', { enabled, revalidate, tags })`
- Cache keys include site, locale and personalization variant — do not drop any of them
- Editing and preview requests bypass the cache; redirects are never cached
- `unstorage` and the cache are **server-only** — never import them from `src/app/**`
- In production use a driver backed by shared storage; a per-process memory map is inconsistent across workers
- Protect `POST /api/revalidate` with `SITECORE_REVALIDATE_SECRET`

## Stop

- Stop if a change would make the cache reachable from the browser bundle or cache personalized/editing responses

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
