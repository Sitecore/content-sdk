---
'@sitecore-content-sdk/search': minor
---

Add typeahead suggest support to `SearchService`

- New `SearchService.suggest()` method calling `POST {edgeUrl}/v1/search/suggest`
- Accepts `searchIndexId`, required non-empty `keyphrase`, and optional `locale`
- Returns wire-shaped `querySuggestions` and `previewResults`
- New public types: `SuggestParameters`, `SuggestResponse`, `QuerySuggestionItem`
