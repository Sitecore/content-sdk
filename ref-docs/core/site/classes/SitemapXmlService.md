[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SitemapXmlService

# Class: SitemapXmlService

Defined in: [packages/core/src/site/sitemap-xml-service.ts:45](https://github.com/Sitecore/content-sdk/blob/06ad485c7d11230f3625a1e62808b2e82a33f895/packages/core/src/site/sitemap-xml-service.ts#L45)

Service that fetch the sitemaps data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new SitemapXmlService**(`options`): `SitemapXmlService`

Defined in: [packages/core/src/site/sitemap-xml-service.ts:52](https://github.com/Sitecore/content-sdk/blob/06ad485c7d11230f3625a1e62808b2e82a33f895/packages/core/src/site/sitemap-xml-service.ts#L52)

Creates an instance of graphQL sitemaps service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`SitemapXmlServiceConfig`](../type-aliases/SitemapXmlServiceConfig.md) | instance |

#### Returns

`SitemapXmlService`

## Properties

### options

> **options**: [`SitemapXmlServiceConfig`](../type-aliases/SitemapXmlServiceConfig.md)

Defined in: [packages/core/src/site/sitemap-xml-service.ts:52](https://github.com/Sitecore/content-sdk/blob/06ad485c7d11230f3625a1e62808b2e82a33f895/packages/core/src/site/sitemap-xml-service.ts#L52)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [packages/core/src/site/sitemap-xml-service.ts:56](https://github.com/Sitecore/content-sdk/blob/06ad485c7d11230f3625a1e62808b2e82a33f895/packages/core/src/site/sitemap-xml-service.ts#L56)

##### Returns

`string`

## Methods

### fetchSitemaps()

> **fetchSitemaps**(`fetchOptions?`): `Promise`\<`string`[]\>

Defined in: [packages/core/src/site/sitemap-xml-service.ts:66](https://github.com/Sitecore/content-sdk/blob/06ad485c7d11230f3625a1e62808b2e82a33f895/packages/core/src/site/sitemap-xml-service.ts#L66)

Fetch list of sitemaps for the site

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<`string`[]\>

list of sitemap paths

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/sitemap-xml-service.ts:115](https://github.com/Sitecore/content-sdk/blob/06ad485c7d11230f3625a1e62808b2e82a33f895/packages/core/src/site/sitemap-xml-service.ts#L115)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### getSitemap()

> **getSitemap**(`id`): `Promise`\<`undefined` \| `string`\>

Defined in: [packages/core/src/site/sitemap-xml-service.ts:92](https://github.com/Sitecore/content-sdk/blob/06ad485c7d11230f3625a1e62808b2e82a33f895/packages/core/src/site/sitemap-xml-service.ts#L92)

Get sitemap file path for sitemap id

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | the sitemap id (can be empty for default 'sitemap.xml' file) |

#### Returns

`Promise`\<`undefined` \| `string`\>

the sitemap file path or undefined if one doesn't exist
