[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createEditingConfigMiddleware

# Function: createEditingConfigMiddleware()

> **createEditingConfigMiddleware**(`options`): [`ExpressMiddleware`](../../express/type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:108](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/server/middleware/editing-config-middleware.ts#L108)

Express middleware that serves the editing config endpoint
(default path: `/api/editing/config`). Mirrors the Next.js
`EditingConfigMiddleware` and returns the registered component names,
package versions, and the configured edit mode.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`CreateEditingConfigMiddlewareOptions`](../interfaces/CreateEditingConfigMiddlewareOptions.md) | Middleware options. |

## Returns

[`ExpressMiddleware`](../../express/type-aliases/ExpressMiddleware.md)

The middleware function.
