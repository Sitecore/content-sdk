[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / MultisiteGraphQLSitemapService

# Class: MultisiteGraphQLSitemapService

Defined in: [nextjs/src/services/mutisite-graphql-sitemap-service.ts:28](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/mutisite-graphql-sitemap-service.ts#L28)

Service that fetches the list of site pages using Sitecore's GraphQL API.
Used to handle multiple sites
This list is used for SSG and Export functionality.

## Mixes

SearchQueryService<PageListQueryResult>

## Extends

- `BaseGraphQLSitemapService`

## Constructors

### new MultisiteGraphQLSitemapService()

> **new MultisiteGraphQLSitemapService**(`options`): [`MultisiteGraphQLSitemapService`](MultisiteGraphQLSitemapService.md)

Defined in: [nextjs/src/services/mutisite-graphql-sitemap-service.ts:33](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/mutisite-graphql-sitemap-service.ts#L33)

Creates an instance of graphQL sitemap service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`MultisiteGraphQLSitemapServiceConfig`](../interfaces/MultisiteGraphQLSitemapServiceConfig.md) | instance |

#### Returns

[`MultisiteGraphQLSitemapService`](MultisiteGraphQLSitemapService.md)

#### Overrides

`BaseGraphQLSitemapService.constructor`

## Properties

### options

> **options**: [`MultisiteGraphQLSitemapServiceConfig`](../interfaces/MultisiteGraphQLSitemapServiceConfig.md)

Defined in: [nextjs/src/services/mutisite-graphql-sitemap-service.ts:33](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/mutisite-graphql-sitemap-service.ts#L33)

instance

#### Inherited from

`BaseGraphQLSitemapService.options`

## Accessors

### graphQLClient

#### Get Signature

> **get** `protected` **graphQLClient**(): `GraphQLClient`

Defined in: [nextjs/src/services/base-graphql-sitemap-service.ts:177](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/base-graphql-sitemap-service.ts#L177)

GraphQL client accessible by descendant classes when needed

##### Returns

`GraphQLClient`

#### Inherited from

`BaseGraphQLSitemapService.graphQLClient`

***

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [nextjs/src/services/base-graphql-sitemap-service.ts:184](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/base-graphql-sitemap-service.ts#L184)

Gets the default query used for fetching the list of site pages

##### Returns

`string`

#### Inherited from

`BaseGraphQLSitemapService.query`

## Methods

### fetchExportSitemap()

> **fetchExportSitemap**(`locale`): `Promise`\<`StaticPath`[]\>

Defined in: [nextjs/src/services/base-graphql-sitemap-service.ts:195](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/base-graphql-sitemap-service.ts#L195)

Fetch sitemap which could be used for generation of static pages during `next export`.
The `locale` parameter will be used in the item query, but since i18n is not supported,
the output paths will not include a `language` property.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `locale` | `string` | which application supports |

#### Returns

`Promise`\<`StaticPath`[]\>

an array of

#### See

StaticPath objects

#### Inherited from

`BaseGraphQLSitemapService.fetchExportSitemap`

***

### fetchLanguageSitePaths()

> `protected` **fetchLanguageSitePaths**(`language`, `siteName`): `Promise`\<`RouteListQueryResult`[]\>

Defined in: [nextjs/src/services/mutisite-graphql-sitemap-service.ts:77](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/mutisite-graphql-sitemap-service.ts#L77)

Fetch and return site paths for multisite implementation, with prefixes included

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | path language |
| `siteName` | `string` | site name |

#### Returns

`Promise`\<`RouteListQueryResult`[]\>

modified paths

#### Overrides

`BaseGraphQLSitemapService.fetchLanguageSitePaths`

***

### fetchSitemap()

> `protected` **fetchSitemap**(`languages`, `formatStaticPath`): `Promise`\<`StaticPath`[]\>

Defined in: [nextjs/src/services/mutisite-graphql-sitemap-service.ts:46](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/mutisite-graphql-sitemap-service.ts#L46)

Fetch a flat list of all pages that belong to all the requested sites and have a
version in the specified language(s).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `languages` | `string`[] | Fetch pages that have versions in this language(s). |
| `formatStaticPath` | (`path`, `language`) => `StaticPath` | Function for transforming the raw search results into (@see StaticPath) types. |

#### Returns

`Promise`\<`StaticPath`[]\>

list of pages

#### Throws

if the list of languages is empty.

#### Throws

if the any of the languages is an empty string.

#### Overrides

`BaseGraphQLSitemapService.fetchSitemap`

***

### fetchSSGSitemap()

> **fetchSSGSitemap**(`locales`): `Promise`\<`StaticPath`[]\>

Defined in: [nextjs/src/services/base-graphql-sitemap-service.ts:210](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/base-graphql-sitemap-service.ts#L210)

Fetch sitemap which could be used for generation of static pages using SSG mode

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `locales` | `string`[] | locales which application supports |

#### Returns

`Promise`\<`StaticPath`[]\>

an array of

#### See

StaticPath objects

#### Inherited from

`BaseGraphQLSitemapService.fetchSSGSitemap`

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: [nextjs/src/services/base-graphql-sitemap-service.ts:317](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/base-graphql-sitemap-service.ts#L317)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation

#### Inherited from

`BaseGraphQLSitemapService.getGraphQLClient`

***

### getTranformedPaths()

> `protected` **getTranformedPaths**(`siteName`, `languages`, `formatStaticPath`): `Promise`\<`StaticPath`[]\>

Defined in: [nextjs/src/services/base-graphql-sitemap-service.ts:221](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/base-graphql-sitemap-service.ts#L221)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `siteName` | `string` |
| `languages` | `string`[] |
| `formatStaticPath` | (`path`, `language`) => `StaticPath` |

#### Returns

`Promise`\<`StaticPath`[]\>

#### Inherited from

`BaseGraphQLSitemapService.getTranformedPaths`

***

### transformLanguageSitePaths()

> `protected` **transformLanguageSitePaths**(`sitePaths`, `formatStaticPath`, `language`): `Promise`\<`StaticPath`[]\>

Defined in: [nextjs/src/services/base-graphql-sitemap-service.ts:248](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/services/base-graphql-sitemap-service.ts#L248)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `sitePaths` | `RouteListQueryResult`[] |
| `formatStaticPath` | (`path`, `language`) => `StaticPath` |
| `language` | `string` |

#### Returns

`Promise`\<`StaticPath`[]\>

#### Inherited from

`BaseGraphQLSitemapService.transformLanguageSitePaths`
