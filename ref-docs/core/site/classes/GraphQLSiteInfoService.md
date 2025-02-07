[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLSiteInfoService

# Class: GraphQLSiteInfoService

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:64](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/core/src/site/graphql-siteinfo-service.ts#L64)

## Constructors

### new GraphQLSiteInfoService()

> **new GraphQLSiteInfoService**(`config`): [`GraphQLSiteInfoService`](GraphQLSiteInfoService.md)

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:72](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/core/src/site/graphql-siteinfo-service.ts#L72)

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

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:80](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/core/src/site/graphql-siteinfo-service.ts#L80)

site query is available on XM Cloud and XP 10.4+

##### Returns

`string`

## Methods

### fetchSiteInfo()

> **fetchSiteInfo**(): `Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:84](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/core/src/site/graphql-siteinfo-service.ts#L84)

#### Returns

`Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

***

### fetchWithSiteQuery()

> `protected` **fetchWithSiteQuery**(): `Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:100](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/core/src/site/graphql-siteinfo-service.ts#L100)

#### Returns

`Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:121](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/core/src/site/graphql-siteinfo-service.ts#L121)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:134](https://github.com/Sitecore/xmc-jss-dev/blob/a044b326cf7fdf7e220ec3cd173873f1315ba099/packages/core/src/site/graphql-siteinfo-service.ts#L134)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
