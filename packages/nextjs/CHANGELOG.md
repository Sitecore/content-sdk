# @sitecore-content-sdk/nextjs

## 2.2.1

### Patch Changes

- Skip malformed redirect regex rules instead of failing the entire redirect chain. ([6f494d7](https://github.com/sitecore/content-sdk/commit/6f494d7de2451d44441c200576d22126cf4eecc0))
- [Non breaking] Refactor config and some component logic to be framework reusable ([a453633](https://github.com/sitecore/content-sdk/commit/a45363382ef21e6ca947808e5b980aa4f1721e36))
- Fix build failure when `disableCodeGeneration: true` by writing empty import maps during codegen and defaulting `loadImportMap` to `noopLoadImportMap` when the prop is omitted. ([13f41bd](https://github.com/sitecore/content-sdk/commit/13f41bd2e6c114594096dffe00abf9fcf456f19f))
- Export `FieldMetadata` so apps can access component field metadata from the Next.js SDK package. ([081959d](https://github.com/sitecore/content-sdk/commit/081959dae5f50b36abd9af8b5e9d111d2d12fc2d))

## 2.2.0

### Minor Changes

- [nextjs] Add context to nextjs proxies that the developers can use to get information an what was executed inside each proxy ([97ebaca](https://github.com/sitecore/content-sdk/commit/97ebacafeda3114eace6f291c3fbb622e2944a72))
- Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
- [nextjs] Fix sitemap route validation to return undefined for sitemap-index path. ([ecba275](https://github.com/sitecore/content-sdk/commit/ecba2755393ad3977546ad3dd9af18483599661e))
- [nextjs][react] Add renderChildrenWhenEmpty prop to Link component to render empty anchor with children instead of null when the link field value is empty. ([741a10f](https://github.com/sitecore/content-sdk/commit/741a10fca7aacb6f4518425a45f3773d17a013c1))
- Add tag-based revalidation support for the Next.js App Router with Cache Components, including cache tag helpers and revalidation route handlers. ([856cb89](https://github.com/sitecore/content-sdk/commit/856cb89263cff3f1e39e74ebd0ae054e4bd68391))

  Introduce the `nextjs-app-router-cache-components` scaffolding template with a combined revalidation route wired out of the box.

- minor `@sitecore-content-sdk/content` dependency update:
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
- minor `@sitecore-content-sdk/react` dependency update:
  - [nextjs][react] Add renderChildrenWhenEmpty prop to Link component to render empty anchor with children instead of null when the link field value is empty. ([741a10f](https://github.com/sitecore/content-sdk/commit/741a10fca7aacb6f4518425a45f3773d17a013c1))

### Patch Changes

- [nextjs][Fix] Correct redirect-map regex matching and capture replacement for anchored patterns, locale-prefixed paths, and root-path redirects. ([30b0db8](https://github.com/sitecore/content-sdk/commit/30b0db8fe768b83f03fd6b9772b0d3e14711c6b2))
- Stop the proxy chain once an upstream handler returns a redirect so custom plugins chained after RedirectsProxy cannot override Sitecore redirect responses. Short-circuit on 403, `res.redirected`, or 3xx status codes to support Next.js 16 redirect responses. ([bcebed4](https://github.com/sitecore/content-sdk/commit/bcebed4474f8688a76cf336fc140f0418499ac2f))
- 500 Internal Server Error occurs in Pages editor when Server error page is opened ([6b5ddb4](https://github.com/sitecore/content-sdk/commit/6b5ddb46afb5e20b513a1bf5d7977b5cb27bfdc2))
- BYOC and FEAAS are broken when client component map generation is disabled ([d9d50e1](https://github.com/sitecore/content-sdk/commit/d9d50e1e9cf196032766ca4287d4c24576cabbd6))
- Remove unused sync-disk-cache dependency which was unmaintained and had security warnings. The package was declared but never actually imported or used in the codebase. ([585d583](https://github.com/sitecore/content-sdk/commit/585d583b22461a5fc38589fdf351e01bd3e65204))
- [Pages Router] Set auth token in proxy and api route for preview protection ([421d910](https://github.com/sitecore/content-sdk/commit/421d9105c87752d5bb0d388661240bd0d97920b1))
- Fix personalization resolution in Edit Mode and Preview Mode by sending the `sc_variant` header to the Preview GraphQL API so API resolves the active variant server-side, instead of relying on sdk `experiences` filtering. ([858afaf](https://github.com/sitecore/content-sdk/commit/858afaf01a974e0a9c38f2e5c3bd6506458f062b))
- Fallback of clientComponentMap option in defineCliConfig reverted to be true ([553b16a](https://github.com/sitecore/content-sdk/commit/553b16a67e807643f564a3c5208631654e0b2cef))
- Pass sc_previewMode, sc_site when performing authorization in PreviewProxy ([ced58bb](https://github.com/sitecore/content-sdk/commit/ced58bb49648d0be99eb0979ab77edb76e1a6a33))
- Support time-based preview via sc_previewTime query parameter. The editing render endpoint now accepts an optional sc_previewTime query parameter and forwards it as a header to Edge Preview GraphQL, enabling calendar-based content validation at specific future dates. ([7b3b3f3](https://github.com/sitecore/content-sdk/commit/7b3b3f30369cf56f5de19926b02ee549d98a34dc))
- Upgrade glob dependency from deprecated v11 to v13 to resolve security vulnerabilities (CVE-2025-64756) ([debe2bd](https://github.com/sitecore/content-sdk/commit/debe2bd42d32c053245463d40ceb5cb4e1f31690))
- Check sc_site search parameter in PreviewProxy as a fallback when cookie is missing ([2204da3](https://github.com/sitecore/content-sdk/commit/2204da329c1296334b71f674795af93d93d50ee9))
