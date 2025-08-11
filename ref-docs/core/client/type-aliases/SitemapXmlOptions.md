[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitemapXmlOptions

# Type Alias: SitemapXmlOptions

> **SitemapXmlOptions** = `object`

Defined in: [packages/core/src/client/sitecore-client.ts:104](https://github.com/Sitecore/content-sdk/blob/dc2fcfb78f06d81d0ee0dc2dbe001d506287e9c4/packages/core/src/client/sitecore-client.ts#L104)

Request options for the getSiteMap method

## Properties

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:110](https://github.com/Sitecore/content-sdk/blob/dc2fcfb78f06d81d0ee0dc2dbe001d506287e9c4/packages/core/src/client/sitecore-client.ts#L110)

Optional sitemap identifier when requesting a specific sitemap

***

### reqHost

> **reqHost**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:106](https://github.com/Sitecore/content-sdk/blob/dc2fcfb78f06d81d0ee0dc2dbe001d506287e9c4/packages/core/src/client/sitecore-client.ts#L106)

The hostname from the request (e.g., 'example.com')

***

### reqProtocol

> **reqProtocol**: `string` \| `string`[]

Defined in: [packages/core/src/client/sitecore-client.ts:108](https://github.com/Sitecore/content-sdk/blob/dc2fcfb78f06d81d0ee0dc2dbe001d506287e9c4/packages/core/src/client/sitecore-client.ts#L108)

The protocol from request headers (e.g., 'https' or 'http')

***

### siteName?

> `optional` **siteName**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:112](https://github.com/Sitecore/content-sdk/blob/dc2fcfb78f06d81d0ee0dc2dbe001d506287e9c4/packages/core/src/client/sitecore-client.ts#L112)

The site name to resolve the sitemap for