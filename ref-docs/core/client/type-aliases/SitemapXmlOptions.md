[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [client](../README.md) / SitemapXmlOptions

# Type Alias: SitemapXmlOptions

> **SitemapXmlOptions** = `object`

Defined in: [packages/core/src/client/sitecore-client.ts:116](https://github.com/Sitecore/content-sdk/blob/569b47a581c50a1e9c14edbc69edab69a694783a/packages/core/src/client/sitecore-client.ts#L116)

Request options for the getSiteMap method

## Properties

### id?

> `optional` **id**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:122](https://github.com/Sitecore/content-sdk/blob/569b47a581c50a1e9c14edbc69edab69a694783a/packages/core/src/client/sitecore-client.ts#L122)

Optional sitemap identifier when requesting a specific sitemap

***

### reqHost

> **reqHost**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:118](https://github.com/Sitecore/content-sdk/blob/569b47a581c50a1e9c14edbc69edab69a694783a/packages/core/src/client/sitecore-client.ts#L118)

The hostname from the request (e.g., 'example.com')

***

### reqProtocol

> **reqProtocol**: `string` \| `string`[]

Defined in: [packages/core/src/client/sitecore-client.ts:120](https://github.com/Sitecore/content-sdk/blob/569b47a581c50a1e9c14edbc69edab69a694783a/packages/core/src/client/sitecore-client.ts#L120)

The protocol from request headers (e.g., 'https' or 'http')

***

### siteName?

> `optional` **siteName**: `string`

Defined in: [packages/core/src/client/sitecore-client.ts:124](https://github.com/Sitecore/content-sdk/blob/569b47a581c50a1e9c14edbc69edab69a694783a/packages/core/src/client/sitecore-client.ts#L124)

The site name to resolve the sitemap for
