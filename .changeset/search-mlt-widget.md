---
'@sitecore-content-sdk/search': minor
'@sitecore-content-sdk/react': minor
---

Add More Like This (MLT) query support to SearchService and React search hooks

- New public `SearchQuery` type models the `/v1/search` query payload (`keyphrase`, `seedItemId`, `seedItemUrl`)
- `SearchParameters` now accepts optional mutually exclusive `seedItemId` and `seedItemUrl` fields for MLT widget queries
- `SearchService.search()` validates that only one of `keyphrase`, `seedItemId`, or `seedItemUrl` is provided
- Seed fields are sent only to `/v1/search`; `/v1/search/suggest` continues to accept `keyphrase` only
- MLT responses map to the existing `results` / `total` / `facets` shape
- `useSearch` and `useInfiniteSearch` accept `seedItemId` and `seedItemUrl`
