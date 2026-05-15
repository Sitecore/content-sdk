# Loaders outside Angular `inject()` in loader bodies

Why loader functions should not rely on **`inject()`** or constructor DI for Sitecore wiring.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · [architecture index](doc-architecture-loaders-and-ssr.md)

## Two execution contexts

A **`LoaderFn`** runs in:

1. **Angular SSR / server resolver** — inside Angular’s injection context **for the resolver wrapper**, but the **loader callback** is still invoked as a plain async function with **`LoaderContext`** (`loader-resolver.ts` server branch).
2. **Express loader middleware** — **`executeLoader`** calls the same **`LoaderFn`** with only **`LoaderContext`**; there is **no** Angular injector (`loader-data-service-middleware.ts`).

So anything used **inside** the loader body must be available **without** calling **`inject()`** from within that body. The supported pattern is **static imports**: default **`sitecore.config`**, **`getClient()`** factory module, and helpers such as **`resolveSitecorePage`** from **`@sitecore-content-sdk/angular`**.

The **resolver factory** itself uses **`inject()`** for **`LOADER_REGISTRY`**, **`TransferState`**, **`Router`**, **`platformId`**, and optional **`REQUEST`**; that is fine because it only runs inside Angular.

**Related:** [doc-loaders-route-registry-and-page-loader.md](doc-loaders-route-registry-and-page-loader.md)
