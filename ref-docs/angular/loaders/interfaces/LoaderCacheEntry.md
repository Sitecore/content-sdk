[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderCacheEntry

# Interface: LoaderCacheEntry

Defined in: [packages/angular/src/loaders/models.ts:227](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L227)

Persisted cache entry shape. Stored under the composite cache key built by
buildCacheKey(); see cache-key.ts.

## Properties

### expiresAt

> **expiresAt**: `number` \| `null`

Defined in: [packages/angular/src/loaders/models.ts:231](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L231)

***

### stale

> **stale**: `boolean`

Defined in: [packages/angular/src/loaders/models.ts:233](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L233)

When true (or TTL expired), entry is served stale while refreshing.

***

### storedAt

> **storedAt**: `number`

Defined in: [packages/angular/src/loaders/models.ts:230](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L230)

***

### tags

> **tags**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:229](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L229)

***

### value

> **value**: `unknown`

Defined in: [packages/angular/src/loaders/models.ts:228](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L228)
