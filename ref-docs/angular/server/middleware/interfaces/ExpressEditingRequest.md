[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / ExpressEditingRequest

# Interface: ExpressEditingRequest

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:74](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/server/middleware/editing-render-middleware.ts#L74)

Editing-aware request. The render middleware attaches `scEditing` to allow
downstream code to detect the editing branch without reparsing headers.

## Extends

- [`ExpressRequest`](ExpressRequest.md)

## Properties

### body

> **body**: `unknown`

Defined in: [packages/angular/src/config/http-types.ts:9](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/config/http-types.ts#L9)

#### Inherited from

[`ExpressRequest`](ExpressRequest.md).[`body`](ExpressRequest.md#body)

***

### cookies?

> `optional` **cookies?**: `Record`\<`string`, `string`\>

Defined in: [packages/angular/src/config/http-types.ts:15](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/config/http-types.ts#L15)

Cookies from the request (requires cookie-parser middleware)

#### Inherited from

[`ExpressRequest`](ExpressRequest.md).[`cookies`](ExpressRequest.md#cookies)

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/config/http-types.ts:19](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/config/http-types.ts#L19)

Headers from the request

#### Inherited from

[`ExpressRequest`](ExpressRequest.md).[`headers`](ExpressRequest.md#headers)

***

### method

> **method**: `string`

Defined in: [packages/angular/src/config/http-types.ts:6](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/config/http-types.ts#L6)

#### Inherited from

[`ExpressRequest`](ExpressRequest.md).[`method`](ExpressRequest.md#method)

***

### params?

> `optional` **params?**: `Record`\<`string`, `string`\>

Defined in: [packages/angular/src/config/http-types.ts:24](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/config/http-types.ts#L24)

Route params when mounted on a parameterized Express path (e.g. `/sitemap-:id.xml`).

#### Inherited from

[`ExpressRequest`](ExpressRequest.md).[`params`](ExpressRequest.md#params)

***

### path

> **path**: `string`

Defined in: [packages/angular/src/config/http-types.ts:7](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/config/http-types.ts#L7)

#### Inherited from

[`ExpressRequest`](ExpressRequest.md).[`path`](ExpressRequest.md#path)

***

### query

> **query**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/config/http-types.ts:11](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/config/http-types.ts#L11)

#### Inherited from

[`ExpressRequest`](ExpressRequest.md).[`query`](ExpressRequest.md#query)

***

### referrer?

> `optional` **referrer?**: `string`

Defined in: [packages/angular/src/config/http-types.ts:10](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/config/http-types.ts#L10)

#### Inherited from

[`ExpressRequest`](ExpressRequest.md).[`referrer`](ExpressRequest.md#referrer)

***

### scEditing?

> `optional` **scEditing?**: `EditingPreviewData`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:75](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/server/middleware/editing-render-middleware.ts#L75)

***

### setHeader?

> `optional` **setHeader?**: (`name`, `value`) => `void`

Defined in: [packages/angular/src/config/http-types.ts:20](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/config/http-types.ts#L20)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `name` | `string` |
| `value` | `string` \| `string`[] \| `undefined` |

#### Returns

`void`

#### Inherited from

[`ExpressRequest`](ExpressRequest.md).[`setHeader`](ExpressRequest.md#setheader)

***

### url

> **url**: `string`

Defined in: [packages/angular/src/config/http-types.ts:8](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/config/http-types.ts#L8)

#### Inherited from

[`ExpressRequest`](ExpressRequest.md).[`url`](ExpressRequest.md#url)
