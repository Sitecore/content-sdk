[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / SitemapMiddleware

# Class: SitemapMiddleware

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:8](https://github.com/Sitecore/content-sdk/blob/d4cd22bf5a3ce46c0788d7f3685bca4d16dcca42/packages/nextjs/src/middleware/sitemap-middleware.ts#L8)

Middleware for handling sitemap requests in a Next.js application.
Encapsulates all HTTP-related logic for sitemap generation and delivery.

## Constructors

### Constructor

> **new SitemapMiddleware**(`client`): `SitemapMiddleware`

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:11](https://github.com/Sitecore/content-sdk/blob/d4cd22bf5a3ce46c0788d7f3685bca4d16dcca42/packages/nextjs/src/middleware/sitemap-middleware.ts#L11)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `SitecoreClient` |

#### Returns

`SitemapMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:15](https://github.com/Sitecore/content-sdk/blob/d4cd22bf5a3ce46c0788d7f3685bca4d16dcca42/packages/nextjs/src/middleware/sitemap-middleware.ts#L15)

#### Returns

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
