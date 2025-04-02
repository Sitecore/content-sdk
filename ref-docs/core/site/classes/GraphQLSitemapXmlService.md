[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLSitemapXmlService

# Class: GraphQLSitemapXmlService

Defined in: [packages/core/src/site/graphql-sitemap-xml-service.ts:39](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/site/graphql-sitemap-xml-service.ts#L39)

Service that fetch the sitemaps data using Sitecore's GraphQL API.

## Constructors

### new GraphQLSitemapXmlService()

> **new GraphQLSitemapXmlService**(`options`): [`GraphQLSitemapXmlService`](GraphQLSitemapXmlService.md)

Defined in: [packages/core/src/site/graphql-sitemap-xml-service.ts:46](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/site/graphql-sitemap-xml-service.ts#L46)

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

Defined in: [packages/core/src/site/graphql-sitemap-xml-service.ts:46](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/site/graphql-sitemap-xml-service.ts#L46)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [packages/core/src/site/graphql-sitemap-xml-service.ts:50](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/site/graphql-sitemap-xml-service.ts#L50)

##### Returns

`string`

## Methods

### fetchSitemaps()

> **fetchSitemaps**(`fetchOptions`?): `Promise`\<`string`[]\>

Defined in: [packages/core/src/site/graphql-sitemap-xml-service.ts:60](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/site/graphql-sitemap-xml-service.ts#L60)

Fetch list of sitemaps for the site

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<`string`[]\>

list of sitemap paths

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/graphql-sitemap-xml-service.ts:100](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/site/graphql-sitemap-xml-service.ts#L100)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### getSitemap()

> **getSitemap**(`id`): `Promise`\<`undefined` \| `string`\>

Defined in: [packages/core/src/site/graphql-sitemap-xml-service.ts:86](https://github.com/Sitecore/content-sdk/blob/51f6d86287f95a06b40045498aa7037d8b684c67/packages/core/src/site/graphql-sitemap-xml-service.ts#L86)

Get sitemap file path for sitemap id

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | the sitemap id (can be empty for default 'sitemap.xml' file) |

#### Returns

`Promise`\<`undefined` \| `string`\>

the sitemap file path or undefined if one doesn't exist
