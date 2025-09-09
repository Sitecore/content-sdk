# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

Major versions of this project will include breaking changes in core packages and align with Sitecore seasonal releases though not strictly bound to them.

Our versioning strategy is as follows:

- Patch: no breaking changes (e.g. bug fixes, minor improvements)
- Minor: non-breaking feature additions – no breaking changes (e.g. new features, improvements)
- Major: new features + breaking changes (e.g. framework upgrades, major architectural changes, major features)

## Unreleased

## 1.1.0

### 🎉 New Features & Improvements

* `[nextjs]` Support component-level data fetching in 404/500 pages ([#199](https://github.com/Sitecore/content-sdk/pull/199))
* Migration from ESlint 8 -> ESLint 9 and introduction of the new Flat Config file ([#176](https://github.com/Sitecore/content-sdk/pull/176))
* Code generation for Design Library enablers:
  - `[core]` `[nextjs]` Add import-map generation ([#157](https://github.com/Sitecore/content-sdk/pull/157))([#167](https://github.com/Sitecore/content-sdk/pull/167))([#170](https://github.com/Sitecore/content-sdk/pull/170))([#171](https://github.com/Sitecore/content-sdk/pull/171))([#175](https://github.com/Sitecore/content-sdk/pull/175))([#177](https://github.com/Sitecore/content-sdk/pull/177))([#187](https://github.com/Sitecore/content-sdk/pull/187))
    - New `writeImportMap()`, `combineImportEntries()` methods and `defaultImportEntries` export available from `@sitecore-content-sdk/nextjs/codegen`
  - Dynamic component rendering ([#163](https://github.com/Sitecore/content-sdk/pull/163))
  - Updated API endpoint to new Edge Platform format ([#162](https://github.com/Sitecore/content-sdk/pull/162))
  - Ensure editing state is enabled in Design Library mode ([#181](https://github.com/Sitecore/content-sdk/pull/181))
* `[core]` Ensure displayName paths are properly UTF-8 encoded. ([#179](https://github.com/Sitecore/content-sdk/pull/179))
* `[react]` Enhanced the Design Library cache buster format to hh-dd-mm-yyyy ([#188](https://github.com/Sitecore/content-sdk/pull/188))
* `[react]` Add `component:status` events for VariantGeneration ([#190](https://github.com/Sitecore/content-sdk/pull/190))
* `[nextjs]` Optimization for editing render middleware: issue an internal server request for fetching page data during editing instead of doing temporary redirect ([#195](https://github.com/Sitecore/content-sdk/pull/195)) ([#196](https://github.com/Sitecore/content-sdk/pull/196))
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
* `[cli]` Code extraction extends XM Cloud Rendering Host build by several minutes ([#173](https://github.com/Sitecore/content-sdk/pull/173))
* `[core]` Fix redirect regex processing to prevent over-escaping of question marks in regex patterns ([#174](https://github.com/Sitecore/content-sdk/pull/174))

## 1.0.1

### 🐛 Bug Fixes

* `[core]` `[nextjs]` Restore proper local connection fallback 
  * Added fallback to `middleware.ts` file to enable local API connections in the absence of `contextId`. ([#178](https://github.com/Sitecore/content-sdk/pull/178))([#180](https://github.com/Sitecore/content-sdk/pull/180))

## 1.0.0

### 🎉 New Features & Improvements

* Design Library Early Access enablers:
  * `[core]` `[nextjs]` Integrated new _VariantGeneration_ mode ([#158](https://github.com/Sitecore/content-sdk/pull/158))
  * `[nextjs]` Default static import-map ([#153](https://github.com/Sitecore/content-sdk/pull/153))
  * `[cli]` Code Extraction ([#71](https://github.com/Sitecore/content-sdk/pull/71))([#113](https://github.com/Sitecore/content-sdk/pull/113))([#114](https://github.com/Sitecore/content-sdk/pull/114))([#154](https://github.com/Sitecore/content-sdk/pull/154))

### 🛠 Breaking Changes

* Refactored `SitecoreProvider` and enhanced `SitecoreClient` ([#158](https://github.com/Sitecore/content-sdk/pull/158)):

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

* Refactor and simplify service names ([#133](https://github.com/Sitecore/content-sdk/pull/133)):

  You will be affected by the following changes **only** if:
  - You are referencing Content SDK services directly rather than using the `SitecoreClient` methods.

  If you're using the `SitecoreClient` to access services, **no changes** are required.

  Service class and config names have been refactored for clarity and consistency:

  * Renamed:
    * `RestComponentLayoutService` → `ComponentLayoutService`
    * `RestComponentLayoutServiceConfig` → `ComponentLayoutServiceConfig`
    * `GraphQLEditingService` → `EditingService`
    * `GraphQLEditingServiceConfig` → `EditingServiceConfig`
    * `GraphQLDictionaryService` → `DictionaryService`
    * `GraphQLDictionaryServiceConfig` → `DictionaryServiceConfig`
    * `GraphQLLayoutService` → `LayoutService`
    * `GraphQLLayoutServiceConfig` → `LayoutServiceConfig`
    * `GraphQLPersonalizeService` → `PersonalizeService`
    * `GraphQLPersonalizeServiceConfig` → `PersonalizeServiceConfig`
    * `GraphQLErrorPagesService` → `ErrorPagesService`
    * `GraphQLErrorPagesServiceConfig` → `ErrorPagesServiceConfig`
    * `GraphQLRedirectsService` → `RedirectsService`
    * `GraphQLRedirectsServiceConfig` → `RedirectsServiceConfig`
    * `GraphQLRobotsService` → `RobotsService`
    * `GraphQLRobotsServiceConfig` → `RobotsServiceConfig`
    * `GraphQLSiteInfoService` → `SiteInfoService`
    * `GraphQLSiteInfoServiceConfig` → `SiteInfoServiceConfig`
    * `GraphQLSitemapXmlService` → `SitemapXmlService`
    * `GraphQLSitemapXmlServiceConfig` → `SitemapXmlServiceConfig`
    * `GraphQLSitePathService` → `SitePathService`
    * `GraphQLSitePathServiceConfig` → `SitePathServiceConfig`
  * Removed `DictionaryService` interface
* `[core]` `[nextjs]` `[templates/nextjs]` Refactor site resolution logic across packages ([#141](https://github.com/Sitecore/content-sdk/pull/141))([#155](https://github.com/Sitecore/content-sdk/pull/155))
  * Removed `sites` parameter from `SitecoreClientInit` type
  * Removed `SiteResolver` dependency and `resolveSite()` from `SitecoreClient`
  * Removed support for passing a custom siteResolver to `SitecoreClient`
  * Updated `SitecoreClient` to construct the `Page` using `siteName` instead of the full `SiteInfo`.
  * Updated SitecoreClient's `getPagePaths()` to accept a `sites` parameter
  * Modified the `getPagePaths` method in `SitecoreClient` to accept a `sites` parameter.
  * Updated Next.js `SitemapMiddleware` and `RobotsMiddleware` to use their own instance of `SiteResolver` and accept a `sites` parameter via the constructor.

### 🐛 Bug Fixes

* `[nextjs]` Ensure Redirect Middleware handles case-insensitive path matching to prevent missed redirects due to casing differences ([#159](https://github.com/Sitecore/jss/pull/159))
* `[core]` `[nextjs]`Standardized way of handling contextId/clientContextId and related fallbacks ([#150](https://github.com/Sitecore/content-sdk/pull/150))

### 🧹 Chores

* Add Github action workflow to generate package size and test coverage metrics report ([#151](https://github.com/Sitecore/content-sdk/pull/151))

## 0.3.0

### 🎉 New Features & Improvements

* `[create-content-sdk-app]`: Refactoring/Cleanup for scss files in SXA components ([#119](https://github.com/Sitecore/content-sdk/pull/119))([#122](https://github.com/Sitecore/content-sdk/pull/122))
* `[core]` `[nextjs]` [DesignLibrary] Include metadata in the Design Library rendering mechanism ([#118](https://github.com/Sitecore/content-sdk/pull/118))
* `[core]` `[nextjs]` `[cli]` Add automatic component map generation ([#124](https://github.com/Sitecore/content-sdk/pull/124) [#128](https://github.com/Sitecore/content-sdk/pull/128) [#130](https://github.com/Sitecore/content-sdk/pull/130))
* `[create-sitecore-jss]` Remove graphql introspection sample and scripts folder from next starter application ([#135](https://github.com/Sitecore/content-sdk/pull/135))
* `[core]` [Content SDK] Update environment variable naming and associated config property ([#143](https://github.com/Sitecore/content-sdk/pull/143))

### 🛠 Breaking Changes

* `[create-content-sdk-app]` Renamed package from `@sitecore-content-sdk/create-app` to `create-content-sdk-app` (unscoped package)
  - Users can now run `npx create-content-sdk-app` instead of `npx @sitecore-content-sdk/create-app`
  - Follows the same pattern as other popular initializers like `create-react-app` and `create-next-app`
* `[all]` Renamed all JSS references to Content SDK across the codebase: ([#131](https://github.com/Sitecore/content-sdk/pull/131))
  - The create-sitecore-jss package has been renamed to create-content-sdk-app (unscoped package)
  - Component types and props renamed:
    - `ReactJssComponent` → `ReactContentSdkComponent`
    - `NextJssComponent` → `NextjsContentSdkComponent`
* `[react]` `[nextjs]` Refactor `SitecoreContext` naming to `SitecoreProvider` ([95](https://github.com/Sitecore/content-sdk/pull/95)):

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
    - `sitecoreContext`  property -> `pageContext`

  - Interfaces:
    - `WithSitecoreContextOptions` → `WithSitecoreOptions`
    - `WithSitecoreContextProps` → `WithSitecoreProps`
    - `WithSitecoreContextHocProps` → `WithSitecoreHocProps`
* `[nextjs]` Component-level `getServerSideProps` and `getStaticProps` methods have been replaced by a single `getComponentServerProps` method for simplicity.
    * In case a separate logic is needed depending on SSR/SSG context, an `isServerSidePropsContext` helper method from `@sitecore-content-sdk/nextjs/utils` can now be used.
* `[nextjs]` [DesignLibrary] Script is requested from production even when a custom Edge URL is set ([#98](https://github.com/Sitecore/content-sdk/pull/98)):
  * The `EditingScripts` component doesn't accept `sitecoreEdgeUrl` property anymore.
  * The custom Edge URL is now accessed via the `api` property of the `SitecoreProvider` component.
* `[nextjs]` `defineCliConfig` import has been moved to `@sitecore-content-sdk/nextjs/config-cli` submodule ([#128](https://github.com/Sitecore/content-sdk/pull/128)).
* `[core][nextjs][cli]` Re-introduce component map generation logic ([#124](https://github.com/Sitecore/content-sdk/pull/124) [#139](https://github.com/Sitecore/content-sdk/pull/139))
* `[create-content-sdk-app]` Remove SXA components and style files from default `nextjs` template ([#139](https://github.com/Sitecore/content-sdk/pull/139))
* `[core]` `[nextjs]` `[templates/nextjs]` Environment variables' naming has been updated ([#143](https://github.com/Sitecore/content-sdk/pull/143))
  * `JSS_EDITING_SECRET` → `SITECORE_EDITING_SECRET`
  * `NEXT_PUBLIC_SITECORE_SITE_NAME` → `NEXT_PUBLIC_DEFAULT_SITE_NAME`
  * `DISABLE_SSG_FETCH` → `GENERATE_STATIC_PATHS`
  * `disableStaticPaths` config property → `generateStaticPaths` (with inverted logic for clarity)

### 🐛 Bug Fixes

* `[core]` Fix for enabling debug logs previously not appearing during build execution ([#137](https://github.com/Sitecore/content-sdk/pull/137))
* `[core]` Fix for making clientContextId optional for client-side execution to avoid runtime errors ([#121](https://github.com/Sitecore/content-sdk/pull/121))
* `[core]` `[sitecore.config]` Fallback values are not respected when framework specific value is empty & validate resolved config instead of base ([#97](https://github.com/Sitecore/content-sdk/pull/97))
* `[nextjs]` Improve device detection and prevent false prefetch handling in Personalize middleware and also ensure personalized responses are not served from prefetch cache and proper personalization was applied during client side navigation. ([#129](https://github.com/Sitecore/content-sdk/pull/129))
* `[react]` Suspense in ErrorBoundary component is not rendered when it is wrapping a BYOCWrapper to prevent client side hydration errors ([#132](https://github.com/Sitecore/content-sdk/pull/132))
* `[nextjs]` Fix component-level data fetching method is exposed in client bundle ([#134](https://github.com/Sitecore/content-sdk/pull/134))
* `[react]` Add an optional `disableSuspense` flag to the Placeholder component to prevent error boundaries from rendering Suspense which helps contain errors for components. This can help avoid hydration issues in connected mode. ([#96](https://github.com/Sitecore/content-sdk/pull/96))

### 🧹 Chores

* `[react]` Update feaas dependencies ([#149](https://github.com/Sitecore/content-sdk/pull/149))

## 0.2.1

### 🎉 New Features & Improvements

* `[core]` [DesignLibrary] Call partial layout rendering endpoint via Envoy and ContextID ([#111](https://github.com/Sitecore/content-sdk/pull/111))

## 0.2.0

### 🎉 New Features & Improvements

* `[nextjs]` Rework and simplify .env ([#89](https://github.com/Sitecore/content-sdk/pull/89)):
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
* `[core]` `[nextjs]` Introduced `getRobots` method in `SitecoreClient` and a new `RobotsMiddleware` for Next.js API routes ([#83](https://github.com/Sitecore/content-sdk/pull/83))
  - The `getRobots(siteName, fetchOptions?)` method centralizes logic for fetching `robots.txt` content.
  - A new `RobotsMiddleware` class encapsulates HTTP-level logic for generating `robots.txt` responses in Next.js apps.
  - These additions follow the same extensible architecture as existing features enabling custom behavior via service overrides and improving consistency across endpoints.
* `[cli]` Introduce "project" subcommands ([#73](https://github.com/Sitecore/content-sdk/pull/73))
* `[nextjs]` Enhance customizability for Sitecore Client and SDK Middlwares ([#87](https://github.com/Sitecore/content-sdk/pull/87))
* `[core]` `[nextjs]` `[create-content-sdk-app]` Passing configuration object to `defineConfig` in _sitecore.config_ is now optional. Introduced _sitecore.config.ts.example_ ([#90](https://github.com/Sitecore/content-sdk/pull/90)) ([#93](https://github.com/Sitecore/content-sdk/pull/93))
* `[nextjs]` Starter kit components clean up ([#107](https://github.com/Sitecore/content-sdk/pull/107)):
  - Reduced code duplication
  - Streamlined the implementation to improve consistency
  - Removed outdated logic related to editing support

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