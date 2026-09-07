[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / CsdkRequestData

# Interface: CsdkRequestData

Defined in: [packages/angular/src/loaders/models.ts:26](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/loaders/models.ts#L26)

Request data from the incoming HTTP request.
Used for request-dependent operations in loaders.

## Properties

### cookies?

> `optional` **cookies?**: `Record`\<`string`, `string`\>

Defined in: [packages/angular/src/loaders/models.ts:34](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/loaders/models.ts#L34)

Cookies from the request

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/loaders/models.ts:42](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/loaders/models.ts#L42)

Headers from the request

***

### hostname?

> `optional` **hostname?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:30](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/loaders/models.ts#L30)

The hostname from the request (without port)

***

### query?

> `optional` **query?**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/loaders/models.ts:38](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/loaders/models.ts#L38)

Query parameters from the request

***

### referrer?

> `optional` **referrer?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:46](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/loaders/models.ts#L46)

Referrer from the request

***

### scParams?

> `optional` **scParams?**: [`CsdkRequestParams`](CsdkRequestParams.md)

Defined in: [packages/angular/src/loaders/models.ts:52](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/loaders/models.ts#L52)

Content SDK request params

***

### scPreviewData?

> `optional` **scPreviewData?**: `EditingPreviewData` \| `DesignLibraryRenderPreviewData`

Defined in: [packages/angular/src/loaders/models.ts:50](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/loaders/models.ts#L50)

Preview/editing data for Content SDK (standard edit/preview, or Design Library data).
