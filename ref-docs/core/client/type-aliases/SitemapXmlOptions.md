[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitemapXmlOptions

# Type Alias: SitemapXmlOptions

> **SitemapXmlOptions**: `object`

Defined in: [packages/core/src/client/sitecore-client.ts:56](https://github.com/Sitecore/content-sdk/blob/a00b062a2ee4ebc6a389a9fef916f3305844d144/packages/core/src/client/sitecore-client.ts#L56)

Request options for the getSiteMap method

## Type declaration

### id?

> `optional` **id**: `string`

Optional sitemap identifier when requesting a specific sitemap

### reqHost

> **reqHost**: `string`

The hostname from the request (e.g., 'example.com')

### reqProtocol

> **reqProtocol**: `string` \| `string`[]

The protocol from request headers (e.g., 'https' or 'http')

### siteName?

> `optional` **siteName**: `string`

The site name to resolve the sitemap for
