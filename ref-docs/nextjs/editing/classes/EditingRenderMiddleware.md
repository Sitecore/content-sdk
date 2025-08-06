[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingRenderMiddleware

# Class: EditingRenderMiddleware

<<<<<<< HEAD
Defined in: [nextjs/src/editing/editing-render-middleware.ts:61](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/editing-render-middleware.ts#L61)
=======
Defined in: [nextjs/src/editing/editing-render-middleware.ts:61](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/editing-render-middleware.ts#L61)
>>>>>>> dd686bb50 (Update API docs)

Middleware / handler for use in the editing render Next.js API route (e.g. '/api/editing/render')
which is required for Sitecore editing support.

## Extends

- `RenderMiddlewareBase`

## Constructors

### Constructor

> **new EditingRenderMiddleware**(`config?`): `EditingRenderMiddleware`

<<<<<<< HEAD
Defined in: [nextjs/src/editing/editing-render-middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/editing-render-middleware.ts#L65)
=======
Defined in: [nextjs/src/editing/editing-render-middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/editing-render-middleware.ts#L65)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/editing/editing-render-middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/editing-render-middleware.ts#L65)
=======
Defined in: [nextjs/src/editing/editing-render-middleware.ts:65](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/editing-render-middleware.ts#L65)
>>>>>>> dd686bb50 (Update API docs)

Editing render middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [nextjs/src/editing/editing-render-middleware.ts:73](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/editing-render-middleware.ts#L73)
=======
Defined in: [nextjs/src/editing/editing-render-middleware.ts:73](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/editing-render-middleware.ts#L73)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/editing/render-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/render-middleware.ts#L39)
=======
Defined in: [nextjs/src/editing/render-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/render-middleware.ts#L39)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/editing/render-middleware.ts:17](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/render-middleware.ts#L17)
=======
Defined in: [nextjs/src/editing/render-middleware.ts:17](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/render-middleware.ts#L17)
>>>>>>> dd686bb50 (Update API docs)

Gets query parameters that should be passed along to subsequent requests (e.g. for deployment protection bypass)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `query` | `Partial`\<\{[`key`: `string`]: `string` \| `string`[]; \}\> | Object of query parameters from incoming URL |

#### Returns

`object`

Object of approved query parameters

#### Inherited from

`RenderMiddlewareBase.getQueryParamsForPropagation`
