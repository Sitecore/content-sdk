[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchService

# Class: SearchService

Defined in: [search-service.ts:184](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/search/src/search-service.ts#L184)

Service that fetches search results from Sitecore.

## Constructors

### Constructor

> **new SearchService**(`config`): `SearchService`

Defined in: [search-service.ts:187](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/search/src/search-service.ts#L187)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`SearchServiceConfig`](../interfaces/SearchServiceConfig.md) |

#### Returns

`SearchService`

## Methods

### search()

> **search**\<`T`\>(`params`, `fetchOptions?`): `Promise`\<[`SearchResponse`](../interfaces/SearchResponse.md)\<`T`\>\>

Defined in: [search-service.ts:212](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/search/src/search-service.ts#L212)

Search for items in the search index.
For keyword search, pass `keyphrase`. For More Like This (MLT) widget queries,
pass `seedItemId` or `seedItemUrl` instead. These query fields are mutually exclusive.
MLT responses are mapped to the same `results` / `total` / `facets` shape as keyword search.

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

#### Throws

If more than one of keyphrase, seedItemId, or seedItemUrl is provided.

#### Throws

If seedItemId or seedItemUrl is empty or whitespace only.

***

### suggest()

> **suggest**\<`T`\>(`params`, `fetchOptions?`): `Promise`\<[`SuggestResponse`](../interfaces/SuggestResponse.md)\<`T`\>\>

Defined in: [search-service.ts:281](https://github.com/Sitecore/content-sdk/blob/fa0496c6ff6f86b0a1256461d585a8535456bf38/packages/search/src/search-service.ts#L281)

Retrieve typeahead suggestions for a keyphrase.

#### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `params` | [`SuggestParameters`](../interfaces/SuggestParameters.md) | The suggest parameters. |
| `fetchOptions?` | [`SearchServiceFetchOptions`](../type-aliases/SearchServiceFetchOptions.md) | The fetch options. |

#### Returns

`Promise`\<[`SuggestResponse`](../interfaces/SuggestResponse.md)\<`T`\>\>

The suggest response.

#### Throws

if the request fails.

#### Throws

If search index ID is not provided.

#### Throws

If keyphrase is not provided or is empty.
