# Loaders and the no-Angular-DI rule

Optional, on-demand detail. The compact guide is [AGENTS.md](../../AGENTS.md). **Read this file before editing anything under `src/content-sdk/`.**

## Why loaders live under `src/content-sdk/`, not `src/app/`

A loader is executed from **two** places:

1. **Angular SSR** — `loaderResolver(id)` in `src/app/app.routes.ts` runs inside the Angular injector and delegates to the server loader runner provided by `provideServerLoaderRunner()` (`src/app/app.config.server.ts`).
2. **Plain Express** — `createLoaderDataServiceMiddleware(config, { loaders: LOADERS, cache })` in `src/server.ts` serves `POST /_data` for client-side navigation. **There is no Angular injector in this path.**

Because path 2 has no injector, a loader body cannot rely on Angular DI. The folder name encodes the contract: anything under `src/content-sdk/` is framework-agnostic Sitecore integration; anything under `src/app/` is the Angular DI world. Moving a loader into `src/app/` and injecting a service into it will appear to work under SSR and then fail at runtime the first time a client-side navigation hits `/_data`.

## The rule

**Do not use `inject()`, constructor injection, or Angular services inside a loader body or anywhere under `src/content-sdk/`.**

Instead:

- **Config:** `import scConfig from '../../../sitecore.config';`
- **Client:** `import { getClient } from '../client/sitecore-client';`
- **Request state:** read it from the `LoaderContext` argument using SDK helpers.

It **is** fine for `loaderResolver()` and the providers in `app.config.ts` / `app.config.server.ts` to use DI — that is SDK/Angular infrastructure, not loader code. The restriction applies to the loader bodies you write.

## The `LoaderFn` contract

```ts
type LoaderFn<T = unknown> = (ctx: LoaderContext) => Promise<T> | T | LoaderRedirectResult;
```

`LoaderContext` carries `url`, `routeParams` (with `locale` defaulted to `scConfig.defaultLanguage`), `query`, `scParams` (site and personalization variants written by the Express middleware), and — server-side — `req` and `csdkRequestData`.

Helpers from `@sitecore-content-sdk/angular` that read the context for you:

| Helper | Returns |
|--------|---------|
| `getLanguage(context)` | Locale from the route params |
| `getSiteName(context)` | Site resolved by `createMultisiteMiddleware` |
| `getVariantId(context)` | Page variant from `createPersonalizeMiddleware` |
| `getComponentVariantIds(context)` | Component variants from personalization |
| `getEditingPreviewData(context.csdkRequestData)` | Editing/preview payload stashed by the editing render middleware |
| `splitLocaleFromPath(url, scConfig.angular.locales)` | `{ locale, nonLocalePath }` |

## Reference implementation

`src/content-sdk/loaders/page.loader.ts` — note the JSDoc, the static imports, and the absence of `inject()`:

```ts
import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { NotFoundNavigationError, getEditingPreviewData, /* … */ } from '@sitecore-content-sdk/angular';
import scConfig from '../../../sitecore.config';
import { getClient } from '../client/sitecore-client';

/**
 * Page loader: fetches layout data from Sitecore for the current URL.
 * Uses imported config and {@link getClient} so this runs outside Angular injection context.
 */
export const pageLoader: LoaderFn<Page> = async (context) => {
  const previewData = getEditingPreviewData(context.csdkRequestData);
  const locale = getLanguage(context) || scConfig.defaultLanguage;
  const { nonLocalePath } = splitLocaleFromPath(context.url, scConfig.angular.locales);
  // getPreview / getPage
  if (!page) throw new NotFoundNavigationError();
  return page;
};
```

Error signalling from a loader:

- **Not found** — `throw new NotFoundNavigationError()`; the router navigates to `notFoundRoute` (`/404`) and `app.routes.server.ts` maps it to HTTP 404.
- **Redirect** — return a `LoaderRedirectResult`. Redirects are **never** written to the cache.
- **Failure** — throw; the resolver surfaces a `LoaderHttpError` and routes to `errorRoute` (`/500`).

## The single registry

`src/content-sdk/loaders/index.ts` exports one `LOADERS` object:

```ts
export const LOADERS = {
  page: pageLoader,
  dictionary: dictionaryLoader,
  '404': notFoundLoader,
  '500': errorLoader,
};
```

The **same object** is passed to both:

- `provideLoaderRegistry(LOADERS)` in `src/app/app.config.ts`
- `createLoaderDataServiceMiddleware(config, { loaders: LOADERS, cache: loaderCache })` in `src/server.ts`

There is no separate "server loader set". A new loader means: add the file, export it from `index.ts`, add it to `LOADERS`, and attach `loaderResolver('<key>')` to the route in `app.routes.ts`. The registry key and the resolver argument must match.

## How data reaches components

1. **SSR** — the resolver runs the loader directly and writes the result to `TransferState` under `loader:<loaderId>:<url>`.
2. **Browser first paint** — the resolver reads that `TransferState` key once and removes it.
3. **Client-side navigation** — `ClientLoaderDataService` POSTs to `/_data`, which runs the same loader on the server through the same cache. `ClientPreLoaderDataService` prefetches all loader ids for the target route in parallel (Angular resolvers otherwise run sequentially); prefetch requests carry `x-sc-purpose: prefetch` so personalization skips the CDP call.
4. **In components** — resolved values arrive as `ActivatedRoute.data['page']` and `['dictionary']`, and reactively through `SitecoreContextService.page()` / `.dictionary()`.

Consequences:

- **Loader results must be JSON-serializable.** Class instances, functions, `Date` objects and `Map`s do not survive `TransferState`.
- **The browser never touches the loader cache** — only HTTP to `/_data`.
- The request body sent to `/_data` cannot be trusted to declare hostname, cookies or site; the server derives those from the real Express `req`.

## Loader cache

Created once in `src/server.ts` via `createLoaderCache({ revalidate, enabled, defaultSiteName, driver })` using an `unstorage` driver (memory by default; a filesystem driver is shown in the comments). It reads `scConfig.angular.loadersCache.enabled` / `.revalidate`. To change those, edit **`sitecore.config.ts`** and pass them in the **first argument** of `defineConfig` — `defineConfig({ angular: { loadersCache: { enabled: true, revalidate: 300 } } }, environment)`.

The **same instance** must be passed to:

- `createSitecoreRevalidateMiddleware({ cache, … })` — the `POST /api/revalidate` webhook
- `createLoaderDataServiceMiddleware(config, { loaders, cache })` — the `/_data` endpoint
- `angularApp.handle(req, { cache: loaderCache, req, res })` — the SSR handler

Behaviour: stale-while-revalidate — a hit returns immediately, a stale entry returns immediately and refreshes in the background, a miss runs the loader synchronously. Cache keys include site, locale and personalization variant. Editing and preview requests bypass the cache entirely (detected via the editing params header). Redirects are never cached.

`unstorage` is **server-only**. Never import it, `createLoaderCache`, or any `create*Middleware` from a file reachable by `src/main.ts`.
