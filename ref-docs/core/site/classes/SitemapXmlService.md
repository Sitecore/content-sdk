[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SitemapXmlService

# Class: SitemapXmlService

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitemap-xml-service.ts:39](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitemap-xml-service.ts#L39)
=======
Defined in: [packages/core/src/site/sitemap-xml-service.ts:39](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitemap-xml-service.ts#L39)
>>>>>>> dd686bb50 (Update API docs)

Service that fetch the sitemaps data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new SitemapXmlService**(`options`): `SitemapXmlService`

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitemap-xml-service.ts:46](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitemap-xml-service.ts#L46)
=======
Defined in: [packages/core/src/site/sitemap-xml-service.ts:46](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitemap-xml-service.ts#L46)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitemap-xml-service.ts:46](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitemap-xml-service.ts#L46)
=======
Defined in: [packages/core/src/site/sitemap-xml-service.ts:46](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitemap-xml-service.ts#L46)
>>>>>>> dd686bb50 (Update API docs)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitemap-xml-service.ts:50](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitemap-xml-service.ts#L50)
=======
Defined in: [packages/core/src/site/sitemap-xml-service.ts:50](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitemap-xml-service.ts#L50)
>>>>>>> dd686bb50 (Update API docs)

##### Returns

`string`

## Methods

### fetchSitemaps()

> **fetchSitemaps**(`fetchOptions?`): `Promise`\<`string`[]\>

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitemap-xml-service.ts:60](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitemap-xml-service.ts#L60)
=======
Defined in: [packages/core/src/site/sitemap-xml-service.ts:60](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitemap-xml-service.ts#L60)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitemap-xml-service.ts:109](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitemap-xml-service.ts#L109)
=======
Defined in: [packages/core/src/site/sitemap-xml-service.ts:109](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitemap-xml-service.ts#L109)
>>>>>>> dd686bb50 (Update API docs)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### getSitemap()

> **getSitemap**(`id`): `Promise`\<`undefined` \| `string`\>

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitemap-xml-service.ts:86](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitemap-xml-service.ts#L86)
=======
Defined in: [packages/core/src/site/sitemap-xml-service.ts:86](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitemap-xml-service.ts#L86)
>>>>>>> dd686bb50 (Update API docs)

Get sitemap file path for sitemap id

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `id` | `string` | the sitemap id (can be empty for default 'sitemap.xml' file) |

#### Returns

`Promise`\<`undefined` \| `string`\>

the sitemap file path or undefined if one doesn't exist
