---
'@sitecore-content-sdk/react': patch
---

Read page mode from `props.page` in `withDatasourceCheck()` so it can run in an App Router Server Component. When `page` is not passed, the page mode is still read from `SitecoreProvider` context on the client, so existing usages keep their current behavior. Wrap the component in its own module, and pass `page` when rendering it in a Server Component outside a `Placeholder`.
