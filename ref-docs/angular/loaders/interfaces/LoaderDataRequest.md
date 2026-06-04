[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderDataRequest

# Interface: LoaderDataRequest

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:24](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/loaders/client-loader-data.service.ts#L24)

Request parameters for fetching loader data

## Properties

### cacheOptions?

> `optional` **cacheOptions?**: [`LoaderCacheConfig`](LoaderCacheConfig.md)

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:34](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/loaders/client-loader-data.service.ts#L34)

Per-route cache overrides from `loaderResolver(id, cacheOptions)`. Sent
to the server in the POST body so server-side cache policy matches the
route's intent on CSR navigations. Phase 5 of the refactor plan.

***

### loaderId

> **loaderId**: `string`

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:26](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/loaders/client-loader-data.service.ts#L26)

***

### params?

> `optional` **params?**: `Params`

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:27](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/loaders/client-loader-data.service.ts#L27)

***

### query?

> `optional` **query?**: `Record`\<`string`, `string` \| `string`[]\>

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:28](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/loaders/client-loader-data.service.ts#L28)

***

### url

> **url**: `string`

Defined in: [packages/angular/src/loaders/client-loader-data.service.ts:25](https://github.com/Sitecore/content-sdk/blob/0ffd4a7c097b40701ae1608ec7fee7decab49a91/packages/angular/src/loaders/client-loader-data.service.ts#L25)
