[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / CsdkRequestData

# Interface: CsdkRequestData

Defined in: [packages/angular/src/loaders/models.ts:23](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/loaders/models.ts#L23)

Request data from the incoming HTTP request.
Used for request-dependent operations in loaders.

## Properties

### cookies?

> `optional` **cookies?**: `Record`\<`string`, `string`\>

Defined in: [packages/angular/src/loaders/models.ts:31](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/loaders/models.ts#L31)

Cookies from the request

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/loaders/models.ts:39](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/loaders/models.ts#L39)

Headers from the request

***

### hostname?

> `optional` **hostname?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:27](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/loaders/models.ts#L27)

The hostname from the request (without port)

***

### query?

> `optional` **query?**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/loaders/models.ts:35](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/loaders/models.ts#L35)

Query parameters from the request

***

### referrer?

> `optional` **referrer?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:43](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/loaders/models.ts#L43)

Referrer from the request

***

### scParams?

> `optional` **scParams?**: [`CsdkRequestParams`](CsdkRequestParams.md)

Defined in: [packages/angular/src/loaders/models.ts:49](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/loaders/models.ts#L49)

Content SDK request params

***

### scPreviewData?

> `optional` **scPreviewData?**: `EditingPreviewData`

Defined in: [packages/angular/src/loaders/models.ts:47](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/loaders/models.ts#L47)

Preview/editing data for Content SDK
