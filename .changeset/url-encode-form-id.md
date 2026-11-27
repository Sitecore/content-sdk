---
'@sitecore-content-sdk/content': patch
---

URL-encode the form ID in `getEdgeProxyFormsUrl` so a `FormId` containing `/`, `?` or `#` can no longer change the Edge Forms request path or query. Empty or dot-only form IDs (`.`, `..`) are rejected.
