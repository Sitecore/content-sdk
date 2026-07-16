# @sitecore-content-sdk/core

## 2.1.2

### Patch Changes

- Export `escapeRegExp` from `@sitecore-content-sdk/core/tools` for use by nextjs redirects proxy. ([ca2255d](https://github.com/sitecore/content-sdk/commit/ca2255d7170e21e475637632b0b2a3411f1fd19b))
- [Non breaking] Refactor config and some component logic to be framework reusable ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))

## 2.1.1

### Patch Changes

- [core][content] Replace `url-parse` with the WHATWG `URL` API in the GraphQL client and media URL helpers to avoid Node `DEP0169` / legacy URL parsing warnings. ([c50ffd7](https://github.com/sitecore/content-sdk/commit/c50ffd7c4f7e7995d1145f8a5659acb6ed683eab))
