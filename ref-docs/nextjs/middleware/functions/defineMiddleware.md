[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / defineMiddleware

# Function: defineMiddleware()

> **defineMiddleware**(...`middlewares`): `object`

Defined in: [nextjs/src/middleware/middleware.ts:160](https://github.com/Sitecore/xmc-jss-dev/blob/171a564b4cd6bd5a7eef15aa45c0e2689d16cb88/packages/nextjs/src/middleware/middleware.ts#L160)

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
