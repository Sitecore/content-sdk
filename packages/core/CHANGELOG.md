# @sitecore-content-sdk/core

## 2.1.3

### Patch Changes

- Default GraphQLRequestClient to the global fetch API so graphql-request does not use cross-fetch/node-fetch, which triggers Node DEP0169 via url.parse(). ([f3401a8](https://github.com/sitecore/content-sdk/commit/f3401a8f88338ab1fd34e5ea98096e167973633a))

## 2.1.2

### Patch Changes

- Export `escapeRegExp` from `@sitecore-content-sdk/core/tools` for use by nextjs redirects proxy. ([ca2255d](https://github.com/sitecore/content-sdk/commit/ca2255d7170e21e475637632b0b2a3411f1fd19b))
- [Non breaking] Refactor config and some component logic to be framework reusable ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))

## 2.1.1

### Patch Changes

- [core][content] Replace `url-parse` with the WHATWG `URL` API in the GraphQL client and media URL helpers to avoid Node `DEP0169` / legacy URL parsing warnings. ([c50ffd7](https://github.com/sitecore/content-sdk/commit/c50ffd7c4f7e7995d1145f8a5659acb6ed683eab))
