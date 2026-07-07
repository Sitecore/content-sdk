# create-content-sdk-app

## 2.2.0

### Minor Changes

- [feature] Angular support ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
- Angular Pages editing support and Angular guards. ([042f0f0](https://github.com/sitecore/content-sdk/commit/042f0f07645687a3cdaff7cd55b17797747e5352))
  - Conditional rendering for editing markup
  - Preview support
  - Option to apply Angular guards at placeholder level
  - Editing, config middleware endpoints for Pages support
  - Caching disabled when in editing mode
- Add tag-based revalidation support for the Next.js App Router with Cache Components, including cache tag helpers and revalidation route handlers. ([856cb89](https://github.com/sitecore/content-sdk/commit/856cb89263cff3f1e39e74ebd0ae054e4bd68391))

  Introduce the `nextjs-app-router-cache-components` scaffolding template with a combined revalidation route wired out of the box.

### Patch Changes

- [create-content-sdk-app] Add PartialDesignDynamicPlaceholder to App Router and Pages Router templates for Sitecore AI partial designs ([85b14a9](https://github.com/sitecore/content-sdk/commit/85b14a924e1541b929221c290dd9186542d52050))
- [create-content-sdk][Chore] The template version management has been adjusted for multi-version use ([3f9282b](https://github.com/sitecore/content-sdk/commit/3f9282b10be88272be44a3998ccbb34d4428d66a))
- minor `@sitecore-content-sdk/angular` dependency update:
  - [feature] Angular support ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
  - Personalize, multisite and analytics support ([7630555](https://github.com/sitecore/content-sdk/commit/7630555e650297c3e5d511cfc4a94d6add6462b0))
  - Angular Pages editing support and Angular guards.
  - Conditional rendering for editing markup
  - Preview support
  - Option to apply Angular guards at placeholder level
  - Editing, config middleware endpoints for Pages support
  - Caching disabled when in editing mode ([042f0f0](https://github.com/sitecore/content-sdk/commit/042f0f07645687a3cdaff7cd55b17797747e5352))
  - Sitemap and robots.txt enpoints support ([200841a](https://github.com/sitecore/content-sdk/commit/200841a0259c72fee00f61fef7f94179a0bdad7d))
- minor `@sitecore-content-sdk/content` dependency update:
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
  - Refactor config and some component logic to be framework reusable ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
- minor `@sitecore-content-sdk/core` dependency update:
  - Refactor config and some component logic to be framework reusable ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
- minor `@sitecore-content-sdk/nextjs` dependency update:

  - [nextjs] Add context to nextjs proxies that the developers can use to get information an what was executed inside each proxy ([97ebaca](https://github.com/sitecore/content-sdk/commit/97ebacafeda3114eace6f291c3fbb622e2944a72))
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
  - Refactor config and some component logic to be framework reusable ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
  - Add tag-based revalidation support for the Next.js App Router with Cache Components, including cache tag helpers and revalidation route handlers.

  Introduce the `nextjs-app-router-cache-components` scaffolding template with a combined revalidation route wired out of the box. ([856cb89](https://github.com/sitecore/content-sdk/commit/856cb89263cff3f1e39e74ebd0ae054e4bd68391))

- minor `@sitecore-content-sdk/react` dependency update:
  - Refactor config and some component logic to be framework reusable ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
