[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / AllowedQueryParamsResolver

# Type Alias: AllowedQueryParamsResolver

> **AllowedQueryParamsResolver** = (`queryParams`) => ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[]

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627/packages/angular/src/server/middleware/editing-render-middleware.ts#L31)

Resolver function: receives the names of every query parameter on the
incoming editing request and returns the list of parameters to forward.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `queryParams` | `string`[] |

## Returns

([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[]
