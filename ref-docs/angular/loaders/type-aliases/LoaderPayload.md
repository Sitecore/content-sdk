[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderPayload

# Type Alias: LoaderPayload

> **LoaderPayload** = `object`

Defined in: [packages/angular/src/loaders/models.ts:95](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L95)

Payload for loader resolution.

## Properties

### cacheOptions?

> `optional` **cacheOptions?**: [`LoaderCacheConfig`](../interfaces/LoaderCacheConfig.md)

Defined in: [packages/angular/src/loaders/models.ts:117](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L117)

Per-route cache overrides supplied at the `loaderResolver(id, cacheOptions)`
call site. The browser includes them in the `/_data` POST body so the same
per-route policy applies on CSR navigations.

***

### loaderId

> **loaderId**: `string`

Defined in: [packages/angular/src/loaders/models.ts:99](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L99)

The loader ID

***

### query

> **query**: `Record`\<`string`, `any`\>

Defined in: [packages/angular/src/loaders/models.ts:111](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L111)

The request query parameters

***

### routeParams

> **routeParams**: `Params`

Defined in: [packages/angular/src/loaders/models.ts:107](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L107)

The ANgular request route parameters

***

### url

> **url**: `string`

Defined in: [packages/angular/src/loaders/models.ts:103](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L103)

The requst URL
