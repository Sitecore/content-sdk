# @sitecore-content-sdk/angular

## 1.0.0

### Minor Changes

- [feature] Angular support ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
- Personalize, multisite and analytics support ([7630555](https://github.com/sitecore/content-sdk/commit/7630555e650297c3e5d511cfc4a94d6add6462b0))
- Angular Pages editing support and Angular guards. ([042f0f0](https://github.com/sitecore/content-sdk/commit/042f0f07645687a3cdaff7cd55b17797747e5352))
  - Conditional rendering for editing markup
  - Preview support
  - Option to apply Angular guards at placeholder level
  - Editing, config middleware endpoints for Pages support
  - Caching disabled when in editing mode
- Sitemap and robots.txt enpoints support ([200841a](https://github.com/sitecore/content-sdk/commit/200841a0259c72fee00f61fef7f94179a0bdad7d))
- minor `@sitecore-content-sdk/content` dependency update:
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
  - Refactor config and some component logic to be framework reusable ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))
- minor `@sitecore-content-sdk/core` dependency update:
  - Refactor config and some component logic to be framework reusable ([0ffd4a7](https://github.com/sitecore/content-sdk/commit/0ffd4a7c097b40701ae1608ec7fee7decab49a91))

### Patch Changes

- siteName is not resolved in preview mode ([0e7dce6](https://github.com/sitecore/content-sdk/commit/0e7dce683a0be4b8942bf4dc050856cd3c28ba07))
- Fix preview detection, now rely on headers instead of cookies ([c6c8dd6](https://github.com/sitecore/content-sdk/commit/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641))
