# Locale and dictionary (Angular) — stub

**Status: full i18n is not yet implemented** for the Angular head. This page documents what is currently available.

## What is available now

### Locale from the `Page` object

The Angular template does not use locale URL segments. Locale is resolved by Sitecore on the server and returned as **`page.locale`** in the `Page` object from `SitecoreClient.getPage`.

`resolveSitecorePage` accepts optional `options.locale`; if omitted it falls back to `sitecoreConfig.defaultLanguage`. The resolved locale is available to components via `SitecoreContextService.page()?.locale`.

### Dictionary

A **`dictionaryLoader`** in the route config calls **`getClient().getDictionary({ site, locale })`** (`SitecoreClient.getDictionary` from `@sitecore-content-sdk/content`). Dictionary data is accessed from route data as `data()?.dictionary`.

**Source:** `packages/create-content-sdk-app/src/templates/angular/src/content-sdk/loaders/dictionary.loader.ts`

### Default language env key

`CSDK_PUBLIC_DEFAULT_LANGUAGE` maps to `defaultLanguage` in `sitecore.config.ts` via `buildFallbackConfig`. See [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md).

## Not yet implemented

- Locale URL segments / routing by locale
- Multi-locale route generation (`getPagePaths` with locale list)
- Third-party i18n library integration

## Related

- [doc-loaders-route-registry-and-page-loader.md](doc-loaders-route-registry-and-page-loader.md) — `resolveSitecorePage` options
- [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md) — env keys
- [doc-sitecore-config-typescript-angular.md](doc-sitecore-config-typescript-angular.md) — `defaultLanguage` in config
