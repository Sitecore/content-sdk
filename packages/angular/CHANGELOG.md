# @sitecore-content-sdk/angular

## 1.1.0

### Minor Changes

- minor `@sitecore-content-sdk/content` dependency update:
  - Schema.org & JSON-LD Support ([b858df1](https://github.com/sitecore/content-sdk/commit/b858df1f6f27c4f7a00a2d33c81c5e5233790233))

### Patch Changes

- `sc:item` tags no longer carry a version segment (`sc:item:<id>:<locale>`), so cache writes and ([bdfa673](https://github.com/sitecore/content-sdk/commit/bdfa67377694c76573cfc03186b832708bdb43b7))
  webhook revalidation always agree.
  Item cache tags could previously include a specific published version (`sc:item:<id>:<locale>:v<N>`)
  when the layout response reported `itemVersion`, but webhook-driven revalidation always targets
  `sc:item:<id>:<locale>:latest`. The mismatch meant those page cache entries were silently unreachable by `revalidateTag` and only went stale on cache TTL expiry.
- `sc:item` tags now always use hyphenated lowercase GUIDs (`sc:item:<hyphenated-id>:<locale>:latest`), so cache writes and webhook revalidation always agree. ([330793b](https://github.com/sitecore/content-sdk/commit/330793b3538a3eba00242844c28348678a5704cf))

  Experience Edge publish payloads send unhyphenated item IDs (`xxxxxxxxx`). Cached pages already tag content with hyphenated lowercase GUIDs (`sc:item:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:...`). Because Next.js / loader cache tags are compared as exact strings, those invalidation tags missed and published updates could stay stale.

## 1.0.0

### Major Changes

- Use CSDK_PUBLIC_DEFAULT_SITE_NAME variable instead of CSDK_PUBLIC_SITECORE_DEFAULT_SITE, aligning names across frameworks ([ccaa42f](https://github.com/sitecore/content-sdk/commit/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639))
  - When upgrading from your pre-release Angular app, please ensure you use `CSDK_PUBLIC_DEFAULT_SITE_NAME` and `CSDK_PUBLIC_DEFAULT_LANGUAGE` across your deployments
  - Check the updated `env.example` in the latest available Angular sample for the up-to-date list of available environnment variables

### Minor Changes

- Pass the page language to Sitecore Forms to support new multilingual form versions. ([fa0496c](https://github.com/sitecore/content-sdk/commit/fa0496c6ff6f86b0a1256461d585a8535456bf38))
- Design Studio support: ([b43b89c](https://github.com/sitecore/content-sdk/commit/b43b89c4517d088086fb9ff5cb80c35197e4d46f))
  - Adds a `design-library` component
  - Adds `library` and `library-medatada` modes support - preview existing and codegenerated components.
  - Implementation hangs on `import-map` (generated at build time) and a component factory to render components at runtime.
  - `DESIGN_LIBRARY_IMPORT_MAP` injections token provides a Promise to lazy load import map. `DESIGN_LIBRARY_COMPONENT_FACTORY` injection token provides the factory and allows overriding it.
- [experimental] Add experimental features visibility API shared across frameworks. Types/utils live in `@sitecore-content-sdk/content`; each framework package owns its `experimental.json` catalog. Next.js and Angular expose editing-secret protected endpoints, wired in all Next.js templates and the Angular server. ([b4fad5b](https://github.com/sitecore/content-sdk/commit/b4fad5bfdcf00eb3138cebc08959d248545d0a22))
- Code extraction support for Angular CSDK ([23c9158](https://github.com/sitecore/content-sdk/commit/23c9158a9fae985d2aaa32ec807904acdf22d6e7))
- [Design Studio] Import map generation ([1f90cbe](https://github.com/sitecore/content-sdk/commit/1f90cbe6031b31512cfc4f80ee1b4f04284b0ee3))
- minor `@sitecore-content-sdk/content` dependency update:

  - Pass the page language to Sitecore Forms to support new multilingual form versions. ([fa0496c](https://github.com/sitecore/content-sdk/commit/fa0496c6ff6f86b0a1256461d585a8535456bf38))
  - Add metadata and Open Graph tags to the NextJs scaffolding templates ([914f94a](https://github.com/sitecore/content-sdk/commit/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d))
  - [experimental] Add a global env switch for experimental features.

  Experimental feature status now treats the app-level `CSDK_GLOBAL_EXPERIMENTAL_FEATURES_ENABLED` as a global enable switch. When the global switch is off, feature status falls back to individual feature env vars. The shared experimental helpers expose the global env var constant (`CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG`) and helper, and starter env examples document how to enable experimental features during development. ([c9c8d1c](https://github.com/sitecore/content-sdk/commit/c9c8d1c0cd9bd014c418f5695be825137a97e6ba))

  - [experimental] Add experimental features visibility API shared across frameworks. Types/utils live in `@sitecore-content-sdk/content`; each framework package owns its `experimental.json` catalog. Next.js and Angular expose editing-secret protected endpoints, wired in all Next.js templates and the Angular server. ([b4fad5b](https://github.com/sitecore/content-sdk/commit/b4fad5bfdcf00eb3138cebc08959d248545d0a22))
  - Treat Layout Service `isContentResolved` as datasource validity in `withDatasourceCheck()`

  - `ComponentRendering` now includes optional `isContentResolved` from the layout `rendered` JSON
  - When `isContentResolved` is `false`, `withDatasourceCheck()` uses the existing missing-datasource fallback
  - When the property is omitted or `true`, existing behavior is unchanged ([afdfd19](https://github.com/sitecore/content-sdk/commit/afdfd1979b6ab6fba690d64bcf17ea29b4d851bb))
    - Use CSDK_PUBLIC_DEFAULT_SITE_NAME variable instead of CSDK_PUBLIC_SITECORE_DEFAULT_SITE, aligning names across frameworks
    - When upgrading from your pre-release Angular app, please ensure you use `CSDK_PUBLIC_DEFAULT_SITE_NAME` and `CSDK_PUBLIC_DEFAULT_LANGUAGE` across your deployments
    - Check the updated `env.example` in the latest available Angular sample for the up-to-date list of available environnment variables ([ccaa42f](https://github.com/sitecore/content-sdk/commit/ccaa42fb0ef4df028b4e3a0cdf13355c3673c639))
    - Add support of llms txt for all next apps through api routes. ([d2b0a9f](https://github.com/sitecore/content-sdk/commit/d2b0a9ffcd19364330158edd407f2f3e8df68565))

### Patch Changes

- [experimental] Add a global env switch for experimental features. ([c9c8d1c](https://github.com/sitecore/content-sdk/commit/c9c8d1c0cd9bd014c418f5695be825137a97e6ba))

  Experimental feature status now treats the app-level `CSDK_GLOBAL_EXPERIMENTAL_FEATURES_ENABLED` as a global enable switch. When the global switch is off, feature status falls back to individual feature env vars. The shared experimental helpers expose the global env var constant (`CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG`) and helper, and starter env examples document how to enable experimental features during development.

- Apply pascalCase transformation for component map entries at framework level ([8eb01ef](https://github.com/sitecore/content-sdk/commit/8eb01ef1062b410d0a689de49635870a3d3afbde))
- [bug] Fix unicode path routing producing 404 ([fbd07f4](https://github.com/sitecore/content-sdk/commit/fbd07f45d77bcc00772e33d09bde850e688b09b2))

## 0.2.0

### Minor Changes

- Add loader prefetch for `scRouterLink`/`scRichText` links, so route data is already loaded by the time a user navigates. ([84866de](https://github.com/sitecore/content-sdk/commit/84866ded66f6f8f69e7f007b2311494e086b493b))

  Controlled per-link via each directive's `prefetch` input, or globally via `sitecore.config`'s `angular.linkPrefetch`:

  - `'eager'` (default) — prefetch as soon as the link renders.
  - `'hover'` — defer prefetching until the pointer dwells on the link for `angular.linkPrefetch.delayMs` (default 100ms).
  - `'off'` — never prefetch.

- Support optional `sc_previewTime` on the Angular editing render endpoint for time-based Edge preview. ([8b18c6e](https://github.com/sitecore/content-sdk/commit/8b18c6e6c2cc3546028f5408655ca263435d7507))
- Bot tracking support for Angular ([4c907d5](https://github.com/sitecore/content-sdk/commit/4c907d5f6aac9870a7c40fd993f1f70ddce4802f))
  - Expose `createBotTrackingMiddleware` function that creates an Express middleware for identifying bot requests
- SXA Redirects support in Angular ([07c6169](https://github.com/sitecore/content-sdk/commit/07c6169d94098a2bc2f491ef61de4d253b52b098))

### Patch Changes

- [Chore] Cleanup demo code ([758194c](https://github.com/sitecore/content-sdk/commit/758194c5352b02735bc7dfd29f021597ce763889))

## 0.1.0

### Minor Changes

- Inital Angular support for Content SDK and Sitecore AI ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))
  - Basic rendering and skate-park sample app
  - Internalization
  - Multisite
  - Personalization and analytics page view events support
  - Stale-while-revalidate data caching (find more in documentation)
  - Editing and Preview
  - Sitemap and robots.txt enpoints support
  - Component-level Angular guards

### Patch Changes

- Correct siteName resolution in preview mode ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))
- Fix preview detection, rely on headers instead of cookies for preview ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))
