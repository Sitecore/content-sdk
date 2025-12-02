[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [i18n](../README.md) / DictionaryService

# Class: DictionaryService

Defined in: [packages/core/src/i18n/dictionary-service.ts:119](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/i18n/dictionary-service.ts#L119)

Service that fetch dictionary data using Sitecore's GraphQL API.

## Mixes

SearchQueryService<DictionaryQueryResult>

## Implements

- [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

## Constructors

### Constructor

> **new DictionaryService**(`options`): `DictionaryService`

Defined in: [packages/core/src/i18n/dictionary-service.ts:126](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/i18n/dictionary-service.ts#L126)

Creates an instance of graphQL dictionary service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`DictionaryServiceConfig`](../interfaces/DictionaryServiceConfig.md) | instance |

#### Returns

`DictionaryService`

## Properties

### options

> **options**: [`DictionaryServiceConfig`](../interfaces/DictionaryServiceConfig.md)

Defined in: [packages/core/src/i18n/dictionary-service.ts:126](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/i18n/dictionary-service.ts#L126)

instance

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`language`, `site`, `fetchOptions?`): `Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/dictionary-service.ts:139](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/i18n/dictionary-service.ts#L139)

Fetches dictionary data for internalization. Uses search query by default

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | the language to fetch |
| `site` | `string` | site name to fetch data for. |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

dictionary phrases

#### Throws

if the app root was not found for the specified site and language.

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/dictionary-service.ts:218](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/i18n/dictionary-service.ts#L218)

Gets a cache client that can cache data. Uses memory-cache as the default
library for caching (@see MemoryCacheClient). Override this method if you
want to use something else.

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

implementation

***

### getCacheValue()

> **getCacheValue**(`key`): `null` \| [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

Defined in: [packages/core/src/i18n/dictionary-service.ts:208](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/i18n/dictionary-service.ts#L208)

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

Defined in: [packages/core/src/i18n/dictionary-service.ts:228](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/i18n/dictionary-service.ts#L228)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### setCacheValue()

> **setCacheValue**(`key`, `value`): [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

Defined in: [packages/core/src/i18n/dictionary-service.ts:199](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/core/src/i18n/dictionary-service.ts#L199)

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
