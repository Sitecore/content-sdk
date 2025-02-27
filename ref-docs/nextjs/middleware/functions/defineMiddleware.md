[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / defineMiddleware

# Function: defineMiddleware()

> **defineMiddleware**(...`middlewares`): `object`

Defined in: [nextjs/src/middleware/middleware.ts:155](https://github.com/Sitecore/xmc-jss-dev/blob/061dc26bfb1145b183edd384dc843a42a29206eb/packages/nextjs/src/middleware/middleware.ts#L155)

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
