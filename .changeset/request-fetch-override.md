---
'@sitecore-content-sdk/core': patch
---

Fix custom `fetch` functions supplied through `FetchOptions` being ignored by `SitecoreClient.getData()` and `SitecoreClient.getPage()`. `GraphQLRequestClient` now honors the override for the individual request and its retries without changing the configured fetch used by other requests.