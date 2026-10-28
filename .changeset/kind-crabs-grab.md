---
'@sitecore-content-sdk/react': patch
---

Read page mode from `props.page` in `withDatasourceCheck()` so it can run in an App Router Server Component. Wrap the component in its own module, and pass `page` when rendering it outside a `Placeholder`.
