[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderCacheEntry

# Interface: LoaderCacheEntry

Defined in: [packages/angular/src/loaders/models.ts:254](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/loaders/models.ts#L254)

Persisted cache entry shape. Stored under the composite cache key built by
buildCacheKey(); see cache-key.ts.

## Properties

### expiresAt

> **expiresAt**: `number` \| `null`

Defined in: [packages/angular/src/loaders/models.ts:258](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/loaders/models.ts#L258)

***

### stale

> **stale**: `boolean`

Defined in: [packages/angular/src/loaders/models.ts:260](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/loaders/models.ts#L260)

When true (or TTL expired), entry is served stale while refreshing.

***

### storedAt

> **storedAt**: `number`

Defined in: [packages/angular/src/loaders/models.ts:257](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/loaders/models.ts#L257)

***

### tags

> **tags**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:256](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/loaders/models.ts#L256)

***

### value

> **value**: `unknown`

Defined in: [packages/angular/src/loaders/models.ts:255](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/loaders/models.ts#L255)
