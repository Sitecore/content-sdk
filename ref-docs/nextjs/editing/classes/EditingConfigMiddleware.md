[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingConfigMiddleware

# Class: EditingConfigMiddleware

Defined in: [nextjs/src/editing/editing-config-middleware.ts:29](https://github.com/Sitecore/content-sdk/blob/d66d73920955c32f18807cacf98f4ede97be14bd/packages/nextjs/src/editing/editing-config-middleware.ts#L29)

Middleware / handler used in the editing config API route in xmcloud add on (e.g. '/api/editing/config')
provides configuration information to determine feature compatibility on Pages side.

## Constructors

### new EditingConfigMiddleware()

> **new EditingConfigMiddleware**(`config`?): [`EditingConfigMiddleware`](EditingConfigMiddleware.md)

Defined in: [nextjs/src/editing/editing-config-middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/d66d73920955c32f18807cacf98f4ede97be14bd/packages/nextjs/src/editing/editing-config-middleware.ts#L33)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | [`EditingConfigMiddlewareConfig`](../type-aliases/EditingConfigMiddlewareConfig.md) | Editing configuration middleware config |

#### Returns

[`EditingConfigMiddleware`](EditingConfigMiddleware.md)

## Properties

### config

> `protected` **config**: [`EditingConfigMiddlewareConfig`](../type-aliases/EditingConfigMiddlewareConfig.md)

Defined in: [nextjs/src/editing/editing-config-middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/d66d73920955c32f18807cacf98f4ede97be14bd/packages/nextjs/src/editing/editing-config-middleware.ts#L33)

Editing configuration middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/editing-config-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/d66d73920955c32f18807cacf98f4ede97be14bd/packages/nextjs/src/editing/editing-config-middleware.ts#L39)

Gets the Next.js API route handler

#### Returns

`Function`

middleware handler

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
