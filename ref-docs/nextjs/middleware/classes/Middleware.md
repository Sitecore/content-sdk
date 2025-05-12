[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / Middleware

# Class: `abstract` Middleware

Defined in: [nextjs/src/middleware/middleware.ts:37](https://github.com/Sitecore/xmc-jss-dev/blob/e071b5c5bcc29ad3f8f0d1250181261d976b39d1/packages/nextjs/src/middleware/middleware.ts#L37)

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

Defined in: [nextjs/src/middleware/middleware.ts:44](https://github.com/Sitecore/xmc-jss-dev/blob/e071b5c5bcc29ad3f8f0d1250181261d976b39d1/packages/nextjs/src/middleware/middleware.ts#L44)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `ev` | `NextFetchEvent` | fetch event |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
