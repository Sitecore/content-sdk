[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createExperimentalFeaturesRouteHandler

# Function: createExperimentalFeaturesRouteHandler()

> **createExperimentalFeaturesRouteHandler**(): `object`

Defined in: [nextjs/src/route-handler/experimental-features-route-handler.ts:19](https://github.com/Sitecore/content-sdk/blob/16c65a296cb6c3751cf2bd6cd678c6ae93f8c499/packages/nextjs/src/route-handler/experimental-features-route-handler.ts#L19)

Creates a route handler for the experimental features API route
(e.g. '/api/editing/experimental'). Exposes available experimental features
and whether each is currently enabled, for Sitecore AI / editing host consumers.

Catalog is owned by this package (`src/experimental.json`) and is not app-configurable.

## Returns

`object`

The route handler with GET and OPTIONS methods.

### GET

> **GET**: (`req`) => `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`Response`\>

### OPTIONS

> **OPTIONS**: (`req`) => `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`Response`\>
