[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitemapXmlOptions

# Type Alias: SitemapXmlOptions

> **SitemapXmlOptions**: `object`

Defined in: [packages/core/src/client/sitecore-client.ts:56](https://github.com/Sitecore/content-sdk/blob/83cb65a3c972c72b48c373cdf1da3de357f70681/packages/core/src/client/sitecore-client.ts#L56)

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
