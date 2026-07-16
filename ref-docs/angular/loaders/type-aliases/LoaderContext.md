[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderContext

# Type Alias: LoaderContext

> **LoaderContext** = `object`

Defined in: [packages/angular/src/loaders/models.ts:57](https://github.com/Sitecore/content-sdk/blob/5ecdcaf8b7fae916353dcb4b755a48712bde6ab7/packages/angular/src/loaders/models.ts#L57)

Context provided to loader functions.
Contains information about the current request including URL, params, query, and request context.

## Properties

### csdkRequestData?

> `optional` **csdkRequestData?**: [`CsdkRequestData`](../interfaces/CsdkRequestData.md)

Defined in: [packages/angular/src/loaders/models.ts:85](https://github.com/Sitecore/content-sdk/blob/5ecdcaf8b7fae916353dcb4b755a48712bde6ab7/packages/angular/src/loaders/models.ts#L85)

Server-only: request data extracted from the incoming HTTP request
(hostname, headers, cookies, editing preview data). Absent during prerender.

***

### query

> **query**: `Record`\<`string`, `string` \| `string`[]\>

Defined in: [packages/angular/src/loaders/models.ts:74](https://github.com/Sitecore/content-sdk/blob/5ecdcaf8b7fae916353dcb4b755a48712bde6ab7/packages/angular/src/loaders/models.ts#L74)

Query string parameters

***

### req?

> `optional` **req?**: `Request`

Defined in: [packages/angular/src/loaders/models.ts:78](https://github.com/Sitecore/content-sdk/blob/5ecdcaf8b7fae916353dcb4b755a48712bde6ab7/packages/angular/src/loaders/models.ts#L78)

Server-only: the incoming request

***

### routeParams

> **routeParams**: `Params`

Defined in: [packages/angular/src/loaders/models.ts:70](https://github.com/Sitecore/content-sdk/blob/5ecdcaf8b7fae916353dcb4b755a48712bde6ab7/packages/angular/src/loaders/models.ts#L70)

Route parameters from all matched segments.

When locales are configured and the route tree uses `scLocaleMatcher`, the matched
locale is exposed as `params.locale`. The resolver also defaults `params.locale` to
`defaultLanguage` from `sitecore.config` when no locale segment was matched — loaders
can rely on a concrete `params.locale` regardless of URL shape.

***

### scParams

> **scParams**: `Omit`\<[`CsdkRequestParams`](../interfaces/CsdkRequestParams.md), `"siteName"`\> & `object`

Defined in: [packages/angular/src/loaders/models.ts:80](https://github.com/Sitecore/content-sdk/blob/5ecdcaf8b7fae916353dcb4b755a48712bde6ab7/packages/angular/src/loaders/models.ts#L80)

Content SDK request params like site name, variant ids

#### Type Declaration

##### siteName

> **siteName**: `string`

***

### url

> **url**: `string`

Defined in: [packages/angular/src/loaders/models.ts:61](https://github.com/Sitecore/content-sdk/blob/5ecdcaf8b7fae916353dcb4b755a48712bde6ab7/packages/angular/src/loaders/models.ts#L61)

The current URL path
