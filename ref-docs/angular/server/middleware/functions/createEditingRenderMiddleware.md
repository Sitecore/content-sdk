[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createEditingRenderMiddleware

# Function: createEditingRenderMiddleware()

> **createEditingRenderMiddleware**(`options?`): [`ExpressMiddleware`](../../express/type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/editing-render-middleware.ts:168](https://github.com/Sitecore/content-sdk/blob/042f0f07645687a3cdaff7cd55b17797747e5352/packages/angular/src/server/middleware/editing-render-middleware.ts#L168)

Express middleware that handles the editing render endpoint
(default path: `/api/editing/render`). On a valid editor request, it
validates CORS + secret + required params, stashes the preview data on the
request, sets the CSP header, rewrites `req.url` to the target route, and
hands the request off to the Angular SSR pipeline via `next()`.

Unlike the Next.js port, no internal HTTP fetch is performed - the editing
payload travels alongside the Express request through the existing
middleware chain.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`CreateEditingRenderMiddlewareOptions`](../interfaces/CreateEditingRenderMiddlewareOptions.md) | Middleware options. |

## Returns

[`ExpressMiddleware`](../../express/type-aliases/ExpressMiddleware.md)

The middleware function.
