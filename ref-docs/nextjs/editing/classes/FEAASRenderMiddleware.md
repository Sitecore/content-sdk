[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / FEAASRenderMiddleware

# Class: FEAASRenderMiddleware

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:29](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/nextjs/src/editing/feaas-render-middleware.ts#L29)

Middleware / handler for use in the feaas render Next.js API route (e.g. '/api/editing/feaas/render')
which is required for Sitecore editing support.

## Extends

- `RenderMiddlewareBase`

## Constructors

### Constructor

> **new FEAASRenderMiddleware**(`config?`): `FEAASRenderMiddleware`

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:36](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/nextjs/src/editing/feaas-render-middleware.ts#L36)

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

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:36](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/nextjs/src/editing/feaas-render-middleware.ts#L36)

Editing render middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/feaas-render-middleware.ts:46](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/nextjs/src/editing/feaas-render-middleware.ts#L46)

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

Defined in: [nextjs/src/editing/render-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/nextjs/src/editing/render-middleware.ts#L40)

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

Defined in: [nextjs/src/editing/render-middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/nextjs/src/editing/render-middleware.ts#L18)

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
