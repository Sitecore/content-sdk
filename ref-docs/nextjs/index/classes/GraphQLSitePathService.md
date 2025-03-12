[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GraphQLSitePathService

# Class: GraphQLSitePathService

Defined in: core/types/site/graphql-sitepath-service.d.ts:92

Service that fetches the list of site pages using Sitecore's GraphQL API.
Used to handle a single site
This list is used for SSG and Export functionality.

## Mixes

SearchQueryService<PageListQueryResult>

## Constructors

### new GraphQLSitePathService()

> **new GraphQLSitePathService**(`options`): [`GraphQLSitePathService`](GraphQLSitePathService.md)

Defined in: core/types/site/graphql-sitepath-service.d.ts:99

Creates an instance of graphQL sitemap service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`GraphQLSitePathServiceConfig`](../interfaces/GraphQLSitePathServiceConfig.md) | instance |

#### Returns

[`GraphQLSitePathService`](GraphQLSitePathService.md)

## Properties

### options

> **options**: [`GraphQLSitePathServiceConfig`](../interfaces/GraphQLSitePathServiceConfig.md)

Defined in: core/types/site/graphql-sitepath-service.d.ts:93

## Accessors

### graphQLClient

#### Get Signature

> **get** `protected` **graphQLClient**(): `GraphQLClient`

Defined in: core/types/site/graphql-sitepath-service.d.ts:103

GraphQL client accessible by descendant classes when needed

##### Returns

`GraphQLClient`

***

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: core/types/site/graphql-sitepath-service.d.ts:107

Gets the default query used for fetching the list of site pages

##### Returns

`string`

## Methods

### fetchLanguageSitePaths()

> `protected` **fetchLanguageSitePaths**(`language`, `siteName`, `fetchOptions`?): `Promise`\<`RouteListQueryResult`[]\>

Defined in: core/types/site/graphql-sitepath-service.d.ts:133

Fetch and return site paths for multisite implementation, with prefixes included

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | path language |
| `siteName` | `string` | site name |
| `fetchOptions`? | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<`RouteListQueryResult`[]\>

modified paths

***

### fetchSiteRoutes()

> **fetchSiteRoutes**(`languages`, `fetchOptions`?): `Promise`\<[`StaticPath`](../type-aliases/StaticPath.md)[]\>

Defined in: core/types/site/graphql-sitepath-service.d.ts:117

Fetch a flat list of all pages that belong to all the requested sites and have a
version in the specified language(s).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `languages` | `string`[] | Fetch pages that have versions in this language(s). |
| `fetchOptions`? | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`StaticPath`](../type-aliases/StaticPath.md)[]\>

list of pages

#### Throws

if the list of languages is empty.

#### Throws

if the any of the languages is an empty string.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: core/types/site/graphql-sitepath-service.d.ts:125

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation

***

### transformLanguageSitePaths()

> `protected` **transformLanguageSitePaths**(`sitePaths`, `formatStaticPath`, `language`): `Promise`\<[`StaticPath`](../type-aliases/StaticPath.md)[]\>

Defined in: core/types/site/graphql-sitepath-service.d.ts:118

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `sitePaths` | `RouteListQueryResult`[] |
| `formatStaticPath` | (`path`, `language`) => [`StaticPath`](../type-aliases/StaticPath.md) |
| `language` | `string` |

#### Returns

`Promise`\<[`StaticPath`](../type-aliases/StaticPath.md)[]\>
