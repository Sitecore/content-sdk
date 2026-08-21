---
'@sitecore-content-sdk/react': minor
---

Add `useSuggest` React hook for `/v1/search/suggest` typeahead

- Accepts `searchIndexId`, `query` (mapped to `keyphrase`), optional `locale`, `enabled`, and `keepPreviousData`
- Returns `querySuggestions`, `previewResults`, and the same loading/error flags as `useSearch`
- Does not send a request when `query` is empty or whitespace only
