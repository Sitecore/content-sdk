[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [i18n](../README.md) / DictionaryService

# Class: DictionaryService

Defined in: [content/src/i18n/dictionary-service.ts:123](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/content/src/i18n/dictionary-service.ts#L123)

Service that fetch dictionary data using Sitecore's GraphQL API.

## Mixes

SearchQueryService<DictionaryQueryResult>

## Implements

- `CacheClient`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

## Constructors

### Constructor

> **new DictionaryService**(`options`): `DictionaryService`

Defined in: [content/src/i18n/dictionary-service.ts:130](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/content/src/i18n/dictionary-service.ts#L130)

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

Defined in: [content/src/i18n/dictionary-service.ts:130](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/content/src/i18n/dictionary-service.ts#L130)

instance

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`language`, `site`, `fetchOptions?`): `Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [content/src/i18n/dictionary-service.ts:143](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/content/src/i18n/dictionary-service.ts#L143)

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

> `protected` **getCacheClient**(): `CacheClient`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [content/src/i18n/dictionary-service.ts:222](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/content/src/i18n/dictionary-service.ts#L222)

Gets a cache client that can cache data. Uses memory-cache as the default
library for caching (@see MemoryCacheClient). Override this method if you
want to use something else.

#### Returns

`CacheClient`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

implementation

***

### getCacheValue()

> **getCacheValue**(`key`): [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md) \| `null`

Defined in: [content/src/i18n/dictionary-service.ts:212](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/content/src/i18n/dictionary-service.ts#L212)

Retrieves a

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | The cache key. |

#### Returns

[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md) \| `null`

The

#### See

 - DictionaryPhrases value from the cache.
 - DictionaryPhrases value, or null if the specified key is not found in the cache.

#### Implementation of

`CacheClient.getCacheValue`

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/i18n/dictionary-service.ts:232](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/content/src/i18n/dictionary-service.ts#L232)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation

***

### setCacheValue()

> **setCacheValue**(`key`, `value`): [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

Defined in: [content/src/i18n/dictionary-service.ts:203](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/content/src/i18n/dictionary-service.ts#L203)

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

`CacheClient.setCacheValue`
