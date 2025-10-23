[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / Middleware

# Abstract Class: Middleware

Defined in: [nextjs/src/middleware/middleware.ts:38](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/nextjs/src/middleware/middleware.ts#L38)

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

Defined in: [nextjs/src/middleware/middleware.ts:45](https://github.com/Sitecore/content-sdk/blob/685d5642934579f7870610a5d3e64f5d001ae881/packages/nextjs/src/middleware/middleware.ts#L45)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `ev` | `NextFetchEvent` | fetch event |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
