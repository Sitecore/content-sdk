# @sitecore-content-sdk/react

## 2.4.0

### Minor Changes

- Pass the page language to Sitecore Forms to support new multilingual form versions. ([fa0496c](https://github.com/sitecore/content-sdk/commit/fa0496c6ff6f86b0a1256461d585a8535456bf38))
- Add metadata and Open Graph tags to the NextJs scaffolding templates ([914f94a](https://github.com/sitecore/content-sdk/commit/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d))
- Add More Like This (MLT) query support to SearchService and React search hooks ([b0823f3](https://github.com/sitecore/content-sdk/commit/b0823f3a364598af8034e451448160c20b885d18))

  - New public `SearchQuery` type models the `/v1/search` query payload (`keyphrase`, `seedItemId`, `seedItemUrl`)
  - `SearchParameters` now accepts optional mutually exclusive `seedItemId` and `seedItemUrl` fields for MLT widget queries
  - `SearchService.search()` validates that only one of `keyphrase`, `seedItemId`, or `seedItemUrl` is provided
  - Seed fields are sent only to `/v1/search`; `/v1/search/suggest` continues to accept `keyphrase` only
  - MLT responses map to the existing `results` / `total` / `facets` shape
  - `useSearch` and `useInfiniteSearch` accept `seedItemId` and `seedItemUrl`

- Add `useSuggest` React hook for `/v1/search/suggest` typeahead ([b0823f3](https://github.com/sitecore/content-sdk/commit/b0823f3a364598af8034e451448160c20b885d18))

  - Accepts `searchIndexId`, `query` (mapped to `keyphrase`), optional `locale`, `enabled`, and `keepPreviousData`
  - Returns `querySuggestions`, `previewResults`, and the same loading/error flags as `useSearch`
  - Does not send a request when `query` is empty or whitespace only

- minor `@sitecore-content-sdk/content` dependency update:

  - Pass the page language to Sitecore Forms to support new multilingual form versions. ([fa0496c](https://github.com/sitecore/content-sdk/commit/fa0496c6ff6f86b0a1256461d585a8535456bf38))
  - Add metadata and Open Graph tags to the NextJs scaffolding templates ([914f94a](https://github.com/sitecore/content-sdk/commit/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d))
  - [experimental] Add a global env switch for experimental features.

  Experimental feature status now treats the app-level `CSDK_GLOBAL_EXPERIMENTAL_FEATURES_ENABLED` as a global enable switch. When the global switch is off, feature status falls back to individual feature env vars. The shared experimental helpers expose the global env var constant (`CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG`) and helper, and starter env examples document how to enable experimental features during development. ([c9c8d1c](https://github.com/sitecore/content-sdk/commit/c9c8d1c0cd9bd014c418f5695be825137a97e6ba))

  - [experimental] Add experimental features visibility API shared across frameworks. Types/utils live in `@sitecore-content-sdk/content`; each framework package owns its `experimental.json` catalog. Next.js and Angular expose editing-secret protected endpoints, wired in all Next.js templates and the Angular server. ([b4fad5b](https://github.com/sitecore/content-sdk/commit/b4fad5bfdcf00eb3138cebc08959d248545d0a22))
  - Add support of llms txt for all next apps through api routes. ([d2b0a9f](https://github.com/sitecore/content-sdk/commit/d2b0a9ffcd19364330158edd407f2f3e8df68565))

- minor `@sitecore-content-sdk/search` dependency update:

  - Add More Like This (MLT) query support to SearchService and React search hooks

  - New public `SearchQuery` type models the `/v1/search` query payload (`keyphrase`, `seedItemId`, `seedItemUrl`)
  - `SearchParameters` now accepts optional mutually exclusive `seedItemId` and `seedItemUrl` fields for MLT widget queries
  - `SearchService.search()` validates that only one of `keyphrase`, `seedItemId`, or `seedItemUrl` is provided
  - Seed fields are sent only to `/v1/search`; `/v1/search/suggest` continues to accept `keyphrase` only
  - MLT responses map to the existing `results` / `total` / `facets` shape
  - `useSearch` and `useInfiniteSearch` accept `seedItemId` and `seedItemUrl` ([b0823f3](https://github.com/sitecore/content-sdk/commit/b0823f3a364598af8034e451448160c20b885d18))

    - Add typeahead suggest support to `SearchService`

  - New `SearchService.suggest()` method calling `POST {edgeUrl}/v1/search/suggest`
  - Accepts `searchIndexId`, required non-empty `keyphrase`, and optional `locale`
  - Returns wire-shaped `querySuggestions` and `previewResults`
  - New public types: `SuggestParameters`, `SuggestResponse`, `QuerySuggestionItem` ([b0823f3](https://github.com/sitecore/content-sdk/commit/b0823f3a364598af8034e451448160c20b885d18))

## 2.3.0

### Minor Changes

- Add locale and facet support to search package and React hooks ([ce89722](https://github.com/sitecore/content-sdk/commit/ce897227369d7cdccf3cbb79b621c67585f7aff6))

  - `SearchParameters` now accepts an optional `locale` field for multi-locale index configurations
  - `SearchParameters` now accepts an optional `facet` field (`FacetRequest`) to request facet counts and filter by facet values
  - `SearchResponse` now includes an optional `facets` field (`FacetResult[]`) with facet data when requested
  - Six new public types exported from `@sitecore-content-sdk/search`: `FacetRequest`, `FacetField`, `FacetFilter`, `FacetFilterOperator`, `FacetValue`, `FacetResult`
  - `useSearch` and `useInfiniteSearch` hooks in `@sitecore-content-sdk/react` updated to support the new `locale` and `facet` options and expose `facets` in the returned state

- minor `@sitecore-content-sdk/search` dependency update:

  - Add locale and facet support to search package and React hooks

  - `SearchParameters` now accepts an optional `locale` field for multi-locale index configurations
  - `SearchParameters` now accepts an optional `facet` field (`FacetRequest`) to request facet counts and filter by facet values
  - `SearchResponse` now includes an optional `facets` field (`FacetResult[]`) with facet data when requested
  - Six new public types exported from `@sitecore-content-sdk/search`: `FacetRequest`, `FacetField`, `FacetFilter`, `FacetFilterOperator`, `FacetValue`, `FacetResult`
  - `useSearch` and `useInfiniteSearch` hooks in `@sitecore-content-sdk/react` updated to support the new `locale` and `facet` options and expose `facets` in the returned state ([ce89722](https://github.com/sitecore/content-sdk/commit/ce897227369d7cdccf3cbb79b621c67585f7aff6))

### Patch Changes

- Fix `RichText` recreating nested DOM on parent re-renders by memoizing `dangerouslySetInnerHTML`, preserving event listeners on unchanged HTML. ([938ddb6](https://github.com/sitecore/content-sdk/commit/938ddb61579c0679f428b539202c0046ffa084a9))
- Fix hydration mismatch warnings in Pages Editor for empty placeholders and placeholder/rendering chrome markers, most visibly with `AppPlaceholder` in Next.js App Router. Sitecore Pages attaches chrome attributes (e.g. `cursor: pointer` styling) to these SDK-owned elements directly in the DOM, which can happen before React hydration completes and previously surfaced as a "server rendered HTML didn't match the client" warning. `suppressHydrationWarning` is now set on these editing-only elements, since their DOM is expected to be mutated externally. ([3b9edfe](https://github.com/sitecore/content-sdk/commit/3b9edfe853f8f321e9bd2dff8cfbdda2c3d66627))

  Also fixes a separate "Each child in a list should have a unique key prop" warning from the same code path: `AppPlaceholder`'s outer `PlaceholderMetadata` key now falls back to a placeholder-name-based key (`placeholder-metadata-${name}`) when the route rendering has no `uid`.

## 2.2.1

### Patch Changes

- Fix `Text` with `encode={false}` rendering `[object Object]` at newlines before HTML in Multi-Line Text fields. ([0741bb4](https://github.com/sitecore/content-sdk/commit/0741bb452b2ea3f885223f053dfeee4bf32d3e9e))
- [Non breaking] Refactor config and some component logic to be framework reusable ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))
- Fix build failure when `disableCodeGeneration: true` by writing empty import maps during codegen and defaulting `loadImportMap` to `noopLoadImportMap` when the prop is omitted. ([13f41bd](https://github.com/sitecore/content-sdk/commit/13f41bd2e6c114594096dffe00abf9fcf456f19f))

## 2.2.0

### Minor Changes

- [nextjs][react] Add renderChildrenWhenEmpty prop to Link component to render empty anchor with children instead of null when the link field value is empty. ([741a10f](https://github.com/sitecore/content-sdk/commit/741a10fca7aacb6f4518425a45f3773d17a013c1))
- minor `@sitecore-content-sdk/content` dependency update:
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
