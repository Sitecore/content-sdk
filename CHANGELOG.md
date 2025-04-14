# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

Major versions of this project may include breaking changes in core packages but also denote compatibility with Sitecore Platform versions.

Our versioning strategy is as follows:

<!--
@TODO: adjust for new versioning
-->

- Patch: no breaking changes (e.g. bug fixes, minor improvements)
- Minor: may include breaking changes in framework packages (e.g. framework upgrades, new features, improvements)
- Major: may include breaking changes in core packages (e.g. major architectural changes, major features)

## Unreleased

### 🛠 Breaking Changes

* `[core]` SXA Form can't fire CloudSDK events due to initialization error ([#63](https://github.com/Sitecore/content-sdk/pull/63)):
  * Form utilities have been moved from `@sitecore-content-sdk/core/form` to the root of `@sitecore-content-sdk/core`. Update your imports to reflect this change if you are referencing these utilities.

### 🐛 Bug Fixes

* `[core]` Fix for lookbehind regex. (not supported on ios 16) ([#67](https://github.com/Sitecore/content-sdk/pull/67))
* `[nextjs]` Render "unoptimized" Next Image in component rendering mode ([#66](https://github.com/Sitecore/content-sdk/pull/66))
* `[react]` Extend `withDatasourceCheck` logic to handle empty datasource in DesignLibrary mode ([#62](https://github.com/Sitecore/content-sdk/pull/62))
* `[cli]` Process env variables in both cli global and local mode by default. ([#61](https://github.com/Sitecore/content-sdk/pull/61))
* `[react]` `[nextjs]` Do not render EditingScripts component in DesignLibrary component. Fix 'dataSourceId' query parameter name in editing render middleware. ([#64](https://github.com/Sitecore/content-sdk/pull/64))
