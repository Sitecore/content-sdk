[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [personalize](../README.md) / PersonalizeService

# Class: PersonalizeService

Defined in: [content/src/personalize/personalize-service.ts:59](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/personalize/personalize-service.ts#L59)

Fetch personalize data using the Sitecore GraphQL endpoint.

## Constructors

### Constructor

> **new PersonalizeService**(`config`): `PersonalizeService`

Defined in: [content/src/personalize/personalize-service.ts:67](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/personalize/personalize-service.ts#L67)

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

Defined in: [content/src/personalize/personalize-service.ts:67](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/personalize/personalize-service.ts#L67)

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [content/src/personalize/personalize-service.ts:73](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/personalize/personalize-service.ts#L73)

##### Returns

`string`

## Methods

### getCacheClient()

> `protected` **getCacheClient**(): `CacheClient`\<`PersonalizeQueryResult`\>

Defined in: [content/src/personalize/personalize-service.ts:137](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/personalize/personalize-service.ts#L137)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

`CacheClient`\<`PersonalizeQueryResult`\>

CacheClient instance

***

### getCacheKey()

> `protected` **getCacheKey**(`itemPath`, `language`, `siteName`): `string`

Defined in: [content/src/personalize/personalize-service.ts:144](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/personalize/personalize-service.ts#L144)

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

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/personalize/personalize-service.ts:154](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/personalize/personalize-service.ts#L154)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation

***

### getPersonalizeInfo()

> **getPersonalizeInfo**(`itemPath`, `language`, `siteName`): `Promise`\<[`PersonalizeInfo`](../type-aliases/PersonalizeInfo.md) \| `undefined`\>

Defined in: [content/src/personalize/personalize-service.ts:96](https://github.com/Sitecore/content-sdk/blob/89adbfc3ea681d0ed290aa42c633f2413d661f6c/packages/content/src/personalize/personalize-service.ts#L96)

Get personalize information for a route

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | page route |
| `language` | `string` | language |
| `siteName` | `string` | site name |

#### Returns

`Promise`\<[`PersonalizeInfo`](../type-aliases/PersonalizeInfo.md) \| `undefined`\>

the personalize information or undefined (if itemPath / language not found)
