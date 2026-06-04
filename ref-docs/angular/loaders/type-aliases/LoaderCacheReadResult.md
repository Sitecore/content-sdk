[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderCacheReadResult

# Type Alias: LoaderCacheReadResult

> **LoaderCacheReadResult** = \{ `cacheKey`: `string`; `kind`: `"hit"`; `value`: `unknown`; \} \| \{ `cacheKey`: `string`; `kind`: `"stale"`; `value`: `unknown`; \} \| \{ `cacheKey`: `string`; `kind`: `"miss"`; \}

Defined in: [packages/angular/src/loaders/models.ts:214](https://github.com/Sitecore/content-sdk/blob/923ffcee7dd418f8c72a1a802e878859b5159692/packages/angular/src/loaders/models.ts#L214)

Three-outcome read result for stale-while-revalidate (Phase 3).

- `hit` — entry is fresh; serve cached value without running the loader.
- `stale` — entry expired or was invalidated; serve cached value and refresh in the background.
- `miss` — no entry; run the loader synchronously.

## Union Members

### Type Literal

\{ `cacheKey`: `string`; `kind`: `"hit"`; `value`: `unknown`; \}

Fresh cache entry within TTL and not marked stale.

***

### Type Literal

\{ `cacheKey`: `string`; `kind`: `"stale"`; `value`: `unknown`; \}

Expired or invalidated entry; value is served while a background refresh runs.

***

### Type Literal

\{ `cacheKey`: `string`; `kind`: `"miss"`; \}

No entry stored for the requested cache key.
