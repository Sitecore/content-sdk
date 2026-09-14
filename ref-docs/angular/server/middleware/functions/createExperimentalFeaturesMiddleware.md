[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createExperimentalFeaturesMiddleware

# Function: createExperimentalFeaturesMiddleware()

> **createExperimentalFeaturesMiddleware**(`options?`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/experimental-features-middleware.ts:36](https://github.com/Sitecore/content-sdk/blob/df0ab91f7e1cc1e11e1d2458da0d151ccdbea3af/packages/angular/src/server/middleware/experimental-features-middleware.ts#L36)

Express middleware that serves the experimental features visibility endpoint
(default path: `/api/editing/experimental`). Returns available experimental
features and whether each is currently enabled.

Catalog is owned by this package (`src/experimental.json`) and is not app-configurable.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`CreateExperimentalFeaturesMiddlewareOptions`](../interfaces/CreateExperimentalFeaturesMiddlewareOptions.md) | Middleware options. |

## Returns

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

The middleware function.
