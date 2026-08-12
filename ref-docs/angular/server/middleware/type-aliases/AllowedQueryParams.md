[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / AllowedQueryParams

# Type Alias: AllowedQueryParams

> **AllowedQueryParams** = ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[] \| [`AllowedQueryParamsResolver`](AllowedQueryParamsResolver.md)

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/08b5216f27c90a395a5ac8aa21cca1fd107676c6/packages/angular/src/server/middleware/editing-render-middleware.ts#L40)

Allowed query parameters configuration for [createEditingRenderMiddleware](../functions/createEditingRenderMiddleware.md).
Either an array of parameter names / specs, or a resolver function.
