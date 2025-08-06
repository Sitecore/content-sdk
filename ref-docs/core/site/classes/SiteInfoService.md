[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / SiteInfoService

# Class: SiteInfoService

<<<<<<< HEAD
Defined in: [packages/core/src/site/siteinfo-service.ts:46](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/siteinfo-service.ts#L46)
=======
Defined in: [packages/core/src/site/siteinfo-service.ts:46](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/siteinfo-service.ts#L46)
>>>>>>> dd686bb50 (Update API docs)

## Constructors

### Constructor

> **new SiteInfoService**(`config`): `SiteInfoService`

<<<<<<< HEAD
Defined in: [packages/core/src/site/siteinfo-service.ts:54](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/siteinfo-service.ts#L54)
=======
Defined in: [packages/core/src/site/siteinfo-service.ts:54](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/siteinfo-service.ts#L54)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/site/siteinfo-service.ts:62](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/siteinfo-service.ts#L62)
=======
Defined in: [packages/core/src/site/siteinfo-service.ts:62](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/siteinfo-service.ts#L62)
>>>>>>> dd686bb50 (Update API docs)

site query is available on XM Cloud and XP 10.4+

##### Returns

`string`

## Methods

### fetchSiteInfo()

> **fetchSiteInfo**(`fetchOptions?`): `Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

<<<<<<< HEAD
Defined in: [packages/core/src/site/siteinfo-service.ts:66](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/siteinfo-service.ts#L66)
=======
Defined in: [packages/core/src/site/siteinfo-service.ts:66](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/siteinfo-service.ts#L66)
>>>>>>> dd686bb50 (Update API docs)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) |

#### Returns

`Promise`\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

<<<<<<< HEAD
Defined in: [packages/core/src/site/siteinfo-service.ts:101](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/siteinfo-service.ts#L101)
=======
Defined in: [packages/core/src/site/siteinfo-service.ts:101](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/siteinfo-service.ts#L101)
>>>>>>> dd686bb50 (Update API docs)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`SiteInfo`](../type-aliases/SiteInfo.md)[]\>

CacheClient instance

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

<<<<<<< HEAD
Defined in: [packages/core/src/site/siteinfo-service.ts:114](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/site/siteinfo-service.ts#L114)
=======
Defined in: [packages/core/src/site/siteinfo-service.ts:114](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/site/siteinfo-service.ts#L114)
>>>>>>> dd686bb50 (Update API docs)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation
