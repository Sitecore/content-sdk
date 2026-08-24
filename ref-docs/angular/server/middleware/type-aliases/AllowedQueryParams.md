[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / AllowedQueryParams

# Type Alias: AllowedQueryParams

> **AllowedQueryParams** = ([`AllowedQueryParam`](../interfaces/AllowedQueryParam.md) \| `string`)[] \| [`AllowedQueryParamsResolver`](AllowedQueryParamsResolver.md)

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:40](https://github.com/Sitecore/content-sdk/blob/9b45c283e831ade8b97eab10178dc32f73796f7e/packages/angular/src/server/middleware/editing-render-middleware.ts#L40)

Allowed query parameters configuration for [createEditingRenderMiddleware](../functions/createEditingRenderMiddleware.md).
Either an array of parameter names / specs, or a resolver function.
