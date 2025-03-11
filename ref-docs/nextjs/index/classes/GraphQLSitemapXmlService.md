[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GraphQLSitemapXmlService

# Class: GraphQLSitemapXmlService

Defined in: core/types/site/graphql-sitemap-xml-service.d.ts:27

Service that fetch the sitemaps data using Sitecore's GraphQL API.

## Constructors

### new GraphQLSitemapXmlService()

> **new GraphQLSitemapXmlService**(`options`): [`GraphQLSitemapXmlService`](GraphQLSitemapXmlService.md)

Defined in: core/types/site/graphql-sitemap-xml-service.d.ts:34

Creates an instance of graphQL sitemaps service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`GraphQLSitemapXmlServiceConfig`](../type-aliases/GraphQLSitemapXmlServiceConfig.md) | instance |

#### Returns

[`GraphQLSitemapXmlService`](GraphQLSitemapXmlService.md)

## Properties

### options

> **options**: [`GraphQLSitemapXmlServiceConfig`](../type-aliases/GraphQLSitemapXmlServiceConfig.md)

Defined in: core/types/site/graphql-sitemap-xml-service.d.ts:28

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: core/types/site/graphql-sitemap-xml-service.d.ts:35

##### Returns

`string`

## Methods

### fetchSitemaps()

> **fetchSitemaps**(`fetchOptions`?): `Promise`\<`string`[]\>

Defined in: core/types/site/graphql-sitemap-xml-service.d.ts:42

Fetch list of sitemaps for the site

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetchOptions`? | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<`string`[]\>

list of sitemap paths

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: core/types/site/graphql-sitemap-xml-service.d.ts:55

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation

***

### getSitemap()

> **getSitemap**(`id`): `Promise`\<`undefined` \| `string`\>

Defined in: core/types/site/graphql-sitemap-xml-service.d.ts:48

Get sitemap file path for sitemap id

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | the sitemap id (can be empty for default 'sitemap.xml' file) |

#### Returns

`Promise`\<`undefined` \| `string`\>

the sitemap file path or undefined if one doesn't exist
