[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / ExpressMiddleware

# Type Alias: ExpressMiddleware

> **ExpressMiddleware** = (`req`, `res`, `next`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/angular/src/server/middleware/models.ts:26](https://github.com/Sitecore/content-sdk/blob/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639/packages/angular/src/server/middleware/models.ts#L26)

Express-compatible middleware type

## Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | [`ExpressRequest`](../interfaces/ExpressRequest.md) |
| `res` | [`ExpressResponse`](../interfaces/ExpressResponse.md) |
| `next` | [`ExpressNextFunction`](ExpressNextFunction.md) |

## Returns

`void` \| `Promise`\<`void`\>
