---
'@sitecore-content-sdk/content': patch
'@sitecore-content-sdk/nextjs': patch
---

Fix personalization resolution in Edit Mode and Preview Mode by sending the `sc_variant` header to the Preview GraphQL API so API resolves the active variant server-side, instead of relying on sdk `experiences` filtering.
