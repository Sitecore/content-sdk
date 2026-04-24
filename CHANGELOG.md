# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

Major versions of this project will include breaking changes in core packages and align with Sitecore seasonal releases though not strictly bound to them.

Our versioning strategy is as follows:

- Patch: no breaking changes (e.g. bug fixes, minor improvements)
- Minor: non-breaking feature additions – no breaking changes (e.g. new features, improvements)
- Major: new features + breaking changes (e.g. framework upgrades, major architectural changes, major features)

## unreleased

### 🎉 New Features & Improvements

* `[events]` `[nextjs]` Lightweight Tracking ([#414](https://github.com/Sitecore/content-sdk/pull/414))([#435](https://github.com/Sitecore/content-sdk/pull/435))([#438](https://github.com/Sitecore/content-sdk/pull/438))([#443](https://github.com/Sitecore/content-sdk/pull/443))([#444](https://github.com/Sitecore/content-sdk/pull/444))
  - Introduced `BotTrackingProxy` Next.js proxy to capture bot tracking events.
* `[nextjs]` Upgrade to Next.js 16.2 ([#429](https://github.com/Sitecore/content-sdk/pull/429))
* `[create-content-sdk-app]` Use native flat ESLint config for App Router templates ([#431](https://github.com/Sitecore/content-sdk/pull/431))
* `[nextjs]` Support for redirect items redirects in redirect proxy ([#433](https://github.com/Sitecore/content-sdk/pull/433)) ([#439](https://github.com/Sitecore/content-sdk/pull/439))

### 🐛 Bug Fixes

* `[nextjs]` Preview allows users to access pages without proper permissions ([#448](https://github.com/Sitecore/content-sdk/pull/448))
  - App Router: Extract `authorization` header from request headers and propagate it to page data fetching requests. Requires users to share headers via `client.getPreviewFetchOptions` method. See more details in 'What's New' section of the release notes.
  - Pages Router: Set `authorization` header in preview data and propagate it to page data fetching requests.
* Preview mode shows unpublishable content ([#410](https://github.com/Sitecore/content-sdk/pull/410))([416](https://github.com/Sitecore/content-sdk/pull/416))
* `[core] [content]` Fix GraphQL client factory ignoring custom `fetch` and related options ([#418](https://github.com/Sitecore/content-sdk/pull/418))
* `[nextjs]` AppRouter - NextLink is throwing Locale error in dev mode ([#427](https://github.com/Sitecore/content-sdk/pull/427))
* `[react]` Form component loses interactivity and state between rerenders ([#447](https://github.com/Sitecore/content-sdk/pull/447))

### ✨ Chores

* `[create-content-sdk-app]` Update outdated documentation links ([#440](https://github.com/Sitecore/content-sdk/pull/440))

## 2.0.2

### 🎉 New Features & Improvements

* `[content]` Add Unified UI origin to allowed origins ([#424](https://github.com/Sitecore/content-sdk/pull/424))

## 2.0.1

### ✨ Bug fixes

- Fix wrong versions and samples appearing when running `create-content-sdk-app` command.
  - `angular` sample no longer appears
  - `nextjs` samples use correct content-sdk dependencies for analytics when scaffolded

## 2.0.0

### 🎉 New Features & Improvements

* Add Skills.md with capability groupings for AI tools and developers ([#382](https://github.com/Sitecore/content-sdk/pull/382))
  - Add `.agents/skills/` with Agent Skills (SKILL.md) per capability for universal AI tooling ([agentskills.io](https://agentskills.io)); each skill includes when-to-use, hard rules, and stop conditions
  - `[create-content-sdk-app]` Add Skills.md and `.agents/skills/` to Next.js (Pages Router) and Next.js App Router templates so scaffolded apps include capability groupings and template-specific Agent Skills

* Rework AI coding assistance guides around AGENTS.md ([#368](https://github.com/Sitecore/content-sdk/pull/368))([#390](https://github.com/Sitecore/content-sdk/pull/390))

* `[nextjs]` `[create-content-sdk-app]` Enable Next.js 16 Cache Components and Turbopack File System Caching ([#334](https://github.com/Sitecore/content-sdk/pull/334))

* Search integration ([#295](https://github.com/Sitecore/content-sdk/pull/295))
  * `[search]` New `@sitecore-content-sdk/search` package providing search functionality
    - `SearchService` class for performing search queries with support for pagination, sorting, request cancellation.
    - Type-safe search parameters and responses with support for generic fields.
  * `[react]` Added React hooks for search functionality
    - `useSearch` hook for paginated search queries with automatic state management, request cancellation, request status tracking.
    - `useInfiniteSearch` hook for infinite scroll/search patterns with `loadMore` functionality, request cancellation, request status tracking.

* `[nextjs]` `[Pages Router]` Adjust static path generation when multisite is disabled ([#345](https://github.com/Sitecore/content-sdk/pull/345))

* `[nextjs]` Allow to pass custom query parameters to /api/editing/render handlers ([#381](https://github.com/Sitecore/content-sdk/pull/381))

* `[nextjs]` `[Pages Router]` Add explicit `Content-Type: text/html; charset=utf-8` to the editing render route response for proper response handling ([#386](https://github.com/Sitecore/content-sdk/pull/386))

* `[analytics-core]` `[events]` `[personalize]` `[core]` `[create-content-sdk-app]` `[nextjs]` `[react]` Introduce Analytics packages ([#340](https://github.com/Sitecore/content-sdk/pull/340))([#341](https://github.com/Sitecore/content-sdk/pull/341))([#357](https://github.com/Sitecore/content-sdk/pull/357))([#363](https://github.com/Sitecore/content-sdk/pull/363))
  * Migrated the `core`,`events` and `personalize` packages from `CloudSDK` to `analytics-core`,`events` and `personalize` packages in `ContentSDK` 
  * Reworked the initialization functionality introducing the new `initContentSdk` function

### 🛠 Breaking Changes

* `[core]` `[content]` `[nextjs]` Support custom Edge hostnames via `SITECORE_EDGE_PLATFORM_HOSTNAME` (Next.js: `NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME`) ([#359](https://github.com/Sitecore/content-sdk/pull/359))
  - New `rewriteMediaUrls` option: when `true`, rewrites layout media URLs to the custom Edge hostname; when a function, applies a custom string transformer.
  - The old `SITECORE_EDGE_URL` environment variable is no longer used

* Decouple `@sitecore-content-sdk/content` from `@sitecore-content-sdk/core` ([#351](https://github.com/Sitecore/content-sdk/pull/351)([#383](https://github.com/Sitecore/content-sdk/pull/383))):
  - See a detailed upgrade guide for migration instructions

* `[nextjs]` `[create-content-sdk-app]` Upgrade to Next.js 16 ([#334](https://github.com/Sitecore/content-sdk/pull/334))([#343](https://github.com/Sitecore/content-sdk/pull/343))([#353](https://github.com/Sitecore/content-sdk/pull/353))
  - Next.js 16 is now required (minimum version `^16.0.0`)
  - `middleware.ts` renamed to `proxy.ts` with updated function signature
  - Removed deprecated `images.domains` usage (use `remotePatterns` instead)

* `[nextjs]` Expand SXA redirects logic with support for isLanguagePreserved flag. This provides an option to preserve current locale when target redirect URL does not have a locale prefix ([#305](https://github.com/Sitecore/content-sdk/pull/305))
  - This changes the default redirects behavior out of the box.
    - Previously, `/da/source -> /target` rule would redirect to `/da/target` path when default locale is not `da`
    - Now, `/da/source -> /target` rule would redirect to `/target` path, using default locale, unless the `Shall language be preserved upon redirect?` checkbox is enabled in Redirect Map.
* Upgrade to Node.js 24.x ([#332](https://github.com/Sitecore/content-sdk/pull/332))
* Remove deprecated api's ([#360](https://github.com/Sitecore/content-sdk/pull/360]))
  - `sitecore.cli.config`: 
    - The `config` property is now required; a reference to `sitecore.config` must be provided.
    - Build-time functions defined in the build array no longer accept the scConfig argument in their constructor. However, the function implementation must receive scConfig, which is passed internally by the CLI command.
  - `renderEmptyPlaceholder` method of `PlaceholderComponent` has been removed; instead import `renderEmptyPlaceholder` from `react`/`next` package
  - `DesignLibrary` component now does not accept any props
  - `SitecoreProvider`'s `loadImportMap` is now required
* [react] [nextjs] Major revamp of components in the react package ([#371](https://github.com/Sitecore/content-sdk/pull/371)):
  - `Placeholder` and `AppPlaceholder`, `passThroughComponentProps` prop has been added to fill make passing props to child components easier
  - `componentMap` and `loadImportMap` have been added to the context shared via `SitecoreProvider`
  - `useLoadImportMap`, `useComponentMap` HOCs have been removed. The Sitecore context data can be accessed via `useSitecore` hook.
  - `withSitecore`'s `updatePage` prop has been renamed to `setPage`. This HOC has also been marked deprecated, and will eventually be removed in favor of `useSitecore` hook.
  - Old `withPlaceholder` HOC implementation has been reworked into slot-like logic with server and client implementations. `withAppPlaceholder` can be used in server RSC context, and `withPlaceholder` in client one.
  - Other components and HOCs in `react` package were refactored and should not have an effect on end user apps.
* `[react]` Placeholder suspense causes longer JavaScript Scripting execution time ([#384](https://github.com/Sitecore/content-sdk/pull/384))
  - The default value of `disableSuspense` property is set to `true` to avoid forcing Suspense usage across all components which could negatively impact performance metrics. Suspense can now be enabled explicitly when needed.
    
### 🐛 Bug Fixes

* `[core]` `[search]` `[analytics]` Pass Sitecore Context ID only in headers ([#336](https://github.com/Sitecore/content-sdk/pull/336))
* `[core]` `[DesignLibrary]` Fix faux-extentions being stripped from 3rd party modules' names in import-map ([#358](https://github.com/Sitecore/content-sdk/pull/358))
* `[react]` `[nextjs]` `[template/nextjs-app-router]` Fix not-found page forcing `[[...path]]` route to dynamic rendering; use cached page params to preserve SSG ([#399](https://github.com/Sitecore/content-sdk/pull/399))([#402](https://github.com/Sitecore/content-sdk/pull/402))
* `[rect]` `[nextjs]` `[DesignStudio]` Component does not re-render during editing ([#400](https://github.com/Sitecore/content-sdk/pull/400))
* `[nextjs]` `[DesignLibrary]` In variant generation mode prevent additional re-render for Server Components ([#403](https://github.com/Sitecore/content-sdk/pull/403))

### 1.5.1
   
### 🐛 Bug Fixes

* `[content]` `[react]` `[nextjs]` Improve import map generation and refactor Design Library error handling ([#387](https://github.com/Sitecore/content-sdk/pull/387))

### 1.5.0

### 🎉 New Features & Improvements

* `[nextjs]` Enable secured component variant generation for App Router Server Components in Design Studio ([#369](https://github.com/Sitecore/content-sdk/pull/369))([#375](https://github.com/Sitecore/content-sdk/pull/375))

### 1.4.1

### 🐛 Bug Fixes

* `[nextjs]` Fix basePath preservation logic in redirects-proxy in case `basePath` is not configured; Fix nextjs specific header names in redirects-proxy ([#352](https://github.com/Sitecore/content-sdk/pull/352))
* `[nextjs]` Sitecore Content SDK does not support X-Forwarded-Host, causing incorrect hostname resolution behind proxies ([#330](https://github.com/Sitecore/content-sdk/pull/330))

### 1.4.0

### 🎉 New Features & Improvements

* `[nextjs]` `[AI Component Generation]` Enable CLI command to add a new component ([#346](https://github.com/Sitecore/content-sdk/pull/346))

### 🐛 Bug Fixes

* `[nextjs]` `[App Router]` Form component throws a Server component error ([#333](https://github.com/Sitecore/content-sdk/pull/333))
* `[nextjs]` Add "use client" directive to import-map.ts for React hooks compatibility ([#326](https://github.com/Sitecore/content-sdk/pull/326))
* `[nextjs]` `[template/nextjs]` `[template/nextjs-app-router]` Fix middleware initialization errors when API configuration is missing ([#325](https://github.com/Sitecore/content-sdk/pull/325))
* `[nextjs]` Fixes Server Transfer (rewrite) redirects ([#329](https://github.com/Sitecore/content-sdk/pull/329))
* `[nextjs]` Preserve `basePath` when doing redirects in redirects-middleware ([#344](https://github.com/Sitecore/content-sdk/pull/344))
* `[nextjs]` `[react]` Fix fields becoming uneditable in Pages when running Editing Host in dev mode ([#339](https://github.com/Sitecore/content-sdk/pull/339))
* `[nextjs]` `[Pages Router]` Adjust static path generation when multisite is disabled ([#345](https://github.com/Sitecore/content-sdk/pull/345))

## 1.3.2

### ✨ Chores

* Apply caret (`^`) verisoning to content-sdk packages, ensuring the latest patch versions are used by them.

## 1.3.1

### 🧹 Chores

* Upgrade Next.js to the latest patch version ([#322](https://github.com/Sitecore/content-sdk/pull/322))
* `[create-content-sdk-app]` Remove beta from files and paths in nextjs-app-router template ([#321](https://github.com/Sitecore/content-sdk/pull/321))
* `[react]` Disable variant generation mode for server components in Design Studio ([#320](https://github.com/Sitecore/content-sdk/pull/320))

## 1.3.0

### 🎉 New Features & Improvements

* `[nextjs]` [App Router] Add support for server components in Design Studio ([#280](https://github.com/Sitecore/content-sdk/pull/280))([#300](https://github.com/Sitecore/content-sdk/pull/300))([#301](https://github.com/Sitecore/content-sdk/pull/301))([#303](https://github.com/Sitecore/content-sdk/pull/303))
  - additional react components to handle dynamic rendering of server components
  - includes refactoring of existing Design Library functionality
  - this is a breaking change for applications based on Next.js App Router (beta) template. Please refer to the detailed upgrade guide for further instructions
  - separate server and client import-map generation ([#293](https://github.com/Sitecore/content-sdk/pull/293))([#299](https://github.com/Sitecore/content-sdk/pull/299)
* `[core]` Provide information about rendering host as part of code extraction ([#286](https://github.com/Sitecore/content-sdk/pull/286))
* `[template/next-app-router]` Add component runtime information to prevent invalid client/server component operations in Sitecore Pages ([#291](https://github.com/Sitecore/content-sdk/pull/291))
* `[cli]` Create short flags for CLI commands ([#298](https://github.com/Sitecore/content-sdk/pull/298))


### 🐛 Bug Fixes

* Added package.json "exports" field to ensure correct ESM/CJS module resolution for submodule imports. Previously defaulted to CJS bundles even when ESM was available. ([#296](https://github.com/Sitecore/content-sdk/pull/296))
* `[core]` NativeDataFetcher error does not include Error instance properties (name, message, stack) ([#295](https://github.com/Sitecore/content-sdk/pull/295))
* `[template/next-app-router]` Remove component-level data fetching in favor of Server Components ([#282](https://github.com/Sitecore/content-sdk/pull/282))
* `[core]` NativeFetcher response does not match actual returned data ([#284](https://github.com/Sitecore/content-sdk/pull/284))
* `[nextjs]` Add regex variable substitution for absolute and external URL redirects. ([#287](https://github.com/Sitecore/jss/pull/287))
* `[nextjs]` `[template/next-app-router]` `[template/nextjs]` Geo based Personalization not possible in Content SDK Personalize Middleware. ([#288](https://github.com/Sitecore/jss/pull/288))
* `[nextjs]` `[template/next-app-router]` `[template/nextjs]` Geo based Personalization not possible in Content SDK Personalize Middleware. ([#290](https://github.com/Sitecore/jss/pull/290))
* `[nextjs]` Remove locale property assignments in redirects middleware for App Router compatibility. ([#292](https://github.com/Sitecore/jss/pull/292))
* `[nextjs]` Next Link props unavailable when using Sitecore Link component ([#294](https://github.com/Sitecore/content-sdk/pull/294)) ([#296](https://github.com/Sitecore/content-sdk/pull/296))
* `[nextjs]` `[template/next-app-router]` `[template/nextjs]` Fix middleware initialization errors in local container development ([#297](https://github.com/Sitecore/content-sdk/pull/297))([#302](https://github.com/Sitecore/content-sdk/pull/302))

### 🧹 Chores

* API Surface verification and reporting ([#283](https://github.com/Sitecore/content-sdk/pull/283))
* `[core]` `[react]` Remove "strictNullChecks: false" tsconfig property ([#304](https://github.com/Sitecore/content-sdk/pull/304))

## 1.2.1

### 🐛 Bug Fixes

* `[nextjs]` Application build fails due to missing component variants ([#277](https://github.com/Sitecore/content-sdk/pull/277))

## 1.2.0

### 🎉 New Features & Improvements

* Next.js App Router support (beta):
  - Base template ([#191](https://github.com/Sitecore/content-sdk/pull/191))
  - Robots.txt and Sitemap.xml support ([#197](https://github.com/Sitecore/content-sdk/pull/197))
  - Editing and preview support ([#198](https://github.com/Sitecore/content-sdk/pull/198))
  - Internationalization support ([#202](https://github.com/Sitecore/content-sdk/pull/202)) ([#214](https://github.com/Sitecore/content-sdk/pull/214))
  - Client-server component map separation ([#230](https://github.com/Sitecore/content-sdk/pull/230))([#232](https://github.com/Sitecore/content-sdk/pull/232))([#234](https://github.com/Sitecore/content-sdk/pull/234))([#235](https://github.com/Sitecore/content-sdk/pull/235))([#241](https://github.com/Sitecore/content-sdk/pull/241))
  - Server components for FEAAS and BYOC ([#248](https://github.com/Sitecore/content-sdk/pull/248)) ([#262](https://github.com/Sitecore/content-sdk/pull/262))
  - Generic App router compatible placeholder ([#258](https://github.com/Sitecore/content-sdk/pull/258))
* `[core]` Introduce `scConfig` property in `sitecore.cli.config` ([#244](https://github.com/Sitecore/content-sdk/pull/244)):
  * The `scConfig` property is used to pass the Sitecore configuration to the CLI commands.
  * Build commands now receive arguments (e.g. `scConfig`) to allow access to the CLI specific configuration settings. Now it's optional to pass `scConfig` manually to the command constructor.
* `[nextjs]` Slim down sample even more ([#225](https://github.com/Sitecore/content-sdk/pull/225))
* Mark client components with `use client` directive. ([#226](https://github.com/Sitecore/content-sdk/pull/226))
* Add LLMs and Copilot instruction files for improved AI guidance ([#239](https://github.com/Sitecore/content-sdk/pull/239))
* `[core]` `[nextjs]` Enable component variants in component-map & also send variants files in code extraction ([#245](https://github.com/Sitecore/content-sdk/pull/245))([#251](https://github.com/Sitecore/content-sdk/pull/251))
* `[core]` Expose `getData` on `SitecoreClient` to run raw GraphQL queries. ([#249](https://github.com/Sitecore/content-sdk/pull/249))
* Add Claude AI guidance files for improved AI development support ([#254](https://github.com/Sitecore/content-sdk/pull/254))
* Add Windsurf AI rules for improved IDE development support ([#255](https://github.com/Sitecore/content-sdk/pull/255))

### 🐛 Bug Fixes

* `[nextjs]` Error when rendering Preview when Multisite middleware is disabled ([#256](https://github.com/Sitecore/content-sdk/pull/256))
* `[template/nextjs]` `[template/next-app-router]` Fix imports for SSR/SSG ([#229](https://github.com/Sitecore/content-sdk/pull/229))
* `[template/next-app-router]` Unable to render 'preview' without default sitename ([#247](https://github.com/Sitecore/content-sdk/pull/247))
* `[template/next-app-router]` Guard static params generation and harden not-found routes for XM Cloud ([#242](https://github.com/Sitecore/content-sdk/pull/242))
* `[template/next-app-router]` Prevent CloudSDK re-initialization on client-side navigation ([#243](https://github.com/Sitecore/content-sdk/pull/243))

### 🧹 Chores

* `[core]` `[nextjs]` Move Design Library logic from nextjs to core ([#236](https://github.com/Sitecore/content-sdk/pull/236))

## 1.1.0

### 🎉 New Features & Improvements

* `[react]` `[core]` Unite capabilities of library | library-metadata with library-variant-generation modes. `isVariantGeneration` is honored only when `isDesignLibrary`(library | library-metadata) is true and `generation=variant` query string is passed to the editing render endpoint. ([#208](https://github.com/Sitecore/content-sdk/pull/208))
* Add Cursor AI coding agent rules for consistent development patterns across the Content SDK repository ([#207](https://github.com/Sitecore/content-sdk/pull/207))
* `[nextjs]` Support component-level data fetching in 404/500 pages ([#199](https://github.com/Sitecore/content-sdk/pull/199))
* Migration from ESlint 8 -> ESLint 9 and introduction of the new Flat Config file ([#176](https://github.com/Sitecore/content-sdk/pull/176))
* Code generation for Design Library enablers:
  - `[core]` `[nextjs]` Add import-map generation ([#157](https://github.com/Sitecore/content-sdk/pull/157))([#167](https://github.com/Sitecore/content-sdk/pull/167))([#170](https://github.com/Sitecore/content-sdk/pull/170))([#171](https://github.com/Sitecore/content-sdk/pull/171))([#175](https://github.com/Sitecore/content-sdk/pull/175))([#177](https://github.com/Sitecore/content-sdk/pull/177))([#187](https://github.com/Sitecore/content-sdk/pull/187)) ([#221](https://github.com/Sitecore/content-sdk/pull/221))
    - New `writeImportMap()`, `combineImportEntries()` methods and `defaultImportEntries` export available from `@sitecore-content-sdk/nextjs/codegen`
  - Dynamic component rendering ([#163](https://github.com/Sitecore/content-sdk/pull/163))
  - Updated API endpoint to new Edge Platform format ([#162](https://github.com/Sitecore/content-sdk/pull/162))
  - Ensure editing state is enabled in Design Library mode ([#181](https://github.com/Sitecore/content-sdk/pull/181))
* `[core]` Ensure displayName paths are properly UTF-8 encoded. ([#179](https://github.com/Sitecore/content-sdk/pull/179))
* `[react]` Add `component:status` events for VariantGeneration ([#190](https://github.com/Sitecore/content-sdk/pull/190))
- `[react]` Enhanced the Design Library cache buster format to hh-dd-mm-yyyy ([#188](https://github.com/Sitecore/content-sdk/pull/188))
* `[react]` `[core]` Unite capabilities of library | library-metadata with library-variant-generation modes. `isVariantGeneration` is honored only when `isDesignLibrary`(library | library-metadata) is true and `generation=variant` query string is passed to the editing render endpoint. ([#208](https://github.com/Sitecore/content-sdk/pull/208)) ([#215](https://github.com/Sitecore/content-sdk/pull/215))
- `[nextjs]` Optimization for editing render middleware: issue an internal server request for fetching page data during editing instead of doing temporary redirect ([#195](https://github.com/Sitecore/content-sdk/pull/195)) ([#196](https://github.com/Sitecore/content-sdk/pull/196))
  - added new environment variable `SITECORE_INTERNAL_EDITING_HOST_URL` - the internal host URL for the Next.js application, used for server-side requests for page rendering during editing
  - added a new setting in _sitecore.config_: _sitecoreInternalEditingHostUrl_. This setting allows you to define the internal host URL explicitly, overriding the corresponding environment variable.
  - if none of the above is set:
    - in XM Cloud environment server request will be issued to `http://localhost:3000`
    - in Vercel or Netlify scenarios, the host header of the incoming request will be used to make the internal request

### 🐛 Bug Fixes

* `[nextjs]` Preserve default locale in external absolute urls ([#201](https://github.com/Sitecore/content-sdk/pull/201))
* `[react]` Custom properties are not applied to empty field in editing mode ([#200](https://github.com/Sitecore/content-sdk/pull/200))
* `[core]` Content styles fail to load due to incorrect contextId resolution ([#192](https://github.com/Sitecore/content-sdk/pull/192))
* `[core]` Duplicate dictionary requests in editing, preview, and design library modes ([#161](https://github.com/Sitecore/content-sdk/pull/161))
  - `SitecoreClient.getPreview` and `SitecoreClient.getDesignLibraryData` no longer request dictionary data. `Page` type is not affected.
  - Updated `EditingService.fetchEditingData`:
    - Removed `siteName` parameter.
    - No longer requests and returns dictionary data.
- `[cli]` Code extraction extends XM Cloud Rendering Host build by several minutes ([#173](https://github.com/Sitecore/content-sdk/pull/173))
- `[core]` Fix redirect regex processing to prevent over-escaping of question marks in regex patterns ([#174](https://github.com/Sitecore/content-sdk/pull/174))

## 1.0.1

### 🐛 Bug Fixes

- `[core]` `[nextjs]` Restore proper local connection fallback
  - Added fallback to `middleware.ts` file to enable local API connections in the absence of `contextId`. ([#178](https://github.com/Sitecore/content-sdk/pull/178))([#180](https://github.com/Sitecore/content-sdk/pull/180))

## 1.0.0

### 🎉 New Features & Improvements

- Design Library Early Access enablers:
  - `[core]` `[nextjs]` Integrated new _VariantGeneration_ mode ([#158](https://github.com/Sitecore/content-sdk/pull/158))
  - `[nextjs]` Default static import-map ([#153](https://github.com/Sitecore/content-sdk/pull/153))
  - `[cli]` Code Extraction ([#71](https://github.com/Sitecore/content-sdk/pull/71))([#113](https://github.com/Sitecore/content-sdk/pull/113))([#114](https://github.com/Sitecore/content-sdk/pull/114))([#154](https://github.com/Sitecore/content-sdk/pull/154))

### 🛠 Breaking Changes

- Refactored `SitecoreProvider` and enhanced `SitecoreClient` ([#158](https://github.com/Sitecore/content-sdk/pull/158)):

  #### Reworked `SitecoreProvider` and Context

  - Refactored components that use `SitecoreProvider` and related utilities.
  - `SitecoreProvider` now accepts a `page` prop (`Page` type from `SitecoreClient`) instead of `layoutData`.
  - Context state updates:
    - `pageContext` → renamed to `page`. `page` represents `Page` interface.
    - `setContext` → renamed to `setPage`. The method updates the `page` state.
  - Removed `SitecoreProviderPageContext` interface.
    - Consumers should now access `page` via the `Page` interface.

  #### Updated `withSitecore` and `useSitecore` APIs

  - Updated naming for clarity and consistency:
    - `pageContext` → `page`
    - `updateContext` → `updatePage`

  #### Improvements to `SitecoreClient`

  - **Type cleanup and consistency**:

    - Removed `NextjsPage` interface.
    - All methods that generate page data now return a consistent `Page` object.
    - Properties `componentProps` and `notFound` are now part of the `SitecorePageProps` interface and are treated as optional.
    - `SitecorePageProps` now requires a standalone `page` field instead of merging all data into one props object.

  - **New `getErrorPage()` method**:

    - Replaces `getErrorPages()`, exposing only necessary data.
    - Introduces a new `ErrorPage` enum to select specific error types (e.g., `ErrorPage.NotFound`)

  - **New `PageMode` Type**

    - The `Page` type now includes a `mode` field of type `PageMode`, providing runtime context (e.g. editing, design library, preview).
    - Replaces older properties like `pageState`, `pageEditing`, `componentType`.

    ```ts
    mode: {
      isNormal: boolean;
      isPreview: boolean;
      isEditing: boolean;
      isDesignLibrary: boolean;
    }
    ```

  #### DesignLibrary Component

  - The `DesignLibrary` component no longer accepts a `layoutData` prop.
  - It now accesses `page` directly from `SitecoreProvider`.

- Refactor and simplify service names ([#133](https://github.com/Sitecore/content-sdk/pull/133)):

  You will be affected by the following changes **only** if:

  - You are referencing Content SDK services directly rather than using the `SitecoreClient` methods.

  If you're using the `SitecoreClient` to access services, **no changes** are required.

  Service class and config names have been refactored for clarity and consistency:

  - Renamed:
    - `RestComponentLayoutService` → `ComponentLayoutService`
    - `RestComponentLayoutServiceConfig` → `ComponentLayoutServiceConfig`
    - `GraphQLEditingService` → `EditingService`
    - `GraphQLEditingServiceConfig` → `EditingServiceConfig`
    - `GraphQLDictionaryService` → `DictionaryService`
    - `GraphQLDictionaryServiceConfig` → `DictionaryServiceConfig`
    - `GraphQLLayoutService` → `LayoutService`
    - `GraphQLLayoutServiceConfig` → `LayoutServiceConfig`
    - `GraphQLPersonalizeService` → `PersonalizeService`
    - `GraphQLPersonalizeServiceConfig` → `PersonalizeServiceConfig`
    - `GraphQLErrorPagesService` → `ErrorPagesService`
    - `GraphQLErrorPagesServiceConfig` → `ErrorPagesServiceConfig`
    - `GraphQLRedirectsService` → `RedirectsService`
    - `GraphQLRedirectsServiceConfig` → `RedirectsServiceConfig`
    - `GraphQLRobotsService` → `RobotsService`
    - `GraphQLRobotsServiceConfig` → `RobotsServiceConfig`
    - `GraphQLSiteInfoService` → `SiteInfoService`
    - `GraphQLSiteInfoServiceConfig` → `SiteInfoServiceConfig`
    - `GraphQLSitemapXmlService` → `SitemapXmlService`
    - `GraphQLSitemapXmlServiceConfig` → `SitemapXmlServiceConfig`
    - `GraphQLSitePathService` → `SitePathService`
    - `GraphQLSitePathServiceConfig` → `SitePathServiceConfig`
  - Removed `DictionaryService` interface

- `[core]` `[nextjs]` `[templates/nextjs]` Refactor site resolution logic across packages ([#141](https://github.com/Sitecore/content-sdk/pull/141))([#155](https://github.com/Sitecore/content-sdk/pull/155))
  - Removed `sites` parameter from `SitecoreClientInit` type
  - Removed `SiteResolver` dependency and `resolveSite()` from `SitecoreClient`
  - Removed support for passing a custom siteResolver to `SitecoreClient`
  - Updated `SitecoreClient` to construct the `Page` using `siteName` instead of the full `SiteInfo`.
  - Updated SitecoreClient's `getPagePaths()` to accept a `sites` parameter
  - Modified the `getPagePaths` method in `SitecoreClient` to accept a `sites` parameter.
  - Updated Next.js `SitemapMiddleware` and `RobotsMiddleware` to use their own instance of `SiteResolver` and accept a `sites` parameter via the constructor.

### 🐛 Bug Fixes

- `[nextjs]` Ensure Redirect Middleware handles case-insensitive path matching to prevent missed redirects due to casing differences ([#159](https://github.com/Sitecore/jss/pull/159))
- `[core]` `[nextjs]`Standardized way of handling contextId/clientContextId and related fallbacks ([#150](https://github.com/Sitecore/content-sdk/pull/150))

### 🧹 Chores

- Add Github action workflow to generate package size and test coverage metrics report ([#151](https://github.com/Sitecore/content-sdk/pull/151))

## 0.3.0

### 🎉 New Features & Improvements

- `[create-content-sdk-app]`: Refactoring/Cleanup for scss files in SXA components ([#119](https://github.com/Sitecore/content-sdk/pull/119))([#122](https://github.com/Sitecore/content-sdk/pull/122))
- `[core]` `[nextjs]` [DesignLibrary] Include metadata in the Design Library rendering mechanism ([#118](https://github.com/Sitecore/content-sdk/pull/118))
- `[core]` `[nextjs]` `[cli]` Add automatic component map generation ([#124](https://github.com/Sitecore/content-sdk/pull/124) [#128](https://github.com/Sitecore/content-sdk/pull/128) [#130](https://github.com/Sitecore/content-sdk/pull/130))
- `[create-sitecore-jss]` Remove graphql introspection sample and scripts folder from next starter application ([#135](https://github.com/Sitecore/content-sdk/pull/135))
- `[core]` [Content SDK] Update environment variable naming and associated config property ([#143](https://github.com/Sitecore/content-sdk/pull/143))

### 🛠 Breaking Changes

- `[create-content-sdk-app]` Renamed package from `@sitecore-content-sdk/create-app` to `create-content-sdk-app` (unscoped package)
  - Users can now run `npx create-content-sdk-app` instead of `npx @sitecore-content-sdk/create-app`
  - Follows the same pattern as other popular initializers like `create-react-app` and `create-next-app`
- `[all]` Renamed all JSS references to Content SDK across the codebase: ([#131](https://github.com/Sitecore/content-sdk/pull/131))
  - The create-sitecore-jss package has been renamed to create-content-sdk-app (unscoped package)
  - Component types and props renamed:
    - `ReactJssComponent` → `ReactContentSdkComponent`
    - `NextJssComponent` → `NextjsContentSdkComponent`
- `[react]` `[nextjs]` Refactor `SitecoreContext` naming to `SitecoreProvider` ([95](https://github.com/Sitecore/content-sdk/pull/95)):

  We've revisited and improved the `SitecoreContext` naming for clarity and consistency. This affects component names, types, hook, and HOC.

  #### Component Renames

  - Component:

    - `SitecoreContext` → `SitecoreProvider`

  - Properties:

    - `context` property renamed to `pageContext` to clarify that it holds **page-specific data** only

  - Interfaces:
    - `SitecoreContextValue` → `SitecoreProviderPageContext`
    - `SitecoreContextReactContext` → `SitecoreProviderReactContext`
    - `SitecoreContextState` → `SitecoreProviderState`
    - `SitecoreContextProps` → `SitecoreProviderProps`

  #### Hook and HOC Renames

  - Functions:

    - `withSitecoreContext` → `withSitecore`
    - `useSitecoreContext` → `useSitecore`

  - Properties:

    - `updateSitecoreContext` property -> `updateContext`
    - `sitecoreContext` property -> `pageContext`

  - Interfaces:
    - `WithSitecoreContextOptions` → `WithSitecoreOptions`
    - `WithSitecoreContextProps` → `WithSitecoreProps`
    - `WithSitecoreContextHocProps` → `WithSitecoreHocProps`

- `[nextjs]` Component-level `getServerSideProps` and `getStaticProps` methods have been replaced by a single `getComponentServerProps` method for simplicity.
  - In case a separate logic is needed depending on SSR/SSG context, an `isServerSidePropsContext` helper method from `@sitecore-content-sdk/nextjs/utils` can now be used.
- `[nextjs]` [DesignLibrary] Script is requested from production even when a custom Edge URL is set ([#98](https://github.com/Sitecore/content-sdk/pull/98)):
  - The `EditingScripts` component doesn't accept `sitecoreEdgeUrl` property anymore.
  - The custom Edge URL is now accessed via the `api` property of the `SitecoreProvider` component.
- `[nextjs]` `defineCliConfig` import has been moved to `@sitecore-content-sdk/nextjs/config-cli` submodule ([#128](https://github.com/Sitecore/content-sdk/pull/128)).
- `[core][nextjs][cli]` Re-introduce component map generation logic ([#124](https://github.com/Sitecore/content-sdk/pull/124) [#139](https://github.com/Sitecore/content-sdk/pull/139))
- `[create-content-sdk-app]` Remove SXA components and style files from default `nextjs` template ([#139](https://github.com/Sitecore/content-sdk/pull/139))
- `[core]` `[nextjs]` `[templates/nextjs]` Environment variables' naming has been updated ([#143](https://github.com/Sitecore/content-sdk/pull/143))
  - `JSS_EDITING_SECRET` → `SITECORE_EDITING_SECRET`
  - `NEXT_PUBLIC_SITECORE_SITE_NAME` → `NEXT_PUBLIC_DEFAULT_SITE_NAME`
  - `DISABLE_SSG_FETCH` → `GENERATE_STATIC_PATHS`
  - `disableStaticPaths` config property → `generateStaticPaths` (with inverted logic for clarity)

### 🐛 Bug Fixes

- `[core]` Fix for enabling debug logs previously not appearing during build execution ([#137](https://github.com/Sitecore/content-sdk/pull/137))
- `[core]` Fix for making clientContextId optional for client-side execution to avoid runtime errors ([#121](https://github.com/Sitecore/content-sdk/pull/121))
- `[core]` `[sitecore.config]` Fallback values are not respected when framework specific value is empty & validate resolved config instead of base ([#97](https://github.com/Sitecore/content-sdk/pull/97))
- `[nextjs]` Improve device detection and prevent false prefetch handling in Personalize middleware and also ensure personalized responses are not served from prefetch cache and proper personalization was applied during client side navigation. ([#129](https://github.com/Sitecore/content-sdk/pull/129))
- `[react]` Suspense in ErrorBoundary component is not rendered when it is wrapping a BYOCWrapper to prevent client side hydration errors ([#132](https://github.com/Sitecore/content-sdk/pull/132))
- `[nextjs]` Fix component-level data fetching method is exposed in client bundle ([#134](https://github.com/Sitecore/content-sdk/pull/134))
- `[react]` Add an optional `disableSuspense` flag to the Placeholder component to prevent error boundaries from rendering Suspense which helps contain errors for components. This can help avoid hydration issues in connected mode. ([#96](https://github.com/Sitecore/content-sdk/pull/96))

### 🧹 Chores

- `[react]` Update feaas dependencies ([#149](https://github.com/Sitecore/content-sdk/pull/149))

## 0.2.1

### 🎉 New Features & Improvements

- `[core]` [DesignLibrary] Call partial layout rendering endpoint via Envoy and ContextID ([#111](https://github.com/Sitecore/content-sdk/pull/111))

## 0.2.0

### 🎉 New Features & Improvements

- `[nextjs]` Rework and simplify .env ([#89](https://github.com/Sitecore/content-sdk/pull/89)):
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
- `[core]` `[nextjs]` Introduced `getRobots` method in `SitecoreClient` and a new `RobotsMiddleware` for Next.js API routes ([#83](https://github.com/Sitecore/content-sdk/pull/83))
  - The `getRobots(siteName, fetchOptions?)` method centralizes logic for fetching `robots.txt` content.
  - A new `RobotsMiddleware` class encapsulates HTTP-level logic for generating `robots.txt` responses in Next.js apps.
  - These additions follow the same extensible architecture as existing features enabling custom behavior via service overrides and improving consistency across endpoints.
- `[cli]` Introduce "project" subcommands ([#73](https://github.com/Sitecore/content-sdk/pull/73))
- `[nextjs]` Enhance customizability for Sitecore Client and SDK Middlwares ([#87](https://github.com/Sitecore/content-sdk/pull/87))
- `[core]` `[nextjs]` `[create-content-sdk-app]` Passing configuration object to `defineConfig` in _sitecore.config_ is now optional. Introduced _sitecore.config.ts.example_ ([#90](https://github.com/Sitecore/content-sdk/pull/90)) ([#93](https://github.com/Sitecore/content-sdk/pull/93))
- `[nextjs]` Starter kit components clean up ([#107](https://github.com/Sitecore/content-sdk/pull/107)):
  - Reduced code duplication
  - Streamlined the implementation to improve consistency
  - Removed outdated logic related to editing support

### 🛠 Breaking Changes

- `[core]` SXA Form can't fire CloudSDK events due to initialization error ([#63](https://github.com/Sitecore/content-sdk/pull/63)):
  - Form utilities have been moved from `@sitecore-content-sdk/core/form` to the root of `@sitecore-content-sdk/core`. Update your imports to reflect this change if you are referencing these utilities.
- `[nextjs]` Update React to version 19 and Next JS to version 15 ([#76](https://github.com/Sitecore/content-sdk/pull/76))

### 🐛 Bug Fixes

- `[nextjs]` Fix for case sensitive redirects (make all redirects case-insensitive) ([#70](https://github.com/Sitecore/content-sdk/pull/70))
- `[core]` Fix for lookbehind regex. (not supported on ios 16) ([#67](https://github.com/Sitecore/content-sdk/pull/67))
- `[nextjs]` Render "unoptimized" Next Image in component rendering mode ([#66](https://github.com/Sitecore/content-sdk/pull/66))
- `[react]` Extend `withDatasourceCheck` logic to handle empty datasource in DesignLibrary mode ([#62](https://github.com/Sitecore/content-sdk/pull/62))
- `[cli]` Process env variables in both cli global and local mode by default. ([#61](https://github.com/Sitecore/content-sdk/pull/61))
- `[react]` `[nextjs]` Do not render EditingScripts component in DesignLibrary component. Fix 'dataSourceId' query parameter name in editing render middleware. ([#64](https://github.com/Sitecore/content-sdk/pull/64))

### 🧹 Chores

* `[template/nextjs]` Clean package.json scripts ([#75](https://github.com/Sitecore/content-sdk/pull/75))
* Upgrade 3rd party dependencies ([#88](https://github.com/Sitecore/content-sdk/pull/88)) ([#92](https://github.com/Sitecore/content-sdk/pull/92))
