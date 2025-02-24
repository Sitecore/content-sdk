[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLSitemapXmlService

# Class: GraphQLSitemapXmlService

Defined in: [packages/core/src/site/graphql-sitemap-service.ts:39](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/core/src/site/graphql-sitemap-service.ts#L39)

Service that fetch the sitemaps data using Sitecore's GraphQL API.

## Constructors

### new GraphQLSitemapXmlService()

> **new GraphQLSitemapXmlService**(`options`): [`GraphQLSitemapXmlService`](GraphQLSitemapXmlService.md)

Defined in: [packages/core/src/site/graphql-sitemap-service.ts:46](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/core/src/site/graphql-sitemap-service.ts#L46)

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

Defined in: [packages/core/src/site/graphql-sitemap-service.ts:46](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/core/src/site/graphql-sitemap-service.ts#L46)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [packages/core/src/site/graphql-sitemap-service.ts:50](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/core/src/site/graphql-sitemap-service.ts#L50)

##### Returns

`string`

## Methods

### fetchSitemaps()

> **fetchSitemaps**(): `Promise`\<`string`[]\>

Defined in: [packages/core/src/site/graphql-sitemap-service.ts:59](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/core/src/site/graphql-sitemap-service.ts#L59)

Fetch list of sitemaps for the site

#### Returns

`Promise`\<`string`[]\>

list of sitemap paths

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/graphql-sitemap-service.ts:94](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/core/src/site/graphql-sitemap-service.ts#L94)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### getSitemap()

> **getSitemap**(`id`): `Promise`\<`undefined` \| `string`\>

Defined in: [packages/core/src/site/graphql-sitemap-service.ts:81](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/core/src/site/graphql-sitemap-service.ts#L81)

Get sitemap file path for sitemap id

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | the sitemap id (can be empty for default 'sitemap.xml' file) |

#### Returns

`Promise`\<`undefined` \| `string`\>

the sitemap file path or undefined if one doesn't exist
