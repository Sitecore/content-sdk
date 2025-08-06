[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SitePathService

# Class: SitePathService

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:150](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L150)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:150](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L150)
>>>>>>> dd686bb50 (Update API docs)

Service that fetches the list of site pages using Sitecore's GraphQL API.
Used to handle a single site
This list is used for SSG and Export functionality.

## Mixes

SearchQueryService<PageListQueryResult>

## Constructors

### Constructor

> **new SitePathService**(`options`): `SitePathService`

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:157](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L157)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:157](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L157)
>>>>>>> dd686bb50 (Update API docs)

Creates an instance of graphQL sitemap service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`SitePathServiceConfig`](../interfaces/SitePathServiceConfig.md) | instance |

#### Returns

`SitePathService`

## Properties

### options

> **options**: [`SitePathServiceConfig`](../interfaces/SitePathServiceConfig.md)

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:157](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L157)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:157](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L157)
>>>>>>> dd686bb50 (Update API docs)

instance

## Accessors

### graphQLClient

#### Get Signature

> **get** `protected` **graphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:164](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L164)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:164](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L164)
>>>>>>> dd686bb50 (Update API docs)

GraphQL client accessible by descendant classes when needed

##### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

***

### query

#### Get Signature

> **get** `protected` **query**(): `string`

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:171](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L171)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:171](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L171)
>>>>>>> dd686bb50 (Update API docs)

Gets the default query used for fetching the list of site pages

##### Returns

`string`

## Methods

### fetchLanguageSitePaths()

> `protected` **fetchLanguageSitePaths**(`language`, `siteName`, `fetchOptions?`): `Promise`\<`RouteListQueryResult`[]\>

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:274](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L274)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:274](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L274)
>>>>>>> dd686bb50 (Update API docs)

Fetch and return site paths for multisite implementation, with prefixes included

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | path language |
| `siteName` | `string` | site name |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<`RouteListQueryResult`[]\>

modified paths

***

### fetchSiteRoutes()

> **fetchSiteRoutes**(`sites`, `languages`, `fetchOptions?`): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:185](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L185)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:185](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L185)
>>>>>>> dd686bb50 (Update API docs)

Fetch a flat list of all pages that belong to all the requested sites and have a
version in the specified language(s).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sites` | `string`[] | Fetch pages for these sites. |
| `languages` | `string`[] | Fetch pages that have versions in this language(s). |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

list of pages

#### Throws

if the list of languages is empty.

#### Throws

if the any of the languages is an empty string.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:257](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L257)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:257](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L257)
>>>>>>> dd686bb50 (Update API docs)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### transformLanguageSitePaths()

> `protected` **transformLanguageSitePaths**(`sitePaths`, `formatStaticPath`, `language`): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

<<<<<<< HEAD
Defined in: [packages/core/src/site/sitepath-service.ts:223](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/sitepath-service.ts#L223)
=======
Defined in: [packages/core/src/site/sitepath-service.ts:223](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/sitepath-service.ts#L223)
>>>>>>> dd686bb50 (Update API docs)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `sitePaths` | `RouteListQueryResult`[] |
| `formatStaticPath` | (`path`, `language`) => [`StaticPath`](../../index/type-aliases/StaticPath.md) |
| `language` | `string` |

#### Returns

`Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>
