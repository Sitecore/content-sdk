# @sitecore-content-sdk/cli

## 2.3.0

### Minor Changes

- minor `@sitecore-content-sdk/content` dependency update:

  - Pass the page language to Sitecore Forms to support new multilingual form versions. ([fa0496c](https://github.com/sitecore/content-sdk/commit/fa0496c6ff6f86b0a1256461d585a8535456bf38))
  - Add metadata and Open Graph tags to the NextJs scaffolding templates ([914f94a](https://github.com/sitecore/content-sdk/commit/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d))
  - [experimental] Add a global env switch for experimental features.

  Experimental feature status now treats the app-level `CSDK_GLOBAL_EXPERIMENTAL_FEATURES_ENABLED` as a global enable switch. When the global switch is off, feature status falls back to individual feature env vars. The shared experimental helpers expose the global env var constant (`CSDK_GLOBAL_EXPERIMENTAL_FEATURES_FLAG`) and helper, and starter env examples document how to enable experimental features during development. ([c9c8d1c](https://github.com/sitecore/content-sdk/commit/c9c8d1c0cd9bd014c418f5695be825137a97e6ba))

  - [experimental] Add experimental features visibility API shared across frameworks. Types/utils live in `@sitecore-content-sdk/content`; each framework package owns its `experimental.json` catalog. Next.js and Angular expose editing-secret protected endpoints, wired in all Next.js templates and the Angular server. ([b4fad5b](https://github.com/sitecore/content-sdk/commit/b4fad5bfdcf00eb3138cebc08959d248545d0a22))
  - Add support of llms txt for all next apps through api routes. ([d2b0a9f](https://github.com/sitecore/content-sdk/commit/d2b0a9ffcd19364330158edd407f2f3e8df68565))

## 2.2.1

### Patch Changes

- Fix build command throwing an error when build commands use fetch calls ([87b8db3](https://github.com/sitecore/content-sdk/commit/87b8db38cdfb3e7cc6391de3955f794aecc8b8e9))

## 2.2.0

### Minor Changes

- [cli][create-content-sdk-app] Update build and component map generation to recreate the .sitecore directory when it is missing. ([0325d61](https://github.com/sitecore/content-sdk/commit/0325d614f670aabc44a25c7deff996ace6a1fe8c))
- minor `@sitecore-content-sdk/content` dependency update:
  - Support Draft Components ([a1d3798](https://github.com/sitecore/content-sdk/commit/a1d379868299122f98c2bf8e4536466d377703b7))
