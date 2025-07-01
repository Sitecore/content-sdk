[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitemapXmlOptions

# Type Alias: SitemapXmlOptions

> **SitemapXmlOptions** = `object`

Defined in: [packages/core/src/client/sitecore-client.ts:50](https://github.com/Sitecore/content-sdk/blob/a2735a71df797576a45d3bb911b3f6b1fcfb8360/packages/core/src/client/sitecore-client.ts#L50)

Request options for the getSiteMap method

## Properties

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:56](https://github.com/Sitecore/content-sdk/blob/a2735a71df797576a45d3bb911b3f6b1fcfb8360/packages/core/src/client/sitecore-client.ts#L56)

Optional sitemap identifier when requesting a specific sitemap

***

### reqHost

> **reqHost**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:52](https://github.com/Sitecore/content-sdk/blob/a2735a71df797576a45d3bb911b3f6b1fcfb8360/packages/core/src/client/sitecore-client.ts#L52)

The hostname from the request (e.g., 'example.com')

***

### reqProtocol

> **reqProtocol**: `string` \| `string`[]

Defined in: [packages/core/src/client/sitecore-client.ts:54](https://github.com/Sitecore/content-sdk/blob/a2735a71df797576a45d3bb911b3f6b1fcfb8360/packages/core/src/client/sitecore-client.ts#L54)

The protocol from request headers (e.g., 'https' or 'http')

***

### siteName?

> `optional` **siteName**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:58](https://github.com/Sitecore/content-sdk/blob/a2735a71df797576a45d3bb911b3f6b1fcfb8360/packages/core/src/client/sitecore-client.ts#L58)

The site name to resolve the sitemap for
