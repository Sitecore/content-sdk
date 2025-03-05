[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / GraphQLSiteInfoService

# Class: GraphQLSiteInfoService

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:46](https://github.com/Sitecore/xmc-jss-dev/blob/28923ef088ac4be62069deb221a0ddc7386ea85e/packages/core/src/site/graphql-siteinfo-service.ts#L46)

## Constructors

### new GraphQLSiteInfoService()

> **new GraphQLSiteInfoService**(`config`): [`GraphQLSiteInfoService`](GraphQLSiteInfoService.md)

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:54](https://github.com/Sitecore/xmc-jss-dev/blob/28923ef088ac4be62069deb221a0ddc7386ea85e/packages/core/src/site/graphql-siteinfo-service.ts#L54)

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

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:62](https://github.com/Sitecore/xmc-jss-dev/blob/28923ef088ac4be62069deb221a0ddc7386ea85e/packages/core/src/site/graphql-siteinfo-service.ts#L62)

site query is available on XM Cloud and XP 10.4+

##### Returns

`string`

## Methods

### fetchSiteInfo()

> **fetchSiteInfo**(): `Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:66](https://github.com/Sitecore/xmc-jss-dev/blob/28923ef088ac4be62069deb221a0ddc7386ea85e/packages/core/src/site/graphql-siteinfo-service.ts#L66)

#### Returns

`Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

***

### fetchWithSiteQuery()

> `protected` **fetchWithSiteQuery**(): `Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:82](https://github.com/Sitecore/xmc-jss-dev/blob/28923ef088ac4be62069deb221a0ddc7386ea85e/packages/core/src/site/graphql-siteinfo-service.ts#L82)

#### Returns

`Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:103](https://github.com/Sitecore/xmc-jss-dev/blob/28923ef088ac4be62069deb221a0ddc7386ea85e/packages/core/src/site/graphql-siteinfo-service.ts#L103)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/site/graphql-siteinfo-service.ts:116](https://github.com/Sitecore/xmc-jss-dev/blob/28923ef088ac4be62069deb221a0ddc7386ea85e/packages/core/src/site/graphql-siteinfo-service.ts#L116)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
