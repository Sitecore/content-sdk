[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createEditingConfigMiddleware

# Function: createEditingConfigMiddleware()

> **createEditingConfigMiddleware**(`options`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/editing-config-middleware.ts:112](https://github.com/Sitecore/content-sdk/blob/51a9829bf867488124b20691dcc78e44f942c3db/packages/angular/src/server/middleware/editing-config-middleware.ts#L112)

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
