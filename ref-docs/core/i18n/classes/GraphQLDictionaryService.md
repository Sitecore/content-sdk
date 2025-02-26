[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [i18n](../README.md) / GraphQLDictionaryService

# Class: GraphQLDictionaryService

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:114](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/i18n/graphql-dictionary-service.ts#L114)

Service that fetch dictionary data using Sitecore's GraphQL API.

## Mixes

SearchQueryService<DictionaryQueryResult>

## Implements

- [`DictionaryService`](../interfaces/DictionaryService.md)
- [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

## Constructors

### new GraphQLDictionaryService()

> **new GraphQLDictionaryService**(`options`): [`GraphQLDictionaryService`](GraphQLDictionaryService.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:121](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/i18n/graphql-dictionary-service.ts#L121)

Creates an instance of graphQL dictionary service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`GraphQLDictionaryServiceConfig`](../interfaces/GraphQLDictionaryServiceConfig.md) | instance |

#### Returns

[`GraphQLDictionaryService`](GraphQLDictionaryService.md)

## Properties

### options

> **options**: [`GraphQLDictionaryServiceConfig`](../interfaces/GraphQLDictionaryServiceConfig.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:121](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/i18n/graphql-dictionary-service.ts#L121)

instance

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`language`): `Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:132](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/i18n/graphql-dictionary-service.ts#L132)

Fetches dictionary data for internalization. Uses search query by default

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | the language to fetch |

#### Returns

`Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

dictionary phrases

#### Throws

if the app root was not found for the specified site and language.

#### Implementation of

[`DictionaryService`](../interfaces/DictionaryService.md).[`fetchDictionaryData`](../interfaces/DictionaryService.md#fetchdictionarydata)

***

### fetchWithSiteQuery()

> **fetchWithSiteQuery**(`language`): `Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:152](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/i18n/graphql-dictionary-service.ts#L152)

Fetches dictionary data with site query
This is the default behavior for XMCloud deployments. Uses `siteQuery` to retrieve data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | the language to fetch |

#### Returns

`Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

dictionary phrases

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:218](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/i18n/graphql-dictionary-service.ts#L218)

Gets a cache client that can cache data. Uses memory-cache as the default
library for caching (@see MemoryCacheClient). Override this method if you
want to use something else.

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

implementation

***

### getCacheValue()

> **getCacheValue**(`key`): `null` \| [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:208](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/i18n/graphql-dictionary-service.ts#L208)

Retrieves a

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key. |

#### Returns

`null` \| [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

The

#### See

 - DictionaryPhrases value from the cache.
 - DictionaryPhrases value, or null if the specified key is not found in the cache.

#### Implementation of

[`CacheClient`](../../index/interfaces/CacheClient.md).[`getCacheValue`](../../index/interfaces/CacheClient.md#getcachevalue)

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:228](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/i18n/graphql-dictionary-service.ts#L228)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### setCacheValue()

> **setCacheValue**(`key`, `value`): [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:199](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/i18n/graphql-dictionary-service.ts#L199)

Caches a

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key. |
| `value` | [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md) | The value to cache. |

#### Returns

[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

The value added to the cache.

#### See

DictionaryPhrases value for the specified cache key.

#### Mixes

CacheClient<DictionaryPhrases>

#### Implementation of

[`CacheClient`](../../index/interfaces/CacheClient.md).[`setCacheValue`](../../index/interfaces/CacheClient.md#setcachevalue)
