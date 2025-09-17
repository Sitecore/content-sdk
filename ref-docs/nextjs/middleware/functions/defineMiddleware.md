[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / defineMiddleware

# Function: defineMiddleware()

> **defineMiddleware**(...`middlewares`): `object`

Defined in: [nextjs/src/middleware/middleware.ts:216](https://github.com/Sitecore/content-sdk/blob/c09209f470e4296742157cb93ea93261fcb5b348/packages/nextjs/src/middleware/middleware.ts#L216)

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
