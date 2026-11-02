[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / AllowedQueryParams

# Type Alias: AllowedQueryParams

> **AllowedQueryParams** = ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[] \| [`AllowedQueryParamsResolver`](AllowedQueryParamsResolver.md)

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:44](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/server/middleware/editing-render-middleware.ts#L44)

Allowed query parameters configuration for [createEditingRenderMiddleware](../functions/createEditingRenderMiddleware.md).
Either an array of parameter names / specs, or a resolver function.
