[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / SitemapMiddleware

# Class: SitemapMiddleware

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:13](https://github.com/Sitecore/content-sdk/blob/5991f1a4c56e3c96ca4c21000f5f32eaf78f2644/packages/nextjs/src/middleware/sitemap-middleware.ts#L13)

Middleware for handling sitemap requests in a Next.js application.
Encapsulates all HTTP-related logic for sitemap generation and delivery.

## Constructors

### Constructor

> **new SitemapMiddleware**(`client`, `sites`): `SitemapMiddleware`

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:17](https://github.com/Sitecore/content-sdk/blob/5991f1a4c56e3c96ca4c21000f5f32eaf78f2644/packages/nextjs/src/middleware/sitemap-middleware.ts#L17)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `SitecoreClient` |
| `sites` | [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[] |

#### Returns

`SitemapMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:22](https://github.com/Sitecore/content-sdk/blob/5991f1a4c56e3c96ca4c21000f5f32eaf78f2644/packages/nextjs/src/middleware/sitemap-middleware.ts#L22)

#### Returns

(`req`, `res`) => `Promise`\<`void`\>
