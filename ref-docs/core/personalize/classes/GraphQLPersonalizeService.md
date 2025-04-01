[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [personalize](../README.md) / GraphQLPersonalizeService

# Class: GraphQLPersonalizeService

Defined in: [packages/core/src/personalize/graphql-personalize-service.ts:45](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/core/src/personalize/graphql-personalize-service.ts#L45)

## Constructors

### new GraphQLPersonalizeService()

> **new GraphQLPersonalizeService**(`config`): [`GraphQLPersonalizeService`](GraphQLPersonalizeService.md)

Defined in: [packages/core/src/personalize/graphql-personalize-service.ts:53](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/core/src/personalize/graphql-personalize-service.ts#L53)

Fetch personalize data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`GraphQLPersonalizeServiceConfig`](../type-aliases/GraphQLPersonalizeServiceConfig.md) |  |

#### Returns

[`GraphQLPersonalizeService`](GraphQLPersonalizeService.md)

## Properties

### config

> `protected` **config**: [`GraphQLPersonalizeServiceConfig`](../type-aliases/GraphQLPersonalizeServiceConfig.md)

Defined in: [packages/core/src/personalize/graphql-personalize-service.ts:53](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/core/src/personalize/graphql-personalize-service.ts#L53)

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [packages/core/src/personalize/graphql-personalize-service.ts:59](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/core/src/personalize/graphql-personalize-service.ts#L59)

##### Returns

`string`

## Methods

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<`PersonalizeQueryResult`\>

Defined in: [packages/core/src/personalize/graphql-personalize-service.ts:123](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/core/src/personalize/graphql-personalize-service.ts#L123)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<`PersonalizeQueryResult`\>

CacheClient instance

***

### getCacheKey()

> `protected` **getCacheKey**(`itemPath`, `language`, `siteName`): `string`

Defined in: [packages/core/src/personalize/graphql-personalize-service.ts:130](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/core/src/personalize/graphql-personalize-service.ts#L130)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `itemPath` | `string` |
| `language` | `string` |
| `siteName` | `string` |

#### Returns

`string`

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/personalize/graphql-personalize-service.ts:140](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/core/src/personalize/graphql-personalize-service.ts#L140)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### getPersonalizeInfo()

> **getPersonalizeInfo**(`itemPath`, `language`, `siteName`): `Promise`\<`undefined` \| [`PersonalizeInfo`](../type-aliases/PersonalizeInfo.md)\>

Defined in: [packages/core/src/personalize/graphql-personalize-service.ts:82](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/core/src/personalize/graphql-personalize-service.ts#L82)

Get personalize information for a route

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | page route |
| `language` | `string` | language |
| `siteName` | `string` | site name |

#### Returns

`Promise`\<`undefined` \| [`PersonalizeInfo`](../type-aliases/PersonalizeInfo.md)\>

the personalize information or undefined (if itemPath / language not found)
