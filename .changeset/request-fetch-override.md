---
'@sitecore-content-sdk/core': patch
---

Honor per-request `fetch` overrides in `GraphQLRequestClient`, including retries, without changing the configured fetch used by other requests.