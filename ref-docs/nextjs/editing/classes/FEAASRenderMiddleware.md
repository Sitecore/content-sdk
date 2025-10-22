[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / FEAASRenderMiddleware

# Class: FEAASRenderMiddleware

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/54e2d32b8cfa6a9aec978ed0874e1d70711b6607/packages/nextjs/src/editing/feaas-render-middleware.ts#L27)

Middleware / handler for use in the feaas render Next.js API route (e.g. '/api/editing/feaas/render')
which is required for Sitecore editing support.

## Extends

- `RenderMiddlewareBase`

## Constructors

### Constructor

> **new FEAASRenderMiddleware**(`config?`): `FEAASRenderMiddleware`

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/54e2d32b8cfa6a9aec978ed0874e1d70711b6607/packages/nextjs/src/editing/feaas-render-middleware.ts#L34)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`FEAASRenderMiddlewareConfig`](../interfaces/FEAASRenderMiddlewareConfig.md) | Editing render middleware config |

#### Returns

`FEAASRenderMiddleware`

#### Overrides

`RenderMiddlewareBase.constructor`

## Properties

### config?

> `protected` `optional` **config**: [`FEAASRenderMiddlewareConfig`](../interfaces/FEAASRenderMiddlewareConfig.md)

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/54e2d32b8cfa6a9aec978ed0874e1d70711b6607/packages/nextjs/src/editing/feaas-render-middleware.ts#L34)

Editing render middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:44](https://github.com/Sitecore/content-sdk/blob/54e2d32b8cfa6a9aec978ed0874e1d70711b6607/packages/nextjs/src/editing/feaas-render-middleware.ts#L44)

Gets the Next.js API route handler

#### Returns

route handler

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>

***

### getHeadersForPropagation()

> `protected` **getHeadersForPropagation**(`headers`): `object`

Defined in: [nextjs/src/editing/render-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/54e2d32b8cfa6a9aec978ed0874e1d70711b6607/packages/nextjs/src/editing/render-middleware.ts#L40)

Get headers that should be passed along to subsequent requests

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headers` | `Headers` \| `IncomingHttpHeaders` | Incoming HTTP Headers |

#### Returns

`object`

Object of approved headers

#### Inherited from

`RenderMiddlewareBase.getHeadersForPropagation`

***

### getQueryParamsForPropagation()

> `protected` **getQueryParamsForPropagation**(`query`): `object`

Defined in: [nextjs/src/editing/render-middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/54e2d32b8cfa6a9aec978ed0874e1d70711b6607/packages/nextjs/src/editing/render-middleware.ts#L18)

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
