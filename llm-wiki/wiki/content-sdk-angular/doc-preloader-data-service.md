# `PreLoaderDataService`

Browser-only **prefetch** of loader data for all **`loaderResolver`** entries on the target route so sequential Angular resolvers often hit **`LoaderDataService`** cache or join in-flight requests.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · [architecture index](doc-architecture-loaders-and-ssr.md)

## Behavior

- Subscribes to the router’s **`ActivationStart`** events.
- When the activated snapshot is a **leaf** (no `children.length`), it collects every **`resolve`** function on **`pathFromRoot`** that carries the **`LOADER_ID`** symbol (set by **`loaderResolver`**).
- For each collected **`LoaderDataRequest`**, it calls **`LoaderDataService.prefetch()`**, which is a **no-op on the server** (`isPlatformBrowser` guard in both services).

```24:34:packages/angular/src/loaders/pre-loader-data.service.ts
/**
 * PreLoaderDataService kicks off loader data fetches for all loaders in the current route
 * and its parent routes in parallel, so that when Angular runs resolvers sequentially,
 * resolvers get cache hits or join already-pending requests instead of waiting.
 *
 * Subscribes to the router's ActivationStart event and prefetches for the
 * ActivatedRouteSnapshot when it is the leaf route (browser only). Discovers all loader
 * resolvers on that snapshot and its parents (via LOADER_ID on pathFromRoot), then
 * calls LoaderDataService.prefetch() for each (loaderId, url, params, query). Fetches
 * run in parallel; results are stored in LoaderDataService cache for getData() to consume.
 * @public
 */
```

Prefetch issues **`HttpClient.post`** asynchronously; the constructor’s **`for`** loop starts each prefetch without awaiting, so multiple loaders start **without waiting for each other**.

## Template wiring

The Angular scaffold registers **`PreLoaderDataService`** next to **`provideLoaderRegistry(LOADERS)`** in **`app.config.ts`**.

**Related:** [doc-loader-resolver-transfer-state-and-endpoint.md](doc-loader-resolver-transfer-state-and-endpoint.md)
