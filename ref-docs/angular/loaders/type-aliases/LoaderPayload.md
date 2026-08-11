[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderPayload

# Type Alias: LoaderPayload

> **LoaderPayload** = `object`

Defined in: [packages/angular/src/loaders/models.ts:92](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/angular/src/loaders/models.ts#L92)

Payload for loader resolution.

## Properties

### cacheOptions?

> `optional` **cacheOptions?**: [`LoaderCacheConfig`](../interfaces/LoaderCacheConfig.md)

Defined in: [packages/angular/src/loaders/models.ts:114](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/angular/src/loaders/models.ts#L114)

Per-route cache overrides supplied at the `loaderResolver(id, cacheOptions)`
call site. The browser includes them in the `/_data` POST body so the same
per-route policy applies on CSR navigations.

***

### loaderId

> **loaderId**: `string`

Defined in: [packages/angular/src/loaders/models.ts:96](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/angular/src/loaders/models.ts#L96)

The loader ID

***

### query

> **query**: `Record`\<`string`, `any`\>

Defined in: [packages/angular/src/loaders/models.ts:108](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/angular/src/loaders/models.ts#L108)

The request query parameters

***

### routeParams

> **routeParams**: `Params`

Defined in: [packages/angular/src/loaders/models.ts:104](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/angular/src/loaders/models.ts#L104)

The ANgular request route parameters

***

### url

> **url**: `string`

Defined in: [packages/angular/src/loaders/models.ts:100](https://github.com/Sitecore/content-sdk/blob/0b0b7233e8cb6cbd454dd69aece52311789f8eec/packages/angular/src/loaders/models.ts#L100)

The requst URL
