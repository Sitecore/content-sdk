[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [personalize](../README.md) / PersonalizeService

# Class: PersonalizeService

Defined in: [packages/core/src/personalize/personalize-service.ts:54](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/personalize/personalize-service.ts#L54)

Fetch personalize data using the Sitecore GraphQL endpoint.

## Constructors

### Constructor

> **new PersonalizeService**(`config`): `PersonalizeService`

Defined in: [packages/core/src/personalize/personalize-service.ts:62](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/personalize/personalize-service.ts#L62)

Fetch personalize data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`PersonalizeServiceConfig`](../type-aliases/PersonalizeServiceConfig.md) |  |

#### Returns

`PersonalizeService`

## Properties

### config

> `protected` **config**: [`PersonalizeServiceConfig`](../type-aliases/PersonalizeServiceConfig.md)

Defined in: [packages/core/src/personalize/personalize-service.ts:62](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/personalize/personalize-service.ts#L62)

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [packages/core/src/personalize/personalize-service.ts:68](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/personalize/personalize-service.ts#L68)

##### Returns

`string`

## Methods

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<`PersonalizeQueryResult`\>

Defined in: [packages/core/src/personalize/personalize-service.ts:132](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/personalize/personalize-service.ts#L132)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<`PersonalizeQueryResult`\>

CacheClient instance

***

### getCacheKey()

> `protected` **getCacheKey**(`itemPath`, `language`, `siteName`): `string`

Defined in: [packages/core/src/personalize/personalize-service.ts:139](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/personalize/personalize-service.ts#L139)

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

Defined in: [packages/core/src/personalize/personalize-service.ts:149](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/personalize/personalize-service.ts#L149)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### getPersonalizeInfo()

> **getPersonalizeInfo**(`itemPath`, `language`, `siteName`): `Promise`\<`undefined` \| [`PersonalizeInfo`](../type-aliases/PersonalizeInfo.md)\>

Defined in: [packages/core/src/personalize/personalize-service.ts:91](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/personalize/personalize-service.ts#L91)

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
