[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SiteInfoService

# Class: SiteInfoService

Defined in: [packages/core/src/site/siteinfo-service.ts:46](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/core/src/site/siteinfo-service.ts#L46)

## Constructors

### Constructor

> **new SiteInfoService**(`config`): `SiteInfoService`

Defined in: [packages/core/src/site/siteinfo-service.ts:54](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/core/src/site/siteinfo-service.ts#L54)

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

Defined in: [packages/core/src/site/siteinfo-service.ts:62](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/core/src/site/siteinfo-service.ts#L62)

site query is available on XM Cloud and XP 10.4+

##### Returns

`string`

## Methods

### fetchSiteInfo()

> **fetchSiteInfo**(`fetchOptions?`): `Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [packages/core/src/site/siteinfo-service.ts:66](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/core/src/site/siteinfo-service.ts#L66)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) |

#### Returns

`Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [packages/core/src/site/siteinfo-service.ts:101](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/core/src/site/siteinfo-service.ts#L101)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/siteinfo-service.ts:114](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/core/src/site/siteinfo-service.ts#L114)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
