[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / SitePathService

# Class: SitePathService

Defined in: [content/src/site/sitepath-service.ts:154](https://github.com/Sitecore/content-sdk/blob/ef402dd75a112669c92b74a47a914a72b029d911/packages/content/src/site/sitepath-service.ts#L154)

Service that fetches the list of site pages using Sitecore's GraphQL API.
Used to handle a single site
This list is used for SSG and Export functionality.

## Mixes

SearchQueryService<PageListQueryResult>

## Constructors

### Constructor

> **new SitePathService**(`options`): `SitePathService`

Defined in: [content/src/site/sitepath-service.ts:161](https://github.com/Sitecore/content-sdk/blob/ef402dd75a112669c92b74a47a914a72b029d911/packages/content/src/site/sitepath-service.ts#L161)

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

Defined in: [content/src/site/sitepath-service.ts:161](https://github.com/Sitecore/content-sdk/blob/ef402dd75a112669c92b74a47a914a72b029d911/packages/content/src/site/sitepath-service.ts#L161)

instance

## Accessors

### graphQLClient

#### Get Signature

> **get** `protected` **graphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/site/sitepath-service.ts:168](https://github.com/Sitecore/content-sdk/blob/ef402dd75a112669c92b74a47a914a72b029d911/packages/content/src/site/sitepath-service.ts#L168)

GraphQL client accessible by descendant classes when needed

##### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

***

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [content/src/site/sitepath-service.ts:175](https://github.com/Sitecore/content-sdk/blob/ef402dd75a112669c92b74a47a914a72b029d911/packages/content/src/site/sitepath-service.ts#L175)

Gets the default query used for fetching the list of site pages

##### Returns

`string`

## Methods

### fetchLanguageSitePaths()

> `protected` **fetchLanguageSitePaths**(`language`, `siteName`, `fetchOptions?`): `Promise`\<`RouteListQueryResult`[]\>

Defined in: [content/src/site/sitepath-service.ts:283](https://github.com/Sitecore/content-sdk/blob/ef402dd75a112669c92b74a47a914a72b029d911/packages/content/src/site/sitepath-service.ts#L283)

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

Defined in: [content/src/site/sitepath-service.ts:189](https://github.com/Sitecore/content-sdk/blob/ef402dd75a112669c92b74a47a914a72b029d911/packages/content/src/site/sitepath-service.ts#L189)

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

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/site/sitepath-service.ts:266](https://github.com/Sitecore/content-sdk/blob/ef402dd75a112669c92b74a47a914a72b029d911/packages/content/src/site/sitepath-service.ts#L266)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation

***

### transformLanguageSitePaths()

> `protected` **transformLanguageSitePaths**(`sitePaths`, `formatStaticPath`, `language`): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

Defined in: [content/src/site/sitepath-service.ts:227](https://github.com/Sitecore/content-sdk/blob/ef402dd75a112669c92b74a47a914a72b029d911/packages/content/src/site/sitepath-service.ts#L227)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `sitePaths` | `RouteListQueryResult`[] |
| `formatStaticPath` | (`path`, `language`) => [`StaticPath`](../../index/type-aliases/StaticPath.md) |
| `language` | `string` |

#### Returns

`Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>
