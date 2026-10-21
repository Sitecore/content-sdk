[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / SuggestResponse

# Interface: SuggestResponse\<T\>

Defined in: [search-service.ts:169](https://github.com/Sitecore/content-sdk/blob/f0d8e2f2a4d2702c275ba74dc0030e61bf69fd01/packages/search/src/search-service.ts#L169)

Response from the Suggest Service.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`SearchDocument`](../type-aliases/SearchDocument.md) | [`SearchDocument`](../type-aliases/SearchDocument.md) |

## Properties

### previewResults

> **previewResults**: `T`[]

Defined in: [search-service.ts:177](https://github.com/Sitecore/content-sdk/blob/f0d8e2f2a4d2702c275ba74dc0030e61bf69fd01/packages/search/src/search-service.ts#L177)

Document previews from preview results mode.

***

### querySuggestions

> **querySuggestions**: [`QuerySuggestionItem`](QuerySuggestionItem.md)[]

Defined in: [search-service.ts:173](https://github.com/Sitecore/content-sdk/blob/f0d8e2f2a4d2702c275ba74dc0030e61bf69fd01/packages/search/src/search-service.ts#L173)

Autocomplete completions from query suggestion mode.
