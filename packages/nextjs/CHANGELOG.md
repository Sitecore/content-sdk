# @sitecore-content-sdk/nextjs

## 3.0.0

### Minor Changes

- [nextjs] Add context to nextjs proxies that the developers can use to get information an what was executed inside each proxy ([97ebaca](https://github.com/sitecore/content-sdk/commit/97ebacafeda3114eace6f291c3fbb622e2944a72))
- Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
- Refactor config and some component logic to be framework reusable ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
- Add tag-based revalidation support for the Next.js App Router with Cache Components, including cache tag helpers and revalidation route handlers. ([856cb89](https://github.com/sitecore/content-sdk/commit/856cb89263cff3f1e39e74ebd0ae054e4bd68391))

  Introduce the `nextjs-app-router-cache-components` scaffolding template with a combined revalidation route wired out of the box.

- minor `@sitecore-content-sdk/content` dependency update:
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
  - Refactor config and some component logic to be framework reusable ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
- minor `@sitecore-content-sdk/core` dependency update:
  - Refactor config and some component logic to be framework reusable ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
- minor `@sitecore-content-sdk/react` dependency update:
  - Refactor config and some component logic to be framework reusable ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))

### Patch Changes

- [nextjs][Fix] Correct redirect-map regex matching and capture replacement for anchored patterns, locale-prefixed paths, and root-path redirects. ([30b0db8](https://github.com/sitecore/content-sdk/commit/30b0db8fe768b83f03fd6b9772b0d3e14711c6b2))
- 500 Internal Server Error occurs in Pages editor when Server error page is opened ([6b5ddb4](https://github.com/sitecore/content-sdk/commit/6b5ddb46afb5e20b513a1bf5d7977b5cb27bfdc2))
- BYOC and FEAAS are broken when client component map generation is disabled ([d9d50e1](https://github.com/sitecore/content-sdk/commit/d9d50e1e9cf196032766ca4287d4c24576cabbd6))
- [Pages Router] Set auth token in proxy and api route for preview protection ([421d910](https://github.com/sitecore/content-sdk/commit/421d9105c87752d5bb0d388661240bd0d97920b1))
- Fallback of clientComponentMap option in defineCliConfig reverted to be true ([553b16a](https://github.com/sitecore/content-sdk/commit/553b16a67e807643f564a3c5208631654e0b2cef))
- Pass sc_previewMode, sc_site when performing authorization in PreviewProxy ([ced58bb](https://github.com/sitecore/content-sdk/commit/ced58bb49648d0be99eb0979ab77edb76e1a6a33))
- Check sc_site search parameter in PreviewProxy as a fallback when cookie is missing ([2204da3](https://github.com/sitecore/content-sdk/commit/2204da329c1296334b71f674795af93d93d50ee9))
