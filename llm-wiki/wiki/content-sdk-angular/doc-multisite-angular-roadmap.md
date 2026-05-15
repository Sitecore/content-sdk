# Multisite (Angular) — status

The PDF marked **Multisite** as TBA. **`resolveSitecorePage`** already accepts optional **`site`** (and **`locale`**) overrides on top of **`sitecore.config`** defaults, but cookie-based or host-header-based site resolution is not yet implemented as a first-class Angular feature.

```4:9:packages/angular/src/lib/sitecore-page-resolver.ts
/**
 * Resolves layout/page data for a route path using a {@link SitecoreClient} and Sitecore config.
 * Import your `sitecore.config` default and shared client (e.g. `getClient()`) from the app;
 * this stays usable from route loaders without Angular injection context.
 *
 * Future: add helpers for personalization and multisite alongside this call.
 * @param {string} path - Route path (e.g. `'/'` or `'/about'`).
```

**Practical note:** apps can pass **`options.site`** / **`options.locale`** from loader logic once they determine the active site (for example a custom resolver or request headers). Shared **`SitecoreConfig`** **`multisite`** keys are defined in [../common/doc-sitecore-config-input.md](../common/doc-sitecore-config-input.md). Next.js **`[site]`** routing and **`getNextFallbackConfig`** multisite behavior are described in [doc-sitecore-config.md](../content-sdk-nextjs/doc-sitecore-config.md) under **Multisite (Next App Router)**.

**Related:** [doc-loaders-route-registry-and-page-loader.md](doc-loaders-route-registry-and-page-loader.md)
