[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / defineMiddleware

# Function: defineMiddleware()

> **defineMiddleware**(...`middlewares`): `object`

Defined in: [nextjs/src/middleware/middleware.ts:198](https://github.com/Sitecore/content-sdk/blob/aa750ff65c30a6af235feb8f0c06200bf7a9ebcb/packages/nextjs/src/middleware/middleware.ts#L198)

Define a middleware with a list of middlewares

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`middlewares` | [`Middleware`](../classes/Middleware.md)[] | List of middlewares to execute |

## Returns

### exec()

> **exec**: (`req`, `ev`, `res?`) => `Promise`\<`NextResponse`\<`unknown`\>\>

Execute all middlewares

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `ev` | `NextFetchEvent` | fetch event |
| `res?` | `NextResponse`\<`unknown`\> | response |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
