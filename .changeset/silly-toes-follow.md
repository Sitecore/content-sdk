---
'@sitecore-content-sdk/core': patch
---

Default GraphQLRequestClient to the global fetch API so graphql-request does not use cross-fetch/node-fetch, which triggers Node DEP0169 via url.parse().
