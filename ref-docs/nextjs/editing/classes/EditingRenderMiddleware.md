[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddleware

# Class: EditingRenderMiddleware

Defined in: [nextjs/src/editing/editing-render-middleware.ts:58](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/editing/editing-render-middleware.ts#L58)

Middleware / handler for use in the editing render Next.js API route (e.g. '/api/editing/render')
which is required for Sitecore editing support.

## Extends

- `RenderMiddlewareBase`

## Constructors

### new EditingRenderMiddleware()

> **new EditingRenderMiddleware**(`config`?): [`EditingRenderMiddleware`](EditingRenderMiddleware.md)

Defined in: [nextjs/src/editing/editing-render-middleware.ts:62](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/editing/editing-render-middleware.ts#L62)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | [`EditingRenderMiddlewareConfig`](../type-aliases/EditingRenderMiddlewareConfig.md) | Editing render middleware config |

#### Returns

[`EditingRenderMiddleware`](EditingRenderMiddleware.md)

#### Overrides

`RenderMiddlewareBase.constructor`

## Properties

### config?

> `optional` **config**: [`EditingRenderMiddlewareConfig`](../type-aliases/EditingRenderMiddlewareConfig.md)

Defined in: [nextjs/src/editing/editing-render-middleware.ts:62](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/editing/editing-render-middleware.ts#L62)

Editing render middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/editing-render-middleware.ts:70](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/editing/editing-render-middleware.ts#L70)

Gets the Next.js API route handler

#### Returns

`Function`

route handler

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

Defined in: [nextjs/src/editing/render-middleware.ts:39](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/editing/render-middleware.ts#L39)

Get headers that should be passed along to subsequent requests

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headers` | `IncomingHttpHeaders` | Incoming HTTP Headers |

#### Returns

`object`

Object of approved headers

#### Inherited from

`RenderMiddlewareBase.getHeadersForPropagation`

***

### getQueryParamsForPropagation()

> `protected` **getQueryParamsForPropagation**(`query`): `object`

Defined in: [nextjs/src/editing/render-middleware.ts:17](https://github.com/Sitecore/xmc-jss-dev/blob/7e7ce097833cac399aa150e6b63dca7210e4ee25/packages/nextjs/src/editing/render-middleware.ts#L17)

Gets query parameters that should be passed along to subsequent requests (e.g. for deployment protection bypass)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `Partial`\<\{\}\> | Object of query parameters from incoming URL |

#### Returns

`object`

Object of approved query parameters

#### Inherited from

`RenderMiddlewareBase.getQueryParamsForPropagation`
