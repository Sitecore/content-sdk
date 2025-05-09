[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / Middleware

# Class: `abstract` Middleware

Defined in: [nextjs/src/middleware/middleware.ts:33](https://github.com/Sitecore/xmc-jss-dev/blob/f9dc77a03f449d6aeab48f0a439a870c5402c8c7/packages/nextjs/src/middleware/middleware.ts#L33)

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

Defined in: [nextjs/src/middleware/middleware.ts:40](https://github.com/Sitecore/xmc-jss-dev/blob/f9dc77a03f449d6aeab48f0a439a870c5402c8c7/packages/nextjs/src/middleware/middleware.ts#L40)

Handler method to execute middleware logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `ev` | `NextFetchEvent` | fetch event |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
