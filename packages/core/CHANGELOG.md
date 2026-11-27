# @sitecore-content-sdk/core

## 2.2.0

### Minor Changes

- Add package capability exports and build-time capability discovery. Generated application metadata ([e2bacaf](https://github.com/sitecore/content-sdk/commit/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad))
  now includes the capabilities supported and used by the application, and editing configuration
  endpoints expose the resolved capability keys.

### Patch Changes

- Harden editing secret handling. An invalid editing secret no longer writes the sent or expected secret to debug logs. The message now points to the `SITECORE_EDITING_SECRET` environment variable on the editing host. The editing secret query parameter is also redacted from the request details logged when an editing render, FEAAS render, config or experimental features request starts. Editing and revalidate secrets are now compared in constant time (`crypto.timingSafeEqual`) to prevent timing attacks. ([47aea23](https://github.com/sitecore/content-sdk/commit/47aea23db5c87b62b269d8f5d3e2ee45d9901657))
- Omit `javascript:` hrefs from `Link`. The link text still renders, a blocked URL is logged when that link is shown, and Pages editing chromes stay in place. React 19 blocks these URLs, so the component no longer passes them through to the anchor. ([51a9829](https://github.com/sitecore/content-sdk/commit/51a9829bf867488124b20691dcc78e44f942c3db))
- Remove `javascript:` URLs from `RichText` and from `Text` when `encode` is false, in React and in the Angular `*scRichText` and `*scText` directives. The surrounding HTML and text stay in place, and a removed URL is logged when the field renders. The Angular `*scLink` and `*scRouterLink` directives also omit `javascript:` hrefs, matching the React `Link` component. ([11719c2](https://github.com/sitecore/content-sdk/commit/11719c29a76964a5138c9b66c4ad7c2c94a0da6d))
- `LayoutService` now passes `site`, `routePath` and `language` to the layout query as GraphQL variables, so a route path from the request URL can no longer change the query. URLs with characters such as `"`, `\` or line breaks now resolve to a not-found page instead of an HTTP 500. A custom `layout.formatLayoutQuery` now gets its values escaped for use inside a double-quoted GraphQL string. ([84bf2bd](https://github.com/sitecore/content-sdk/commit/84bf2bda90cece7039a2dce1d068cc3670fab0df))
- Stop writing the editing secret to debug logs through request headers. The value of that header is now replaced with `[redacted]` in debug output only, the header is still sent with the request. `NativeDataFetcher` also no longer logs the raw `Headers` object for the request in place of the redacted copy. ([5f3a752](https://github.com/sitecore/content-sdk/commit/5f3a752c70ee72724112f3ed87925efaf43205a5))
- Fix custom `fetch` functions supplied through `FetchOptions` being ignored by `SitecoreClient.getData()` and `SitecoreClient.getPage()`. `GraphQLRequestClient` now honors the override for the individual request and its retries without changing the configured fetch used by other requests. ([a6f2fa8](https://github.com/sitecore/content-sdk/commit/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82))

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
