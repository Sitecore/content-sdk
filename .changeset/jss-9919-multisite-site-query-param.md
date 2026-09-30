---
'@sitecore-content-sdk/nextjs': patch
---

`MultisiteProxy` no longer resolves the site from the unprefixed `site` query string parameter, so third-party requests containing `?site=...` no longer override the resolved site or overwrite the `sc_site` cookie.

If you need to force the site via query string, use the `sc_site` parameter (the supported one) instead of `site`. The App Router editing render route handler propagates `sc_site` to its internal page requests, so site resolution in editing is unaffected.
