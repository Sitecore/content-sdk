# create-content-sdk-app

## 2.3.2

### Patch Changes

- Ensure correct cli package version for angular sample ([2dc64e6](https://github.com/sitecore/content-sdk/commit/2dc64e62333bc02156fe37ffdcae6ab8a71ff4cc))

## 2.3.1

### Patch Changes

- Resolve draft/preview before cached page lookup so Pages Editor works for non-default locales ([3a21c12](https://github.com/sitecore/content-sdk/commit/3a21c1285ac924b2e5a0de164e3e0443e587c7f7))
- Leverage `appLocalePrefix` config setting in AppRouter ensuring redirect locale handling works when LocaleProxy is removed (`x-sc-locale` is optional). ([e2bac91](https://github.com/sitecore/content-sdk/commit/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46))
- [Chore] Cleanup demo code ([758194c](https://github.com/sitecore/content-sdk/commit/758194c5352b02735bc7dfd29f021597ce763889))
- Bot tracking support for Angular ([4c907d5](https://github.com/sitecore/content-sdk/commit/4c907d5f6aac9870a7c40fd993f1f70ddce4802f))
  - Expose `createBotTrackingMiddleware` function that creates an Express middleware for identifying bot requests
- SXA Redirects support in Angular ([07c6169](https://github.com/sitecore/content-sdk/commit/07c6169d94098a2bc2f491ef61de4d253b52b098))
- minor `@sitecore-content-sdk/angular` dependency update:

  - Add loader prefetch for `scRouterLink`/`scRichText` links, so route data is already loaded by the time a user navigates.

  Controlled per-link via each directive's `prefetch` input, or globally via `sitecore.config`'s `angular.linkPrefetch`:

  - `'eager'` (default) — prefetch as soon as the link renders.
  - `'hover'` — defer prefetching until the pointer dwells on the link for `angular.linkPrefetch.delayMs` (default 100ms).
  - `'off'` — never prefetch. ([84866de](https://github.com/sitecore/content-sdk/commit/84866ded66f6f8f69e7f007b2311494e086b493b))
    - Support optional `sc_previewTime` on the Angular editing render endpoint for time-based Edge preview. ([8b18c6e](https://github.com/sitecore/content-sdk/commit/8b18c6e6c2cc3546028f5408655ca263435d7507))
    - Bot tracking support for Angular
    - Expose `createBotTrackingMiddleware` function that creates an Express middleware for identifying bot requests ([4c907d5](https://github.com/sitecore/content-sdk/commit/4c907d5f6aac9870a7c40fd993f1f70ddce4802f))
    - SXA Redirects support in Angular ([07c6169](https://github.com/sitecore/content-sdk/commit/07c6169d94098a2bc2f491ef61de4d253b52b098))

- minor `@sitecore-content-sdk/react` dependency update:

  - Add locale and facet support to search package and React hooks

  - `SearchParameters` now accepts an optional `locale` field for multi-locale index configurations
  - `SearchParameters` now accepts an optional `facet` field (`FacetRequest`) to request facet counts and filter by facet values
  - `SearchResponse` now includes an optional `facets` field (`FacetResult[]`) with facet data when requested
  - Six new public types exported from `@sitecore-content-sdk/search`: `FacetRequest`, `FacetField`, `FacetFilter`, `FacetFilterOperator`, `FacetValue`, `FacetResult`
  - `useSearch` and `useInfiniteSearch` hooks in `@sitecore-content-sdk/react` updated to support the new `locale` and `facet` options and expose `facets` in the returned state ([ce89722](https://github.com/sitecore/content-sdk/commit/ce897227369d7cdccf3cbb79b621c67585f7aff6))

- minor `@sitecore-content-sdk/search` dependency update:

  - Add locale and facet support to search package and React hooks

  - `SearchParameters` now accepts an optional `locale` field for multi-locale index configurations
  - `SearchParameters` now accepts an optional `facet` field (`FacetRequest`) to request facet counts and filter by facet values
  - `SearchResponse` now includes an optional `facets` field (`FacetResult[]`) with facet data when requested
  - Six new public types exported from `@sitecore-content-sdk/search`: `FacetRequest`, `FacetField`, `FacetFilter`, `FacetFilterOperator`, `FacetValue`, `FacetResult`
  - `useSearch` and `useInfiniteSearch` hooks in `@sitecore-content-sdk/react` updated to support the new `locale` and `facet` options and expose `facets` in the returned state ([ce89722](https://github.com/sitecore/content-sdk/commit/ce897227369d7cdccf3cbb79b621c67585f7aff6))

## 2.3.0

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

- [create-content-sdk-app] Update template agent docs to describe auto-generated component maps ([8c0ae95](https://github.com/sitecore/content-sdk/commit/8c0ae95ab5ce5e9d182532dcc6bf504478c506a0))
- [create-content-sdk-app] Layer and slim AI guidance in scaffolded templates to reduce session-start LLM context ([407173b](https://github.com/sitecore/content-sdk/commit/407173b8dd1ade15e570175d8b08fef690e7cef9))
- Pass `defaultLanguage` from sitecore config to `LocaleProxy` in App Router templates so locale resolution uses the project default instead of hardcoded `en` ([28226c2](https://github.com/sitecore/content-sdk/commit/28226c21fb726217be012fb49a35e263d3bf850b))
- minor `@sitecore-content-sdk/angular` dependency update:
  - Inital Angular support for Content SDK and Sitecore AI
  - Basic rendering and skate-park sample app
  - Internalization
  - Multisite
  - Personalization and analytics page view events support
  - Stale-while-revalidate data caching (find more in documentation)
  - Editing and Preview
  - Sitemap and robots.txt enpoints support
  - Component-level Angular guards ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))

## 2.2.0

### Minor Changes

- Add tag-based revalidation support for the Next.js App Router with Cache Components, including cache tag helpers and revalidation route handlers. ([856cb89](https://github.com/sitecore/content-sdk/commit/856cb89263cff3f1e39e74ebd0ae054e4bd68391))

  Introduce the `nextjs-app-router-cache-components` scaffolding template with a combined revalidation route wired out of the box.

- [cli][create-content-sdk-app] Update build and component map generation to recreate the .sitecore directory when it is missing. ([0325d61](https://github.com/sitecore/content-sdk/commit/0325d614f670aabc44a25c7deff996ace6a1fe8c))

### Patch Changes

- Remove unused config section from nextjs template package.json to eliminate npm warnings about unknown CLI config settings. ([f81ac30](https://github.com/sitecore/content-sdk/commit/f81ac302196d17f88b825b61a78d1f683cc0cb7b))
- [create-content-sdk-app] Add help flag output ([386c7f8](https://github.com/sitecore/content-sdk/commit/386c7f8bd3745fb4187e490efe4dd14be4a48189))
- Return empty app-router static params when `generateStaticPaths` is false (standard app-router template). Only prepend the configured default site to `sites.json` when `defaultSite` is explicitly set. Cache-components OSR template uses a build-validation site placeholder (`_DEFAULT_`) in `generateStaticParams` when path generation is off so `next build` succeeds without Edge or CMS content. ([2bff473](https://github.com/sitecore/content-sdk/commit/2bff473046a060366910aa0397f8f2e70caf088d))
- [create-content-sdk-app] Fix custom 404 handling in cache-components template ([7d29ee8](https://github.com/sitecore/content-sdk/commit/7d29ee8df75a9fcce488bbf9baac1d82ba219e99))
- Remove dev-mode `tsconfig` path mapping for `react` in the Pages Router template so monorepo `yarn watch` samples resolve `@types/react` and `npm run build` no longer fails with missing React declaration files. ([0c9c855](https://github.com/sitecore/content-sdk/commit/0c9c85549b17bf9449ad041cf3a48f33666a0472))
- Scope Tailwind v4 source scanning to app `src` in App Router templates so monorepo `yarn watch` samples do not hang or fail on `globals.css` when symlinked SDK packages are scanned. ([f28b4a1](https://github.com/sitecore/content-sdk/commit/f28b4a16c174b08cc6903fe1f81d5bfea7fc028e))
- [create-content-sdk-app] Add PartialDesignDynamicPlaceholder to App Router and Pages Router templates for Sitecore AI partial designs ([85b14a9](https://github.com/sitecore/content-sdk/commit/85b14a924e1541b929221c290dd9186542d52050))
- [create-content-sdk][Chore] The template version management has been adjusted for multi-version use ([3f9282b](https://github.com/sitecore/content-sdk/commit/3f9282b10be88272be44a3998ccbb34d4428d66a))
- [create-content-sdk-app] Remove redundant --template from help options ([3631584](https://github.com/sitecore/content-sdk/commit/363158477ed913ddfbe904264deebf83015ebcdb))
- Upgrade glob dependency from deprecated v11 to v13 to resolve security vulnerabilities (CVE-2025-64756) ([debe2bd](https://github.com/sitecore/content-sdk/commit/debe2bd42d32c053245463d40ceb5cb4e1f31690))
- minor `@sitecore-content-sdk/cli` dependency update:
  - [cli][create-content-sdk-app] Update build and component map generation to recreate the .sitecore directory when it is missing. ([0325d61](https://github.com/sitecore/content-sdk/commit/0325d614f670aabc44a25c7deff996ace6a1fe8c))
- minor `@sitecore-content-sdk/content` dependency update:
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
- minor `@sitecore-content-sdk/nextjs` dependency update:

  - [nextjs] Add context to nextjs proxies that the developers can use to get information an what was executed inside each proxy ([97ebaca](https://github.com/sitecore/content-sdk/commit/97ebacafeda3114eace6f291c3fbb622e2944a72))
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
  - [nextjs] Fix sitemap route validation to return undefined for sitemap-index path. ([ecba275](https://github.com/sitecore/content-sdk/commit/ecba2755393ad3977546ad3dd9af18483599661e))
  - [nextjs][react] Add renderChildrenWhenEmpty prop to Link component to render empty anchor with children instead of null when the link field value is empty. ([741a10f](https://github.com/sitecore/content-sdk/commit/741a10fca7aacb6f4518425a45f3773d17a013c1))
  - Add tag-based revalidation support for the Next.js App Router with Cache Components, including cache tag helpers and revalidation route handlers.

  Introduce the `nextjs-app-router-cache-components` scaffolding template with a combined revalidation route wired out of the box. ([856cb89](https://github.com/sitecore/content-sdk/commit/856cb89263cff3f1e39e74ebd0ae054e4bd68391))

- minor `@sitecore-content-sdk/react` dependency update:
  - [nextjs][react] Add renderChildrenWhenEmpty prop to Link component to render empty anchor with children instead of null when the link field value is empty. ([741a10f](https://github.com/sitecore/content-sdk/commit/741a10fca7aacb6f4518425a45f3773d17a013c1))
