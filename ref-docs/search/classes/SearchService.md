[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchService

# Class: SearchService

Defined in: [search-service.ts:120](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/search/src/search-service.ts#L120)

Service that fetches search results from Sitecore.

## Constructors

### Constructor

> **new SearchService**(`config`): `SearchService`

Defined in: [search-service.ts:123](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/search/src/search-service.ts#L123)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`SearchServiceConfig`](../interfaces/SearchServiceConfig.md) |

#### Returns

`SearchService`

## Methods

### search()

> **search**\<`T`\>(`params`, `fetchOptions?`): `Promise`\<[`SearchResponse`](../interfaces/SearchResponse.md)\<`T`\>\>

Defined in: [search-service.ts:143](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/search/src/search-service.ts#L143)

Search for items in the search index.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`SearchParameters`](../interfaces/SearchParameters.md)\<`T`\> | The search parameters. |
| `fetchOptions?` | [`SearchServiceFetchOptions`](../type-aliases/SearchServiceFetchOptions.md) | The fetch options. |

#### Returns

`Promise`\<[`SearchResponse`](../interfaces/SearchResponse.md)\<`T`\>\>

The search response.

#### Throws

if the request fails.

#### Throws

If limit is not a positive number.

#### Throws

If limit is greater than 500.

#### Throws

If offset is not a positive number.

#### Throws

If search index ID is not provided.

#### Throws

If sort is not an array or an object.
