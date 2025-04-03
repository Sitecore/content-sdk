[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / Middleware

# Class: `abstract` Middleware

Defined in: [nextjs/src/middleware/middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/4103c5589d5589e11cd6164ccfd2c9755e694a65/packages/nextjs/src/middleware/middleware.ts#L33)

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

Defined in: [nextjs/src/middleware/middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/4103c5589d5589e11cd6164ccfd2c9755e694a65/packages/nextjs/src/middleware/middleware.ts#L40)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `ev` | `NextFetchEvent` | fetch event |

#### Returns

`Promise`\<`NextResponse`\>
