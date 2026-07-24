[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createEditingRenderMiddleware

# Function: createEditingRenderMiddleware()

> **createEditingRenderMiddleware**(`options?`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:167](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/server/middleware/editing-render-middleware.ts#L167)

Express middleware that handles the editing render endpoint
(default path: `/api/editing/render`). On a valid editor request, it
validates CORS + secret + required params, stashes the preview data on the
request, sets the CSP header, rewrites `req.url` to the target route, and
hands the request off to the Angular SSR pipeline via `next()`.

No internal HTTP fetch is performed - the editing
payload travels alongside the Express request through the existing
middleware chain.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`CreateEditingRenderMiddlewareOptions`](../interfaces/CreateEditingRenderMiddlewareOptions.md) | Middleware options. |

## Returns

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

The middleware function.
