[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / ExperimentalFeaturesMiddleware

# Class: ExperimentalFeaturesMiddleware

Defined in: [nextjs/src/editing/experimental-features-middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/f0d8e2f2a4d2702c275ba74dc0030e61bf69fd01/packages/nextjs/src/editing/experimental-features-middleware.ts#L18)

Middleware / handler used in the experimental features API route
(e.g. '/api/editing/experimental'). Exposes available experimental features
and whether each is currently enabled, for Sitecore AI / editing host consumers.

Catalog is owned by this package (`src/experimental.json`) and is not app-configurable.

## Constructors

### Constructor

> **new ExperimentalFeaturesMiddleware**(): `ExperimentalFeaturesMiddleware`

#### Returns

`ExperimentalFeaturesMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/editing/experimental-features-middleware.ts:23](https://github.com/Sitecore/content-sdk/blob/f0d8e2f2a4d2702c275ba74dc0030e61bf69fd01/packages/nextjs/src/editing/experimental-features-middleware.ts#L23)

Gets the Next.js API route handler

#### Returns

middleware handler

(`req`, `res`) => `Promise`\<`void`\>
