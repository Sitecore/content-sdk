# @sitecore-content-sdk/react

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
