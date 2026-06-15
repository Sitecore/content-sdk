[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / ExpressEditingRequest

# Interface: ExpressEditingRequest

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:76](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/middleware/editing-render-middleware.ts#L76)

Editing-aware request. The render middleware attaches `scEditing` to allow
downstream code to detect the editing branch without reparsing headers.

## Extends

- [`ExpressRequest`](../../express/interfaces/ExpressRequest.md)

## Properties

### body

> **body**: `unknown`

Defined in: [packages/angular/src/server/models.ts:22](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L22)

#### Inherited from

[`ExpressRequest`](../../express/interfaces/ExpressRequest.md).[`body`](../../express/interfaces/ExpressRequest.md#body)

***

### cookies?

> `optional` **cookies?**: `Record`\<`string`, `string`\>

Defined in: [packages/angular/src/server/models.ts:27](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L27)

Cookies from the request (requires cookie-parser middleware)

#### Inherited from

[`ExpressRequest`](../../express/interfaces/ExpressRequest.md).[`cookies`](../../express/interfaces/ExpressRequest.md#cookies)

***

### headers?

> `optional` **headers?**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/server/models.ts:31](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L31)

Headers from the request

#### Inherited from

[`ExpressRequest`](../../express/interfaces/ExpressRequest.md).[`headers`](../../express/interfaces/ExpressRequest.md#headers)

***

### method

> **method**: `string`

Defined in: [packages/angular/src/server/models.ts:19](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L19)

#### Inherited from

[`ExpressRequest`](../../express/interfaces/ExpressRequest.md).[`method`](../../express/interfaces/ExpressRequest.md#method)

***

### path

> **path**: `string`

Defined in: [packages/angular/src/server/models.ts:20](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L20)

#### Inherited from

[`ExpressRequest`](../../express/interfaces/ExpressRequest.md).[`path`](../../express/interfaces/ExpressRequest.md#path)

***

### query

> **query**: `Record`\<`string`, `string` \| `string`[] \| `undefined`\>

Defined in: [packages/angular/src/server/models.ts:23](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L23)

#### Inherited from

[`ExpressRequest`](../../express/interfaces/ExpressRequest.md).[`query`](../../express/interfaces/ExpressRequest.md#query)

***

### scEditing?

> `optional` **scEditing?**: `EditingPreviewData`

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:77](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/middleware/editing-render-middleware.ts#L77)

***

### url

> **url**: `string`

Defined in: [packages/angular/src/server/models.ts:21](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/models.ts#L21)

#### Inherited from

[`ExpressRequest`](../../express/interfaces/ExpressRequest.md).[`url`](../../express/interfaces/ExpressRequest.md#url)
