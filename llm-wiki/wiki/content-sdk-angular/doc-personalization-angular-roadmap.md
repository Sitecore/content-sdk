# Personalization (Angular) — status

The PDF marked **Personalization** as TBA. The Angular **`resolveSitecorePage`** helper is a thin **`client.getPage`** wrapper; its JSDoc explicitly calls out **future** helpers for **personalization** (and multisite) next to this call.

Until those helpers exist, personalization behavior depends on what **`SitecoreClient.getPage`** and your **`sitecore.config`** (for example **`personalize`** service settings) already provide — same underlying **`@sitecore-content-sdk/content`** stack as other heads. See [doc-sitecore-config.md](../content-sdk-nextjs/doc-sitecore-config.md) for config surface.

**Related:** [doc-multisite-angular-roadmap.md](doc-multisite-angular-roadmap.md) · [doc-loaders-route-registry-and-page-loader.md](doc-loaders-route-registry-and-page-loader.md)
