[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / defineMiddleware

# Function: defineMiddleware()

> **defineMiddleware**(...`middlewares`): `object`

Defined in: [nextjs/src/middleware/middleware.ts:178](https://github.com/Sitecore/xmc-jss-dev/blob/4ce11b2e66350058dfba252d10945c5c8009d3d8/packages/nextjs/src/middleware/middleware.ts#L178)

Define a middleware with a list of middlewares

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`middlewares` | [`Middleware`](../classes/Middleware.md)[] | List of middlewares to execute |

## Returns

`object`

### exec()

> **exec**: (`req`, `ev`, `res`?) => `Promise`\<`NextResponse`\>

Execute all middlewares

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `ev` | `NextFetchEvent` | fetch event |
| `res`? | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\>
