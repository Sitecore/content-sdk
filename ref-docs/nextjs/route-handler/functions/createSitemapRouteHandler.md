[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createSitemapRouteHandler

# Function: createSitemapRouteHandler()

> **createSitemapRouteHandler**(`options`): `object`

Defined in: [nextjs/src/route-handler/sitemap-route-handler.ts:30](https://github.com/Sitecore/content-sdk/blob/c876e4539ff3eeebb114160dc3159c5d1ae13766/packages/nextjs/src/route-handler/sitemap-route-handler.ts#L30)

Creates a route handler to serve the sitemap.xml file.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `RouteHandlerOptions` | The options for the route handler. |

## Returns

`object`

The route handler.

### GET

> **GET**: (`req`) => `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`Response`\>
