# @sitecore-content-sdk/core

## 2.1.4

### Patch Changes

- Resolve FEaaS/BYOC stylesheet links against the configured Edge URL (framework-wide). App Router only: drop `precedence="high"` so styles apply instead of preload. ([16e405f](https://github.com/sitecore/content-sdk/commit/16e405f3667f5f05e5fd97b8174bd2b99de45db6))
- Fix pnpm omitting Sitecore packages from `metadata.json`. List with `pnpm list --parseable --long` and parse bun and pnpm output with the same regex. ([8f96240](https://github.com/sitecore/content-sdk/commit/8f962400f3b79f00425a8cd76a6d2082b5b47c47))
- Detect the active package manager from `npm_config_user_agent` (falling back to `npm_execpath`) and use that manager's listing command when collecting Sitecore package metadata, so metadata generation follows the package manager that is running the build. ([9b45c28](https://github.com/sitecore/content-sdk/commit/9b45c283e831ade8b97eab10178dc32f73796f7e))

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
