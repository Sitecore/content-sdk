---
name: content-sdk-cache-components-and-osr
description: Implements and maintains Next.js Cache Components and tag-based on-demand revalidation (OSR). Covers the src/lib/cache helpers, Sitecore tag families (sc:route, sc:item, sc:dict), and the single Sitecore-webhook POST /api/revalidate route (Experience Edge / Content Operations payloads with optional ad-hoc `tags[]` pass-through). Use when adding cached reads, wiring webhooks, debugging stale content, or extending the tag strategy.
---

# Content SDK Cache Components and On-Demand Revalidation (App Router)

This template is the cache-aware variant of the App Router template. It enables Next.js Cache Components (`cacheComponents: true`) and ships:

- **Cache helpers** in `src/lib/cache/` that wrap the SDK client under `'use cache'` and attach Sitecore tags via `cacheTag`:
  - `getSitecorePage({ site, locale, path })` → `sc:route:...`, `sc:item:...` (variants are isolated naturally by the URL path / Cache Components key, no `sc:pvv:` tag is added)
  - `getSitecoreDictionary({ site, locale })` → `sc:dict:{site}:{locale}`
  - `getSitecoreErrorPage({ site, locale, code })` → same tag strategy as `getSitecorePage`
- A **single Sitecore-webhook endpoint** at `POST /api/revalidate` (in `src/app/api/revalidate/route.ts`) built with `createSitecoreRevalidateRouteHandler`. It consumes the Experience Edge / Content Operations payload shape — `updates[]` are translated into `sc:item:<id>:<locale>:latest` tags, and `tags[]` is a pass-through array that accepts `sc:`-prefixed strings verbatim (handy for ad-hoc / operational calls) or bare item IDs (mapped to `sc:item:<id>:<defaultLocale>:latest`). Dictionary tags from `sites` (`.sitecore/sites.json`, including the default site from `generateSites`) are appended on every call.
- Optional auth via **`SITECORE_REVALIDATE_SECRET`**: when set, send the same value in **`x-revalidate-secret`**; when empty, no header is required.
- A `sitecore.config.ts` with the **SDK in-process dictionary cache disabled** (`dictionary: { caching: { enabled: false } }`) so dictionary updates flow through Cache Components only.

## When to Use

- User asks how to cache Sitecore reads, add a new cached helper, or wire a Sitecore webhook to the app.
- User reports stale content (page or dictionary) that does not refresh after a publish.
- User mentions "use cache," "cacheTag," "revalidateTag," "on-demand revalidation," "OSR," "Sitecore webhook," "x-revalidate-secret," or "SITECORE_REVALIDATE_SECRET."
- Task involves the cache helpers in `src/lib/cache/` or the `/api/revalidate` route.

## How to perform

- **Add a cached read:** Add a file under `src/lib/cache/` that declares `'use cache';`, calls the SDK client, computes Sitecore tags (use SDK helpers like `collectSitecorePageCacheTags`, `buildSitecoreDictionaryCacheTag` where appropriate), and calls `cacheTag(tag)` for each.
- **Invalidate via webhook (primary flow):** Configure your Sitecore Experience Edge / Content Operations webhook to `POST` its standard payload to `/api/revalidate`. When `SITECORE_REVALIDATE_SECRET` is set, add the `x-revalidate-secret` header with the same value. The handler converts each `updates[]` entry's `identifier` (with `-media` / `-layout` stripped) into `sc:item:<id>:<locale>:latest` and adds dictionary tags from `sites`.
- **Ad-hoc invalidation (same endpoint):** `POST` `{ "tags": ["sc:route:default:en:/about", "sc:item:..."] }` (`sc:`-prefixed strings revalidate verbatim) or `{ "tags": ["<itemId>"] }` (bare IDs map to `sc:item:<id>:<defaultLocale>:latest`) with the same header. Dictionary tags are still appended on every call.

## Hard Rules

- **Cache boundary:** Only **non-preview** Sitecore reads go through the cache helpers. Preview / draft / design library reads (`client.getPreview`, `client.getDesignLibraryData`) call the SDK client **directly** and must remain dynamic — never wrap them in `'use cache'`.
- **Single dictionary cache layer:** Keep `dictionary: { caching: { enabled: false } }` in `sitecore.config.ts`. The Cache Components helper is the only dictionary cache; re-enabling the SDK cache breaks `revalidateTag` for dictionary data.
- **Tag families** (don't invent ad-hoc tags for Sitecore data):
  - `sc:route:{site}:{locale}:{path}` — route-level (URL-shaped) — used by route-centric flows and ad-hoc invalidation via `tags[]`.
  - `sc:item:{id}` — item-level — produced by webhook `updates[]` rows (and from bare IDs in `tags[]`).
  - `sc:dict:{site}:{locale}` — dictionary phrases.
  Use the SDK helpers (`collectSitecorePageCacheTags`, `buildSitecoreDictionaryCacheTag`) to compute these consistently; do not hand-format tags from scratch. Personalization variants are isolated naturally by URL path (Cache Components key), so no `sc:pvv:` tag is added — and lower-level tag builders (item, route, variant, edge-webhook parsers) are intentionally not part of the public SDK surface; if you ever need behavior not covered by the helpers above, raise it on the SDK rather than re-implementing it.
- **Revalidation route auth:**
  - Endpoint: `POST /api/revalidate` (in `src/app/api/revalidate/route.ts`).
  - Secret: `SITECORE_REVALIDATE_SECRET` (env var). When non-empty, callers must send it in `x-revalidate-secret`; when empty, auth is skipped.
  - **Never** expose the secret in client code or in logs. Use a non-empty secret when the endpoint should be protected.
  - Do **not** call `revalidateTag` directly from components; route all invalidation through `/api/revalidate` (or call the route handler in tests).
- **Adding tags to a new helper:** Mirror the existing helpers. Compute tags with SDK helpers when applicable, fall back to deterministic strings (`sc:something:{site}:{locale}`) otherwise, and ensure those tags are also producible from whatever event triggers invalidation (webhook `updates[]` or ad-hoc `tags[]`).
- **Sitemap / robots / editing routes** with `cacheComponents: true` do not need an explicit `export const dynamic = 'force-dynamic'` — Next.js infers it.

## Debugging stale content

- **Page didn't refresh after publish:** Confirm the webhook reached `/api/revalidate` (server logs), the `x-revalidate-secret` header matched `SITECORE_REVALIDATE_SECRET`, and the publish-event item id maps to an `sc:item:<id>` tag that the page's cached entry carries.
- **Dictionary didn't refresh after publish:** Confirm `dictionary: { caching: { enabled: false } }` is still set in `sitecore.config.ts`, and that the dictionary tag (`sc:dict:{site}:{locale}`) is in the helper's `cacheTag` calls. The route handler adds dictionary tags from `sites` automatically.
- **Preview content is stale:** Preview must be dynamic; check that the preview branch in `page.tsx` calls `client.getPreview` / `client.getDesignLibraryData` directly, not the `getSitecorePage` cache helper.

## Stop Conditions

- Stop if the user wants to bypass the revalidate secret or call `revalidateTag` from a Client Component; explain the security and architectural risks.
- Stop if the user wants to introduce a different tag scheme; align with the existing `sc:` families or update the SDK helpers consistently.
- Stop if the user wants to cache preview / design library reads; preview must remain dynamic.
- Do not introduce a second cache layer (e.g. an in-memory cache around the SDK) that bypasses Cache Components — it makes invalidation non-deterministic.

## References

- [AGENTS.md](../../../AGENTS.md) for cache helpers, the revalidate route, and config rules.
- content-sdk-graphql-data-fetching for which helper / API to call for each read.
- content-sdk-editing-safe-rendering for the cache-vs-preview boundary.
- [Next.js Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) and [`revalidateTag`](https://nextjs.org/docs/app/api-reference/functions/revalidateTag).
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
