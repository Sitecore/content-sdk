[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [personalize](../README.md) / PersonalizeService

# Class: PersonalizeService

Defined in: [content/src/personalize/personalize-service.ts:58](https://github.com/Sitecore/content-sdk/blob/fc12774027a7aa86b870d5da278426b9cdfbfffb/packages/content/src/personalize/personalize-service.ts#L58)

Fetch personalize data using the Sitecore GraphQL endpoint.

## Constructors

### Constructor

> **new PersonalizeService**(`config`): `PersonalizeService`

Defined in: [content/src/personalize/personalize-service.ts:66](https://github.com/Sitecore/content-sdk/blob/fc12774027a7aa86b870d5da278426b9cdfbfffb/packages/content/src/personalize/personalize-service.ts#L66)

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

Defined in: [content/src/personalize/personalize-service.ts:66](https://github.com/Sitecore/content-sdk/blob/fc12774027a7aa86b870d5da278426b9cdfbfffb/packages/content/src/personalize/personalize-service.ts#L66)

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [content/src/personalize/personalize-service.ts:72](https://github.com/Sitecore/content-sdk/blob/fc12774027a7aa86b870d5da278426b9cdfbfffb/packages/content/src/personalize/personalize-service.ts#L72)

##### Returns

`string`

## Methods

### getCacheClient()

> `protected` **getCacheClient**(): `CacheClient`\<`PersonalizeQueryResult`\>

Defined in: [content/src/personalize/personalize-service.ts:136](https://github.com/Sitecore/content-sdk/blob/fc12774027a7aa86b870d5da278426b9cdfbfffb/packages/content/src/personalize/personalize-service.ts#L136)

Gets cache client implementation
Override this method if custom cache needs to be used

#### Returns

`CacheClient`\<`PersonalizeQueryResult`\>

CacheClient instance

***

### getCacheKey()

> `protected` **getCacheKey**(`itemPath`, `language`, `siteName`): `string`

Defined in: [content/src/personalize/personalize-service.ts:143](https://github.com/Sitecore/content-sdk/blob/fc12774027a7aa86b870d5da278426b9cdfbfffb/packages/content/src/personalize/personalize-service.ts#L143)

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

Defined in: [content/src/personalize/personalize-service.ts:153](https://github.com/Sitecore/content-sdk/blob/fc12774027a7aa86b870d5da278426b9cdfbfffb/packages/content/src/personalize/personalize-service.ts#L153)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation

***

### getPersonalizeInfo()

> **getPersonalizeInfo**(`itemPath`, `language`, `siteName`): `Promise`\<[`PersonalizeInfo`](../type-aliases/PersonalizeInfo.md) \| `undefined`\>

Defined in: [content/src/personalize/personalize-service.ts:95](https://github.com/Sitecore/content-sdk/blob/fc12774027a7aa86b870d5da278426b9cdfbfffb/packages/content/src/personalize/personalize-service.ts#L95)

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
