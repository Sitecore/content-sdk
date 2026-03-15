[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / PersonalizeService

# Class: PersonalizeService

Defined in: content/types/personalize/personalize-service.d.ts:54

Fetch personalize data using the Sitecore GraphQL endpoint.

## Constructors

### Constructor

> **new PersonalizeService**(`config`): `PersonalizeService`

Defined in: content/types/personalize/personalize-service.d.ts:62

Fetch personalize data using the Sitecore GraphQL endpoint.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`PersonalizeServiceConfig`](../../proxy/type-aliases/PersonalizeServiceConfig.md) |  |

#### Returns

`PersonalizeService`

## Properties

### config

> `protected` **config**: [`PersonalizeServiceConfig`](../../proxy/type-aliases/PersonalizeServiceConfig.md)

Defined in: content/types/personalize/personalize-service.d.ts:55

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: content/types/personalize/personalize-service.d.ts:63

##### Returns

`string`

## Methods

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../interfaces/CacheClient.md)\<`PersonalizeQueryResult`\>

Defined in: content/types/personalize/personalize-service.d.ts:77

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

[`CacheClient`](../interfaces/CacheClient.md)\<`PersonalizeQueryResult`\>

CacheClient instance

***

### getCacheKey()

> `protected` **getCacheKey**(`itemPath`, `language`, `siteName`): `string`

Defined in: content/types/personalize/personalize-service.d.ts:78

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

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: content/types/personalize/personalize-service.d.ts:85

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation

***

### getPersonalizeInfo()

> **getPersonalizeInfo**(`itemPath`, `language`, `siteName`): `Promise`\<`PersonalizeInfo` \| `undefined`\>

Defined in: content/types/personalize/personalize-service.d.ts:71

Get personalize information for a route

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | page route |
| `language` | `string` | language |
| `siteName` | `string` | site name |

#### Returns

`Promise`\<`PersonalizeInfo` \| `undefined`\>

the personalize information or undefined (if itemPath / language not found)
