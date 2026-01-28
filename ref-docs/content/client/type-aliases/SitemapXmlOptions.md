[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / SitemapXmlOptions

# Type Alias: SitemapXmlOptions

> **SitemapXmlOptions** = `object`

Defined in: [content/src/client/sitecore-client.ts:121](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L121)

Request options for the getSiteMap method

## Properties

### id?

> `optional` **id**: `string`

Defined in: [content/src/client/sitecore-client.ts:127](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L127)

Optional sitemap identifier when requesting a specific sitemap

***

### reqHost

> **reqHost**: `string`

Defined in: [content/src/client/sitecore-client.ts:123](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L123)

The hostname from the request (e.g., 'example.com')

***

### reqProtocol

> **reqProtocol**: `string` \| `string`[]

Defined in: [content/src/client/sitecore-client.ts:125](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L125)

The protocol from request headers (e.g., 'https' or 'http')

***

### siteName?

> `optional` **siteName**: `string`

Defined in: [content/src/client/sitecore-client.ts:129](https://github.com/Sitecore/content-sdk/blob/d534b0a45dcbd360af2fbae85ddf06d144a8403c/packages/content/src/client/sitecore-client.ts#L129)

The site name to resolve the sitemap for
