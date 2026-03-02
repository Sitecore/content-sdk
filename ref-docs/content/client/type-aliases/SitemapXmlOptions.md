[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / SitemapXmlOptions

# Type Alias: SitemapXmlOptions

> **SitemapXmlOptions** = `object`

Defined in: [content/src/client/sitecore-client.ts:128](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/client/sitecore-client.ts#L128)

Request options for the getSiteMap method

## Properties

### id?

> `optional` **id**: `string`

Defined in: [content/src/client/sitecore-client.ts:134](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/client/sitecore-client.ts#L134)

Optional sitemap identifier when requesting a specific sitemap

***

### reqHost

> **reqHost**: `string`

Defined in: [content/src/client/sitecore-client.ts:130](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/client/sitecore-client.ts#L130)

The hostname from the request (e.g., 'example.com')

***

### reqProtocol

> **reqProtocol**: `string` \| `string`[]

Defined in: [content/src/client/sitecore-client.ts:132](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/client/sitecore-client.ts#L132)

The protocol from request headers (e.g., 'https' or 'http')

***

### siteName?

> `optional` **siteName**: `string`

Defined in: [content/src/client/sitecore-client.ts:136](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/client/sitecore-client.ts#L136)

The site name to resolve the sitemap for
