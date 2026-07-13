[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderCacheEntry

# Interface: LoaderCacheEntry

Defined in: [packages/angular/src/loaders/models.ts:251](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L251)

Persisted cache entry shape. Stored under the composite cache key built by
buildCacheKey(); see cache-key.ts.

## Properties

### expiresAt

> **expiresAt**: `number` \| `null`

Defined in: [packages/angular/src/loaders/models.ts:255](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L255)

***

### stale

> **stale**: `boolean`

Defined in: [packages/angular/src/loaders/models.ts:257](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L257)

When true (or TTL expired), entry is served stale while refreshing.

***

### storedAt

> **storedAt**: `number`

Defined in: [packages/angular/src/loaders/models.ts:254](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L254)

***

### tags

> **tags**: `string`[]

Defined in: [packages/angular/src/loaders/models.ts:253](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L253)

***

### value

> **value**: `unknown`

Defined in: [packages/angular/src/loaders/models.ts:252](https://github.com/Sitecore/content-sdk/blob/28226c21fb726217be012fb49a35e263d3bf850b/packages/angular/src/loaders/models.ts#L252)
