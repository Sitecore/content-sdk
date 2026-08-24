[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createExperimentalFeaturesMiddleware

# Function: createExperimentalFeaturesMiddleware()

> **createExperimentalFeaturesMiddleware**(`options?`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/experimental-features-middleware.ts:36](https://github.com/Sitecore/content-sdk/blob/9b45c283e831ade8b97eab10178dc32f73796f7e/packages/angular/src/server/middleware/experimental-features-middleware.ts#L36)

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
