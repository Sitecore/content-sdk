[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / ExperimentalFeaturesMiddleware

# Class: ExperimentalFeaturesMiddleware

Defined in: [nextjs/src/editing/experimental-features-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/8f962400f3b79f00425a8cd76a6d2082b5b47c47/packages/nextjs/src/editing/experimental-features-middleware.ts#L21)

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

Defined in: [nextjs/src/editing/experimental-features-middleware.ts:26](https://github.com/Sitecore/content-sdk/blob/8f962400f3b79f00425a8cd76a6d2082b5b47c47/packages/nextjs/src/editing/experimental-features-middleware.ts#L26)

Gets the Next.js API route handler

#### Returns

middleware handler

(`req`, `res`) => `Promise`\<`void`\>
