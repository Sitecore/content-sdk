# @sitecore-content-sdk/content

## 2.3.0

### Minor Changes

- Pass the page language to Sitecore Forms to support new multilingual form versions. ([fa0496c](https://github.com/sitecore/content-sdk/commit/fa0496c6ff6f86b0a1256461d585a8535456bf38))
- Add metadata and Open Graph tags to the NextJs scaffolding templates ([914f94a](https://github.com/sitecore/content-sdk/commit/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d))
- [experimental] Add a global env switch for experimental features. ([c9c8d1c](https://github.com/sitecore/content-sdk/commit/c9c8d1c0cd9bd014c418f5695be825137a97e6ba))

  Experimental feature status now treats the app-level `CSDK_GLOBAL_EXPERIMENTAL_FEATURES_ENABLED` as a global enable switch. When the global switch is off, feature status falls back to individual feature env vars. The shared experimental helpers expose the global env var constant (`CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG`) and helper, and starter env examples document how to enable experimental features during development.

- [experimental] Add experimental features visibility API shared across frameworks. Types/utils live in `@sitecore-content-sdk/content`; each framework package owns its `experimental.json` catalog. Next.js and Angular expose editing-secret protected endpoints, wired in all Next.js templates and the Angular server. ([b4fad5b](https://github.com/sitecore/content-sdk/commit/b4fad5bfdcf00eb3138cebc08959d248545d0a22))
- Add support of llms txt for all next apps through api routes. ([d2b0a9f](https://github.com/sitecore/content-sdk/commit/d2b0a9ffcd19364330158edd407f2f3e8df68565))

### Patch Changes

- [Design Library] Compatibility refactor for Angular ([b43b89c](https://github.com/sitecore/content-sdk/commit/b43b89c4517d088086fb9ff5cb80c35197e4d46f))
- Resolve FEaaS/BYOC stylesheet links against the configured Edge URL (framework-wide). App Router only: drop `precedence="high"` so styles apply instead of preload. ([16e405f](https://github.com/sitecore/content-sdk/commit/16e405f3667f5f05e5fd97b8174bd2b99de45db6))
- Ensure more strict variant filtering in getComponentList calls ([1f90cbe](https://github.com/sitecore/content-sdk/commit/1f90cbe6031b31512cfc4f80ee1b4f04284b0ee3))
- Code extraction support for Angular CSDK ([23c9158](https://github.com/sitecore/content-sdk/commit/23c9158a9fae985d2aaa32ec807904acdf22d6e7))
- Revert to using the unmodified file name as componentName in getComponentList ([8eb01ef](https://github.com/sitecore/content-sdk/commit/8eb01ef1062b410d0a689de49635870a3d3afbde))
- Ensure import map processes node modules with `exports` defined ([99809ba](https://github.com/sitecore/content-sdk/commit/99809bafe75cd59525023226061287a2ced48886))

## 2.2.2

### Patch Changes

- [SXA Redirects] Refactor redirects logic to be reusable across frameworks ([6f8e423](https://github.com/sitecore/content-sdk/commit/6f8e423028bdf8a74a2fc4b8cb084961d755b73f))
- Redirect Proxy not matching encoded URLs with unicode characters in Redirect Map ([6563736](https://github.com/sitecore/content-sdk/commit/6563736fb3fdcd5885f88fcfe20c15d0800efbd7))

## 2.2.1

### Patch Changes

- [Non breaking] Refactor config and some component logic to be framework reusable ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))
- Fix build failure when `disableCodeGeneration: true` by writing empty import maps during codegen and defaulting `loadImportMap` to `noopLoadImportMap` when the prop is omitted. ([13f41bd](https://github.com/sitecore/content-sdk/commit/13f41bd2e6c114594096dffe00abf9fcf456f19f))
- [Chore] Change the exports order of `types` in package.json to prevent Angular compiler warnings ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))

## 2.2.0

### Minor Changes

- Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))

### Patch Changes

- Personalize hide component does not work properly in edit in case of nested personalization ([77825b9](https://github.com/sitecore/content-sdk/commit/77825b9deac7ebde4022f21ad02170354dd2da15))
- Return empty app-router static params when `generateStaticPaths` is false (standard app-router template). Only prepend the configured default site to `sites.json` when `defaultSite` is explicitly set. Cache-components OSR template uses a build-validation site placeholder (`_DEFAULT_`) in `generateStaticParams` when path generation is off so `next build` succeeds without Edge or CMS content. ([2bff473](https://github.com/sitecore/content-sdk/commit/2bff473046a060366910aa0397f8f2e70caf088d))
- Fix imageParams breaking preview context images. Preview authentication parameters (ttc, tt, hash) were being stripped when imageParams were applied, causing images to fail loading. These parameters are now preserved in the required params list. ([3dc5fa6](https://github.com/sitecore/content-sdk/commit/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4))
- [content] Fix fallback URL in Sitemapindex ([9d576f7](https://github.com/sitecore/content-sdk/commit/9d576f78e5d0026edc36b285187360ab244a5a41))
- [core][content] Replace `url-parse` with the WHATWG `URL` API in the GraphQL client and media URL helpers to avoid Node `DEP0169` / legacy URL parsing warnings. ([c50ffd7](https://github.com/sitecore/content-sdk/commit/c50ffd7c4f7e7995d1145f8a5659acb6ed683eab))
- [content] Fix build crash and normalize DetailedRenderingParams object values for `Styles`, `CSSStyles`, `LibraryId`, and `GridParameters` rendering params ([562866b](https://github.com/sitecore/content-sdk/commit/562866b0bbceb24a31bcd9726c6f74285b50c01d))
- Fix personalization resolution in Edit Mode and Preview Mode by sending the `sc_variant` header to the Preview GraphQL API so API resolves the active variant server-side, instead of relying on sdk `experiences` filtering. ([858afaf](https://github.com/sitecore/content-sdk/commit/858afaf01a974e0a9c38f2e5c3bd6506458f062b))
- Support time-based preview via sc_previewTime query parameter. The editing render endpoint now accepts an optional sc_previewTime query parameter and forwards it as a header to Edge Preview GraphQL, enabling calendar-based content validation at specific future dates. ([7b3b3f3](https://github.com/sitecore/content-sdk/commit/7b3b3f30369cf56f5de19926b02ee549d98a34dc))
- Upgrade glob dependency from deprecated v11 to v13 to resolve security vulnerabilities (CVE-2025-64756) ([debe2bd](https://github.com/sitecore/content-sdk/commit/debe2bd42d32c053245463d40ceb5cb4e1f31690))
