[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddleware

# Class: EditingRenderMiddleware

Defined in: [nextjs/src/editing/editing-render-middleware.ts:53](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/nextjs/src/editing/editing-render-middleware.ts#L53)

Middleware / handler for use in the editing render Next.js API route (e.g. '/api/editing/render')
which is required for Sitecore editing support.

## Extends

- `RenderMiddlewareBase`

## Constructors

### Constructor

> **new EditingRenderMiddleware**(`config?`): `EditingRenderMiddleware`

Defined in: [nextjs/src/editing/editing-render-middleware.ts:58](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/nextjs/src/editing/editing-render-middleware.ts#L58)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`EditingRenderMiddlewareConfig`](../type-aliases/EditingRenderMiddlewareConfig.md) | Editing render middleware config |

#### Returns

`EditingRenderMiddleware`

#### Overrides

`RenderMiddlewareBase.constructor`

## Properties

### config?

> `optional` **config**: [`EditingRenderMiddlewareConfig`](../type-aliases/EditingRenderMiddlewareConfig.md)

Defined in: [nextjs/src/editing/editing-render-middleware.ts:58](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/nextjs/src/editing/editing-render-middleware.ts#L58)

Editing render middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/editing-render-middleware.ts:67](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/nextjs/src/editing/editing-render-middleware.ts#L67)

Gets the Next.js API route handler

#### Returns

route handler

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `EditingNextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>

***

### getHeadersForPropagation()

> `protected` **getHeadersForPropagation**(`headers`): `object`

Defined in: [nextjs/src/editing/render-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/nextjs/src/editing/render-middleware.ts#L40)

Get headers that should be passed along to subsequent requests

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headers` | `IncomingHttpHeaders` \| `Headers` | Incoming HTTP Headers |

#### Returns

`object`

Object of approved headers

#### Inherited from

`RenderMiddlewareBase.getHeadersForPropagation`

***

### getQueryParamsForPropagation()

> `protected` **getQueryParamsForPropagation**(`query`): `object`

Defined in: [nextjs/src/editing/render-middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/b6bd0865567bd897fba0f8cf7dcc09cf930cb1d8/packages/nextjs/src/editing/render-middleware.ts#L18)

Gets query parameters that should be passed along to subsequent requests (e.g. for deployment protection bypass)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `Partial`\<\{\[`key`: `string`\]: `string` \| `string`[]; \}\> | Object of query parameters from incoming URL |

#### Returns

`object`

Object of approved query parameters

#### Inherited from

`RenderMiddlewareBase.getQueryParamsForPropagation`
