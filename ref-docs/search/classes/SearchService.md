[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchService

# Class: SearchService

Defined in: [search-service.ts:101](https://github.com/Sitecore/content-sdk/blob/200841a0259c72fee00f61fef7f94179a0bdad7d/packages/search/src/search-service.ts#L101)

Service that fetches search results from Sitecore.

## Constructors

### Constructor

> **new SearchService**(`config`): `SearchService`

Defined in: [search-service.ts:104](https://github.com/Sitecore/content-sdk/blob/200841a0259c72fee00f61fef7f94179a0bdad7d/packages/search/src/search-service.ts#L104)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`SearchServiceConfig`](../interfaces/SearchServiceConfig.md) |

#### Returns

`SearchService`

## Methods

### search()

> **search**\<`T`\>(`params`, `fetchOptions?`): `Promise`\<[`SearchResponse`](../interfaces/SearchResponse.md)\<`T`\>\>

Defined in: [search-service.ts:124](https://github.com/Sitecore/content-sdk/blob/200841a0259c72fee00f61fef7f94179a0bdad7d/packages/search/src/search-service.ts#L124)

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
