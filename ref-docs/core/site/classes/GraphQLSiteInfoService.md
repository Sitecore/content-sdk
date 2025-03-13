[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLSiteInfoService

# Class: GraphQLSiteInfoService

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:46](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/site/graphql-siteinfo-service.ts#L46)

## Constructors

### new GraphQLSiteInfoService()

> **new GraphQLSiteInfoService**(`config`): [`GraphQLSiteInfoService`](GraphQLSiteInfoService.md)

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:54](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/site/graphql-siteinfo-service.ts#L54)

Creates an instance of graphQL service to retrieve site configuration list from Sitecore

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`GraphQLSiteInfoServiceConfig`](../type-aliases/GraphQLSiteInfoServiceConfig.md) | instance |

#### Returns

[`GraphQLSiteInfoService`](GraphQLSiteInfoService.md)

## Accessors

### siteQuery

#### Get Signature

> **get** `protected` **siteQuery**(): `string`

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:62](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/site/graphql-siteinfo-service.ts#L62)

site query is available on XM Cloud and XP 10.4+

##### Returns

`string`

## Methods

### fetchSiteInfo()

> **fetchSiteInfo**(`fetchOptions`?): `Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:66](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/site/graphql-siteinfo-service.ts#L66)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) |

#### Returns

`Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:101](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/site/graphql-siteinfo-service.ts#L101)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:114](https://github.com/Sitecore/xmc-jss-dev/blob/07cd028140c85e97f7ece01b765c9bb0efa691ad/packages/core/src/site/graphql-siteinfo-service.ts#L114)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
