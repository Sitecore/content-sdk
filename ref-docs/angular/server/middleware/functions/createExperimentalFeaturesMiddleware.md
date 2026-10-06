[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createExperimentalFeaturesMiddleware

# Function: createExperimentalFeaturesMiddleware()

> **createExperimentalFeaturesMiddleware**(`options?`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/experimental-features-middleware.ts:33](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/angular/src/server/middleware/experimental-features-middleware.ts#L33)

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
