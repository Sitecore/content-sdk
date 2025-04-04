[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / FEAASRenderMiddleware

# Class: FEAASRenderMiddleware

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:27](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/nextjs/src/editing/feaas-render-middleware.ts#L27)

Middleware / handler for use in the feaas render Next.js API route (e.g. '/api/editing/feaas/render')
which is required for Sitecore editing support.

## Extends

- `RenderMiddlewareBase`

## Constructors

### new FEAASRenderMiddleware()

> **new FEAASRenderMiddleware**(`config`?): [`FEAASRenderMiddleware`](FEAASRenderMiddleware.md)

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/nextjs/src/editing/feaas-render-middleware.ts#L34)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | [`FEAASRenderMiddlewareConfig`](../interfaces/FEAASRenderMiddlewareConfig.md) | Editing render middleware config |

#### Returns

[`FEAASRenderMiddleware`](FEAASRenderMiddleware.md)

#### Overrides

`RenderMiddlewareBase.constructor`

## Properties

### config?

> `protected` `optional` **config**: [`FEAASRenderMiddlewareConfig`](../interfaces/FEAASRenderMiddlewareConfig.md)

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/nextjs/src/editing/feaas-render-middleware.ts#L34)

Editing render middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:44](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/nextjs/src/editing/feaas-render-middleware.ts#L44)

Gets the Next.js API route handler

#### Returns

`Function`

route handler

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

Defined in: [nextjs/src/editing/render-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/nextjs/src/editing/render-middleware.ts#L39)

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

Defined in: [nextjs/src/editing/render-middleware.ts:17](https://github.com/Sitecore/content-sdk/blob/583ad5957e2a493b98fa21293939a57df8afd235/packages/nextjs/src/editing/render-middleware.ts#L17)

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
