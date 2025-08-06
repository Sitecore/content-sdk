[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / EditingConfigMiddleware

# Class: EditingConfigMiddleware

<<<<<<< HEAD
Defined in: [nextjs/src/editing/editing-config-middleware.ts:29](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/editing-config-middleware.ts#L29)
=======
Defined in: [nextjs/src/editing/editing-config-middleware.ts:29](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/editing-config-middleware.ts#L29)
>>>>>>> dd686bb50 (Update API docs)

Middleware / handler used in the editing config API route in xmcloud add on (e.g. '/api/editing/config')
provides configuration information to determine feature compatibility on Pages side.

## Constructors

### Constructor

> **new EditingConfigMiddleware**(`config?`): `EditingConfigMiddleware`

<<<<<<< HEAD
Defined in: [nextjs/src/editing/editing-config-middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/editing-config-middleware.ts#L33)
=======
Defined in: [nextjs/src/editing/editing-config-middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/editing-config-middleware.ts#L33)
>>>>>>> dd686bb50 (Update API docs)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`EditingConfigMiddlewareConfig`](../type-aliases/EditingConfigMiddlewareConfig.md) | Editing configuration middleware config |

#### Returns

`EditingConfigMiddleware`

## Properties

### config

> `protected` **config**: [`EditingConfigMiddlewareConfig`](../type-aliases/EditingConfigMiddlewareConfig.md)

<<<<<<< HEAD
Defined in: [nextjs/src/editing/editing-config-middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/editing-config-middleware.ts#L33)
=======
Defined in: [nextjs/src/editing/editing-config-middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/editing-config-middleware.ts#L33)
>>>>>>> dd686bb50 (Update API docs)

Editing configuration middleware config

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [nextjs/src/editing/editing-config-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/editing/editing-config-middleware.ts#L39)
=======
Defined in: [nextjs/src/editing/editing-config-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/editing/editing-config-middleware.ts#L39)
>>>>>>> dd686bb50 (Update API docs)

Gets the Next.js API route handler

#### Returns

middleware handler

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
