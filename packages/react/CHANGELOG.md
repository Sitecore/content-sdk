# @sitecore-content-sdk/react

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
