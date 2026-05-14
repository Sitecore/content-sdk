# Loaders — route configuration, registry, and `pageLoader`

How Angular wires **route `resolve`** to named loaders via **`provideLoaderRegistry`** and the typical **`pageLoader`** pattern.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · [architecture index](doc-architecture-loaders-and-ssr.md)

## Route configuration

Routes attach **`loaderResolver('<id>')`** to `resolve` keys (for example `page`, `dictionary`). The resolver is created by `loaderResolver` in `packages/angular/src/loaders/loader-resolver.ts` and tagged with a **`LOADER_ID`** symbol so `PreLoaderDataService` can discover it (see [doc-preloader-data-service.md](doc-preloader-data-service.md)).

## Registry in `app.config.ts`

The generated app provides the registry object with **`provideLoaderRegistry(LOADERS)`** and registers **`PreLoaderDataService`** (template: `packages/create-content-sdk-app/src/templates/angular/src/app/app.config.ts`).

## Default page loader (example)

Loaders are plain **`LoaderFn`** functions in app code. They receive **`LoaderContext`** (`url`, `params`, `query`, optional `requestContext` on the server). The usual **page** loader calls **`resolveSitecorePage`** with **`context.url`**, the default **`sitecore.config`**, and a shared **`getClient()`** singleton — all **imported**, not injected in the loader body, so the same function runs in SSR resolvers and in the Express loader middleware.

`resolveSitecorePage` is documented as taking a **path**; `LoaderContext.url` is the current URL path for the navigation.

```19:33:packages/angular/src/lib/sitecore-page-resolver.ts
export async function resolveSitecorePage(
  path: string,
  sitecoreConfig: SitecoreConfig,
  client: SitecoreClient,
  options?: { locale?: string; site?: string }
): Promise<Page | null> {
  const pageOptions: PageOptions = {};
  if (options?.locale) {
    pageOptions.locale = options.locale || sitecoreConfig.defaultLanguage;
  }
  if (options?.site) {
    pageOptions.site = options.site || sitecoreConfig.defaultSite;
  }
  return client.getPage(path, pageOptions);
}
```

On **not found**, loaders throw **`NotFoundNavigationError`** so the resolver / middleware can map that to a **404** response or not-found route (see [doc-loader-resolver-transfer-state-and-endpoint.md](doc-loader-resolver-transfer-state-and-endpoint.md)).

**Related:** [doc-loaders-outside-angular-di.md](doc-loaders-outside-angular-di.md) · [doc-loader-resolver-transfer-state-and-endpoint.md](doc-loader-resolver-transfer-state-and-endpoint.md)
