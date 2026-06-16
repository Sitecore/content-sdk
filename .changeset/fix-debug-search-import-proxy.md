---
'@sitecore-content-sdk/nextjs': patch
---

Fix Turbopack build failure when compiling the edge proxy by importing search debug from `@sitecore-content-sdk/search` instead of `@sitecore-content-sdk/react/search`, which pulled client-only hooks into the server bundle.
