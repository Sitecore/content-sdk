# `sitecore.config.ts` (Angular)

Angular apps use the same root **`sitecore.config.ts`** model as other Content SDK heads.

**Shared reference:** [../common/doc-sitecore-config-input.md](../common/doc-sitecore-config-input.md) — **`SitecoreConfigInput`**, **`api.edge` / `api.local`**, merge pipeline. [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md) — env keys consumed by **`buildFallbackConfig`**. [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) — how config becomes GraphQL URLs and **`SitecoreClient.getPage`**.

## `provideSitecoreAngular`

**`provideSitecoreAngular(config: SitecoreAngularConfig): EnvironmentProviders`** — the Angular app's DI bootstrap entry point. Defined in `packages/angular/src/lib/providers.ts`.

| Parameter | Type | Required | Role |
|-----------|------|----------|------|
| `sitecoreConfig` | `SitecoreConfig` | No | Config from `sitecore.config.ts`; bound to `SITECORE_CONFIG_TOKEN` |
| `sitecoreClient` | `SitecoreClient` | No | App-owned client singleton; bound to `SITECORE_CLIENT_TOKEN` |
| `notFoundRoute` | `string` | No | Angular route path for 404; bound to `NOT_FOUND_ROUTE_TOKEN` |
| `errorRoute` | `string` | No | Angular route path for 500; bound to `ERROR_ROUTE_TOKEN` |

## In the template

The scaffold imports the default config into **`app.config.ts`**: `provideSitecoreAngular({ sitecoreConfig: scConfig, sitecoreClient: getClient(), notFoundRoute: '/not-found', errorRoute: '/error' })`. Loaders import **`sitecore.config`** statically (no DI in loader bodies — see [doc-loaders-outside-angular-di.md](doc-loaders-outside-angular-di.md)).

## `SitecoreClient` in generated apps

`packages/create-content-sdk-app/src/templates/angular/src/content-sdk/client/sitecore-client.ts` exposes **`getClient()`**: a lazy singleton **`new SitecoreClient(scConfig)`** so the Angular build does not require live credentials during route extraction. **`resolveSitecorePage`** in loaders calls **`client.getPage(path, pageOptions)`** with optional **`locale`** / **`site`** overrides.

The **`SitecoreClient`** class and GraphQL behavior are unchanged from **`@sitecore-content-sdk/content`**; **`@sitecore-content-sdk/angular`** re-exports the client surface from **`@sitecore-content-sdk/content/client`**.

**Related:** [doc-environment-and-define-config-angular.md](doc-environment-and-define-config-angular.md) · [doc-loaders-route-registry-and-page-loader.md](doc-loaders-route-registry-and-page-loader.md)
