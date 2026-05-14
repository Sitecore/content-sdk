# `loaderResolver` — `TransferState`, `/_data`, and outcomes

Execution path for **`loaderResolver(loaderId)`**: server vs browser, **`TransferState`**, HTTP fallback, and error / redirect handling.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · [architecture index](doc-architecture-loaders-and-ssr.md)

## State key

Keys are built as `makeStateKey(\`loader:${loaderId}:${url}\`)` so each loader and URL pair is isolated (`loader-resolver.ts`).

## Server (SSR)

On the server, the resolver **`inject`s** the **`LOADER_REGISTRY`**, loads the **`LoaderFn`**, builds **`LoaderContext`** (including **`requestContext`** from the optional Angular **`REQUEST`** token when present), runs the loader, and on success **`transferState.set(key, result)`** before returning the value. Redirect results from the loader are turned into router redirects via **`applyRedirect`**.

```109:139:packages/angular/src/loaders/loader-resolver.ts
    const url = state.url;
    const key = stateKey(loaderId, url);

    if (isPlatformBrowser(platformId)) {
      try {
        return await resolveOnBrowser(route, state, loaderId, router);
      } catch (e) {
        // special handling for browser, as navigation error for handleNavigationError is only generated on server
        return redirectOnNavigationError(e as Error, url, notFoundRoute, errorRoute, router);
      }
    }

    const loader = registry[loaderId];

    if (!loader) {
      throw new Error(`No loader registered for id "${loaderId}"`);
    }

    const requestContext = request ? extractRequestContext(request) : undefined;

    const result = await loader({
      url,
      params: route.params,
      query: route.queryParams,
      requestContext,
    });
    if (isLoaderRedirectResult(result)) {
      return applyRedirect(router, result.loaderRedirectTarget);
    }
    transferState.set(key, result);
    return result;
```

**Note:** On the server, **`route.params`** are the params for the **activated** route snapshot only; the browser path merges **`pathFromRoot`** when calling **`LoaderDataService.getData`** (see below).

## Browser

1. If **`TransferState.hasKey(key)`**, the value is **`get`** then **`remove`** (one-shot hydration / navigation).
2. Otherwise **`LoaderDataService.getData`** **`POST`s** to the loader endpoint (default **`/_data`**, from **`LOADER_DATA_ENDPOINT`** in `packages/angular/src/server/constants.ts`). The service deduplicates concurrent requests per cache key (`loader:${loaderId}:${url}`).

Browser resolver merges **all** parent params for the HTTP request:

```77:84:packages/angular/src/loaders/loader-resolver.ts
  const allParams = route.pathFromRoot.reduce((acc, r) => ({ ...acc, ...r.params }), {}) as Params;

  const resp = await loaderData.getData({
    url,
    loaderId,
    params: allParams,
    query: route.queryParams as Record<string, string | string[]>,
  });
```

3. **`LoaderApiResponse`** kinds map to throws or redirects: **`error`** → **`LoaderHttpError`**, **`notFound`** → **`NotFoundNavigationError`**, **`redirect`** → **`applyRedirect`**.

Express mirrors the same execution and response kinds in **`createLoaderDataServiceMiddleware`** (`packages/angular/src/server/loader-data-service-middleware.ts`), including mapping **`NotFoundNavigationError`** to a **`notFound`** payload.

## Custom endpoint

Apps may provide **`FETCH_DATA_ENDPOINT`** to override the URL **`LoaderDataService`** calls; it defaults to **`LOADER_DATA_ENDPOINT`** when omitted (`loader-data.service.ts`).

**Related:** [doc-ssr-express-and-loader-middleware.md](doc-ssr-express-and-loader-middleware.md) · [doc-preloader-data-service.md](doc-preloader-data-service.md)
