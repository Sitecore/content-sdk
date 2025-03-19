[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [i18n](../README.md) / GraphQLDictionaryService

# Class: GraphQLDictionaryService

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:137](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/i18n/graphql-dictionary-service.ts#L137)

Service that fetch dictionary data using Sitecore's GraphQL API.

## Mixes

SearchQueryService<DictionaryQueryResult>

## Implements

- [`DictionaryService`](../interfaces/DictionaryService.md)
- [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

## Constructors

### new GraphQLDictionaryService()

> **new GraphQLDictionaryService**(`options`): [`GraphQLDictionaryService`](GraphQLDictionaryService.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:144](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/i18n/graphql-dictionary-service.ts#L144)

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

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:144](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/i18n/graphql-dictionary-service.ts#L144)

instance

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`language`, `site`, `fetchOptions`?): `Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:157](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/i18n/graphql-dictionary-service.ts#L157)

Fetches dictionary data for internalization. Uses search query by default

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `language` | `string` | the language to fetch |
| `site` | `string` | site name to fetch data for. |
| `fetchOptions`? | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

dictionary phrases

#### Throws

if the app root was not found for the specified site and language.

#### Implementation of

[`DictionaryService`](../interfaces/DictionaryService.md).[`fetchDictionaryData`](../interfaces/DictionaryService.md#fetchdictionarydata)

***

### getCacheClient()

> `protected` **getCacheClient**(): [`CacheClient`](../../index/interfaces/CacheClient.md)\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:236](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/i18n/graphql-dictionary-service.ts#L236)

Gets a cache client that can cache data. Uses memory-cache as the default
library for caching (@see MemoryCacheClient). Override this method if you
want to use something else.

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

implementation

***

### getCacheValue()

> **getCacheValue**(`key`): `null` \| [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:226](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/i18n/graphql-dictionary-service.ts#L226)

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

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:246](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/i18n/graphql-dictionary-service.ts#L246)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### setCacheValue()

> **setCacheValue**(`key`, `value`): [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:217](https://github.com/Sitecore/xmc-jss-dev/blob/38628169543edbbaa7aaf11b37732422ca68db02/packages/core/src/i18n/graphql-dictionary-service.ts#L217)

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
