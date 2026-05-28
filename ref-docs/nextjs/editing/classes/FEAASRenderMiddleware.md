[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / FEAASRenderMiddleware

# Class: FEAASRenderMiddleware

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:30](https://github.com/Sitecore/content-sdk/blob/856cb89263cff3f1e39e74ebd0ae054e4bd68391/packages/nextjs/src/editing/feaas-render-middleware.ts#L30)

Middleware / handler for use in the feaas render Next.js API route (e.g. '/api/editing/feaas/render')
which is required for Sitecore editing support.

## Extends

- `RenderMiddlewareBase`

## Constructors

### Constructor

> **new FEAASRenderMiddleware**(`config?`): `FEAASRenderMiddleware`

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:37](https://github.com/Sitecore/content-sdk/blob/856cb89263cff3f1e39e74ebd0ae054e4bd68391/packages/nextjs/src/editing/feaas-render-middleware.ts#L37)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`FEAASRenderMiddlewareConfig`](../interfaces/FEAASRenderMiddlewareConfig.md) | FEAAS render middleware config |

#### Returns

`FEAASRenderMiddleware`

#### Overrides

`RenderMiddlewareBase.constructor`

## Properties

### config?

> `protected` `optional` **config?**: [`FEAASRenderMiddlewareConfig`](../interfaces/FEAASRenderMiddlewareConfig.md)

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:37](https://github.com/Sitecore/content-sdk/blob/856cb89263cff3f1e39e74ebd0ae054e4bd68391/packages/nextjs/src/editing/feaas-render-middleware.ts#L37)

FEAAS render middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:47](https://github.com/Sitecore/content-sdk/blob/856cb89263cff3f1e39e74ebd0ae054e4bd68391/packages/nextjs/src/editing/feaas-render-middleware.ts#L47)

Gets the Next.js API route handler

#### Returns

route handler

(`req`, `res`) => `Promise`\<`void`\>

***

### getHeadersForPropagation()

> `protected` **getHeadersForPropagation**(`headers`): `object`

Defined in: [nextjs/src/editing/render-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/856cb89263cff3f1e39e74ebd0ae054e4bd68391/packages/nextjs/src/editing/render-middleware.ts#L40)

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

Defined in: [nextjs/src/editing/render-middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/856cb89263cff3f1e39e74ebd0ae054e4bd68391/packages/nextjs/src/editing/render-middleware.ts#L18)

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
