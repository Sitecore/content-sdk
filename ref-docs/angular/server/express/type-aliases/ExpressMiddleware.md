[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/express](../README.md) / ExpressMiddleware

# Type Alias: ExpressMiddleware

> **ExpressMiddleware** = (`req`, `res`, `next`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/angular/src/server/models.ts:75](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/models.ts#L75)

Express-compatible middleware type

## Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | [`ExpressRequest`](../interfaces/ExpressRequest.md) |
| `res` | [`ExpressResponse`](../interfaces/ExpressResponse.md) |
| `next` | [`ExpressNextFunction`](ExpressNextFunction.md) |

## Returns

`void` \| `Promise`\<`void`\>
