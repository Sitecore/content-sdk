# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

Major versions of this project will include breaking changes in core packages and align with Sitecore seasonal releases though not strictly bound to them.

Our versioning strategy is as follows:

- Patch: no breaking changes (e.g. bug fixes, minor improvements)
- Minor: non-breaking feature additions – no breaking changes (e.g. new features, improvements)
- Major: new features + breaking changes (e.g. framework upgrades, major architectural changes, major features)

## Unreleased

### 🎉 New Features & Improvements

* `[Content - Name TBD] Support`:
  - Introduced get taxonomy/taxonomies functionality on content client ([#99](https://github.com/Sitecore/content-sdk/pull/99)):
    - Introduced `getTaxonomy` and `getTaxonomies` methods on Content Client class
    - Support pagination for the above methods by implementing an internal `fetchNext` method to handle this in each method
  - Introduced `getLocale/getLocales` functionality on content client: 
    - Initial implementation of `getLocale/getLocales` ([#74](https://github.com/Sitecore/content-sdk/pull/74)) ([#78](https://github.com/Sitecore/content-sdk/pull/78)) ([#105](https://github.com/Sitecore/content-sdk/pull/105))
* `[cli]` Introduce Sitecore Content Services Auth CLI commands ([106](https://github.com/Sitecore/content-sdk/pull/106)):
    - auth login: Authenticate using client credentials and store token info.
    - auth status: Show active tenant and auto-renew token if expired.
    - auth logout: Clear active tenant and delete stored credentials.
    - auth list: List all known tenants from local storage.
  - Token validation and renewal support.
  - Token and tenant metadata storage and active tenant tracking under `~/.sitecore/sitecore-tools/`.
* `[next.js]` Rework and simplify .env ([#89](https://github.com/Sitecore/content-sdk/pull/89)):
  - Introduced `.env.container.example`
    - Intended for local development against a Sitecore container instance.
  - Introduced `.env.remote.example`
    - Intended for working with a remote Sitecore instance.
  - Removed `GRAPH_QL_ENDPOINT` environment variable
    No longer required or used.
  - Removed `GRAPH_QL_SERVICE_RETRIES` environment variable
    This is not environment-specific and should be defined in the configuration instead.
  - Removed `DISABLE_SSG_FETCH` environment variable
    - In XM Cloud, this is set to `true` by default as the application runs as an editing host.  
    - It can still be configured via the `DISABLE_SSG_FETCH` environment variable or the `disableStaticPaths` config property if needed.
    - By default, it is set to `false` in the configuration.
* `[core][nextjs]` Introduced `getRobots` method in `SitecoreClient` and a new `RobotsMiddleware` for Next.js API routes ([#83](https://github.com/Sitecore/content-sdk/pull/83))
  - The `getRobots(siteName, fetchOptions?)` method centralizes logic for fetching `robots.txt` content.
  - A new `RobotsMiddleware` class encapsulates HTTP-level logic for generating `robots.txt` responses in Next.js apps.
  - These additions follow the same extensible architecture as existing features enabling custom behavior via service overrides and improving consistency across endpoints.
* `[sitecore-jss-cli]` Code extraction feature for XMCloud code generation is added ([#71](https://github.com/Sitecore/jss/pull/71)[#113](https://github.com/Sitecore/content-sdk/pull/113))
* `[all]` XM Cloud Content support
  * `[core]` Introduced /content submodule to interact with XM Cloud Content ([#65](https://github.com/Sitecore/content-sdk/pull/65)[#104](https://github.com/Sitecore/content-sdk/pull/104))
  * `[richtext]` Added new `richtext` package to enable Content SDK to work with TipTap Rich Text editors ([#85](https://github.com/Sitecore/content-sdk/pull/85))
* `[cli]` Introduce "project" subcommands ([#73](https://github.com/Sitecore/content-sdk/pull/73))
* `[nextjs]` Enhance customizability for Sitecore Client and SDK Middlwares ([#87](https://github.com/Sitecore/content-sdk/pull/87))
* `[core]` `[next]` `[create-sitecore-jss]` Passing configuration object to `defineConfig` in _sitecore.config_ is now optional. Introduced _sitecore.config.ts.example_ ([#90](https://github.com/Sitecore/content-sdk/pull/90)) ([#93](https://github.com/Sitecore/content-sdk/pull/93))


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
* Upgrade 3rd party dependencies ([#88](https://github.com/Sitecore/content-sdk/pull/88)) ([#92](https://github.com/Sitecore/content-sdk/pull/92))
