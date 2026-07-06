# @sitecore-content-sdk/content

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
