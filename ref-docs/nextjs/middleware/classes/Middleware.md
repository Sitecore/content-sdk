[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / Middleware

# Class: `abstract` Middleware

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:37](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L37)
=======
Defined in: [nextjs/src/middleware/middleware.ts:37](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L37)
>>>>>>> dd686bb50 (Update API docs)

Middleware class to be extended by all middleware implementations

## Extended by

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### Constructor

> **new Middleware**(): `Middleware`

#### Returns

`Middleware`

## Methods

### handle()

> `abstract` **handle**(`req`, `res`, `ev`): `Promise`\<`NextResponse`\<`unknown`\>\>

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/middleware.ts:44](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/middleware.ts#L44)
=======
Defined in: [nextjs/src/middleware/middleware.ts:44](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/middleware.ts#L44)
>>>>>>> dd686bb50 (Update API docs)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `ev` | `NextFetchEvent` | fetch event |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
