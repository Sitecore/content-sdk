[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / SitemapXmlService

# Class: SitemapXmlService

Defined in: content/types/site/sitemap-xml-service.d.ts:33

Service that fetch the sitemaps data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new SitemapXmlService**(`options`): `SitemapXmlService`

Defined in: content/types/site/sitemap-xml-service.d.ts:40

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

Defined in: content/types/site/sitemap-xml-service.d.ts:34

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: content/types/site/sitemap-xml-service.d.ts:41

##### Returns

`string`

## Methods

### fetchSitemaps()

> **fetchSitemaps**(`fetchOptions?`): `Promise`\<`string`[]\>

Defined in: content/types/site/sitemap-xml-service.d.ts:48

Fetch list of sitemaps for the site

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetchOptions?` | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<`string`[]\>

list of sitemap paths

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: content/types/site/sitemap-xml-service.d.ts:61

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation

***

### getSitemap()

> **getSitemap**(`id`): `Promise`\<`string` \| `undefined`\>

Defined in: content/types/site/sitemap-xml-service.d.ts:54

Get sitemap file path for sitemap id

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | the sitemap id (can be empty for default 'sitemap.xml' file) |

#### Returns

`Promise`\<`string` \| `undefined`\>

the sitemap file path or undefined if one doesn't exist
