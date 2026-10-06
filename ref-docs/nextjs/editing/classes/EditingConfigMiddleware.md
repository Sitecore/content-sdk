[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingConfigMiddleware

# Class: EditingConfigMiddleware

Defined in: [nextjs/src/editing/editing-config-middleware.ts:41](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/nextjs/src/editing/editing-config-middleware.ts#L41)

Middleware / handler used in the editing config API route in xmcloud add on (e.g. '/api/editing/config')
provides configuration information to determine feature compatibility on Pages side.

## Constructors

### Constructor

> **new EditingConfigMiddleware**(`config?`): `EditingConfigMiddleware`

Defined in: [nextjs/src/editing/editing-config-middleware.ts:45](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/nextjs/src/editing/editing-config-middleware.ts#L45)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`EditingConfigMiddlewareConfig`](../type-aliases/EditingConfigMiddlewareConfig.md) | Editing configuration middleware config |

#### Returns

`EditingConfigMiddleware`

## Properties

### config

> `protected` **config**: [`EditingConfigMiddlewareConfig`](../type-aliases/EditingConfigMiddlewareConfig.md)

Defined in: [nextjs/src/editing/editing-config-middleware.ts:45](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/nextjs/src/editing/editing-config-middleware.ts#L45)

Editing configuration middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/editing-config-middleware.ts:51](https://github.com/Sitecore/content-sdk/blob/bd4d0720071b7055a086bf071f7474f03927a82d/packages/nextjs/src/editing/editing-config-middleware.ts#L51)

Gets the Next.js API route handler

#### Returns

middleware handler

(`req`, `res`) => `Promise`\<`void`\>
