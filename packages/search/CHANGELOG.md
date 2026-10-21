# @sitecore-content-sdk/search

## 0.5.0

### Minor Changes

- Add More Like This (MLT) query support to SearchService and React search hooks ([b0823f3](https://github.com/sitecore/content-sdk/commit/b0823f3a364598af8034e451448160c20b885d18))

  - New public `SearchQuery` type models the `/v1/search` query payload (`keyphrase`, `seedItemId`, `seedItemUrl`)
  - `SearchParameters` now accepts optional mutually exclusive `seedItemId` and `seedItemUrl` fields for MLT widget queries
  - `SearchService.search()` validates that only one of `keyphrase`, `seedItemId`, or `seedItemUrl` is provided
  - Seed fields are sent only to `/v1/search`; `/v1/search/suggest` continues to accept `keyphrase` only
  - MLT responses map to the existing `results` / `total` / `facets` shape
  - `useSearch` and `useInfiniteSearch` accept `seedItemId` and `seedItemUrl`

- Add typeahead suggest support to `SearchService` ([b0823f3](https://github.com/sitecore/content-sdk/commit/b0823f3a364598af8034e451448160c20b885d18))

  - New `SearchService.suggest()` method calling `POST {edgeUrl}/v1/search/suggest`
  - Accepts `searchIndexId`, required non-empty `keyphrase`, and optional `locale`
  - Returns wire-shaped `querySuggestions` and `previewResults`
  - New public types: `SuggestParameters`, `SuggestResponse`, `QuerySuggestionItem`

## 0.4.0

### Minor Changes

- Add locale and facet support to search package and React hooks ([ce89722](https://github.com/sitecore/content-sdk/commit/ce897227369d7cdccf3cbb79b621c67585f7aff6))

  - `SearchParameters` now accepts an optional `locale` field for multi-locale index configurations
  - `SearchParameters` now accepts an optional `facet` field (`FacetRequest`) to request facet counts and filter by facet values
  - `SearchResponse` now includes an optional `facets` field (`FacetResult[]`) with facet data when requested
  - Six new public types exported from `@sitecore-content-sdk/search`: `FacetRequest`, `FacetField`, `FacetFilter`, `FacetFilterOperator`, `FacetValue`, `FacetResult`
  - `useSearch` and `useInfiniteSearch` hooks in `@sitecore-content-sdk/react` updated to support the new `locale` and `facet` options and expose `facets` in the returned state
