[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / SitemapMiddleware

# Class: SitemapMiddleware

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/sitemap-middleware.ts:9](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/sitemap-middleware.ts#L9)
=======
Defined in: [nextjs/src/middleware/sitemap-middleware.ts:9](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/sitemap-middleware.ts#L9)
>>>>>>> dd686bb50 (Update API docs)

Middleware for handling sitemap requests in a Next.js application.
Encapsulates all HTTP-related logic for sitemap generation and delivery.

## Constructors

### Constructor

> **new SitemapMiddleware**(`client`, `sites`): `SitemapMiddleware`

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/sitemap-middleware.ts:13](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/sitemap-middleware.ts#L13)
=======
Defined in: [nextjs/src/middleware/sitemap-middleware.ts:13](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/sitemap-middleware.ts#L13)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [nextjs/src/middleware/sitemap-middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/middleware/sitemap-middleware.ts#L18)
=======
Defined in: [nextjs/src/middleware/sitemap-middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/middleware/sitemap-middleware.ts#L18)
>>>>>>> dd686bb50 (Update API docs)

#### Returns

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
