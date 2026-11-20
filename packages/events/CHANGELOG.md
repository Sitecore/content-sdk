# @sitecore-content-sdk/events

## 2.2.0

### Minor Changes

- minor `@sitecore-content-sdk/core` dependency update:
  - Add package capability exports and build-time capability discovery. Generated application metadata
    now includes the capabilities supported and used by the application, and editing configuration
    endpoints expose the resolved capability keys. ([e2bacaf](https://github.com/sitecore/content-sdk/commit/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad))

## 2.1.2

### Patch Changes

- Fix misalignment of the date of birth `dob` field in the identity event payload between backend and sdk ([9329e6e](https://github.com/sitecore/content-sdk/commit/9329e6e2d33c2b5d7d6c8bef29aa6663d4bb5a71))

## 2.1.1

### Patch Changes

- [Chore] Change the exports order of `types` in package.json to prevent Angular compiler warnings ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))
