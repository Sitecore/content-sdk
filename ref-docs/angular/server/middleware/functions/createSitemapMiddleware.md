[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / createSitemapMiddleware

# Function: createSitemapMiddleware()

> **createSitemapMiddleware**(`options`): [`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)

Defined in: [packages/angular/src/server/middleware/sitemap-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/87b8db38cdfb3e7cc6391de3955f794aecc8b8e9/packages/angular/src/server/middleware/sitemap-middleware.ts#L21)

Sitemap handler for Express. Mount at `/sitemap.xml` and `/sitemap-:id.xml`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`CreateSitemapMiddlewareOptions`](../interfaces/CreateSitemapMiddlewareOptions.md) | Middleware options. |

## Returns

[`ExpressMiddleware`](../type-aliases/ExpressMiddleware.md)
