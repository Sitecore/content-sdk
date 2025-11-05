[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / SitemapMiddleware

# Class: SitemapMiddleware

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:9](https://github.com/Sitecore/content-sdk/blob/f2948d819f7079524f7ecc571981b044a2f89025/packages/nextjs/src/middleware/sitemap-middleware.ts#L9)

Middleware for handling sitemap requests in a Next.js application.
Encapsulates all HTTP-related logic for sitemap generation and delivery.

## Constructors

### Constructor

> **new SitemapMiddleware**(`client`, `sites`): `SitemapMiddleware`

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:13](https://github.com/Sitecore/content-sdk/blob/f2948d819f7079524f7ecc571981b044a2f89025/packages/nextjs/src/middleware/sitemap-middleware.ts#L13)

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

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/f2948d819f7079524f7ecc571981b044a2f89025/packages/nextjs/src/middleware/sitemap-middleware.ts#L18)

#### Returns

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
