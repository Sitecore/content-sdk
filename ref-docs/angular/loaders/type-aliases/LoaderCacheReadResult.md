[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderCacheReadResult

# Type Alias: LoaderCacheReadResult

> **LoaderCacheReadResult** = \{ `cacheKey`: `string`; `kind`: `"hit"`; `value`: `unknown`; \} \| \{ `cacheKey`: `string`; `kind`: `"stale"`; `value`: `unknown`; \} \| \{ `cacheKey`: `string`; `kind`: `"miss"`; \}

Defined in: [packages/angular/src/loaders/models.ts:241](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/angular/src/loaders/models.ts#L241)

Three-outcome read result for stale-while-revalidate

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
