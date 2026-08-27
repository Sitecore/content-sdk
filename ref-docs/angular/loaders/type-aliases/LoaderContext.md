[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [loaders](../README.md) / LoaderContext

# Type Alias: LoaderContext

> **LoaderContext** = `object`

Defined in: [packages/angular/src/loaders/models.ts:60](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L60)

Context provided to loader functions.
Contains information about the current request including URL, params, query, and request context.

## Properties

### csdkRequestData?

> `optional` **csdkRequestData?**: [`CsdkRequestData`](../interfaces/CsdkRequestData.md)

Defined in: [packages/angular/src/loaders/models.ts:88](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L88)

Server-only: request data extracted from the incoming HTTP request
(hostname, headers, cookies, editing preview data). Absent during prerender.

***

### query

> **query**: `Record`\<`string`, `string` \| `string`[]\>

Defined in: [packages/angular/src/loaders/models.ts:77](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L77)

Query string parameters

***

### req?

> `optional` **req?**: `Request`

Defined in: [packages/angular/src/loaders/models.ts:81](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L81)

Server-only: the incoming request

***

### routeParams

> **routeParams**: `Params`

Defined in: [packages/angular/src/loaders/models.ts:73](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L73)

Route parameters from all matched segments.

When locales are configured and the route tree uses `scLocaleMatcher`, the matched
locale is exposed as `params.locale`. The resolver also defaults `params.locale` to
`defaultLanguage` from `sitecore.config` when no locale segment was matched — loaders
can rely on a concrete `params.locale` regardless of URL shape.

***

### scParams

> **scParams**: `Omit`\<[`CsdkRequestParams`](../interfaces/CsdkRequestParams.md), `"siteName"`\> & `object`

Defined in: [packages/angular/src/loaders/models.ts:83](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L83)

Content SDK request params like site name, variant ids

#### Type Declaration

##### siteName

> **siteName**: `string`

***

### url

> **url**: `string`

Defined in: [packages/angular/src/loaders/models.ts:64](https://github.com/Sitecore/content-sdk/blob/23c9158a9fae985d2aaa32ec807904acdf22d6e7/packages/angular/src/loaders/models.ts#L64)

The current URL path
