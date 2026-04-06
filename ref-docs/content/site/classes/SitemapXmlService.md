[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / SitemapXmlService

# Class: SitemapXmlService

Defined in: [content/src/site/sitemap-xml-service.ts:46](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/content/src/site/sitemap-xml-service.ts#L46)

Service that fetch the sitemaps data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new SitemapXmlService**(`options`): `SitemapXmlService`

Defined in: [content/src/site/sitemap-xml-service.ts:53](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/content/src/site/sitemap-xml-service.ts#L53)

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

Defined in: [content/src/site/sitemap-xml-service.ts:53](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/content/src/site/sitemap-xml-service.ts#L53)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [content/src/site/sitemap-xml-service.ts:57](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/content/src/site/sitemap-xml-service.ts#L57)

##### Returns

`string`

## Methods

### fetchSitemaps()

> **fetchSitemaps**(`fetchOptions?`): `Promise`\<`string`[]\>

Defined in: [content/src/site/sitemap-xml-service.ts:67](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/content/src/site/sitemap-xml-service.ts#L67)

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

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/site/sitemap-xml-service.ts:116](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/content/src/site/sitemap-xml-service.ts#L116)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation

***

### getSitemap()

> **getSitemap**(`id`): `Promise`\<`string` \| `undefined`\>

Defined in: [content/src/site/sitemap-xml-service.ts:93](https://github.com/Sitecore/content-sdk/blob/2cc2d29fb8ea55dbe794a0b95c29a8d44bbf2b48/packages/content/src/site/sitemap-xml-service.ts#L93)

Get sitemap file path for sitemap id

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | the sitemap id (can be empty for default 'sitemap.xml' file) |

#### Returns

`Promise`\<`string` \| `undefined`\>

the sitemap file path or undefined if one doesn't exist
