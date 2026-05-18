[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / SiteInfoService

# Class: SiteInfoService

Defined in: [content/src/site/siteinfo-service.ts:57](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/content/src/site/siteinfo-service.ts#L57)

Service to fetch site information

## Constructors

### Constructor

> **new SiteInfoService**(`config`): `SiteInfoService`

Defined in: [content/src/site/siteinfo-service.ts:65](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/content/src/site/siteinfo-service.ts#L65)

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

Defined in: [content/src/site/siteinfo-service.ts:73](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/content/src/site/siteinfo-service.ts#L73)

site query is available on XM Cloud and XP 10.4+

##### Returns

`string`

## Methods

### fetchSiteInfo()

> **fetchSiteInfo**(`fetchOptions?`): `Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [content/src/site/siteinfo-service.ts:77](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/content/src/site/siteinfo-service.ts#L77)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) |

#### Returns

`Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

***

### getCacheClient()

> `protected` **getCacheClient**(): `CacheClient`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [content/src/site/siteinfo-service.ts:112](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/content/src/site/siteinfo-service.ts#L112)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

`CacheClient`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/site/siteinfo-service.ts:125](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/content/src/site/siteinfo-service.ts#L125)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation
