[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [route-handler](../README.md) / createSitemapRouteHandler

# Function: createSitemapRouteHandler()

> **createSitemapRouteHandler**(`options`): `object`

Defined in: [nextjs/src/route-handler/sitemap-route-handler.ts:29](https://github.com/Sitecore/content-sdk/blob/b906e58a3d48beb6325e7fca193b7efa4653e6e5/packages/nextjs/src/route-handler/sitemap-route-handler.ts#L29)

Creates a route handler to serve the sitemap.xml file.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `RouteHandlerOptions` | The options for the route handler. |

## Returns

`object`

The route handler.

### GET()

> **GET**: (`req`) => `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Promise`\<`Response`\>
