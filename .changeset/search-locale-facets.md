---
'@sitecore-content-sdk/search': minor
'@sitecore-content-sdk/react': minor
---

Add locale and facet support to search package and React hooks

- `SearchParameters` now accepts an optional `locale` field for multi-locale index configurations
- `SearchParameters` now accepts an optional `facet` field (`FacetRequest`) to request facet counts and filter by facet values
- `SearchResponse` now includes an optional `facets` field (`FacetResult[]`) with facet data when requested
- Six new public types exported from `@sitecore-content-sdk/search`: `FacetRequest`, `FacetField`, `FacetFilter`, `FacetFilterOperator`, `FacetValue`, `FacetResult`
- `useSearch` and `useInfiniteSearch` hooks in `@sitecore-content-sdk/react` updated to support the new `locale` and `facet` options and expose `facets` in the returned state
