[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / RequestContext

# Interface: RequestContext

Defined in: [packages/angular/src/loaders/models.ts:10](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L10)

Request context containing information from the incoming HTTP request.
Used for request-dependent operations in loaders.

## Properties

### cookies?

> `optional` **cookies?**: `Record`\<`string`, `string`\>

Defined in: [packages/angular/src/loaders/models.ts:18](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L18)

Cookies from the request

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/loaders/models.ts:26](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L26)

Headers from the request

***

### hostname?

> `optional` **hostname?**: `string`

Defined in: [packages/angular/src/loaders/models.ts:14](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L14)

The hostname from the request (without port)

***

### query?

> `optional` **query?**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/loaders/models.ts:22](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/angular/src/loaders/models.ts#L22)

Query parameters from the request
