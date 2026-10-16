[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderCacheReadResult

# Type Alias: LoaderCacheReadResult

> **LoaderCacheReadResult** = \{ `cacheKey`: `string`; `kind`: `"hit"`; `value`: `unknown`; \} \| \{ `cacheKey`: `string`; `kind`: `"stale"`; `value`: `unknown`; \} \| \{ `cacheKey`: `string`; `kind`: `"miss"`; \}

Defined in: [packages/angular/src/loaders/models.ts:241](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/angular/src/loaders/models.ts#L241)

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
