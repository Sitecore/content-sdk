[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / Middleware

# Class: `abstract` Middleware

Defined in: [nextjs/src/middleware/middleware.ts:31](https://github.com/Sitecore/xmc-jss-dev/blob/2e6668e53da88ec1fae89d8114202dfa302a9374/packages/nextjs/src/middleware/middleware.ts#L31)

Middleware class to be extended by all middleware implementations

## Extended by

- [`MiddlewareBase`](MiddlewareBase.md)

## Constructors

### new Middleware()

> **new Middleware**(): [`Middleware`](Middleware.md)

#### Returns

[`Middleware`](Middleware.md)

## Methods

### handle()

> `abstract` **handle**(`req`, `res`, `ev`): `Promise`\<`NextResponse`\>

Defined in: [nextjs/src/middleware/middleware.ts:38](https://github.com/Sitecore/xmc-jss-dev/blob/2e6668e53da88ec1fae89d8114202dfa302a9374/packages/nextjs/src/middleware/middleware.ts#L38)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `ev` | `NextFetchEvent` | fetch event |

#### Returns

`Promise`\<`NextResponse`\>
