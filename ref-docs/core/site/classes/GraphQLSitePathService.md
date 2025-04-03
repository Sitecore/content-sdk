[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLSitePathService

# Class: GraphQLSitePathService

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:151](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/site/graphql-sitepath-service.ts#L151)

Service that fetches the list of site pages using Sitecore's GraphQL API.
Used to handle a single site
This list is used for SSG and Export functionality.

## Mixes

SearchQueryService<PageListQueryResult>

## Constructors

### new GraphQLSitePathService()

> **new GraphQLSitePathService**(`options`): [`GraphQLSitePathService`](GraphQLSitePathService.md)

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:158](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/site/graphql-sitepath-service.ts#L158)

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

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:158](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/site/graphql-sitepath-service.ts#L158)

instance

## Accessors

### graphQLClient

#### Get Signature

> **get** `protected` **graphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:165](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/site/graphql-sitepath-service.ts#L165)

GraphQL client accessible by descendant classes when needed

##### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

***

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:172](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/site/graphql-sitepath-service.ts#L172)

Gets the default query used for fetching the list of site pages

##### Returns

`string`

## Methods

### fetchLanguageSitePaths()

> `protected` **fetchLanguageSitePaths**(`language`, `siteName`, `fetchOptions`?): `Promise`\<`RouteListQueryResult`[]\>

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:272](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/site/graphql-sitepath-service.ts#L272)

Fetch and return site paths for multisite implementation, with prefixes included

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | path language |
| `siteName` | `string` | site name |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<`RouteListQueryResult`[]\>

modified paths

***

### fetchSiteRoutes()

> **fetchSiteRoutes**(`languages`, `fetchOptions`?): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:185](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/site/graphql-sitepath-service.ts#L185)

Fetch a flat list of all pages that belong to all the requested sites and have a
version in the specified language(s).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `languages` | `string`[] | Fetch pages that have versions in this language(s). |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

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

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:255](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/site/graphql-sitepath-service.ts#L255)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### transformLanguageSitePaths()

> `protected` **transformLanguageSitePaths**(`sitePaths`, `formatStaticPath`, `language`): `Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>

Defined in: [packages/core/src/site/graphql-sitepath-service.ts:221](https://github.com/Sitecore/content-sdk/blob/0d1933830661df0273ddb41b92f4a0934e861521/packages/core/src/site/graphql-sitepath-service.ts#L221)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `sitePaths` | `RouteListQueryResult`[] |
| `formatStaticPath` | (`path`, `language`) => [`StaticPath`](../../index/type-aliases/StaticPath.md) |
| `language` | `string` |

#### Returns

`Promise`\<[`StaticPath`](../../index/type-aliases/StaticPath.md)[]\>
