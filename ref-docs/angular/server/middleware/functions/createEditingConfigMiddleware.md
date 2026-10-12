[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createEditingConfigMiddleware

# Function: createEditingConfigMiddleware()

> **createEditingConfigMiddleware**(`options`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:107](https://github.com/Sitecore/content-sdk/blob/d153ea0b9ebac2083b9f58f493cfe6e81e7b4fb0/packages/angular/src/server/middleware/editing-config-middleware.ts#L107)

Express middleware that serves the editing config endpoint
(default path: `/api/editing/config`). Returns the registered component names,
package versions, and the configured edit mode.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`CreateEditingConfigMiddlewareOptions`](../interfaces/CreateEditingConfigMiddlewareOptions.md) | Middleware options. |

## Returns

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

The middleware function.
