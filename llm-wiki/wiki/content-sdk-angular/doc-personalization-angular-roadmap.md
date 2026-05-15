# Personalization (Angular) — status

The PDF marked **Personalization** as TBA. The Angular **`resolveSitecorePage`** helper is a thin **`client.getPage`** wrapper; its JSDoc explicitly calls out **future** helpers for **personalization** (and multisite) next to this call.

Until those helpers exist, personalization behavior depends on what **`SitecoreClient.getPage`** and your **`sitecore.config`** (the **`personalize`** block — `enabled`, `edgeTimeout`, `cdpTimeout`, `scope`, `channel`, `currency`) already provide. See [common/doc-sitecore-config-input.md](../common/doc-sitecore-config-input.md) for the full `SitecoreConfigInput` surface.

**Related:** [doc-multisite-angular-roadmap.md](doc-multisite-angular-roadmap.md) · [doc-loaders-route-registry-and-page-loader.md](doc-loaders-route-registry-and-page-loader.md)
