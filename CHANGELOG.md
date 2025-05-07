# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

Major versions of this project will include breaking changes in core packages and align with Sitecore seasonal releases though not strictly bound to them.

Our versioning strategy is as follows:

- Patch: no breaking changes (e.g. bug fixes, minor improvements)
- Minor: non-breaking feature additions – no breaking changes (e.g. new features, improvements)
- Major: new features + breaking changes (e.g. framework upgrades, major architectural changes, major features)

## Unreleased

### 🎉 New Features & Improvements

* `[core]` Introduce get locales functionality on content client ([#74](https://github.com/Sitecore/content-sdk/pull/74))([#75](https://github.com/Sitecore/content-sdk/pull/75))
* `[cli]` Introduce "project" subcommands ([#73](https://github.com/Sitecore/content-sdk/pull/73))
* `[richtext]` Added new `richtext` package to enable Content SDK to work with TipTap Rich Text editors ([#77](https://github.com/Sitecore/content-sdk/pull/77))

### 🛠 Breaking Changes

* `[core]` SXA Form can't fire CloudSDK events due to initialization error ([#63](https://github.com/Sitecore/content-sdk/pull/63)):
  * Form utilities have been moved from `@sitecore-content-sdk/core/form` to the root of `@sitecore-content-sdk/core`. Update your imports to reflect this change if you are referencing these utilities.
* `[nextjs]` Update React to version 19 and Next JS to version 15 ([#76](https://github.com/Sitecore/content-sdk/pull/76))

### 🐛 Bug Fixes

* `[nextjs]` Fix for case sensitive redirects (make all redirects case-insensitive) ([#70](https://github.com/Sitecore/content-sdk/pull/70))
* `[core]` Fix for lookbehind regex. (not supported on ios 16) ([#67](https://github.com/Sitecore/content-sdk/pull/67))
* `[nextjs]` Render "unoptimized" Next Image in component rendering mode ([#66](https://github.com/Sitecore/content-sdk/pull/66))
* `[react]` Extend `withDatasourceCheck` logic to handle empty datasource in DesignLibrary mode ([#62](https://github.com/Sitecore/content-sdk/pull/62))
* `[cli]` Process env variables in both cli global and local mode by default. ([#61](https://github.com/Sitecore/content-sdk/pull/61))
* `[react]` `[nextjs]` Do not render EditingScripts component in DesignLibrary component. Fix 'dataSourceId' query parameter name in editing render middleware. ([#64](https://github.com/Sitecore/content-sdk/pull/64))

### 🧹 Chores
* `[template/nextjs]` Clean package.json scripts ([#75](https://github.com/Sitecore/content-sdk/pull/75))
