# `sitecore.config.ts` (Angular)

Angular apps use the same root **`sitecore.config.ts`** model as other Content SDK heads.

**Shared reference:** [../common/doc-sitecore-config-input.md](../common/doc-sitecore-config-input.md) — **`SitecoreConfigInput`**, **`api.edge` / `api.local`**, merge pipeline. [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md) — env keys consumed by **`buildFallbackConfig`**. [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) — how config becomes GraphQL URLs and **`SitecoreClient.getPage`**.

## In the template

The scaffold imports the default config into **`app.config.ts`** (`provideSitecoreAngular({ sitecoreConfig: scConfig, sitecoreClient: getClient(), ... })`) and into loaders via a **static import** of **`sitecore.config`**.

## `SitecoreClient` in generated apps

`packages/create-content-sdk-app/src/templates/angular/src/content-sdk/client/sitecore-client.ts` exposes **`getClient()`**: a lazy singleton **`new SitecoreClient(scConfig)`** so the Angular build does not require live credentials during route extraction. **`resolveSitecorePage`** in loaders calls **`client.getPage(path, pageOptions)`** with optional **`locale`** / **`site`** overrides.

The **`SitecoreClient`** class and GraphQL behavior are unchanged from **`@sitecore-content-sdk/content`**; **`@sitecore-content-sdk/angular`** re-exports the client surface from **`@sitecore-content-sdk/content/client`**.

**Related:** [doc-environment-and-define-config-angular.md](doc-environment-and-define-config-angular.md) · [doc-loaders-route-registry-and-page-loader.md](doc-loaders-route-registry-and-page-loader.md)
