[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SearchService

# Class: SearchService

Defined in: [search-service.ts:98](https://github.com/Sitecore/content-sdk/blob/989287a2df1ab364e25b013c2e5fd976abe491b5/packages/search/src/search-service.ts#L98)

Service that fetches search results from Sitecore.

## Constructors

### Constructor

> **new SearchService**(`config`): `SearchService`

Defined in: [search-service.ts:101](https://github.com/Sitecore/content-sdk/blob/989287a2df1ab364e25b013c2e5fd976abe491b5/packages/search/src/search-service.ts#L101)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`SearchServiceConfig`](../interfaces/SearchServiceConfig.md) |

#### Returns

`SearchService`

## Methods

### search()

> **search**\<`T`\>(`params`, `fetchOptions?`): `Promise`\<[`SearchResponse`](../interfaces/SearchResponse.md)\<`T`\>\>

Defined in: [search-service.ts:121](https://github.com/Sitecore/content-sdk/blob/989287a2df1ab364e25b013c2e5fd976abe491b5/packages/search/src/search-service.ts#L121)

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
