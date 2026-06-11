[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingConfigMiddleware

# Class: EditingConfigMiddleware

Defined in: [nextjs/src/editing/editing-config-middleware.ts:34](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/nextjs/src/editing/editing-config-middleware.ts#L34)

Middleware / handler used in the editing config API route in xmcloud add on (e.g. '/api/editing/config')
provides configuration information to determine feature compatibility on Pages side.

## Constructors

### Constructor

> **new EditingConfigMiddleware**(`config?`): `EditingConfigMiddleware`

Defined in: [nextjs/src/editing/editing-config-middleware.ts:38](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/nextjs/src/editing/editing-config-middleware.ts#L38)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`EditingConfigMiddlewareConfig`](../type-aliases/EditingConfigMiddlewareConfig.md) | Editing configuration middleware config |

#### Returns

`EditingConfigMiddleware`

## Properties

### config

> `protected` **config**: [`EditingConfigMiddlewareConfig`](../type-aliases/EditingConfigMiddlewareConfig.md)

Defined in: [nextjs/src/editing/editing-config-middleware.ts:38](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/nextjs/src/editing/editing-config-middleware.ts#L38)

Editing configuration middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/editing-config-middleware.ts:44](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/nextjs/src/editing/editing-config-middleware.ts#L44)

Gets the Next.js API route handler

#### Returns

middleware handler

(`req`, `res`) => `Promise`\<`void`\>
