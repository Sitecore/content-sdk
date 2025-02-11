[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [i18n](../README.md) / GraphQLDictionaryService

# Class: GraphQLDictionaryService

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:102](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/i18n/graphql-dictionary-service.ts#L102)

Service that fetch dictionary data using Sitecore's GraphQL API.

## Mixes

SearchQueryService<DictionaryQueryResult>

## Extends

- [`DictionaryServiceBase`](DictionaryServiceBase.md)

## Constructors

### new GraphQLDictionaryService()

> **new GraphQLDictionaryService**(`options`): [`GraphQLDictionaryService`](GraphQLDictionaryService.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:109](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/i18n/graphql-dictionary-service.ts#L109)

Creates an instance of graphQL dictionary service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`GraphQLDictionaryServiceConfig`](../interfaces/GraphQLDictionaryServiceConfig.md) | instance |

#### Returns

[`GraphQLDictionaryService`](GraphQLDictionaryService.md)

#### Overrides

[`DictionaryServiceBase`](DictionaryServiceBase.md).[`constructor`](DictionaryServiceBase.md#constructors)

## Properties

### options

> **options**: [`GraphQLDictionaryServiceConfig`](../interfaces/GraphQLDictionaryServiceConfig.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:109](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/i18n/graphql-dictionary-service.ts#L109)

instance

#### Inherited from

[`DictionaryServiceBase`](DictionaryServiceBase.md).[`options`](DictionaryServiceBase.md#options-1)

## Methods

### fetchDictionaryData()

> **fetchDictionaryData**(`language`): `Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:120](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/i18n/graphql-dictionary-service.ts#L120)

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

#### Overrides

[`DictionaryServiceBase`](DictionaryServiceBase.md).[`fetchDictionaryData`](DictionaryServiceBase.md#fetchdictionarydata)

***

### fetchWithSiteQuery()

> **fetchWithSiteQuery**(`language`): `Promise`\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:140](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/i18n/graphql-dictionary-service.ts#L140)

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

Defined in: [packages/core/src/i18n/dictionary-service.ts:62](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/i18n/dictionary-service.ts#L62)

Gets a cache client that can cache data. Uses memory-cache as the default
library for caching (@see MemoryCacheClient). Override this method if you
want to use something else.

#### Returns

[`CacheClient`](../../index/interfaces/CacheClient.md)\<[`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)\>

implementation

#### Inherited from

[`DictionaryServiceBase`](DictionaryServiceBase.md).[`getCacheClient`](DictionaryServiceBase.md#getcacheclient)

***

### getCacheValue()

> **getCacheValue**(`key`): `null` \| [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

Defined in: [packages/core/src/i18n/dictionary-service.ts:52](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/i18n/dictionary-service.ts#L52)

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

#### Inherited from

[`DictionaryServiceBase`](DictionaryServiceBase.md).[`getCacheValue`](DictionaryServiceBase.md#getcachevalue)

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

Defined in: [packages/core/src/i18n/graphql-dictionary-service.ts:186](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/i18n/graphql-dictionary-service.ts#L186)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../index/interfaces/GraphQLClient.md)

implementation

***

### setCacheValue()

> **setCacheValue**(`key`, `value`): [`DictionaryPhrases`](../interfaces/DictionaryPhrases.md)

Defined in: [packages/core/src/i18n/dictionary-service.ts:43](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/core/src/i18n/dictionary-service.ts#L43)

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

#### Inherited from

[`DictionaryServiceBase`](DictionaryServiceBase.md).[`setCacheValue`](DictionaryServiceBase.md#setcachevalue)
