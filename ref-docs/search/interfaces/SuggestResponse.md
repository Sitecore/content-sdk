[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SuggestResponse

# Interface: SuggestResponse\<T\>

Defined in: [search-service.ts:169](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/search/src/search-service.ts#L169)

Response from the Suggest Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### previewResults

> **previewResults**: `T`[]

Defined in: [search-service.ts:177](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/search/src/search-service.ts#L177)

Document previews from preview results mode.

***

### querySuggestions

> **querySuggestions**: [`QuerySuggestionItem`](QuerySuggestionItem.md)[]

Defined in: [search-service.ts:173](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/search/src/search-service.ts#L173)

Autocomplete completions from query suggestion mode.
