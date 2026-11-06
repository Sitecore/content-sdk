[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / AllowedQueryParamsResolver

# Type Alias: AllowedQueryParamsResolver

> **AllowedQueryParamsResolver** = (`queryParams`) => ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[]

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:35](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/angular/src/server/middleware/editing-render-middleware.ts#L35)

Resolver function: receives the names of every query parameter on the
incoming editing request and returns the list of parameters to forward.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `queryParams` | `string`[] |

## Returns

([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[]
