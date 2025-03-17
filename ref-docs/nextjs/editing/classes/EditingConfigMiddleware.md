[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingConfigMiddleware

# Class: EditingConfigMiddleware

Defined in: [nextjs/src/editing/editing-config-middleware.ts:27](https://github.com/Sitecore/xmc-jss-dev/blob/ee74fbe95e0fc8de46ce468c8a36831db55f7aeb/packages/nextjs/src/editing/editing-config-middleware.ts#L27)

Middleware / handler used in the editing config API route in xmcloud add on (e.g. '/api/editing/config')
provides configuration information to determine feature compatibility on Pages side.

## Constructors

### new EditingConfigMiddleware()

> **new EditingConfigMiddleware**(`config`?): [`EditingConfigMiddleware`](EditingConfigMiddleware.md)

Defined in: [nextjs/src/editing/editing-config-middleware.ts:31](https://github.com/Sitecore/xmc-jss-dev/blob/ee74fbe95e0fc8de46ce468c8a36831db55f7aeb/packages/nextjs/src/editing/editing-config-middleware.ts#L31)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | [`EditingConfigMiddlewareConfig`](../type-aliases/EditingConfigMiddlewareConfig.md) | Editing configuration middleware config |

#### Returns

[`EditingConfigMiddleware`](EditingConfigMiddleware.md)

## Properties

### config

> `protected` **config**: [`EditingConfigMiddlewareConfig`](../type-aliases/EditingConfigMiddlewareConfig.md)

Defined in: [nextjs/src/editing/editing-config-middleware.ts:31](https://github.com/Sitecore/xmc-jss-dev/blob/ee74fbe95e0fc8de46ce468c8a36831db55f7aeb/packages/nextjs/src/editing/editing-config-middleware.ts#L31)

Editing configuration middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/editing-config-middleware.ts:37](https://github.com/Sitecore/xmc-jss-dev/blob/ee74fbe95e0fc8de46ce468c8a36831db55f7aeb/packages/nextjs/src/editing/editing-config-middleware.ts#L37)

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
