[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [personalize](../README.md) / PersonalizeService

# Class: PersonalizeService

<<<<<<< HEAD
Defined in: [packages/core/src/personalize/personalize-service.ts:45](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/personalize/personalize-service.ts#L45)
=======
Defined in: [packages/core/src/personalize/personalize-service.ts:45](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/personalize/personalize-service.ts#L45)
>>>>>>> dd686bb50 (Update API docs)

## Constructors

### Constructor

> **new PersonalizeService**(`config`): `PersonalizeService`

<<<<<<< HEAD
Defined in: [packages/core/src/personalize/personalize-service.ts:53](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/personalize/personalize-service.ts#L53)
=======
Defined in: [packages/core/src/personalize/personalize-service.ts:53](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/personalize/personalize-service.ts#L53)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/personalize/personalize-service.ts:53](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/personalize/personalize-service.ts#L53)
=======
Defined in: [packages/core/src/personalize/personalize-service.ts:53](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/personalize/personalize-service.ts#L53)
>>>>>>> dd686bb50 (Update API docs)

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

<<<<<<< HEAD
Defined in: [packages/core/src/personalize/personalize-service.ts:59](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/personalize/personalize-service.ts#L59)
=======
Defined in: [packages/core/src/personalize/personalize-service.ts:59](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/personalize/personalize-service.ts#L59)
>>>>>>> dd686bb50 (Update API docs)

##### Returns

`string`

## Methods

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<`PersonalizeQueryResult`\>

<<<<<<< HEAD
Defined in: [packages/core/src/personalize/personalize-service.ts:123](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/personalize/personalize-service.ts#L123)
=======
Defined in: [packages/core/src/personalize/personalize-service.ts:123](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/personalize/personalize-service.ts#L123)
>>>>>>> dd686bb50 (Update API docs)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<`PersonalizeQueryResult`\>

CacheClient instance

***

### getCacheKey()

> `protected` **getCacheKey**(`itemPath`, `language`, `siteName`): `string`

<<<<<<< HEAD
Defined in: [packages/core/src/personalize/personalize-service.ts:130](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/personalize/personalize-service.ts#L130)
=======
Defined in: [packages/core/src/personalize/personalize-service.ts:130](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/personalize/personalize-service.ts#L130)
>>>>>>> dd686bb50 (Update API docs)

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

<<<<<<< HEAD
Defined in: [packages/core/src/personalize/personalize-service.ts:140](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/personalize/personalize-service.ts#L140)
=======
Defined in: [packages/core/src/personalize/personalize-service.ts:140](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/personalize/personalize-service.ts#L140)
>>>>>>> dd686bb50 (Update API docs)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### getPersonalizeInfo()

> **getPersonalizeInfo**(`itemPath`, `language`, `siteName`): `Promise`\<`undefined` \| [`PersonalizeInfo`](../type-aliases/PersonalizeInfo.md)\>

<<<<<<< HEAD
Defined in: [packages/core/src/personalize/personalize-service.ts:82](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/personalize/personalize-service.ts#L82)
=======
Defined in: [packages/core/src/personalize/personalize-service.ts:82](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/personalize/personalize-service.ts#L82)
>>>>>>> dd686bb50 (Update API docs)

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
