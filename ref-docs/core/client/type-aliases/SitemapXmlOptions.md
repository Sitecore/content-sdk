[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitemapXmlOptions

# Type Alias: SitemapXmlOptions

> **SitemapXmlOptions** = `object`

Defined in: [packages/core/src/client/sitecore-client.ts:57](https://github.com/Sitecore/content-sdk/blob/a712319c51b886f2d29baa88e1f9ca98c12e4c87/packages/core/src/client/sitecore-client.ts#L57)

Request options for the getSiteMap method

## Properties

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:63](https://github.com/Sitecore/content-sdk/blob/a712319c51b886f2d29baa88e1f9ca98c12e4c87/packages/core/src/client/sitecore-client.ts#L63)

Optional sitemap identifier when requesting a specific sitemap

***

### reqHost

> **reqHost**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:59](https://github.com/Sitecore/content-sdk/blob/a712319c51b886f2d29baa88e1f9ca98c12e4c87/packages/core/src/client/sitecore-client.ts#L59)

The hostname from the request (e.g., 'example.com')

***

### reqProtocol

> **reqProtocol**: `string` \| `string`[]

Defined in: [packages/core/src/client/sitecore-client.ts:61](https://github.com/Sitecore/content-sdk/blob/a712319c51b886f2d29baa88e1f9ca98c12e4c87/packages/core/src/client/sitecore-client.ts#L61)

The protocol from request headers (e.g., 'https' or 'http')

***

### siteName?

> `optional` **siteName**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:65](https://github.com/Sitecore/content-sdk/blob/a712319c51b886f2d29baa88e1f9ca98c12e4c87/packages/core/src/client/sitecore-client.ts#L65)

The site name to resolve the sitemap for
