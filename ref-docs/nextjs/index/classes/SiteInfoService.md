[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / SiteInfoService

# Class: SiteInfoService

Defined in: core/types/site/siteinfo-service.d.ts:36

Service to fetch site information

## Constructors

### Constructor

> **new SiteInfoService**(`config`): `SiteInfoService`

Defined in: core/types/site/siteinfo-service.d.ts:44

Creates an instance of graphQL service to retrieve site configuration list from Sitecore

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`SiteInfoServiceConfig`](../type-aliases/SiteInfoServiceConfig.md) | instance |

#### Returns

`SiteInfoService`

## Accessors

### siteQuery

#### Get Signature

> **get** `protected` **siteQuery**(): `string`

Defined in: core/types/site/siteinfo-service.d.ts:48

site query is available on XM Cloud and XP 10.4+

##### Returns

`string`

## Methods

### fetchSiteInfo()

> **fetchSiteInfo**(`fetchOptions?`): `Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: core/types/site/siteinfo-service.d.ts:49

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fetchOptions?` | `FetchOptions` |

#### Returns

`Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: core/types/site/siteinfo-service.d.ts:55

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: core/types/site/siteinfo-service.d.ts:62

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation
