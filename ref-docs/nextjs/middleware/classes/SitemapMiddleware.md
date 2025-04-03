[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / SitemapMiddleware

# Class: SitemapMiddleware

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:8](https://github.com/Sitecore/content-sdk/blob/0f8983961033e3434ebcac616164ddf8d484be81/packages/nextjs/src/middleware/sitemap-middleware.ts#L8)

Middleware for handling sitemap requests in a Next.js application.
Encapsulates all HTTP-related logic for sitemap generation and delivery.

## Constructors

### new SitemapMiddleware()

> **new SitemapMiddleware**(`client`): [`SitemapMiddleware`](SitemapMiddleware.md)

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:11](https://github.com/Sitecore/content-sdk/blob/0f8983961033e3434ebcac616164ddf8d484be81/packages/nextjs/src/middleware/sitemap-middleware.ts#L11)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `SitecoreClient` |

#### Returns

[`SitemapMiddleware`](SitemapMiddleware.md)

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/middleware/sitemap-middleware.ts:15](https://github.com/Sitecore/content-sdk/blob/0f8983961033e3434ebcac616164ddf8d484be81/packages/nextjs/src/middleware/sitemap-middleware.ts#L15)

#### Returns

`Function`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
